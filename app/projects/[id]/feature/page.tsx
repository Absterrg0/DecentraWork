'use client'
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import FeaturePaymentComponent from '@/components/FeaturePayment';
export default function SolanaPayment() {
  return (
    <ConnectionProvider endpoint='https://thrumming-little-card.solana-mainnet.quiknode.pro/43538a133d29fd9eecf9318a37ee158e10d9bb34'>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
        <FeaturePaymentComponent ></FeaturePaymentComponent>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}