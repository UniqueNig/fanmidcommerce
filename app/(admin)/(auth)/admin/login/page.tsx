"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { gql } from "@apollo/client";
import { Lock, Loader2, Shield } from "lucide-react";
import { useMutation } from "@apollo/client/react";
import { useFormik } from "formik";
import * as yup from "yup";
import AuthInput from "@/src/components/auth/AuthInput";

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        role
      }
    }
  }
`;

type LoginResponse = {
  login: {
    token: string;
    user: {
      id: string;
      email: string;
      role: string;
    };
  };
};

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [login, { loading }] = useMutation<LoginResponse>(LOGIN_MUTATION, {
    onCompleted: (data) => {
      if (data.login.user.role !== "admin") {
        setError("Access denied. Admin accounts only.");
        document.cookie = "token=; Max-Age=0; path=/"; // clear token
        return;
      }
      // localStorage.setItem("token", data.login.token);
      const isProduction = process.env.NODE_ENV === "production";

      // Determine cookie name
      const cookieName =
        data.login.user.role === "admin" ? "admin_token" : "user_token";

      // Clear previous token of the same role
      document.cookie = `${cookieName}=; Max-Age=0; path=/`;

      // Store new token
      document.cookie = `${cookieName}=${data.login.token}; path=/; max-age=604800; SameSite=Strict;${isProduction ? " Secure;" : ""}`;
      router.push("/admin/dashboard");
      router.refresh(); // 🔥 force new request with fresh cookie
    },
    onError: (err) => {
      setError(
        err.message?.includes("Invalid credentials")
          ? "Incorrect email or password"
          : "Something went wrong. Please try again.",
      );
    },
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      setError("");
      // ✅ Clear any leftover token first
      // localStorage.removeItem("token");
      // document.cookie = "token=; Max-Age=0; path=/"; // also clear old cookie if needed

      await login({
        variables: {
          email: values.email,
          password: values.password,
        },
      });
    },

    validationSchema: yup.object().shape({
      email: yup
        .string()
        .email("Enter a valid email address")
        .required("Email is required"),
      password: yup
        .string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
  });

  const inputStyle = {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderColor: "rgba(255,255,255,0.1)",
    color: "#fff",
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#080808" }}
      >
        <Loader2 className="animate-spin" size={24} />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "#080808" }}
    >
      {/* Grid bg */}
      <div
        className="fixed inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px] opacity-10 pointer-events-none"
        style={{ backgroundColor: "#c8a96e" }}
      />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <Shield size={20} style={{ color: "#c8a96e" }} />
            <span className="text-2xl font-black tracking-tighter font-['Playfair_Display'] text-white">
              FAN<span style={{ color: "#c8a96e" }}>MID</span>
            </span>
          </div>
          <p
            className="text-[10px] tracking-[0.3em] uppercase font-['DM_Sans']"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            Admin Portal
          </p>
        </div>

        {/* Card */}
        <div
          className="border p-8"
          style={{
            backgroundColor: "rgba(255,255,255,0.03)",
            borderColor: "rgba(255,255,255,0.08)",
          }}
        >
          <h1 className="text-xl font-black font-['Playfair_Display'] text-white mb-1">
            Sign in
          </h1>
          <p
            className="text-xs font-['DM_Sans'] mb-7"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            Restricted to authorized administrators only
          </p>

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <AuthInput
              name="email"
              label="Email address"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="you@example.com"
              error={formik.errors.email}
              touched={formik.touched.email}
              success={
                !formik.errors.email &&
                formik.touched.email &&
                formik.values.email.includes("@")
              }
            />

            <AuthInput
              name="password"
              label="Password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="••••••••"
              error={formik.errors.password}
              touched={formik.touched.password}
            />

            {error && (
              <div
                className="px-4 py-3 text-xs font-['DM_Sans'] border"
                style={{
                  backgroundColor: "rgba(239,68,68,0.1)",
                  borderColor: "rgba(239,68,68,0.3)",
                  color: "#ef4444",
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 text-sm font-bold tracking-widest uppercase font-['DM_Sans'] transition-opacity hover:opacity-80 disabled:opacity-50 mt-2"
              style={{ backgroundColor: "#c8a96e", color: "#000" }}
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Signing in...
                </>
              ) : (
                <>
                  <Lock size={14} /> Access Admin Panel
                </>
              )}
            </button>
          </form>
        </div>

        <p
          className="text-center text-[10px] font-['DM_Sans'] mt-6"
          style={{ color: "rgba(255,255,255,0.2)" }}
        >
          FanMid Admin v1.0 · Unauthorized access is prohibited
        </p>
      </div>
    </div>
  );
}
