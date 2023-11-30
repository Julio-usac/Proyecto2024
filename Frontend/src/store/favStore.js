import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useFav = create(
    persist(
        (set) => ({
            productoSeleccionado: null,
            setProductoSeleccionado: (producto) => {
                set({ productoSeleccionado: producto });
            },
            favorito: [],
            agregar: (producto) => {
                set((state) => ({
                    favorito: [...state.favorito, { producto }],
                }));
            },
            total: 0,
            eliminar: (index) => {
                set((state) => {
                    const favorito = [...state.favorito];
                    favorito.splice(index, 1);
                    return { favorito };
                });
            },
        }),
        {
            name: 'fav-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useFav;
