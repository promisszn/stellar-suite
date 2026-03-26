import { useEffect, useState } from "react";
import { useWalletStore } from "../store/walletStore";
import { LogOut, Wallet } from "lucide-react";
import { WalletModal } from "./WalletModal";

export function WalletManager() {
  const { isConnected, publicKey, isLoading, error, disconnectWallet, checkConnection } = useWalletStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  // Close modal when successfully connected
  useEffect(() => {
    if (isConnected) {
      setIsModalOpen(false);
    }
  }, [isConnected]);

  const handleConnect = () => {
    setIsModalOpen(true);
  };

  const truncateKey = (key: string) => {
    if (!key) return "";
    return `${key.slice(0, 4)}...${key.slice(-4)}`;
  };

  return (
    <>
      <div className="flex items-center gap-2">
        {error && !isModalOpen && (
          <span className="text-xs text-red-500 max-w-[150px] truncate" title={error}>
            {error}
          </span>
        )}
        {isConnected && publicKey ? (
          <div className="flex items-center gap-1 rounded border border-border bg-secondary px-2 py-1">
            <span className="text-xs font-mono text-foreground px-1">
              {truncateKey(publicKey)}
            </span>
            <button
              onClick={disconnectWallet}
              className="p-1 rounded text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              title="Disconnect Wallet"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleConnect}
            disabled={isLoading}
            className={`flex items-center gap-1.5 rounded bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            {isLoading ? "Connecting..." : "Connect Wallet"}
          </button>
        )}
      </div>

      <WalletModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
