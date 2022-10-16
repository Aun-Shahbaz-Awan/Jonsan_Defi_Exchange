import React from "react";
import Navbar from "../components/Navbar";
import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

function MyApp({ Component, pageProps }) {
  const BinanceChain = {
    id: 97,
    name: "Binance Smart Chain",
    network: "Binance",
    iconUrl: "https://bscxplorer.com/static/favicon/BSC/logo.svg",
    iconBackground: "#fff",
    nativeCurrency: {
      decimals: 18,
      name: "Smart Chain",
      symbol: "BNB",
    },
    rpcUrls: {
      default: "https://data-seed-prebsc-1-s1.binance.org:8545",
    },
    blockExplorers: {
      default: { name: "SnowTrace", url: "https://testnet.bscscan.com" },
      etherscan: { name: "SnowTrace", url: "https://testnet.bscscan.com" },
    },
    testnet: true,
  };

  const { chains, provider } = configureChains(
    [BinanceChain],
    [
      alchemyProvider({ alchemyId: "gFZetYQhmO8gDbZM_nss4JLAfCgZFUim" }),
      publicProvider(),
    ]
  );

  const { connectors } = getDefaultWallets({
    appName: "exchange",
    chains,
  });

  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
  });

  return (
    <div className="w-full bg-[url('/images/s1_top_bg.png')] bg-contain bg-no-repeat">
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider
          chains={chains}
          theme={darkTheme({
            overlayBlur: "small",
          })}
        >
          <Navbar />
          <Component {...pageProps} />
        </RainbowKitProvider>{" "}
      </WagmiConfig>
    </div>
  );
}

export default MyApp;
