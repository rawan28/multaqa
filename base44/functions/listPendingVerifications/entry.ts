import { createClientFromRequest } from "npm:@base44/sdk@0.8.44";

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== "admin") return Response.json({ error: "Forbidden" }, { status: 403 });

    const service = base44.asServiceRole.entities;
    const profiles = await service.ProfessionalProfile.filter({ verification_status: "pending_verification" }, "-created_date");
    const core = base44.asServiceRole.integrations.Core;

    const result = await Promise.all(profiles.map(async (p: any) => {
      const privateData = (await service.ProviderPrivateData.filter({ provider_user_id: p.provider_user_id }, "-created_date", 1))[0];
      const rawDocs = privateData?.documents || [];
      const documents = await Promise.all(rawDocs.map(async (d: any) => {
        try {
          const { signed_url } = await core.CreateFileSignedUrl({ file_uri: d.uri, expires_in: 600 });
          return { uri: d.uri, name: d.name, type: d.type, signed_url };
        } catch {
          return { uri: d.uri, name: d.name, type: d.type, signed_url: "" };
        }
      }));
      return { ...p, teudat_zehut: privateData?.teudat_zehut || "", documents };
    }));

    return Response.json({ profiles: result });
  } catch (error) {
    return Response.json({ error: error.message || "Unable to list pending verifications" }, { status: 500 });
  }
}