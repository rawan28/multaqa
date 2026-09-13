import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { Plus } from "lucide-react";

const MAX_SIZE = 10 * 1024 * 1024;
const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
const ordinalLabel = ["اللقب الأكاديمي الأول (إجباري)", "اللقب الأكاديمي الثاني (اختياري)", "اللقب الأكاديمي الثالث (اختياري)"];

export default function AcademicTitlesInput({ value, onChange }) {
  const [uploadingIndex, setUploadingIndex] = useState(null);
  const [error, setError] = useState("");

  const update = (index, field, val) => onChange(value.map((t, i) => (i === index ? { ...t, [field]: val } : t)));
  const addRow = () => onChange([...value, { title: "", document_uri: "", document_name: "" }]);
  const removeRow = (index) => onChange(value.filter((_, i) => i !== index));

  const upload = async (index, event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setError("");
    if (!allowedTypes.includes(file.type)) { setError("الصيغ المسموح بها: PDF، JPEG، PNG فقط."); event.target.value = ""; return; }
    if (file.size > MAX_SIZE) { setError("الحد الأقصى لحجم الملف 10 ميغابايت."); event.target.value = ""; return; }
    setUploadingIndex(index);
    try {
      const { file_uri } = await base44.integrations.Core.UploadPrivateFile({ file });
      update(index, "document_uri", file_uri);
      update(index, "document_name", file.name);
    } catch {
      setError("تعذر رفع الملف بشكل آمن. حاول مرة أخرى.");
    } finally {
      setUploadingIndex(null);
      event.target.value = "";
    }
  };

  return (
    <div className="space-y-4">
      {value.map((title, index) => (
        <div key={index} className="rounded-md border bg-secondary/40 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">{ordinalLabel[index] || `اللقب الأكاديمي ${index + 1}`}</p>
            {value.length > 1 && <button type="button" onClick={() => removeRow(index)} className="text-sm text-destructive underline">إزالة</button>}
          </div>
          <Input className="mt-2" placeholder="مثال: بكالوريوس في علم النفس" value={title.title} onChange={(e) => update(index, "title", e.target.value)} required={index === 0} />
          <div className="mt-3">
            <Label className="text-xs text-muted-foreground">ملف إثبات (شهادة) — إجباري</Label>
            <input type="file" accept="application/pdf,image/jpeg,image/png" onChange={(e) => upload(index, e)} disabled={uploadingIndex === index} className="mt-1 block text-sm" />
            {uploadingIndex === index && <p className="mt-1 text-xs text-muted-foreground">جارٍ الرفع بشكل آمن…</p>}
            {title.document_uri && <p className="mt-1 truncate text-xs text-primary">تم الرفع: {title.document_name}</p>}
          </div>
        </div>
      ))}
      {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
      {value.length < 3 && <Button type="button" variant="outline" onClick={addRow} className="w-full"><Plus className="h-4 w-4" />إضافة لقب أكاديمي آخر</Button>}
    </div>
  );
}