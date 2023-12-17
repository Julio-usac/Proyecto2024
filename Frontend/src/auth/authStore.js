import jwtDecode from "jwt-decode";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useAuth = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      id: null,
      nombre: null,
      correo: null,
      rol: null,
      token:null,

      login: (mensaje) => {
        const message = jwtDecode(mensaje);
        set({
          isAuthenticated: true,
          id: message.Id,
          nombre: message.Nombre,
          correo: message.Correo,
          rol:message.Rol,
          token:mensaje,
        });
      },
      logout: () => {
        set({
          isAuthenticated: false,
          id: null,
          nombre: null,
          correo:null,
          token:null,
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
