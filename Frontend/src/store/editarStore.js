import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useEditar = create(
  persist(
    (set) => ({
      id:null,
      codigo: null,
      cuenta: null,
      fecha: null,
      marca: null,
      modelo: null,
      serie: null,
      precio: null,
      ubicacion: null,
      tipo: null,
      cantidad: null,
      descripcion: null,
      imagen: null,
      setEditar: (id,codigo,cuenta,fecha,marca,modelo,serie,precio,ubicacion,tipo,cantidad,descripcion,imagen) => {
        set({
          id:id,
          codigo: codigo,
          cuenta: cuenta,
          fecha: fecha,
          marca: marca,
          modelo: modelo,
          serie: serie,
          precio: precio,
          ubicacion: ubicacion,
          tipo: tipo,
          cantidad: cantidad,
          descripcion: descripcion,
          imagen: imagen,
        });
      },borrarDatos: () => {
        set({
          id:null,
          codigo: null,
          cuenta: null,
          fecha: null,
          marca: null,
          modelo: null,
          serie: null,
          precio: null,
          ubicacion: null,
          tipo: null,
          cantidad: null,
          descripcion: null,
          imagen: null,
        });
      },
      
     
    }),
    {
      name: "editar-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useEditar;
