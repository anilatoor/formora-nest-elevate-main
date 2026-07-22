import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search, Heart, ShoppingBag, Globe, Menu, X, Star, Plus, Minus,
  Truck, ShieldCheck, Hammer, ArrowRight, ArrowUpRight, Eye,
  MessageCircle, Facebook, Instagram, Mail, MapPin, Upload,
} from "lucide-react";

import heroImg from "@/assets/hero-living.jpg";
import craftImg from "@/assets/craftsmanship.jpg";
import catLiving from "@/assets/cat-living.jpg";
import catBedroom from "@/assets/cat-bedroom.jpg";
import catOffice from "@/assets/cat-office.jpg";
import catDining from "@/assets/cat-dining.jpg";
import catOutdoor from "@/assets/cat-outdoor.jpg";
import pSofa from "@/assets/prod-sofa.jpg";
import pChair from "@/assets/prod-chair.jpg";
import pTable from "@/assets/prod-table.jpg";
import pBed from "@/assets/prod-bed.jpg";
import pOffice from "@/assets/prod-office.jpg";
import pDining from "@/assets/prod-dining.jpg";

export const Route = createFileRoute("/")({
  component: FormoraHome,
});

/* -------------------------------- data -------------------------------- */

type Product = {
  id: string;
  name: string;
  sub: string;
  price: number;
  compareAt?: number;
  rating: number;
  reviews: number;
  category: "living" | "bedroom" | "office" | "dining";
  image: string;
};

const CURRENCY = "PKR";
const fmt = (n: number) => `Rs ${n.toLocaleString("en-PK")}`;

const PRODUCTS: Product[] = [
  { id: "p1", name: "Halden Bouclé Sofa", sub: "3-Seater · Cream", price: 289000, compareAt: 339000, rating: 4.9, reviews: 128, category: "living", image: pSofa },
  { id: "p2", name: "Ember Lounge Chair", sub: "Accent · Terracotta", price: 119000, rating: 4.8, reviews: 92, category: "living", image: pChair },
  { id: "p3", name: "Nord Pedestal Table", sub: "Coffee · Solid Oak", price: 89000, compareAt: 109000, rating: 4.7, reviews: 61, category: "living", image: pTable },
  { id: "p4", name: "Sarai Wingback Bed", sub: "King · Linen Cream", price: 249000, rating: 5.0, reviews: 74, category: "bedroom", image: pBed },
  { id: "p5", name: "Atrio Executive Chair", sub: "Ergonomic · Cognac", price: 149000, compareAt: 179000, rating: 4.9, reviews: 213, category: "office", image: pOffice },
  { id: "p6", name: "Vella Dining Table", sub: "6-Seater · White Oak", price: 219000, rating: 4.8, reviews: 47, category: "dining", image: pDining },
];

const CATEGORIES = [
  { name: "Living Room", desc: "Sofas · Lounges · Coffee Tables", image: catLiving },
  { name: "Bedroom", desc: "Beds · Wardrobes · Nightstands", image: catBedroom },
  { name: "Office", desc: "Executive Chairs · Desks · Shelves", image: catOffice },
  { name: "Dining", desc: "Tables · Chairs · Bar Stools", image: catDining },
  { name: "Outdoor", desc: "Lounges · Hanging Chairs · Planters", image: catOutdoor },
];

const NAV = ["Shop", "New Arrivals", "Bespoke", "About", "Contact"];
const TABS = [
  { key: "all", label: "All" },
  { key: "living", label: "Living" },
  { key: "bedroom", label: "Bedroom" },
  { key: "office", label: "Office" },
] as const;

/* ----------------------------- main page ------------------------------ */

function FormoraHome() {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("all");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [wish, setWish] = useState<Record<string, boolean>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [quick, setQuick] = useState<Product | null>(null);
  const [bespokeOpen, setBespokeOpen] = useState(false);

  const filtered = useMemo(
    () => (tab === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === tab)),
    [tab],
  );
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartLines = Object.entries(cart).map(([id, qty]) => ({
    product: PRODUCTS.find((p) => p.id === id)!,
    qty,
  }));
  const cartTotal = cartLines.reduce((s, l) => s + l.product.price * l.qty, 0);

  const addToCart = (id: string, qty = 1) => {
    setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + qty }));
    setCartOpen(true);
  };
  const setQty = (id: string, qty: number) => {
    setCart((c) => {
      const n = { ...c };
      if (qty <= 0) delete n[id];
      else n[id] = qty;
      return n;
    });
  };
  const toggleWish = (id: string) => setWish((w) => ({ ...w, [id]: !w[id] }));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AnnouncementBar />
      <Header
        cartCount={cartCount}
        wishCount={Object.values(wish).filter(Boolean).length}
        onCart={() => setCartOpen(true)}
        onSearch={() => setSearchOpen(true)}
        onMenu={() => setMenuOpen(true)}
      />

      <main>
        <Hero onBespoke={() => setBespokeOpen(true)} />
        <TrustBar />
        <Categories />
        <Products
          tab={tab}
          setTab={setTab}
          items={filtered}
          wish={wish}
          onWish={toggleWish}
          onQuick={setQuick}
          onAdd={(id) => addToCart(id, 1)}
        />
        <BrandStory />
        <Bespoke onOpen={() => setBespokeOpen(true)} />
        <Testimonials />
        <SocialGrid />
        <Newsletter />
      </main>

      <Footer />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        lines={cartLines}
        total={cartTotal}
        setQty={setQty}
      />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <QuickView
        product={quick}
        onClose={() => setQuick(null)}
        onAdd={(qty) => quick && addToCart(quick.id, qty)}
        wished={quick ? !!wish[quick.id] : false}
        onWish={() => quick && toggleWish(quick.id)}
      />
      <BespokeModal open={bespokeOpen} onClose={() => setBespokeOpen(false)} />
    </div>
  );
}

/* --------------------------- top-of-page ------------------------------ */

function AnnouncementBar() {
  return (
    <div className="bg-[color:var(--ink)] text-primary-foreground text-xs sm:text-[13px]">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2.5 text-center">
        <span className="tracking-[0.18em] uppercase opacity-80">Complimentary Delivery Nationwide</span>
        <span className="hidden sm:inline opacity-40">·</span>
        <span className="hidden sm:inline tracking-[0.18em] uppercase opacity-80">Bespoke Consultations Open</span>
      </div>
    </div>
  );
}

function Header({
  cartCount, wishCount, onCart, onSearch, onMenu,
}: {
  cartCount: number; wishCount: number;
  onCart: () => void; onSearch: () => void; onMenu: () => void;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <button
          className="lg:hidden -ml-2 rounded-md p-2 text-foreground/80 hover:text-foreground"
          onClick={onMenu}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <a href="#top" className="flex min-w-0 items-baseline gap-2">
          <span className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
            FORMORA
          </span>
          <span className="hidden text-[10px] uppercase tracking-[0.28em] text-muted-foreground sm:inline">
            Furniture & Living
          </span>
        </a>

        <nav className="hidden justify-center lg:flex" aria-label="Primary">
          <ul className="flex items-center gap-8 text-sm">
            <li><a href="#top" className="text-foreground hover:text-[color:var(--clay)] transition-colors">Home</a></li>
            {NAV.map((n) => (
              <li key={n}>
                <a
                  href={n === "Shop" ? "#categories" : n === "New Arrivals" ? "#products" : n === "Bespoke" ? "#bespoke" : n === "About" ? "#story" : "#contact"}
                  className="text-foreground/80 hover:text-[color:var(--clay)] transition-colors"
                >
                  {n}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2 justify-self-end">
          <IconBtn label="Search" onClick={onSearch}><Search className="h-[18px] w-[18px]" /></IconBtn>
          <button
            className="hidden items-center gap-1 rounded-full px-2.5 py-2 text-xs text-foreground/70 hover:text-foreground md:inline-flex"
            aria-label="Region"
          >
            <Globe className="h-[16px] w-[16px]" />
            <span>PKR</span>
          </button>
          <IconBtn label="Wishlist" badge={wishCount}><Heart className="h-[18px] w-[18px]" /></IconBtn>
          <IconBtn label="Cart" badge={cartCount} onClick={onCart}>
            <ShoppingBag className="h-[18px] w-[18px]" />
          </IconBtn>
        </div>
      </div>
    </header>
  );
}

function IconBtn({
  children, label, onClick, badge,
}: {
  children: React.ReactNode; label: string; onClick?: () => void; badge?: number;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="relative rounded-full p-2 text-foreground/80 hover:text-foreground hover:bg-muted transition-colors"
    >
      {children}
      {badge !== undefined && badge > 0 && (
        <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-[color:var(--clay)] px-1 text-[10px] font-semibold text-white">
          {badge}
        </span>
      )}
    </button>
  );
}

/* -------------------------------- hero -------------------------------- */

function Hero({ onBespoke }: { onBespoke: () => void }) {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 pt-10 pb-14 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:px-8 lg:pt-16 lg:pb-24">
        <div className="fade-up lg:col-span-5 lg:pt-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--clay)]" />
            New · Autumn Collection 2026
          </span>
          <h1 className="mt-6 font-serif text-[44px] leading-[1.04] tracking-tight text-foreground sm:text-6xl lg:text-[68px]">
            Elevate your living space with{" "}
            <em className="not-italic text-[color:var(--clay)]">timeless</em> craftsmanship.
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
            Discover modern, ergonomic, and futuristic furniture crafted for
            contemporary homes — where warmth meets precise, sculptural design.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#products"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:gap-3"
            >
              Explore Collection
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <button
              onClick={onBespoke}
              className="inline-flex items-center gap-2 rounded-full border border-foreground/20 bg-transparent px-6 py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-foreground hover:text-primary-foreground"
            >
              Book Bespoke Consultation
            </button>
          </div>

          <div className="mt-10 flex items-center gap-4">
            <div className="flex -space-x-2">
              {[pChair, pSofa, pBed].map((s, i) => (
                <div key={i} className="h-9 w-9 rounded-full border-2 border-background bg-cover bg-center" style={{ backgroundImage: `url(${s})` }} />
              ))}
            </div>
            <div className="text-xs text-muted-foreground">
              <div className="flex items-center gap-1 text-foreground">
                {[0, 1, 2, 3, 4].map((i) => <Star key={i} className="h-3.5 w-3.5 fill-[color:var(--clay)] text-[color:var(--clay)]" />)}
                <span className="ml-1 text-foreground/80 font-medium">4.9 / 5</span>
              </div>
              <span>Loved by 12,400+ homes</span>
            </div>
          </div>
        </div>

        <div className="fade-up lg:col-span-7">
          <div className="relative">
            <div className="absolute -left-6 -top-6 hidden h-32 w-32 rounded-full bg-[color:var(--clay)]/15 blur-2xl md:block" />
            <div className="relative overflow-hidden rounded-3xl shadow-[0_30px_80px_-30px_rgba(26,25,24,0.35)]">
              <img
                src={heroImg}
                alt="Modern minimalist living room featuring Formora furniture"
                width={1600}
                height={1200}
                className="h-[420px] w-full object-cover sm:h-[520px] lg:h-[640px]"
              />
            </div>

            {/* floating card */}
            <div className="absolute bottom-5 left-5 hidden max-w-[240px] rounded-2xl border border-border bg-card/95 p-4 shadow-xl backdrop-blur sm:block">
              <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Featured</div>
              <div className="mt-1 font-serif text-lg">Halden Bouclé Sofa</div>
              <div className="mt-1 text-sm text-muted-foreground">Handcrafted · 5-year warranty</div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-base font-semibold">Rs 289,000</span>
                <a href="#products" className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustBar() {
  const items = [
    { icon: Truck, label: "Free Delivery Nationwide" },
    { icon: ShieldCheck, label: "100% Quality Guaranteed" },
    { icon: Hammer, label: "Custom Made Options" },
  ];
  return (
    <section className="border-y border-border bg-card">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 sm:grid-cols-3 sm:px-6 lg:px-8">
        {items.map((it) => (
          <div key={it.label} className="flex items-center gap-4">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[color:var(--clay)]/10 text-[color:var(--clay)]">
              <it.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-foreground">{it.label}</div>
              <div className="text-xs text-muted-foreground">Backed by Formora Assurance</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------ sections ------------------------------ */

function Categories() {
  return (
    <section id="categories" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="flex items-end justify-between gap-6">
        <div>
          <span className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">01 — Shop by Room</span>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl lg:text-5xl">Curated for every corner of the home.</h2>
        </div>
        <a href="#products" className="hidden shrink-0 items-center gap-1 text-sm text-foreground/80 hover:text-[color:var(--clay)] sm:inline-flex">
          View all <ArrowRight className="h-4 w-4" />
        </a>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6 lg:grid-rows-2">
        <CategoryCard cat={CATEGORIES[0]} className="lg:col-span-3 lg:row-span-2" tall />
        <CategoryCard cat={CATEGORIES[1]} className="lg:col-span-3" />
        <CategoryCard cat={CATEGORIES[2]} className="lg:col-span-2" />
        <CategoryCard cat={CATEGORIES[3]} className="lg:col-span-2" />
        <CategoryCard cat={CATEGORIES[4]} className="lg:col-span-2" />
      </div>
    </section>
  );
}

function CategoryCard({
  cat, className = "", tall = false,
}: {
  cat: (typeof CATEGORIES)[number]; className?: string; tall?: boolean;
}) {
  return (
    <a
      href="#products"
      className={`hover-zoom group relative block overflow-hidden rounded-3xl bg-muted ${tall ? "min-h-[420px]" : "min-h-[220px]"} ${className}`}
    >
      <div
        className="hover-zoom-inner absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${cat.image})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--ink)]/70 via-[color:var(--ink)]/10 to-transparent" />
      <div className="relative flex h-full flex-col justify-end p-6">
        <div className="text-[11px] uppercase tracking-[0.22em] text-white/80">{cat.desc}</div>
        <div className="mt-1 flex items-center justify-between gap-4">
          <h3 className="font-serif text-2xl text-white sm:text-3xl">{cat.name}</h3>
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-[color:var(--ink)] transition-transform group-hover:rotate-45">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </a>
  );
}

function Products({
  tab, setTab, items, wish, onWish, onQuick, onAdd,
}: {
  tab: string;
  setTab: (t: (typeof TABS)[number]["key"]) => void;
  items: Product[];
  wish: Record<string, boolean>;
  onWish: (id: string) => void;
  onQuick: (p: Product) => void;
  onAdd: (id: string) => void;
}) {
  return (
    <section id="products" className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">02 — Bestsellers</span>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl lg:text-5xl">Pieces our clients love most.</h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`rounded-full border px-4 py-2 text-sm transition-all ${
                  tab === t.key
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground/80 hover:border-foreground/40"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {items.map((p) => (
            <ProductCard
              key={p.id}
              p={p}
              wished={!!wish[p.id]}
              onWish={() => onWish(p.id)}
              onQuick={() => onQuick(p)}
              onAdd={() => onAdd(p.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({
  p, wished, onWish, onQuick, onAdd,
}: {
  p: Product; wished: boolean; onWish: () => void; onQuick: () => void; onAdd: () => void;
}) {
  return (
    <article className="group flex flex-col">
      <div className="relative overflow-hidden rounded-2xl bg-background">
        <img
          src={p.image}
          alt={p.name}
          loading="lazy"
          width={900}
          height={900}
          className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {p.compareAt && (
          <span className="absolute left-3 top-3 rounded-full bg-[color:var(--clay)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
            Sale
          </span>
        )}
        <button
          onClick={onWish}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-background/90 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-background"
        >
          <Heart className={`h-4 w-4 ${wished ? "fill-[color:var(--clay)] text-[color:var(--clay)]" : ""}`} />
        </button>
        <div className="absolute inset-x-3 bottom-3 flex translate-y-3 items-center gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            onClick={onQuick}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-background/95 py-2.5 text-xs font-medium text-foreground backdrop-blur hover:bg-background"
          >
            <Eye className="h-3.5 w-3.5" /> Quick View
          </button>
          <button
            onClick={onAdd}
            aria-label="Add to cart"
            className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground hover:bg-[color:var(--clay)]"
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-serif text-lg text-foreground">{p.name}</h3>
          <p className="text-xs text-muted-foreground">{p.sub}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1 text-xs text-foreground/80">
          <Star className="h-3.5 w-3.5 fill-[color:var(--clay)] text-[color:var(--clay)]" />
          {p.rating}
        </div>
      </div>
      <div className="mt-1.5 flex items-baseline gap-2">
        <span className="text-base font-semibold text-foreground">{fmt(p.price)}</span>
        {p.compareAt && (
          <span className="text-xs text-muted-foreground line-through">{fmt(p.compareAt)}</span>
        )}
      </div>
    </article>
  );
}

function BrandStory() {
  return (
    <section id="story" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-28">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <div className="relative overflow-hidden rounded-3xl">
            <img src={craftImg} alt="Craftsman working on Formora joinery" loading="lazy" width={1200} height={1400} className="h-[420px] w-full object-cover sm:h-[560px]" />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <Stat n="15+" l="Years of joinery" />
            <Stat n="120" l="In-house artisans" />
            <Stat n="12.4k" l="Homes furnished" />
          </div>
        </div>
        <div className="lg:col-span-6 lg:pl-6">
          <span className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">03 — Our Story</span>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl lg:text-5xl leading-[1.05]">
            Futuristic design, met with the honest patience of artisan joinery.
          </h2>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            Formora blends futuristic design principles with artisan joinery.
            Every curve, fabric, and wood texture is curated to bring balance and
            warmth to your home. We work with responsibly sourced timber and
            in-house craftsmen who obsess over the smallest chamfer.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            The result: furniture that softens contemporary architecture and
            grows more beautiful over the years.
          </p>
          <a href="#bespoke" className="mt-8 inline-flex items-center gap-2 border-b border-foreground pb-1 text-sm font-medium text-foreground hover:text-[color:var(--clay)] hover:border-[color:var(--clay)]">
            Discover the atelier <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="font-serif text-2xl text-foreground">{n}</div>
      <div className="text-xs text-muted-foreground">{l}</div>
    </div>
  );
}

function Bespoke({ onOpen }: { onOpen: () => void }) {
  const items = [
    { title: "Custom Wardrobes", desc: "Floor-to-ceiling storage sculpted to your room." },
    { title: "Modular Kitchens", desc: "Precise joinery paired with quiet-close hardware." },
    { title: "Living TV Units", desc: "Media walls with integrated lighting and acoustics." },
  ];
  return (
    <section id="bespoke" className="relative overflow-hidden bg-[color:var(--ink)] text-primary-foreground">
      <div className="pointer-events-none absolute -left-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-[color:var(--clay)]/25 blur-3xl" />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <span className="text-[11px] uppercase tracking-[0.22em] text-primary-foreground/60">04 — Bespoke Joinery</span>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl lg:text-5xl leading-[1.05]">
              Furniture built entirely around your space.
            </h2>
            <p className="mt-6 max-w-md text-primary-foreground/70">
              From modular wardrobes to full kitchen fit-outs, our atelier will
              design, prototype, and install a piece made only for you.
            </p>
            <button
              onClick={onOpen}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[color:var(--clay)] px-6 py-3.5 text-sm font-medium text-white transition-transform hover:-translate-y-0.5"
            >
              Request Custom Quote <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {items.map((it, i) => (
                <div key={it.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-primary-foreground/50">0{i + 1}</div>
                  <div className="mt-2 font-serif text-xl">{it.title}</div>
                  <p className="mt-2 text-sm text-primary-foreground/70">{it.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const reviews = [
    { name: "Rania A.", city: "Karachi", text: "The Halden sofa transformed our living room. The bouclé feels architectural yet inviting.", rating: 5 },
    { name: "Iman K.", city: "Lahore", text: "Formora's bespoke team redesigned our wardrobe wall. Every millimetre is intentional.", rating: 5 },
    { name: "Ahmed R.", city: "Islamabad", text: "Delivery was seamless. The finish on the Nord table is a work of art.", rating: 5 },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="flex items-end justify-between">
        <div>
          <span className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">05 — Homes We've Furnished</span>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl lg:text-5xl">Loved by design-led homes.</h2>
        </div>
      </div>
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {reviews.map((r) => (
          <figure key={r.name} className="flex h-full flex-col rounded-3xl border border-border bg-card p-6">
            <div className="flex gap-1">
              {[...Array(r.rating)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-[color:var(--clay)] text-[color:var(--clay)]" />
              ))}
            </div>
            <blockquote className="mt-4 flex-1 font-serif text-xl leading-snug text-foreground">
              &ldquo;{r.text}&rdquo;
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-4">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-[color:var(--clay)]/15 font-serif text-[color:var(--clay)]">
                {r.name[0]}
              </div>
              <div>
                <div className="text-sm font-medium">{r.name}</div>
                <div className="text-xs text-muted-foreground">{r.city}</div>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function SocialGrid() {
  const imgs = [catLiving, catBedroom, catDining, catOffice, catOutdoor, pSofa];
  return (
    <section className="border-y border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex flex-col items-center text-center">
          <span className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">06 — @FormoraFurniture</span>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl">Tagged in real homes.</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Share your Formora space with #FormoraAtHome for a chance to be featured.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-6">
          {imgs.map((src, i) => (
            <a key={i} href="#" className="hover-zoom group relative block aspect-square overflow-hidden rounded-2xl">
              <div className="hover-zoom-inner absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${src})` }} />
              <div className="absolute inset-0 flex items-center justify-center bg-[color:var(--ink)]/0 opacity-0 transition-all group-hover:bg-[color:var(--ink)]/40 group-hover:opacity-100">
                <Instagram className="h-6 w-6 text-white" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 sm:p-12 lg:p-16">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[color:var(--clay)]/10 blur-3xl" />
        <div className="relative grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
          <div>
            <span className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Formora Club</span>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl lg:text-5xl leading-[1.05]">
              Join Formora Club for 10% off your first order.
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">Early access to collections, styling notes, and private sales.</p>
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); if (email) setSent(true); }}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@home.com"
              className="flex-1 rounded-full border border-border bg-background px-5 py-3.5 text-sm outline-none focus:border-foreground"
              aria-label="Email address"
            />
            <button className="rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground hover:bg-[color:var(--clay)] transition-colors">
              {sent ? "Welcome ✓" : "Get 10% Off"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- footer ------------------------------- */

function Footer() {
  return (
    <footer id="contact" className="bg-[color:var(--ink)] text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-2">
            <div className="font-serif text-3xl">FORMORA</div>
            <div className="mt-1 text-xs uppercase tracking-[0.28em] text-primary-foreground/60">Furniture & Living</div>
            <p className="mt-5 max-w-sm text-sm text-primary-foreground/70">
              Modern, ergonomic, and bespoke furniture crafted in our own atelier.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="https://wa.me/923445888883"
                className="inline-flex items-center gap-2 rounded-full bg-[color:var(--clay)] px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp Direct Order
              </a>
              <a
                href="https://facebook.com/formorafurniture"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2.5 text-sm text-white hover:bg-white/10"
              >
                <Facebook className="h-4 w-4" /> Facebook Page
              </a>
            </div>
          </div>

          <FooterCol title="Shop" links={["Living Room", "Bedroom", "Office", "Dining", "Outdoor"]} />
          <FooterCol title="Company" links={["About", "Bespoke", "FAQs", "Shipping & Returns", "Warranty & Care"]} />
          <div>
            <h4 className="text-sm font-semibold tracking-wide">Contact</h4>
            <ul className="mt-4 space-y-3 text-sm text-primary-foreground/70">
              <li className="flex items-start gap-2"><span className="mt-0.5 h-4 w-4 text-center text-xs">👤</span> Muhammad Zishan Toor</li>
              <li className="flex items-start gap-2"><MessageCircle className="mt-0.5 h-4 w-4" /> 0344 5888883</li>
              <li className="flex items-start gap-2"><Mail className="mt-0.5 h-4 w-4" /> info@formora.pk</li>
              <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4" /> Islamabad, Pakistan</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 text-xs text-primary-foreground/60 sm:flex-row sm:items-center">
          <div>© {new Date().getFullYear()} Formora Furniture. All rights reserved.</div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-md bg-white/10 px-2 py-1">VISA</span>
            <span className="rounded-md bg-white/10 px-2 py-1">Mastercard</span>
            <span className="rounded-md bg-white/10 px-2 py-1">Easypaisa</span>
            <span className="rounded-md bg-white/10 px-2 py-1">JazzCash</span>
            <span className="rounded-md bg-white/10 px-2 py-1">COD</span>
          </div>
          <div className="flex items-center gap-3">
            <a aria-label="Facebook" href="https://facebook.com/formorafurniture" className="hover:text-white"><Facebook className="h-4 w-4" /></a>
            <a aria-label="Instagram" href="#" className="hover:text-white"><Instagram className="h-4 w-4" /></a>
            <a aria-label="TikTok" href="https://www.tiktok.com/@formora.furniture" className="hover:text-white"><TikTokIcon className="h-4 w-4" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
    </svg>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h4 className="text-sm font-semibold tracking-wide">{title}</h4>
      <ul className="mt-4 space-y-2.5 text-sm text-primary-foreground/70">
        {links.map((l) => (
          <li key={l}><a href="#" className="hover:text-white">{l}</a></li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------ overlays ------------------------------ */

function CartDrawer({
  open, onClose, lines, total, setQty,
}: {
  open: boolean; onClose: () => void;
  lines: { product: Product; qty: number }[];
  total: number;
  setQty: (id: string, qty: number) => void;
}) {
  return (
    <Drawer open={open} onClose={onClose} title="Your Bag">
      {lines.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          <div className="text-sm text-muted-foreground">Your bag is empty.</div>
          <button onClick={onClose} className="rounded-full bg-primary px-5 py-2.5 text-sm text-primary-foreground">
            Continue shopping
          </button>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto px-5 py-4">
            <ul className="divide-y divide-border">
              {lines.map(({ product, qty }) => (
                <li key={product.id} className="flex gap-4 py-4">
                  <img src={product.image} alt={product.name} className="h-20 w-20 rounded-xl object-cover" />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="truncate font-serif text-base">{product.name}</div>
                        <div className="text-xs text-muted-foreground">{product.sub}</div>
                      </div>
                      <button onClick={() => setQty(product.id, 0)} className="text-xs text-muted-foreground hover:text-foreground" aria-label="Remove">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <QtyStepper qty={qty} onChange={(n) => setQty(product.id, n)} />
                      <div className="text-sm font-semibold">{fmt(product.price * qty)}</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="border-t border-border bg-card px-5 py-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold">{fmt(total)}</span>
            </div>
            <div className="mt-1 text-xs text-muted-foreground">Delivery & taxes calculated at checkout.</div>
            <button className="mt-4 w-full rounded-full bg-primary py-3.5 text-sm font-medium text-primary-foreground hover:bg-[color:var(--clay)] transition-colors">
              Checkout · {fmt(total)}
            </button>
          </div>
        </>
      )}
    </Drawer>
  );
}

function QtyStepper({ qty, onChange }: { qty: number; onChange: (n: number) => void }) {
  return (
    <div className="inline-flex items-center rounded-full border border-border">
      <button onClick={() => onChange(qty - 1)} className="grid h-8 w-8 place-items-center text-foreground/70 hover:text-foreground" aria-label="Decrease">
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="min-w-6 text-center text-sm">{qty}</span>
      <button onClick={() => onChange(qty + 1)} className="grid h-8 w-8 place-items-center text-foreground/70 hover:text-foreground" aria-label="Increase">
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function Drawer({
  open, onClose, title, children,
}: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div
        className={`absolute inset-0 bg-[color:var(--ink)]/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-background shadow-2xl transition-transform ${open ? "translate-x-0" : "translate-x-full"}`}
        role="dialog"
        aria-label={title}
      >
        <header className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="font-serif text-xl">{title}</div>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-muted" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </header>
        {children}
      </aside>
    </div>
  );
}

function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const results = q ? PRODUCTS.filter((p) => p.name.toLowerCase().includes(q.toLowerCase())) : PRODUCTS.slice(0, 4);
  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}>
      <div className={`absolute inset-0 bg-[color:var(--ink)]/50 backdrop-blur-sm transition-opacity ${open ? "opacity-100" : "opacity-0"}`} onClick={onClose} />
      <div className={`relative mx-auto mt-20 max-w-2xl px-4 transition-all ${open ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"}`}>
        <div className="overflow-hidden rounded-3xl border border-border bg-background shadow-2xl">
          <div className="flex items-center gap-3 border-b border-border px-5 py-4">
            <Search className="h-5 w-5 text-muted-foreground" />
            <input
              autoFocus={open}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search sofas, beds, dining..."
              className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
              aria-label="Search products"
            />
            <button onClick={onClose} className="rounded-full p-1.5 hover:bg-muted" aria-label="Close"><X className="h-4 w-4" /></button>
          </div>
          <div className="max-h-96 overflow-y-auto p-3">
            <div className="mb-2 px-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              {q ? `${results.length} results` : "Popular"}
            </div>
            <ul className="grid grid-cols-1 gap-1">
              {results.map((p) => (
                <li key={p.id}>
                  <button className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-muted">
                    <img src={p.image} alt="" className="h-12 w-12 rounded-lg object-cover" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.sub}</div>
                    </div>
                    <div className="text-sm">{fmt(p.price)}</div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Drawer open={open} onClose={onClose} title="Menu">
      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="flex flex-col">
          {["Home", ...NAV].map((n) => (
            <li key={n}>
              <a
                href="#top"
                onClick={onClose}
                className="flex items-center justify-between border-b border-border px-4 py-4 font-serif text-xl hover:bg-muted"
              >
                {n}
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </Drawer>
  );
}

function QuickView({
  product, onClose, onAdd, wished, onWish,
}: {
  product: Product | null; onClose: () => void; onAdd: (qty: number) => void;
  wished: boolean; onWish: () => void;
}) {
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);
  if (!product) return null;
  const thumbs = [product.image, pSofa, pChair, pTable].slice(0, 4);
  return (
    <Modal onClose={onClose}>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="bg-muted p-4 md:p-6">
          <img src={thumbs[active]} alt={product.name} className="aspect-square w-full rounded-2xl object-cover" />
          <div className="mt-3 grid grid-cols-4 gap-2">
            {thumbs.map((t, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`aspect-square overflow-hidden rounded-lg border ${active === i ? "border-foreground" : "border-transparent opacity-70 hover:opacity-100"}`}
              >
                <img src={t} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col p-6 md:p-8">
          <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">{product.sub}</div>
          <h3 className="mt-1 font-serif text-3xl">{product.name}</h3>
          <div className="mt-2 flex items-center gap-2 text-sm">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-[color:var(--clay)] text-[color:var(--clay)]" />)}
            </div>
            <span className="text-muted-foreground">{product.rating} · {product.reviews} reviews</span>
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl font-semibold">{fmt(product.price)}</span>
            {product.compareAt && <span className="text-sm text-muted-foreground line-through">{fmt(product.compareAt)}</span>}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Handcrafted in our atelier from responsibly sourced timber and premium
            textiles. Delivered white-glove within 2–3 weeks.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <QtyStepper qty={qty} onChange={(n) => setQty(Math.max(1, n))} />
            <button
              onClick={() => { onAdd(qty); onClose(); }}
              className="flex-1 rounded-full bg-primary py-3.5 text-sm font-medium text-primary-foreground hover:bg-[color:var(--clay)] transition-colors"
            >
              Add to Bag · {fmt(product.price * qty)}
            </button>
            <button
              onClick={onWish}
              aria-label="Wishlist"
              className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-border hover:bg-muted"
            >
              <Heart className={`h-4 w-4 ${wished ? "fill-[color:var(--clay)] text-[color:var(--clay)]" : ""}`} />
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function Modal({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6">
      <div className="absolute inset-0 bg-[color:var(--ink)]/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-3xl overflow-hidden rounded-t-3xl bg-background shadow-2xl sm:rounded-3xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-background/90 text-foreground shadow hover:bg-background"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </div>
  );
}

function BespokeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [sent, setSent] = useState(false);
  if (!open) return null;
  return (
    <Modal onClose={onClose}>
      <div className="p-6 sm:p-8">
        <span className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Bespoke Consultation</span>
        <h3 className="mt-2 font-serif text-3xl">Request a custom quote</h3>
        <p className="mt-2 text-sm text-muted-foreground">Tell us about the space — our design team will reply within 24 hours.</p>

        {sent ? (
          <div className="mt-8 rounded-2xl border border-border bg-card p-6 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[color:var(--clay)]/15 text-[color:var(--clay)]">✓</div>
            <div className="mt-3 font-serif text-xl">Request received</div>
            <p className="mt-1 text-sm text-muted-foreground">A Formora designer will be in touch shortly.</p>
          </div>
        ) : (
          <form
            onSubmit={(e) => { e.preventDefault(); setSent(true); }}
            className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            <Field label="Full Name"><input required className={inputCls} placeholder="Your name" /></Field>
            <Field label="Email"><input required type="email" className={inputCls} placeholder="you@home.com" /></Field>
            <Field label="Project Type">
              <select className={inputCls} defaultValue="">
                <option value="" disabled>Select…</option>
                <option>Custom Wardrobe</option>
                <option>Modular Kitchen</option>
                <option>Living TV Unit</option>
                <option>Full Home Fit-Out</option>
              </select>
            </Field>
            <Field label="Room Dimensions (L × W × H)">
              <input className={inputCls} placeholder="e.g. 14 × 12 × 9 ft" />
            </Field>
            <Field label="Details" full>
              <textarea rows={3} className={`${inputCls} min-h-[92px] resize-none`} placeholder="Materials, references, timeline…" />
            </Field>
            <Field label="Attach floor plan or reference" full>
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card px-4 py-6 text-sm text-muted-foreground hover:border-foreground/40">
                <Upload className="h-4 w-4" />
                Drop a file or browse (PDF, JPG, PNG)
                <input type="file" className="hidden" />
              </label>
            </Field>
            <div className="sm:col-span-2 flex flex-col-reverse items-stretch gap-3 pt-2 sm:flex-row sm:items-center sm:justify-end">
              <button type="button" onClick={onClose} className="rounded-full border border-border px-6 py-3 text-sm hover:bg-muted">Cancel</button>
              <button type="submit" className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-[color:var(--clay)]">
                Send Request
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}

const inputCls =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground";

function Field({ label, children, full = false }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={`flex flex-col gap-1.5 ${full ? "sm:col-span-2" : ""}`}>
      <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
