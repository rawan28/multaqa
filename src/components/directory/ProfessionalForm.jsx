import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const initialValues = { full_name: "", location: "", years_experience: "", appointment_mode: "both", license_number: "", bio: "" };

export default function ProfessionalForm({ onSubmit }) {
  const [values, setValues] = useState(initialValues);
  const [saving, setSaving] = useState(false);
  const update = (event) => setValues({ ...values, [event.target.name]: event.target.value });
  const submit = async (event) => { event.preventDefault(); setSaving(true); await onSubmit({ ...values, years_experience: Number(values.years_experience) }); setValues(initialValues); setSaving(false); };
  return (
    <form onSubmit={submit} className="grid gap-5">
      <div><Label htmlFor="full_name">Full name</Label><Input id="full_name" name="full_name" value={values.full_name} onChange={update} required /></div>
      <div><Label htmlFor="location">Location</Label><Input id="location" name="location" value={values.location} onChange={update} required /></div>
      <div className="grid gap-5 sm:grid-cols-2"><div><Label htmlFor="years_experience">Years of experience</Label><Input id="years_experience" name="years_experience" type="number" min="0" value={values.years_experience} onChange={update} required /></div><div><Label htmlFor="appointment_mode">Appointments</Label><select id="appointment_mode" name="appointment_mode" value={values.appointment_mode} onChange={update} className="mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm" required><option value="online">Online</option><option value="in_person">In person</option><option value="both">Online & in person</option></select></div></div>
      <div><Label htmlFor="license_number">Practitioner license number</Label><Input id="license_number" name="license_number" value={values.license_number} onChange={update} required /></div>
      <div><Label htmlFor="bio">About your practice <span className="text-muted-foreground">(optional)</span></Label><Textarea id="bio" name="bio" value={values.bio} onChange={update} className="mt-2 min-h-28" /></div>
      <Button type="submit" disabled={saving} className="w-full">{saving ? "Creating profile…" : "Create profile"}</Button>
    </form>
  );
}