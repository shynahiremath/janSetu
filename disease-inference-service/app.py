from flask import Flask, request, jsonify
from PIL import Image
import numpy as np
import io
import os

app = Flask(__name__)

MODEL_PATH = os.path.join(os.path.dirname(__file__), "model", "model.h5")
CLASS_NAMES = [
    "Healthy", "Early_Blight", "Late_Blight", "Leaf_Mold", "Bacterial_Spot",
]

model = None

def load_model():
    global model
    if model is None:
        import tensorflow as tf
        model = tf.keras.models.load_model(MODEL_PATH)
    return model

def preprocess(image_bytes, target_size=(224, 224)):
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize(target_size)
    arr = np.array(img) / 255.0
    return np.expand_dims(arr, axis=0)

@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    image_file = request.files["image"]
    image_bytes = image_file.read()

    try:
        m = load_model()
        x = preprocess(image_bytes)
        preds = m.predict(x)[0]
        top_idx = int(np.argmax(preds))
        confidence = float(preds[top_idx])

        return jsonify({
            "className": CLASS_NAMES[top_idx] if top_idx < len(CLASS_NAMES) else f"class_{top_idx}",
            "confidence": round(confidence, 3),
            "advice": "Prototype-grade model output. Confirm with a local agriculture officer before acting."
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/health-check", methods=["GET"])
def health_check():
    return jsonify({"ok": True, "service": "disease-inference"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=6000)