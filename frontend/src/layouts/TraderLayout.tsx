import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import SideBar, { DropdownMenu } from "../commponents/SideBar";
import { capitalizeFirst } from "../utils/capitalizeFirst";
import { useAuth } from "../contexts/AuthProvider";

export default function TraderLayout() {
  
  const [open, setOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("");
  const [selectedSidebarItem, setSelectedSidebarItem] = useState("Home"); 
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const {logout} = useAuth()

  useEffect(() => {
    const path = location.pathname; // /user/bill

    let lastPart = path.split("/").pop(); // bill

    // if for words who has spaces bettwen each other
   
     if(lastPart == "order" || lastPart == "Order" ){
      setSelectedSidebarItem(capitalizeFirst("Order Management") || "Home");
     }
     else if(lastPart == "design" || lastPart == "Design"){
      setSelectedSidebarItem(capitalizeFirst("Design Management") || "Home");
     }
     else if(lastPart == "offers" || lastPart == "Offers" ){
      setSelectedSidebarItem(capitalizeFirst("Offers and discounts") || "Home");
     }
     else{
      setSelectedSidebarItem(capitalizeFirst(lastPart) || "Home");
     }
   

  }, []);
   function navigateSelcted (item:string){
    setSelectedMenu(item);
    if(item == "Switch Shop"){
     navigate("/choose");
    }
    if(item == "Log out"){
     logout()
     navigate("/");
    }
    if(item == "Create New Shop"){
       navigate("../create");
    }
   }

  return (
    <div className="flex min-h-screen bg-[#f5f5f3] ">
      <button
        type="button"
        onClick={() => setMobileSidebarOpen(true)}
        className="fixed left-4 top-4 z-40 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold shadow md:hidden"
      >
        ☰ Menu
      </button>

      {mobileSidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
        />
      )}

      <div
        className={`fixed left-0 top-0 z-40 h-full transform transition-transform duration-300 md:static md:translate-x-0 ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="relative h-full">
          <div className="absolute right-3 top-3 z-50 md:hidden">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(false)}
              className="rounded-lg bg-white px-3 py-1 text-sm font-semibold shadow"
            >
              ✕
            </button>
          </div>

          <SideBar
            onToggle={() => setOpen((prev) => !prev)}
            selectedItem={selectedSidebarItem}
            onSelectItem={(item) => {
              setSelectedSidebarItem(capitalizeFirst(item));
              setMobileSidebarOpen(false);
            }}
          />

          {open && <DropdownMenu selected={selectedMenu} onSelect={navigateSelcted} />}
        </div>
      </div>

      <div className="flex-1">
        <Outlet />
      </div>
    </div> )
  
}