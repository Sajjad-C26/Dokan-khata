import React, { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Package, ShoppingCart, BookOpen, AlertTriangle, X, Minus } from "lucide-react";

const FONT_IMPORT = `
@import url('https://fonts.googleapis.com/css2?family=Tiro+Bangla:ital@0;1&family=Hind+Siliguri:wght@400;500;600;700&display=swap');
`;

const COLORS = {
  paper: "#F6F1E4",
  paperDark: "#EEE6D2",
  ink: "#2B2B24",
  inkFaint: "#6B6656",
  ledger: "#3D5A45",
  ledgerDark: "#2C4232",
  stamp: "#A6403D",
  brass: "#B8935F",
  line: "#D9CFB2",
};

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function taka(n) {
  return "à§³" + Number(n || 0).toLocaleString("en-IN");
}

export default function DokanKhata() {
  const [tab, setTab] = useState("inventory");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [toast, setToast] = useState(null);

  // ---- load from storage ----
  useEffect(() => {
    try {
      const p = localStorage.getItem("khata:products");
      if (p) setProducts(JSON.parse(p));
    } catch (e) {}
    try {
      const o = localStorage.getItem("khata:orders");
      if (o) setOrders(JSON.parse(o));
    } catch (e) {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem("khata:products", JSON.stringify(products));
    } catch (e) {}
  }, [products, loaded]);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem("khata:orders", JSON.stringify(orders));
    } catch (e) {}
  }, [orders, loaded]);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }

  const lowStock = products.filter((p) => Number(p.stock) <= Number(p.lowAt || 3));

  return (
    <div
      style={{
        minHeight: "100vh",
        background: COLORS.paper,
        backgroundImage:
          "repeating-linear-gradient(0deg, transparent, transparent 34px, rgba(43,43,36,0.045) 35px)",
        fontFamily: "'Hind Siliguri', sans-serif",
        color: COLORS.ink,
      }}
    >
      <style>{FONT_IMPORT}</style>

      <Header lowStockCount={lowStock.length} />

      <TabBar tab={tab} setTab={setTab} orderCount={orders.length} />

      <main
        style={{
          maxWidth: 860,
          margin: "0 auto",
          padding: "0 20px 80px",
        }}
      >
        {tab === "inventory" && (
          <InventoryTab
            products={products}
            setProducts={setProducts}
            showToast={showToast}
          />
        )}
        {tab === "orders" && (
          <OrdersTab
            products={products}
            setProducts={setProducts}
            orders={orders}
            setOrders={setOrders}
            showToast={showToast}
          />
        )}
        {tab === "summary" && (
          <SummaryTab products={products} orders={orders} lowStock={lowStock} />
        )}
      </main>

      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            background: COLORS.ledgerDark,
            color: COLORS.paper,
            padding: "10px 20px",
            borderRadius: 6,
            fontSize: 14,
            fontWeight: 500,
            boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
            zIndex: 50,
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}

function Header({ lowStockCount }) {
  return (
    <header
      style={{
        borderBottom: `2px solid ${COLORS.ink}`,
        padding: "28px 20px 18px",
        maxWidth: 860,
        margin: "0 auto",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <div>
          <div
            style={{
              fontFamily: "'Tiro Bangla', serif",
              fontStyle: "italic",
              fontSize: 13,
              color: COLORS.brass,
              letterSpacing: 1,
              marginBottom: 2,
            }}
          >
            à¦¦à§‹à¦•à¦¾à¦¨à§‡à¦° à¦¹à¦¿à¦¸à¦¾à¦¬à§‡à¦° à¦–à¦¾à¦¤à¦¾
          </div>
          <h1
            style={{
              fontFamily: "'Tiro Bangla', serif",
              fontSize: 34,
              margin: 0,
              fontWeight: 400,
              color: COLORS.ledgerDark,
            }}
          >
            à¦¦à§‹à¦•à¦¾à¦¨ à¦–à¦¾à¦¤à¦¾
          </h1>
        </div>
        {lowStockCount > 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(166,64,61,0.08)",
              border: `1px solid ${COLORS.stamp}`,
              color: COLORS.stamp,
              padding: "6px 12px",
              borderRadius: 4,
              fontSize: 13,
              fontWeight: 600,
              transform: "rotate(-1.5deg)",
            }}
          >
            <AlertTriangle size={15} />
            {lowStockCount}à¦Ÿà¦¿ à¦ªà¦£à§à¦¯à§‡à¦° à¦¸à§à¦Ÿà¦• à¦•à¦®
          </div>
        )}
      </div>
    </header>
  );
}

function TabBar({ tab, setTab, orderCount }) {
  const tabs = [
    { id: "inventory", label: "à¦®à¦¾à¦²à¦¾à¦®à¦¾à¦²", icon: Package },
    { id: "orders", label: "à¦…à¦°à§à¦¡à¦¾à¦°", icon: ShoppingCart },
    { id: "summary", label: "à¦¸à¦¾à¦°à¦¾à¦‚à¦¶", icon: BookOpen },
  ];
  return (
    <div
      style={{
        maxWidth: 860,
        margin: "0 auto",
        display: "flex",
        gap: 4,
        padding: "16px 20px 0",
      }}
    >
      {tabs.map((t) => {
        const active = tab === t.id;
        const Icon = t.icon;
        return (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "9px 16px",
              border: "none",
              borderBottom: active ? `3px solid ${COLORS.ledger}` : "3px solid transparent",
              background: "transparent",
              color: active ? COLORS.ledgerDark : COLORS.inkFaint,
              fontFamily: "'Hind Siliguri', sans-serif",
              fontSize: 15,
              fontWeight: active ? 600 : 500,
              cursor: "pointer",
            }}
          >
            <Icon size={16} />
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

function SectionCard({ children }) {
  return (
    <div
      style={{
        background: COLORS.paperDark,
        border: `1px solid ${COLORS.line}`,
        borderRadius: 8,
        padding: 20,
        marginTop: 20,
      }}
    >
      {children}
    </div>
  );
}

/* ---------------- INVENTORY ---------------- */

function InventoryTab({ products, setProducts, showToast }) {
  const [form, setForm] = useState({ name: "", stock: "", price: "", lowAt: "" });
  const [editingId, setEditingId] = useState(null);

  function resetForm() {
    setForm({ name: "", stock: "", price: "", lowAt: "" });
    setEditingId(null);
  }

  function submit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (editingId) {
      setProducts((ps) =>
        ps.map((p) =>
          p.id === editingId
            ? { ...p, name: form.name, stock: Number(form.stock) || 0, price: Number(form.price) || 0, lowAt: Number(form.lowAt) || 3 }
            : p
        )
      );
      showToast("à¦ªà¦£à§à¦¯ à¦†à¦ªà¦¡à§‡à¦Ÿ à¦¹à¦¯à¦¼à§‡à¦›à§‡");
    } else {
      setProducts((ps) => [
        ...ps,
        {
          id: uid(),
          name: form.name,
          stock: Number(form.stock) || 0,
          price: Number(form.price) || 0,
          lowAt: Number(form.lowAt) || 3,
        },
      ]);
      showToast("à¦¨à¦¤à§à¦¨ à¦ªà¦£à§à¦¯ à¦¯à§‹à¦— à¦¹à¦¯à¦¼à§‡à¦›à§‡");
    }
    resetForm();
  }

  function editProduct(p) {
    setEditingId(p.id);
    setForm({ name: p.name, stock: String(p.stock), price: String(p.price), lowAt: String(p.lowAt) });
  }

  function removeProduct(id) {
    setProducts((ps) => ps.filter((p) => p.id !== id));
    if (editingId === id) resetForm();
    showToast("à¦ªà¦£à§à¦¯ à¦®à§à¦›à§‡ à¦«à§‡à¦²à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡");
  }

  function adjustStock(id, delta) {
    setProducts((ps) =>
      ps.map((p) => (p.id === id ? { ...p, stock: Math.max(0, Number(p.stock) + delta) } : p))
    );
  }

  return (
    <div>
      <SectionCard>
        <div style={{ fontFamily: "'Tiro Bangla', serif", fontSize: 18, marginBottom: 14, color: COLORS.ledgerDark }}>
          {editingId ? "à¦ªà¦£à§à¦¯ à¦¸à¦®à§à¦ªà¦¾à¦¦à¦¨à¦¾ à¦•à¦°à§à¦¨" : "à¦¨à¦¤à§à¦¨ à¦ªà¦£à§à¦¯ à¦¯à§‹à¦— à¦•à¦°à§à¦¨"}
        </div>
        <form onSubmit={submit} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr auto", gap: 10, alignItems: "end" }}>
          <Field label="à¦ªà¦£à§à¦¯à§‡à¦° à¦¨à¦¾à¦®">
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="à¦¯à§‡à¦®à¦¨: à¦šà¦¾à¦² (à§« à¦•à§‡à¦œà¦¿)"
              style={inputStyle}
            />
          </Field>
          <Field label="à¦¸à§à¦Ÿà¦• (à¦¸à¦‚à¦–à§à¦¯à¦¾)">
            <input
              type="number"
              value={form.stock}
              onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
              placeholder="à§¦"
              style={inputStyle}
            />
          </Field>
          <Field label="à¦¦à¦¾à¦® (à§³)">
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              placeholder="à§¦"
              style={inputStyle}
            />
          </Field>
          <Field label="à¦•à¦® à¦¸à§à¦Ÿà¦• à¦¸à§€à¦®à¦¾">
            <input
              type="number"
              value={form.lowAt}
              onChange={(e) => setForm((f) => ({ ...f, lowAt: e.target.value }))}
              placeholder="à§©"
              style={inputStyle}
            />
          </Field>
          <button type="submit" style={primaryBtn}>
            <Plus size={16} />
            {editingId ? "à¦†à¦ªà¦¡à§‡à¦Ÿ" : "à¦¯à§‹à¦— à¦•à¦°à§à¦¨"}
          </button>
        </form>
        {editingId && (
          <button onClick={resetForm} style={{ ...ghostBtn, marginTop: 10 }}>
            à¦¬à¦¾à¦¤à¦¿à¦² à¦•à¦°à§à¦¨
          </button>
        )}
      </SectionCard>

      <div style={{ marginTop: 20 }}>
        {products.length === 0 ? (
          <EmptyState text="à¦à¦–à¦¨à§‹ à¦•à§‹à¦¨à§‹ à¦ªà¦£à§à¦¯ à¦¯à§‹à¦— à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à¦¨à¦¿à¥¤ à¦‰à¦ªà¦°à§‡ à¦¥à§‡à¦•à§‡ à¦ªà§à¦°à¦¥à¦® à¦ªà¦£à§à¦¯à¦Ÿà¦¿ à¦¯à§‹à¦— à¦•à¦°à§à¦¨à¥¤" />
        ) : (
          <div style={{ border: `1px solid ${COLORS.line}`, borderRadius: 8, overflow: "hidden" }}>
            {products.map((p, i) => {
              const low = Number(p.stock) <= Number(p.lowAt || 3);
              return (
                <div
                  key={p.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "14px 16px",
                    borderTop: i === 0 ? "none" : `1px solid ${COLORS.line}`,
                    background: low ? "rgba(166,64,61,0.05)" : COLORS.paper,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{p.name}</div>
                    <div style={{ fontSize: 13, color: COLORS.inkFaint, marginTop: 2 }}>
                      à¦à¦•à¦• à¦¦à¦¾à¦® {taka(p.price)}
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <button onClick={() => adjustStock(p.id, -1)} style={stepBtn}>
                      <Minus size={13} />
                    </button>
                    <div
                      style={{
                        minWidth: 44,
                        textAlign: "center",
                        fontWeight: 700,
                        fontSize: 15,
                        color: low ? COLORS.stamp : COLORS.ink,
                      }}
                    >
                      {p.stock}
                    </div>
                    <button onClick={() => adjustStock(p.id, 1)} style={stepBtn}>
                      <Plus size={13} />
                    </button>
                  </div>

                  {low && (
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: COLORS.stamp,
                        border: `1px solid ${COLORS.stamp}`,
                        borderRadius: 4,
                        padding: "2px 6px",
                        transform: "rotate(-2deg)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      à¦¸à§à¦Ÿà¦• à¦•à¦®
                    </span>
                  )}

                  <button onClick={() => editProduct(p)} style={ghostBtnSmall}>
                    à¦¸à¦®à§à¦ªà¦¾à¦¦à¦¨à¦¾
                  </button>
                  <button onClick={() => removeProduct(p.id)} style={dangerBtnSmall}>
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- ORDERS ---------------- */

function OrdersTab({ products, setProducts, orders, setOrders, showToast }) {
  const [cart, setCart] = useState({});
  const [customer, setCustomer] = useState("");

  function addToCart(id) {
    const p = products.find((x) => x.id === id);
    const inCart = cart[id] || 0;
    if (!p || inCart >= p.stock) return;
    setCart((c) => ({ ...c, [id]: inCart + 1 }));
  }
  function removeFromCart(id) {
    setCart((c) => {
      const next = { ...c };
      if (!next[id]) return next;
      next[id] -= 1;
      if (next[id] <= 0) delete next[id];
      return next;
    });
  }

  const cartItems = Object.entries(cart).map(([id, qty]) => {
    const p = products.find((x) => x.id === id);
    return { id, qty, product: p };
  }).filter((c) => c.product);

  const total = cartItems.reduce((sum, c) => sum + c.qty * c.product.price, 0);

  function completeOrder() {
    if (cartItems.length === 0) return;
    const order = {
      id: uid(),
      customer: customer.trim() || "à¦¸à¦¾à¦§à¦¾à¦°à¦£ à¦•à§à¦°à§‡à¦¤à¦¾",
      items: cartItems.map((c) => ({ name: c.product.name, qty: c.qty, price: c.product.price })),
      total,
      date: new Date().toISOString(),
    };
    setOrders((os) => [order, ...os]);
    setProducts((ps) =>
      ps.map((p) => {
        const inCart = cart[p.id];
        return inCart ? { ...p, stock: Math.max(0, p.stock - inCart) } : p;
      })
    );
    setCart({});
    setCustomer("");
    showToast("à¦…à¦°à§à¦¡à¦¾à¦° à¦¸à¦®à§à¦ªà¦¨à§à¦¨ à¦¹à¦¯à¦¼à§‡à¦›à§‡");
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 20, alignItems: "start" }}>
      <SectionCard>
        <div style={{ fontFamily: "'Tiro Bangla', serif", fontSize: 18, marginBottom: 14, color: COLORS.ledgerDark }}>
          à¦ªà¦£à§à¦¯ à¦¬à¦¾à¦›à¦¾à¦‡ à¦•à¦°à§à¦¨
        </div>
        {products.length === 0 ? (
          <EmptyState text="à¦†à¦—à§‡ 'à¦®à¦¾à¦²à¦¾à¦®à¦¾à¦²' à¦Ÿà§à¦¯à¦¾à¦¬ à¦¥à§‡à¦•à§‡ à¦ªà¦£à§à¦¯ à¦¯à§‹à¦— à¦•à¦°à§à¦¨à¥¤" />
        ) : (
          <div style={{ display: "grid", gap: 8 }}>
            {products.map((p) => {
              const inCart = cart[p.id] || 0;
              const outOfStock = p.stock <= 0;
              return (
                <div
                  key={p.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 12px",
                    background: COLORS.paper,
                    border: `1px solid ${COLORS.line}`,
                    borderRadius: 6,
                    opacity: outOfStock ? 0.5 : 1,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: COLORS.inkFaint }}>
                      {taka(p.price)} â€¢ à¦¸à§à¦Ÿà¦•à§‡ {p.stock}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <button onClick={() => removeFromCart(p.id)} disabled={!inCart} style={stepBtn}>
                      <Minus size={13} />
                    </button>
                    <div style={{ minWidth: 20, textAlign: "center", fontWeight: 700 }}>{inCart}</div>
                    <button onClick={() => addToCart(p.id)} disabled={outOfStock || inCart >= p.stock} style={stepBtn}>
                      <Plus size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>

      <SectionCard>
        <div style={{ fontFamily: "'Tiro Bangla', serif", fontSize: 18, marginBottom: 14, color: COLORS.ledgerDark }}>
          à¦¬à¦°à§à¦¤à¦®à¦¾à¦¨ à¦…à¦°à§à¦¡à¦¾à¦°
        </div>
        <Field label="à¦•à§à¦°à§‡à¦¤à¦¾à¦° à¦¨à¦¾à¦® (à¦à¦šà§à¦›à¦¿à¦•)">
          <input value={customer} onChange={(e) => setCustomer(e.target.value)} placeholder="à¦•à§à¦°à§‡à¦¤à¦¾à¦° à¦¨à¦¾à¦®" style={inputStyle} />
        </Field>
        <div style={{ marginTop: 12, minHeight: 40 }}>
          {cartItems.length === 0 ? (
            <div style={{ fontSize: 13, color: COLORS.inkFaint }}>à¦•à§‹à¦¨à§‹ à¦ªà¦£à§à¦¯ à¦¬à¦¾à¦›à¦¾à¦‡ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à¦¨à¦¿à¥¤</div>
          ) : (
            cartItems.map((c) => (
              <div key={c.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, padding: "5px 0", borderBottom: `1px dashed ${COLORS.line}` }}>
                <span>{c.product.name} Ã— {c.qty}</span>
                <span>{taka(c.qty * c.product.price)}</span>
              </div>
            ))
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 17, marginTop: 12, paddingTop: 10, borderTop: `2px solid ${COLORS.ink}` }}>
          <span>à¦®à§‹à¦Ÿ</span>
          <span>{taka(total)}</span>
        </div>
        <button onClick={completeOrder} disabled={cartItems.length === 0} style={{ ...primaryBtn, width: "100%", justifyContent: "center", marginTop: 14 }}>
          à¦…à¦°à§à¦¡à¦¾à¦° à¦¸à¦®à§à¦ªà¦¨à§à¦¨ à¦•à¦°à§à¦¨
        </button>
      </SectionCard>

      {orders.length > 0 && (
        <div style={{ gridColumn: "1 / -1" }}>
          <div style={{ fontFamily: "'Tiro Bangla', serif", fontSize: 17, margin: "8px 0 10px", color: COLORS.ledgerDark }}>
            à¦¸à¦¾à¦®à§à¦ªà§à¦°à¦¤à¦¿à¦• à¦…à¦°à§à¦¡à¦¾à¦°
          </div>
          <div style={{ border: `1px solid ${COLORS.line}`, borderRadius: 8, overflow: "hidden" }}>
            {orders.slice(0, 8).map((o, i) => (
              <div key={o.id} style={{ padding: "12px 16px", borderTop: i === 0 ? "none" : `1px solid ${COLORS.line}`, background: COLORS.paper }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: 600 }}>{o.customer}</span>
                  <span style={{ fontWeight: 700 }}>{taka(o.total)}</span>
                </div>
                <div style={{ fontSize: 12, color: COLORS.inkFaint, marginTop: 2 }}>
                  {o.items.map((it) => `${it.name}Ã—${it.qty}`).join(", ")}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- SUMMARY ---------------- */

function SummaryTab({ products, orders, lowStock }) {
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const totalStockValue = products.reduce((s, p) => s + p.stock * p.price, 0);
  const todayStr = new Date().toDateString();
  const todayOrders = orders.filter((o) => new Date(o.date).toDateString() === todayStr);
  const todayRevenue = todayOrders.reduce((s, o) => s + o.total, 0);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginTop: 20 }}>
        <StatCard label="à¦†à¦œà¦•à§‡à¦° à¦¬à¦¿à¦•à§à¦°à¦¿" value={taka(todayRevenue)} sub={`${todayOrders.length}à¦Ÿà¦¿ à¦…à¦°à§à¦¡à¦¾à¦°`} />
        <StatCard label="à¦®à§‹à¦Ÿ à¦¬à¦¿à¦•à§à¦°à¦¿" value={taka(totalRevenue)} sub={`${orders.length}à¦Ÿà¦¿ à¦…à¦°à§à¦¡à¦¾à¦°`} />
        <StatCard label="à¦®à¦œà§à¦¦à§‡à¦° à¦®à§‚à¦²à§à¦¯" value={taka(totalStockValue)} sub={`${products.length}à¦Ÿà¦¿ à¦ªà¦£à§à¦¯`} />
        <StatCard label="à¦•à¦® à¦¸à§à¦Ÿà¦•" value={lowStock.length} sub="à¦ªà¦£à§à¦¯" alert={lowStock.length > 0} />
      </div>

      {lowStock.length > 0 && (
        <SectionCard>
          <div style={{ fontFamily: "'Tiro Bangla', serif", fontSize: 17, marginBottom: 10, color: COLORS.stamp }}>
            à¦¶à§€à¦˜à§à¦°à¦‡ à¦¸à§à¦Ÿà¦• à¦†à¦¨à§à¦¨
          </div>
          {lowStock.map((p) => (
            <div key={p.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 14 }}>
              <span>{p.name}</span>
              <span style={{ fontWeight: 700, color: COLORS.stamp }}>{p.stock} à¦¬à¦¾à¦•à¦¿</span>
            </div>
          ))}
        </SectionCard>
      )}
    </div>
  );
}

function StatCard({ label, value, sub, alert }) {
  return (
    <div
      style={{
        background: COLORS.paperDark,
        border: `1px solid ${alert ? COLORS.stamp : COLORS.line}`,
        borderRadius: 8,
        padding: 16,
      }}
    >
      <div style={{ fontSize: 12, color: COLORS.inkFaint, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 700, color: alert ? COLORS.stamp : COLORS.ledgerDark, fontFamily: "'Tiro Bangla', serif" }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: COLORS.inkFaint, marginTop: 2 }}>{sub}</div>
    </div>
  );
}

/* ---------------- SHARED ---------------- */

function Field({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={{ fontSize: 12, color: COLORS.inkFaint, fontWeight: 500 }}>{label}</label>
      {children}
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "30px 16px",
        color: COLORS.inkFaint,
        fontSize: 14,
        border: `1px dashed ${COLORS.line}`,
        borderRadius: 8,
      }}
    >
      {text}
    </div>
  );
}

const inputStyle = {
  padding: "9px 10px",
  border: `1px solid ${COLORS.line}`,
  borderRadius: 5,
  fontSize: 14,
  fontFamily: "'Hind Siliguri', sans-serif",
  background: "#fff",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
};

const primaryBtn = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  background: COLORS.ledger,
  color: "#fff",
  border: "none",
  borderRadius: 5,
  padding: "9px 16px",
  fontSize: 14,
  fontWeight: 600,
  fontFamily: "'Hind Siliguri', sans-serif",
  cursor: "pointer",
  whiteSpace: "nowrap",
};

const ghostBtn = {
  background: "transparent",
  border: `1px solid ${COLORS.line}`,
  borderRadius: 5,
  padding: "7px 14px",
  fontSize: 13,
  color: COLORS.inkFaint,
  cursor: "pointer",
};

const ghostBtnSmall = {
  background: "transparent",
  border: `1px solid ${COLORS.line}`,
  borderRadius: 5,
  padding: "5px 10px",
  fontSize: 12,
  color: COLORS.ledgerDark,
  cursor: "pointer",
  whiteSpace: "nowrap",
};

const dangerBtnSmall = {
  background: "transparent",
  border: `1px solid ${COLORS.stamp}`,
  borderRadius: 5,
  padding: "5px 8px",
  color: COLORS.stamp,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
};

const stepBtn = {
  width: 26,
  height: 26,
  borderRadius: "50%",
  border: `1px solid ${COLORS.line}`,
  background: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  color: COLORS.ink,
};
