
"use client";

import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  desc: string;
};

type Order = {
  id: number;
  date: string;
  customer: {
    name: string;
    phone: string;
    area: string;
    address: string;
    notes?: string;
  };
  items: (Product & { quantity: number })[];
  payment: string;
  total: number;
  status: string;
};

const initialProducts: Product[] = [
  { id: 1, name: "قات طازج", category: "القات الطازج", price: 5000, image: "/qat/product1.jpg", desc: "قات طازج بجودة ممتازة" },
  { id: 2, name: "قات فاخر", category: "القات الفاخر", price: 8000, image: "/qat/product2.jpg", desc: "صنف فاخر ومميز" },
  { id: 3, name: "قات ممتاز", category: "القات الطازج", price: 6500, image: "/qat/product3.jpg", desc: "اختيار مميز للزبائن" },
  { id: 4, name: "قات فاخر ممتاز", category: "القات الفاخر", price: 10000, image: "/qat/product4.jpg", desc: "جودة عالية" },
];

const initialCategories = ["القات الطازج", "القات الفاخر"];

const navItems = [
  { key: "dashboard", label: "الرئيسية", icon: "⌂" },
  { key: "orders", label: "الطلبات", icon: "🛒" },
  { key: "products", label: "المنتجات", icon: "🌿" },
  { key: "categories", label: "الأقسام", icon: "▦" },
];

export default function AdminPage() {
  const [tab, setTab] = useState("dashboard");
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<string[]>(initialCategories);
  const [orders, setOrders] = useState<Order[]>([]);
  const [editing, setEditing] = useState<number | null>(null);
  const [newCategory, setNewCategory] = useState("");
  const [form, setForm] = useState({
    name: "",
    category: initialCategories[0],
    price: "",
    image: "",
    desc: "",
  });

  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem("afthen_products");
      const savedCategories = localStorage.getItem("afthen_categories");
      const savedOrders = localStorage.getItem("afthen_orders");

      if (savedProducts) {
        const data = JSON.parse(savedProducts);
        if (Array.isArray(data)) setProducts(data);
      }

      if (savedCategories) {
        const data = JSON.parse(savedCategories);
        if (Array.isArray(data) && data.length) setCategories(data);
      }

      if (savedOrders) {
        const data = JSON.parse(savedOrders);
        if (Array.isArray(data)) setOrders(data);
      }
    } catch {
      console.log("تعذر قراءة البيانات المحفوظة");
    }
  }, []);

  const saveProducts = (data: Product[]) => {
    setProducts(data);
    localStorage.setItem("afthen_products", JSON.stringify(data));
    window.dispatchEvent(new Event("afthen_products_updated"));
  };

  const saveCategories = (data: string[]) => {
    setCategories(data);
    localStorage.setItem("afthen_categories", JSON.stringify(data));
  };

  const saveOrders = (data: Order[]) => {
    setOrders(data);
    localStorage.setItem("afthen_orders", JSON.stringify(data));
    window.dispatchEvent(new Event("afthen_orders_updated"));
  };

  const resetForm = () => {
    setForm({
      name: "",
      category: categories[0] || "",
      price: "",
      image: "",
      desc: "",
    });
    setEditing(null);
  };

  const saveProduct = () => {
    if (!form.name.trim() || !form.category || !form.price || Number(form.price) <= 0) {
      alert("يرجى إدخال اسم الصنف والقسم والسعر الصحيح");
      return;
    }

    const product: Product = {
      id: editing ?? Date.now(),
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price),
      image: form.image.trim(),
      desc: form.desc.trim(),
    };

    const updated = editing
      ? products.map(p => p.id === editing ? product : p)
      : [...products, product];

    saveProducts(updated);
    resetForm();
    alert("تم حفظ الصنف بنجاح");
  };

  const editProduct = (p: Product) => {
    setForm({
      name: p.name,
      category: p.category,
      price: String(p.price),
      image: p.image || "",
      desc: p.desc || "",
    });
    setEditing(p.id);
    setTab("products");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteProduct = (id: number) => {
    if (!confirm("هل تريد حذف هذا الصنف؟")) return;
    saveProducts(products.filter(p => p.id !== id));
  };

  const addCategory = () => {
    const name = newCategory.trim();
    if (!name) return;
    if (categories.includes(name)) {
      alert("هذا القسم موجود بالفعل");
      return;
    }
    saveCategories([...categories, name]);
    setNewCategory("");
  };

  const deleteCategory = (name: string) => {
    if (products.some(p => p.category === name)) {
      alert("لا يمكن حذف القسم قبل نقل منتجاته إلى قسم آخر أو حذفها");
      return;
    }
    if (!confirm("هل تريد حذف القسم؟")) return;
    const updated = categories.filter(c => c !== name);
    saveCategories(updated);
    setForm(f => ({ ...f, category: updated[0] || "" }));
  };

  const updateOrderStatus = (id: number, status: string) => {
    saveOrders(orders.map(o => o.id === id ? { ...o, status } : o));
  };

  const money = (value: number) =>
    `${Number(value || 0).toLocaleString("ar-YE")} ريال`;

  const newOrders = orders.filter(o => o.status === "طلب جديد").length;
const receivedOrders = orders.filter(o => o.status === "تم استلام الطلب").length;

const deliveryOrders = orders.filter(o => o.status === "قد خرج للتوصيل").length;

const completedOrders = orders.filter(o => o.status === "تم التوصيل").length;
  const cardStyle: React.CSSProperties = {
    background: "#fff",
    border: "1px solid #e6eee8",
    borderRadius: 15,
    padding: 20,
    boxShadow: "0 3px 12px #123d1909",
    marginBottom: 16,
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: 13,
    border: "1px solid #dce6df",
    borderRadius: 9,
    marginTop: 8,
    marginBottom: 16,
    boxSizing: "border-box",
    fontSize: 15,
    background: "#fff",
  };

  const buttonStyle: React.CSSProperties = {
    background: "#17643b",
    color: "white",
    border: 0,
    borderRadius: 9,
    padding: "11px 18px",
    cursor: "pointer",
    fontWeight: "bold",
  };

  const statCards = [
  {
    label: "عدد المنتجات",
    value: products.length,
    description: "صنف متاح في المتجر",
    icon: "🌿",
    color: "#eaf6ef",
  },
  {
    label: "عدد الأقسام",
    value: categories.length,
    description: "قسم متاح حالياً",
    icon: "▦",
    color: "#eaf6ef",
  },
  {
    label: "إجمالي الطلبات",
    value: orders.length,
    description: "جميع طلبات العملاء",
    icon: "☑",
    color: "#fff6e6",
  },
  {
    label: "تم استلام الطلب",
    value: receivedOrders,
    description: "الطلبات المستلمة",
    icon: "📥",
    color: "#eaf6ef",
  },
  {
    label: "قد خرج للتوصيل",
    value: deliveryOrders,
    description: "الطلبات مع مندوب التوصيل",
    icon: "🚚",
    color: "#fff6e6",
  },
  {
    label: "تم التوصيل",
    value: completedOrders,
    description: "الطلبات المكتملة",
    icon: "✅",
    color: "#eaf6ef",
  },
];
  return (
    <main dir="rtl" className="admin-page">

      <style jsx>{`
        .admin-page {
          min-height: 100vh;
          background: #f5f7f8;
          color: #173c29;
          font-family: Arial, sans-serif;
        }

        .layout {
          display: flex;
          min-height: 100vh;
        }

        .sidebar {
          width: 235px;
          flex-shrink: 0;
          background: linear-gradient(160deg, #07502d, #063b25);
          color: white;
          padding: 24px 14px;
          display: flex;
          flex-direction: column;
        }

        .brand {
          text-align: center;
          padding: 12px 0 35px;
        }

        .brand-symbol {
          font-size: 47px;
          color: #8ed45b;
        }

        .brand h1 {
          margin: 4px 0;
          font-size: 34px;
        }

        .brand p {
          margin: 5px 0;
          color: #d5e9dc;
          font-size: 17px;
        }

        .nav {
          display: grid;
          gap: 10px;
        }

        .nav button {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: 0;
          border-radius: 11px;
          padding: 15px;
          background: transparent;
          color: white;
          font-size: 16px;
          cursor: pointer;
          text-align: right;
        }

        .nav button.active {
          background: #258b58;
        }

        .nav button:hover {
          background: #23794d;
        }

        .nav-icon {
          font-size: 23px;
        }

        .logout {
          margin-top: 28px;
          padding-top: 20px;
          border-top: 1px solid #ffffff30;
        }

        .logout button {
          width: 100%;
          padding: 14px;
          background: transparent;
          border: 0;
          color: white;
          font-size: 16px;
          cursor: pointer;
        }

        .content {
          flex: 1;
          min-width: 0;
        }

        .topbar {
          height: 80px;
          padding: 0 30px;
          background: white;
          border-bottom: 1px solid #e7ebea;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
        }

        .topbar strong {
          font-size: 17px;
        }

        .topbar .welcome {
          color: #145b35;
        }

        .main-content {
          padding: 25px;
          max-width: 1700px;
          margin: auto;
        }

        


.hero {
  position: relative;
  isolation: isolate;
  height: clamp(240px, 23vw, 360px);
  border-radius: 17px;
  overflow: hidden;
  background-image:
    linear-gradient(90deg, transparent 30%, #ffffff40 58%, #ffffffa8 75%),
    url("/images/afthen-hero.png");
  background-position: center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 28px;
  border: 1px solid #e4eee6;
}

/* الانحناءة الخضراء الفاتحة */
.hero::before {
  content: "";
  position: absolute;
  z-index: 1;
  width: 68%;
  height: 155%;
  right: -9%;
  bottom: -94%;
  background: #8bcf42;
  border-radius: 100% 0 0 0;
  transform: rotate(-13deg);
}

/* المساحة الخضراء الغامقة */
.hero::after {
  content: "";
  position: absolute;
  z-index: 2;
  width: 61%;
  height: 150%;
  right: -8%;
  bottom: -100%;
  background: #08763b;
  border-radius: 100% 0 0 0;
  transform: rotate(-13deg);
}


/* الكتابة داخل الأخضر الغامق */
.hero-text {
  position: absolute;
  z-index: 5;
  right: 2%;
  top: 68%;
  transform: translateY(-50%);
  width: 27%;
  padding: 10px;
  text-align: center;
  color: #ffffff;
}

.hero-text h1,
.hero-text p,
.hero-text h3 {
  color: #ffffff !important;
}

.hero-text h2 {
  font-size: 76px !important;
  font-weight: 900 !important;
  color: #b5e779 !important;
  line-height: 1.2;
  margin: 10px 0;
  text-align: center;
}

.hero-text p {
  font-size: 19px;
  font-weight: 700;
}

}


        .stats {
          display: grid;
         grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 26px;
        }

        .stat-card {
          border: 1px solid #e2eee6;
          border-radius: 15px;
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          min-height: 125px;
          box-shadow: 0 2px 8px #00000007;
        }

        .stat-icon {
          width: 82px;
          height: 82px;
          flex-shrink: 0;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: #c9edda;
          color: #075b36;
          font-size: 34px;
        }

        .stat-card h3 {
          font-size: 17px;
          margin: 0 0 9px;
        }

        .stat-card strong {
          display: block;
          font-size: 38px;
          color: #075333;
        }

        .stat-card p {
          margin: 7px 0 0;
          color: #607568;
          font-size: 13px;
        }

        .panel {
          background: white;
          border: 1px solid #e1e8e4;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 3px 12px #00000008;
          margin-bottom: 18px;
        }

        .panel-heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 18px;
        }

        .panel-heading h2 {
          margin: 0;
          color: #145b35;
          font-size: 21px;
        }

        .show-all {
          color: #168046;
          border: 0;
          background: transparent;
          font-size: 15px;
          font-weight: bold;
          cursor: pointer;
        }

        .table-wrap {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          min-width: 650px;
          text-align: center;
        }

        th {
          background: #f1f3f5;
          padding: 14px 10px;
          font-size: 14px;
        }

        td {
          border-bottom: 1px solid #edf0ee;
          padding: 13px 10px;
          font-size: 14px;
        }

        .status {
          display: inline-block;
          border-radius: 20px;
          padding: 6px 17px;
          background: #e1efff;
          color: #0872d5;
          font-weight: bold;
        }

        .empty {
          text-align: center;
          color: #718078;
          padding: 35px;
        }

        .section-title {
          color: #145b35;
          margin: 5px 0 20px;
        }

        @media (max-width: 1050px) {
          .sidebar {
            width: 190px;
          }
          .stats {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .hero {
            height: 230px;
          }
        }

        @media (max-width: 700px) {
          .layout {
            display: block;
          }
          .sidebar {
            width: auto;
            padding: 12px;
          }
          .brand {
            padding: 5px 0 12px;
          }
          .brand-symbol {
            font-size: 27px;
          }
          .brand h1 {
            font-size: 23px;
          }
          .brand p {
            font-size: 13px;
          }
          .nav {
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 5px;
          }
          .nav button {
            padding: 10px 4px;
            flex-direction: column;
            gap: 5px;
            text-align: center;
            font-size: 12px;
          }
          .nav-icon {
            font-size: 19px;
          }
          .logout {
            margin-top: 10px;
            padding-top: 5px;
          }
          .logout button {
            padding: 8px;
            font-size: 13px;
          }
          .topbar {
            height: auto;
            padding: 15px;
            flex-wrap: wrap;
          }
          .topbar strong {
            font-size: 13px;
          }
          .main-content {
            padding: 12px;
          }
          .hero {
            height: 190px;
            background-position: 42% center;
          }
          .hero-text {
            width: 55%;
            padding: 8px;
          }
          .hero-text p {
            font-size: 13px;
          }
          .hero-text h2 {
            font-size: 36px;
          }
          .hero-text h3 {
            font-size: 12px;
          }
         .stats {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 9px;
}
          .stat-card {
            padding: 12px;
            min-height: 105px;
          }
          .stat-icon {
            width: 45px;
            height: 45px;
            font-size: 21px;
          }
          .stat-card h3 {
            font-size: 12px;
          }
          .stat-card strong {
            font-size: 25px;
          }
          .stat-card p {
            font-size: 10px;
          }
          .panel {
            padding: 13px;
          }
        }
      `}</style>

      <div className="layout">

        <aside className="sidebar">
          <div className="brand">
            <div className="brand-symbol">◢🌿</div>
            <h1>افتهن</h1>
            <p>AFTHEN</p>
            <p>لوحة الإدارة</p>
          </div>

          <nav className="nav">
            {navItems.map(item => (
              <button
                key={item.key}
                className={tab === item.key ? "active" : ""}
                onClick={() => {
                  setTab(item.key);
                  resetForm();
                }}
              >
                <span>{item.label}</span>
                <span className="nav-icon">{item.icon}</span>
                {item.key === "orders" && orders.length > 0 && (
                  <span>{orders.length}</span>
                )}
              </button>
            ))}
          </nav>

          <div className="logout">
            <button
              onClick={async () => {
                try {
                  await fetch("/api/admin-logout", { method: "POST" });
                  window.location.href = "/admin/login";
                } catch {
                  alert("تعذر تسجيل الخروج، حاول مرة أخرى");
                }
              }}
            >
              ⇥ تسجيل الخروج
            </button>
          </div>
        </aside>

        <div className="content">

          <header className="topbar">
            <strong>👤 مرحباً بك، مدير المتجر</strong>
            <strong className="welcome">معاً .. لنقدم أفضل جودة من القات 🌿</strong>
          </header>

          <section className="main-content">

            {tab === "dashboard" && (
              <>
                <div className="hero">
                  <div className="hero-text">
                    <h2>افتهن</h2>
                  </div>
                </div>

                <div className="stats">
                  {statCards.map((item, index) => (
                    <div
                      key={item.label}
                      className="stat-card"
                      style={{ background: item.color }}
                    >
                      <div>
                        <h3>{item.label}</h3>
                        <strong>{item.value}</strong>
                        <p>{item.description}</p>
                      </div>
                      <div className="stat-icon">
                        {item.icon}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="panel">
                  <div className="panel-heading">
                    <h2>🛒 أحدث الطلبات</h2>
                    <button
                      className="show-all"
                      onClick={() => setTab("orders")}
                    >
                      عرض الكل ←
                    </button>
                  </div>

                  {orders.length === 0 ? (
                    <div className="empty">
                      <h3>لا توجد طلبات حتى الآن</h3>
                      <p>ستظهر أحدث الطلبات هنا عند وصولها.</p>
                    </div>
                  ) : (
                    <div className="table-wrap">
                      <table>
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>العميل</th>
                            <th>التاريخ</th>
                            <th>المبلغ</th>
                            <th>الحالة</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[...orders].slice(-5).reverse().map(order => (
                            <tr key={order.id}>
                              <td>#{order.id}</td>
                              <td>{order.customer?.name || "عميل"}</td>
                              <td>{order.date}</td>
                              <td>{money(order.total)}</td>
                              <td>
                                <span className="status">
                                  {order.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}

            {tab === "products" && (
              <>
                <h2 className="section-title">
                  {editing ? "تعديل الصنف" : "إضافة صنف جديد"}
                </h2>

                <div className="panel">
                  <label>اسم الصنف</label>
                  <input
                    style={inputStyle}
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="اسم الصنف"
                  />

                  <label>القسم</label>
                  <select
                    style={inputStyle}
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>

                  <label>السعر بالريال</label>
                  <input
                    style={inputStyle}
                    type="number"
                    min="1"
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    placeholder="أدخل السعر"
                  />

                  <label>اختيار صورة الصنف من جهازك</label>
                  <input
                    style={inputStyle}
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (!file.type.startsWith("image/")) {
                        alert("يرجى اختيار ملف صورة");
                        return;
                      }
                      const reader = new FileReader();
                      reader.onload = () => {
                        setForm(old => ({
                          ...old,
                          image: reader.result as string,
                        }));
                      };
                      reader.readAsDataURL(file);
                    }}
                  />

                  {form.image && (
                    <div style={{ marginBottom: 15 }}>
                      <p>معاينة الصورة المختارة:</p>
                      <img
                        src={form.image}
                        alt="صورة الصنف"
                        style={{
                          width: 180,
                          height: 130,
                          objectFit: "cover",
                          borderRadius: 10,
                        }}
                      />
                    </div>
                  )}

                  <label>وصف الصنف</label>
                  <textarea
                    style={{ ...inputStyle, minHeight: 75 }}
                    value={form.desc}
                    onChange={e => setForm({ ...form, desc: e.target.value })}
                    placeholder="اكتب وصف الصنف"
                  />

                  <button style={buttonStyle} onClick={saveProduct}>
                    {editing ? "حفظ التعديلات" : "إضافة الصنف"}
                  </button>

                  {editing && (
                    <button
                      onClick={resetForm}
                      style={{ ...buttonStyle, background: "#777", marginRight: 10 }}
                    >
                      إلغاء التعديل
                    </button>
                  )}
                </div>

                <h2 className="section-title">
                  الأصناف الحالية ({products.length})
                </h2>

                {products.map(p => (
                  <div
                    key={p.id}
                    className="panel"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <strong>{p.name}</strong>
                      <p>{p.category} — {money(p.price)}</p>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button style={buttonStyle} onClick={() => editProduct(p)}>
                        تعديل
                      </button>
                      <button
                        style={{ ...buttonStyle, background: "#b83232" }}
                        onClick={() => deleteProduct(p.id)}
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}

            {tab === "categories" && (
              <>
                <h2 className="section-title">إدارة الأقسام</h2>

                <div className="panel">
                  <label>اسم القسم الجديد</label>
                  <input
                    style={inputStyle}
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    placeholder="مثلاً: قسم جديد"
                  />
                  <button style={buttonStyle} onClick={addCategory}>
                    إضافة القسم
                  </button>
                </div>

                {categories.map(c => (
                  <div
                    key={c}
                    className="panel"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <strong>{c}</strong>
                    <button
                      style={{ ...buttonStyle, background: "#b83232" }}
                      onClick={() => deleteCategory(c)}
                    >
                      حذف القسم
                    </button>
                  </div>
                ))}
              </>
            )}

            {tab === "orders" && (
              <>
                <h2 className="section-title">
                  طلبات العملاء ({orders.length})
                </h2>

                {orders.length === 0 ? (
                  <div className="panel">
                    <h3>لا توجد طلبات حتى الآن</h3>
                    <p>ستظهر الطلبات التي يتم إرسالها من صفحة العميل هنا على هذا المتصفح.</p>
                  </div>
                ) : (
                  orders.map(order => (
                    <div key={order.id} className="panel">
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 10,
                      }}>
                        <h3 style={{ color: "#17643b" }}>
                          طلب رقم #{order.id}
                        </h3>
                        <strong>{order.status}</strong>
                      </div>

                      <p style={{ color: "#777" }}>{order.date}</p>

                      <h4>بيانات العميل</h4>
                      <p>الاسم: {order.customer?.name}</p>
                      <p>الهاتف: {order.customer?.phone}</p>
                      <p>المنطقة: {order.customer?.area}</p>
                      <p>العنوان: {order.customer?.address}</p>
                      {order.customer?.notes && (
                        <p>ملاحظات: {order.customer.notes}</p>
                      )}

                      <h4>الأصناف المطلوبة</h4>
                      {order.items?.map((item, index) => (
                        <p key={`${item.id}-${index}`}>
                          {item.name} — الكمية: {item.quantity} — {money(item.price * item.quantity)}
                        </p>
                      ))}

                      <p><strong>طريقة الدفع:</strong> {order.payment}</p>
                      <h3 style={{ color: "#17643b" }}>
                        الإجمالي: {money(order.total)}
                      </h3>

                      <label>تحديث حالة الطلب</label>
                      <select
                        style={inputStyle}
                        value={order.status}
                        onChange={e => updateOrderStatus(order.id, e.target.value)}
                      >
                       {["تم استلام الطلب", "قد خرج للتوصيل", "تم التوصيل"].map(status => (
  <option key={status} value={status}>{status}</option>
))}
                      </select>
                    </div>
                  ))
                )}
              </>
            )}

          </section>

          <footer style={{
            background: "#07502d",
            color: "white",
            textAlign: "center",
            padding: 20,
          }}>
            متجر افتهن — لوحة الإدارة
          </footer>

        </div>
      </div>
    </main>
  );
}
