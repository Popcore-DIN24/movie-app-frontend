export interface Auditorium {
  name: string;
  seats: number;       
  rows: number;        
  columns: number;      
}

export interface Cinema {
  name: string;
  address: string;
  phone: string;
  auditoriums: Auditorium[];
}

export const cinemas: Cinema[] = [
  {
    name: "Cinema Nova Oulu",
    address: "Kauppurienkatu 45, 90100 Oulu, Finland",
    phone: "+358 8 5542 3890",
    auditoriums: [
      { name: "Auditorium 1", seats: 145, rows: 13, columns: 11 },
      { name: "Auditorium 2", seats: 87, rows: 9, columns: 10 },
      { name: "Auditorium 3", seats: 163, rows: 13, columns: 13 },
    ],
  },
  {
    name: "Kino Baltic Turku",
    address: "Linnankatu 28, 20100 Turku, Finland",
    phone: "+358 2 2641 7520",
    auditoriums: [
      { name: "Auditorium 1", seats: 192, rows: 16, columns: 12 },
      { name: "Auditorium 2", seats: 76, rows: 8, columns: 10 },
      { name: "Auditorium 3", seats: 134, rows: 10, columns: 14 },
      { name: "Auditorium 4", seats: 58, rows: 6, columns: 10 },
    ],
  },
  {
    name: "Elokuvateatteri Helsinki Central",
    address: "Mannerheimintie 112, 00100 Helsinki, Finland",
    phone: "+358 9 4257 6180",
    auditoriums: [
      { name: "Auditorium 1", seats: 178, rows: 14, columns: 13 },
      { name: "Auditorium 2", seats: 121, rows: 11, columns: 11 },
    ],
  },
];
