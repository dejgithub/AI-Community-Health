"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api-client";
import { useAppStore } from "@/lib/store";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { setToken, setUser } = useAppStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await api.auth.login({ email: data.email, password: data.password });
      setToken(result.access_token);
      setUser(result.user);
      router.replace("/medications");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Welcome Back
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to access your health dashboard and AI assistant.
        </p>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              {...register("email")}
              type="email"
              placeholder="you@example.com"
              className="pl-10 h-11"
            />
          </div>
          {errors.email && (
            <p className="mt-1.5 flex items-center gap-1 text-xs text-destructive">
              <AlertCircle className="h-3 w-3" />
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Password
            </label>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="pl-10 pr-10 h-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1.5 flex items-center gap-1 text-xs text-destructive">
              <AlertCircle className="h-3 w-3" />
              {errors.password.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 bg-gradient-to-r from-primary to-accent text-white font-semibold hover:opacity-90 transition-opacity"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Signing in...
            </div>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold text-primary hover:text-primary/80">
          Create an account
        </Link>
      </p>

      <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950/20">
        <p className="text-xs leading-relaxed text-amber-700 dark:text-amber-400">
          <span className="font-semibold">Disclaimer:</span> This platform
          provides general health information only and is not a substitute for
          professional medical advice.
        </p>
      </div>
    </motion.div>
  );
}
