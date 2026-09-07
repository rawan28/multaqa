import { createClientFromRequest } from "npm:@base44/sdk@0.8.44";

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const { profileId, message, senderName, senderEmail } = await req.json();
    const cleanMessage = typeof message === "string" ? message.trim() : "";
    const cleanName = typeof senderName === "string" ? senderName.trim() : "";
    const cleanEmail = typeof senderEmail === "string" ? senderEmail.trim() : "";
    if (typeof profileId !== "string" || !cleanName || cleanName.length > 120 || !/^\S+@\S+\.\S+$/.test(cleanEmail) || !cleanMessage || cleanMessage.length > 5000) {
      return Response.json({ error: "Invalid message" }, { status: 400 });
    }

    const professional = await base44.entities.ProfessionalProfile.get(profileId);
    if (!professional?.email) return Response.json({ error: "Email unavailable" }, { status: 400 });

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: professional.email,
      subject: `رسالة جديدة من مُلتقى إلى ${professional.full_name}`,
      body: `مرحبًا ${professional.full_name}،\n\nلديك رسالة جديدة عبر مُلتقى.\n\nالمرسل: ${cleanName}\nالبريد الإلكتروني: ${cleanEmail}\n\nالرسالة:\n${cleanMessage}`
    });

    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error.message || "Unable to send message" }, { status: 500 });
  }
}