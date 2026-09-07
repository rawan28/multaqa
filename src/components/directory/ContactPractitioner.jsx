import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPractitioner({ professionalId }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");

  const sendMessage = async (event) => {
    event.preventDefault();
    setSending(true);
    setStatus("");
    try {
      await base44.functions.invoke("contactPractitioner", { profileId: professionalId, message });
      setMessage("");
      setOpen(false);
      setStatus("تم إرسال رسالتك مباشرة إلى الأخصائي.");
    } catch (error) {
      setStatus(error.response?.data?.error || "تعذر إرسال الرسالة. يرجى المحاولة لاحقًا.");
    } finally {
      setSending(false);
    }
  };

  return <div className="mt-5">
    {open ? <form onSubmit={sendMessage} className="space-y-3 rounded-md bg-secondary p-4"><Textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="اكتب رسالتك هنا" className="min-h-24" maxLength={5000} required /><div className="flex gap-3"><Button type="submit" disabled={sending}>{sending ? "جارٍ الإرسال…" : "إرسال الرسالة"}</Button><Button type="button" variant="outline" onClick={() => setOpen(false)}>إلغاء</Button></div></form> : <Button type="button" onClick={() => setOpen(true)}>إرسال رسالة إلى الأخصائي</Button>}
    {status && <p className="mt-3 text-sm text-muted-foreground">{status}</p>}
  </div>;
}