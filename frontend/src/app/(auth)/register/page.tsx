"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  AlertCircle,
  Calendar,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api-client";
import { useAppStore } from "@/lib/store";

const registerSchema = z
  .object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().min(10, "Please enter a valid phone number"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    role: z.enum(["patient", "doctor"], {
      required_error: "Please select a role",
    }),
    bloodGroup: z.string().optional(),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    agreeTerms: z.literal(true, {
      errorMap: () => ({ message: "You must agree to the terms" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

const bloodGroups = [
  { value: "A+", label: "A+" },
  { value: "A-", label: "A-" },
  { value: "B+", label: "B+" },
  { value: "B-", label: "B-" },
  { value: "AB+", label: "AB+" },
  { value: "AB-", label: "AB-" },
  { value: "O+", label: "O+" },
  { value: "O-", label: "O-" },
];

const roles = [
  { value: "patient", label: "Patient" },
  { value: "doctor", label: "Doctor / Healthcare Provider" },
];

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { setToken, setUser } = useAppStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await api.auth.register({
        email: data.email,
        name: data.fullName,
        phone: data.phone,
        password: data.password,
        role: data.role,
        blood_group: data.bloodGroup,
        date_of_birth: data.dateOfBirth,
      });
      setToken(result.access_token);
      setUser(result.user);
      router.replace("/medications");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
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
          Create Your Account
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Join MediConnect AI to access AI-powered healthcare tools.
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
          <label className="mb-1.5 block text-sm font-medium text-foreground">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input {...register("fullName")} placeholder="John Doe" className="pl-10 h-11" />
          </div>
          {errors.fullName && (
            <p className="mt-1.5 flex items-center gap-1 text-xs text-destructive">
              <AlertCircle className="h-3 w-3" /> {errors.fullName.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input {...register("email")} type="email" placeholder="you@example.com" className="pl-10 h-11" />
          </div>
          {errors.email && (
            <p className="mt-1.5 flex items-center gap-1 text-xs text-destructive">
              <AlertCircle className="h-3 w-3" /> {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Phone Number</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input {...register("phone")} type="tel" placeholder="+251 911 123456" className="pl-10 h-11" />
          </div>
          {errors.phone && (
            <p className="mt-1.5 flex items-center gap-1 text-xs text-destructive">
              <AlertCircle className="h-3 w-3" /> {errors.phone.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Date of Birth</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input {...register("dateOfBirth")} type="date" className="pl-10 h-11" />
            </div>
            {errors.dateOfBirth && (
              <p className="mt-1.5 flex items-center gap-1 text-xs text-destructive">
                <AlertCircle className="h-3 w-3" /> {errors.dateOfBirth.message}
              </p>
            )}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Blood Group</label>
            <div className="relative">
              <Heart className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <select
                {...register("bloodGroup")}
                className="flex h-11 w-full appearance-none rounded-md border border-input bg-transparent pl-10 pr-8 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">Select</option>
                {bloodGroups.map((bg) => (
                  <option key={bg.value} value={bg.value}>{bg.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">I am a</label>
          <select
            {...register("role")}
            className="flex h-11 w-full appearance-none rounded-md border border-input bg-transparent px-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">Select your role</option>
            {roles.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
          {errors.role && (
            <p className="mt-1.5 flex items-center gap-1 text-xs text-destructive">
              <AlertCircle className="h-3 w-3" /> {errors.role.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Min. 8 characters"
              className="pl-10 pr-10 h-11"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1.5 flex items-center gap-1 text-xs text-destructive">
              <AlertCircle className="h-3 w-3" /> {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              {...register("confirmPassword")}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter your password"
              className="pl-10 pr-10 h-11"
            />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1.5 flex items-center gap-1 text-xs text-destructive">
              <AlertCircle className="h-3 w-3" /> {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            {...register("agreeTerms")}
            id="terms"
            className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary"
          />
          <label htmlFor="terms" className="text-sm text-muted-foreground">
            I agree to the{" "}
            <a href="#" className="font-medium text-primary hover:underline">Terms of Service</a>{" "}
            and{" "}
            <a href="#" className="font-medium text-primary hover:underline">Privacy Policy</a>
          </label>
        </div>
        {errors.agreeTerms && (
          <p className="flex items-center gap-1 text-xs text-destructive">
            <AlertCircle className="h-3 w-3" /> {errors.agreeTerms.message}
          </p>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 bg-gradient-to-r from-primary to-accent text-white font-semibold hover:opacity-90 transition-opacity"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Creating account...
            </div>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-primary hover:text-primary/80">
          Sign in
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
