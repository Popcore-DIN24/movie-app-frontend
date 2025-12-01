import { useState, useEffect } from "react";
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

export default function SeatMap({ rows, columns, showtimeId, onSelect }: SeatMapProps) {

  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [reservedSeatsState, setReservedSeatsState] = useState<Seat[]>([]);

  const API_BASE = "https://popcore-facrh7bjd0bbatbj.swedencentral-01.azurewebsites.net";

  // -------------------------
  // Fetch reserved seats
  // -------------------------
  useEffect(() => {
    const fetchReservedSeats = async () => {
      try {
        const url = `${API_BASE}/api/v6/showtimes/${showtimeId}/seats`;
        console.log("Fetching seats from:", url);

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }

        const json = await response.json();
        console.log("Reserved seats:", json);

        setReservedSeatsState(json.data || json);
      } catch (err) {
        console.error("Error fetching reserved seats:", err);
      }
    };

    fetchReservedSeats();
  }, [showtimeId]);

  // -------------------------
  // Toggle seat
  // -------------------------
  const toggleSeat = (row: number, col: number) => {
    const exists = selectedSeats.find(s => s.row === row && s.col === col);

    let updated;
    if (exists) {
      updated = selectedSeats.filter(s => !(s.row === row && s.col === col));
    } else {
      updated = [...selectedSeats, { row, col }];
    }

    setSelectedSeats(updated);
    onSelect?.(updated);
  };

  const isReserved = (row: number, col: number) =>
    reservedSeatsState.some(s => s.row === row && s.col === col);

  const isSelected = (row: number, col: number) =>
    selectedSeats.some(s => s.row === row && s.col === col);

  const seatLabel = (row: number, col: number) =>
    `${String.fromCharCode(65 + row)}${col + 1}`;

  return (
    <div className="seatMap">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="seatRow">
          {Array.from({ length: columns }).map((_, c) => {
            const reserved = isReserved(r, c);
            const selected = isSelected(r, c);

            let seatClass = "seat";
            if (reserved) seatClass += " reserved";
            else if (selected) seatClass += " selected";

            return (
              <div
                key={c}
                className={seatClass}
                onClick={() => !reserved && toggleSeat(r, c)}
              >
                {seatLabel(r, c)}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
