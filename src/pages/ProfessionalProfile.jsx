import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import ContactPractitioner from "@/components/directory/ContactPractitioner";
import ShareButtons from "@/components/ShareButtons";
import BrandLogo from "@/components/BrandLogo";
import SiteFooter from "@/components/SiteFooter";
import { MapPin, Monitor, BriefcaseBusiness, Phone, Mail, Globe, ArrowRight } from "lucide-react";

const modeLabels = { online: "عبر الإنترنت", in_person: "حضوري", both: "عبر الإنترنت وحضوري" };
const workDayLabels = { sunday: "الأحد", monday: "الاثنين", tuesday: "الثلاثاء", wednesday: "الأربعاء", thursday: "الخميس", friday: "الجمعة", saturday: "السبت" };
const genderLabels = { male: "رجل", female: "امرأة", other: "آخر" };

export default function ProfessionalProfile() {
  const { id } = useParams();
  const [professional, setProfessional] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await base44.entities.ProfessionalProfile.get(id);
        setProfessional(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return <main dir="rtl" className="flex min-h-screen items-center justify-center bg-background"><p className="text-muted-foreground">جارٍ التحميل…</p></main>;
  }
  if (error || !professional) {
    return <main dir="rtl" className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background"><p className="text-muted-foreground">لم يتم العثور على الملف.</p><Link to="/" className="text-primary underline">العودة إلى الدليل</Link></main>;
  }

  return (
    <main dir="rtl" className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-5 py-5">
          <BrandLogo className="h-20 w-20" />
          <Link to="/" className="mr-auto flex items-center gap-1 text-sm font-medium text-primary underline"><ArrowRight className="h-4 w-4" />العودة إلى الدليل</Link>
        </div>
      </header>
      <article className="mx-auto max-w-4xl px-5 py-10">
        <div className="rounded-lg border bg-card p-8 shadow-sm">
          <div className="flex flex-col items-start gap-5 sm:flex-row">
            {professional.profile_image_url ? <Image src={professional.profile_image_url} alt={professional.full_name} className="h-24 w-24 overflow-hidden rounded-full" /> : <div className="flex h-24 w-24 items-center justify-center rounded-full bg-secondary font-heading text-2xl font-semibold text-secondary-foreground">{professional.full_name?.slice(0, 1).toUpperCase()}</div>}
            <div>
              <h1 className="font-heading text-3xl font-semibold text-foreground">{professional.full_name}</h1>
              {professional.gender && genderLabels[professional.gender] && <p className="mt-1 text-sm text-muted-foreground">{genderLabels[professional.gender]}</p>}
              {professional.profession_title && <p className="mt-1 text-base font-medium text-foreground">{professional.profession_title}</p>}
              {professional.specialties?.length > 0 && <p className="mt-1 text-sm text-primary">{professional.specialties.map((s) => s.name).join("، ")}</p>}
              <div className="mt-3 flex flex-wrap gap-2">
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${professional.accepting_new_patients === false ? "bg-secondary text-secondary-foreground" : "bg-primary/10 text-primary"}`}>{professional.accepting_new_patients === false ? "لا أستقبل متوجهين جدد" : "أستقبل متوجهين جدد"}</span>
                {professional.offers_mentorship === true && <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">أقدّم إشرافًا مهنيًا</span>}
              </div>
            </div>
          </div>

          <div className="mt-6 border-t pt-5"><ShareButtons title={`ملف ${professional.full_name} على مُلتقى`} /></div>

          {professional.bio && <p className="mt-6 text-sm leading-7 text-foreground">{professional.bio}</p>}

          <div className="mt-6 space-y-3 text-sm text-muted-foreground">
            <p className="flex items-center gap-2"><MapPin className="h-4 w-4" aria-hidden="true" />{professional.location}</p>
            <p className="flex items-center gap-2"><BriefcaseBusiness className="h-4 w-4" aria-hidden="true" />{professional.years_experience} سنوات من الخبرة</p>
            <p className="flex items-center gap-2"><Monitor className="h-4 w-4" aria-hidden="true" />{modeLabels[professional.appointment_mode]}</p>
            {professional.session_fee != null && <p><span className="font-medium text-foreground">رسوم الجلسة: </span>{professional.session_fee} شيكل</p>}
            {professional.work_hours?.length > 0 ? (
              <div>
                <p className="font-medium text-foreground">ساعات العمل:</p>
                <ul className="mt-1 space-y-0.5">
                  {professional.work_hours.map((h, i) => (
                    <li key={i}>{workDayLabels[h.day]}: {h.start} - {h.end}</li>
                  ))}
                </ul>
              </div>
            ) : professional.work_days?.length > 0 ? (
              <p><span className="font-medium text-foreground">أيام العمل: </span>{professional.work_days.map((day) => workDayLabels[day]).join("، ")}</p>
            ) : null}
            {professional.min_age != null && professional.max_age != null && <p><span className="font-medium text-foreground">الفئة العمرية: </span>من {professional.min_age} إلى {professional.max_age} سنة</p>}
            {professional.accessibility && <p><span className="font-medium text-foreground">إتاحة المكان: </span>{professional.accessibility}</p>}
            {professional.directions && <p><span className="font-medium text-foreground">الوصول: </span>{professional.directions}</p>}
            {professional.website && <p className="flex items-center gap-2"><Globe className="h-4 w-4" aria-hidden="true" /><a href={professional.website} target="_blank" rel="noreferrer" className="font-medium text-primary underline">الموقع الإلكتروني</a></p>}
            {professional.phone && <p className="flex items-center gap-2"><Phone className="h-4 w-4" aria-hidden="true" />{professional.phone}</p>}
            {professional.email && <p className="flex items-center gap-2 break-all"><Mail className="h-4 w-4 shrink-0" aria-hidden="true" />{professional.email}</p>}
          </div>

          {professional.academic_titles?.length > 0 && (
            <div className="mt-6">
              <h2 className="font-heading text-lg font-semibold text-foreground">الألقاب الأكاديمية</h2>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                {professional.academic_titles.map((t, i) => <li key={i}>{t.title}</li>)}
              </ul>
            </div>
          )}

          {professional.professional_associations && (
            <div className="mt-6">
              <h2 className="font-heading text-lg font-semibold text-foreground">العضويات المهنية</h2>
              <p className="mt-2 text-sm text-muted-foreground">{professional.professional_associations}</p>
            </div>
          )}

          {professional.email && <div className="mt-6"><ContactPractitioner professionalId={professional.id} /></div>}
          <p className="mt-6 border-t pt-4 text-xs text-muted-foreground">رقم الترخيص: {professional.license_number}</p>
        </div>
      </article>
      <SiteFooter />
    </main>
  );
}