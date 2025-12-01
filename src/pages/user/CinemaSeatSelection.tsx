import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import SeatMap from "./SeatMap";
import { useState, useEffect } from "react";
import "./CinemaSeatSelection.css";

export default function CinemaSeatSelection() {
  const location = useLocation();
  const navigate = useNavigate();

  const movieData = location.state?.movie || null;
  const showData = location.state?.show || null;

  const [selectedSeats, setSelectedSeats] = useState<{ row: number; col: number }[]>([]);
  const [hallData, setHallData] = useState<{ rows: number; columns: number } | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  if (!movieData || !showData) return <div>Loading...</div>;

  const API_BASE = "https://popcore-facrh7bjd0bbatbj.swedencentral-01.azurewebsites.net/api/v6/movies/scheduled";

  // ======================================================
  // Fetch hall info
  // ======================================================
  useEffect(() => {
    if (!showData?.theater_id || !showData?.hall_id) {
      setHallData({ rows: 5, columns: 8 });
      return;
    }

    const fetchHallInfo = async () => {
      try {
        const url = `${API_BASE}/api/v6/theaters/${showData.theater_id}/halls`;
        console.log("Fetching halls from:", url);

        const res = await fetch(url);
        const json = await res.json();
        const halls = json.data;

        const hall = halls.find(
          (h: any) => h.id.toString() === showData.hall_id.toString()
        );

        if (hall?.seat_layout) {
          setHallData({
            rows: hall.seat_layout.rows,
            columns: hall.seat_layout.columns,
          });
        } else {
          setHallData({ rows: 5, columns: 8 });
        }
      } catch (e) {
        console.log("Error fetching hall info:", e);
        setHallData({ rows: 5, columns: 8 });
      }
    };

    fetchHallInfo();
  }, [showData]);

  const handleSelect = (seats: any[]) => {
    setSelectedSeats(seats);
  };

  const totalPrice = selectedSeats.length * showData.price_amount;

  const handleConfirm = () => {
    if (!userInfo.firstName || !userInfo.lastName || !userInfo.email) {
      alert("Please fill all fields");
      return;
    }

    navigate("/ticket", {
      state: {
        movie: movieData,
        show: showData,
        seats: selectedSeats,
        user: userInfo,
      },
    });
  };

  if (!hallData) return <div>Loading hall...</div>;

  return (
    <div className="seat-cinemaRoot">
      <Navbar />

      <div className="seat-movieSummaryBox">
        <img src={movieData.poster_url} alt="poster" />
        <div>
          <h2>{movieData.title}</h2>
          <p>{showData.theater_city} — {showData.theater_name}</p>
          <p>
            {new Date(showData.start_time).toLocaleDateString()} —
            {new Date(showData.start_time).toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})}
          </p>
          <p>Price: ${showData.price_amount}</p>
        </div>
      </div>

      <div className="cinemaGradientBar">← Cinema Screen →</div>

      <SeatMap
        rows={hallData.rows}
        columns={hallData.columns}
        showtimeId={showData.showtime_id}
        onSelect={handleSelect}
      />

      <div className="seatSummary">
        <p>Selected Seats: {selectedSeats.length}</p>
        <p>Total Price: ${totalPrice}</p>
      </div>

      <button className="buyTicketsButton" onClick={() => setIsModalOpen(true)}>
        Buy Tickets
      </button>

      {isModalOpen && (
        <div className="modalOverlay">
          <div className="modalBox">
            <h2>Enter Your Details</h2>

            <input
              type="text"
              placeholder="First Name"
              value={userInfo.firstName}
              onChange={(e) => setUserInfo({ ...userInfo, firstName: e.target.value })}
            />

            <input
              type="text"
              placeholder="Last Name"
              value={userInfo.lastName}
              onChange={(e) => setUserInfo({ ...userInfo, lastName: e.target.value })}
            />

            <input
              type="email"
              placeholder="Email"
              value={userInfo.email}
              onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
            />

            <button className="confirmButton" onClick={handleConfirm}>Continue</button>
            <button className="closeButton" onClick={() => setIsModalOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
