import { useEffect, useState } from "react";
import "./SeatMap.css";

interface Seat {
  row: number;
  col: number;
}

interface SeatMapProps {
  rows: number;
  columns: number;
  showtimeId: string;
  onSelect?: (selectedSeats: Seat[]) => void;
}

export default function SeatMap({
  rows,
  columns,
  showtimeId,
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
          `https://wdfinpopcorebackend-fyfuhuambrfnc3hz.swedencentral-01.azurewebsites.net/api/v6/showtimes/${showtimeId}/seats`
        );
        const json = await res.json();
        setReservedSeats(
          (json.data || []).map((s: any) => ({
            row: s.row,
            col: s.column,
          }))
        );
      } catch (e) {
        console.log("Error:", e);
      }
    };

    fetchReservedSeats();
  }, [showtimeId]);

  const handleSeatClick = (seat: Seat) => {
    const isSelected = selectedSeats.some(
      (s) => s.row === seat.row && s.col === seat.col
    );
    const newSelected = isSelected
      ? selectedSeats.filter(
          (s) => !(s.row === seat.row && s.col === seat.col)
        )
      : [...selectedSeats, seat];

    setSelectedSeats(newSelected);
    onSelect?.(newSelected);
  };

  const isReserved = (seat: Seat) =>
    reservedSeats.some(
      (s) => s.row === seat.row && s.col === seat.col
    );

  const leftBlock = Math.floor(columns / 2);
  const rightBlock = columns - leftBlock;

  return (
    <div className="seatMapWrapper">

      <div className="seatMap">
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <div className="seatRow" key={rowIdx}>
            {/* Left Block */}
            <div className="seatBlock">
              {Array.from({ length: leftBlock }).map((_, colIdx) => {
                const seat = { row: rowIdx, col: colIdx };
                const selected = selectedSeats.some(
                  (s) => s.row === rowIdx && s.col === colIdx
                );
                const reserved = isReserved(seat);

                return (
                  <div
                    key={colIdx}
                    className={`seat ${selected ? "selected" : ""} ${
                      reserved ? "reserved" : ""
                    }`}
                    onClick={() => !reserved && handleSeatClick(seat)}
                  >
                    {String.fromCharCode(65 + rowIdx)}
                    {colIdx + 1}
                  </div>
                );
              })}
            </div>

            {/* Middle Aisle */}
            <div className="middleAisle"></div>

            {/* Right Block */}
            <div className="seatBlock">
              {Array.from({ length: rightBlock }).map((_, i) => {
                const colIdx = leftBlock + i;

                const seat = { row: rowIdx, col: colIdx };
                const selected = selectedSeats.some(
                  (s) => s.row === rowIdx && s.col === colIdx
                );
                const reserved = isReserved(seat);

                return (
                  <div
                    key={colIdx}
                    className={`seat ${selected ? "selected" : ""} ${
                      reserved ? "reserved" : ""
                    }`}
                    onClick={() => !reserved && handleSeatClick(seat)}
                  >
                    {String.fromCharCode(65 + rowIdx)}
                    {colIdx + 1}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
