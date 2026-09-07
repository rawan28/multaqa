import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import { Label } from "@/components/ui/label";

export default function ProfessionalPhotoUpload({ value, onUpload }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const upload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true); setError("");
    try { const { file_url } = await base44.integrations.Core.UploadFile({ file }); onUpload(file_url); }
    catch { setError("تعذر رفع الصورة. حاول مرة أخرى."); }
    finally { setUploading(false); }
  };
  return <div><Label htmlFor="profile_image">الصورة المهنية <span className="text-muted-foreground">(اختيارية)</span></Label><div className="mt-2 flex items-center gap-4">{value && <Image src={value} alt="معاينة الصورة المهنية" className="h-16 w-16 overflow-hidden rounded-full" />}<input id="profile_image" type="file" accept="image/*" onChange={upload} disabled={uploading} className="block text-sm" /></div>{uploading && <p className="mt-2 text-sm text-muted-foreground">جارٍ رفع الصورة…</p>}{error && <p className="mt-2 text-sm text-destructive">{error}</p>}</div>;
}