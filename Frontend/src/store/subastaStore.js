import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useSubasta = create(
    persist(
        (set) => ({
            subastaid: null,
            setSubastaid: (id) => {
                set({ subastaid: id });
            },
        }),
        {
            name: 'subasta-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useSubasta;
