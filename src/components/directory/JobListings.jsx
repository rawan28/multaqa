import { Briefcase, MapPin, Mail } from "lucide-react";

const typeLabels = { full_time: "دوام كامل", part_time: "دوام جزئي", freelance: "مستقل", temporary: "مؤقت" };

export default function JobListings({ listings, loading }) {
  return (
    <section id="jobs" className="bg-secondary">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <p className="text-sm font-medium text-primary">لوحة الوظائف</p>
        <h2 className="mt-2 font-heading text-3xl font-semibold text-foreground">מודעות דרושים</h2>
        <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">فرص عمل للمعالجين والأخصائيين النفسيين في عيادات ومراكز مختلفة.</p>

        <div className="mt-8">
          {loading ? (
            <p className="text-muted-foreground">جارٍ تحميل الإعلانات…</p>
          ) : listings.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {listings.map((job) => (
                <article key={job.id} className="rounded-lg border bg-card p-6 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-heading text-lg font-semibold text-foreground">{job.title}</h3>
                    <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{typeLabels[job.employment_type] || job.employment_type}</span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-foreground">{job.organization}</p>
                  <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2"><MapPin className="h-4 w-4" aria-hidden="true" />{job.location}</p>
                    <p className="flex items-center gap-2"><Briefcase className="h-4 w-4" aria-hidden="true" />{typeLabels[job.employment_type]}</p>
                  </div>
                  {job.description && <p className="mt-4 line-clamp-3 text-sm leading-6 text-foreground">{job.description}</p>}
                  <a href={`mailto:${job.contact_email}?subject=${encodeURIComponent("بخصوص: " + job.title)}`} className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary underline">
                    <Mail className="h-4 w-4" aria-hidden="true" />تقديم على الوظيفة
                  </a>
                </article>
              ))}
            </div>
          ) : (
            <p className="rounded-lg border border-dashed p-8 text-muted-foreground">لا توجد إعلانات وظائف حاليًا.</p>
          )}
        </div>
      </div>
    </section>
  );
}