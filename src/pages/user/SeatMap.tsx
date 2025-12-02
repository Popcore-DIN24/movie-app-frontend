import { use, useEffect, useState } from "react";
import "./SeatMap.css";

interface Seat {
  row: number;
  col: number;
}

interface SeatMapProps {

  rows: number;
  columns: number;
  showtimeId: string;
  aisleEvery?: number; // Add aisle after every N columns
  onSelect?: (selectedSeats: Seat[]) => void;
}

export default function SeatMap({
  rows,
  columns,
  showtimeId,
  aisleEvery = 5,
  onSelect,
}: SeatMapProps) {
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [reservedSeats, setReservedSeats] = useState<Seat[]>([]);

  // Fetch reserved seats
  useEffect(() => {
    if (!showtimeId) return;
    

    const fetchReservedSeats = async () => {
      try {
        const res = await fetch(
          `https://popcore-facrh7bjd0bbatbj.swedencentral-01.azurewebsites.net/api/v6/showtimes/${showtimeId}/seats`
        );
        const json = await res.json();
        setReservedSeats(
          (json.data || []).map((s: any) => ({
            row: s.row,
            col: s.column,
          }))
        );
      } catch (e) {
        console.log("Error fetching reserved seats:", e);
      }
    };

    fetchReservedSeats();
  }, [showtimeId]);
  useEffect(() => {console.log('show rows and columns,', rows, columns )},[rows, columns])

  const handleSeatClick = (seat: Seat) => {
    const isSelected = selectedSeats.some(s => s.row === seat.row && s.col === seat.col);
    const newSelected = isSelected
      ? selectedSeats.filter(s => !(s.row === seat.row && s.col === seat.col))
      : [...selectedSeats, seat];

    setSelectedSeats(newSelected);
    onSelect?.(newSelected);
  };

  const isReserved = (seat: Seat) =>
    reservedSeats.some(s => s.row === seat.row && s.col === seat.col);

  return (
    <div className="seatMapWrapper">
      {/* Screen */}
      <div className="cinemaScreen">🎬 SCREEN</div>

      {/* Seat rows */}
      <div className="seatMap">
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <div key={rowIdx} className="seatRow">
            {Array.from({ length: columns }).map((_, colIdx) => {
              const seat: Seat = { row: rowIdx, col: colIdx };
              const selected = selectedSeats.some(s => s.row === rowIdx && s.col === colIdx);
              const reserved = isReserved(seat);

              // Insert aisle
              const isAisle = aisleEvery > 0 && colIdx > 0 && colIdx % aisleEvery === 0;

              return (
                <div
                  key={colIdx}
                  className={`seat ${selected ? "selected" : ""} ${reserved ? "reserved" : ""} ${
                    isAisle ? "aisle" : ""
                  }`}
                  onClick={() => !reserved && handleSeatClick(seat)}
                >
                  {String.fromCharCode(65 + rowIdx)}
                  {colIdx + 1}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
