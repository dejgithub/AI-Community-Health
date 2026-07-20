"use client";

import { Toaster as HotToaster, toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

function Toaster() {
  return (
    <HotToaster
      position="bottom-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "hsl(var(--background))",
          color: "hsl(var(--foreground))",
          border: "1px solid hsl(var(--border))",
          borderRadius: "0.5rem",
          padding: "12px 16px",
          fontSize: "14px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        },
        success: {
          iconTheme: {
            primary: "hsl(142, 76%, 36%)",
            secondary: "hsl(142, 76%, 96%)",
          },
        },
        error: {
          iconTheme: {
            primary: "hsl(0, 84%, 60%)",
            secondary: "hsl(0, 84%, 96%)",
          },
        },
      }}
    />
  );
}

function showToast(
  message: string,
  type: "success" | "error" | "loading" | "info" = "success"
) {
  switch (type) {
    case "success":
      return toast.success(message);
    case "error":
      return toast.error(message);
    case "loading":
      return toast.loading(message);
    default:
      return toast(message);
  }
}

function dismissToast(toastId?: string) {
  if (toastId) {
    toast.dismiss(toastId);
  } else {
    toast.dismiss();
  }
}

export { Toaster, showToast, dismissToast, toast };
