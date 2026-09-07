import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, HeartHandshake } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import ProfessionalCard from "@/components/directory/ProfessionalCard";
import ProfessionalForm from "@/components/directory/ProfessionalForm";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [professionals, setProfessionals] = useState([]);
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [loading, setLoading] = useState(true);
  const loadProfiles = async () => { setLoading(true); setProfessionals(await base44.entities.ProfessionalProfile.list("-created_date")); setLoading(false); };
  useEffect(() => { loadProfiles(); }, []);
  const matches = useMemo(() => professionals.filter((item) => `${item.full_name} ${item.location}`.toLowerCase().includes(query.toLowerCase()) && (!specialty || item.specialty === specialty)), [professionals, query, specialty]);
  const addProfile = async (profile) => { await base44.entities.ProfessionalProfile.create(profile); await loadProfiles(); };
  return (
    <main dir="rtl" className="min-h-screen bg-background">
      <header className="border-b bg-card"><div className="mx-auto flex max-w-6xl items-center gap-3 px-5 py-5"><HeartHandshake className="h-7 w-7 text-primary" /><span className="font-heading text-xl font-semibold">مُلتقى</span></div></header>
      <section className="border-b bg-secondary"><div className="mx-auto max-w-6xl px-5 py-14"><p className="mb-3 font-medium text-muted-foreground">دليل أخصائيي الصحة النفسية</p><h1 className="max-w-2xl text-balance font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">اعثر على الدعم المتفهم الذي يناسب حياتك.</h1><div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-2"><div className="relative"><Search className="absolute right-4 top-3 h-5 w-5 text-muted-foreground" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ابحث بالاسم أو الموقع" className="h-11 w-full rounded-md border bg-background pr-12 pl-4 text-base" aria-label="ابحث بالاسم أو الموقع" /></div><select value={specialty} onChange={(event) => setSpecialty(event.target.value)} className="h-11 rounded-md border bg-background px-4 text-base" aria-label="اختر مجال الممارسة"><option value="">التخصص المهني</option><option value="psychotherapy">العلاج النفسي</option><option value="clinical_psychology">علم النفس السريري</option><option value="nlp">البرمجة اللغوية العصبية</option><option value="family_therapy">العلاج الأسري</option><option value="couples_therapy">العلاج الزوجي</option><option value="child_therapy">علاج الأطفال واليافعين</option><option value="other">مجال آخر</option></select></div></div></section>
      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-12 lg:grid-cols-[1fr_360px]"><div><div className="mb-6 flex items-baseline justify-between"><h2 className="font-heading text-2xl font-semibold">الأخصائيون</h2><span className="text-sm text-muted-foreground">{matches.length} مدرجين</span></div>{loading ? <p className="text-muted-foreground">جارٍ تحميل الأخصائيين…</p> : matches.length ? <div className="grid gap-5 md:grid-cols-2">{matches.map((item) => <ProfessionalCard key={item.id} professional={item} />)}</div> : <p className="rounded-lg border border-dashed p-8 text-muted-foreground">لا يوجد أخصائيون يطابقون بحثك حتى الآن.</p>}</div><aside className="h-fit rounded-lg border bg-card p-6 shadow-sm"><h2 className="font-heading text-2xl font-semibold">انضم إلى الدليل</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">أنشئ ملفك المهني ليسهل على الناس العثور على الدعم المناسب.</p><div className="mt-6">{isAuthenticated ? <ProfessionalForm onSubmit={addProfile} /> : <Link to="/register" className="flex h-11 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">إنشاء حساب وتأكيد البريد الإلكتروني</Link>}</div></aside></section>
    </main>
  );
}