import { createClientFromRequest } from "npm:@base44/sdk@0.8.44";
import { isValidTeudatZehut } from "../../shared/teudatZehut.ts";

const appointmentModes = ["online", "in_person", "both"];

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    const profile = body.profile || {};

    if (typeof profile.full_legal_name !== "string" || !profile.full_legal_name.trim()) return Response.json({ error: "full_legal_name is required" }, { status: 400 });
    if (typeof profile.teudat_zehut !== "string" || !isValidTeudatZehut(profile.teudat_zehut)) return Response.json({ error: "Invalid Teudat Zehut" }, { status: 400 });

    const academicTitles = Array.isArray(profile.academic_titles) ? profile.academic_titles : [];
    if (!academicTitles.length) return Response.json({ error: "At least one academic title is required" }, { status: 400 });
    for (const t of academicTitles) {
      if (!t || typeof t.title !== "string" || !t.title.trim() || typeof t.document_uri !== "string" || !t.document_uri) return Response.json({ error: "Each academic title requires a title and a proof document" }, { status: 400 });
    }

    if (typeof profile.profession_title !== "string" || !profile.profession_title.trim()) return Response.json({ error: "profession_title is required" }, { status: 400 });

    const specialties = Array.isArray(profile.specialties) ? profile.specialties : [];
    if (!specialties.length) return Response.json({ error: "At least one specialty is required" }, { status: 400 });
    for (const s of specialties) {
      if (!s || typeof s.name !== "string" || !s.name.trim() || !Array.isArray(s.documents) || !s.documents.length) return Response.json({ error: "Each specialty requires a name and at least one proof document" }, { status: 400 });
      for (const d of s.documents) {
        if (!d || typeof d.uri !== "string" || typeof d.name !== "string") return Response.json({ error: "Invalid specialty document entry" }, { status: 400 });
      }
    }

    if (profile.license_confirmed !== true) return Response.json({ error: "License confirmation is required" }, { status: 400 });
    if (typeof profile.license_number !== "string" || !profile.license_number.trim()) return Response.json({ error: "license_number is required" }, { status: 400 });
    if (typeof profile.location !== "string" || !profile.location.trim()) return Response.json({ error: "location is required" }, { status: 400 });
    if (typeof profile.years_experience !== "number" || profile.years_experience < 0) return Response.json({ error: "Invalid years_experience" }, { status: 400 });
    if (!appointmentModes.includes(profile.appointment_mode)) return Response.json({ error: "Invalid appointment_mode" }, { status: 400 });

    const service = base44.asServiceRole.entities;
    const existing = await service.ProfessionalProfile.filter({ provider_user_id: user.id }, "-created_date", 1);

    const payload: any = {
      full_name: profile.full_legal_name,
      full_legal_name: profile.full_legal_name,
      gender: profile.gender || "",
      profession_title: profile.profession_title.trim(),
      academic_titles: academicTitles.map((t: any) => ({ title: t.title.trim(), document_uri: t.document_uri, document_name: t.document_name || "" })),
      specialties: specialties.map((s: any) => ({ name: s.name.trim(), documents: s.documents.map((d: any) => ({ uri: d.uri, name: d.name })) })),
      license_confirmed: true,
      license_number: profile.license_number.trim(),
      location: profile.location,
      years_experience: profile.years_experience,
      appointment_mode: profile.appointment_mode,
      work_days: Array.isArray(profile.work_days) ? profile.work_days : [],
      accepting_new_patients: profile.accepting_new_patients !== false,
      offers_mentorship: profile.offers_mentorship === true,
      profile_image_url: profile.profile_image_url || "",
      website: profile.website || "",
      accessibility: profile.accessibility || "",
      directions: profile.directions || "",
      bio: profile.bio || "",
      professional_associations: profile.professional_associations || "",
      phone: profile.phone || "",
      email: profile.email || "",
      verification_status: "pending_verification",
      is_active: false,
      rejection_reason: "",
      verified_at: "",
      verified_by_admin_id: "",
    };

    let profileId: string;
    if (existing[0]) {
      await service.ProfessionalProfile.update(existing[0].id, payload);
      profileId = existing[0].id;
    } else {
      const created = await service.ProfessionalProfile.create({ ...payload, provider_user_id: user.id });
      profileId = created.id;
    }

    const documents: any[] = [];
    for (const t of academicTitles) documents.push({ uri: t.document_uri, name: t.document_name || "academic_title", type: "diploma" });
    for (const s of specialties) for (const d of s.documents) documents.push({ uri: d.uri, name: d.name, type: "other" });

    const privatePayload = {
      provider_user_id: user.id,
      professional_profile_id: profileId,
      teudat_zehut: profile.teudat_zehut,
      documents,
    };
    const existingPrivate = await service.ProviderPrivateData.filter({ provider_user_id: user.id }, "-created_date", 1);
    if (existingPrivate[0]) {
      await service.ProviderPrivateData.update(existingPrivate[0].id, privatePayload);
    } else {
      await service.ProviderPrivateData.create(privatePayload);
    }

    try {
      const notifyEmail = "rawanawadie@gmail.com";
      const subject = "تسجيل أخصائي جديد في مُلتقى";
      const specialtyNames = specialties.map((s: any) => s.name).join("، ");
      const body = `تم تسجيل أخصائي جديد في المنصة بانتظار التحقق:\n\nالاسم: ${profile.full_legal_name}\nعنوان المهنة: ${profile.profession_title}\nالتخصصات: ${specialtyNames}\nرقم الرخصة: ${profile.license_number}\nالموقع: ${profile.location}\nسنوات الخبرة: ${profile.years_experience}\n\nرابط المراجعة: https://judicious-mind-connect-path.base44.app/admin/verifications`;
      await base44.asServiceRole.integrations.Core.SendEmail({ to: notifyEmail, subject, body });
    } catch (emailError) {
      // Email send failure should not block the registration flow
    }

    return Response.json({ status: "pending" });
  } catch (error) {
    return Response.json({ error: error.message || "Unable to submit verification" }, { status: 500 });
  }
}