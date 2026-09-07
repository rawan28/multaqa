import { MapPin, Monitor, BriefcaseBusiness } from "lucide-react";

const modeLabels = { online: "Online", in_person: "In person", both: "Online & in person" };

export default function ProfessionalCard({ professional }) {
  return (
    <article className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-secondary font-heading text-lg font-semibold text-secondary-foreground">
        {professional.full_name?.slice(0, 1).toUpperCase()}
      </div>
      <h2 className="font-heading text-xl font-semibold text-foreground">{professional.full_name}</h2>
      <div className="mt-4 space-y-2 text-sm text-muted-foreground">
        <p className="flex items-center gap-2"><MapPin className="h-4 w-4" />{professional.location}</p>
        <p className="flex items-center gap-2"><BriefcaseBusiness className="h-4 w-4" />{professional.years_experience} years of experience</p>
        <p className="flex items-center gap-2"><Monitor className="h-4 w-4" />{modeLabels[professional.appointment_mode]}</p>
      </div>
      {professional.bio && <p className="mt-5 line-clamp-4 text-sm leading-6 text-foreground">{professional.bio}</p>}
      <p className="mt-5 border-t pt-4 text-xs text-muted-foreground">License no. {professional.license_number}</p>
    </article>
  );
}