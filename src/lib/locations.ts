export type Location = {
  id: string;
  name: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  nextConsultingDate: string;
  hours?: string;
  openNow?: boolean;
  zip?: string;
};

export const locations: Location[] = [
  {
    id: "mg",
    name: "StromDealz Büro",
    address: "Quellstraße 25, 41068 Mönchengladbach",
    city: "Mönchengladbach",
    lat: 51.1963,
    lng: 6.4257,
    nextConsultingDate: "2026-02-01T09:00:00",
    hours: "Mo-Fr: 09:00 - 17:00 Uhr",
    openNow: true,
    zip: "41068",
  },
  {
    id: "mg-kaufland",
    name: "Kaufland, Reyerhütte",
    address: "Reyerhütte 1, 41065 Mönchengladbach",
    city: "Mönchengladbach",
    lat: 51.1892,
    lng: 6.4521,
    nextConsultingDate: "2026-02-05T10:00:00",
    hours: "Do: 10:00 - 18:00 Uhr",
    openNow: false,
    zip: "41065",
  },
  {
    id: "mg-edeka",
    name: "Edeka",
    address: "Mittelstraße",
    city: "41236 Mönchengladbach",
    lat: 51.1685,
    lng: 6.4468,
    nextConsultingDate: "2026-02-10T10:00:00",
    hours: "Fr: 10:00 - 18:00 Uhr",
    openNow: false,
    zip: "41236",
  }
];
