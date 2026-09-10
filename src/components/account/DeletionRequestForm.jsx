import { useEffect, useState } from "react";
import { Trash2, AlertTriangle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

const STATUS_LABELS = {
  pending: "طلبك قيد المراجعة من قبل الإدارة.",
  approved: "تمت الموافقة على طلبك وسيتم حذف حسابك قريبًا.",
  rejected: "تم رفض طلبك. يرجى التواصل مع الإدارة لمزيد من التفاصيل.",
};

export default function DeletionRequestForm() {
  const { user } = useAuth();
  const [existing, setExisting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  const loadExisting = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const list = await base44.entities.DeletionRequest.filter(
        { user_id: user.id },
        "-created_date",
        1
      );
      setExisting(list[0] || null);
    } catch {
      setExisting(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExisting();
  }, [user]);

  const submit = async () => {
    setSubmitting(true);
    try {
      await base44.entities.DeletionRequest.create({
        user_id: user.id,
        user_email: user.email,
        user_name: user.full_name,
        reason: reason.trim() || undefined,
      });
      await loadExisting();
      setReason("");
      setOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-muted-foreground">جارٍ التحقق من طلباتك…</p>;
  }

  if (existing) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-1 h-5 w-5 text-destructive" aria-hidden="true" />
          <div>
            <p className="text-base font-semibold text-foreground">طلب حذف الحساب</p>
            <p className="mt-1 text-sm text-muted-foreground">{STATUS_LABELS[existing.status]}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-5">
      <div className="flex items-start gap-3">
        <Trash2 className="mt-1 h-5 w-5 text-destructive" aria-hidden="true" />
        <div className="flex-1">
          <p className="text-base font-semibold text-foreground">حذف الحساب</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            يمكنك تقديم طلب لحذف حسابك وبياناتك من المنصة. سيتم مراجعة الطلب من قبل الإدارة قبل التنفيذ.
          </p>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" className="mt-4">طلب حذف الحساب</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>تأكيد طلب حذف الحساب</DialogTitle>
                <DialogDescription>
                  سيتم إرسال طلبك إلى الإدارة للمراجعة. يمكنك إضافة سبب (اختياري).
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                <Label htmlFor="deletion-reason">سبب الطلب (اختياري)</Label>
                <Textarea
                  id="deletion-reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                  placeholder="أخبرنا سبب طلب حذف حسابك…"
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">إلغاء</Button>
                </DialogClose>
                <Button variant="destructive" onClick={submit} disabled={submitting}>
                  {submitting ? "جارٍ الإرسال…" : "تأكيد الطلب"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}