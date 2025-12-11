import React, { useState, useEffect } from "react";
import "./forgotPasswordAdvanced.css";
import Footer from "../../components/Footer";
import { useTranslation } from "react-i18next";

const ForgotPasswordAdvanced: React.FC = () => {
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(true);

  const strongPasswordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // Timer for resend
  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendLink = async () => {
    if (!email) return;

    try {
      const response = await fetch(
        "https://wdfinpopcorebackend-fyfuhuambrfnc3hz.swedencentral-01.azurewebsites.net/user/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await response.json();
      setMessage(data.message || "Link sent. Check your email.");
      setCanResend(false);
      setTimer(60);
    } catch (error) {
      setMessage("Error sending link. Try again.");
    }
  };

  const handleResetPassword = async () => {
    if (!strongPasswordRegex.test(newPassword)) {
      setMessage(
        "Password must be at least 8 chars, include uppercase, number, and special char."
      );
      return;
    }

    try {
      const response = await fetch(
        "https://wdfinpopcorebackend-fyfuhuambrfnc3hz.swedencentral-01.azurewebsites.net/user/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, newPassword }),
        }
      );
      const data = await response.json();
      setMessage(data.message || "Password reset successfully.");
    } catch (error) {
      setMessage("Error resetting password. Try again.");
    }
  };

  return (
    <div className="forgot-page">
      <div className="forgot-box">
        <h2>{t("forgot.title")}</h2>
        <p>{t("forgot.description")}</p>

        <input
          type="email"
          placeholder={t("forgot.email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button
          type="button"
          onClick={handleSendLink}
          disabled={!canResend}
          className={!canResend ? "disabled-btn" : ""}
        >
          {canResend ? "Send Reset Link" : `Resend in ${timer}s`}
        </button>

        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <span
            className="toggle-eye"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>

        <button type="button" onClick={handleResetPassword}>
          Reset Password
        </button>

        {message && <p className="msg">{message}</p>}
      </div>

      <Footer />
    </div>
  );
};

export default ForgotPasswordAdvanced;
