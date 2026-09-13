import { AlertTriangle } from "lucide-react";

export default function EmergencyNotice() {
  return <div dir="rtl" role="alert" className="border-b border-destructive/30 bg-destructive/10 text-destructive"><div className="mx-auto flex max-w-6xl items-start gap-2 px-5 py-3 text-sm leading-6 bg-[hsl(var(--secondary))]"><AlertTriangle className="mt-1 h-4 w-4 shrink-0" aria-hidden="true" /><p className="text-2xl bg-[hsl(var(--secondary))] [font-family:'Abril_Fatface',_system-ui] uppercase text-right text-[hsl(var(--destructive))]"><strong>تنبيه طارئ:</strong> في حال وجود خطر فوري، أزمة نفسية حادة أو خشية من إيذاء نفسك أو الآخرين، لا تعتمد على المنصة. يُرجى التواصل فورًا مع خدمات الطوارئ أو جهة مهنية مختصة.</p></div></div>;
}