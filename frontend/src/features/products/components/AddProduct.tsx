import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useCreateProduct } from "../hooks/useCreateProduct";
import { useAuth } from "../../../contexts/AuthProvider";
import { uploadImagesToBackend } from "../../../api/upload";
import toast from "react-hot-toast";
import { useGetCategory } from "../../shop/hooks/useGetCategory";

type ProductFormModalProps = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
};

export default function ProductFormModal({
  setOpen,
  open,
}: ProductFormModalProps) {
  const [mounted, setMounted] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    stock: "",
    category: "",
    attributeName: "",
    attributeValue: "",
  });
  const { mutate} = useCreateProduct();
  const { storeID } = useAuth();
    if(!storeID){
        return
    }

  const { data ,isLoading } = useGetCategory(storeID || "");

  const [categories, setCategories] = useState<string[]>([]);

useEffect(() => {
  if (data) {
    setCategories(data);
  }
}, [data]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const previews = useMemo(() => {
    return imageFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
  }, [imageFiles]);

  useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [previews]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []) as File[];
    setImageFiles((prev) => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

   const handleSubmit = async () => {

    const uploadedUrls = await uploadImagesToBackend(imageFiles);
    const payload = {
      id: storeID,
      name: form.name,
      price: Number(form.price),
      description: form.description,
      stock: Number(form.stock),
      category: form.category,
      imgs: uploadedUrls,
      attributes: [
        {
          name: form.attributeName,
          value: form.attributeValue,
        },
      ],
    };
    mutate(payload, {
      onSuccess: (data) => {
        toast.success(data);
         setOpen(false);
      },

      onError: (error: any) => {
        toast.error(
          error?.response?.data || "Something went wrong"
        );
      },
    })
    

    console.log(payload);
  };

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Add Product</h2>
          <button type="button" onClick={() => setOpen(false) } className="cursor-pointer">
            ✕
          </button>
        </div>

        <div className="space-y-3">
          <input
            name="name"
            placeholder="Product name"
            onChange={handleChange}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />

          <input
            name="price"
            placeholder="Price"
            type="number"
            onChange={handleChange}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />

          <textarea
            name="description"
            placeholder="Description"
            onChange={handleChange}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-700">
              Product images
            </label>

            <input
              type="file"
              accept="image/*"
              multiple
              id="uploadImages"
              onChange={handleImagesChange}
              className="hidden"
            />

            {/* button */}
            <label
              htmlFor="uploadImages"
              className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 px-4 py-6 text-sm text-gray-500 transition hover:border-purple-500 hover:text-purple-600"
            >
              📷 Click to upload images
            </label>

            {previews.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {previews.map((item, index) => (
                  <div key={item.url} className="relative">
                    <img
                      src={item.url}
                      alt={`preview-${index}`}
                      className="h-20 w-full rounded-lg object-cover"
                    />

                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="cursor-pointer absolute right-1 top-1 rounded-full bg-black/60 px-2 text-xs text-white"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <input
              name="attributeName"
              placeholder="Attribute name"
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />

            <input
              name="attributeValue"
              placeholder="Attribute value"
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>

          <input
            name="stock"
            placeholder="Stock"
            type="number"
            onChange={handleChange}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />

          <select
            name="category"
            onChange={handleChange}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="cursor-pointer mt-5 w-full rounded-lg bg-purple-600 py-2 text-sm font-medium text-white hover:bg-purple-700"
        >
          Submit
        </button>
      </div>
    </div>,
    document.body
  );
}