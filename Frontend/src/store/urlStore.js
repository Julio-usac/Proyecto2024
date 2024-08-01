import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useUrl = create(
    persist(
        (set) => ({
            url:null,
            buscar:null,
            setUrl: (url) => {
                set({ url: url });
            },
            setBuscar: (buscar) => {
                set({ buscar: buscar });
            },
        }),
        {
            name: 'url-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useUrl;
