import { useState } from "react";
import { useCreateShop } from "../hooks/useCreateShop";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";



type StoreForm = {
  ShopName: string;
  shopNumber: string;
  ShopId: string;
};



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





function EditCard(props: {
  form: StoreForm;
  setForm: React.Dispatch<React.SetStateAction<StoreForm>>;
  onSave: () => void;
}) {
  const { form, setForm, onSave } = props;
  const { mutate, isPending } = useCreateShop();
  const navigate = useNavigate();

  const handleSave = async () => {
      
      mutate({
    websiteId: form.ShopId,
    ShopName: form.ShopName,
    shopNumber: form.shopNumber,
  }, {
      onSuccess: (data) => {
        toast.success(data);
        navigate("/choose");
       
      },

      onError: (error: any) => {
        toast.error(
          error?.response?.data || "Something went wrong"
        );
      },
    });
      onSave();
  };


  return (
 <div className="min-h-screen  bg-[#f5f7fb]">
  <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center">
    <div className="w-full rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900">
          Create Store
        </h2>
        <p className="mt-2 text-sm text-zinc-500">
          Fill in your store information to create a new shop.
        </p>
      </div>

      <div className="space-y-5">
        <InputField
          label="Shop Name"
          value={form.ShopName}
          onChange={(value) =>
            setForm((prev) => ({ ...prev, ShopName: value }))
          }
          placeholder="Enter shop name"
        />

        <InputField
          label="Shop Number"
          value={form.shopNumber}
          onChange={(value) =>
            setForm((prev) => ({ ...prev, shopNumber: value }))
          }
          placeholder="Enter shop number"
        />

        <InputField
          label="Shop Id"
          value={form.ShopId}
          onChange={(value) =>
            setForm((prev) => ({ ...prev, ShopId: value }))
          }
          placeholder="Enter shop Id"
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
          {isPending ? "Creating..." : "Create New Shop"}
        </button>
      </div>
    </div>
  </div>
</div>
  );
}

export default function CreateShop() {
  const [storeData, setStoreData] = useState<StoreForm>({
    ShopName: "",
    shopNumber: "",
   ShopId:""
  });

  const [form, setForm] = useState<StoreForm>(storeData);
  

  const handleSave = () => {
    setStoreData(form);
    console.log("UPDATE PAYLOAD:", form);
    

  };

  return (
        <EditCard
          form={form}
          setForm={setForm}
          onSave={handleSave}
        />
     
  );
}
