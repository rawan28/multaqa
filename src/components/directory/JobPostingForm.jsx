import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";

const initialValues = { title: "", organization: "", location: "", employment_type: "full_time", description: "", contact_email: "" };

export default function JobPostingForm() {
  const { user } = useAuth();
  const [values, setValues] = useState({ ...initialValues, contact_email: user?.email || "" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const update = (event) => setValues({ ...values, [event.target.name]: event.target.value });

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true); setError(""); setMessage("");
    try {
      const me = await base44.auth.me();
      await base44.entities.JobListing.create({ ...values, posted_by_id: me.id, is_active: true });
      setMessage("تم نشر إعلانك بنجاح.");
      setValues({ ...initialValues, contact_email: user?.email || "" });
      setOpen(false);
    } catch {
      setError("تعذر نشر الإعلان. حاول مرة أخرى.");
    } finally {
      setSaving(false);
    }
  };

  if (!open) {
    return <Button type="button" variant="outline" onClick={() => setOpen(true)}>انشر إعلان وظيفة</Button>;
  }

  return (
    <form onSubmit={submit} className="grid gap-4 rounded-lg border bg-card p-6 shadow-sm">
      <div><Label htmlFor="job-title">المسمى الوظيفي</Label><Input id="job-title" name="title" value={values.title} onChange={update} required /></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><Label htmlFor="job-organization">اسم الجهة</Label><Input id="job-organization" name="organization" value={values.organization} onChange={update} required /></div>
        <div><Label htmlFor="job-location">الموقع</Label><Input id="job-location" name="location" value={values.location} onChange={update} required /></div>
      </div>
      <div>
        <Label htmlFor="job-type">نوع التوظيف</Label>
        <select id="job-type" name="employment_type" value={values.employment_type} onChange={update} className="mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm">
          <option value="full_time">دوام كامل</option>
          <option value="part_time">دوام جزئي</option>
          <option value="freelance">مستقل</option>
          <option value="temporary">مؤقت</option>
        </select>
      </div>
      <div><Label htmlFor="job-description">وصف الوظيفة</Label><Textarea id="job-description" name="description" value={values.description} onChange={update} className="min-h-28" /></div>
      <div><Label htmlFor="job-email">البريد لتقديم الطلبات</Label><Input id="job-email" name="contact_email" type="email" value={values.contact_email} onChange={update} required /></div>
      {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
      {message && <p className="text-sm text-primary" aria-live="polite" role="status">{message}</p>}
      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>{saving ? "جارٍ النشر…" : "نشر الإعلان"}</Button>
        <Button type="button" variant="outline" onClick={() => setOpen(false)}>إلغاء</Button>
      </div>
    </form>
  );
}