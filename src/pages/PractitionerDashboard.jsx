import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HeartHandshake, UserRound } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import SiteFooter from "@/components/SiteFooter";
import DeletionRequestForm from "@/components/account/DeletionRequestForm";

export default function PractitionerDashboard() {
  const { isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);

  const loadProfile = async () => {
    setLoading(true);
    const list = await base44.entities.ProfessionalProfile.filter({ provider_user_id: (await base44.auth.me()).id }, "-created_date", 1);
    setProfile(list[0] || null);
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) loadProfile();
    else setLoading(false);
  }, [isAuthenticated]);

  const toggle = async (field) => {
    if (!profile) return;
    setSaving(field);
    const next = !profile[field];
    setProfile({ ...profile, [field]: next });
    try {
      await base44.entities.ProfessionalProfile.update(profile.id, { [field]: next });
    } catch {
      setProfile({ ...profile, [field]: !next });
    } finally {
      setSaving(null);
    }
  };

  return (
    <main id="main-content" dir="rtl" className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-5">
          <Link to="/" className="flex items-center gap-2 font-heading text-xl font-semibold"><HeartHandshake className="h-6 w-6" />مُلتقى</Link>
          <Link to="/" className="text-sm font-medium text-primary underline">العودة إلى الدليل</Link>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-5 py-12">
        <p className="text-sm font-medium text-primary">لوحة الممارس</p>
        <h1 className="mt-2 font-heading text-4xl font-semibold text-foreground">إعدادات التوفر</h1>
        <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">تحكّم في الخدمات المتاحة لك حاليًا. تظهر هذه الإعدادات للزوار في بطاقتك المهنية.</p>

        {!isAuthenticated ? (
          <div className="mt-8 rounded-lg border bg-card p-6 shadow-sm">
            <p className="leading-7 text-muted-foreground">سجّل الدخول لإدارة إعدادات التوفر.</p>
            <Link to="/login" className="mt-5 flex h-11 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">دخول الممارسين</Link>
          </div>
        ) : loading ? (
          <p className="mt-8 text-muted-foreground">جارٍ تحميل ملفك…</p>
        ) : !profile ? (
          <div className="mt-8 rounded-lg border bg-card p-6 shadow-sm">
            <p className="leading-7 text-muted-foreground">ليس لديك ملف مهني بعد. أنشئ ملفك للانضمام إلى الدليل.</p>
            <Link to="/join" className="mt-5 flex h-11 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">انضم إلى الدليل</Link>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between rounded-lg border bg-card p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <UserRound className="mt-1 h-5 w-5 text-primary" aria-hidden="true" />
                <div>
                  <Label htmlFor="accepting_new_patients" className="text-base font-semibold text-foreground">بإمكاني استقبال متوجهين جدد</Label>
                  <p className="mt-1 text-sm text-muted-foreground">عند التفعيل يظهر في بطاقتك أنك تستقبل عملاء جدد.</p>
                </div>
              </div>
              <Switch id="accepting_new_patients" checked={profile.accepting_new_patients !== false} onCheckedChange={() => toggle("accepting_new_patients")} disabled={saving === "accepting_new_patients"} aria-label="بإمكاني استقبال متوجهين جدد" />
            </div>

            <div className="flex items-center justify-between rounded-lg border bg-card p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <UserRound className="mt-1 h-5 w-5 text-primary" aria-hidden="true" />
                <div>
                  <Label htmlFor="offers_mentorship" className="text-base font-semibold text-foreground">أقدّم إشرافًا مهنيًا للممارسين</Label>
                  <p className="mt-1 text-sm text-muted-foreground">عند التفعيل يظهر في بطاقتك أنك تقدّم إرشادًا وإشرافًا للممارسين.</p>
                </div>
              </div>
              <Switch id="offers_mentorship" checked={profile.offers_mentorship === true} onCheckedChange={() => toggle("offers_mentorship")} disabled={saving === "offers_mentorship"} aria-label="أقدّم إشرافًا مهنيًا للممارسين" />
            </div>

            {profile.verification_status === "pending_verification" && <p className="rounded-md bg-secondary p-4 text-sm text-secondary-foreground">ملفك قيد المراجعة. لن يظهر في الدليل حتى يتم التحقق منه من قبل الإدارة.</p>}{profile.verification_status === "rejected" && <p className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">تم رفض ملفك. السبب: {profile.rejection_reason || "يرجى تحديث الوثائق وإعادة الإرسال."}</p>}{profile.verification_status === "verified" && <p className="rounded-md bg-primary/10 p-4 text-sm text-primary">تم التحقق من ملفك وهو ظاهر في الدليل.</p>}
          </div>
        )}
        {isAuthenticated && (
          <div className="mt-10">
            <DeletionRequestForm />
          </div>
        )}
      </section>
      <SiteFooter />
    </main>
  );
}