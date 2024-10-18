'use client'
import { useState} from 'react';
import PaymentsPage from '@/components/PaymentComponent';
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

export default function Home() {
  const [endpoint, setEndpoint] = useState("https://api.devnet.solana.com");
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
            <PaymentsPage></PaymentsPage>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}