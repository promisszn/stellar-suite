import React from "react";
import { useWalletStore } from "../store/walletStore";
import { WalletProviderType } from "../wallet/WalletService";
import { X, Loader2 } from "lucide-react";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const { connectWallet, isLoading, error } = useWalletStore();

  if (!isOpen) return null;

  const handleConnect = async (type: WalletProviderType) => {
    await connectWallet(type);
    // The store updates isConnected, we don't automatically close here unless we want to,
    // actually let's close it if we check the store after. We can just use an effect or close after await.
    const state = useWalletStore.getState();
    if (!state.error && state.isConnected) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-lg border border-primary/20 bg-primary/10 p-6 shadow-xl shadow-primary/10 relative">
        {/* Deep blue/primary tint overlay for the card background */}
        <div className="absolute inset-0 bg-primary/5 rounded-lg pointer-events-none" />
        
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 z-10 text-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <div className="flex flex-col space-y-1.5 text-center sm:text-left mb-6 relative z-10">
          <h2 className="text-lg font-semibold leading-none tracking-tight text-foreground">Connect Wallet</h2>
          <p className="text-sm text-muted-foreground">Select a wallet provider to connect</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-md bg-destructive/10 text-destructive text-sm text-center border border-destructive/20 relative z-10">
            {error}
          </div>
        )}

        <div className="grid gap-4 relative z-10">
          <button
            onClick={() => handleConnect("freighter")}
            disabled={isLoading}
            className="flex items-center justify-between w-full p-4 rounded-lg border border-primary/20 bg-card hover:bg-primary/20 hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 font-bold text-xl">F</div>
              <span className="font-medium text-foreground">Freighter</span>
            </div>
            {isLoading && useWalletStore.getState().walletType === "freighter" && (
              <Loader2 className="h-4 w-4 animate-spin text-foreground" />
            )}
          </button>

          <button
            onClick={() => handleConnect("albedo")}
            disabled={isLoading}
            className="flex items-center justify-between w-full p-4 rounded-lg border border-primary/20 bg-card hover:bg-primary/20 hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-500 font-bold text-xl">A</div>
              <span className="font-medium text-foreground">Albedo</span>
            </div>
            {isLoading && useWalletStore.getState().walletType === "albedo" && (
              <Loader2 className="h-4 w-4 animate-spin text-foreground" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
