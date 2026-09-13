import { MapPin, Monitor, BriefcaseBusiness, Phone, Mail } from "lucide-react";
import ContactPractitioner from "@/components/directory/ContactPractitioner";
import { Image } from "@/components/ui/image";

const modeLabels = { online: "عبر الإنترنت", in_person: "حضوري", both: "عبر الإنترنت وحضوري" };
const specialtyLabels = { psychotherapy: "العلاج النفسي", clinical_psychology: "علم النفس السريري", nlp: "البرمجة اللغوية العصبية", family_therapy: "العلاج الأسري", couples_therapy: "العلاج الزوجي", child_therapy: "علاج الأطفال واليافعين", other: "مجال آخر" };
const workDayLabels = { sunday: "الأحد", monday: "الاثنين", tuesday: "الثلاثاء", wednesday: "الأربعاء", thursday: "الخميس", friday: "الجمعة", saturday: "السبت" };
const professionLabels = { psychologist: "علم نفس", social_worker: "خدمة اجتماعية", psychiatrist: "طب نفسي", clinical_criminologist: "علم الجريمة السريري", art_therapist: "العلاج بالفن" };
const subSpecialtyLabels = { none: "", psychotherapy_training: "تدريب على العلاج النفسي", cbt: "العلاج المعرفي السلوكي", psychodrama: "السيكودراما", family_therapy: "العلاج الأسري", other_training: "تدريب آخر" };
const genderLabels = { male: "رجل", female: "امرأة", other: "آخر" };

export default function ProfessionalCard({ professional }) {
  return (
    <article className="rounded-lg border bg-card p-6 shadow-sm">
      {professional.profile_image_url ? <Image src={professional.profile_image_url} alt={`صورة ${professional.full_name}`} className="mb-5 h-16 w-16 overflow-hidden rounded-full" /> : <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-secondary font-heading text-lg font-semibold text-secondary-foreground">{professional.full_name?.slice(0, 1).toUpperCase()}</div>}
      <h3 className="font-heading text-xl font-semibold text-foreground">{professional.full_name}</h3>
      {professional.gender && genderLabels[professional.gender] && <p className="mt-1 text-xs text-muted-foreground">{genderLabels[professional.gender]}</p>}
      {professional.profession_title && <p className="mt-1 text-sm font-medium text-foreground"><span className="text-muted-foreground">عنوان المهنة: </span>{professional.profession_title}</p>}
      {professional.specialties?.length > 0 && <p className="mt-1 text-sm font-medium text-primary">{professional.specialties.map((s) => s.name).join("، ")}</p>}
      <div className="mt-3 flex flex-wrap gap-2">
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${professional.accepting_new_patients === false ? "bg-secondary text-secondary-foreground" : "bg-primary/10 text-primary"}`}>{professional.accepting_new_patients === false ? "لا أستقبل متوجهين جدد" : "أستقبل متوجهين جدد"}</span>
        {professional.offers_mentorship === true && <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">أقدّم إشرافًا مهنيًا</span>}
      </div>
      <div className="mt-4 space-y-2 text-sm text-muted-foreground">
        <p className="flex items-center gap-2"><MapPin className="h-4 w-4" aria-hidden="true" />{professional.location}</p>
        {professional.accessibility && <p><span className="font-medium text-foreground">إتاحة المكان: </span>{professional.accessibility}</p>}
        {professional.directions && <p><span className="font-medium text-foreground">الوصول: </span>{professional.directions}</p>}
        <p className="flex items-center gap-2"><BriefcaseBusiness className="h-4 w-4" aria-hidden="true" />{professional.years_experience} سنوات من الخبرة</p>
        <p className="flex items-center gap-2"><Monitor className="h-4 w-4" aria-hidden="true" />{modeLabels[professional.appointment_mode]}</p>
        {professional.work_days?.length > 0 && <p><span className="font-medium text-foreground">أيام العمل: </span>{professional.work_days.map((day) => workDayLabels[day]).join("، ")}</p>}
        {professional.website && <a href={professional.website} target="_blank" rel="noreferrer" className="font-medium text-primary underline">الموقع الإلكتروني لـ{professional.full_name}</a>}
        {professional.phone && <p className="flex items-center gap-2"><Phone className="h-4 w-4" aria-hidden="true" />{professional.phone}</p>}
        {professional.email && <p className="flex items-center gap-2 break-all"><Mail className="h-4 w-4 shrink-0" aria-hidden="true" />{professional.email}</p>}
      </div>
      {professional.bio && <p className="mt-5 line-clamp-4 text-sm leading-6 text-foreground">{professional.bio}</p>}
      {professional.email && <ContactPractitioner professionalId={professional.id} />}
      <p className="mt-5 border-t pt-4 text-xs text-muted-foreground">رقم الترخيص: {professional.license_number}</p>
    </article>
  );
}