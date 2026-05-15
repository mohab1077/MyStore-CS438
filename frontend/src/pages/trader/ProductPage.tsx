import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthProvider";
import ProductManagementPage, { type ProductRow } from "../../features/products/components/ProductHome";
import { useGetTraderProducts } from "../../features/products/hooks/useGetTraderProducts";

export default function ProductPage() {
    const { storeID } = useAuth()
    const [products, setProducts] = useState<ProductRow[]>([]);
    const [totalPages, setTotalPages] = useState(1);

    const [page, setPage] = useState(1);

    if (!storeID) {
        return // navegite to shop select 
    }


    const { data, isLoading, error } = useGetTraderProducts(storeID, page);

   useEffect(() => {
  if (data) {
    setProducts(data.data);
    setTotalPages(data.totalPages || 1);
  }
}, [data]);

useEffect(() => {
  console.log(products);
}, [products]);

    if (isLoading) {
        return <h1>Loading...</h1>;
    }

    if (error) {
        return <h1>Error...</h1>;
    }


    return (
        <div className="min-w-0 flex-1 pt-16 md:pt-0">
            <ProductManagementPage data={products} />
            <div className="mt-2 flex flex-col gap-4 border-t border-zinc-100 pt-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center justify-center gap-8 text-zinc-400 sm:flex-1">
                    <button
                        type="button"
                        disabled={page <= 1}
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        className="rounded-md text-3xl disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer"
                    >
                        ‹
                    </button>
                    <span className="text-sm text-zinc-700">
                        {page} / {totalPages}
                    </span>
                    <button
                        type="button"
                        disabled={page >= totalPages}
                        onClick={() => setPage(page + 1)}
                        className="rounded-md text-3xl disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer"
                    >
                        ›
                    </button>
                </div>
            </div>
        </div>
    )
}