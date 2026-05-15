import { useState } from "react";

import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../../contexts/AuthProvider";
import { useLogin } from "../hooks/useLogin";

function LinktreeLogo() {
  return (
    <div className="flex items-center gap-2 text-black">
      <span className="text-[26px] font-extrabold tracking-tight">Linktree</span>
      <div className="relative h-7 w-7">
        <span className="absolute left-1/2 top-0 h-7 w-[3px] -translate-x-1/2 rounded-full bg-lime-500" />
        <span className="absolute left-0 top-1/2 h-[3px] w-7 -translate-y-1/2 rounded-full bg-lime-500" />
        <span className="absolute left-[4px] top-[4px] h-[3px] w-5 rotate-45 rounded-full bg-lime-500" />
        <span className="absolute left-[4px] top-[4px] h-[3px] w-5 -rotate-45 rounded-full bg-lime-500" />
      </div>
    </div>
  );
}

function InputField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
}: {
  label: string;
  type?: string;
  placeholder: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-zinc-700">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="h-12 w-full rounded-xl border border-zinc-200 bg-[#f2f2ef] px-4 text-sm outline-none transition focus:border-zinc-400 focus:bg-white"
      />
    </div>
  );
}

function SocialCircle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg">
      {children}
    </div>
  );
}

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlayIcon({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M8 5.5v13l10-6.5-10-6.5z" />
    </svg>
  );
}

function StarIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 2.8l2.2 6.4h6.8l-5.5 4 2.1 6.6-5.6-4-5.6 4 2.1-6.6-5.5-4h6.8L12 2.8z" />
    </svg>
  );
}

function TwitterXIcon() {
  return <span className="text-[28px] font-bold leading-none">𝕏</span>;
}

function YoutubeIcon() {
  return (
    <div className="relative h-7 w-10 rounded-[10px] bg-white">
      <div className="absolute left-[15px] top-1/2 h-0 w-0 -translate-y-1/2 border-b-[7px] border-l-[11px] border-t-[7px] border-b-transparent border-l-slate-900 border-t-transparent" />
    </div>
  );
}

function TikTokIcon() {
  return <span className="text-[26px] font-bold leading-none">♪</span>;
}

function ActionButton({
  loading,
  label,
  onClick,
}: {
  loading: boolean;
  label: string;
  onClick: () => Promise<void> | void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`h-14 w-full rounded-xl text-lg font-semibold transition ${loading
          ? "cursor-not-allowed bg-[#cfcfc7] text-zinc-500 opacity-80"
          : "bg-[#d9d9d2] text-zinc-700 hover:bg-[#cfcfc7]"
        }`}
    >
      {loading ? "Loading..." : label}
    </button>
  );
}

function RightShowcase() {
  return (
    <div className="relative hidden min-h-screen overflow-hidden bg-[#cfa031] lg:flex lg:w-1/2 items-center justify-center">
      <div className="absolute right-16 top-10 h-80 w-56 rotate-[18deg] rounded-[120px] border-[10px] border-[#0f3e3e] bg-gradient-to-br from-transparent via-[#6f4ba4]/20 to-[#182032] shadow-2xl" />

      <div className="absolute left-10 top-12 rounded-3xl bg-fuchsia-500 px-7 py-6 text-white shadow-2xl">
        <div className="mb-5 flex items-center justify-between gap-5">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-orange-200 ring-4 ring-fuchsia-400" />
            <div>
              <div className="h-2 w-16 rounded-full bg-fuchsia-300" />
              <div className="mt-2 h-2 w-12 rounded-full bg-fuchsia-300/80" />
            </div>
          </div>
          <div className="rounded-xl bg-white/90 p-2 text-fuchsia-500">
            <div className="h-5 w-5 rounded-md border-2 border-current" />
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-full bg-white px-6 py-4 text-zinc-900 shadow-lg">
          <StarIcon className="h-5 w-5 text-black" />
          <span className="text-[18px] font-medium">/shapeshft3rs</span>
        </div>
      </div>

      <div className="relative h-[680px] w-[300px] rounded-[36px] bg-gradient-to-b from-[#9b5a2e] via-[#d59a68] to-[#b56d3f] p-8 shadow-2xl">
        <div className="mb-8 flex flex-col items-center pt-6 text-center text-white">
          <div className="mb-4 h-24 w-24 rounded-full bg-orange-200 shadow-lg" />
          <h3 className="text-[34px] font-bold leading-none">Nikole Brake</h3>
          <p className="mt-2 text-lg text-white/90">Founder of Shape Shifters</p>
        </div>

        <div className="space-y-4">
          {["Slow flow", "Online courses", "Wellness retreats"].map((item) => (
            <div
              key={item}
              className="flex items-center justify-between rounded-full bg-[#e8ddd4] px-8 py-5 text-[18px] font-medium text-zinc-800 shadow"
            >
              <span>{item}</span>
              <ChevronDownIcon />
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-28 left-24 flex items-center gap-5">
        <SocialCircle>
          <TwitterXIcon />
        </SocialCircle>
        <SocialCircle>
          <YoutubeIcon />
        </SocialCircle>
        <SocialCircle>
          <TikTokIcon />
        </SocialCircle>
      </div>

      <div className="absolute bottom-12 right-16 h-72 w-72 rounded-[34px] bg-gradient-to-br from-[#eeb26d] to-[#c67a3a] shadow-2xl">
        <div className="absolute inset-0 rounded-[34px] bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.22),transparent_35%)]" />
        <div className="absolute bottom-8 left-8 flex h-20 w-20 items-center justify-center rounded-full bg-white text-zinc-900 shadow-xl">
          <PlayIcon className="ml-1 h-9 w-9" />
        </div>
      </div>
    </div>
  );
}

type loginComponentProps = {
  setMode: React.Dispatch<
    React.SetStateAction<"login" | "signup">
  >;
};

export function LoginComponent({
  setMode
}: loginComponentProps) {
  //const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mutate, isPending, error } = useLogin();
  const { login } = useAuth()
  const navigate = useNavigate();

  const handleLogin = async () => {
    mutate(
      {
        email: email,
        password: password,
      },
      {
        onSuccess: (data) => {
          login(data.msg)
          navigate("/user");

        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data.msg || "Something went wrong"
          );
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-[#f5f5f3] lg:flex">
      <div className="flex min-h-screen w-full flex-col px-6 py-10 sm:px-10 lg:w-1/2 lg:px-14 xl:px-20">
        <div className="mb-10">
          <LinktreeLogo />
        </div>

        <div className="mx-auto flex w-full max-w-[470px] flex-1 flex-col justify-center pb-16">
          <div className="mb-10 text-center">
            <h1 className="text-5xl font-extrabold tracking-tight text-black">Login</h1>
            <p className="mt-4 text-2xl text-zinc-600">Welcome back</p>
          </div>

          <div className="space-y-5">
            <InputField
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <InputField
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <ActionButton loading={isPending} onClick={handleLogin} label="Continue" />
          </div>

          <p className="mt-10 text-center text-base leading-7 text-zinc-600">
            By clicking <span className="font-semibold text-zinc-700">Login</span>, you agree to the
            terms and privacy policy.
          </p>

          <p className="mt-10 text-center text-lg text-zinc-700">
            Don&apos;t have an account?{" "}

            <button
              type="button"
              onClick={() => setMode("signup")}
              className="font-semibold text-indigo-600 cursor-pointer"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>

      <RightShowcase />
    </div>
  );
}



