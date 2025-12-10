import { useEffect } from "react";
import { FiPhone, FiMapPin } from "react-icons/fi";
import "./TheatersPage.css";

interface Cinema {
  id: string;
  name: string;
  address: string;
  phone: string;
  auditoriums: number;
  seats: string[];
}

const cinemas: Cinema[] = [
  {
    id: "cinema-nova",
    name: "Cinema Nova Oulu",
    address: "Kauppurienkatu 45, 90100 Oulu, Finland",
    phone: "+358 8 5542 3890",
    auditoriums: 3,
    seats: ["Auditorium 1: 145 seats", "Auditorium 2: 87 seats", "Auditorium 3: 163 seats"],
  },
  {
    id: "kino-baltic",
    name: "Kino Baltic Turku",
    address: "Linnankatu 28, 20100 Turku, Finland",
    phone: "+358 2 2641 7520",
    auditoriums: 4,
    seats: ["Auditorium 1: 192 seats", "Auditorium 2: 76 seats", "Auditorium 3: 134 seats", "Auditorium 4: 58 seats"],
  },
  {
    id: "helsinki-central",
    name: "Elokuvateatteri Helsinki Central",
    address: "Mannerheimintie 112, 00100 Helsinki, Finland",
    phone: "+358 9 4257 6180",
    auditoriums: 2,
    seats: ["Auditorium 1: 178 seats", "Auditorium 2: 121 seats"],
  },
];

export default function TheatersPage() {
  useEffect(() => {
    // اسکرول به کارت اگر hash باشد
    const hash = window.location.hash;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
          element.classList.add("highlight");
          setTimeout(() => element.classList.remove("highlight"), 2000);
        }, 200);
      }
    }

    // انیمیشن ورود کارت‌ها هنگام اسکرول
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.2 }
    );
    document.querySelectorAll(".cinema-card").forEach((card) => observer.observe(card));
  }, []);

  return (
    <div className="theaters-page">
      <h1 className="page-title">North Star Movie Theaters</h1>

      {cinemas.map((cinema) => (
        <section key={cinema.id} id={cinema.id} className="cinema-card">
          <h2>{cinema.name}</h2>
          <p><FiMapPin className="icon"/> {cinema.address}</p>
          <p><FiPhone className="icon"/> {cinema.phone}</p>
          <p><strong>Auditoriums:</strong> {cinema.auditoriums}</p>
          <ul>
            {cinema.seats.map((seat, idx) => (
              <li key={idx}>{seat}</li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
