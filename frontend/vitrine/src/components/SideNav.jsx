import {
  MdDashboard,
  MdInventory2,
  MdShoppingBag,
  MdGroup,
  MdSettings,
  MdLogout,
  MdChat,
  MdVisibility,
  MdShoppingCart,
  MdAdd,
  MdEdit,
  MdDelete,
  MdRefresh,
  MdMenu,
} from "react-icons/md";

const NAV_LINKS = [
  { icon: MdDashboard,   label: "Dashboard", active: true  },
  { icon: MdInventory2,  label: "Products",  active: false },
  { icon: MdShoppingBag, label: "Orders",    active: false },
  { icon: MdGroup,       label: "Customers", active: false },
  { icon: MdSettings,    label: "Settings",  active: false },
];

function SideNav() {
  return (
    <nav className="bg-[#F2F2F2] dark:bg-slate-900 h-screen w-64 hidden md:flex flex-col space-between p-6 overflow-y-hidden border-r-8 border-[#7C05F2]/10 shadow-xl sticky top-0 z-40">
      {/* Brand */}
      <div className="flex flex-col items-center mb-8 rotate-[-2deg]">
        <span className="font-['DynaPuff'] text-3xl font-black text-[#7C05F2] mb-2">
          Papelaria Itapira
        </span>
        <div className="bg-surface-container-lowest p-2 rounded-xl shadow-md border-2 border-primary/20 flex items-center gap-3 w-full">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4j8c1EtbbQNPTOgi39JyHvo0SsM8iADb0psVbLwgaB5c-QVFVDGlF7aj39zw__nmCfzzjIH75Goso9kTCJEgXbc55iB4aNg33Ys7C_yZYXuX10xLwIwUNneJ9SnJAK0WUEfKfpQ6tDsmUeRD8aMrSVUXfxy1wQUxG74Q4HyBTMbxZIngch8xvdVhnc1he71Erc26ajmx46B6O7AStclp6KjjXnMTwH_UNqIeEhmfY3g2luMFEacRQrEKqOQvXMR-elDwtS6UmnHM"
            alt="User Profile"
            className="w-10 h-10 rounded-full"
          />
          <div className="flex flex-col">
            <span className="font-bold text-sm text-on-background">Admin User</span>
            <span className="text-xs text-on-surface-variant">Store Manager</span>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="flex flex-col gap-2 font-['Plus_Jakarta_Sans'] text-md font-bold">
        {NAV_LINKS.map(({ icon: Icon, label, active }) =>
          active ? (
            <a
              key={label}
              href="#"
              className="bg-[#14F20C] text-slate-900 rounded-[30%_70%_70%_30%/50%] p-4 shadow-[4px_4px_0px_#7C05F2] flex items-center gap-3 rotate-[-2deg] scale-98 transition-all"
            >
              <Icon size={22} />
              {label}
            </a>
          ) : (
            <a
              key={label}
              href="#"
              className="text-slate-700 dark:text-slate-300 p-4 hover:bg-white/50 rounded-2xl flex items-center gap-3 hover:translate-x-2 transition-all duration-300"
            >
              <Icon size={22} />
              {label}
            </a>
          )
        )}
      </div>

      {/* Logout */}
      <div className="mt-auto pt-8">
        <button className="w-full bg-secondary text-white font-bold py-3 px-4 rounded-xl btn-offset flex justify-center items-center gap-2">
          <MdLogout size={22} />
          Logout
        </button>
      </div>
    </nav>
  );
}

export default SideNav;