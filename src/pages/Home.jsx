import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import BrandLogo from "@/components/BrandLogo";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import ProfessionalCard from "@/components/directory/ProfessionalCard";
import AdvancedSearch from "@/components/directory/AdvancedSearch";
import EmergencyNotice from "@/components/EmergencyNotice";
import WelcomeSection from "@/components/directory/WelcomeSection";
import FAQSection from "@/components/directory/FAQSection";
import SiteFooter from "@/components/SiteFooter";
import { LogOut } from "lucide-react";

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const [professionals, setProfessionals] = useState([]);
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [location, setLocation] = useState("");
  const [mode, setMode] = useState("");
  const [loading, setLoading] = useState(true);
  const loadProfiles = async () => { setLoading(true); setProfessionals(await base44.entities.ProfessionalProfile.list("-created_date")); setLoading(false); };
  useEffect(() => { loadProfiles(); }, []);
  const locations = useMemo(() => Array.from(new Set(professionals.filter((p) => p.is_active && p.location).map((p) => p.location))).sort(), [professionals]);
  const matches = useMemo(() => professionals.filter((item) => item.verification_status === "verified" && (!query || item.full_name.toLowerCase().includes(query.toLowerCase())) && (!specialty || item.specialties?.some((s) => (s.name || "").toLowerCase().includes(specialty.toLowerCase())) || (item.profession_title || "").toLowerCase().includes(specialty.toLowerCase())) && (!location || item.location === location) && (!mode || item.appointment_mode === mode || item.appointment_mode === "both")), [professionals, query, specialty, location, mode]);
  const hasFilters = query || specialty || location || mode;
  const resetFilters = () => { setQuery(""); setSpecialty(""); setLocation(""); setMode(""); };
  const handleLogout = async () => { await base44.auth.logout(); };
  return (
    <main id="main-content" dir="rtl" className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-5 py-6">
          <div className="flex flex-col items-start gap-1">
            <BrandLogo className="h-24 w-24" />
            <p className="text-sm font-medium text-muted-foreground">ابحث في دليل الأخصائيين الصحة النفسية</p>
          </div>
          <div className="mr-auto flex items-center gap-4">
            {user?.role === "admin" && <Link to="/admin/verifications" className="text-sm text-primary underline">طلبات التحقق</Link>}
            {isAuthenticated && <Link to="/dashboard" className="text-sm font-medium text-primary underline">لوحة الممارس</Link>}
            {isAuthenticated && <button onClick={handleLogout} className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-destructive"><LogOut className="h-4 w-4" />تسجيل الخروج</button>}
            <Link to="/adverts" className="text-sm font-medium text-primary underline">لوحة الإعلانات</Link>
            {!isAuthenticated && <Link to="/login" className="text-sm font-medium text-primary underline">دخول الممارسين</Link>}
          </div>
        </div>
      </header>
      <section id="directory" className="bg-background">
        <div className="mx-auto max-w-6xl px-5 py-10">
          <WelcomeSection />
          <AdvancedSearch query={query} setQuery={setQuery} specialty={specialty} setSpecialty={setSpecialty} location={location} setLocation={setLocation} mode={mode} setMode={setMode} locations={locations} onReset={resetFilters} hasFilters={hasFilters} />
          <EmergencyNotice />
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-10 px-5 pb-16 lg:grid-cols-[1fr_280px]">
        <div>
          <div className="mb-6 flex items-baseline justify-between">
            <h2 className="font-heading text-3xl font-semibold text-foreground">الأخصائيون</h2>
          </div>
          {loading ? <p className="text-muted-foreground">جارٍ تحميل الأخصائيين…</p> : matches.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{matches.map((item) => <ProfessionalCard key={item.id} professional={item} />)}</div> : <p className="rounded-lg border border-dashed p-8 text-muted-foreground">لا يوجد أخصائيون يطابقون بحثك حتى الآن.</p>}
        </div>
        <aside className="h-fit">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="font-heading text-xl font-semibold">انضم إلى الدليل</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">أنشئ ملفك المهني ليسهل على الناس العثور على الدعم المناسب.</p>
            <Link to="/join" className="mt-6 flex h-11 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">انضم إلى الدليل</Link>
          </div>
        </aside>
      </section>
      <FAQSection />
      <SiteFooter />
    </main>
  );
}