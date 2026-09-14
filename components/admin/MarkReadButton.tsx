"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

interface MarkReadButtonProps {
  messageId: string;
  currentStatus: "unread" | "read" | "replied";
}

export function MarkReadButton({ messageId, currentStatus }: MarkReadButtonProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  if (currentStatus !== "unread") {
    return null;
  }

  async function markRead() {
    setIsUpdating(true);
    try {
      await fetch(`/api/admin/messages/${messageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "read" })
      });
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
