import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ProfessionalPhotoUpload from "@/components/directory/ProfessionalPhotoUpload";

const initialValues = { full_name: "", location: "", years_experience: "", appointment_mode: "both", specialty: "psychotherapy", license_number: "", work_days: [], accepting_new_patients: true, profile_image_url: "", website: "", accessibility: "", directions: "", phone: "", email: "", bio: "" };
const workDays = [["sunday", "الأحد"], ["monday", "الاثنين"], ["tuesday", "الثلاثاء"], ["wednesday", "الأربعاء"], ["thursday", "الخميس"], ["friday", "الجمعة"], ["saturday", "السبت"]];

export default function ProfessionalForm({ onSubmit }) {
  const [values, setValues] = useState(initialValues);
  const [saving, setSaving] = useState(false);
  const update = (event) => setValues({ ...values, [event.target.name]: event.target.value });
  const toggleDay = (day) => setValues({ ...values, work_days: values.work_days.includes(day) ? values.work_days.filter((item) => item !== day) : [...values.work_days, day] });
  const submit = async (event) => { event.preventDefault(); setSaving(true); await onSubmit({ ...values, years_experience: Number(values.years_experience) }); setValues(initialValues); setSaving(false); };
  return (
    <form onSubmit={submit} className="grid gap-5">
      <ProfessionalPhotoUpload value={values.profile_image_url} onUpload={(profile_image_url) => setValues({ ...values, profile_image_url })} />
      <div><Label htmlFor="full_name">الاسم الكامل</Label><Input id="full_name" name="full_name" value={values.full_name} onChange={update} required /></div>
      <div><Label htmlFor="location">الموقع</Label><Input id="location" name="location" value={values.location} onChange={update} required /></div>
      <div className="grid gap-5 sm:grid-cols-2"><div><Label htmlFor="years_experience">سنوات الخبرة</Label><Input id="years_experience" name="years_experience" type="number" min="0" value={values.years_experience} onChange={update} required /></div><div><Label htmlFor="appointment_mode">نوع الجلسات</Label><select id="appointment_mode" name="appointment_mode" value={values.appointment_mode} onChange={update} className="mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm" required><option value="online">عبر الإنترنت</option><option value="in_person">حضوري</option><option value="both">عبر الإنترنت وحضوري</option></select></div></div>
      {values.appointment_mode !== "online" && <div className="grid gap-5"><div><Label htmlFor="accessibility">إتاحة المكان</Label><Input id="accessibility" name="accessibility" value={values.accessibility} onChange={update} placeholder="مثل: مدخل دون درجات أو موقف قريب" required /></div><div><Label htmlFor="directions">كيفية الوصول إلى المكان</Label><Textarea id="directions" name="directions" value={values.directions} onChange={update} placeholder="اذكر العنوان أو المواصلات أو تعليمات الوصول" className="mt-2 min-h-24" required /></div></div>}
      <div><Label htmlFor="specialty">مجال الممارسة</Label><select id="specialty" name="specialty" value={values.specialty} onChange={update} className="mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm" required><option value="psychotherapy">العلاج النفسي</option><option value="clinical_psychology">علم النفس السريري</option><option value="nlp">البرمجة اللغوية العصبية</option><option value="family_therapy">العلاج الأسري</option><option value="couples_therapy">العلاج الزوجي</option><option value="child_therapy">علاج الأطفال واليافعين</option><option value="other">مجال آخر</option></select></div>
      <div><Label htmlFor="license_number">رقم ترخيص الممارس</Label><Input id="license_number" name="license_number" value={values.license_number} onChange={update} required /></div>
      <fieldset><legend className="text-sm font-medium">أيام العمل <span className="text-muted-foreground">(اختيارية)</span></legend><div className="mt-2 flex flex-wrap gap-3">{workDays.map(([value, label]) => <label key={value} className="flex items-center gap-1 text-sm"><input type="checkbox" checked={values.work_days.includes(value)} onChange={() => toggleDay(value)} />{label}</label>)}</div></fieldset>
      <label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" checked={values.accepting_new_patients} onChange={(event) => setValues({ ...values, accepting_new_patients: event.target.checked })} />أقبل مرضى جدد</label>
      <div><Label htmlFor="website">الموقع الإلكتروني <span className="text-muted-foreground">(اختياري)</span></Label><Input id="website" name="website" type="url" value={values.website} onChange={update} placeholder="https://example.com" /></div>
      <div className="grid gap-5 sm:grid-cols-2"><div><Label htmlFor="phone">رقم الهاتف <span className="text-muted-foreground">(اختياري)</span></Label><Input id="phone" name="phone" type="tel" value={values.phone} onChange={update} /></div><div><Label htmlFor="email">البريد الإلكتروني <span className="text-muted-foreground">(اختياري)</span></Label><Input id="email" name="email" type="email" value={values.email} onChange={update} /></div></div>
      <div><Label htmlFor="bio">نبذة عن ممارستك <span className="text-muted-foreground">(اختياري)</span></Label><Textarea id="bio" name="bio" value={values.bio} onChange={update} className="mt-2 min-h-28" /></div>
      <Button type="submit" disabled={saving} className="w-full">{saving ? "جارٍ إنشاء الملف…" : "إنشاء الملف الشخصي"}</Button>
    </form>
  );
}