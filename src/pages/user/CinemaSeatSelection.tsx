import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import SeatMap from "./SeatMap";
import { useState, useEffect } from "react";
import "./CinemaSeatSelection.css";

// ======================================================
// Type Definitions
// ======================================================
interface Seat {
  row: number;
  col: number;
}

interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
}

// ======================================================
// Component
// ======================================================
export default function CinemaSeatSelection() {
  const location = useLocation();
  const navigate = useNavigate();

  const movieData = location.state?.movie || null;
  const showData = location.state?.show || null;

  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [hallData, setHallData] = useState<{ rows: number; columns: number } | null>(null);

  // For demo purposes, let's hardcode the logged-in user info
  const userInfo: UserInfo = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
  };

  if (!movieData || !showData) return <div className="seat-loadingText">Loading...</div>;

  // ======================================================
  // Set hallData from showData
  // ======================================================
  useEffect(() => {
    async function fetchHallLayoutandCompareID(){
      try{
        const response = await fetch(`https://popcore-facrh7bjd0bbatbj.swedencentral-01.azurewebsites.net/api/v6/theaters/${showData.theater_id}/halls/${showData.hall_id}`);
        const fetchedHallData = await response.json();
        if(fetchedHallData.data.seat_layout){
          setHallData({
            rows: Number(fetchedHallData.data.seat_layout.rows || fetchedHallData.data.seat_layout.row),
            columns: parseInt(fetchedHallData.data.seat_layout.columns || fetchedHallData.data.seat_layout.column),
          });
          console.log('set hall data from fetched hall data', fetchedHallData.data.seat_layout)
        }
      }catch(err){console.log('error fetching hall layout', err)}
    }
    fetchHallLayoutandCompareID();
  },[ ])
  // useEffect(() => {
  //   if (showData?.seat_layout) {
  //     setHallData({
  //       rows: showData.seat_layout.rows,
  //       columns: showData.seat_layout.columns,
        
  //     });
  //     console.log('set hall data from show data', showData.seat_layout)
  //   } else {
  //     // Default layout if not provided
  //     setHallData({ rows: 5, columns: 8 });
  //   }
  // }, [showData]);
  // useEffect(()=>{console.log('This is show data','hall_id',showData.hall_id, showData.theater_id)},[])

  // ======================================================
  // Seat selection handler
  // ======================================================
  const handleSelect = (seats: Seat[]) => {
    setSelectedSeats(seats);
  };

  const totalPrice =
    selectedSeats.length * (Number(showData.price_amount) || 0); // fallback to 0 if undefined

  const handleConfirm = async () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat");
      return;
    }

    // ---------------------------
    // 1) TEMP LOCK REQUEST HERE
    // ---------------------------
    try {
      const res = await fetch(
        "https://popcore-facrh7bjd0bbatbj.swedencentral-01.azurewebsites.net/api/temp-lock",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            showtimeId: showData.id,
            seats: selectedSeats,   // row + col
          }),
        }
      );

      const json = await res.json();

      if (!json.success) {
        alert("Some seats were taken by someone else. Please re-select.");
        return; 
      }

      console.log("Seats locked!", json);
    } catch (err) {
      console.log("Error locking seats", err);
      return;
    }

    // ---------------------------
    // 2) Move to next page
    // ---------------------------
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


  if (!hallData) return <div className="seat-loadingText">Loading hall...</div>;

  // ======================================================
  // Render
  // ======================================================
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

      {/* Cinema Screen */}
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
          Selected Seats:{" "}
          {selectedSeats.length > 0
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
    </div>
  );
}
