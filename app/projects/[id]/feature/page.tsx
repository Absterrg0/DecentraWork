'use client'
import { useState} from 'react';
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import SolanaComponent from '@/components/SolanaComponent';
import FeaturePaymentComponent from '@/components/FeaturePayment';
export default function SolanaPayment() {
  const [endpoint, setEndpoint] = useState("https://api.devnet.solana.com");
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
        <FeaturePaymentComponent ></FeaturePaymentComponent>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}