import { create } from "zustand";

interface AppState {
  isAuth: boolean;
  setIsAuth: (isAuth: boolean) => void;
}

// Utility function to load initial state from local storage
const loadFromLocalStorage = (): boolean => {
  if (typeof window !== "undefined") {
    const storedAuth = localStorage.getItem("userDetail");
    return storedAuth ? true: false;
  }
  return false; // default value if localStorage is not accessible
};

const useStore = create<AppState>((set) => ({
  isAuth: loadFromLocalStorage(), // Load initial state from localStorage
  setIsAuth: (isAuth) => {
    set({ isAuth });
  },
}));

export default useStore;
