import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const professionLabels = { psychologist: "أخصائي نفسي", social_worker: "أخصائي اجتماعي", psychiatrist: "طبيب نفسي", clinical_criminologist: "أخصائي علم الجريمة السريري", art_therapist: "معالج بالفنون" };
const modeLabels = { online: "عبر الإنترنت", in_person: "حضوري", both: "عبر الإنترنت وحضوري" };
const subSpecialtyLabels = { none: "بدون", psychotherapy_training: "تدريب العلاج النفسي", cbt: "CBT", psychodrama: "سيكودراما", family_therapy: "علاج أسري", other_training: "تدريب آخر" };
const docTypeLabels = { license_card: "بطاقة الرخصة", diploma: "شهادة أكاديمية", equivalency_certificate: "شهادة معادلة", other: "أخرى" };

function Field({ label, value }) {
  return <p className="flex gap-2"><span className="shrink-0 text-muted-foreground">{label}: </span><span className="text-foreground">{value || "—"}</span></p>;
}

export default function PendingVerificationCard({ profile, onReviewed }) {
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState("");
  const [error, setError] = useState("");

  const review = async (status) => {
    setSaving(status);
    setError("");
    try {
      await base44.functions.invoke("reviewVerificationRequest", { profileId: profile.id, status, rejectionReason: reason });
      setReason("");
      onReviewed();
    } catch {
      setError("تعذر تحديث حالة التحقق.");
    } finally {
      setSaving("");
    }
  };

  const docs = profile.documents || [];
  const isPdf = (name) => (name || "").toLowerCase().endsWith(".pdf");

  return (
    <article className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-2 text-sm">
          <h3 className="font-heading text-lg font-semibold text-foreground">{profile.full_legal_name}</h3>
          <Field label="رقم الهوية (ت.ز)" value={profile.teudat_zehut} />
          <Field label="المهنة" value={professionLabels[profile.profession] || profile.profession} />
          <Field label="رقم الرخصة" value={profile.license_number} />
          {profile.sub_specialty && profile.sub_specialty !== "none" && <Field label="التخصص الفرعي" value={`${subSpecialtyLabels[profile.sub_specialty] || profile.sub_specialty} (رخصة أساسية: ${profile.base_license_number})`} />}
          <Field label="الموقع" value={profile.location} />
          <Field label="سنوات الخبرة" value={profile.years_experience} />
          <Field label="نوع الجلسات" value={modeLabels[profile.appointment_mode] || profile.appointment_mode} />
          <Field label="مجال الممارسة" value={profile.specialty} />
          {profile.phone && <Field label="الهاتف" value={profile.phone} />}
          {profile.email && <Field label="البريد" value={profile.email} />}
          {profile.accessibility && <Field label="إتاحة المكان" value={profile.accessibility} />}
          {profile.bio && <p className="pt-2 text-foreground">{profile.bio}</p>}
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-foreground">الوثائق المرفقة (آمنة)</h4>
          <div className="grid gap-3">
            {docs.map((doc, i) => (
              <div key={i} className="rounded-md border p-3">
                <p className="mb-2 text-xs font-medium text-primary">{docTypeLabels[doc.type] || doc.type}</p>
                {isPdf(doc.name) ? (
                  <a href={doc.signed_url} target="_blank" rel="noreferrer" className="text-sm text-primary underline">عرض {doc.name}</a>
                ) : (
                  <a href={doc.signed_url} target="_blank" rel="noreferrer"><img src={doc.signed_url} alt={doc.name} className="h-40 w-full rounded-md border object-cover" /></a>
                )}
              </div>
            ))}
            {!docs.length && <p className="text-sm text-muted-foreground">لا توجد وثائق مرفقة.</p>}
          </div>
        </div>
      </div>
      <div className="mt-5 border-t pt-4">
        <Label htmlFor={`reason-${profile.id}`}>سبب الرفض (اختياري عند الرفض)</Label>
        <Textarea id={`reason-${profile.id}`} value={reason} onChange={(e) => setReason(e.target.value)} className="mt-2 min-h-20" />
        {error && <p className="mt-2 text-sm text-destructive" role="alert">{error}</p>}
        <div className="mt-3 flex flex-wrap gap-3">
          <Button type="button" onClick={() => review("verified")} disabled={!!saving}>{saving === "verified" ? "جارٍ…" : "تحقق وموافقة"}</Button>
          <Button type="button" variant="destructive" onClick={() => review("rejected")} disabled={!!saving}>{saving === "rejected" ? "جارٍ…" : "رفض"}</Button>
        </div>
      </div>
    </article>
  );
}