import { useState } from "react";
import { Link2, MessageCircle, Send, Mail } from "lucide-react";

export default function ShareButtons({ url, title }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");
  const shareTitle = title || "مُلتقى - دليل المهنيين";
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(shareTitle);

  const whatsappUrl = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
  const telegramUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`;
  const emailUrl = `mailto:?subject=${encodedTitle}&body=${encodedUrl}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const btnClass =
    "inline-flex h-9 w-9 items-center justify-center rounded-full border bg-card text-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">شارك:</span>
      <a href={whatsappUrl} target="_blank" rel="noreferrer" aria-label="مشاركة عبر واتساب" className={btnClass}>
        <MessageCircle className="h-4 w-4" />
      </a>
      <a href={telegramUrl} target="_blank" rel="noreferrer" aria-label="مشاركة عبر تيليجرام" className={btnClass}>
        <Send className="h-4 w-4" />
      </a>
      <a href={emailUrl} aria-label="مشاركة عبر البريد الإلكتروني" className={btnClass}>
        <Mail className="h-4 w-4" />
      </a>
      <button onClick={copyLink} aria-label="نسخ الرابط" className={btnClass}>
        <Link2 className="h-4 w-4" />
      </button>
      {copied && <span className="text-xs text-primary" role="status">تم نسخ الرابط</span>}
    </div>
  );
}