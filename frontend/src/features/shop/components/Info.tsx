
import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthProvider";
import { useGetShop } from "../hooks/useGetShop";
import { useEditShop } from "../hooks/useEditShop";
import { uploadImagesToBackend } from "../../../api/upload";
import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";



type StoreForm = {
  ShopName: string;
  logo: string;
  description: string;
  shopNumber: string;
 
};

function InfoRow(props: { label: string; value: string }) {
  const { label, value } = props;

  return (
    <div className="grid gap-2 border-b border-zinc-100 py-3 sm:grid-cols-[170px_1fr] sm:items-center">
      <div className="text-sm font-medium text-zinc-500">{label}</div>
      <div className="text-sm text-zinc-900">{value || "-"}</div>
    </div>
  );
}

function InputField(props: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  const { label, value, onChange, placeholder, type = "text" } = props;

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

function TextareaField(props: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const { label, value, onChange, placeholder } = props;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-zinc-700">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-500"
      />
    </div>
  );
}



function EditCard(props: {
  form: StoreForm;
  setForm: React.Dispatch<React.SetStateAction<StoreForm>>;
  onSave: () => void;
  loading:any;
  setLogoFile: React.Dispatch<React.SetStateAction<File | null>>;

}) {
  const { form, setForm, onSave ,loading ,setLogoFile  } = props;
  

  const handleSave = async () => {
      onSave();

  };

const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];

  if (!file) return;

  setLogoFile(file);

  setForm((prev) => ({
    ...prev,
    logo: URL.createObjectURL(file), // preview فقط
  }));
};

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        
          <h2 className="text-lg font-semibold text-zinc-900">Edit Store Data</h2>
           <button
          type="button"
          disabled={loading}
          onClick={handleSave}
          className={` rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
            loading
              ? "cursor-not-allowed bg-zinc-300 text-zinc-500"
              : "bg-zinc-900 text-white hover:bg-zinc-800"
          }`}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
         
        
        
      </div>

      <div className="space-y-3">
        <InputField
          label="Shop Name"
          value={form.ShopName}
          onChange={(value) => setForm((prev) => ({ ...prev, ShopName: value }))}
          placeholder="Enter shop name"
        />

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700">Logo</label>

          <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border border-zinc-200 bg-white">
              {form.logo ? (
                <img src={form.logo} alt={form.ShopName} className="h-full w-full object-cover" />
              ) : (
                <span className="text-[10px] text-zinc-400">No logo</span>
              )}
            </div>

            <div className="flex-1">
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />

              <label
                htmlFor="logo-upload"
                className="inline-flex cursor-pointer rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-900 transition hover:bg-zinc-100"
              >
                Change logo
              </label>

              <p className="mt-1 text-[11px] text-zinc-500">Upload logo from your device</p>
            </div>
          </div>
        </div>

        <TextareaField
          label="Description"
          value={form.description}
          onChange={(value) => setForm((prev) => ({ ...prev, description: value }))}
          placeholder="Enter description"
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <InputField
            label="Shop Number"
            value={form.shopNumber}
            onChange={(value) => setForm((prev) => ({ ...prev, shopNumber: value }))}
            placeholder="Enter shop number"
          />

        </div>
     
      </div>
    </div>
  );
}

export default function StoreSettingsPage() {
  const { storeID } = useAuth();

 if(!storeID){
  return
 }
 const [logoFile, setLogoFile] = useState<File | null>(null);
  const { data, isLoading, isError } = useGetShop(storeID);
  const { mutate, isPending } = useEditShop();

  const [form, setForm] = useState<StoreForm>({
    ShopName: "",
    logo: "",
    description: "",
    shopNumber: "",
  });

  useEffect(() => {
    if (data) {
      setForm({
        ShopName: data.ShopName,
        logo: data.logo || "",
        description: data.description || "",
        shopNumber: data.shopNumber || "",
      });
    }
  }, [data]);

  const handleSave = async  () => {
    let finalLogo = form.logo;

    if (logoFile) {
      const urls = await uploadImagesToBackend([logoFile]);
      finalLogo = urls[0];
    }

    mutate(
      {
        id: storeID,
        ShopName: form.ShopName,
        logo:finalLogo ,
        description: form.description,
        shopNumber: form.shopNumber,
      },
      {
        onSuccess: (data) => {
          toast.success(data);
        },
        onError: (error:any) => {
          if (error?.response?.status === 500) {
          toast.error("Something went wrong");
          return;
        }
        toast.error(
          error?.response?.data || "Something went wrong"
        );
        },
      }
    );
  };

   
  if (!storeID) {
  return <Navigate to="/choose" replace />;
}
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error...</div>;

  return (
    <div className="min-h-screen bg-[#f7f5f2]">
      <EditCard
        form={form}
        setForm={setForm}
        onSave={handleSave}
        loading={isPending}
        setLogoFile={setLogoFile}
      />
    </div>
  );
}