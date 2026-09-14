import { createClientFromRequest } from "npm:@base44/sdk@0.8.44";

const ADMIN_EMAIL = "rawanawadie@gmail.com";
const ADMIN_REVIEW_URL = "https://judicious-mind-connect-path.base44.app/admin/verifications";

const statusLabels = {
  pending: "قيد المراجعة",
  approved: "تمت الموافقة",
  rejected: "مرفوض",
};

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();
    const eventType = payload.event_type || "update";
    const status = payload.status || "pending";
    const requestId = payload.verification_request_id || "";
    const profileId = payload.professional_profile_id || "";
    const providerUserId = payload.provider_user_id || "";

    const isNew = eventType === "create";
    const subject = isNew ? "طلب تحقق جديد في مُلتقى" : "تحديث على طلب تحقق في مُلتقى";
    const statusLabel = statusLabels[status] || status;
    const emailBody = `${isNew ? "تم إنشاء طلب تحقق جديد" : "تم تحديث طلب تحقق"} في المنصة:\n\nرقم الطلب: ${requestId}\nمعرف الملف المهني: ${profileId}\nمعرف الممارس: ${providerUserId}\nالحالة: ${statusLabel}\n\nرابط المراجعة: ${ADMIN_REVIEW_URL}`;

    await base44.asServiceRole.integrations.Core.SendEmail({ to: ADMIN_EMAIL, subject, body: emailBody });
    return Response.json({ status: "sent" });
  } catch (error) {
    return Response.json({ error: error.message || "Unable to send admin notification" }, { status: 500 });
  }
}