import React, { useState } from "react";
import "./login.css";
import Footer from "../../components/Footer";
import { useTranslation } from "react-i18next";

const Login: React.FC = () => {
  const { t } = useTranslation();  

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("https://wdfinpopcorebackend-fyfuhuambrfnc3hz.swedencentral-01.azurewebsites.net/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    setMessage(data.message || t("login.defaultSuccess"));
  };

  return (
    <div>
      <div className="login-container">
        <form className="login-box" onSubmit={handleSubmit}>
          <h2>{t("login.title")}</h2>

          <input
            type="email"
            name="email"
            placeholder={t("login.email")}
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder={t("login.password")}
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit">{t("login.button")}</button>

          {message && <p className="msg">{message}</p>}
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
