import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import SeatMap from "./SeatMap";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./CinemaSeatSelection.css";

// ---------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------
interface Seat {
  row: number;
  col: number;
}

interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
}

export default function CinemaSeatSelection() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const movieData = location.state?.movie || null;
  const showData = location.state?.show || null;

  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [hallData, setHallData] = useState<{ rows: number; columns: number } | null>(null);
  const [hallId, setHallId] = useState<number | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const userInfo: UserInfo = { firstName, lastName, email };

  // ---------------------------------------------------------------------
  // Initial validation: Movie/Show required
  // ---------------------------------------------------------------------
  if (!movieData || !showData) {
    return <div className="seat-loadingText">{t("seat.loading")}</div>;
  }

  // ---------------------------------------------------------------------
  // Fetch hall layout on mount
  // ---------------------------------------------------------------------
  useEffect(() => {
    async function fetchHallLayout() {
      try {
        const response = await fetch(
          `https://wdfinpopcorebackend-fyfuhuambrfnc3hz.swedencentral-01.azurewebsites.net/api/v6/theaters/${showData.theater_id}/halls/${showData.hall_id}`
        );
        const json = await response.json();

        if (json.data?.seat_layout) {
          setHallData({
            rows: Number(json.data.seat_layout.rows || json.data.seat_layout.row),
            columns: Number(json.data.seat_layout.columns || json.data.seat_layout.column),
          });
          setHallId(json.data.id);
        }
      } catch (err) {
        console.error("Error fetching hall layout:", err);
      }
    }

    fetchHallLayout();
  }, [showData]);

  // Seat selection callback
  const handleSelect = (seats: Seat[]) => setSelectedSeats(seats);

  const totalPrice = selectedSeats.length * (Number(showData.price_amount) || 0);

  // ======================================================
  // Confirm + TEMP LOCK
  // ======================================================

  useEffect(() => {
    async function createTemporarySeat(){
      const res = await fetch('https://wdfinpopcorebackend-fyfuhuambrfnc3hz.swedencentral-01.azurewebsites.net/api/dev/create-temp-seat-table')
      const data = await res.json();
      console.log("Temporary seat table creation:",data);
    }
  createTemporarySeat()}
    ,[])
  // ---------------------------------------------------------------------
  // Confirm seat selection + temporary lock request
  // ---------------------------------------------------------------------
  const handleConfirm = async () => {
    if (!firstName || !lastName || !email) {
      alert(t("seat.errorFillDetails"));
      return;
    }

    if (selectedSeats.length === 0) {
      alert(t("seat.errorNoSeats"));
      return;
    }

    try {
      const res = await fetch(
        "https://wdfinpopcorebackend-fyfuhuambrfnc3hz.swedencentral-01.azurewebsites.net/api/temp-lock",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            showtimeId: showData.id,
            seats: selectedSeats,
          }),
        }
      );

      const json = await res.json();

      if (!json.success) {
        alert(t("seat.errorSeatTaken"));
        return;
      }
    } catch (err) {
      console.error("Seat lock error:", err);
      return;
    }

    navigate("/checkout", {
      state: {
        hallId,
        userInfo,
        selectedSeats,
        totalPrice,
        movie: movieData,
        show: showData,
      },
    });
  };
  //---------------------------------------------------------------------
  // Load user info from localStorage on mount
  //---------------------------------------------------------------------
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const user = JSON.parse(savedUser);
      const fullName = user.full_name || user.name || "";

      let firstName = "";
      let lastName = "";

      if (fullName.includes(" ")) {
        const nameParts = fullName.split(" ");
        firstName = nameParts[0];
        lastName = nameParts.slice(1).join(" ");
      } else {
        firstName = fullName;
        lastName = fullName;
      }

      setFirstName(firstName);
      setLastName(lastName);
      setEmail(user.email || "");
    }
  }, []);



  // ---------------------------------------------------------------------
  // Countdown timer for seat reservation
  // ---------------------------------------------------------------------
  useEffect(() => {
    if (selectedSeats.length === 0) return;

    let totalSeconds = 10 * 60;
    const warningToast = document.getElementById("reservationWarning");
    const timerEl = document.getElementById("countdownTimer");

    if (!warningToast || !timerEl) return;

    warningToast.classList.add("hidden");

    const interval = setInterval(() => {
      totalSeconds--;

      // Show warning at 2 minutes left
      if (totalSeconds === 2 * 60) {
        warningToast.classList.remove("hidden");
      }

      // Update countdown text
      if (!warningToast.classList.contains("hidden")) {
        const min = Math.floor(totalSeconds / 60);
        const sec = totalSeconds % 60;
        timerEl.textContent = `${min}:${sec < 10 ? "0" + sec : sec}`;
      }

      // Expire selection
      if (totalSeconds <= 0) {
        clearInterval(interval);
        warningToast.innerHTML = t("seat.reservationExpired");

        setSelectedSeats([]);

        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedSeats, t]);

  // ---------------------------------------------------------------------
  // Conditional Rendering
  // ---------------------------------------------------------------------
  if (!hallData) {
    return <div className="seat-loadingText">{t("seat.loading")}</div>;
  }

  // ---------------------------------------------------------------------
  // Render Component
  // ---------------------------------------------------------------------
  return (
    <div className="seat-cinemaRoot">
      <Navbar />

      {/* Movie Summary Header */}
      <div className="seat-movieSummaryBox">
        <img src={movieData.poster_url} alt="poster" />
        <div>
          <h2>{movieData.title}</h2>
          <p>{showData.theater_city} — {showData.theater_name}</p>
          <p>
            {new Date(showData.start_time).toLocaleDateString()} —
            {new Date(showData.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
          <p>{t("seat.pricePerSeat")}: £{showData.price_amount ?? 0}</p>
        </div>
      </div>

      {/* User Information */}
      <div className="userInfoBox">
        <h2>{t("seat.details")}</h2>

        <div className="inputGroup">
          <label>{t("seat.firstName")}</label>
          <input
            type="text"
            placeholder={t("seat.firstName")}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <div className="inputGroup">
          <label>{t("seat.lastName")}</label>
          <input
            type="text"
            placeholder={t("seat.lastName")}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <div className="inputGroup">
          <label>{t("seat.email")}</label>
          <input
            type="email"
            placeholder={t("seat.email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      {/* Cinema Screen Label */}
      <div className="cinemaGradientBar">{t("seat.screen")}</div>

      {/* Seat Map */}
      <SeatMap
        rows={hallData.rows}
        columns={hallData.columns}
        showtimeId={showData.id.toString()}
        onSelect={handleSelect}
      />

      {/* Selected Seats Summary */}
      <div className="seatSummary">
        <span>
          {t("seat.selectedSeats")}:{" "}
          {selectedSeats.length > 0
            ? selectedSeats.map(s => `${String.fromCharCode(65 + s.row)}${s.col + 1}`).join(", ")
            : t("seat.none")}
        </span>

        <span>{t("seat.totalPrice")}: £{totalPrice}</span>
      </div>

      {/* Buy Button */}
      <button className="buyTicketsButton" onClick={handleConfirm}>
        {t("seat.buyTickets")}
      </button>

      {/* Legend Section */}
      <div className="seatLegend">
        <h2>{t("seat.legendTitle")}</h2>
        <p><span className="seatLegend-red"></span> {t("seat.legendReserved")}</p>
        <p><span className="seatLegend-green"></span> {t("seat.legendYourSelection")}</p>
        <p className="tip">{t("seat.legendFinal")}</p>
      </div>

      {/* Reservation Warning Toast */}
      <div id="reservationWarning" className="reservationToast hidden">
        <p>
          {t("seat.reservationExpire")} <span id="countdownTimer">2:00</span>
        </p>
      </div>
    </div>
  );
}
