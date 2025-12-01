export function seatToNumber(row: number, col: number) {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return letters[row] + (col + 1); // row=0, col=0 => "A1"
}

export function numberToSeat(seatNumber: string) {
  const row = seatNumber.charCodeAt(0) - 65; // "A" => 0
  const col = parseInt(seatNumber.slice(1)) - 1;
  return { row, col };
}
