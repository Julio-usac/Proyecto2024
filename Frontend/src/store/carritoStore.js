import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useCarrito = create(
    persist(
        (set) => ({
            productoSeleccionado: null,
            setProductoSeleccionado: (producto) => {
                set({ productoSeleccionado: producto });
            },
            carrito: [],
            agregar: (producto, cantidad) => {
                set((state) => ({
                    carrito: [...state.carrito, { producto, cantidad }],
                }));
            },
            total: 0,
            eliminar: (index) => {
                set((state) => {
                    const carrito = [...state.carrito];
                    carrito.splice(index, 1);
                    return { carrito };
                });
            },
            vaciar: () => {
                set({ carrito: [] });
            },
        }),
        {
            name: 'carrito-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useCarrito;
