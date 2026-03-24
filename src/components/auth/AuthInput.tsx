"use client";

import { useState } from "react";
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";

type AuthInputProps = {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  success?: boolean;
  autoComplete?: string;
};

export default function AuthInput({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  success,
  autoComplete,
}: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  const borderColor = error
    ? "#ef4444"
    : success
    ? "#22c55e"
    : focused
    ? "var(--accent)"
    : "var(--border)";

  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-[10px] tracking-[0.2em] uppercase font-bold font-['DM_Sans']"
        style={{ color: "var(--text-muted)" }}
      >
        {label}
      </label>

      <div className="relative">
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="w-full px-4 py-3.5 text-sm font-['DM_Sans'] outline-none transition-all duration-200 pr-10"
          style={{
            backgroundColor: "var(--bg-primary)",
            border: `1px solid ${borderColor}`,
            color: "var(--text-primary)",
            boxShadow: focused
              ? `0 0 0 3px color-mix(in srgb, ${borderColor} 15%, transparent)`
              : "none",
          }}
        />

        {/* Right icon */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
          {isPassword ? (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="transition-opacity hover:opacity-60"
              style={{ color: "var(--text-muted)" }}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          ) : error ? (
            <AlertCircle size={15} color="#ef4444" />
          ) : success ? (
            <CheckCircle2 size={15} color="#22c55e" />
          ) : null}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <p className="text-xs font-['DM_Sans'] flex items-center gap-1.5" style={{ color: "#ef4444" }}>
          <AlertCircle size={11} />
          {error}
        </p>
      )}
    </div>
  );
}