import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const modeLabels = { online: "عبر الإنترنت", in_person: "حضوري", both: "عبر الإنترنت وحضوري" };

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

  const academicTitles = profile.academic_titles || [];
  const specialties = profile.specialties || [];
  const isPdf = (name) => (name || "").toLowerCase().endsWith(".pdf");

  const DocLink = ({ name, signed_url }) => (
    <div className="rounded-md border p-3">
      {isPdf(name) ? (
        <a href={signed_url} target="_blank" rel="noreferrer" className="text-sm text-primary underline">عرض {name}</a>
      ) : (
        <a href={signed_url} target="_blank" rel="noreferrer"><img src={signed_url} alt={name} className="h-40 w-full rounded-md border object-cover" /></a>
      )}
    </div>
  );

  return (
    <article className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-2 text-sm">
          <h3 className="font-heading text-lg font-semibold text-foreground">{profile.full_legal_name}</h3>
          <Field label="رقم الهوية (ت.ز)" value={profile.teudat_zehut} />
          <Field label="عنوان المهنة" value={profile.profession_title} />
          <Field label="رقم الرخصة" value={profile.license_number} />
          <Field label="تأكيد الرخصة" value={profile.license_confirmed ? "مؤكد" : "غير مؤكد"} />
          <Field label="الموقع" value={profile.location} />
          <Field label="سنوات الخبرة" value={profile.years_experience} />
          <Field label="نوع الجلسات" value={modeLabels[profile.appointment_mode] || profile.appointment_mode} />
          {profile.professional_associations && <Field label="الجمعيات المهنية" value={profile.professional_associations} />}
          {profile.phone && <Field label="الهاتف" value={profile.phone} />}
          {profile.email && <Field label="البريد" value={profile.email} />}
          {profile.accessibility && <Field label="إتاحة المكان" value={profile.accessibility} />}
          {profile.bio && <p className="pt-2 text-foreground">{profile.bio}</p>}
        </div>
        <div className="space-y-5">
          <div>
            <h4 className="mb-2 text-sm font-semibold text-foreground">الألقاب الأكاديمية وملفات الإثبات</h4>
            <div className="grid gap-3">
              {academicTitles.map((t, i) => (
                <div key={i} className="rounded-md border p-3">
                  <p className="mb-2 text-xs font-medium text-primary">{t.title}</p>
                  <DocLink name={t.document_name} signed_url={t.signed_url} />
                </div>
              ))}
              {!academicTitles.length && <p className="text-sm text-muted-foreground">لا توجد ألقاب أكاديمية.</p>}
            </div>
          </div>
          <div>
            <h4 className="mb-2 text-sm font-semibold text-foreground">مجالات التخصص وملفات الإثبات</h4>
            <div className="grid gap-3">
              {specialties.map((s, i) => (
                <div key={i} className="rounded-md border p-3">
                  <p className="mb-2 text-xs font-medium text-primary">{s.name}</p>
                  <div className="grid gap-2">
                    {s.documents.map((d, di) => <DocLink key={di} name={d.name} signed_url={d.signed_url} />)}
                  </div>
                </div>
              ))}
              {!specialties.length && <p className="text-sm text-muted-foreground">لا توجد مجالات تخصص.</p>}
            </div>
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