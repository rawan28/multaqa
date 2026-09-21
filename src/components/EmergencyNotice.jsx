import { AlertTriangle } from "lucide-react";

export default function EmergencyNotice() {
  return (
    <div dir="rtl" role="alert" className="mt-4 rounded-lg border-2 border-accent/50 bg-accent/20 p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-6 w-6 shrink-0 text-accent" aria-hidden="true" />
        <p className="text-base font-medium leading-7 text-foreground">
          <strong className="text-accent">تنبيه طارئ:</strong> في حال وجود خطر فوري، أزمة نفسية حادة أو خشية من إيذاء نفسك أو الآخرين، لا تعتمد على المنصة. يُرجى التواصل فورًا مع خدمات الطوارئ أو جهة مهنية مختصة.
        </p>
      </div>
    </div>
  );
}