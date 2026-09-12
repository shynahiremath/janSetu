import { useState } from "react";
import { api } from "../../lib/apiClient";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Camera } from "lucide-react";

export default function DiseaseDetection() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
  }

  async function handleUpload() {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const { data } = await api.post("/agriculture/disease-detection", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">📷 Crop Disease Detection</h1>
      <p className="text-gray-500 mb-6">Upload a leaf photo to check for common diseases.</p>

      <Card>
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-10 cursor-pointer hover:bg-gray-50">
          <Camera className="text-gray-400 mb-2" />
          <span className="text-sm text-gray-500">Tap to take or upload a photo</span>
          <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFile} />
        </label>

        {preview && (
          <div className="mt-4 flex items-center gap-4">
            <img src={preview} alt="preview" className="w-24 h-24 object-cover rounded-xl" />
            <Button onClick={handleUpload} disabled={loading}>
              {loading ? "Analyzing..." : "Analyze photo"}
            </Button>
          </div>
        )}

        {result && (
          <div className="mt-6 p-4 bg-agri-light rounded-xl">
            <p className="font-semibold text-agri">{result.className} ({Math.round(result.confidence * 100)}% confidence)</p>
            <p className="text-sm text-gray-600 mt-1">{result.disclaimer}</p>
          </div>
        )}
      </Card>
    </div>
  );
}