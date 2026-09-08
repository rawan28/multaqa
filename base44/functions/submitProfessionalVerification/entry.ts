import { createClientFromRequest } from "npm:@base44/sdk@0.8.44";

const professions = ["psychologist", "psychotherapist", "nlp", "social_worker", "art_therapist", "parent_coach", "other"];

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
    const { profile, certificates } = await req.json();
    if (!profile || typeof profile.full_name !== "string" || !professions.includes(profile.profession) || !Array.isArray(certificates) || certificates.length > 5) return Response.json({ error: "Invalid registration data" }, { status: 400 });
    if (profile.profession !== "psychologist" && !certificates.length) return Response.json({ error: "Certificates are required" }, { status: 400 });
    if (!profile.location || !profile.specialty || !profile.license_number || typeof profile.years_experience !== "number") return Response.json({ error: "Missing required profile information" }, { status: 400 });
    const service = base44.asServiceRole.entities;
    const existing = await service.ProfessionalProfile.filter({ provider_user_id: user.id }, "-created_date", 1);
    let professional = existing[0];
    if (!professional) {
      professional = await service.ProfessionalProfile.create({ ...profile, provider_user_id: user.id, is_active: profile.profession === "psychologist" });
    }
    if (professional.is_active) return Response.json({ status: "approved", message: "Profile is already active" });
    const verification = await service.VerificationRequest.create({ professional_profile_id: professional.id, provider_user_id: user.id, status: "pending", admin_note: "" });
    if (certificates.length) await service.Certificate.bulkCreate(certificates.map((certificate) => ({ verification_request_id: verification.id, provider_user_id: user.id, file_url: certificate.file_url, file_name: certificate.file_name })));
    return Response.json({ status: profile.profession === "psychologist" ? "approved" : "pending" });
  } catch (error) {
    return Response.json({ error: error.message || "Unable to submit verification" }, { status: 500 });
  }
}