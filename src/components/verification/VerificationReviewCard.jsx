import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function VerificationReviewCard({ verification, profile, onReviewed }) {
  const [certificates, setCertificates] = useState([]);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => { base44.entities.Certificate.filter({ verification_request_id: verification.id }).then(setCertificates); }, [verification.id]);
  const review = async (status) => { setSaving(true); await base44.functions.invoke("reviewVerificationRequest", { requestId: verification.id, status, adminNote: note }); setSaving(false); onReviewed(); };
  return <article className="rounded-lg border bg-card p-5 shadow-sm"><div className="flex flex-wrap items-start justify-between gap-2"><div><h2 className="font-heading text-lg font-semibold">{profile?.full_name || "ملف مهني"}</h2><p className="text-sm text-muted-foreground">{profile?.profession} · {profile?.license_number}</p></div><span className="rounded-full bg-secondary px-3 py-1 text-xs">قيد المراجعة</span></div><div className="mt-4"><p className="text-sm font-medium">الوثائق المرفقة</p>{certificates.length ? <ul className="mt-2 space-y-1 text-sm">{certificates.map((certificate) => <li key={certificate.id}><a className="text-primary underline" href={certificate.file_url} target="_blank" rel="noreferrer">{certificate.file_name}</a></li>)}</ul> : <p className="mt-1 text-sm text-destructive">لا توجد وثائق مرفقة.</p>}</div><Label htmlFor={`admin-note-${verification.id}`} className="mt-4 block">ملاحظة للممارس (تظهر عند الرفض)</Label><Textarea id={`admin-note-${verification.id}`} value={note} onChange={(event) => setNote(event.target.value)} placeholder="ملاحظة للممارس (تظهر عند الرفض)" className="mt-2" /><div className="mt-4 flex gap-3"><Button disabled={saving} onClick={() => review("approved")}>{saving ? "جارٍ الحفظ…" : "موافقة"}</Button><Button disabled={saving} variant="outline" onClick={() => review("rejected")}>رفض</Button></div></article>;
}