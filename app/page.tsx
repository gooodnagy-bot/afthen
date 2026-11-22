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

type CartItem = Product & { quantity: number };

const defaultProducts: Product[] = [];

const paymentMethods = [
  "الدفع عند الاستلام",
  "التحويل عبر الكريمي جوال",
  "تحويل بنكي",
  "الدفع نقداً عند نقطة استلام",
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [category, setCategory] = useState("الكل");
  const [search, setSearch] = useState("");
  const [payment, setPayment] = useState(paymentMethods[0]);
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    area: "",
    address: "",
    notes: "",
  });
  const [showCheckout, setShowCheckout] = useState(false);
  const [message, setMessage] = useState("");
const [trackingId, setTrackingId] = useState("");
const [showTracking, setShowTracking] = useState(false);
const [trackingOrder, setTrackingOrder] = useState<any>(null);
const [trackingMessage, setTrackingMessage] = useState("");
  useEffect(() => {
    try {
      const saved = localStorage.getItem("afthen_products");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed.map((p: any, index: number) => ({
            id: Number(p.id) || index + 1,
            name: String(p.name || p.title || "صنف قات"),
            category: String(p.category || p.categoryName || p.categoryId || "أصناف أخرى"),
            price: Number(p.price) || 0,
            image: String(p.image || p.imageUrl || ""),
            desc: String(p.desc || p.description || ""),
          })));
        }
      }
    } catch {
      setProducts(defaultProducts);
    }
  }, []);

  const categories = ["الكل", ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(p =>
    (category === "الكل" || p.category === category) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (product: Product) => {
    setCart(current => {
      const found = current.find(item => item.id === product.id);
      if (found) {
        return current.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...current, { ...product, quantity: 1 }];
    });
    setMessage("تمت إضافة الصنف إلى السلة");
    setTimeout(() => setMessage(""), 2500);
  };

  const changeQuantity = (id: number, amount: number) => {
    setCart(current =>
      current
        .map(item => item.id === id ? { ...item, quantity: item.quantity + amount } : item)
        .filter(item => item.quantity > 0)
    );
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const submitOrder = () => {
    if (!cart.length) {
      alert("السلة فارغة، أضف صنفاً أولاً");
      return;
    }
    if (!customer.name.trim() || !customer.phone.trim() || !customer.area.trim() || !customer.address.trim()) {
      alert("يرجى تعبئة الاسم ورقم الهاتف والمنطقة والعنوان");
      return;
    }

    const order = {
      id: Date.now(),
      date: new Date().toLocaleString("ar-YE"),
      customer,
      items: cart,
      payment,
      total,
      status: "طلب جديد",
    };

    try {
      const previous = JSON.parse(localStorage.getItem("afthen_orders") || "[]");
      const orders = Array.isArray(previous) ? previous : [];
      localStorage.setItem("afthen_orders", JSON.stringify([order, ...orders]));
      window.dispatchEvent(new Event("afthen_orders_updated"));
      setCart([]);
      setCustomer({ name: "", phone: "", area: "", address: "", notes: "" });
      setShowCheckout(false);
      alert("تم إرسال طلبك بنجاح. شكراً لتسوقك من افتهن!");
    } catch {
      alert("تعذر حفظ الطلب. حاول مرة أخرى");
    }
  };

const handleTrackOrder = () => {
  if (!trackingId.trim()) {
    setTrackingMessage("يرجى إدخال رقم الطلب أولاً");
    setTrackingOrder(null);
    return;
  }

  try {
    const orders = JSON.parse(
      localStorage.getItem("afthen_orders") || "[]"
    );

    const found = Array.isArray(orders)
      ? orders.find(
          (order: any) => String(order.id) === trackingId.trim()
        )
      : null;

    if (found) {
      setTrackingOrder(found);
      setTrackingMessage("");
    } else {
      setTrackingOrder(null);
      setTrackingMessage("لم يتم العثور على الطلب، تأكد من رقم الطلب");
    }
  } catch {
    setTrackingOrder(null);
    setTrackingMessage("تعذر البحث عن الطلب حالياً");
  }
};

  const inputStyle = {
    width: "100%",
    padding: "13px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    fontSize: "15px",
    boxSizing: "border-box" as const,
    marginTop: "6px",
  };

  return (
    <main dir="rtl" style={{ minHeight: "100vh", background: "#f7f9f6", color: "#243329", fontFamily: "Arial, sans-serif" }}>
     
      <div className="announcement">
        🌿 معاً ... نقدم أفضل جودة من القات
      </div>

      <header className="store-header">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="ابحث عن منتجات افتهن..."
          className="store-search"
        />

        <button
          onClick={() => setShowCheckout(true)}
          className="cart-button"
        >
          🛒 السلة ({cart.reduce((s, item) => s + item.quantity, 0)})
        </button>

        <button
          onClick={() => setShowTracking(true)}
          className="tracking-button"
        >
          متابعة طلبي
        </button>
      </header>

      <section className="hero-banner">
        <div className="hero-photo">
          <img src="/images/afthen-hero.png" alt="قات افتهن" />
        </div>

        <div className="hero-content">
          <h2>مرحباً بك في متجر افتهن</h2>
          <p>
            اختر منتجاتك المفضلة، أضفها إلى السلة،
            واستمتع بالتسوق بكل سهولة
          </p>

          <button
            onClick={() =>
              document.getElementById("products")?.scrollIntoView({
                behavior: "smooth"
              })
            }
          >
            تسوق الآن
          </button>
        </div>
      </section>


      <section style={{ width: "90%", maxWidth: "1200px", margin: "auto" }}>
        <h2 style={{ color: "#17643b" }}>أقسام القات</h2>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", margin: "15px 0 25px" }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)} style={{ padding: "10px 18px", borderRadius: "25px", border: "1px solid #17643b", background: category === cat ? "#17643b" : "white", color: category === cat ? "white" : "#17643b", cursor: "pointer" }}>
              {cat}
            </button>
          ))}
        </div>

        <h2 id="products" style={{ color: "#17643b" }}>الأصناف المتوفرة</h2>
        {filteredProducts.length === 0 ? (
          <p>لا توجد أصناف مطابقة للبحث حالياً.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: "18px" }}>
            {filteredProducts.map(p => (
              <article key={p.id} style={{ background: "white", borderRadius: "14px", overflow: "hidden", boxShadow: "0 3px 12px #0000000d", paddingBottom: "15px" }}>
                {p.image ? (
                  <img src={p.image} alt={p.name} style={{ width: "100%", height: "165px", objectFit: "cover" }} onError={e => { e.currentTarget.style.display = "none"; }} />
                ) : (
                  <div style={{ height: "165px", background: "#e5efe6", display: "grid", placeItems: "center", color: "#17643b", fontSize: "45px" }}>🌿</div>
                )}
                <div style={{ padding: "14px" }}>
                  <small style={{ color: "#64806b" }}>{p.category}</small>
                  <h3 style={{ margin: "8px 0" }}>{p.name}</h3>
                  <p style={{ color: "#777", minHeight: "20px" }}>{p.desc}</p>
                  <strong style={{ color: "#17643b", fontSize: "19px" }}>{p.price.toLocaleString("ar-YE")} ريال</strong>
                  <button onClick={() => addToCart(p)} style={{ width: "100%", marginTop: "13px", padding: "12px", background: "#17643b", color: "white", border: 0, borderRadius: "9px", cursor: "pointer" }}>
                    أضف إلى السلة
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {message && <div style={{ position: "fixed", bottom: "20px", right: "20px", background: "#17643b", color: "white", padding: "14px 20px", borderRadius: "10px", zIndex: 20 }}>{message}</div>}

      {showCheckout && (
        <div onClick={() => setShowCheckout(false)} style={{ position: "fixed", inset: 0, background: "#0009", zIndex: 30, overflowY: "auto", padding: "20px" }}>
          <section onClick={e => e.stopPropagation()} style={{ background: "white", maxWidth: "650px", margin: "20px auto", borderRadius: "16px", padding: "22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ color: "#17643b" }}>سلة المشتريات وإتمام الطلب</h2>
              <button onClick={() => setShowCheckout(false)} style={{ border: 0, background: "#eee", borderRadius: "8px", padding: "8px 12px", cursor: "pointer" }}>إغلاق</button>
            </div>

            {cart.length === 0 ? <p>السلة فارغة. أضف صنفاً من المنتجات أولاً.</p> : (
              <>
                {cart.map(item => (
                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", borderBottom: "1px solid #eee", padding: "12px 0" }}>
                    <div>
                      <strong>{item.name}</strong>
                      <div style={{ color: "#64806b", fontSize: "14px" }}>{item.price.toLocaleString("ar-YE")} ريال للصنف</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <button onClick={() => changeQuantity(item.id, -1)} style={{ padding: "5px 11px", cursor: "pointer" }}>-</button>
                      <strong>{item.quantity}</strong>
                      <button onClick={() => changeQuantity(item.id, 1)} style={{ padding: "5px 11px", cursor: "pointer" }}>+</button>
                    </div>
                    <strong>{(item.price * item.quantity).toLocaleString("ar-YE")} ريال</strong>
                  </div>
                ))}

                <h3 style={{ textAlign: "left", color: "#17643b" }}>الإجمالي: {total.toLocaleString("ar-YE")} ريال</h3>

                <h3>بيانات العميل والتوصيل</h3>
                <label>اسم العميل<input style={inputStyle} value={customer.name} onChange={e => setCustomer({ ...customer, name: e.target.value })} placeholder="اكتب اسمك" /></label>
                <label>رقم الهاتف<input style={inputStyle} value={customer.phone} onChange={e => setCustomer({ ...customer, phone: e.target.value })} placeholder="رقم الهاتف للتواصل" type="tel" /></label>
                <label>المنطقة أو المديرية<input style={inputStyle} value={customer.area} onChange={e => setCustomer({ ...customer, area: e.target.value })} placeholder="مثلاً: الحديدة - الخوخة" /></label>
                <label>العنوان بالتفصيل<input style={inputStyle} value={customer.address} onChange={e => setCustomer({ ...customer, address: e.target.value })} placeholder="اسم الحي أو الشارع أو أقرب معلم" /></label>
                <label>ملاحظات إضافية<textarea style={{ ...inputStyle, minHeight: "75px" }} value={customer.notes} onChange={e => setCustomer({ ...customer, notes: e.target.value })} placeholder="أي تفاصيل تساعد في توصيل الطلب" /></label>

                <h3>طريقة الدفع</h3>
                {paymentMethods.map(method => (
                  <label key={method} style={{ display: "flex", gap: "10px", alignItems: "center", padding: "10px", border: "1px solid #eee", borderRadius: "9px", margin: "8px 0", cursor: "pointer" }}>
                    <input type="radio" name="payment" checked={payment === method} onChange={() => setPayment(method)} />
                    {method}
                  </label>
                ))}

                {payment === "التحويل عبر الكريمي جوال" && (
                  <p style={{ background: "#f0f7f1", padding: "12px", borderRadius: "9px", lineHeight: 1.8 }}>
                    عند اختيار الكريمي جوال، يرجى تحويل قيمة الطلب إلى رقم المتجر المعتمد، ثم التواصل مع المتجر لتأكيد التحويل. لا تدخل الرقم السري أو رمز التحقق الخاص بمحفظتك.
                  </p>
                )}

                <button onClick={submitOrder} style={{ width: "100%", background: "#17643b", color: "white", border: 0, padding: "15px", borderRadius: "10px", fontSize: "17px", fontWeight: "bold", cursor: "pointer", marginTop: "15px" }}>
                  تأكيد وإرسال الطلب
                </button>
              </>
            )}
          </section>
        </div>
      )}

      {showTracking && (
        <div
          onClick={() => setShowTracking(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "#0009",
            zIndex: 40,
            padding: "20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <section
            onClick={e => e.stopPropagation()}
            style={{
              background: "white",
              width: "100%",
              maxWidth: "500px",
              padding: "25px",
              borderRadius: "16px",
              textAlign: "center"
            }}
          >
            <h2 style={{ color: "#17643b" }}>متابعة طلبي</h2>

            <p>أدخل رقم الطلب لمعرفة حالته</p>

            <input
              value={trackingId}
              onChange={e => setTrackingId(e.target.value)}
              placeholder="أدخل رقم الطلب"
              style={inputStyle}
            />

            <button
              onClick={handleTrackOrder}
              style={{
                width: "100%",
                background: "#17643b",
                color: "white",
                border: 0,
                padding: "13px",
                borderRadius: "9px",
                marginTop: "12px",
                cursor: "pointer"
              }}
            >
              تتبع الطلب
            </button>

            {trackingMessage && (
              <p style={{ color: "#c0392b", marginTop: "15px" }}>
                {trackingMessage}
              </p>
            )}

            {trackingOrder && (
              <div style={{ marginTop: "20px", textAlign: "right" }}>
                <p>
                  رقم الطلب: <strong>{trackingOrder.id}</strong>
                </p>

                <h3 style={{ color: "#17643b" }}>حالة طلبك</h3>

                {[
                  "تم استلام الطلب",
                  "قد خرج للتوصيل",
                  "تم التوصيل"
                ].map((step, index) => {
                  const status = trackingOrder.status;
                  const currentStep =
                    status === "تم التوصيل" ? 2 :
                    status === "قد خرج للتوصيل" ? 1 : 0;

                  return (
                    <div
                      key={step}
                      style={{
                        padding: "12px",
                        margin: "8px 0",
                        borderRadius: "9px",
                        background: index <= currentStep ? "#e4f4e8" : "#f2f2f2",
                        color: index <= currentStep ? "#17643b" : "#888",
                        border: index === currentStep
                          ? "2px solid #17643b"
                          : "1px solid #ddd",
                        fontWeight: "bold"
                      }}
                    >
                      {index <= currentStep ? "✓ " : "○ "}
                      {step}
                    </div>
                  );
                })}
              </div>
            )}

            <button
              onClick={() => {
                setShowTracking(false);
                setTrackingOrder(null);
                setTrackingMessage("");
                setTrackingId("");
              }}
              style={{
                marginTop: "18px",
                padding: "10px 20px",
                border: 0,
                borderRadius: "8px",
                background: "#eee",
                cursor: "pointer"
              }}
            >
              إغلاق
            </button>
          </section>
        </div>
      )}

      <footer style={{ marginTop: "50px", background: "#145b35", color: "white", padding: "25px", textAlign: "center" }}>
        <h2>افتهن - AFTHEN</h2>
        <p>شكراً لثقتكم بنا</p>
      </footer>
    </main>
  );
}
