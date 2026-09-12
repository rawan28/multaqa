import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ProfessionalPhotoUpload from "@/components/directory/ProfessionalPhotoUpload";
import SecureDocumentUpload from "@/components/directory/SecureDocumentUpload";
import { isValidTeudatZehut } from "@/lib/teudatZehut";

const professionOptions = [
{ value: "psychologist", label: "أخصائي نفسي — פסיכולוג" },
{ value: "social_worker", label: "أخصائي اجتماعي — עובד סוציאלי" },
{ value: "psychiatrist", label: "طبيب نفسي — פסיכיאטר" },
{ value: "clinical_criminologist", label: "أخصائي علم الجريمة السريري — קרימינולוג קליני" },
{ value: "art_therapist", label: "معالج بالفنون — מטפל באמנות" }];

const primaryProfessions = ["psychologist", "social_worker", "psychiatrist"];
const subSpecialtyOptions = [
{ value: "none", label: "بدون تدريب إضافي" },
{ value: "psychotherapy_training", label: "تدريب العلاج النفسي بعد الجامعي" },
{ value: "cbt", label: "العلاج المعرفي السلوكي (CBT)" },
{ value: "psychodrama", label: "السيكودراما" },
{ value: "family_therapy", label: "العلاج الأسري" },
{ value: "other_training", label: "تدريب آخر معتمد" }];

const specialtyOptions = [
{ value: "clinical_psychology", label: "علم النفس السريري" },
{ value: "psychotherapy", label: "العلاج النفسي" },
{ value: "family_therapy", label: "العلاج الأسري" },
{ value: "couples_therapy", label: "العلاج الزوجي" },
{ value: "child_therapy", label: "علاج الأطفال واليافعين" },
{ value: "nlp", label: "البرمجة اللغوية العصبية" },
{ value: "other", label: "مجال آخر" }];

const workDays = [["sunday", "الأحد"], ["monday", "الاثنين"], ["tuesday", "الثلاثاء"], ["wednesday", "الأربعاء"], ["thursday", "الخميس"], ["friday", "الجمعة"], ["saturday", "السبت"]];

const genderOptions = [
{ value: "male", label: "ذكر — זכר" },
{ value: "female", label: "أنثى — נקבה" },
{ value: "other", label: "آخر — אחר" }];
const initialValues = { full_legal_name: "", teudat_zehut: "", gender: "", profession: "psychologist", license_number: "", sub_specialty: "none", base_license_number: "", location: "", years_experience: "", appointment_mode: "both", specialty: "clinical_psychology", work_days: [],   accepting_new_patients: true, profile_image_url: "", website: "", accessibility: "", directions: "", phone: "", email: "", bio: "", professional_associations: "" };

export default function ProfessionalForm({ onSubmit }) {
  const [values, setValues] = useState(initialValues);
  const [documents, setDocuments] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const update = (event) => setValues({ ...values, [event.target.name]: event.target.value });
  const toggleDay = (day) => setValues({ ...values, work_days: values.work_days.includes(day) ? values.work_days.filter((item) => item !== day) : [...values.work_days, day] });

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (!isValidTeudatZehut(values.teudat_zehut)) {setError("رقم الهوية الإسرائيلية (ت.ز) غير صالح. يُرجى التحقق من الرقم.");return;}
    if (values.sub_specialty !== "none") {
      if (!primaryProfessions.includes(values.profession)) {setError("اختيار تخصص فرعي / تدريب علاج نفسي يتطلب مهنة أساسية معتمدة (أخصائي نفسي، أخصائي اجتماعي، أو طبيب نفسي).");return;}
      if (!values.base_license_number.trim()) {setError("يرجى إدخال رقم رخصة المهنة الأساسية المعتمدة.");return;}
    }
    const hasLicense = documents.some((d) => d.type === "license_card");
    const hasDiploma = documents.some((d) => d.type === "diploma");
    if (!hasLicense || !hasDiploma) {setError("يرجى رفع بطاقة الرخصة وشهادة أكاديمية واحدة على الأقل.");return;}
    setSaving(true);
    try {
      const result = await onSubmit({ profile: { ...values, years_experience: Number(values.years_experience) }, documents });
      setMessage(result.status === "approved" ? "تم تفعيل ملفك المهني." : "تم إرسال ملفك للتحقق والمراجعة. لن يظهر في الدليل حتى تتم الموافقة عليه.");
      setValues(initialValues);
      setDocuments([]);
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
      <div><Label htmlFor="gender">الجنس
</Label>
        <select id="gender" name="gender" value={values.gender} onChange={update} className="mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm">
          <option value="" disabled>يرجى الاختيار — נא לבחור</option>
          {genderOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div><Label htmlFor="teudat_zehut">رقم الهوية 
</Label><Input id="teudat_zehut" name="teudat_zehut" value={values.teudat_zehut} onChange={update} inputMode="numeric" pattern="\d{5,9}" required /></div>
        <div><Label htmlFor="profession">المهنة الأساسية</Label>
          <select id="profession" name="profession" value={values.profession} onChange={update} className="mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm" required>
            {professionOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>
      <div><Label htmlFor="license_number">رقم ترخيص الممارس</Label><Input id="license_number" name="license_number" value={values.license_number} onChange={update} required /></div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div><Label htmlFor="sub_specialty">تخصص فرعي / تدريب علاج نفسي بعد الجامعي</Label>
          <select id="sub_specialty" name="sub_specialty" value={values.sub_specialty} onChange={update} className="mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm">
            {subSpecialtyOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        {values.sub_specialty !== "none" && <div><Label htmlFor="base_license_number">رقم رخصة المهنة الأساسية</Label><Input id="base_license_number" name="base_license_number" value={values.base_license_number} onChange={update} required /></div>}
      </div>
      {values.sub_specialty !== "none" && !primaryProfessions.includes(values.profession) && <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive" role="alert">التخصص الفرعي متاح فقط لأخصائي نفسي، أخصائي اجتماعي، أو طبيب نفسي.</p>}
      <SecureDocumentUpload documents={documents} onChange={setDocuments} />
      <div><Label htmlFor="location">الموقع</Label><Input id="location" name="location" value={values.location} onChange={update} required /></div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div><Label htmlFor="years_experience">سنوات الخبرة</Label><Input id="years_experience" name="years_experience" type="number" min="0" value={values.years_experience} onChange={update} required /></div>
        <div><Label htmlFor="appointment_mode">نوع الجلسات</Label>
          <select id="appointment_mode" name="appointment_mode" value={values.appointment_mode} onChange={update} className="mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm" required>
            <option value="online">عبر الإنترنت</option><option value="in_person">حضوري</option><option value="both">عبر الإنترنت وحضوري</option>
          </select>
        </div>
      </div>
      {values.appointment_mode !== "online" && <div className="grid gap-5"><div><Label htmlFor="accessibility">إتاحة المكان</Label><Input id="accessibility" name="accessibility" value={values.accessibility} onChange={update} required /></div><div><Label htmlFor="directions">كيفية الوصول إلى المكان</Label><Textarea id="directions" name="directions" value={values.directions} onChange={update} className="mt-2 min-h-24" required /></div></div>}
      <div><Label htmlFor="specialty">مجال الممارسة</Label>
        <select id="specialty" name="specialty" value={values.specialty} onChange={update} className="mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm" required>
          {specialtyOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
      <fieldset><legend className="text-sm font-medium">أيام العمل <span className="text-muted-foreground">(اختيارية)</span></legend><div className="mt-2 flex flex-wrap gap-3">{workDays.map(([value, label]) => <label key={value} className="flex items-center gap-1 text-sm"><input type="checkbox" checked={values.work_days.includes(value)} onChange={() => toggleDay(value)} />{label}</label>)}</div></fieldset>
      <label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" checked={values.accepting_new_patients} onChange={(event) => setValues({ ...values, accepting_new_patients: event.target.checked })} />بإمكاني استقبال متوجهين جدد</label>
      <div className="grid gap-5 sm:grid-cols-2"><div><Label htmlFor="phone">رقم الهاتف</Label><Input id="phone" name="phone" type="tel" value={values.phone} onChange={update} required /></div><div><Label htmlFor="email">البريد الإلكتروني</Label><Input id="email" name="email" type="email" value={values.email} onChange={update} required /></div></div>
      <div><Label htmlFor="bio">نبذة عن ممارستك</Label><Textarea id="bio" name="bio" value={values.bio} onChange={update} className="mt-2 min-h-28" /></div>
      <div><Label htmlFor="professional_associations">العضوية في جمعيات مهنية</Label><Textarea id="professional_associations" name="professional_associations" value={values.professional_associations} onChange={update} className="mt-2 min-h-20" placeholder="اذكر الجمعيات المهنية التي أنت عضو فيها (اختياري)" /></div>
      {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
      {message && <p className="text-sm text-primary" aria-live="polite" role="status">{message}</p>}
      <Button type="submit" disabled={saving} className="w-full">{saving ? "جارٍ إرسال الطلب…" : "إرسال الملف للتحقق"}</Button>
    </form>);}