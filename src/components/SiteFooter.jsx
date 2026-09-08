import { Link } from "react-router-dom";

export default function SiteFooter() {
  return <footer className="border-t bg-card"><nav aria-label="קישורים משפטיים | روابط قانونية"><div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-5 px-5 py-5"><Link to="/privacy" className="text-sm text-muted-foreground underline">سياسة الخصوصية</Link><Link to="/terms" className="text-sm text-muted-foreground underline">תנאי שימוש</Link><Link to="/accessibility" className="text-sm text-muted-foreground underline">הצהרת נגישות</Link></div></nav></footer>;
}