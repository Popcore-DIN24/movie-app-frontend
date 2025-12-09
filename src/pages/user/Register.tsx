import React, { useState } from "react";
import "./register.css";
import { useTranslation } from "react-i18next";

const Register: React.FC = () => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
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

    const response = await fetch("https://wdfinpopcorebackend-fyfuhuambrfnc3hz.swedencentral-01.azurewebsites.net/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    setMessage(data.message || t("register.defaultSuccess"));
  };

  return (
    <div className="register-container">
      <form className="register-box" onSubmit={handleSubmit}>
        <h2>{t("register.title")}</h2>

        <input
          type="text"
          name="full_name"
          placeholder={t("register.fullName")}
          value={formData.full_name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder={t("register.email")}
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="phone"
          placeholder={t("register.phoneOptional")}
          value={formData.phone}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder={t("register.password")}
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit">{t("register.button")}</button>

        {message && <p className="msg">{message}</p>}
      </form>
    </div>
  );
};

export default Register;
