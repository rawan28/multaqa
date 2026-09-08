import { useState } from "react";
import { Link } from "react-router-dom";
import { HeartHandshake } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import ProfessionalForm from "@/components/directory/ProfessionalForm";
import SiteFooter from "@/components/SiteFooter";

export default function JoinDirectory() {
  const { isAuthenticated } = useAuth();
  const [message, setMessage] = useState("");
  const addProfile = async (payload) => {
    const response = await base44.functions.invoke("submitProfessionalVerification", payload);
    setMessage(response.data.status === "approved" ? "تم تفعيل ملفك المهني." : "تم إرسال طلب التحقق للمراجعة.");
    return response.data;
  };
  return <main id="main-content" dir="rtl" className="min-h-screen bg-background"><header className="border-b bg-card"><div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-5"><Link to="/" className="flex items-center gap-2 font-heading text-xl font-semibold"><HeartHandshake className="h-6 w-6" />مُلتقى</Link><Link to="/" className="text-sm font-medium text-primary underline">العودة إلى الدليل</Link></div></header><section className="mx-auto max-w-3xl px-5 py-12"><p className="text-sm font-medium text-primary">للمهنيين</p><h1 className="mt-2 font-heading text-4xl font-semibold text-foreground">انضم إلى الدليل</h1><p className="mt-4 max-w-2xl leading-7 text-muted-foreground">أنشئ ملفك المهني ليسهل على الناس العثور على الدعم المناسب.</p><div className="mt-8 rounded-lg border bg-card p-6 shadow-sm">{isAuthenticated ? <><ProfessionalForm onSubmit={addProfile} />{message && <p className="mt-5 text-sm text-primary">{message}</p>}</> : <div><p className="leading-7 text-muted-foreground">سجّل الدخول أو أنشئ حسابًا أولًا لتقديم ملفك للتحقق.</p><Link to="/register" className="mt-5 flex h-11 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">أنشئ حسابك وانضم إلى الدليل</Link></div>}</div></section><SiteFooter /></main>;
}