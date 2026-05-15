import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";
import { capitalizeFirst } from "../utils/capitalizeFirst";


function Avatar() {
    return (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black font-bold text-white">
            S
        </div>
    );
}

function SidebarHeader({ onToggle }: { onToggle: () => void }) {
     const { storeName  } = useAuth()
    return (
        <div className="flex items-center justify-between px-2 py-3">
            <button
                type="button"
                onClick={onToggle}
                className="flex items-center gap-2 rounded-lg px-1 py-1 cursor-pointer"
            >
                <Avatar />
                <span className="font-semibold">{storeName}</span>
            </button>
        </div>
    );
}

export function DropdownMenu({
    selected,
    onSelect,
}: {
    selected: string;
    onSelect: (item: string) => void;
}) {
    const items = [
        "Switch Shop",
        "Log out",
        "Create New Shop"
    ];
     const { storeName ,websiteId } = useAuth()

    return (
        <div className="absolute left-4 top-14 z-50 w-[280px] rounded-2xl border bg-white shadow-xl">
            <div className="border-b p-4">
                <div className="flex items-center gap-3">
                    <Avatar />
                    <div>
                        <div className="font-semibold">{storeName}</div>
                        <div className="text-sm text-gray-500">{websiteId}</div>
                    </div>
                </div>
            </div>

            <div className="p-2">
                {items.map((item) => (
                    <button
                        key={item}
                        type="button"
                        onClick={() => onSelect(item)}
                        className={`w-full rounded-md px-4 py-3 text-left text-sm transition cursor-pointer ${selected === item ? "bg-gray-200 font-semibold" : "hover:bg-gray-100"
                            }`}
                    >
                        {item}
                    </button>
                ))}
            </div>
        </div>
    );
}

function SidebarButton({
    item,
    selectedItem,
    onSelect,
}: {
    item: string;
    selectedItem: string;
    onSelect: (item: string) => void;
}) {
    const isSelected = selectedItem === item;
    const navigate = useNavigate();


    return (
        <button
            key={item}
            type="button"
            onClick={() => {
                onSelect(capitalizeFirst(item));
                const firstWord = item.split(" ")[0].toLocaleLowerCase()
                navigate(`/user/${firstWord}`);
            }}
            className={`w-full rounded-lg px-3 py-2 text-left transition cursor-pointer ${isSelected
                    ? "bg-purple-100 font-medium text-purple-600"
                    : "text-zinc-700 hover:bg-gray-200"
                }`}
        >
            {item}
        </button>
    );
}

export default function Sidebar({
    onToggle,
    selectedItem,
    onSelectItem,
}: {
    onToggle: () => void;
    selectedItem: string;
    onSelectItem: (item: string) => void;
}) {
    const mainItems = [ "Products" ];

    

    return (
        <div className="relative min-h-screen w-[260px] space-y-4 bg-[#f5f5f3] p-4 border-r border-zinc-200 ">
            <SidebarHeader onToggle={onToggle} />

            <div className="space-y-2">
                {mainItems.map((item) => (
                    <SidebarButton
                        key={item}
                        item={item}
                        selectedItem={selectedItem}
                        onSelect={onSelectItem}
                    />
                ))}
            </div>
        </div>
    );
}

