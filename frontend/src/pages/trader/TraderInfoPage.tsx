import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useGetInfo } from "../../features/users/hooks/useGetInfo";
import { useEditInfo } from "../../features/users/hooks/useEditInfo";
import { useNavigate } from "react-router-dom";


type FormState = {
  name: string;
  email: string;
  phone: string;
};

function InputField({
  label,
  type = "text",
  value,
  onChange,
  placeholder = "",
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-zinc-700">{label}</label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-500"
      />
    </div>
  );
}

export default function EditUserInfoPage() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
  });

  const { data, isLoading, isError, error } = useGetInfo();

  const { mutate: editUserInfo, isPending } = useEditInfo();
   const navigate = useNavigate();

  useEffect(() => {
    if (!data) return;

    setForm({
      name: data?.name ?? "",
      email: data?.email ?? "",
      phone: data?.phone ?? "",
    });
  }, [data]);

  const handleSave = () => {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!form.email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!form.phone.trim()) {
      toast.error("Phone is required");
      return;
    }

    editUserInfo(
      {
        email: form.email,
        phone: form.phone,
      },
      {
        onSuccess: (data) => {
          toast.success(data || "Profile updated successfully");
        },
        onError: (error: any) => {
          toast.error(error?.response?.data || "Something went wrong");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f5f7fb]">
        <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center p-4">
          <div className="w-full rounded-3xl border border-zinc-200 bg-white p-8 text-sm text-zinc-600 shadow-sm">
            Loading user information...
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#f5f7fb]">
        <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center p-4">
          <div className="w-full rounded-3xl border border-red-200 bg-white p-8 text-sm text-red-600 shadow-sm">
            Error loading user information
            <p className="mt-1">
              {error instanceof Error ? error.message : "Unknown error"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center p-4">
        
        <div className="w-full rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
               <button
            type="button"
            aria-label="Back"
            onClick={() => navigate(-1)}
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-zinc-700 transition hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 active:scale-95"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </button>
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-zinc-900">Edit Profile</h2>
            <p className="mt-2 text-sm text-zinc-500">
              Update your personal information below.
            </p>
          </div>

          <div className="space-y-5">
    

            <InputField
              label="Email"
              type="email"
              value={form.email}
              onChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  email: value,
                }))
              }
              placeholder="Enter your email"
            />

            <InputField
              label="Phone"
              type="tel"
              value={form.phone}
              onChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  phone: value,
                }))
              }
              placeholder="Enter phone number"
            />
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="button"
              disabled={isPending}
              onClick={handleSave}
              className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${
                isPending
                  ? "cursor-not-allowed bg-zinc-300 text-zinc-500"
                  : "bg-zinc-900 text-white hover:bg-zinc-800"
              }`}
            >
              {isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}