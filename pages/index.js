import React from "react";
//  WEB3
import { ethers } from "ethers";
import { useSigner, useAccount } from "wagmi";
import {
  AmerG_Address,
  TWBTC_Address,
  ETHVault_Address,
  BTCVault_Address,
} from "./../contracts/Addresses";
// V2 ------------------------------
import {
  AmerG_ABI,
  TWBTC_ABI,
  ETH_Vault_ABI,
  BTC_Vault_ABI,
} from "../contracts/AbisNew";
// COMP.
import Head from "next/head";
import FAQ from "../components/home/FAQ";
import Hero from "../components/home/Hero";
import Packages from "../components/home/Packages";
import BorrowTokenPopup from "../components/utils/modals/BorrowTokenPopup";
// TOAST
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { borrowFromBTC, borrowFromETH } from "../services/handleBorrow";
// Loader
// import ScaleLoader from "react-spinners/ScaleLoader";

export default function Home() {
  const { data: signer } = useSigner();
  const { address } = useAccount();
  const [collateral, setCollateral] = React.useState(120);
  const [interestRates, setInterestRates] = React.useState([]);
  const [borrowInfo, setBorrowInfo] = React.useState({
    openStatus: false,
    tokens: 0,
  });
  const [categoryInfo, setCategoryInfo] = React.useState({
    name: "Borrow",
    index: 0,
    ETHRate: 0,
    BTCRate: 0,
  });

  // V2 ----------------------------------------------------------------
  let AmerGContract,
    TWBTCContract,
    ETHVaultContract,
    BTCVaultContract = "";
  if (signer) {
    AmerGContract = new ethers.Contract(AmerG_Address, AmerG_ABI, signer);
    TWBTCContract = new ethers.Contract(TWBTC_Address, TWBTC_ABI, signer);
    ETHVaultContract = new ethers.Contract(
      ETHVault_Address,
      ETH_Vault_ABI,
      signer
    );
    BTCVaultContract = new ethers.Contract(
      BTCVault_Address,
      BTC_Vault_ABI,
      signer
    );
  }

  const getTokenRate = async (cat_name, cat_index) => {
    if (cat_name !== "") {
      if (cat_name === "Borrow" && cat_index === 0) {
        await ETHVaultContract?.ethExchangeRate()
          .then((responce) => {
            setCategoryInfo((categoryInfo) => ({
              ...categoryInfo,
              ETHRate: parseInt(responce?._hex),
            }));
            // console.log("ETGGGG: ", parseInt(responce?._hex));
          })
          .catch((error) => {
            toast.error("Borrow BTC Rate Error :", error?.error?.message);
          });
      } else if (cat_name === "Borrow" && cat_index === 1) {
        await BTCVaultContract?.btcExchangeRate()
          .then((responce) => {
            setCategoryInfo((categoryInfo) => ({
              ...categoryInfo,
              BTCRate: parseInt(responce?._hex),
            }));
            // console.log("ETGGGG: ", parseInt(responce?._hex));
          })
          .catch((error) => {
            toast.error("Borrow BTC Rate Error :", error?.error?.message);
          });
      }
    }
  };
  const getInterestRates = async () => {
    // ________________________________________________ [Get Interest Rate from ETH]
    const i0 = await ETHVaultContract.interestRates(0);
    const i1 = await ETHVaultContract.interestRates(1);
    const i2 = await ETHVaultContract.interestRates(2);
    const i3 = await ETHVaultContract.interestRates(3);
    const i4 = await ETHVaultContract.interestRates(4);
    const i5 = await ETHVaultContract.interestRates(5);

    setInterestRates([
      parseInt(i0._hex, 16) / 100,
      parseInt(i1._hex, 16) / 100,
      parseInt(i2._hex, 16) / 100,
      parseInt(i3._hex, 16) / 100,
      parseInt(i4._hex, 16) / 100,
      parseInt(i5._hex, 16) / 100,
    ]);
  };
  // Borrow from ETH ____________________________________________________________________________|
  const handleBorrowFromETH = () => {
    borrowFromETH(ETHVaultContract, categoryInfo, borrowInfo, collateral);
  };
  // Borrow from BTC ____________________________________________________________________________|
  const handleBorrowFromBTC = () => {
    borrowFromBTC(
      TWBTCContract,
      BTCVaultContract,
      BTCVault_Address,
      address,
      categoryInfo,
      borrowInfo,
      collateral
    );
  };

  // Borrow from BTC <<<_____________________________________________
  const handlePackagePopupButton = () => {
    // Borrow From BTC
    if (categoryInfo?.name === "Borrow" && categoryInfo?.index === 0) {
      handleBorrowFromETH();
    } else if (categoryInfo?.name === "Borrow" && categoryInfo?.index === 1) {
      handleBorrowFromBTC();
    }
    setBorrowInfo((borrowInfo) => ({
      ...borrowInfo,
      openStatus: false,
    }));
  };

  const handlePackagesButton = (categoryName, categoryId) => {
    console.log("Category Name:", categoryName, "ID:", categoryId);
    setCategoryInfo({ name: categoryName, index: categoryId });
    setBorrowInfo((borrowInfo) => ({
      ...borrowInfo,
      openStatus: true,
    }));
    getTokenRate(categoryName, categoryId);
    getInterestRates();
  };

  // console.log("Collateral:", collateral);
  return (
    <div className="">
      <Head>
        <title>Exchange</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <ToastContainer />
        <BorrowTokenPopup
          borrowInfo={borrowInfo}
          setBorrowInfo={setBorrowInfo}
          categoryInfo={categoryInfo}
          handlePackagePopupButton={handlePackagePopupButton}
          interestRates={interestRates}
          collateral={collateral}
          setCollateral={setCollateral}
        />
        <Hero />
        <Packages handlePackagesButton={handlePackagesButton} />
        <FAQ />
      </main>

      <footer className=""></footer>
    </div>
  );
}
