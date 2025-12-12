import React, { useState } from "react";
import "./register.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const strongPasswordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });

    if (name === "password") {
      if (!strongPasswordRegex.test(value)) {
        setPasswordError(
          "Password must include at least 1 uppercase letter, 1 lowercase letter, 1 number, 1 symbol and be at least 8 characters long."
        );
      } else {
        setPasswordError("");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!strongPasswordRegex.test(formData.password)) {
      setPasswordError(
        "Password must include at least 1 uppercase letter, 1 lowercase letter, 1 number, 1 symbol and be at least 8 characters long."
      );
      return;
    }

    try {
      const response = await fetch(
        "https://wdfinpopcorebackend-fyfuhuambrfnc3hz.swedencentral-01.azurewebsites.net/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      setMessage(data.message || t("register.defaultSuccess"));

      if (response.ok) {
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="register-container" data-testid="register-page">
      <form className="register-box" onSubmit={handleSubmit}>
        <h2>{t("register.title")}</h2>

        <input
          type="text"
          name="full_name"
          placeholder={t("register.fullName")}
          value={formData.full_name}
          onChange={handleChange}
          required
          data-testid="full-name-input"
        />

        <input
          type="email"
          name="email"
          placeholder={t("register.email")}
          value={formData.email}
          onChange={handleChange}
          required
          data-testid="email-input"
        />

        <input
          type="text"
          name="phone"
          placeholder={t("register.phoneOptional")}
          value={formData.phone}
          onChange={handleChange}
          data-testid="phone-input"
        />

        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder={t("register.password")}
            value={formData.password}
            onChange={handleChange}
            required
            data-testid="password-input"
          />

          <button
            type="button"
            className="toggle-password-btn"
            onClick={() => setShowPassword(!showPassword)}
            data-testid="toggle-password-btn"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {passwordError && (
          <p className="msg error" data-testid="password-error">
            {passwordError}
          </p>
        )}

        <button type="submit" data-testid="register-submit-btn">
          {t("register.button")}
        </button>

        {message && (
          <p className="msg" data-testid="register-msg">
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default Register;
