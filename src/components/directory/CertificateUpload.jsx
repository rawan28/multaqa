import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Label } from "@/components/ui/label";

export default function CertificateUpload({ files, onChange, required }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const upload = async (event) => {
    const selected = Array.from(event.target.files || []).slice(0, 5 - files.length);
    if (!selected.length) return;
    setUploading(true); setError("");
    try {
      const uploaded = await Promise.all(selected.map(async (file) => ({ file_url: (await base44.integrations.Core.UploadFile({ file })).file_url, file_name: file.name })));
      onChange([...files, ...uploaded]);
    } catch { setError("تعذر رفع الوثائق. حاول مرة أخرى."); }
    finally { setUploading(false); event.target.value = ""; }
  };
  return <div><Label htmlFor="certificates">وثائق الاعتماد {required && <span className="text-destructive">(مطلوبة)</span>}</Label><input id="certificates" type="file" accept="application/pdf,image/*" multiple onChange={upload} disabled={uploading || files.length >= 5} className="mt-2 block text-sm" />{uploading && <p className="mt-2 text-sm text-muted-foreground">جارٍ رفع الوثائق…</p>}{error && <p className="mt-2 text-sm text-destructive">{error}</p>}{files.length > 0 && <ul className="mt-2 space-y-1 text-sm text-muted-foreground">{files.map((file, index) => <li key={file.file_url} className="flex justify-between gap-3"><a className="truncate underline" href={file.file_url} target="_blank" rel="noreferrer">{file.file_name}</a><button type="button" className="text-destructive underline" onClick={() => onChange(files.filter((_, itemIndex) => itemIndex !== index))}>إزالة</button></li>)}</ul>}</div>;
}