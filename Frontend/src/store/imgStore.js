import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useImagen = create(
    persist(
        (set) => ({
            imagen:null,
            setImagen: (imagen) => {
                set({ imagen: imagen });
            },
        }),
        {
            name: 'img-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useImagen;
