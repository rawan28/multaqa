import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ProfessionalPhotoUpload from "@/components/directory/ProfessionalPhotoUpload";
import AcademicTitlesInput from "@/components/directory/AcademicTitlesInput";
import SpecialtiesInput from "@/components/directory/SpecialtiesInput";
import { isValidTeudatZehut } from "@/lib/teudatZehut";

const genderOptions = [
  { value: "male", label: "رجل" },
  { value: "female", label: "امرأة" },
  { value: "other", label: "آخر" }];

const workDays = [["sunday", "الأحد"], ["monday", "الاثنين"], ["tuesday", "الثلاثاء"], ["wednesday", "الأربعاء"], ["thursday", "الخميس"], ["friday", "الجمعة"], ["saturday", "السبت"]];
const accessibilityOptions = ["مدخل بدون درج", "يوجد إمكانية لكرسي عجلات", "درج", "يوجد مصعد", "موقف سيارات قريب", "دورة مياه ميسة"];

const initialValues = {
  full_legal_name: "", teudat_zehut: "", gender: "",
  profession_title: "",
  license_confirmed: false, license_number: "",
  is_association_member: false, professional_associations: "",
  location: "", years_experience: "", appointment_mode: "both",
  work_days: [], min_age: "", max_age: "", session_fee: "", accepting_new_patients: true,
  profile_image_url: "", website: "", accessibility: "", accessibility_notes: "", directions: "",
  phone: "", email: "", bio: "",
};

export default function ProfessionalForm({ onSubmit }) {
  const [values, setValues] = useState(initialValues);
  const [academicTitles, setAcademicTitles] = useState([{ title: "", document_uri: "", document_name: "" }, { title: "", document_uri: "", document_name: "" }]);
  const [specialties, setSpecialties] = useState([{ name: "", documents: [] }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const update = (event) => setValues({ ...values, [event.target.name]: event.target.value });
  const toggleDay = (day) => setValues({ ...values, work_days: values.work_days.includes(day) ? values.work_days.filter((item) => item !== day) : [...values.work_days, day] });
  const toggleAccessibility = (option) => {
    const current = values.accessibility ? values.accessibility.split("، ").filter(Boolean) : [];
    const next = current.includes(option) ? current.filter((o) => o !== option) : [...current, option];
    setValues({ ...values, accessibility: next.join("، ") });
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (!isValidTeudatZehut(values.teudat_zehut)) { setError("رقم الهوية الإسرائيلية (ت.ز) غير صالح. يُرجى التحقق من الرقم."); return; }
    const filledTitles = academicTitles.filter((t) => t.title.trim() || t.document_uri);
    if (filledTitles.length < 2) { setError("يرجى إدخال اللقبين الأكاديميين الأول والثاني مع ملف إثبات لكل منهما."); return; }
    for (const t of filledTitles) {
      if (!t.title.trim() || !t.document_uri) { setError("كل لقب أكاديمي يتطلب اسمًا وملف إثبات."); return; }
    }
    if (!values.profession_title.trim()) { setError("يرجى إدخال عنوان المهنة."); return; }
    const filledSpecialties = specialties.filter((s) => s.name.trim() || s.documents.length);
    if (!filledSpecialties.length) { setError("يرجى إضافة مجال تخصص واحد على الأقل مع ملف إثبات."); return; }
    for (const s of filledSpecialties) {
      if (!s.name.trim() || !s.documents.length) { setError("كل مجال تخصص يتطلب اسمًا وملف إثبات واحد على الأقل."); return; }
    }
    if (!values.license_confirmed) { setError("يرجى تأكيد وجود رخصة مهنية سارية."); return; }
    if (!values.license_number.trim()) { setError("يرجى إدخال رقم الرخصة المهنية."); return; }
    if (values.is_association_member && !values.professional_associations.trim()) { setError("يرجى ذكر اسم الجمعية/الجمعيات التي أنت عضو فيها."); return; }
    setSaving(true);
    try {
      const { accessibility_notes, ...rest } = values;
      const result = await onSubmit({
        profile: {
          ...rest,
          accessibility: [values.accessibility, accessibility_notes].filter(Boolean).join("، "),
          years_experience: Number(values.years_experience),
          min_age: values.min_age === "" ? null : Number(values.min_age),
          max_age: values.max_age === "" ? null : Number(values.max_age),
          session_fee: values.session_fee === "" ? null : Number(values.session_fee),
          academic_titles: filledTitles.map((t) => ({ title: t.title.trim(), document_uri: t.document_uri, document_name: t.document_name })),
          specialties: filledSpecialties.map((s) => ({ name: s.name.trim(), documents: s.documents.map((d) => ({ uri: d.uri, name: d.name })) })),
          professional_associations: values.is_association_member ? values.professional_associations.trim() : "",
        },
      });
      setMessage(result.status === "approved" ? "تم تفعيل ملفك المهني." : "تم إرسال ملفك للتحقق والمراجعة. لن يظهر في الدليل حتى تتم الموافقة عليه.");
      setValues(initialValues);
      setAcademicTitles([{ title: "", document_uri: "", document_name: "" }, { title: "", document_uri: "", document_name: "" }]);
      setSpecialties([{ name: "", documents: [] }]);
    } catch {
      setError("تعذر إرسال الطلب. حاول مرة أخرى.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-5">
      <ProfessionalPhotoUpload value={values.profile_image_url} onUpload={(profile_image_url) => setValues({ ...values, profile_image_url })} />
      <div><Label htmlFor="full_legal_name">الاسم القانوني الكامل</Label><Input id="full_legal_name" name="full_legal_name" value={values.full_legal_name} onChange={update} required /></div>
      <div><Label htmlFor="gender">النوع الاجتماعي</Label>
        <select id="gender" name="gender" value={values.gender} onChange={update} className="mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm">
          <option value="" disabled>يرجى الاختيار</option>
          {genderOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
      <div className="grid gap-5 sm:grid-cols-2"><div><Label htmlFor="phone">رقم الهاتف</Label><Input id="phone" name="phone" type="tel" value={values.phone} onChange={update} required /></div><div><Label htmlFor="email">البريد الإلكتروني</Label><Input id="email" name="email" type="email" value={values.email} onChange={update} required /></div></div>
      <div><Label htmlFor="teudat_zehut">رقم الهوية</Label><Input id="teudat_zehut" name="teudat_zehut" value={values.teudat_zehut} onChange={update} inputMode="numeric" pattern="\d{5,9}" required /></div>
      <div><Label htmlFor="years_experience">سنوات الخبرة</Label><Input id="years_experience" name="years_experience" type="number" min="0" value={values.years_experience} onChange={update} required /></div>

      <fieldset className="grid gap-3 rounded-lg border bg-card p-5">
        <legend className="px-1 text-sm font-semibold text-foreground">الألقاب الأكاديمية</legend>
        <p className="text-xs text-muted-foreground">أدخل ألقابك الأكاديمية (حتى ثلاثة) مع ملف إثبات لكل لقب. اللقب الأول إجباري.</p>
        <AcademicTitlesInput value={academicTitles} onChange={setAcademicTitles} />
      </fieldset>

      <div><Label htmlFor="profession_title">عنوان المهنة</Label><Input id="profession_title" name="profession_title" value={values.profession_title} onChange={update} placeholder="اكتب عنوان مهنتك بنفسك، مثال: أخصائي نفسي سريري" required /></div>

      <fieldset className="grid gap-3 rounded-lg border bg-card p-5">
        <legend className="px-1 text-sm font-semibold text-foreground">مجالات التخصص</legend>
        <p className="text-xs text-muted-foreground">أضف مجالات تخصصك، كل مجال مع ملفات إثبات (شهادات). مطلوب مجال واحد على الأقل.</p>
        <SpecialtiesInput value={specialties} onChange={setSpecialties} />
      </fieldset>

      <fieldset className="grid gap-3 rounded-lg border bg-card p-5">
        <legend className="px-1 text-sm font-semibold text-foreground">الرخصة المهنية</legend>
        <label className="flex items-start gap-2 text-sm font-medium"><input type="checkbox" checked={values.license_confirmed} onChange={(event) => setValues({ ...values, license_confirmed: event.target.checked })} className="mt-1" /><span>أؤكد وجود رخصة مهنية سارية وأتحمل مسؤولية صحة المعلومات.</span></label>
        <div><Label htmlFor="license_number">رقم الرخصة المهنية</Label><Input id="license_number" name="license_number" value={values.license_number} onChange={update} required /></div>
      </fieldset>

      <fieldset className="grid gap-3 rounded-lg border bg-card p-5">
        <legend className="px-1 text-sm font-semibold text-foreground">العضوية في جمعيات مهنية</legend>
        <label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" checked={values.is_association_member} onChange={(event) => setValues({ ...values, is_association_member: event.target.checked })} />أنا عضو مسجّل في جمعية مهنية</label>
        {values.is_association_member && <div><Label htmlFor="professional_associations">اسم الجمعية/الجمعيات</Label><Textarea id="professional_associations" name="professional_associations" value={values.professional_associations} onChange={update} className="mt-2 min-h-20" placeholder="مثال: جمعية العلاج النفسي (הסתדרות הפסיכותרפיסטים)" required /></div>}
      </fieldset>

      <div><Label htmlFor="bio">نبذة عن ممارستك</Label><Textarea id="bio" name="bio" value={values.bio} onChange={update} className="mt-2 min-h-28" /></div>
      <div><Label htmlFor="website">رابط الموقع الإلكتروني</Label><Input id="website" name="website" type="url" value={values.website} onChange={update} placeholder="https://" /></div>
      <div><Label htmlFor="appointment_mode">نوع الجلسات</Label>
        <select id="appointment_mode" name="appointment_mode" value={values.appointment_mode} onChange={update} className="mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm" required>
          <option value="online">عبر الإنترنت</option><option value="in_person">حضوري</option><option value="both">عبر الإنترنت وحضوري</option>
        </select>
      </div>
      <div><Label htmlFor="session_fee">المبلغ المطلوب للجلسة (بالشيكل)</Label><Input id="session_fee" name="session_fee" type="number" min="0" value={values.session_fee} onChange={update} /></div>
      <div><Label htmlFor="location">الموقع</Label><Input id="location" name="location" value={values.location} onChange={update} required /></div>
      {values.appointment_mode !== "online" && <div className="grid gap-5"><fieldset><legend className="text-sm font-medium">إتاحة المكان</legend><div className="mt-2 grid gap-2 sm:grid-cols-2">{accessibilityOptions.map((o) => <label key={o} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={values.accessibility.split("، ").includes(o)} onChange={() => toggleAccessibility(o)} />{o}</label>)}</div><Label htmlFor="accessibility_notes" className="mt-3 block">ملاحظات إضافية عن الإتاحة</Label><Textarea id="accessibility_notes" name="accessibility_notes" value={values.accessibility_notes} onChange={update} className="mt-2 min-h-20" /></fieldset><div><Label htmlFor="directions">كيفية الوصول إلى المكان</Label><Textarea id="directions" name="directions" value={values.directions} onChange={update} className="mt-2 min-h-24" required /></div></div>}
      <fieldset><legend className="text-sm font-medium">أيام العمل <span className="text-muted-foreground">(اختيارية)</span></legend><div className="mt-2 flex flex-wrap gap-3">{workDays.map(([value, label]) => <label key={value} className="flex items-center gap-1 text-sm"><input type="checkbox" checked={values.work_days.includes(value)} onChange={() => toggleDay(value)} />{label}</label>)}</div></fieldset>
      <fieldset className="grid gap-3 rounded-lg border bg-card p-5"><legend className="px-1 text-sm font-semibold text-foreground">الأجيال التي أعمل معها</legend><p className="text-xs text-muted-foreground">حدد الفئة العمرية التي تستقبلها في عيادتك.</p><div className="grid gap-5 sm:grid-cols-2"><div><Label htmlFor="min_age">من العمر (بالسنوات)</Label><Input id="min_age" name="min_age" type="number" min="0" max="120" value={values.min_age} onChange={update} /></div><div><Label htmlFor="max_age">إلى العمر (بالسنوات)</Label><Input id="max_age" name="max_age" type="number" min="0" max="120" value={values.max_age} onChange={update} /></div></div></fieldset>
      <label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" checked={values.accepting_new_patients} onChange={(event) => setValues({ ...values, accepting_new_patients: event.target.checked })} />بإمكاني استقبال متوجهين جدد</label>
      {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
      {message && <p className="text-sm text-primary" aria-live="polite" role="status">{message}</p>}
      <Button type="submit" disabled={saving} className="w-full">{saving ? "جارٍ إرسال الطلب…" : "إرسال الملف للتحقق"}</Button>
    </form>
  );
}