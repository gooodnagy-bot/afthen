
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "بيانات الدخول غير صحيحة");
        return;
      }

      router.replace("/admin");
    } catch {
      setError("تعذر الاتصال، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main dir="rtl" style={{
      minHeight: "100vh",
      display: "grid",
      placeItems: "center",
      background: "linear-gradient(135deg, #063d25, #17643b, #39945c)",
      padding: "20px",
      fontFamily: "Arial, sans-serif",
    }}>
      <form onSubmit={handleLogin} style={{
        width: "100%",
        maxWidth: "420px",
        background: "white",
        padding: "35px",
        borderRadius: "20px",
        boxShadow: "0 15px 45px #002b183d",
        boxSizing: "border-box",
      }}>
        <div style={{
          textAlign: "center",
          marginBottom: "28px",
        }}>
          <div style={{
            width: "75px",
            height: "75px",
            background: "#e5f4e9",
            color: "#17643b",
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            margin: "0 auto 15px",
            fontSize: "35px",
          }}>
            🌿
          </div>

          <h1 style={{
            textAlign: "center",
            color: "#17643b",
            fontSize: "34px",
            margin: "0 0 10px",
          }}>
            افتهن
          </h1>

          <h2 style={{
            textAlign: "center",
            fontSize: "19px",
            color: "#345a43",
            margin: 0,
          }}>
            تسجيل دخول الإدارة
          </h2>

          <p style={{
            color: "#829389",
            fontSize: "14px",
            marginTop: "10px",
          }}>
            مرحباً بك في لوحة إدارة متجر افتهن
          </p>
        </div>

        <label style={{ color: "#244b32", fontWeight: "bold" }}>
          اسم المستخدم
        </label>

        <input
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          style={{
            width: "100%",
            padding: "14px",
            margin: "10px 0 22px",
            boxSizing: "border-box",
            border: "1px solid #cbded0",
            borderRadius: "10px",
            background: "#f8fcf9",
            outlineColor: "#17643b",
            fontSize: "15px",
          }}
        />

        <label style={{ color: "#244b32", fontWeight: "bold" }}>
          كلمة المرور
        </label>

        <input
          required
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          style={{
            width: "100%",
            padding: "14px",
            margin: "10px 0 22px",
            boxSizing: "border-box",
            border: "1px solid #cbded0",
            borderRadius: "10px",
            background: "#f8fcf9",
            outlineColor: "#17643b",
            fontSize: "15px",
          }}
        />

        {error && (
          <p style={{
            color: "#c62828",
            background: "#fff0f0",
            padding: "11px",
            borderRadius: "8px",
            textAlign: "center",
          }}>
            {error}
          </p>
        )}

        <button
          disabled={loading}
          type="submit"
          style={{
            width: "100%",
            padding: "15px",
            background: loading ? "#8bad96" : "#17643b",
            color: "white",
            border: 0,
            borderRadius: "10px",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "17px",
            fontWeight: "bold",
          }}
        >
          {loading ? "جارٍ التحقق..." : "تسجيل الدخول"}
        </button>

        <p style={{
          textAlign: "center",
          color: "#91a398",
          fontSize: "12px",
          marginTop: "25px",
        }}>
          افتهن | لوحة الإدارة
        </p>
      </form>
    </main>
  );
}

