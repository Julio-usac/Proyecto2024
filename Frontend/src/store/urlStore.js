import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useUrl = create(
    persist(
        (set) => ({
            url:null,
            setUrl: (url) => {
                set({ url: url });
            },
        }),
        {
            name: 'url-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useUrl;
