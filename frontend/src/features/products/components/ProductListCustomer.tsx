import React, { useEffect, useState } from "react";

// =========================
// Types
// =========================

type ProductAttribute = {
  name: string;
  value: string;
};

type Product = {
  _id: string;
  storeId: string;
  name: string;
  price: number;
  description: string;
  imgs: string[];
  attributes: ProductAttribute[];
  stock: number;
  category: string;
  status: string;
};

type ProductImageProps = {
  src?: string;
  alt: string;
  className?: string;
};

type ProductCardProps = {
  product: Product;
  onClick: (product: Product) => void;
};

type ProductDetailsProps = {
  product: Product | null;
  onBack: () => void;
};
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ImageOff,
  Loader2,
  Package,
  ShoppingCart,
} from "lucide-react";
import { useParams } from "react-router-dom";

/**
 * Visitor Store Products Page
 * Requirement 31:
 * - Visitor/customer opens store by URL: our-domain/:websiteId
 * - Display active products for this store
 * - Product card shows: product name, price, main image
 *
 * Requirement 32:
 * - Visitor/customer clicks product to see product details
 * - Details show: name, price, remaining quantity, attributes, description, images, category
 *
 * Backend response shape حسب كود getprod عندك:
 * {
 *   status: 200,
 *   msg: {
 *     data: findprods,
 *     page,
 *     totalPages,
 *     total
 *   }
 * }
 *
 * مهم:
 * - الباك إند يرجّع معلومات المنتج كاملة داخل data.
 * - لذلك لا نحتاج API منفصل لتفاصيل المنتج.
 * - عند الضغط على المنتج نعرض نفس object مباشرة.
 */

const mockBackendResponse = {
  status: 200,
  msg: {
    data: [
      {
        _id: "p1",
        storeId: "shop-id-1",
        name: "Classic White Sneakers",
        price: 79,
        description:
          "Comfortable everyday sneakers with a clean modern design. Suitable for casual outfits and daily walking.",
        imgs: [
          "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=900&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=900&auto=format&fit=crop",
        ],
        attributes: [
          { name: "Color", value: "White" },
          { name: "Size", value: "42" },
          { name: "Material", value: "Leather" },
        ],
        stock: 18,
        category: "Shoes",
        status: "active",
      },
      {
        _id: "p2",
        storeId: "shop-id-1",
        name: "Wireless Headphones",
        price: 95,
        description:
          "Wireless headphones with soft ear cushions, strong bass, and long battery life for music and calls.",
        imgs: [
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=900&auto=format&fit=crop",
        ],
        attributes: [
          { name: "Battery", value: "30 hours" },
          { name: "Connection", value: "Bluetooth" },
        ],
        stock: 14,
        category: "Electronics",
        status: "active",
      },
      {
        _id: "p3",
        storeId: "shop-id-1",
        name: "Travel Backpack",
        price: 68,
        description:
          "Durable backpack with multiple pockets, laptop space, and a clean design for travel or school.",
        imgs: [
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=900&auto=format&fit=crop",
        ],
        attributes: [
          { name: "Capacity", value: "25L" },
          { name: "Laptop", value: "15 inch" },
        ],
        stock: 11,
        category: "Bags",
        status: "active",
      },
    ],
    page: 1,
    totalPages: 3,
    total: 18,
  },
};

async function getStoreProductsFromApi({ websiteId, page }) {
  // استبدل هذا الجزء باستدعاء API الحقيقي عندك:
  // const res = await axios.get(`/product/prod`, {
  //   params: { websiteId, page },
  // });
  // return res.data;

  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    ...mockBackendResponse,
    msg: {
      ...mockBackendResponse.msg,
      page,
    },
  };
}

function ProductImage({
  src,
  alt,
  className,
}: ProductImageProps) {
  if (!src) {
    return (
      <div className={`flex items-center justify-center bg-slate-100 ${className}`}>
        <ImageOff className="text-slate-400" size={34} />
      </div>
    );
  }

  return <img src={src} alt={alt} className={`object-cover ${className}`} />;
}

function ProductCard({
  product,
  onClick,
}: ProductCardProps) {
  const mainImage = product.imgs?.[0];

  return (
    <motion.button
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(product)}
      className="group overflow-hidden rounded-3xl bg-white text-left shadow-sm ring-1 ring-slate-200 transition hover:shadow-xl"
    >
      <div className="h-60 overflow-hidden bg-slate-100">
        <ProductImage
          src={mainImage}
          alt={product.name}
          className="h-full w-full transition duration-500 group-hover:scale-110"
        />
      </div>

      <div className="space-y-4 p-5">
        <div>
          <h3 className="line-clamp-1 text-lg font-black text-slate-950">
            {product.name}
          </h3>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            {product.category}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-black text-slate-950">LYD {product.price}</span>
          <span className="rounded-2xl bg-slate-950 p-3 text-white transition group-hover:bg-indigo-600">
            <ShoppingCart size={18} />
          </span>
        </div>
      </div>
    </motion.button>
  );
}

function ProductDetails({
  product,
  onBack,
}: ProductDetailsProps) {
  const [activeImage, setActiveImage] = useState(product?.imgs?.[0]);

  useEffect(() => {
    setActiveImage(product?.imgs?.[0]);
  }, [product]);

  if (!product) {
    return (
      <div className="rounded-[2rem] bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
        <Package className="mx-auto mb-4 text-slate-400" size={42} />
        <h2 className="text-2xl font-black text-slate-950">Product not found</h2>
        <button
          onClick={onBack}
          className="mt-6 rounded-2xl bg-slate-950 px-5 py-3 font-bold text-white hover:bg-indigo-600"
        >
          Back to products
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[2rem] bg-white p-4 shadow-sm ring-1 ring-slate-200 md:p-8"
    >
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-100"
      >
        <ArrowLeft size={18} />
        Back to store products
      </button>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-[2rem] bg-slate-100">
            <ProductImage
              src={activeImage}
              alt={product.name}
              className="h-[430px] w-full"
            />
          </div>

          <div className="grid grid-cols-4 gap-3">
            {product.imgs?.map((img) => (
              <button
                key={img}
                onClick={() => setActiveImage(img)}
                className={`overflow-hidden rounded-2xl ring-2 transition ${
                  activeImage === img ? "ring-indigo-600" : "ring-transparent"
                }`}
              >
                <ProductImage src={img} alt={product.name} className="h-24 w-full" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <span className="mb-4 w-fit rounded-full bg-indigo-50 px-4 py-2 text-sm font-bold text-indigo-700">
            {product.category}
          </span>

          <h1 className="text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
            {product.name}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
              Remaining quantity: {product.stock}
            </span>
            <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700">
              Status: {product.status}
            </span>
          </div>

          <p className="mt-6 text-lg leading-8 text-slate-600">{product.description}</p>

          <div className="mt-8">
            <h2 className="mb-3 text-lg font-black text-slate-950">Product attributes</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {product.attributes?.length ? (
                product.attributes.map((attr) => (
                  <div key={`${attr.name}-${attr.value}`} className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm font-bold text-slate-500">{attr.name}</p>
                    <p className="mt-1 text-lg font-black text-slate-950">{attr.value}</p>
                  </div>
                ))
              ) : (
                <p className="text-slate-500">No attributes available.</p>
              )}
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between rounded-[2rem] bg-slate-950 p-5 text-white">
            <div>
              <p className="text-sm font-semibold text-slate-300">Price</p>
              <p className="text-4xl font-black">${product.price}</p>
            </div>

            <button className="rounded-2xl bg-white px-5 py-3 font-black text-slate-950 transition hover:bg-indigo-100">
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function StoreProductsPage() {
  // في مشروعك الحقيقي جيب websiteId من React Router:
   //const { websiteId } = useParams();
  const websiteId = "libya-shop-1";

  const [products, setProducts] = useState<Product[]>([]);
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });
  const [page, setPage] = useState(1);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadProducts() {
      setLoadingProducts(true);
      setError("");

      try {
        const result = await getStoreProductsFromApi({ websiteId, page });

        if (ignore) return;

        if (result.status !== 200) {
          setProducts([]);
          setError(typeof result.msg === "string" ? result.msg : "Something went wrong");
          return;
        }

        setProducts(result.msg.data || []);
        setPageInfo({
          page: result.msg.page,
          totalPages: result.msg.totalPages,
          total: result.msg.total,
        });
      } catch (err) {
        if (!ignore) {
          setProducts([]);
          setError("Something went wrong");
        }
      } finally {
        if (!ignore) setLoadingProducts(false);
      }
    }

    loadProducts();

    return () => {
      ignore = true;
    };
  }, [websiteId, page]);

  if (selectedProduct) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 md:px-8">
        <div className="mx-auto max-w-7xl">
          <ProductDetails
            product={selectedProduct}
            onBack={() => setSelectedProduct(null)}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 md:px-8">
      <div className="mx-auto max-w-7xl">
       

        {loadingProducts ? (
          <div className="flex min-h-[360px] items-center justify-center rounded-[2rem] bg-white shadow-sm ring-1 ring-slate-200">
            <Loader2 className="animate-spin text-indigo-600" size={36} />
          </div>
        ) : error ? (
          <div className="rounded-[2rem] bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
            <Package className="mx-auto mb-4 text-slate-400" size={42} />
            <h2 className="text-2xl font-black text-slate-950">{error}</h2>
          </div>
        ) : products.length > 0 ? (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onClick={setSelectedProduct}
              />
            ))}
          </motion.section>
        ) : (
          <div className="rounded-[2rem] bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
            <Package className="mx-auto mb-4 text-slate-400" size={42} />
            <h2 className="text-2xl font-black text-slate-950">No products available</h2>
            <p className="mt-2 text-slate-500">This store does not have active products yet.</p>
          </div>
        )}

        {!loadingProducts && !error && pageInfo.totalPages > 1 && (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setPage((old) => Math.max(old - 1, 1))}
              disabled={pageInfo.page <= 1}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3 font-black text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <span className="rounded-2xl bg-white px-5 py-3 font-black text-slate-800 shadow-sm ring-1 ring-slate-200">
              Page {pageInfo.page} of {pageInfo.totalPages} / Total {pageInfo.total}
            </span>

            <button
              onClick={() => setPage((old) => old + 1)}
              disabled={pageInfo.page >= pageInfo.totalPages}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3 font-black text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
