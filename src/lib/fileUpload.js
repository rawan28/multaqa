const MAX_SIZE = 10 * 1024 * 1024;
const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
const allowedExtensions = [".pdf", ".jpg", ".jpeg", ".png"];

export function validateFile(file) {
  const ext = "." + ((file.name.split(".").pop() || "").toLowerCase());
  const typeOk = file.type && allowedTypes.includes(file.type);
  const extOk = allowedExtensions.includes(ext);
  if (!typeOk && !extOk) return "الصيغ المسموح بها: PDF، JPEG، PNG فقط.";
  if (file.size > MAX_SIZE) return "الحد الأقصى لحجم الملف 10 ميغابايت.";
  return "";
}