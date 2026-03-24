"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { gql } from "@apollo/client";
import AuthCard from "@/src/components/auth/AuthCard";
import AuthInput from "@/src/components/auth/AuthInput";
import { Loader2, Check } from "lucide-react";
import { useMutation } from "@apollo/client/react";

const REGISTER_MUTATION = gql`
  mutation Register($name: String!, $email: String!, $password: String!) {
    register(name: $name, email: $email, password: $password) {
      id
      email
    }
  }
`;

type FieldErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirm?: string;
};

const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One number", test: (p: string) => /[0-9]/.test(p) },
];

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState("");
  const [showRules, setShowRules] = useState(false);

  const [register, { loading }] = useMutation(REGISTER_MUTATION);

  const validate = (): boolean => {
    const newErrors: FieldErrors = {};
    if (!name.trim()) newErrors.name = "Full name is required";
    if (!email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Enter a valid email address";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (!confirm) newErrors.confirm = "Please confirm your password";
    else if (confirm !== password) newErrors.confirm = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    try {
      await register({ variables: { name, email, password } });
      // Auto redirect to login after registration
      router.push("/login?registered=true");
    } catch (err: any) {
      setServerError(
        err.message?.includes("already exists")
          ? "An account with this email already exists"
          : "Something went wrong. Please try again."
      );
    }
  };

  return (
    <AuthCard
      title="Create account"
      subtitle="Join FanMid and elevate your style"
      footerText="Already have an account?"
      footerLinkText="Sign in"
      footerLinkHref="/login"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">

        <AuthInput
          label="Full name"
          type="text"
          value={name}
          onChange={(v) => { setName(v); setErrors((e) => ({ ...e, name: undefined })); }}
          placeholder="John Doe"
          error={errors.name}
          success={!errors.name && name.trim().length > 1}
          autoComplete="name"
        />

        <AuthInput
          label="Email address"
          type="email"
          value={email}
          onChange={(v) => { setEmail(v); setErrors((e) => ({ ...e, email: undefined })); }}
          placeholder="you@example.com"
          error={errors.email}
          success={!errors.email && email.includes("@")}
          autoComplete="email"
        />

        <div>
          <AuthInput
            label="Password"
            type="password"
            value={password}
            onChange={(v) => {
              setPassword(v);
              setErrors((e) => ({ ...e, password: undefined }));
            }}
            placeholder="••••••••"
            error={errors.password}
            autoComplete="new-password"
          />

          {/* Password strength rules */}
          {(showRules || password.length > 0) && (
            <div className="mt-2 flex flex-col gap-1">
              {PASSWORD_RULES.map((rule) => {
                const passed = rule.test(password);
                return (
                  <div
                    key={rule.label}
                    className="flex items-center gap-2 text-[11px] font-['DM_Sans']"
                    style={{ color: passed ? "#22c55e" : "var(--text-muted)" }}
                  >
                    <Check size={10} strokeWidth={3} />
                    {rule.label}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <AuthInput
          label="Confirm password"
          type="password"
          value={confirm}
          onChange={(v) => { setConfirm(v); setErrors((e) => ({ ...e, confirm: undefined })); }}
          placeholder="••••••••"
          error={errors.confirm}
          success={!errors.confirm && confirm.length > 0 && confirm === password}
          autoComplete="new-password"
        />

        {/* Server error */}
        {serverError && (
          <div
            className="px-4 py-3 text-sm font-['DM_Sans'] border"
            style={{
              backgroundColor: "color-mix(in srgb, #ef4444 10%, transparent)",
              borderColor: "color-mix(in srgb, #ef4444 30%, transparent)",
              color: "#ef4444",
            }}
          >
            {serverError}
          </div>
        )}

        {/* Terms */}
        <p
          className="text-[11px] font-['DM_Sans'] leading-relaxed"
          style={{ color: "var(--text-muted)" }}
        >
          By creating an account, you agree to our{" "}
          <span
            className="underline cursor-pointer hover:opacity-70 transition-opacity"
            style={{ color: "var(--accent)" }}
          >
            Terms of Service
          </span>{" "}
          and{" "}
          <span
            className="underline cursor-pointer hover:opacity-70 transition-opacity"
            style={{ color: "var(--accent)" }}
          >
            Privacy Policy
          </span>
          .
        </p>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-4 text-sm font-bold tracking-widest uppercase font-['DM_Sans'] transition-all duration-300 disabled:opacity-60 hover:opacity-90"
          style={{ backgroundColor: "var(--accent)", color: "#000" }}
        >
          {loading ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </button>
      </form>
    </AuthCard>
  );
}