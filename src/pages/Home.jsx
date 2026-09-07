import { useEffect, useMemo, useState } from "react";
import { Search, HeartHandshake } from "lucide-react";
import { base44 } from "@/api/base44Client";
import ProfessionalCard from "@/components/directory/ProfessionalCard";
import ProfessionalForm from "@/components/directory/ProfessionalForm";

export default function Home() {
  const [professionals, setProfessionals] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const loadProfiles = async () => { setLoading(true); setProfessionals(await base44.entities.ProfessionalProfile.list("-created_date")); setLoading(false); };
  useEffect(() => { loadProfiles(); }, []);
  const matches = useMemo(() => professionals.filter((item) => `${item.full_name} ${item.location}`.toLowerCase().includes(query.toLowerCase())), [professionals, query]);
  const addProfile = async (profile) => { await base44.entities.ProfessionalProfile.create(profile); await loadProfiles(); };
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b bg-card"><div className="mx-auto flex max-w-6xl items-center gap-3 px-5 py-5"><HeartHandshake className="h-7 w-7 text-primary" /><span className="font-heading text-xl font-semibold">Mindful Directory</span></div></header>
      <section className="border-b bg-secondary"><div className="mx-auto max-w-6xl px-5 py-14"><p className="mb-3 font-medium text-muted-foreground">Mental health professional directory</p><h1 className="max-w-2xl text-balance font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">Find compassionate support that fits your life.</h1><div className="relative mt-8 max-w-xl"><Search className="absolute left-4 top-3 h-5 w-5 text-muted-foreground" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name or location" className="h-11 w-full rounded-md border bg-background pl-12 pr-4 text-base" aria-label="Search by name or location" /></div></div></section>
      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-12 lg:grid-cols-[1fr_360px]"><div><div className="mb-6 flex items-baseline justify-between"><h2 className="font-heading text-2xl font-semibold">Professionals</h2><span className="text-sm text-muted-foreground">{matches.length} listed</span></div>{loading ? <p className="text-muted-foreground">Loading professionals…</p> : matches.length ? <div className="grid gap-5 md:grid-cols-2">{matches.map((item) => <ProfessionalCard key={item.id} professional={item} />)}</div> : <p className="rounded-lg border border-dashed p-8 text-muted-foreground">No professionals match your search yet.</p>}</div><aside className="h-fit rounded-lg border bg-card p-6 shadow-sm"><h2 className="font-heading text-2xl font-semibold">Join the directory</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Create your professional profile so people can find the right support.</p><div className="mt-6"><ProfessionalForm onSubmit={addProfile} /></div></aside></section>
    </main>
  );
}