import { create } from "zustand";

interface BookingState {
  step: number;
  packageId: string | null;
  date: Date | null;
  timeSlot: string | null;
  details: {
    name: string;
    email: string;
    phone: string;
    notes: string;
    location: string;
  };
  setStep: (step: number) => void;
  setPackage: (id: string) => void;
  setDate: (date: Date | null) => void;
  setTimeSlot: (time: string | null) => void;
  setDetails: (details: Partial<BookingState["details"]>) => void;
  reset: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  step: 1,
  packageId: null,
  date: null,
  timeSlot: null,
  details: {
    name: "",
    email: "",
    phone: "",
    notes: "",
    location: "",
  },
  setStep: (step) => set({ step }),
  setPackage: (packageId) => set({ packageId, step: 2 }),
  setDate: (date) => set({ date }),
  setTimeSlot: (timeSlot) => set({ timeSlot }),
  setDetails: (newDetails) => 
    set((state) => ({ details: { ...state.details, ...newDetails } })),
  reset: () => set({ step: 1, packageId: null, date: null, timeSlot: null }),
}));
