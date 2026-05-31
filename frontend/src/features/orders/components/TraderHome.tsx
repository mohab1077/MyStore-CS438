import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { useGetTraderOrders } from "../hooks/useGetTraderOrders";
import { useAuth } from "../../../contexts/AuthProvider";
import { useEditTraderOrder } from "../hooks/useEditTraderOrder";
import toast from "react-hot-toast";


type OrderItem = {
  ProductName: string;
  quantity: number;

};

type OrderStatus = "Processing" | "Shipped" | "Delivered" | "Pending" | "Cancelled";
type PaymentStatus = "pending" | "paid";

type OrderRow = {
  _id: string;
  orderNumber: number;
  customerEmail: string;
  products: OrderItem[];
  totalAmount: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  shippingAddress: string;
  orderDate: string;
};

type OrderSidePanelProps = {
  open: boolean;
  onClose: () => void;
  order: OrderRow | null;
};

function OrderSidePanel({ open, onClose, order }: OrderSidePanelProps) {
  const [activeTab, setActiveTab] = useState<"details" | "products">("details");

  if (!order) return null;

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close order panel overlay"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/20"
        />
      )}

      <aside
        className={`fixed right-0 top-0 z-50 h-screen w-full max-w-[580px] border-l border-zinc-200 bg-[#f7f5f2] shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex h-full flex-col overflow-y-auto p-4 sm:p-6">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 className="truncate text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-[34px]">
                {order.orderNumber}
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                <StatusBadge status={order.orderStatus} />
                <PaymentBadge status={order.paymentStatus} />
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

          <div className="grid gap-y-4 text-sm text-zinc-700 sm:grid-cols-[150px_1fr] sm:gap-y-5 sm:text-[15px]">
            <span className="text-zinc-500">Customer email</span>
            <span className="font-medium break-all text-zinc-900">{order.customerEmail}</span>

            <span className="text-zinc-500">Created at</span>
            <span className="font-medium text-zinc-900">{order.orderDate}</span>


            <span className="text-zinc-500">Shipping address</span>
            <span className="font-medium text-zinc-900">{order.shippingAddress}</span>

            <span className="text-zinc-500">Total items</span>
            <span className="font-medium text-zinc-900">
              {order.products.reduce((sum, item) => sum + item.quantity, 0)}
            </span>

            <span className="text-zinc-500">Total amount</span>
            <span className="font-medium text-zinc-900">${order.totalAmount.toFixed(2)}</span>
          </div>

          <div className="mt-8 flex items-end gap-8 border-b border-zinc-200">
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
              onClick={() => setActiveTab("products")}
              className={`border-b-2 pb-3 text-base transition sm:text-lg ${activeTab === "products"
                ? "border-zinc-900 font-semibold text-zinc-900"
                : "border-transparent text-zinc-500"
                }`}
            >
              Products
            </button>
          </div>

          {activeTab === "details" ? (
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                <div className="text-sm text-zinc-500">Order note</div>
                <div className="mt-2 text-sm text-zinc-800 sm:text-base">
                  Order created successfully and ready for processing.
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {order.products.map((item) => (
                <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="text-base font-semibold text-zinc-900 sm:text-lg">{item.ProductName}</h3>
                    </div>

                    <span className="shrink-0 rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-700">
                      Qty: {item.quantity}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const styles: Record<OrderStatus, string> = {
    Pending: "bg-amber-100 text-amber-700",
    Processing: "bg-blue-100 text-blue-700",
    Shipped: "bg-violet-100 text-violet-700",
    Delivered: "bg-emerald-100 text-emerald-700",
    Cancelled: "bg-rose-100 text-rose-700",
  };

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize sm:text-sm ${styles[status]}`}>
      {status}
    </span>
  );
}

function PaymentBadge({ status }: { status: PaymentStatus }) {
  const styles: Record<PaymentStatus, string> = {
    paid: "bg-emerald-100 text-emerald-700",
    pending: "bg-zinc-200 text-zinc-700"
  };

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize sm:text-sm ${styles[status]}`}>
      {status}
    </span>
  );
}

function SearchAndFilters({
  search,
  onSearchChange,
}: {
  search: string;
  onSearchChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="flex h-10 w-full items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 text-zinc-500 sm:w-[260px]">
          <span className="text-sm">⌕</span>
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search order or email..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
          />
        </div>

        <button
          type="button"
          className="h-10 rounded-lg border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-900 shadow-sm shadow-sm transition-all duration-150
hover:bg-zinc-50 hover:border-zinc-400 hover:shadow
active:scale-[0.96] active:bg-zinc-100
"
        >
          Filter
        </button>
      </div>

      <button
        type="button"
        className="h-10 rounded-lg border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-900 shadow-sm"
      >
        Columns
      </button>
    </div>
  );
}
type OrdersTableProps = {
  rows: OrderRow[];
  setRows: Dispatch<SetStateAction<OrderRow[]>>;
};
function OrdersTable({ rows, setRows }: OrdersTableProps) {
  const [open, setOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const { storeID } = useAuth();
  if (!storeID) {
    return
  }

   const { mutate } = useEditTraderOrder();


  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;

    return rows.filter(
      (row) =>
        row.customerEmail.toLowerCase().includes(q) ||
        row.shippingAddress.toLowerCase().includes(q)
    );
  }, [rows, search]);

  const selectedOrder = rows.find((row) => row._id === selectedOrderId) ?? null;

  const updateOrderStatus = (id: string, newStatus: OrderStatus) => {

    mutate(
      {
        id: storeID,
        _id: id,
        orderStatus: newStatus,
      },
      {
        onSuccess: (data) => {

          toast.success(data)
          setRows((prev) =>
            prev.map((row) => (row._id === id ? { ...row, orderStatus: newStatus } : row))
          );
        },

        onError: (error: any) => {
          if (error?.response?.status === 500) {
            toast.error("Something went wrong");
            return;
          }

          toast.error(error.response?.data)
        },
      }
    );


  };

  const cycleStatus = (id: string) => {
    const flow: OrderStatus[] = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

    setRows((prev) =>
      prev.map((row) => {
        if (row._id !== id) return row;
        const currentIndex = flow.indexOf(row.orderStatus);
        const nextStatus = flow[(currentIndex + 1) % flow.length];
        return { ...row, status: nextStatus };
      })
    );
  };

  const openOrder = (id: string) => {
    setSelectedOrderId(id);
    setOpen(true);
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm sm:p-4">
      <SearchAndFilters search={search} onSearchChange={setSearch} />

      <div className="mt-5 hidden overflow-x-auto md:block">
        <table className="w-full min-w-[920px] border-separate border-spacing-y-2 text-left">
          <thead>
            <tr className="text-sm text-zinc-500">
              <th className="pb-2 font-medium">Order Number</th>
              <th className="pb-2 font-medium">Total Amount</th>
              <th className="pb-2 font-medium">Date</th>
              <th className="pb-2 font-medium">Status</th>
              <th className="pb-2 font-medium">Payment Status</th>
              <th className="pb-2 font-medium">Shipping Address</th>
              <th className="pb-2 font-medium">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredRows.map((row) => (
              <tr
                key={row._id}
                className="rounded-xl text-sm text-zinc-800 hover:bg-zinc-50"
              >
                <td className="py-2 font-semibold">{row.orderNumber}</td>
                <td className="py-2">${row.totalAmount.toFixed(2)}</td>
                <td className="py-2">{row.orderDate}</td>
                <td className="py-2">
                  <button type="button" onClick={() => cycleStatus(row._id)}>
                    <StatusBadge status={row.orderStatus} />
                  </button>
                </td>
                <td className="py-2">
                  <PaymentBadge status={row.paymentStatus} />
                </td>
                <td className="py-2 text-zinc-600">{row.shippingAddress}</td>
                <td className="py-2">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => openOrder(row._id)}
                      className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-900 transition hover:bg-zinc-50"
                    >
                      View
                    </button>

                    <select
                      value={row.orderStatus}
                      onChange={(e) => updateOrderStatus(row._id, e.target.value as OrderStatus)}
                      className="rounded-lg border border-zinc-300 bg-white px-2 py-1.5 text-xs outline-none"
                    >
                      <option value="Pending">pending</option>
                      <option value="Processing">processing</option>
                      <option value="Shipped">shipped</option>
                      <option value="Delivered">delivered</option>
                      <option value="Cancelled">cancelled</option>
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 space-y-3 md:hidden">
        {filteredRows.map((row) => (
          <div
            key={row._id}
            className="rounded-xl border border-zinc-200 bg-zinc-50 p-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <button
                  type="button"
                  onClick={() => openOrder(row._id)}
                  className="truncate text-sm font-semibold text-zinc-900"
                >
                  {row.orderNumber}
                </button>
                <p className="mt-1 break-all text-xs text-zinc-500">{row.customerEmail}</p>
              </div>

              <StatusBadge status={row.orderStatus} />
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-zinc-600">
              <div>
                <div className="text-zinc-400">Total</div>
                <div className="mt-1 font-medium text-zinc-900">${row.totalAmount.toFixed(2)}</div>
              </div>

              <div>
                <div className="text-zinc-400">Payment</div>
                <div className="mt-1">
                  <PaymentBadge status={row.paymentStatus} />
                </div>
              </div>

              <div className="col-span-2">
                <div className="text-zinc-400">Date</div>
                <div className="mt-1 text-zinc-900">{row.orderDate}</div>
              </div>

              <div className="col-span-2">
                <div className="text-zinc-400">Shipping</div>
                <div className="mt-1 text-zinc-900">{row.shippingAddress}</div>
              </div>
            </div>

            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => openOrder(row._id)}
                className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs font-medium text-zinc-900"
              >
                View details
              </button>

              <select
                value={row.orderStatus}
                onChange={(e) => updateOrderStatus(row._id, e.target.value as OrderStatus)}
                className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs outline-none"
              >
                <option value="Pending">pending</option>
                <option value="Processing">processing</option>
                <option value="Shipped">shipped</option>
                <option value="Delivered">delivered</option>
                <option value="Cancelled">cancelled</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      <OrderSidePanel open={open} onClose={() => setOpen(false)} order={selectedOrder} />
    </div>
  );
}

function TopTabs() {

  return (
    <div className="flex flex-col gap-3 border-b border-zinc-200 bg-[#f7f5f2] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-lg font-semibold text-zinc-900">Order Management</h1>
      </div>



    </div>
  );
}

function StatPill() {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white px-4 py-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-600">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-zinc-900">24</span>
            <span>Total orders</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-zinc-900">8</span>
            <span className="text-emerald-600 text-xs font-medium">+33%</span>
            <span>Delivered</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-zinc-900">5</span>
            <span className="text-amber-600 text-xs font-medium">Pending</span>
            <span>Need action</span>
          </div>
        </div>

        <div className="text-sm text-zinc-600">
          📦 Track and manage your recent orders
        </div>
      </div>
    </div>
  );
}

export default function TraderHome() {
  const { storeID } = useAuth();

  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<OrderRow[]>([]);

  const { data, isLoading, isError, isFetching } = useGetTraderOrders(
    storeID!,
    page
  );

  useEffect(() => {
    if (data?.data) {
      setRows(data.data);
    }
  }, [data]);

  const pageInfo = {
    page: data?.page ?? 1,
    totalPages: data?.totalPages ?? 1,
    total: data?.total ?? 0,
  };

  if (isLoading) {
    return <div className="p-4">Loading orders...</div>;
  }

  if (isError) {
    return <div className="p-4">Something went wrong</div>;
  }

  return (
    <div className="min-h-screen bg-[#f7f5f2]">
      <TopTabs />

      <div className="space-y-4 p-4">
        <StatPill />

        {isFetching && (
          <p className="text-sm text-zinc-500">Updating orders...</p>
        )}

        <OrdersTable rows={rows} setRows={setRows} />
      </div>

      <div className="mt-1 flex flex-col gap-4 border-t border-zinc-100 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-center gap-8 text-zinc-400 sm:flex-1">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((old) => old - 1)}
            className="rounded-md text-3xl transition-all duration-150 hover:scale-110 hover:text-zinc-900 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ‹
          </button>

          <span className="text-sm text-zinc-700">
            Page {pageInfo.page} of {pageInfo.totalPages}
          </span>

          <button
            type="button"
            disabled={pageInfo.page >= pageInfo.totalPages}
            onClick={() => setPage((old) => old + 1)}
            className="rounded-md text-3xl transition-all duration-150 hover:scale-110 hover:text-zinc-900 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}