import { useState } from "react";
import bannerImg from "../../assets/images/Contact us flat _ Premium Vector.jfif.png"; 
import "./ContactPage.css";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ name, email, message });
    setSuccess(true);
    setName("");
    setEmail("");
    setMessage("");
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="contactRoot">
      
      {/* تصویر بالای صفحه */}
      <div className="contactBanner">
        <img src={bannerImg} alt="Contact Banner" />
      </div>

      <h1 className="contactTitle">Contact Us</h1>

      <div className="contactCard">
        <h2>Get in Touch</h2>
        <p>Have questions? Send us a message and we'll get back to you ASAP!</p>

        <form className="contactForm" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <textarea
            placeholder="Your Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            required
          />
          <button type="submit" className="sendButton">Send Message</button>
          {success && <p className="successMessage">Message sent successfully!</p>}
        </form>

        <div className="contactInfo">
          <p><strong>Phone:</strong> +358 123 456 789</p>
          <p><strong>Email:</strong> contact@northstar.com</p>
          <p><strong>Address:</strong> Helsinki, Finland</p>
        </div>
      </div>
    </div>
  );
}
