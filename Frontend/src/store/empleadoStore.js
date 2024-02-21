import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useEmpleado = create(
  persist(
    (set) => ({
      id:null,
      nombres:null,
      apellidos:null,
      dpi:null,
      nit:null,
      puesto:null,
      setEditarEmpleado: (id,nombres,apellidos,dpi,nit,puesto) => {
        set({
          id:id,
          nombres:nombres,
          apellidos:apellidos,
          dpi:dpi,
          nit:nit,
          puesto: puesto,
        });
      },borrarDatos: () => {
        set({
          id:null,
          nombres:null,
          apellidos:null,
          dpi:null,
          nit:null,
          puesto: null,
        });
      },
      
     
    }),
    {
      name: "editarempleado-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useEmpleado;
