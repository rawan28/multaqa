import { Link } from "react-router-dom";
import BrandLogo from "@/components/BrandLogo";

export default function SiteFooter() {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-5">
        <nav aria-label="קישורים משפטיים | روابط قانونية" className="flex flex-wrap gap-5">
          <Link to="/privacy" className="text-sm text-muted-foreground underline">سياسة الخصوصية</Link>
          <Link to="/terms" className="text-sm text-muted-foreground underline">תנאי שימוש</Link>
          <Link to="/accessibility" className="text-sm text-muted-foreground underline">הצהרת נגישות</Link>
        </nav>
        <Link to="/" aria-label="مُلتقى - الصفحة الرئيسية" className="shrink-0">
          <BrandLogo className="h-12 w-12" />
        </Link>
      </div>
    </footer>
  );
}