'use client'
import { useState} from 'react';
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import SolanaComponent from '@/components/SolanaComponent';

export default function SolanaPayment() {
  const [endpoint, setEndpoint] = useState("https://api.devnet.solana.com");
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
        <SolanaComponent ></SolanaComponent>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}