"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

interface MarkInboxReadButtonProps {
  emailId: string;
  isRead: boolean;
}

export function MarkInboxReadButton({ emailId, isRead }: MarkInboxReadButtonProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  if (isRead) {
    return null;
  }

  async function markRead() {
    setIsUpdating(true);
    try {
      await fetch(`/api/admin/inbox/${emailId}`, { method: "PATCH" });
      router.refresh();
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <Button variant="ghost" onClick={markRead} disabled={isUpdating}>
      {isUpdating ? "Marking…" : "Mark as read"}
    </Button>
  );
}
