import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import PendingVerificationCard from "@/components/verification/PendingVerificationCard";
import SiteFooter from "@/components/SiteFooter";

export default function VerificationAdmin() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await base44.functions.invoke("listPendingVerifications", {});
      setProfiles(res.data.profiles || []);
    } catch {
      setError("تعذر تحميل الطلبات.");
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") load();
  }, [user]);

  if (user?.role !== "admin") {
    return <main id="main-content" dir="rtl" className="mx-auto max-w-3xl px-5 py-16"><p>هذه الصفحة مخصصة لمدير التطبيق فقط.</p><Link to="/" className="mt-4 inline-block text-primary underline">العودة إلى الدليل</Link></main>;
  }

  return (
    <main id="main-content" dir="rtl" className="mx-auto max-w-5xl px-5 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">إدارة الدليل</p>
          <h1 className="font-heading text-3xl font-semibold">طلبات التحقق</h1>
        </div>
        <Link to="/" className="text-sm text-primary underline">العودة إلى الدليل</Link>
      </div>
      {loading ? <p className="text-muted-foreground">جارٍ تحميل الطلبات…</p> : error ? <p className="text-sm text-destructive" role="alert">{error}</p> : profiles.length ? <div className="grid gap-5">{profiles.map((p) => <PendingVerificationCard key={p.id} profile={p} onReviewed={load} />)}</div> : <p className="rounded-lg border border-dashed p-8 text-muted-foreground">لا توجد طلبات تحقق معلّقة.</p>}
      <SiteFooter />
    </main>
  );
}