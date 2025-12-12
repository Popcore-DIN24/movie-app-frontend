import React, { useState, useEffect } from "react";
import "./login.css";
import Footer from "../../components/Footer";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState("");

  // Load Remember Me data from localStorage
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberEmail");
    const savedPassword = localStorage.getItem("rememberPassword");

    if (savedEmail && savedPassword) {
      setFormData({ email: savedEmail, password: savedPassword });
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setRememberMe(checked);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://wdfinpopcorebackend-fyfuhuambrfnc3hz.swedencentral-01.azurewebsites.net/user/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      setMessage(data.message || t("login.defaultSuccess"));

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));

        // Save Remember Me data
        if (rememberMe) {
          localStorage.setItem("rememberEmail", formData.email);
          localStorage.setItem("rememberPassword", formData.password);
        } else {
          localStorage.removeItem("rememberEmail");
          localStorage.removeItem("rememberPassword");
        }

        navigate("/");
      }
    } catch (err) {
      setMessage(t("login.error"));
    }
  };

  return (
    <div>
      <div className="login-container" data-testid="login-page">
        <form className="login-box" onSubmit={handleSubmit}>
          <h2>{t("login.title")}</h2>

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder={t("login.email")}
            value={formData.email}
            onChange={handleChange}
            required
            data-testid="email-input"
          />

          {/* Password with eye icon */}
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder={t("login.password")}
              value={formData.password}
              onChange={handleChange}
              required
              data-testid="password-input"
            />
            <button
              type="button"
              className="toggle-password-btn"
              aria-label="show-hide-password"
              onClick={() => setShowPassword(!showPassword)}
              data-testid="toggle-password-btn"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Remember Me + Forgot Password */}
          <div className="login-options">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={handleChange}
                data-testid="remember-me-checkbox"
              />
              {t("login.remember")}
            </label>

            <button
              type="button"
              className="forgot-password-btn"
              onClick={() => navigate("/forgot-password")}
              data-testid="forgot-password-btn"
            >
              {t("login.forgot")}
            </button>
          </div>

          <button type="submit" data-testid="login-submit-btn">
            {t("login.button")}
          </button>

          {message && (
            <p className="msg" data-testid="login-msg">
              {message}
            </p>
          )}
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
