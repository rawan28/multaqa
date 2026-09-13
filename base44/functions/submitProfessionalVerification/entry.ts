import { createClientFromRequest } from "npm:@base44/sdk@0.8.44";
import { isValidTeudatZehut } from "../../shared/teudatZehut.ts";

const professions = ["psychologist", "social_worker", "psychiatrist", "clinical_criminologist", "art_therapist"];
const primaryProfessions = ["psychologist", "social_worker", "psychiatrist"];
const docTypes = ["license_card", "diploma", "equivalency_certificate", "other"];
const subSpecialties = ["none", "psychotherapy_training", "cbt", "psychodrama", "family_therapy", "other_training"];
const appointmentModes = ["online", "in_person", "both"];

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    const profile = body.profile || {};
    const documents = Array.isArray(body.documents) ? body.documents : [];

    if (typeof profile.full_legal_name !== "string" || !profile.full_legal_name.trim()) return Response.json({ error: "full_legal_name is required" }, { status: 400 });
    if (typeof profile.teudat_zehut !== "string" || !isValidTeudatZehut(profile.teudat_zehut)) return Response.json({ error: "Invalid Teudat Zehut" }, { status: 400 });
    if (!professions.includes(profile.profession)) return Response.json({ error: "Invalid profession" }, { status: 400 });
    if (typeof profile.license_number !== "string" || !profile.license_number.trim()) return Response.json({ error: "license_number is required" }, { status: 400 });
    if (typeof profile.location !== "string" || !profile.location.trim()) return Response.json({ error: "location is required" }, { status: 400 });
    if (typeof profile.specialty !== "string" || !profile.specialty.trim()) return Response.json({ error: "specialty is required" }, { status: 400 });
    if (typeof profile.years_experience !== "number" || profile.years_experience < 0) return Response.json({ error: "Invalid years_experience" }, { status: 400 });
    if (!appointmentModes.includes(profile.appointment_mode)) return Response.json({ error: "Invalid appointment_mode" }, { status: 400 });

    const subSpecialty = typeof profile.sub_specialty === "string" ? profile.sub_specialty : "none";
    if (!subSpecialties.includes(subSpecialty)) return Response.json({ error: "Invalid sub_specialty" }, { status: 400 });
    if (subSpecialty !== "none") {
      if (!primaryProfessions.includes(profile.profession)) return Response.json({ error: "Sub-specialty requires an approved primary profession (Psychologist, Social Worker, or Psychiatrist)" }, { status: 400 });
      if (typeof profile.base_license_number !== "string" || !profile.base_license_number.trim()) return Response.json({ error: "base_license_number is required for sub-specialty" }, { status: 400 });
    }

    if (!documents.length) return Response.json({ error: "Documents are required" }, { status: 400 });
    const hasLicense = documents.some((d: any) => d && d.type === "license_card");
    const hasDiploma = documents.some((d: any) => d && d.type === "diploma");
    if (!hasLicense || !hasDiploma) return Response.json({ error: "License card and diploma documents are required" }, { status: 400 });
    for (const doc of documents) {
      if (!doc || typeof doc.uri !== "string" || typeof doc.name !== "string" || !docTypes.includes(doc.type)) return Response.json({ error: "Invalid document entry" }, { status: 400 });
    }

    const service = base44.asServiceRole.entities;
    const existing = await service.ProfessionalProfile.filter({ provider_user_id: user.id }, "-created_date", 1);

    const payload: any = {
      full_name: profile.full_legal_name,
      full_legal_name: profile.full_legal_name,
      profession: profile.profession,
      license_number: profile.license_number,
      location: profile.location,
      years_experience: profile.years_experience,
      appointment_mode: profile.appointment_mode,
      specialty: profile.specialty,
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
      sub_specialty: subSpecialty,
      base_license_number: subSpecialty !== "none" ? profile.base_license_number : "",
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
      const body = `تم تسجيل أخصائي جديد في المنصة بانتظار التحقق:\n\nالاسم: ${profile.full_legal_name}\nالمهنة: ${profile.profession}\nرقم الترخيص: ${profile.license_number}\nالموقع: ${profile.location}\nالمجال: ${profile.specialty}\nسنوات الخبرة: ${profile.years_experience}\n\nرابط المراجعة: https://judicious-mind-connect-path.base44.app/admin/verifications`;
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: notifyEmail,
        subject,
        body,
      });
    } catch (emailError) {
      // Email send failure should not block the registration flow
    }

    return Response.json({ status: "pending" });
  } catch (error) {
    return Response.json({ error: error.message || "Unable to submit verification" }, { status: 500 });
  }
}