"use client";

import { useState } from "react";
import {
  Save,
  Lock,
  Check,
  Bell,
  Globe,
  Shield,
  CreditCard,
} from "lucide-react";
import AuthInput from "@/src/components/auth/AuthInput";

// ─── Admin Profile Page ──────────────────────────────────────────────────────
export function AdminProfilePage() {
  const [name, setName] = useState("Emmanuel Faniyi");
  const [email, setEmail] = useState("emmanuel@fanmid.com");
  const [saved, setSaved] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwSaved, setPwSaved] = useState(false);
  const [pwError, setPwError] = useState("");

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handlePwSave = (e: React.FormEvent) => {
    e.preventDefault();
    setPwError("");
    if (newPw !== confirmPw) {
      setPwError("Passwords do not match");
      return;
    }
    if (newPw.length < 8) {
      setPwError("Minimum 8 characters");
      return;
    }
    setPwSaved(true);
    setCurrentPw("");
    setNewPw("");
    setConfirmPw("");
    setTimeout(() => setPwSaved(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h2
          className="text-2xl font-black font-['Playfair_Display']"
          style={{ color: "var(--text-primary)" }}
        >
          My Profile
        </h2>
        <p
          className="text-sm font-['DM_Sans'] mt-1"
          style={{ color: "var(--text-muted)" }}
        >
          Manage your admin account information.
        </p>
      </div>

      {/* Avatar + role */}
      <div className="flex items-center gap-5">
        <div
          className="w-16 h-16 flex items-center justify-center text-2xl font-black font-['Playfair_Display'] flex-shrink-0"
          style={{ backgroundColor: "var(--accent)", color: "#000" }}
        >
          {name.charAt(0)}
        </div>
        <div>
          <p
            className="font-bold font-['DM_Sans']"
            style={{ color: "var(--text-primary)" }}
          >
            {name}
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <Shield size={11} style={{ color: "var(--accent)" }} />
            <span
              className="text-[10px] tracking-widest uppercase font-bold font-['DM_Sans']"
              style={{ color: "var(--accent)" }}
            >
              Super Admin
            </span>
          </div>
        </div>
      </div>

      {/* Personal info */}
      <div
        className="border p-6"
        style={{
          backgroundColor: "var(--card-bg)",
          borderColor: "var(--border)",
        }}
      >
        <h3
          className="text-[10px] tracking-[0.2em] uppercase font-bold font-['DM_Sans'] mb-5"
          style={{ color: "var(--text-muted)" }}
        >
          Personal Information
        </h3>
        <form onSubmit={handleProfileSave} className="space-y-4">
          <AuthInput
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            success={name.length > 1}
          />
          <AuthInput
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            success={email.includes("@")}
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 text-xs font-bold tracking-widest uppercase font-['DM_Sans'] hover:opacity-80 transition-all"
              style={{
                backgroundColor: saved ? "#22c55e" : "var(--accent)",
                color: "#000",
              }}
            >
              {saved ? (
                <>
                  <Check size={13} /> Saved!
                </>
              ) : (
                <>
                  <Save size={13} /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Password */}
      <div
        className="border p-6"
        style={{
          backgroundColor: "var(--card-bg)",
          borderColor: "var(--border)",
        }}
      >
        <div className="flex items-center gap-2 mb-5">
          <Lock size={14} style={{ color: "var(--accent)" }} />
          <h3
            className="text-[10px] tracking-[0.2em] uppercase font-bold font-['DM_Sans']"
            style={{ color: "var(--text-muted)" }}
          >
            Change Password
          </h3>
        </div>
        <form onSubmit={handlePwSave} className="space-y-4">
          <AuthInput
            label="Current Password"
            type="password"
            value={currentPw}
            onChange={(e) => setCurrentPw(e.target.value)}
            placeholder="••••••••"
          />
          <AuthInput
            label="New Password"
            type="password"
            value={newPw}
            onChange={(e) => {
              setNewPw(e.target.value);
              setPwError("");
            }}
            placeholder="••••••••"
            error={pwError}
          />
          <AuthInput
            label="Confirm New Password"
            type="password"
            value={confirmPw}
            onChange={(e) => {
              setConfirmPw(e.target.value);
              setPwError("");
            }}
            placeholder="••••••••"
            success={confirmPw.length > 0 && confirmPw === newPw}
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 text-xs font-bold tracking-widest uppercase font-['DM_Sans'] hover:opacity-80"
              style={{
                backgroundColor: pwSaved ? "#22c55e" : "var(--accent)",
                color: "#000",
              }}
            >
              {pwSaved ? (
                <>
                  <Check size={13} /> Updated!
                </>
              ) : (
                <>
                  <Lock size={13} /> Update Password
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Admin Settings Page ─────────────────────────────────────────────────────
export function AdminSettingsPage() {
  const [storeName, setStoreName] = useState("FanMidCommerce");
  const [currency, setCurrency] = useState("USD");
  const [contactEmail, setContactEmail] = useState("hello@fanmid.com");
  const [whatsapp, setWhatsapp] = useState("2348012345678");
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [orderNotifs, setOrderNotifs] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const Toggle = ({
    value,
    onChange,
  }: {
    value: boolean;
    onChange: (v: boolean) => void;
  }) => (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className="relative w-10 h-5 rounded-full transition-colors flex-shrink-0"
      style={{ backgroundColor: value ? "var(--accent)" : "var(--border)" }}
    >
      <div
        className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform"
        style={{ transform: value ? "translateX(20px)" : "translateX(0)" }}
      />
    </button>
  );

  const inputClass =
    "w-full px-4 py-3 text-sm font-['DM_Sans'] outline-none border transition-all";
  const inputStyle = {
    backgroundColor: "var(--bg-primary)",
    borderColor: "var(--border)",
    color: "var(--text-primary)",
  };
  const labelClass =
    "text-[10px] tracking-[0.2em] uppercase font-bold font-['DM_Sans'] block mb-1.5";

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2
          className="text-2xl font-black font-['Playfair_Display']"
          style={{ color: "var(--text-primary)" }}
        >
          Settings
        </h2>
        <p
          className="text-sm font-['DM_Sans'] mt-1"
          style={{ color: "var(--text-muted)" }}
        >
          Configure your store preferences.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Store info */}
        <div
          className="border p-6 space-y-5"
          style={{
            backgroundColor: "var(--card-bg)",
            borderColor: "var(--border)",
          }}
        >
          <div className="flex items-center gap-2">
            <Globe size={14} style={{ color: "var(--accent)" }} />
            <h3
              className="text-[10px] tracking-[0.2em] uppercase font-bold font-['DM_Sans']"
              style={{ color: "var(--text-muted)" }}
            >
              Store Information
            </h3>
          </div>
          <div>
            <label
              className={labelClass}
              style={{ color: "var(--text-muted)" }}
            >
              Store Name
            </label>
            <input
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className={inputClass}
              style={inputStyle}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className={labelClass}
                style={{ color: "var(--text-muted)" }}
              >
                Contact Email
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className={inputClass}
                style={inputStyle}
              />
            </div>
            <div>
              <label
                className={labelClass}
                style={{ color: "var(--text-muted)" }}
              >
                WhatsApp Number
              </label>
              <input
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="2348012345678"
                className={inputClass}
                style={inputStyle}
              />
            </div>
          </div>
          <div>
            <label
              className={labelClass}
              style={{ color: "var(--text-muted)" }}
            >
              Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className={inputClass}
              style={inputStyle}
            >
              {["USD", "NGN", "GBP", "EUR"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Payments */}
        <div
          className="border p-6 space-y-4"
          style={{
            backgroundColor: "var(--card-bg)",
            borderColor: "var(--border)",
          }}
        >
          <div className="flex items-center gap-2">
            <CreditCard size={14} style={{ color: "var(--accent)" }} />
            <h3
              className="text-[10px] tracking-[0.2em] uppercase font-bold font-['DM_Sans']"
              style={{ color: "var(--text-muted)" }}
            >
              Payment Gateway
            </h3>
          </div>
          <div>
            <label
              className={labelClass}
              style={{ color: "var(--text-muted)" }}
            >
              Paystack Public Key
            </label>
            <input
              type="text"
              placeholder="pk_live_xxxxxxxxxxxx"
              className={inputClass}
              style={inputStyle}
            />
          </div>
          <div>
            <label
              className={labelClass}
              style={{ color: "var(--text-muted)" }}
            >
              Paystack Secret Key
            </label>
            <input
              type="password"
              placeholder="sk_live_xxxxxxxxxxxx"
              className={inputClass}
              style={inputStyle}
            />
          </div>
          <p
            className="text-xs font-['DM_Sans']"
            style={{ color: "var(--text-muted)" }}
          >
            Get your keys from your{" "}
            <a
              href="https://dashboard.paystack.com"
              target="_blank"
              className="underline"
              style={{ color: "var(--accent)" }}
            >
              Paystack Dashboard
            </a>
            .
          </p>
        </div>

        {/* Notifications */}
        <div
          className="border p-6 space-y-4"
          style={{
            backgroundColor: "var(--card-bg)",
            borderColor: "var(--border)",
          }}
        >
          <div className="flex items-center gap-2">
            <Bell size={14} style={{ color: "var(--accent)" }} />
            <h3
              className="text-[10px] tracking-[0.2em] uppercase font-bold font-['DM_Sans']"
              style={{ color: "var(--text-muted)" }}
            >
              Notifications
            </h3>
          </div>
          {[
            {
              label: "Email Notifications",
              sub: "Receive updates about orders and customers via email",
              value: emailNotifs,
              onChange: setEmailNotifs,
            },
            {
              label: "New Order Alerts",
              sub: "Get notified immediately when a new order is placed",
              value: orderNotifs,
              onChange: setOrderNotifs,
            },
          ].map(({ label, sub, value, onChange }) => (
            <div
              key={label}
              className="flex items-center justify-between py-2 border-b"
              style={{ borderColor: "var(--border)" }}
            >
              <div>
                <p
                  className="text-sm font-bold font-['DM_Sans']"
                  style={{ color: "var(--text-primary)" }}
                >
                  {label}
                </p>
                <p
                  className="text-xs font-['DM_Sans']"
                  style={{ color: "var(--text-muted)" }}
                >
                  {sub}
                </p>
              </div>
              <Toggle value={value} onChange={onChange} />
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-8 py-3.5 text-xs font-bold tracking-widest uppercase font-['DM_Sans'] hover:opacity-80 transition-all"
            style={{
              backgroundColor: saved ? "#22c55e" : "var(--accent)",
              color: "#000",
            }}
          >
            {saved ? (
              <>
                <Check size={13} /> Saved!
              </>
            ) : (
              <>
                <Save size={13} /> Save Settings
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
