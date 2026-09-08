import { createClientFromRequest } from "npm:@base44/sdk@0.8.44";

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== "admin") return Response.json({ error: "Forbidden" }, { status: 403 });
    const { requestId, status, adminNote } = await req.json();
    if (typeof requestId !== "string" || !["approved", "rejected"].includes(status) || typeof adminNote !== "string" || adminNote.length > 2000) return Response.json({ error: "Invalid review" }, { status: 400 });
    const service = base44.asServiceRole.entities;
    const verification = await service.VerificationRequest.get(requestId);
    if (!verification || verification.status !== "pending") return Response.json({ error: "Verification request is unavailable" }, { status: 404 });
    await service.VerificationRequest.update(requestId, { status, admin_note: adminNote.trim() });
    if (status === "approved") await service.ProfessionalProfile.update(verification.professional_profile_id, { is_active: true });
    const provider = await service.User.get(verification.provider_user_id);
    if (provider?.email) await base44.asServiceRole.integrations.Core.SendEmail({ to: provider.email, subject: "تحديث طلب التحقق في مُلتقى", body: status === "approved" ? "تمت الموافقة على طلب التحقق الخاص بك، وأصبح ملفك المهني ظاهرًا في الدليل." : `لم تتم الموافقة على طلب التحقق الخاص بك. ملاحظة المراجع: ${adminNote.trim() || "يرجى رفع وثائق محدثة."}` });
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error.message || "Unable to review verification" }, { status: 500 });
  }
}