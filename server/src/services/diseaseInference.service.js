import axios from "axios";
import FormData from "form-data";

export async function detectDisease(fileBuffer, filename) {
  const form = new FormData();
  form.append("image", fileBuffer, filename);

  const { data } = await axios.post(
    `${process.env.DISEASE_SERVICE_URL}/predict`,
    form,
    { headers: form.getHeaders(), timeout: 15000 }
  );

  return data;
}