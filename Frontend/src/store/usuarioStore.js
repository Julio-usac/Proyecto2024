import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useUsuario = create(
  persist(
    (set) => ({
      id:null,
      nombres:null,
      apellidos:null,
      correo:null,
      rol:null,
      setEditarUser: (id,nombres,apellidos,correo,rol) => {
        set({
          id:id,
          nombres:nombres,
          apellidos:apellidos,
          correo:correo,
          rol:rol,
        });
      },
      
     
    }),
    {
      name: "editaruser-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useUsuario;
