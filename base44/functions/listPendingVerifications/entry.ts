import { createClientFromRequest } from "npm:@base44/sdk@0.8.44";

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== "admin") return Response.json({ error: "Forbidden" }, { status: 403 });

    const service = base44.asServiceRole.entities;
    const profiles = await service.ProfessionalProfile.filter({ verification_status: "pending_verification" }, "-created_date");
    const core = base44.asServiceRole.integrations.Core;

    const sign = async (uri: string) => {
      try {
        const { signed_url } = await core.CreateFileSignedUrl({ file_uri: uri, expires_in: 600 });
        return signed_url;
      } catch {
        return "";
      }
    };

    const result = await Promise.all(profiles.map(async (p: any) => {
      const privateData = (await service.ProviderPrivateData.filter({ provider_user_id: p.provider_user_id }, "-created_date", 1))[0];

      const academic_titles = await Promise.all((p.academic_titles || []).map(async (t: any) => ({
        title: t.title,
        document_name: t.document_name || "",
        signed_url: await sign(t.document_uri),
      })));

      const specialties = await Promise.all((p.specialties || []).map(async (s: any) => ({
        name: s.name,
        documents: await Promise.all((s.documents || []).map(async (d: any) => ({
          name: d.name,
          signed_url: await sign(d.uri),
        }))),
      })));

      return { ...p, teudat_zehut: privateData?.teudat_zehut || "", academic_titles, specialties };
    }));

    return Response.json({ profiles: result });
  } catch (error) {
    return Response.json({ error: error.message || "Unable to list pending verifications" }, { status: 500 });
  }
}