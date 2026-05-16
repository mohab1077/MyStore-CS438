import { useEffect, useMemo, useState } from "react";
import { useGetMyShops } from "../hooks/useGetMyShops";
import { useAuth } from "../../../contexts/AuthProvider";
import { useNavigate } from "react-router-dom";

type Shop = {
  _id: string;
  ShopName: string;
  logo: string;
  Status: string;
  websiteId?: string
};

function ShopCard({
  shop,
  selected,
  onSelect,
}: {
  shop: Shop;
  selected: boolean;
  onSelect: () => void;
}) {
  console.log()
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition cursor-pointer ${selected
        ? "border-zinc-900 bg-zinc-50 ring-2 ring-zinc-900/10"
        : "border-zinc-200 bg-white hover:bg-zinc-50"
        }`}
    >
      <img
        src={""}
        alt={shop.ShopName}
        className="h-12 w-12 rounded-xl object-cover"
      />

      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold text-zinc-900">{shop.ShopName}</div>
        <div className="mt-1 text-xs text-zinc-500">{shop.Status}</div>
      </div>

      {selected ? (
        <div className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-medium text-white">
          Selected
        </div>
      ) : null}
    </button>
  );
}

export default function SelectShop() {

  const { setStoreID, setShopInfo } = useAuth()
  const navigate = useNavigate();
  const [shops, setShops] = useState<Shop[]>([]);
  const { data, isLoading, error } = useGetMyShops();


  useEffect(() => {
    if (data) {
      setShops(data);
      if (data.length === 0) {
        navigate("/create")
      }
    }
  }, [data]);


  const [selected, setSelected] = useState<string>("");
  const [selectshop, setselectshop] = useState<Shop>();
  const [targetRoute, setTargetRoute] = useState<string>("");

  const current = useMemo(() => shops.find((s) => s._id === selected), [shops, selected]);


  const handleContinue = () => {
    if (!selected) return;

    setStoreID(selected)

    setShopInfo(selectshop?.ShopName || "",
      selectshop?.websiteId || "")
    navigate("/user/products")
    setTargetRoute(`/store/${selected}`);

  };

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <h1>Error...</h1>;
  }
  return (
    <div className="min-h-screen bg-[#f7f5f2] p-4">
      <div className="mx-auto max-w-2xl rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h1 className="mb-2 text-xl font-semibold text-zinc-900">Select Store</h1>
        <p className="mb-5 text-sm text-zinc-500">Choose one store to continue.</p>

        <div className="space-y-3">
          {shops.map((shop) => (
            <ShopCard
              key={shop._id}
              shop={shop}
              selected={selected === shop._id}
              onSelect={() => {
                setSelected(shop._id);
                setTargetRoute("");
                setselectshop(shop)
              }}
            />
          ))}
        </div>

        {current ? (
          <div className="mt-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <div className="mb-2 text-sm font-medium text-zinc-700">Selected store</div>
            <div className="flex items-center gap-3">
              <img
                src={current.logo}
                alt={current.ShopName}
                className="h-12 w-12 rounded-xl object-cover"
              />
              <div>
                <div className="text-sm font-semibold text-zinc-900">{current.ShopName}</div>
                <div className="text-xs text-zinc-500">{current.Status}</div>
              </div>
            </div>
          </div>
        ) : null}

        <button
          type="button"
          onClick={handleContinue}
          disabled={!selected}
          className={`mt-5 w-full rounded-xl px-4 py-3 text-sm font-semibold transition  ${selected
            ? "bg-zinc-900 text-white hover:bg-zinc-800 cursor-pointer"
            : "cursor-not-allowed bg-zinc-200 text-zinc-400"
            }`}
        >
          Continue
        </button>

        {targetRoute ? (
          <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-700">
            Next route: <span className="font-semibold text-zinc-900">{targetRoute}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
