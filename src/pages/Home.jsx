import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { HeartHandshake } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import MarketingHero from "@/components/landing/MarketingHero";
import MissionSection from "@/components/landing/MissionSection";
import ProfessionalCard from "@/components/directory/ProfessionalCard";
import AdvancedSearch from "@/components/directory/AdvancedSearch";
import SiteFooter from "@/components/SiteFooter";

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
  const matches = useMemo(() => professionals.filter((item) => item.is_active === true && (!query || item.full_name.toLowerCase().includes(query.toLowerCase())) && (!specialty || item.specialty === specialty) && (!location || item.location === location) && (!mode || item.appointment_mode === mode || item.appointment_mode === "both")), [professionals, query, specialty, location, mode]);
  const hasFilters = query || specialty || location || mode;
  const resetFilters = () => { setQuery(""); setSpecialty(""); setLocation(""); setMode(""); };
  return <main id="main-content" dir="rtl" className="min-h-screen bg-background"><header className="border-b bg-card"><div className="mx-auto flex max-w-6xl items-center gap-3 px-5 py-5"><HeartHandshake className="h-7 w-7 text-primary" /><span className="font-heading text-xl font-semibold">مُلتقى</span><div className="mr-auto flex items-center gap-4">{user?.role === "admin" && <Link to="/verification" className="text-sm text-primary underline">طلبات التحقق</Link>}{isAuthenticated && <Link to="/dashboard" className="text-sm font-medium text-primary underline">لوحة الممارس</Link>}{!isAuthenticated && <Link to="/login" className="text-sm font-medium text-primary underline">دخول الممارسين</Link>}</div></div></header><MarketingHero /><MissionSection /><section id="directory" className="bg-secondary"><div className="mx-auto max-w-6xl px-5 py-12"><p className="text-sm font-medium text-primary">الدليل المهني</p><h2 className="mt-2 font-heading text-3xl font-semibold text-foreground">ابحث عن الدعم المناسب لك</h2><AdvancedSearch query={query} setQuery={setQuery} specialty={specialty} setSpecialty={setSpecialty} location={location} setLocation={setLocation} mode={mode} setMode={setMode} locations={locations} onReset={resetFilters} hasFilters={hasFilters} /></div></section><section className="mx-auto grid max-w-6xl gap-12 px-5 py-12 lg:grid-cols-[1fr_360px]"><div><div className="mb-6 flex items-baseline justify-between"><h2 className="font-heading text-2xl font-semibold">الأخصائيون</h2><span className="text-sm text-muted-foreground" aria-live="polite">{matches.length} مدرجين</span></div>{loading ? <p className="text-muted-foreground">جارٍ تحميل الأخصائيين…</p> : matches.length ? <div className="grid gap-5 md:grid-cols-2">{matches.map((item) => <ProfessionalCard key={item.id} professional={item} />)}</div> : <p className="rounded-lg border border-dashed p-8 text-muted-foreground">لا يوجد أخصائيون يطابقون بحثك حتى الآن.</p>}</div><aside className="h-fit rounded-lg border bg-card p-6 shadow-sm"><h2 className="font-heading text-2xl font-semibold">انضم إلى الدليل</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">أنشئ ملفك المهني ليسهل على الناس العثور على الدعم المناسب.</p><Link to="/join" className="mt-6 flex h-11 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">انضم إلى الدليل</Link></aside></section><SiteFooter /></main>;
}