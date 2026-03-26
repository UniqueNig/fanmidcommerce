"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {  gql } from "@apollo/client";
import AuthCard from "@/src/components/auth/AuthCard";
import AuthInput from "@/src/components/auth/AuthInput";
import { Loader2 } from "lucide-react";
import { useMutation } from "@apollo/client/react";

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
        email
        role
      }
    }
  }
`;

type FieldErrors = {
  email?: string;
  password?: string;
};

type LoginResponse = {
  login: {
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
  };
};

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState("");

  const [login, { loading }] = useMutation<LoginResponse>(LOGIN_MUTATION);

  const validate = (): boolean => {
    const newErrors: FieldErrors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Enter a valid email address";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    try {
      const { data } = await login({ variables: { email, password } });
      if (!data) {
        setServerError("Login failed. Please try again.");
        return;
      }
      localStorage.setItem("token", data.login.token);
      router.push("/");
    } catch (err: any) {
      setServerError(
        err.message?.includes("Invalid credentials")
          ? "Incorrect email or password"
          : "Something went wrong. Please try again."
      );
    }
  };

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to your FanMid account"
      footerText="Don't have an account?"
      footerLinkText="Create one"
      footerLinkHref="/register"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">

        <AuthInput
          label="Email address"
          type="email"
          value={email}
          // onChange={(v) => { setEmail(v); setErrors((e) => ({ ...e, email: undefined })); }}
          placeholder="you@example.com"
          error={errors.email}
          success={!errors.email && email.includes("@")}
          // autoComplete="email"
        />

        <AuthInput
          label="Password"
          type="password"
          value={password}
          // onChange={(v) => { setPassword(v); setErrors((e) => ({ ...e, password: undefined })); }}
          placeholder="••••••••"
          error={errors.password}
          // autoComplete="current-password"
        />

        {/* Forgot password */}
        <div className="flex justify-end -mt-2">
          <button
            type="button"
            className="text-xs font-['DM_Sans'] transition-opacity hover:opacity-60"
            style={{ color: "var(--text-muted)" }}
          >
            Forgot password?
          </button>
        </div>

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

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-4 text-sm font-bold tracking-widest uppercase font-['DM_Sans'] transition-all duration-300 disabled:opacity-60 mt-2 hover:opacity-90"
          style={{ backgroundColor: "var(--accent)", color: "#000" }}
        >
          {loading ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>
    </AuthCard>
  );
}