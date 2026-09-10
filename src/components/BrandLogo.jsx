import { Image } from "@/components/ui/image";

const LOGO_URL = "https://media.base44.com/images/public/6a9ea4320796aa673f0e625c/955ea9c07_image.png";

// Brand logo for مُلتقى — interlaced circle-and-diamond emblem with the
// wordmark in angular Kufic calligraphy set inside it. Rendered via the
// Image component for optimized delivery.
export default function BrandLogo({ className = "h-20 w-20" }) {
  return (
    <Image
      src={LOGO_URL}
      alt="شعار مُلتقى"
      fittingType="fit"
      className={className}
    />
  );
}