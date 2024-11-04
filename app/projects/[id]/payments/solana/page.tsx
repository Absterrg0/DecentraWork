'use client'
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import SolanaComponent from '@/components/SolanaComponent';

export default function SolanaPayment() {
  return (
    <ConnectionProvider endpoint='https://thrumming-little-card.solana-mainnet.quiknode.pro/43538a133d29fd9eecf9318a37ee158e10d9bb34'>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
        <SolanaComponent ></SolanaComponent>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}