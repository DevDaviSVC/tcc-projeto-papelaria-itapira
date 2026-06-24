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
import SideNav from "./components/SideNav";

const KPI_CARDS = [
  {
    icon: MdInventory2,
    label: "Total Products",
    value: "248",
    badge: "+12%",
    badgeType: "positive",
    iconBg: "bg-primary-container",
    iconColor: "text-on-primary-container",
    border: "border-primary/10",
    rotate: "rotate-[1deg]",
  },
  {
    icon: MdChat,
    label: "WhatsApp Leads",
    value: "1,024",
    badge: "+5%",
    badgeType: "positive",
    iconBg: "bg-secondary",
    iconColor: "text-white",
    border: "border-secondary/10",
    rotate: "rotate-[-1deg]",
    valueColor: "text-secondary",
  },
  {
    icon: MdVisibility,
    label: "Catalog Views",
    value: "45.2K",
    badge: "-2%",
    badgeType: "negative",
    iconBg: "bg-tertiary",
    iconColor: "text-on-tertiary",
    border: "border-tertiary/20",
    rotate: "rotate-[2deg]",
    valueColor: "text-on-background",
  },
  {
    icon: MdShoppingCart,
    label: "New Orders",
    value: "89",
    badge: "+18%",
    badgeType: "positive",
    iconBg: "bg-primary",
    iconColor: "text-white",
    border: "border-primary/10",
    rotate: "rotate-[-2deg]",
  },
];

const PRODUCTS = [
  {
    id: 1,
    name: "Neon Runner Pro",
    price: "$120",
    category: "Footwear",
    stock: 42,
    status: "in-stock",
    imageShape: "organic-card",
    cardBorder: "border-surface-container-high",
    cardRotate: "",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCHSGgMuijTP33e9XRX6V5cMTUaW-QvkwIkZYWloF-9yIfnZLi98piDg9xtPwc8MsAyAKieDhSfH-ezx4qjSZb2zsaYmkvJgzhYxLbJ5AEv_l8-d3UsOFYAdsaDiRUIp5UEIpLJZVKcl-xUPckRdeooAWwGNEXdMDFQ6yeIK6TIsCbvGa79QrH2rHCnYhuHdRzeR8e8QatbOCUbBB2jOu4jvMqU093GH0Ly8ZrBjcHb9z_qQSBc0iwuO9qKzG05giu1CrgO7nT669Y",
  },
  {
    id: 2,
    name: "Aura Headphones",
    price: "$85",
    category: "Electronics",
    stock: 3,
    status: "low-stock",
    imageShape: "organic-card-alt",
    cardBorder: "border-secondary/20",
    cardRotate: "rotate-[1deg]",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuARjkF865f6FSilI6yhpowLoXRXqYee-sOIboHzb1anawxCwYdh1gPSoZl5mQzRl3_1TvvvKF_JsEnTp_AttS-urhZbJJXRgk9r_Et5IV-uNdmSFrjmYKsqlE7596V9PMp0QHRWZ04uYkkOsGF2Q8DnL-fKPoaEwUNM1NRoey7rvlUgMLrD7bYoxcXP5NH08VDaaHQQgZl9b_vGE_iK9pQw1kSmKSRoUjeCFzpPdnTqISWg5ICHKNP4373EILHYJ8o3AbtL5te4k4o",
  },
  {
    id: 3,
    name: "Retro Clicker",
    price: "$150",
    category: "Accessories",
    stock: 0,
    status: "out-of-stock",
    imageShape: "",
    cardBorder: "border-surface-container-high",
    cardRotate: "",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCHSQRg3KRUkpdVVUwPLrmIOAglDu8gEIJ7B2TnePjNdiApicJEmlGGd-feDjhOcCCqrIUv8y3poWdX4zkCASKAR4YftscWGlqcMryMi0Oz2xxRotWYXULMsufUYvwb9wyI12yWH6daSb6EgE7gqkyn1frC5FFScT1lUhBxR231WYxrmSofuP1VZ7q2IUXvM0AosFsa062dEdlY5EA7kOIt3q_sLJNR23v1yVgLQUKCQWkVWW_giblW3fT4PfUdugOpZLG-BPaTAOY",
  },
];

// ── Sub-componentes ────────────────────────────────────────────────────────

/** Badge de status do produto */
function StockBadge({ status, stock }) {
  if (status === "in-stock") {
    return (
      <div className="absolute top-2 right-2 bg-tertiary text-on-tertiary text-xs font-black px-3 py-1 rounded-full shadow-md">
        IN STOCK
      </div>
    );
  }
  if (status === "low-stock") {
    return (
      <div className="absolute top-2 right-2 bg-secondary text-white text-xs font-black px-3 py-1 rounded-full shadow-md">
        LOW STOCK ({stock})
      </div>
    );
  }
  return (
    <div className="absolute inset-0 bg-surface-container-lowest/50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-error text-white text-sm font-black px-4 py-2 rounded-full shadow-lg transform -rotate-6 border-2 border-white">
        OUT OF STOCK
      </div>
    </div>
  );
}

/** Card de produto individual */
function ProductCard({ product }) {
  const isOutOfStock = product.status === "out-of-stock";

  return (
    <div
      className={`bg-surface-container-lowest p-4 rounded-3xl shadow-xl border-4 ${product.cardBorder} hover:-translate-y-2 transition-transform duration-300 flex flex-col group ${product.cardRotate} ${isOutOfStock ? "opacity-80 grayscale-[20%]" : ""}`}
    >
      {/* Imagem */}
      <div
        className={`relative h-48 w-full bg-surface-container rounded-2xl overflow-hidden mb-4 border-2 border-primary/10 ${product.imageShape}`}
      >
        <img
          src={product.img}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <StockBadge status={product.status} stock={product.stock} />
      </div>

      {/* Info */}
      <div className="flex-1">
        <div className="flex justify-between items-start mb-1">
          <h3
            className={`font-bold text-xl line-clamp-1 ${isOutOfStock ? "text-on-surface-variant" : "text-on-background"}`}
          >
            {product.name}
          </h3>
          <span
            className={`font-display font-black text-lg ${isOutOfStock ? "text-on-surface-variant" : "text-primary"}`}
          >
            {product.price}
          </span>
        </div>
        <p className="text-sm text-on-surface-variant mb-4 font-medium">
          {product.category} • {product.stock} in stock
        </p>
      </div>

      {/* Ações */}
      <div className="flex gap-2 mt-auto pt-4 border-t-2 border-surface-container-high border-dashed">
        <button className="flex-1 bg-surface-container hover:bg-primary-fixed text-primary font-bold py-2 px-4 rounded-xl transition-colors flex justify-center items-center gap-1">
          <MdEdit size={18} />
          Edit
        </button>
        <button className="bg-surface-container hover:bg-error-container text-error p-2 rounded-xl transition-colors flex justify-center items-center">
          <MdDelete size={22} />
        </button>
      </div>
    </div>
  );
}

/** Card de KPI */
function KpiCard({ card }) {
  const Icon = card.icon;
  const badgeClass =
    card.badgeType === "positive"
      ? "bg-tertiary-fixed text-on-tertiary-fixed-variant"
      : "bg-secondary-fixed text-secondary-dim";

  return (
    <div
      className={`bg-surface-container-lowest p-6 rounded-2xl shadow-xl border-4 ${card.border} ${card.rotate} hover:rotate-0 transition-transform flex flex-col justify-between relative overflow-hidden`}
    >
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-xl" />

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`${card.iconBg} ${card.iconColor} p-3 rounded-xl`}>
          <Icon size={30} />
        </div>
        <span className={`${badgeClass} text-xs font-bold px-2 py-1 rounded-full`}>
          {card.badge}
        </span>
      </div>

      <div className="relative z-10">
        <h3 className="text-on-surface-variant font-bold text-sm mb-1 uppercase tracking-wider">
          {card.label}
        </h3>
        <p className={`font-display text-4xl font-black ${card.valueColor ?? "text-primary"}`}>
          {card.value}
        </p>
      </div>
    </div>
  );
}

/** Bottom nav (mobile) */
const BOTTOM_NAV = [
  { icon: MdDashboard,   label: "Dash",     active: true  },
  { icon: MdInventory2,  label: "Products", active: false },
  { icon: MdShoppingBag, label: "Orders",   active: false },
  { icon: MdSettings,    label: "Settings", active: false },
];

function BottomNav() {
  return (
    <nav className="bg-white dark:bg-slate-950 fixed bottom-0 w-full rounded-t-[40px] md:hidden z-50 shadow-[0_-10px_20px_rgba(0,0,0,0.1)] pb-4 pt-2 px-4 flex justify-around items-center border-t-4 border-[#7C05F2]">
      {BOTTOM_NAV.map(({ icon: Icon, label, active }) =>
        active ? (
          <div
            key={label}
            className="flex flex-col items-center justify-center bg-[#EE0CF2] text-white rounded-full w-16 h-16 -mt-8 shadow-[0_4px_0_#7C05F2] scale-110 transition-transform"
          >
            <Icon size={24} />
            <span className="font-['Plus_Jakarta_Sans'] text-[10px] font-black uppercase mt-1">
              {label}
            </span>
          </div>
        ) : (
          <div
            key={label}
            className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 p-2 hover:text-[#7C05F2]"
          >
            <Icon size={24} />
            <span className="font-['Plus_Jakarta_Sans'] text-[10px] font-black uppercase mt-1">
              {label}
            </span>
          </div>
        )
      )}
    </nav>
  );
}

/** Conteúdo principal do dashboard */
function DashboardContent() {
  return (
    <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto overflow-y-auto">
      {/* Header */}
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="font-display text-4xl md:text-5xl font-black text-on-background tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-on-surface-variant font-medium mt-2">
            Manage your creative empire, boss! ✨
          </p>
        </div>
        {/* Mobile menu toggle */}
        <button className="md:hidden bg-primary text-white p-3 rounded-full btn-offset">
          <MdMenu size={26} />
        </button>
      </header>

      {/* KPI Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {KPI_CARDS.map((card) => (
          <KpiCard key={card.label} card={card} />
        ))}
      </section>

      {/* Product Inventory */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="font-display text-3xl font-black text-on-background">
              Product Inventory
            </h2>
            <p className="text-on-surface-variant font-medium">
              Manage your awesome collection.
            </p>
          </div>
          <button className="bg-tertiary text-on-tertiary font-bold py-3 px-6 rounded-2xl btn-offset-green flex items-center gap-2">
            <MdAdd size={22} />
            <span className="hidden sm:inline">Add Product</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <button className="bg-surface-container-lowest text-primary font-bold py-3 px-8 rounded-2xl shadow-md border-2 border-primary/20 hover:bg-primary-fixed transition-colors flex items-center gap-2">
            <MdRefresh size={22} />
            Load More Products
          </button>
        </div>
      </section>
    </main>
  );
}

// ── Componente raiz ────────────────────────────────────────────────────────
export default function App() {
  return (
    <>
      {/* Fundo com blobs orgânicos */}
      <div className="blob-bg" />

      {/* Layout principal */}
      <div className="flex min-h-screen font-body text-on-background">
        <SideNav />
        <DashboardContent />
      </div>

      {/* Bottom nav (mobile apenas) */}
      <BottomNav />
    </>
  );
}