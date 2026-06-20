import { create } from 'zustand';

export type ConnectionState = 'connected' | 'connecting' | 'disconnected' | 'reconnecting';

interface ConnectionStore {
  state: ConnectionState;
  setState: (state: ConnectionState) => void;
}

export const useConnectionStore = create<ConnectionStore>((set) => ({
  state: 'connecting',
  setState: (state) => set({ state }),
}));
