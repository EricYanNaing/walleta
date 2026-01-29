import { create } from "zustand";

const useLoadingStore = create((set) => ({
  isLoading: false,
  requestCount: 0,
  startLoading: () =>
    set((state) => ({
      requestCount: state.requestCount + 1,
      isLoading: true,
    })),
  stopLoading: () =>
    set((state) => {
      const nextCount = Math.max(0, state.requestCount - 1);
      return {
        requestCount: nextCount,
        isLoading: nextCount > 0,
      };
    }),
}));

export default useLoadingStore;
