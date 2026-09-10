import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Label } from "@/components/ui/label";

const docTypeOptions = [
  { value: "license_card", label: "بطاقة الرخصة" },
  { value: "diploma", label: "شهادة أكاديمية" },
  { value: "equivalency_certificate", label: "شهادة معادلة (للمتعلمين في الخارج)" },
  { value: "other", label: "وثيقة أخرى" },
];
const docTypeLabels = Object.fromEntries(docTypeOptions.map((o) => [o.value, o.label]));
const MAX_SIZE = 10 * 1024 * 1024;
const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];

export default function SecureDocumentUpload({ documents, onChange }) {
  const [docType, setDocType] = useState("license_card");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const upload = async (event) => {
    const selected = Array.from(event.target.files || []).slice(0, 10 - documents.length);
    if (!selected.length) return;
    setError("");
    for (const file of selected) {
      if (!allowedTypes.includes(file.type)) { setError("الصيغ المسموح بها: PDF، JPEG، PNG فقط."); event.target.value = ""; return; }
      if (file.size > MAX_SIZE) { setError("الحد الأقصى لحجم كل ملف 10 ميغابايت."); event.target.value = ""; return; }
    }
    setUploading(true);
    try {
      const uploaded = await Promise.all(selected.map(async (file) => {
        const { file_uri } = await base44.integrations.Core.UploadPrivateFile({ file });
        return { uri: file_uri, name: file.name, type: docType };
      }));
      onChange([...documents, ...uploaded]);
    } catch {
      setError("تعذر رفع الوثائق بشكل آمن. حاول مرة أخرى.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div>
      <Label htmlFor="doc-type">نوع الوثيقة</Label>
      <select id="doc-type" value={docType} onChange={(e) => setDocType(e.target.value)} className="mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm">
        {docTypeOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <input id="documents" type="file" accept="application/pdf,image/jpeg,image/png" multiple onChange={upload} disabled={uploading || documents.length >= 10} className="mt-3 block text-sm" />
      <p className="mt-1 text-xs text-muted-foreground">يُرفع الملف إلى تخزين آمن خاص. PDF أو JPEG، حتى 10 ميغابايت لكل ملف.</p>
      {uploading && <p className="mt-2 text-sm text-muted-foreground">جارٍ رفع الوثائق بشكل آمن…</p>}
      {error && <p className="mt-2 text-sm text-destructive" role="alert">{error}</p>}
      {documents.length > 0 && (
        <ul className="mt-3 space-y-2 text-sm">
          {documents.map((doc, index) => (
            <li key={doc.uri + index} className="flex items-center justify-between gap-3 rounded-md border bg-secondary px-3 py-2">
              <span className="truncate"><span className="ml-2 rounded bg-primary/10 px-2 py-0.5 text-xs text-primary">{docTypeLabels[doc.type] || doc.type}</span>{doc.name}</span>
              <button type="button" className="shrink-0 text-destructive underline" onClick={() => onChange(documents.filter((_, i) => i !== index))}>إزالة</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}