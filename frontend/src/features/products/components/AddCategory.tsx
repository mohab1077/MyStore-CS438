import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useEditCategory } from "../../shop/hooks/useEditCategory";
import toast from "react-hot-toast";

type CategoryFormModalProps = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  id: string; // store or category id
  initialCategories?: string[];
};

export function CategoryFormModal({
  setOpen,
  open,
  id,
  initialCategories = [],
}: CategoryFormModalProps) {
  const [mounted, setMounted] = useState(false);
  const [categorys, setCategorys] = useState<string[]>(initialCategories);
  const { mutate } = useEditCategory(id);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const addCategory = () => setCategorys((prev) => [...prev, ""]);

  const updateCategory = (index: number, value: string) => {
    setCategorys((prev) => prev.map((c, i) => (i === index ? value : c)));
  };

  const removeCategory = (index: number) => {
    setCategorys((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {

    const payload = {
      id,
      categorys: categorys.filter((c) => c.trim() !== ""),
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
    });
    console.log("SEND TO API:", payload);
    
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
          <h2 className="text-lg font-semibold">Manage Categories</h2>
          <button type="button" onClick={() => setOpen(false)} className="cursor-pointer">
            ✕
          </button>
        </div>

        <div className="space-y-3">
          {categorys.map((cat, index) => (
            <div key={index} className="flex gap-2">
              <input
                value={cat}
                onChange={(e) => updateCategory(index, e.target.value)}
                placeholder="Category name"
                className="flex-1 rounded-lg border px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={() => removeCategory(index)}
                className="rounded-lg bg-rose-100 px-3 text-sm text-rose-700 cursor-pointer"
              >
                ✕
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addCategory}
            className="cursor-pointer w-full rounded-lg border border-dashed py-2 text-sm text-zinc-500 hover:border-purple-500 hover:text-purple-600"
          >
            + Add category
          </button>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="mt-5 w-full rounded-lg bg-purple-600 py-2 text-sm font-medium text-white hover:bg-purple-700 cursor-pointer"
        >
          Save Categories
        </button>
      </div>
    </div>,
    document.body
  );
}


