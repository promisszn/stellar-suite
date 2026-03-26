import { create } from "zustand";
import { checkFreighterInstalled, connectFreighterWallet, getFreighterPublicKey } from "../utils/freighter";

interface WalletState {
  isConnected: boolean;
  publicKey: string | null;
  isLoading: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  checkConnection: () => Promise<void>;
}

export const useWalletStore = create<WalletState>((set) => ({
  isConnected: false,
  publicKey: null,
  isLoading: false,
  error: null,

  connectWallet: async () => {
    set({ isLoading: true, error: null });
    try {
      const publicKey = await connectFreighterWallet();
      console.log(`Wallet connected: ${publicKey}`);
      set({ isConnected: true, publicKey, isLoading: false, error: null });
    } catch (error: any) {
      console.log(`Wallet connection failed: ${error.message}`);
      set({ error: error.message, isLoading: false });
    }
  },

  disconnectWallet: () => {
    set({ isConnected: false, publicKey: null, error: null });
  },

  checkConnection: async () => {
    try {
      const isInstalled = await checkFreighterInstalled();
      if (isInstalled) {
        // Try to get public key to see if already connected
        const publicKey = await getFreighterPublicKey();
        if (publicKey) {
          console.log(`Wallet connected: ${publicKey}`);
          set({ isConnected: true, publicKey });
        }
      }
    } catch (error) {
      // Not connected or no permission yet, ignore silently
    }
  },
}));
