import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { Image } from "@/components/ui/image";

export default function ProfessionalCard({ professional }) {
  return (
    <article className="flex flex-col rounded-lg border bg-card p-5 shadow-sm">
      {professional.profile_image_url ? (
        <Image src={professional.profile_image_url} alt={`صورة ${professional.full_name}`} className="mb-4 h-20 w-20 overflow-hidden rounded-full" fittingType="fit" />
      ) : (
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-secondary font-heading text-2xl font-semibold text-secondary-foreground">{professional.full_name?.slice(0, 1).toUpperCase()}</div>
      )}
      <h3 className="font-heading text-lg font-semibold text-foreground">{professional.full_name}</h3>
      {professional.profession_title && <p className="mt-1 text-sm font-medium text-primary">{professional.profession_title}</p>}
      {professional.bio && <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{professional.bio}</p>}
      <div className="mt-3 flex gap-0.5" aria-label="التقييم 5 من 5">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" aria-hidden="true" />
        ))}
      </div>
      <Link to={`/professional/${professional.id}`} className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">عرض الملف</Link>
    </article>
  );
}