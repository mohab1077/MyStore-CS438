import { useEffect, useMemo, useState } from "react";
import ProductFormModal from "./AddProduct";
import { useAuth } from "../../../contexts/AuthProvider";
import { useDeleteProduct } from "../hooks/useDeleteProduct";
import { useEditProduct } from "../hooks/useEditProduct";
import toast from "react-hot-toast";
import { useGetCategory } from "../../shop/hooks/useGetCategory";
import { CategoryFormModal } from "./AddCategory";

type ProductStatus = "active" | "hidden";

type ProductAttribute = {
    name: string;
    value: string;
};

export type ProductRow = {
    _id: string;
    storeId: string;

    name: string;
    price: number;
    description: string;

    imgs: string[];

    attributes: ProductAttribute[];

    stock: number;
    category: string;

    status: ProductStatus;

    createdAt: string;
    updatedAt: string;

    __v: number;
};

function StatusBadge({ status }: { status: ProductStatus }) {
    const styles: Record<ProductStatus, string> = {
        active: "bg-emerald-100 text-emerald-700",
        hidden: "bg-zinc-200 text-zinc-700",
    };

    return (
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize ${styles[status]}`}>
            {status}
        </span>
    );
}

function TopTabs() {
    const [open, setOpen] = useState(false); // for add prod model
    const [openCategory, setOpenCategory] = useState(false); // for add Category model
    const { storeID } = useAuth();
    if (!storeID) {
        return
    }
    const { data, isLoading } = useGetCategory(storeID || "");

    return (
        <div className="flex flex-col gap-3 border-b border-zinc-200 bg-[#f7f5f2] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-lg font-semibold text-zinc-900">Product Management</h1>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <button
                    onClick={() => setOpen(true)}
                    type="button"
                    className="cursor-pointer rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-900 shadow-sm transition-all duration-150 hover:bg-zinc-50 hover:border-zinc-400 hover:shadow active:scale-[0.96] active:bg-zinc-100"
                >
                    + Add New Product
                </button>
                <button
                    onClick={() => setOpenCategory(true)}
                    type="button"
                    className="cursor-pointer rounded-lg border border-purple-300 bg-purple-50 px-3 py-2 text-sm font-medium text-purple-700 shadow-sm transition-all duration-150 hover:bg-purple-100 hover:border-purple-400 hover:shadow active:scale-[0.96] active:bg-purple-200"
                >
                    Categorys
                </button>
            </div>

            {open && <ProductFormModal open={open} setOpen={setOpen} />}
            {openCategory && !isLoading && <CategoryFormModal
                open={openCategory}
                setOpen={setOpenCategory}
                id={storeID}
                initialCategories={data}
            />}
        </div>
    );
}

function StatPill({ products }: { products: ProductRow[] }) {
    const activeCount = products.filter((item) => item.status === "active").length;
    const hiddenCount = products.filter((item) => item.status === "hidden").length;
    const totalStock = products.reduce((sum, item) => sum + item.stock, 0);

    return (
        <div className="rounded-lg border border-zinc-200 bg-white px-4 py-3">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-600">
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold text-zinc-900">{products.length}</span>
                        <span>Total products</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold text-zinc-900">{activeCount}</span>
                        <span className="text-emerald-600 text-xs font-medium">Visible</span>
                        <span>Active products</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold text-zinc-900">{hiddenCount}</span>
                        <span className="text-zinc-500 text-xs font-medium">Hidden</span>
                        <span>Not shown</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold text-zinc-900">{totalStock}</span>
                        <span>Total stock</span>
                    </div>
                </div>

                <div className="text-sm text-zinc-600">🛍️ Manage, search, edit and hide your products</div>
            </div>
        </div>
    );
}

function SearchAndFilters({
    search,
    onSearchChange,
    category,
    onCategoryChange,
}: {
    search: string;
    onSearchChange: (value: string) => void;
    category: string;
    onCategoryChange: (value: string) => void;
}) {

     const { storeID } = useAuth();
    if (!storeID) {
        return
    }
    const { data, isLoading } = useGetCategory(storeID || "");

    const categories = ["All", ...(data || [])];


    return (
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="flex h-10 w-full items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 text-zinc-500 sm:w-[260px]">
                    <span className="text-sm">⌕</span>
                    <input
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search product..."
                        className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
                    />
                </div>

                <select
                    value={category}
                    onChange={(e) => onCategoryChange(e.target.value)}
                    className="h-10 rounded-lg border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-900 outline-none"
                >
                    {categories.map((item) => (
                        <option key={item} value={item}>
                            {item}
                        </option>
                    ))}
                </select>
            </div>


        </div>
    );
}

function ProductSidePanel({
    open,
    onClose,
    product,
    onDelete,
    onToggleStatus,
}: {
    open: boolean;
    onClose: () => void;
    product: ProductRow | null;
    onDelete: (_id: string) => void;
    onToggleStatus: (_id: string, nextStatus: ProductStatus) => void;
}) {
    const [activeTab, setActiveTab] = useState<"details" | "attributes">("details");

    useEffect(() => {
        if (open) setActiveTab("details");
    }, [open, product?._id]);

    if (!product) return null;

    return (
        <>
            {open && (
                <button
                    type="button"
                    aria-label="Close product panel overlay"
                    onClick={onClose}
                    className="fixed inset-0 z-40 bg-black/20"
                />
            )}

            <aside
                className={`fixed right-0 top-0 z-50 h-screen w-full max-w-[560px] border-l border-zinc-200 bg-[#f7f5f2] shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="flex h-full flex-col overflow-y-auto p-4 sm:p-6">
                    <div className="mb-6 flex items-start justify-between gap-4">
                        <div className="min-w-0">
                            <h2 className="truncate text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-[32px]">
                                {product.name}
                            </h2>
                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                <StatusBadge status={product.status} />
                                <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-700">
                                    {product.category}
                                </span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg p-2 text-2xl text-zinc-400 transition hover:bg-zinc-200/70 hover:text-zinc-700"
                        >
                            ×
                        </button>
                    </div>

                    {product.imgs.length > 0 && (
                        <div className="mb-6 grid grid-cols-2 gap-3">
                            {product.imgs.map((img, index) => (
                                <img
                                    key={`${img}-${index}`}
                                    src={img}
                                    alt={product.name}
                                    className="h-32 w-full rounded-2xl border border-zinc-200 bg-white object-cover"
                                />
                            ))}
                        </div>
                    )}

                    <div className="mt-1 flex items-end gap-8 border-b border-zinc-200">
                        <button
                            type="button"
                            onClick={() => setActiveTab("details")}
                            className={`border-b-2 pb-3 text-base transition sm:text-lg ${activeTab === "details"
                                ? "border-zinc-900 font-semibold text-zinc-900"
                                : "border-transparent text-zinc-500"
                                }`}
                        >
                            Details
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab("attributes")}
                            className={`border-b-2 pb-3 text-base transition sm:text-lg ${activeTab === "attributes"
                                ? "border-zinc-900 font-semibold text-zinc-900"
                                : "border-transparent text-zinc-500"
                                }`}
                        >
                            Attributes
                        </button>
                    </div>

                    {activeTab === "details" ? (
                        <div className="mt-6 grid gap-y-4 text-sm text-zinc-700 sm:grid-cols-[130px_1fr] sm:gap-y-5 sm:text-[15px]">
                            <span className="text-zinc-500">Price</span>
                            <span className="font-medium text-zinc-900">${product.price.toFixed(2)}</span>

                            <span className="text-zinc-500">Stock</span>
                            <span className="font-medium text-zinc-900">{product.stock}</span>

                            <span className="text-zinc-500">Category</span>
                            <span className="font-medium text-zinc-900">{product.category}</span>

                            <span className="text-zinc-500">Description</span>
                            <span className="font-medium leading-7 text-zinc-900">{product.description}</span>
                        </div>
                    ) : (
                        <div className="mt-6 space-y-3">
                            {product.attributes.map((attribute, index) => (
                                <div key={`${attribute.name}-${index}`} className="rounded-2xl border border-zinc-200 bg-white p-4">
                                    <div className="text-sm text-zinc-500">{attribute.name}</div>
                                    <div className="mt-1 text-base font-medium text-zinc-900">{attribute.value}</div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-8 grid grid-cols-2 gap-3">
                    

                        <button
                            type="button"
                            onClick={() => onDelete(product._id)}
                            className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 transition hover:bg-rose-100"
                        >
                            Delete product
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}

function EditProductModal({
    open,
    onClose,
    product,
    onSave,
}: {
    open: boolean;
    onClose: () => void;
    product: ProductRow | null;
    onSave: (updated: ProductRow) => void;
}) {
    const [form, setForm] = useState<ProductRow | null>(product);
    const { storeID } = useAuth();
    if (!storeID) {
        return
    }
    const { data, isLoading } = useGetCategory(storeID || "");

    useEffect(() => {
        if (product) {
            setForm({
                ...product,
                attributes: product.attributes.map((attr) => ({ ...attr })),
                imgs: [...product.imgs],
            });
        }
    }, [product]);

    if (!open || !form) return null;

    const updateAttribute = (index: number, field: "name" | "value", value: string) => {
        setForm((prev) => {
            if (!prev) return prev;
            const next = prev.attributes.map((attr, i) => (i === index ? { ...attr, [field]: value } : attr));
            return { ...prev, attributes: next };
        });
    };

    const addAttribute = () => {
        setForm((prev) => (prev ? { ...prev, attributes: [...prev.attributes, { name: "", value: "" }] } : prev));
    };

    const removeAttribute = (index: number) => {
        setForm((prev) => (prev ? { ...prev, attributes: prev.attributes.filter((_, i) => i !== index) } : prev));
    };

    const updateImage = (index: number, value: string) => {
        setForm((prev) => {
            if (!prev) return prev;
            const next = prev.imgs.map((img, i) => (i === index ? value : img));
            return { ...prev, imgs: next };
        });
    };

    const addImage = () => {
        setForm((prev) => (prev ? { ...prev, imgs: [...prev.imgs, ""] } : prev));
    };

    const removeImage = (index: number) => {
        setForm((prev) => (prev ? { ...prev, imgs: prev.imgs.filter((_, i) => i !== index) } : prev));
    };

    const handleSave = () => {
        if (!form) return;

        onSave({
            ...form,
            price: Number(form.price),
            stock: Number(form.stock),
            imgs: form.imgs.filter((img) => img.trim() !== ""),
            attributes: form.attributes.filter((attr) => attr.name.trim() || attr.value.trim()),
        });
        onClose();
    };

    return (
        <>
            <button
                type="button"
                aria-label="Close edit modal overlay"
                onClick={onClose}
                className="fixed inset-0 z-40 bg-black/30"
            />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-zinc-200 bg-white p-5 shadow-2xl sm:p-6">
                    <div className="mb-5 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-zinc-900">Edit product</h2>
                        <button type="button" onClick={onClose} className="cursor-pointer rounded-lg p-2 text-xl text-zinc-500 hover:bg-zinc-100">
                            ×
                        </button>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-zinc-700">Name</label>
                            <input
                                value={form.name}
                                onChange={(e) => setForm((prev) => (prev ? { ...prev, name: e.target.value } : prev))}
                                className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-zinc-700">Price</label>
                            <input
                                type="number"
                                value={form.price}
                                onChange={(e) => setForm((prev) => (prev ? { ...prev, price: Number(e.target.value) } : prev))}
                                className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-zinc-700">Stock</label>
                            <input
                                type="number"
                                value={form.stock}
                                onChange={(e) => setForm((prev) => (prev ? { ...prev, stock: Number(e.target.value) } : prev))}
                                className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-zinc-700">Category</label>
                            <select
                                value={form.category}
                                onChange={(e) => setForm((prev) => (prev ? { ...prev, category: e.target.value } : prev))}
                                className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none"
                            >
                                {data.map((item:any) => (
                                    <option key={item} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-zinc-700">Status</label>
                            <select
                                value={form.status}
                                onChange={(e) => setForm((prev) => (prev ? { ...prev, status: e.target.value as ProductStatus } : prev))}
                                className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none"
                            >
                                <option value="active">active</option>
                                <option value="hidden">hidden</option>
                            </select>
                        </div>

                        <div className="sm:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-zinc-700">Description</label>
                            <textarea
                                value={form.description}
                                onChange={(e) => setForm((prev) => (prev ? { ...prev, description: e.target.value } : prev))}
                                rows={4}
                                className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <div className="mb-2 flex items-center justify-between">
                                <label className="block text-sm font-medium text-zinc-700">Images</label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    id="imageUpload"
                                    onChange={(e) => {
                                        const files = Array.from(e.target.files || []);
                                        const newImgs = files.map((file) => URL.createObjectURL(file));

                                        setForm((prev) =>
                                            prev ? { ...prev, imgs: [...prev.imgs, ...newImgs] } : prev
                                        );
                                    }}
                                    className="hidden"
                                />

                                {/* Button */}
                                <label
                                    htmlFor="imageUpload"
                                    className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 px-4 py-6 text-sm text-gray-500 hover:border-purple-500 hover:text-purple-600 transition"
                                >
                                    📷 Upload Images
                                </label>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                {form.imgs.map((img, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={img}
                                            className="h-24 w-full rounded-lg object-cover border"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="cursor-pointer absolute right-1 top-1 bg-black/60 text-white text-xs px-2 rounded"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="sm:col-span-2">
                            <div className="mb-2 flex items-center justify-between">
                                <label className="block text-sm font-medium text-zinc-700">Attributes</label>
                                <button type="button" onClick={addAttribute} className="cursor-pointer text-sm font-medium text-indigo-600">
                                    + Add attribute
                                </button>
                            </div>
                            <div className="space-y-3">
                                {form.attributes.map((attr, index) => (
                                    <div key={index} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                                        <input
                                            value={attr.name}
                                            onChange={(e) => updateAttribute(index, "name", e.target.value)}
                                            placeholder="Attribute name"
                                            className="rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none"
                                        />
                                        <input
                                            value={attr.value}
                                            onChange={(e) => updateAttribute(index, "value", e.target.value)}
                                            placeholder="Attribute value"
                                            className="rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeAttribute(index)}
                                            className=" cursor-pointer rounded-xl border border-rose-200 bg-rose-50 px-3 text-sm text-rose-700"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="cursor-pointer rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm font-medium text-zinc-900"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            className="cursor-pointer rounded-xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white hover:bg-indigo-700"
                        >
                            Save changes
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

function ProductsTable({ products, setProducts }: { products: ProductRow[]; setProducts: React.Dispatch<React.SetStateAction<ProductRow[]>> }) {
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [page, setPage] = useState(1);
    const { storeID } = useAuth();
    const { mutate } = useEditProduct();
    const deleteMutation = useDeleteProduct();

    const filteredRows = useMemo(() => {
        const q = search.trim().toLowerCase();

        return products.filter((row) => {
            const matchesSearch =
                q.length === 0 ||
                row.name.toLowerCase().includes(q) ||
                row.description.toLowerCase().includes(q) ||
                row.category.toLowerCase().includes(q);

            const matchesCategory = selectedCategory === "All" || row.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [products, search, selectedCategory]);

    const selectedProduct = products.find((row) => row._id === selectedProductId) ?? null;
  
   

    const openProduct = (_id: string) => {
        setSelectedProductId(_id);
        setOpen(true);
    };

    const openEdit = (_id: string) => {
        setSelectedProductId(_id);
        setOpen(false);
        setEditOpen(true);
    };

    const toggleProductStatus = (_id: string, nextStatus: ProductStatus) => {
        setProducts((prev) => prev.map((row) => (row._id === _id ? { ...row, status: nextStatus } : row)));
    };

    const saveProduct = (product: ProductRow) => {
        if (!storeID) return;
        mutate({
            id: storeID,    // shop id
            _id: product._id,   // product id
            name: product.name,
            price: product.price,
            description: product.description,
            imgs: product.imgs,
            attributes: product.attributes,
            stock: product.stock,
            category: product.category,
            statuss: product.status,
        },{
      onSuccess: (data) => {
        toast.success(data);
      },

      onError: (error: any) => {
        toast.error(
          error?.response?.data || "Something went wrong"
        );
      },
    })
        setProducts((prev) => prev.map((row) => (row._id === product._id ? product : row)));
    };

    const deleteProduct = (_id: string) => {

        if (!storeID) return;
        console.log(_id)
        deleteMutation.mutate({
            id: storeID,
            _id: _id,
        },{
      onSuccess: (data) => {
        toast.success(data);
         
      },

      onError: (error: any) => {
        toast.error(
          error?.response?.data || "Something went wrong"
        );
      },
    });

        setProducts((prev) => prev.filter((row) => row._id !== _id));
        if (selectedProductId === _id) {
            setOpen(false);
            setEditOpen(false);
            setSelectedProductId(null);
        }
    };

    return (
        <>
            <div className="rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm sm:p-4">
                <SearchAndFilters
                    search={search}
                    onSearchChange={(value) => {
                        setSearch(value);
                        setPage(1);
                    }}
                    category={selectedCategory}
                    onCategoryChange={(value) => {
                        setSelectedCategory(value);
                        setPage(1);
                    }}
                />

                <div className="mt-5 hidden overflow-x-auto md:block">
                    <table className="w-full min-w-[900px] border-separate border-spacing-y-2 text-left">
                        <thead>
                            <tr className="text-sm text-zinc-500">
                                <th className="pb-2 font-medium">Product</th>
                                <th className="pb-2 font-medium">Price</th>
                                <th className="pb-2 font-medium">Category</th>
                                <th className="pb-2 font-medium">Stock</th>
                                <th className="pb-2 font-medium">Status</th>
                                <th className="pb-2 font-medium">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredRows.map((row) => (
                                <tr key={row._id} className="text-sm text-zinc-800 hover:bg-zinc-50">
                                    <td className="py-2">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={row.imgs[0] || "https://placehold.co/200x200?text=No+Image"}
                                                alt={row.name}
                                                className="h-12 w-12 rounded-xl border border-zinc-200 object-cover"
                                            />
                                            <div>
                                                <div className="font-semibold">{row.name}</div>
                                                <div className="line-clamp-1 text-xs text-zinc-500">{row.description}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-2">${row.price.toFixed(2)}</td>
                                    <td className="py-2">{row.category}</td>
                                    <td className="py-2">{row.stock}</td>
                                    <td className="py-2">
                                        <button type="button" onClick={() => toggleProductStatus(row._id, row.status === "active" ? "hidden" : "active")}>
                                            <StatusBadge status={row.status} />
                                        </button>
                                    </td>
                                    <td className="py-2">
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => openProduct(row._id)}
                                                className="cursor-pointer rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-900 transition hover:bg-zinc-50"
                                            >
                                                View
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => openEdit(row._id)}
                                                className="cursor-pointer rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-900 transition hover:bg-zinc-50"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => deleteProduct(row._id)}
                                                className="cursor-pointer rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700 transition hover:bg-rose-100"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 space-y-3 md:hidden">
                    {filteredRows.map((row) => (
                        <div key={row._id} className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                            <div className="flex items-start gap-3">
                                <img
                                    src={row.imgs[0] || "https://placehold.co/200x200?text=No+Image"}
                                    alt={row.name}
                                    className="h-14 w-14 rounded-xl border border-zinc-200 object-cover"
                                />
                                <div className="min-w-0 flex-1">
                                    <button
                                        type="button"
                                        onClick={() => openProduct(row._id)}
                                        className="truncate text-left text-sm font-semibold text-zinc-900"
                                    >
                                        {row.name}
                                    </button>
                                    <p className="mt-1 text-xs text-zinc-500">{row.category}</p>
                                    <div className="mt-2 flex flex-wrap items-center gap-2">
                                        <StatusBadge status={row.status} />
                                        <span className="text-xs text-zinc-500">Stock: {row.stock}</span>
                                        <span className="text-xs font-medium text-zinc-900">${row.price.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-3 flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => openProduct(row._id)}
                                    className="cursor-pointer flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs font-medium text-zinc-900"
                                >
                                    View details
                                </button>

                                <button
                                    type="button"
                                    onClick={() => openEdit(row._id)}
                                    className="cursor-pointer flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs font-medium text-zinc-900"
                                >
                                    Edit
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>



            <ProductSidePanel
                open={open}
                onClose={() => setOpen(false)}
                product={selectedProduct}
                onDelete={deleteProduct}
                onToggleStatus={toggleProductStatus}
            />

            <EditProductModal
                open={editOpen}
                onClose={() => setEditOpen(false)}
                product={selectedProduct}
                onSave={saveProduct}
            />
        </>
    );
}
interface Props {
    data: ProductRow[];
}

export default function ProductManagementPage({ data }: Props) {

    const [products, setProducts] = useState<ProductRow[]>([])

    useEffect(() => {
        setProducts(data);
    }, [data]);


    return (
        <div className="h-auto bg-[#f7f5f2]">
            <TopTabs />
            <div className="space-y-4 p-4">
                <StatPill products={products} />
                <ProductsTable products={products} setProducts={setProducts} />
            </div>
        </div>
    );
}
