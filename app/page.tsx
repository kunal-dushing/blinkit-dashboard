"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowUpRight,
  BarChart3,
  Boxes,
  ChartNoAxesCombined,
  ChevronDown,
  CircleHelp,
  LayoutDashboard,
  ListFilter,
  MapPin,
  Package,
  Star,
} from "lucide-react";

const outlets = [
  { name: "Grocery Store", tier: "Tier 1", sales: 73808, items: 528, avg: 139.78, rating: 3.94 },
  { name: "Supermarket Type 1", tier: "Tier 1", sales: 262592, items: 1860, avg: 141.18, rating: 3.92 },
  { name: "Grocery Store", tier: "Tier 2", sales: 45000, items: 320, avg: 140.63, rating: 3.93 },
  { name: "Supermarket Type 1", tier: "Tier 2", sales: 216672, items: 1532, avg: 141.43, rating: 3.92 },
  { name: "Supermarket Type 2", tier: "Tier 2", sales: 131478, items: 928, avg: 141.68, rating: 3.93 },
  { name: "Grocery Store", tier: "Tier 3", sales: 33131, items: 235, avg: 140.98, rating: 3.93 },
  { name: "Supermarket Type 1", tier: "Tier 3", sales: 308286, items: 2185, avg: 141.09, rating: 3.92 },
  { name: "Supermarket Type 3", tier: "Tier 3", sales: 130715, items: 935, avg: 139.80, rating: 3.91 },
];

const yearlySalesBase = [
  { year: "2011", sales: 78000 }, { year: "2012", sales: 130000 },
  { year: "2014", sales: 132000 }, { year: "2015", sales: 131000 },
  { year: "2016", sales: 132000 }, { year: "2017", sales: 133000 },
  { year: "2018", sales: 205000 }, { year: "2020", sales: 129000 },
  { year: "2022", sales: 131000 },
];

const itemTypes = [
  { name: "Fruits and Vegetables", sales: 181000 }, { name: "Snack Foods", sales: 180000 },
  { name: "Household", sales: 144000 }, { name: "Frozen Foods", sales: 120000 },
  { name: "Dairy", sales: 101000 }, { name: "Canned", sales: 90000 },
  { name: "Baking Goods", sales: 80000 }, { name: "Health and Hygiene", sales: 71000 },
  { name: "Meat", sales: 62000 }, { name: "Soft Drinks", sales: 59000 },
  { name: "Breads", sales: 42000 }, { name: "Hard Drinks", sales: 31000 },
  { name: "Others", sales: 22000 }, { name: "Starchy Foods", sales: 19000 },
  { name: "Breakfast", sales: 16000 },
];

const tierTotals = [
  { name: "Tier 3", value: 472130, color: "#c9a800" },
  { name: "Tier 2", value: 393150, color: "#f0d365" },
  { name: "Tier 1", value: 336400, color: "#9bcf91" },
];
const sizeMix = [
  { name: "Medium", value: 508000, color: "#64a65a" },
  { name: "Small", value: 445000, color: "#408c4e" },
  { name: "High", value: 249000, color: "#f1ce18" },
];
const tierMix = {
  "Tier 1": { lowFat: 0.3607, sizes: { Medium: 0.3879, Small: 0.6121, High: 0 } },
  "Tier 2": { lowFat: 0.354, sizes: { Medium: 0.46, Small: 0.36, High: 0.18 } },
  "Tier 3": { lowFat: 0.351, sizes: { Medium: 0.43, Small: 0.34, High: 0.23 } },
} as const;
const tierYearFactors = {
  "Tier 1": [0.9, 1, 1.01, 1, 1.01, 1.02, 0.36, 0.99, 1],
  "Tier 2": [0.95, 1, 1, 1.02, 1, 1.02, 1.03, 1, 1.01],
  "Tier 3": [0.91, 1.02, 1, 1, 1.01, 1.01, 1.35, 1, 1.02],
} as const;

const formatMoney = (value: number) =>
  value >= 1_000_000 ? `$${(value / 1_000_000).toFixed(2)}M` : `$${Math.round(value / 1000)}K`;

function StatCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <article className="stat-card">
      <div className="stat-accent" />
      <div className="stat-copy"><span>{title}</span><strong>{value}</strong><small>vs. all outlets <b>↗ 8.4%</b></small></div>
      <div className="stat-icon">{icon}</div>
    </article>
  );
}

function PanelTitle({ children, note }: { children: React.ReactNode; note?: string }) {
  return <div className="panel-title"><h2>{children}</h2>{note && <span>{note}</span>}</div>;
}

export default function Home() {
  const [selectedTiers, setSelectedTiers] = useState(["Tier 1", "Tier 2", "Tier 3"]);
  const [metric, setMetric] = useState("Total Sales");
  const filteredRecords = useMemo(
    () => outlets.filter((outlet) => selectedTiers.includes(outlet.tier)),
    [selectedTiers],
  );
  const filteredOutlets = useMemo(() => {
    const grouped = new Map<string, { name: string; tiers: string[]; sales: number; items: number; ratingTotal: number }>();
    for (const outlet of filteredRecords) {
      const current = grouped.get(outlet.name) ?? { name: outlet.name, tiers: [], sales: 0, items: 0, ratingTotal: 0 };
      current.sales += outlet.sales;
      current.items += outlet.items;
      current.ratingTotal += outlet.rating * outlet.items;
      if (!current.tiers.includes(outlet.tier)) current.tiers.push(outlet.tier);
      grouped.set(outlet.name, current);
    }
    return [...grouped.values()].map((outlet) => ({
      ...outlet,
      avg: outlet.items ? outlet.sales / outlet.items : 0,
      rating: outlet.items ? outlet.ratingTotal / outlet.items : 0,
      tier: outlet.tiers.length === 1 ? outlet.tiers[0] : "Mixed",
    }));
  }, [filteredRecords]);
  const totals = useMemo(() => ({
    sales: filteredRecords.reduce((sum, outlet) => sum + outlet.sales, 0),
    items: filteredRecords.reduce((sum, outlet) => sum + outlet.items, 0),
    avg: filteredRecords.reduce((sum, outlet) => sum + outlet.sales, 0) / Math.max(1, filteredRecords.reduce((sum, outlet) => sum + outlet.items, 0)),
    rating: filteredRecords.reduce((sum, outlet) => sum + outlet.rating * outlet.items, 0) / Math.max(1, filteredRecords.reduce((sum, outlet) => sum + outlet.items, 0)),
  }), [filteredRecords]);
  const activeTierTotals = useMemo(
    () => tierTotals.filter((tier) => selectedTiers.includes(tier.name)),
    [selectedTiers],
  );
  const selectedSales = activeTierTotals.reduce((sum, tier) => sum + tier.value, 0);
  const filterRatio = selectedSales / tierTotals.reduce((sum, tier) => sum + tier.value, 0);
  const activeYearlySales = useMemo(() => yearlySalesBase.map((point, index) => {
    const factor = selectedSales
      ? activeTierTotals.reduce((sum, tier) => sum + tier.value * tierYearFactors[tier.name as keyof typeof tierYearFactors][index], 0) / selectedSales
      : 0;
    return { ...point, sales: point.sales * factor };
  }), [activeTierTotals, filterRatio, selectedSales]);
  const activeItemTypes = useMemo(() => itemTypes.map((item, index) => {
    const tierFactor = selectedSales
      ? activeTierTotals.reduce((sum, tier) => {
        const tierIndex = Number(tier.name.slice(-1));
        const categoryFactor = 0.86 + ((index * 3 + tierIndex * 5) % 7) * 0.04;
        return sum + tier.value * categoryFactor;
      }, 0) / selectedSales
      : 0;
    return { ...item, sales: item.sales * filterRatio * tierFactor };
  }), [activeTierTotals, filterRatio, selectedSales]);
  const activeFatMix = useMemo(() => {
    const lowFatShare = selectedSales
      ? activeTierTotals.reduce((sum, tier) => sum + tier.value * tierMix[tier.name as keyof typeof tierMix].lowFat, 0) / selectedSales
      : 0;
    return [
      { name: "Low Fat", value: selectedSales * lowFatShare, color: "#c9a800" },
      { name: "Regular", value: selectedSales * (1 - lowFatShare), color: "#559b61" },
    ];
  }, [activeTierTotals, selectedSales]);
  const activeSizeMix = useMemo(() => ["Medium", "Small", "High"].map((name) => {
    const share = selectedSales
      ? activeTierTotals.reduce((sum, tier) => sum + tier.value * tierMix[tier.name as keyof typeof tierMix].sizes[name as "Medium" | "Small" | "High"], 0) / selectedSales
      : 0;
    const color = sizeMix.find((item) => item.name === name)?.color ?? "#ccc";
    return { name, value: selectedSales * share, color };
  }).filter((item) => item.value > 0), [activeTierTotals, selectedSales]);
  const activeFatOutlet = activeTierTotals.map((tier) => {
    const lowFatShare = tierMix[tier.name as keyof typeof tierMix].lowFat;
    return { name: tier.name, low: (tier.value * lowFatShare) / 1_000_000, regular: (tier.value * (1 - lowFatShare)) / 1_000_000 };
  });

  function toggleTier(tier: string) {
    setSelectedTiers((current) => current.includes(tier) ? current.filter((item) => item !== tier) : [...current, tier]);
  }

  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-name">blink<span>it</span></div><div className="brand-tagline">India&apos;s Last Minute App</div><div className="brand-mark">b<span>⚡</span></div></div>
        <div className="filter-heading"><ListFilter size={18} /><span>FILTER PANEL</span></div>
        <label className="filter-label" htmlFor="location-filter">Outlet Location <ChevronDown size={15} /></label>
        <div className="filter-select" id="location-filter">
          {(["Tier 1", "Tier 2", "Tier 3"] as const).map((tier) => (
            <label className="check-row" key={tier}>
              <input type="checkbox" checked={selectedTiers.includes(tier)} onChange={() => toggleTier(tier)} />
              <span>{tier}</span>
            </label>
          ))}
        </div>
        <div className="sidebar-bottom"><div className="fruit-art">🥭 🍌<br /><strong>blinkit</strong><br />🍊 🍇 🍎</div><small>Fresh insights, delivered fast.</small></div>
      </aside>

      <main className="dashboard-main">
        <header className="mobile-header"><div className="brand-name">blink<span>it</span></div><button aria-label="Help"><CircleHelp size={19} /></button></header>
        <div className="page-heading"><div><div className="eyebrow"><LayoutDashboard size={15} /> BUSINESS INTELLIGENCE</div><h1>Outlet performance</h1><p>Sales, assortment and customer ratings at a glance.</p></div><button className="date-button">All time <ChevronDown size={15} /></button></div>

        <section className="stats-grid" aria-label="Summary metrics">
          <StatCard title="TOTAL SALES" value={formatMoney(totals.sales)} icon={<ChartNoAxesCombined size={38} />} />
          <StatCard title="AVG SALES" value={`$${totals.avg.toFixed(0)}`} icon={<BarChart3 size={38} />} />
          <StatCard title="NO. OF ITEMS" value={totals.items.toLocaleString("en-IN")} icon={<Boxes size={38} />} />
          <StatCard title="AVG RATING" value={totals.rating.toFixed(1)} icon={<Star size={38} fill="currentColor" />} />
        </section>

        <section className="top-grid">
          <article className="panel establishment-panel">
            <PanelTitle note="Annual sales · USD">Outlet establishment</PanelTitle>
            <div className="chart-area"><ResponsiveContainer width="100%" height="100%"><AreaChart data={activeYearlySales} margin={{ top: 18, right: 10, left: 2, bottom: 0 }}>
              <defs><linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f6d93e" stopOpacity={0.8} /><stop offset="100%" stopColor="#f6d93e" stopOpacity={0.28} /></linearGradient></defs>
              <CartesianGrid stroke="#e9e9e9" strokeDasharray="3 4" vertical={false} />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#858585" }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(value) => `$${Math.round(value / 1000)}K`} tick={{ fontSize: 10, fill: "#858585" }} axisLine={false} tickLine={false} width={47} />
              <Tooltip formatter={(value) => [formatMoney(Number(value)), "Sales"]} />
              <Area type="monotone" dataKey="sales" stroke="#161616" strokeWidth={2.5} fill="url(#salesFill)" activeDot={{ r: 5, fill: "#161616" }} />
            </AreaChart></ResponsiveContainer></div>
          </article>
          <article className="panel size-panel">
            <PanelTitle note="Sales by outlet size">Outlet size</PanelTitle>
            <div className="donut-wrap"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={activeSizeMix} dataKey="value" nameKey="name" innerRadius="57%" outerRadius="80%" paddingAngle={2} stroke="none">{activeSizeMix.map((entry) => <Cell key={entry.name} fill={entry.color} />)}</Pie><Tooltip formatter={(value) => [formatMoney(Number(value)), "Sales"]} /></PieChart></ResponsiveContainer><div className="donut-center"><strong>{formatMoney(selectedSales)}</strong><span>filtered sales</span></div></div>
            <div className="legend legend-column">{activeSizeMix.map((item) => <span key={item.name}><i style={{ background: item.color }} />{item.name}</span>)}</div>
          </article>
          <article className="panel location-panel">
            <PanelTitle note="Sales by location tier">Outlet location</PanelTitle>
            <div className="location-total"><span>Share of sales</span><strong>100%</strong></div>
            {activeTierTotals.map((tier) => <div className="location-row" key={tier.name}><span>{tier.name}</span><div className="location-bar"><i style={{ width: `${selectedSales ? (tier.value / selectedSales) * 100 : 0}%`, background: tier.color }} /><b>{formatMoney(tier.value)} · {selectedSales ? `${((tier.value / selectedSales) * 100).toFixed(0)}%` : "0%"}</b></div></div>)}
            {!selectedTiers.length && <p className="empty-note">Select a tier to see location sales.</p>}
          </article>
        </section>

        <section className="analysis-grid">
          <div className="left-analysis">
            <article className="panel metric-panel"><div className="metric-label">Metrics</div><div className="metric-tabs">{["Total Sales", "Avg Sales", "No. of Items", "Avg Rating"].map((item) => <button className={metric === item ? "active" : ""} key={item} onClick={() => setMetric(item)}>{item}</button>)}</div></article>
            <article className="panel fat-panel"><PanelTitle note="Share of item sales">Fat content</PanelTitle><div className="legend"><span><i className="gold-dot" />Low Fat</span><span><i className="green-dot" />Regular</span></div><div className="fat-content-chart"><div className="fat-label left-label">{formatMoney(activeFatMix[0].value)}<br /><b>({selectedSales ? `${((activeFatMix[0].value / selectedSales) * 100).toFixed(1)}%` : "0%"})</b></div><div className="fat-donut"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={activeFatMix} dataKey="value" innerRadius="63%" outerRadius="88%" paddingAngle={1} stroke="none">{activeFatMix.map((item) => <Cell key={item.name} fill={item.color} />)}</Pie></PieChart></ResponsiveContainer><strong>{formatMoney(selectedSales)}</strong></div><div className="fat-label right-label">{formatMoney(activeFatMix[1].value)}<br /><b>({selectedSales ? `${((activeFatMix[1].value / selectedSales) * 100).toFixed(1)}%` : "0%"})</b></div></div></article>
            <article className="panel fat-outlet-panel"><PanelTitle note="USD millions">Fat by outlet</PanelTitle><div className="legend"><span><i className="gold-dot" />Low Fat</span><span><i className="green-dot" />Regular</span></div><div className="stacked-chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={activeFatOutlet} layout="vertical" margin={{ top: 8, right: 16, left: 4, bottom: 0 }}><CartesianGrid stroke="#eee" strokeDasharray="2 4" horizontal={false} /><XAxis type="number" tick={{ fontSize: 10, fill: "#888" }} tickFormatter={(v) => `$${v.toFixed(1)}M`} axisLine={false} tickLine={false} /><YAxis dataKey="name" type="category" width={52} tick={{ fontSize: 11, fill: "#666" }} axisLine={false} tickLine={false} /><Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}M`, "Sales"]} /><Bar dataKey="low" stackId="a" fill="#c9a800" /><Bar dataKey="regular" stackId="a" fill="#559b61" radius={[0, 4, 4, 0]} /></BarChart></ResponsiveContainer></div></article>
          </div>
          <article className="panel item-panel"><PanelTitle note="Top categories by sales">Item type</PanelTitle><div className="item-chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={activeItemTypes} layout="vertical" margin={{ top: 4, right: 36, left: 5, bottom: 4 }}><XAxis type="number" hide /><YAxis dataKey="name" type="category" width={116} tick={{ fontSize: 10, fill: "#747474" }} axisLine={false} tickLine={false} interval={0} tickFormatter={(name) => name.length > 16 ? `${name.slice(0, 14)}…` : name} /><Tooltip formatter={(value) => [formatMoney(Number(value)), "Sales"]} /><Bar dataKey="sales" fill="#c9a800" radius={[0, 3, 3, 0]} barSize={15} label={{ position: "right", fontSize: 10, fill: "#747474", formatter: (value) => formatMoney(Number(value)) }} /></BarChart></ResponsiveContainer></div></article>
        </section>

        <section className="panel table-panel"><div className="table-heading"><div><div className="eyebrow"><Package size={14} /> OUTLET DETAIL</div><h2>Outlet comparison</h2></div><button className="table-filter"><MapPin size={15} /> {selectedTiers.length ? `${selectedTiers.length} tiers` : "No tiers"}<ChevronDown size={14} /></button></div><div className="table-scroll"><table><thead><tr><th>Outlet type</th><th>Total sales</th><th>No. of items</th><th>Avg sales</th><th>Avg rating</th><th>Tier</th></tr></thead><tbody>{filteredOutlets.map((outlet) => <tr key={outlet.name}><td className="outlet-name">{outlet.name}</td><td><span className="cell-pill yellow">{outlet.sales.toLocaleString("en-IN", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}</span></td><td><span className="cell-pill green">{outlet.items.toLocaleString("en-IN")}</span></td><td><span className="cell-pill pink">${outlet.avg.toFixed(2)}</span></td><td><span className="cell-pill blue"><Star size={12} fill="currentColor" /> {outlet.rating.toFixed(2)}</span></td><td><span className="tier-chip">{outlet.tier}</span></td></tr>)}</tbody></table>{filteredOutlets.length === 0 && <p className="empty-note table-empty">Choose at least one outlet tier to show its outlets.</p>}</div><div className="table-foot">Showing {filteredOutlets.length} outlet types <span>Updated just now <ArrowUpRight size={13} /></span></div></section>
        <footer className="page-footer">Blinkit outlet insights <span>Demo dashboard · sample figures based on the reference screenshot</span></footer>
      </main>
    </div>
  );
}
