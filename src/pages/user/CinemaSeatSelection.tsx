import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import SeatMap from "./SeatMap";
import { useState, useEffect } from "react";
import "./CinemaSeatSelection.css";

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

  const movieData = location.state?.movie || null;
  const showData = location.state?.show || null;

  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [hallData, setHallData] = useState<{ rows: number; columns: number } | null>(null);
  const [hallId, setHallId] = useState<number | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  
  const userInfo: UserInfo = {
    firstName,
    lastName,
    email,
  };

  if (!movieData || !showData) return <div className="seat-loadingText">Loading...</div>;

  
  // ======================================================
  // Fetch hall layout
  // ======================================================
  useEffect(() => {
    async function fetchHallLayout() {
      try {
        const response = await fetch(
          `https://popcore-facrh7bjd0bbatbj.swedencentral-01.azurewebsites.net/api/v6/theaters/${showData.theater_id}/halls/${showData.hall_id}`
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
  }, []);

  const handleSelect = (seats: Seat[]) => setSelectedSeats(seats);

  const totalPrice = selectedSeats.length * (Number(showData.price_amount) || 0);

  // ======================================================
  // Confirm + TEMP LOCK
  // ======================================================
  const handleConfirm = async () => {
    if (!firstName || !lastName || !email) {
      alert("Please fill out all personal details.");
      return;
    }

    if (selectedSeats.length === 0) {
      alert("Please select at least one seat.");
      return;
    }

    try {
      const res = await fetch(
        "https://popcore-facrh7bjd0bbatbj.swedencentral-01.azurewebsites.net/api/temp-lock",
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
        alert("Some seats were taken by someone else. Please re-select.");
        alert("Some seats were taken by someone else. Please choose again.");
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

  // ----------------------------
  // Timer logic (clears selection and reloads page)
  // ----------------------------
  useEffect(() => {
    if (selectedSeats.length === 0) return;

    let totalSeconds = 10 * 60; // 10 دقیقه کل
    const warningToast = document.getElementById("reservationWarning");
    const timerEl = document.getElementById("countdownTimer");

    if (!warningToast || !timerEl) return;

    warningToast.classList.add("hidden"); // ابتدا مخفی

    const interval = setInterval(() => {
      totalSeconds--;

      if (totalSeconds === 2 * 60) {
        warningToast.classList.remove("hidden"); // وقتی 2 دقیقه مانده پیام نمایش داده شود
      }

      if (!warningToast.classList.contains("hidden")) {
        const min = Math.floor(totalSeconds / 60);
        const sec = totalSeconds % 60;
        timerEl.textContent = `${min}:${sec < 10 ? "0" + sec : sec}`;
      }

      if (totalSeconds <= 0) {
        clearInterval(interval);
        warningToast.innerHTML = "⏳ Your reservation has expired. Resetting...";

        setSelectedSeats([]); // پاک کردن صندلی‌ها
        setTimeout(() => {
          window.location.reload(); // ریست کامل صفحه
        }, 1500);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedSeats]);

  // ----------------------------
  // Conditional Rendering
  // ----------------------------
  if (!movieData || !showData) return <div className="seat-loadingText">Loading movie/show...</div>;
  if (!hallData) return <div className="seat-loadingText">Loading hall...</div>;

  // ----------------------------
  // Render
  // ----------------------------
  return (
    <div className="seat-cinemaRoot">
      <Navbar />

      {/* Movie Summary */}
      <div className="seat-movieSummaryBox">
        <img src={movieData.poster_url} alt="poster" />
        <div>
          <h2>{movieData.title}</h2>
          <p>{showData.theater_city} — {showData.theater_name}</p>
          <p>
            {new Date(showData.start_time).toLocaleDateString()} —{" "}
            {new Date(showData.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
          <p>Price per seat: £{showData.price_amount ?? 0}</p>
        </div>
      </div>

      {/* NEW — User Info Form */}
      <div className="userInfoBox">
        <h2>Your Details</h2>

        <div className="inputGroup">
          <label>First Name</label>
          <input
            type="text"
            placeholder="Enter first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <div className="inputGroup">
          <label>Last Name</label>
          <input
            type="text"
            placeholder="Enter last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <div className="inputGroup">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      {/* Cinema Screen */}
      <div className="cinemaGradientBar">← Cinema Screen →</div>

      {/* Seat Map */}
      <SeatMap
        rows={hallData.rows}
        columns={hallData.columns}
        showtimeId={showData.id.toString()}
        onSelect={handleSelect}
      />

      {/* Selected Seats */}
      <div className="seatSummary">
        <span>
          Selected Seats: {selectedSeats.length > 0
            ? selectedSeats.map(s => `${String.fromCharCode(65 + s.row)}${s.col + 1}`).join(", ")
            : "None"}
        </span>
        <span>Total Price: £{totalPrice}</span>
      </div>

      {/* Buy Button */}
      <button className="buyTicketsButton" onClick={handleConfirm}>
        Buy Tickets
      </button>

      {/* Legend */}
      <div className="seatLegend">
        <h2>Seat Legend</h2>
        <p><span className="seatLegend-red"></span> Reserved — cannot select</p>
        <p><span className="seatLegend-green"></span> Your Selection — click again to remove</p>
        <p className="tip">Selected seats are final and cannot be changed after booking.</p>
      </div>

      {/* Reservation Warning */}
      <div id="reservationWarning" className="reservationToast hidden">
        <p>
          Your seat reservation will expire in <span id="countdownTimer">2:00</span> minutes. Please complete your purchase to keep your selected seats.
        </p>
      </div>
    </div>
  );
}
