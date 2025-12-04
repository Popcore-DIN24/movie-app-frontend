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

  // Hardcoded user info for demo purposes
  const userInfo: UserInfo = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
  };

  // ----------------------------
  // Fetch hall layout
  // ----------------------------
  useEffect(() => {
    if (!showData) return;

    async function fetchHallLayout() {
      try {
        const response = await fetch(
          `https://popcore-facrh7bjd0bbatbj.swedencentral-01.azurewebsites.net/api/v6/theaters/${showData.theater_id}/halls/${showData.hall_id}`
        );
        const fetchedHallData = await response.json();
        if (fetchedHallData.data.seat_layout) {
          setHallData({
            rows: Number(fetchedHallData.data.seat_layout.rows || fetchedHallData.data.seat_layout.row),
            columns: parseInt(fetchedHallData.data.seat_layout.columns || fetchedHallData.data.seat_layout.column),
          });
        }
      } catch (err) {
        console.log("error fetching hall layout", err);
      }
    }

    fetchHallLayout();
  }, [showData]);

  // ----------------------------
  // Seat selection handler
  // ----------------------------
  const handleSelect = (seats: Seat[]) => {
    setSelectedSeats(seats);
  };

  const totalPrice = selectedSeats.length * (Number(showData?.price_amount) || 0);

  const handleConfirm = async () => {
    if (!showData) return;
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat");
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
        return;
      }
    } catch (err) {
      console.log("Error locking seats", err);
      return;
    }

    navigate("/checkout", {
      state: {
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

      <div className="cinemaGradientBar">← Cinema Screen →</div>

      {/* Seat Map */}
      <SeatMap
        rows={hallData.rows}
        columns={hallData.columns}
        showtimeId={showData.id.toString()}
        onSelect={handleSelect}
      />

      {/* Selected Seats Info */}
      <div className="seatSummary">
        <span>
          Selected Seats: {selectedSeats.length > 0
            ? selectedSeats.map(s => `${String.fromCharCode(65 + s.row)}${s.col + 1}`).join(", ")
            : "None"}
        </span>
        <span>Total Price: £{totalPrice}</span>
      </div>

      {/* Buy Tickets */}
      <button className="buyTicketsButton" onClick={handleConfirm}>
        Buy Tickets
      </button>

      {/* Seat Legend */}
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
