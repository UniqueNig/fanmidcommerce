// "use client";

// import { useState } from "react";
// import { Save, Lock, Trash2, Check } from "lucide-react";
// import AuthInput from "@/src/components/auth/AuthInput";

// export default function ProfilePage() {
//   const [name, setName] = useState("John Doe");
//   const [email, setEmail] = useState("johndoe@gmail.com");
//   const [phone, setPhone] = useState("+234 801 234 5678");
//   const [saved, setSaved] = useState(false);

//   const [currentPassword, setCurrentPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [pwSaved, setPwSaved] = useState(false);
//   const [pwError, setPwError] = useState("");

//   const handleProfileSave = (e: React.FormEvent) => {
//     e.preventDefault();
//     setSaved(true);
//     setTimeout(() => setSaved(false), 2500);
//     // TODO: wire up updateUser mutation
//   };

//   const handlePasswordSave = (e: React.FormEvent) => {
//     e.preventDefault();
//     setPwError("");
//     if (newPassword !== confirmPassword) {
//       setPwError("Passwords do not match");
//       return;
//     }
//     if (newPassword.length < 8) {
//       setPwError("Password must be at least 8 characters");
//       return;
//     }
//     setPwSaved(true);
//     setCurrentPassword("");
//     setNewPassword("");
//     setConfirmPassword("");
//     setTimeout(() => setPwSaved(false), 2500);
//     // TODO: wire up changePassword mutation
//   };

//   return (
//     <div className="space-y-8 max-w-2xl">

//       {/* Header */}
//       <div>
//         <h2
//           className="text-2xl font-black font-['Playfair_Display']"
//           style={{ color: "var(--text-primary)" }}
//         >
//           Profile
//         </h2>
//         <p
//           className="text-sm font-['DM_Sans'] mt-1"
//           style={{ color: "var(--text-muted)" }}
//         >
//           Manage your personal information and account settings.
//         </p>
//       </div>

//       {/* Avatar */}
//       <div className="flex items-center gap-5">
//         <div
//           className="w-16 h-16 flex items-center justify-center text-2xl font-black font-['Playfair_Display'] flex-shrink-0"
//           style={{ backgroundColor: "var(--accent)", color: "#000" }}
//         >
//           {name.charAt(0).toUpperCase()}
//         </div>
//         <div>
//           <p
//             className="text-sm font-bold font-['DM_Sans']"
//             style={{ color: "var(--text-primary)" }}
//           >
//             {name}
//           </p>
//           <p
//             className="text-xs font-['DM_Sans'] mt-0.5"
//             style={{ color: "var(--text-muted)" }}
//           >
//             {email}
//           </p>
//           <p
//             className="text-[10px] tracking-widest uppercase mt-1 font-['DM_Sans'] font-bold"
//             style={{ color: "var(--accent)" }}
//           >
//             Member since Jan 2025
//           </p>
//         </div>
//       </div>

//       {/* Personal info */}
//       <div
//         className="border p-6"
//         style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border)" }}
//       >
//         <h3
//           className="text-xs tracking-[0.2em] uppercase font-bold font-['DM_Sans'] mb-6"
//           style={{ color: "var(--text-muted)" }}
//         >
//           Personal Information
//         </h3>
//         <form onSubmit={handleProfileSave} className="flex flex-col gap-5">
//           <AuthInput
//             label="Full Name"
//             value={name}
//             onChange={setName}
//             placeholder="Your full name"
//             success={name.trim().length > 1}
//           />
//           <AuthInput
//             label="Email Address"
//             type="email"
//             value={email}
//             onChange={setEmail}
//             placeholder="your@email.com"
//             success={email.includes("@")}
//           />
//           <div className="flex flex-col gap-1.5">
//             <label
//               className="text-[10px] tracking-[0.2em] uppercase font-bold font-['DM_Sans']"
//               style={{ color: "var(--text-muted)" }}
//             >
//               Phone Number
//             </label>
//             <input
//               type="tel"
//               value={phone}
//               onChange={(e) => setPhone(e.target.value)}
//               placeholder="+234 800 000 0000"
//               className="w-full px-4 py-3.5 text-sm font-['DM_Sans'] outline-none border transition-all duration-200"
//               style={{
//                 backgroundColor: "var(--bg-primary)",
//                 borderColor: "var(--border)",
//                 color: "var(--text-primary)",
//               }}
//             />
//           </div>

//           <div className="flex justify-end">
//             <button
//               type="submit"
//               className="flex items-center gap-2 px-6 py-3 text-xs font-bold tracking-widest uppercase font-['DM_Sans'] transition-all duration-300 hover:opacity-80"
//               style={{
//                 backgroundColor: saved ? "#22c55e" : "var(--accent)",
//                 color: "#000",
//               }}
//             >
//               {saved ? <><Check size={13} /> Saved!</> : <><Save size={13} /> Save Changes</>}
//             </button>
//           </div>
//         </form>
//       </div>

//       {/* Change password */}
//       <div
//         className="border p-6"
//         style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border)" }}
//       >
//         <div className="flex items-center gap-2 mb-6">
//           <Lock size={14} style={{ color: "var(--accent)" }} />
//           <h3
//             className="text-xs tracking-[0.2em] uppercase font-bold font-['DM_Sans']"
//             style={{ color: "var(--text-muted)" }}
//           >
//             Change Password
//           </h3>
//         </div>
//         <form onSubmit={handlePasswordSave} className="flex flex-col gap-5">
//           <AuthInput
//             label="Current Password"
//             type="password"
//             value={currentPassword}
//             onChange={setCurrentPassword}
//             placeholder="••••••••"
//           />
//           <AuthInput
//             label="New Password"
//             type="password"
//             value={newPassword}
//             onChange={(v) => { setNewPassword(v); setPwError(""); }}
//             placeholder="••••••••"
//             error={pwError}
//           />
//           <AuthInput
//             label="Confirm New Password"
//             type="password"
//             value={confirmPassword}
//             onChange={(v) => { setConfirmPassword(v); setPwError(""); }}
//             placeholder="••••••••"
//             success={confirmPassword.length > 0 && confirmPassword === newPassword}
//           />

//           <div className="flex justify-end">
//             <button
//               type="submit"
//               className="flex items-center gap-2 px-6 py-3 text-xs font-bold tracking-widest uppercase font-['DM_Sans'] transition-all duration-300 hover:opacity-80"
//               style={{
//                 backgroundColor: pwSaved ? "#22c55e" : "var(--accent)",
//                 color: "#000",
//               }}
//             >
//               {pwSaved ? <><Check size={13} /> Updated!</> : <><Lock size={13} /> Update Password</>}
//             </button>
//           </div>
//         </form>
//       </div>

//       {/* Danger zone */}
//       <div
//         className="border p-6"
//         style={{
//           backgroundColor: "var(--card-bg)",
//           borderColor: "color-mix(in srgb, #ef4444 30%, transparent)",
//         }}
//       >
//         <h3
//           className="text-xs tracking-[0.2em] uppercase font-bold font-['DM_Sans'] mb-2"
//           style={{ color: "#ef4444" }}
//         >
//           Danger Zone
//         </h3>
//         <p
//           className="text-sm font-['DM_Sans'] mb-4"
//           style={{ color: "var(--text-muted)" }}
//         >
//           Permanently delete your account and all associated data. This action cannot be undone.
//         </p>
//         <button
//           className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold tracking-widest uppercase font-['DM_Sans'] border transition-opacity hover:opacity-70"
//           style={{ borderColor: "#ef4444", color: "#ef4444" }}
//         >
//           <Trash2 size={13} />
//           Delete Account
//         </button>
//       </div>
//     </div>
//   );
// }

import React from "react";

const EditProduct = ({ params }: { params: { id: string } }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold">Edit Product: {params.id}</h1>
    </div>
  );
};

export default EditProduct;
