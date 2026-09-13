import { Search, X } from "lucide-react";

const specialtyOptions = [
  { value: "", label: "كل التخصصات" },
  { value: "psychotherapy", label: "العلاج النفسي" },
  { value: "clinical_psychology", label: "علم النفس السريري" },
  { value: "nlp", label: "البرمجة اللغوية العصبية" },
  { value: "family_therapy", label: "العلاج الأسري" },
  { value: "couples_therapy", label: "العلاج الزوجي" },
  { value: "child_therapy", label: "علاج الأطفال واليافعين" },
  { value: "other", label: "مجال آخر" },
];

const modeOptions = [
  { value: "", label: "كل أنواع الجلسات" },
  { value: "online", label: "عبر الإنترنت" },
  { value: "in_person", label: "حضوري" },
  { value: "both", label: "عبر الإنترنت وحضوري" },
];

export default function AdvancedSearch({ query, setQuery, specialty, setSpecialty, location, setLocation, mode, setMode, locations, onReset, hasFilters }) {
  return (
    <div className="mt-6 rounded-lg border bg-card p-5 shadow-sm">
      <div className="relative">
        <Search className="absolute right-4 top-3.5 h-5 w-5 text-muted-foreground" aria-hidden="true" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="ابحث بالاسم"
          className="h-11 w-full rounded-md border bg-background pr-12 pl-4 text-base"
          aria-label="ابحث بالاسم"
        />
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <div>
          <label htmlFor="filter-specialty" className="mb-1.5 block text-xs font-medium text-muted-foreground">بحث عن التخصص</label>
          <input
            id="filter-specialty"
            value={specialty}
            onChange={(event) => setSpecialty(event.target.value)}
            placeholder="مثال: CBT، تربوي"
            className="h-11 w-full rounded-md border bg-background px-3 text-sm"
          />
        </div>
        <div>
          <label htmlFor="filter-location" className="mb-1.5 block text-xs font-medium text-muted-foreground">الموقع الجغرافي</label>
          <select
            id="filter-location"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            className="h-11 w-full rounded-md border bg-background px-3 text-sm"
          >
            <option value="">كل المواقع</option>
            {locations.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="filter-mode" className="mb-1.5 block text-xs font-medium text-muted-foreground">نوع الجلسات</label>
          <select
            id="filter-mode"
            value={mode}
            onChange={(event) => setMode(event.target.value)}
            className="h-11 w-full rounded-md border bg-background px-3 text-sm"
          >
            {modeOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
      </div>
      {hasFilters && (
        <button type="button" onClick={onReset} className="mt-3 inline-flex items-center gap-1.5 text-sm text-primary underline">
          <X className="h-4 w-4" aria-hidden="true" />مسح الفلاتر
        </button>
      )}
    </div>
  );
}