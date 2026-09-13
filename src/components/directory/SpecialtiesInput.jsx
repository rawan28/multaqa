import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { Plus } from "lucide-react";

const MAX_SIZE = 10 * 1024 * 1024;
const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];

export default function SpecialtiesInput({ value, onChange }) {
  const [uploadingIndex, setUploadingIndex] = useState(null);
  const [error, setError] = useState("");

  const update = (index, field, val) => onChange(value.map((s, i) => (i === index ? { ...s, [field]: val } : s)));
  const addRow = () => onChange([...value, { name: "", documents: [] }]);
  const removeRow = (index) => onChange(value.filter((_, i) => i !== index));

  const upload = async (index, event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    setError("");
    for (const file of files) {
      if (!allowedTypes.includes(file.type)) { setError("الصيغ المسموح بها: PDF، JPEG، PNG فقط."); event.target.value = ""; return; }
      if (file.size > MAX_SIZE) { setError("الحد الأقصى لحجم كل ملف 10 ميغابايت."); event.target.value = ""; return; }
    }
    setUploadingIndex(index);
    try {
      const uploaded = await Promise.all(files.map(async (file) => {
        const { file_uri } = await base44.integrations.Core.UploadPrivateFile({ file });
        return { uri: file_uri, name: file.name };
      }));
      update(index, "documents", [...value[index].documents, ...uploaded]);
    } catch {
      setError("تعذر رفع الملفات بشكل آمن. حاول مرة أخرى.");
    } finally {
      setUploadingIndex(null);
      event.target.value = "";
    }
  };

  const removeDoc = (index, docIndex) => update(index, "documents", value[index].documents.filter((_, i) => i !== docIndex));

  return (
    <div className="space-y-4">
      {value.map((spec, index) => (
        <div key={index} className="rounded-md border bg-secondary/40 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">مجال تخصص {index + 1}</p>
            {value.length > 1 && <button type="button" onClick={() => removeRow(index)} className="text-sm text-destructive underline">إزالة</button>}
          </div>
          <Input className="mt-2" placeholder="مثال: أخصائي نفسي تربوي / معالج CBT" value={spec.name} onChange={(e) => update(index, "name", e.target.value)} required />
          <div className="mt-3">
            <Label className="text-xs text-muted-foreground">ملفات إثبات (شهادات) — إجباري</Label>
            <input type="file" accept="application/pdf,image/jpeg,image/png" multiple onChange={(e) => upload(index, e)} disabled={uploadingIndex === index} className="mt-1 block text-sm" />
            {uploadingIndex === index && <p className="mt-1 text-xs text-muted-foreground">جارٍ الرفع بشكل آمن…</p>}
            {spec.documents.length > 0 && (
              <ul className="mt-2 space-y-1">
                {spec.documents.map((d, di) => (
                  <li key={d.uri + di} className="flex items-center justify-between gap-2 text-xs">
                    <span className="truncate text-foreground">{d.name}</span>
                    <button type="button" onClick={() => removeDoc(index, di)} className="shrink-0 text-destructive underline">إزالة</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}
      {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
      <Button type="button" variant="outline" onClick={addRow} className="w-full"><Plus className="h-4 w-4" />إضافة مجال تخصص آخر</Button>
    </div>
  );
}