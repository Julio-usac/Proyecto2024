import jwtDecode from "jwt-decode";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useAuth = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      tipo: null,
      id: null,
      nombre: null,
      correo: null,
      login: (tipo, message) => {
        set({
          isAuthenticated: true,
          tipo: tipo,
          id: message.Id,
          nombre: message.Nombre,
          correo: message.Correo,
        });
      },
      logout: () => {
        set({
          isAuthenticated: false,
          tipo: null,
          id: null,
          nombre: null,
        });
      },
      setUrl: (url) => {
        set({ url: url });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuth;
