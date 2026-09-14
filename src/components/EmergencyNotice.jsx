import { AlertTriangle } from "lucide-react";

export default function EmergencyNotice() {
  return (
    <div dir="rtl" role="alert" className="rounded-lg border border-accent/30 bg-accent/10 p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
        <p className="text-sm leading-6 text-foreground">
          <strong className="text-accent">تنبيه طارئ:</strong> في حال وجود خطر فوري، أزمة نفسية حادة أو خشية من إيذاء نفسك أو الآخرين، لا تعتمد على المنصة. يُرجى التواصل فورًا مع خدمات الطوارئ أو جهة مهنية مختصة.
        </p>
      </div>
    </div>
  );
}