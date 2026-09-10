import { createClientFromRequest } from "npm:@base44/sdk@0.8.44";

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== "admin") return Response.json({ error: "Forbidden" }, { status: 403 });
    const { profileId, status, rejectionReason } = await req.json();
    if (typeof profileId !== "string" || !["verified", "rejected"].includes(status)) return Response.json({ error: "Invalid review" }, { status: 400 });
    if (typeof rejectionReason !== "string" || rejectionReason.length > 2000) return Response.json({ error: "Invalid rejection reason" }, { status: 400 });

    const service = base44.asServiceRole.entities;
    const profile = await service.ProfessionalProfile.get(profileId);
    if (!profile) return Response.json({ error: "Profile not found" }, { status: 404 });

    const now = new Date().toISOString();
    const update = status === "verified"
      ? { verification_status: "verified", is_active: true, verified_at: now, verified_by_admin_id: user.id, rejection_reason: "" }
      : { verification_status: "rejected", is_active: false, rejection_reason: rejectionReason.trim() };
    await service.ProfessionalProfile.update(profileId, update);

    const provider = await service.User.get(profile.provider_user_id);
    if (provider?.email) {
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: provider.email,
        subject: "تحديث حالة التحقق في مُلتقى",
        body: status === "verified"
          ? "تم التحقق من ملفك المهني بنجاح، وأصبح ظاهرًا في الدليل العام."
          : `لم تتم الموافقة على ملفك حاليًا. السبب: ${rejectionReason.trim() || "يرجى رفع وثائق محدثة وإعادة الإرسال."}`
      });
    }
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error.message || "Unable to review verification" }, { status: 500 });
  }
}