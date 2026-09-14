"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAlert } from "@/components/ui/AlertModal";
import { placeholderImages } from "@/lib/content/placeholderImages";
import logo from "@/assets/brand/logo-transparent.png";
import styles from "./login.module.css";

export default function AdminLoginPage() {
  const router = useRouter();
  const { showAlert } = useAlert();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const json = await res.json();

      if (!res.ok) {
        showAlert({
          title: "Sign in failed",
          message: json.error?.message ?? "Something went wrong.",
          variant: "error"
        });
        return;
      }

      router.push("/admin");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.page}>
      <Image src={placeholderImages.homeHero} alt="" fill sizes="100vw" className={styles.bgImage} />
      <div className={styles.scrim} />
      <div className={styles.card}>
        <div className={styles.brand}>
          <Image src={logo} alt="William & Helen Heritage Foundation" width={56} height={56} />
        </div>
        <form onSubmit={handleSubmit} className="stack">
          <div className={styles.heading}>
            <h1>Admin sign in</h1>
            <p className={styles.subtitle}>Staff access only.</p>
          </div>
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
