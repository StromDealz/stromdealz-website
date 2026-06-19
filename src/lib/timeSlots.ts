export type TimeSlot = { id: string; label: string; available: boolean };

export const timeSlots: TimeSlot[] = [
  { id: "mo_1000", label: "Montag 10:00", available: true },
  { id: "mo_1100", label: "Montag 11:00", available: false },
  { id: "mo_1400", label: "Montag 14:00", available: true },
  { id: "di_0900", label: "Dienstag 09:00", available: false },
  { id: "di_1500", label: "Dienstag 15:00", available: true },
];
