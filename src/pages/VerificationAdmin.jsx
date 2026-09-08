import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import VerificationReviewCard from "@/components/verification/VerificationReviewCard";
import SiteFooter from "@/components/SiteFooter";

export default function VerificationAdmin() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const load = async () => { setLoading(true); const [items, people] = await Promise.all([base44.entities.VerificationRequest.filter({ status: "pending" }, "-created_date"), base44.entities.ProfessionalProfile.list()]); setRequests(items); setProfiles(people); setLoading(false); };
  useEffect(() => { if (user?.role === "admin") load(); }, [user]);
  if (user?.role !== "admin") return <main id="main-content" dir="rtl" className="mx-auto max-w-3xl px-5 py-16"><p>هذه الصفحة مخصصة لمدير التطبيق فقط.</p><Link to="/" className="mt-4 inline-block text-primary underline">العودة إلى الدليل</Link></main>;
  return <main id="main-content" dir="rtl" className="mx-auto max-w-4xl px-5 py-12"><div className="mb-8 flex items-center justify-between"><div><p className="text-sm text-muted-foreground">إدارة الدليل</p><h1 className="font-heading text-3xl font-semibold">طلبات التحقق</h1></div><Link to="/" className="text-sm text-primary underline">العودة إلى الدليل</Link></div>{loading ? <p className="text-muted-foreground">جارٍ تحميل الطلبات…</p> : requests.length ? <div className="grid gap-5">{requests.map((item) => <VerificationReviewCard key={item.id} verification={item} profile={profiles.find((profile) => profile.id === item.professional_profile_id)} onReviewed={load} />)}</div> : <p className="rounded-lg border border-dashed p-8 text-muted-foreground">لا توجد طلبات تحقق معلّقة.</p>}<SiteFooter /></main>;
}