import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import BrandLogo from "@/components/BrandLogo";
import SiteFooter from "@/components/SiteFooter";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { Image } from "@/components/ui/image";
import { Briefcase, GraduationCap, CalendarDays, LogOut, MapPin, Mail, ExternalLink } from "lucide-react";

const categoryConfig = {
  work: { label: "فرص عمل", icon: Briefcase, color: "text-primary" },
  course: { label: "دورات", icon: GraduationCap, color: "text-accent" },
  event: { label: "فعاليات", icon: CalendarDays, color: "text-secondary" },
};

export default function Adverts() {
  const { isAuthenticated, user } = useAuth();
  const [adverts, setAdverts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setAdverts(await base44.entities.Advert.list("-created_date"));
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(
    () => adverts.filter((a) => a.is_active && (!activeCategory || a.category === activeCategory)),
    [adverts, activeCategory]
  );

  const handleLogout = async () => { await base44.auth.logout(); };

  return (
    <main id="main-content" dir="rtl" className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-5 py-6">
          <Link to="/" className="flex flex-col items-start gap-1">
            <BrandLogo className="h-20 w-20" />
            <p className="text-sm font-medium text-muted-foreground">لوحة الإعلانات</p>
          </Link>
          <div className="mr-auto flex items-center gap-4">
            {isAuthenticated && <Link to="/dashboard" className="text-sm font-medium text-primary underline">لوحة الممارس</Link>}
            {isAuthenticated && <button onClick={handleLogout} className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-destructive"><LogOut className="h-4 w-4" />تسجيل الخروج</button>}
            {!isAuthenticated && <Link to="/login" className="text-sm font-medium text-primary underline">دخول الممارسين</Link>}
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-10">
        <div className="mb-8 text-center">
          <h1 className="font-heading text-4xl font-bold text-foreground">لوحة الإعلانات</h1>
          <p className="mx-auto mt-3 max-w-2xl text-lg leading-8 text-muted-foreground">
            فرص عمل، دورات تدريبية، وفعاليات في مجال الصحة النفسية — تصفّح ما يناسبك وتواصل مباشرة.
          </p>
        </div>

        <div className="mb-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => setActiveCategory("")}
            className={`rounded-full border px-5 py-2 text-sm font-medium transition ${activeCategory === "" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:bg-muted"}`}
          >
            الكل
          </button>
          {Object.entries(categoryConfig).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-medium transition ${activeCategory === key ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:bg-muted"}`}
            >
              <cfg.icon className="h-4 w-4" />
              {cfg.label}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground">جارٍ تحميل الإعلانات…</p>
        ) : filtered.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => {
              const cfg = categoryConfig[item.category] || categoryConfig.work;
              const Icon = cfg.icon;
              return (
                <article key={item.id} className="flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm">
                  {item.image_url && (
                    <div className="aspect-video w-full overflow-hidden">
                      <Image src={item.image_url} fittingType="fill" className="h-full w-full" alt={item.title} />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center gap-2">
                      <Icon className={`h-5 w-5 ${cfg.color}`} />
                      <span className="text-sm font-medium text-muted-foreground">{cfg.label}</span>
                    </div>
                    <h2 className="mt-2 font-heading text-xl font-semibold text-foreground">{item.title}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{item.organization}</p>
                    {item.location && (
                      <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />{item.location}
                      </p>
                    )}
                    <p className="mt-3 flex-1 text-sm leading-6 text-foreground line-clamp-4">{item.description}</p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <a href={`mailto:${item.contact_email}`} className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                        <Mail className="h-4 w-4" />تواصل
                      </a>
                      {item.link && (
                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                          <ExternalLink className="h-4 w-4" />التفاصيل
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">لا توجد إعلانات متاحة حاليًا.</p>
        )}
      </section>

      <SiteFooter />
    </main>
  );
}