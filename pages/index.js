import React from "react";
//  WEB3
import { ethers } from "ethers";
import { useSigner, useAccount } from "wagmi";
import {
  GUSD_Address,
  TESTBTC_Address,
  Exchange_Address,
  AmerG_Address,
  TWBTC_Address,
  ETHVault_Address,
  BTCVault_Address,
} from "./../contracts/Addresses";
import { Token_Abi, StableCoin_Abi, Exchange_Abi } from "../contracts/Abis";
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

  let GUSDContract,
    TESTBTCContract,
    ExchangeContract = "";
  if (signer) {
    GUSDContract = new ethers.Contract(GUSD_Address, StableCoin_Abi, signer);
    TESTBTCContract = new ethers.Contract(TESTBTC_Address, Token_Abi, signer);
    ExchangeContract = new ethers.Contract(
      Exchange_Address,
      Exchange_Abi,
      signer
    );
  }
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
        await ExchangeContract?.getEthRate()
          .then((responce) => {
            setCategoryInfo((categoryInfo) => ({
              ...categoryInfo,
              ETHRate: parseInt(responce?._hex),
            }));
          })
          .catch((error) => {
            toast.error("Borrow BTC Rate Error :", error?.error?.message);
          });
      } else if (cat_name === "Borrow" && cat_index === 1) {
        await ExchangeContract?.getBtcRate()
          .then((responce) => {
            setCategoryInfo((categoryInfo) => ({
              ...categoryInfo,
              BTCRate: parseInt(responce?._hex),
            }));
          })
          .catch((error) => {
            toast.error("Borrow BTC Rate Error :", error?.error?.message);
          });
      }
    }
  };
  const getInterestRates = async () => {
    await ExchangeContract?.getInterestRates()
      .then((responce) => {
        setInterestRates(responce);
      })
      .catch((error) => {
        toast.error("Borrow BTC Rate Error :", error?.error?.message);
      });
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
  // Borrow from BTC ______________________________________________>>>
  // const borrowFromBTC = () => {
  //   toast.promise(
  //     ExchangeContract?.borrowTokensForBtc(
  //       BigInt(borrowInfo?.tokens * 1e18),
  //       BigInt(
  //         (categoryInfo?.BTCRate * borrowInfo?.tokens * 1e18) /
  //           ((collateral + 1) / 100)
  //       )
  //     )
  //       .then((tx) =>
  //         toast.promise(
  //           tx.wait().then((responce) => {
  //             console.log("Final Responce:", responce);
  //             toast.success("Borrow Successfully 🥳🎉🎊!");
  //           }),
  //           {
  //             pending: "Please wait borrow in process!",
  //             error: "Transction Rejected 😏💔",
  //           }
  //         )
  //       )
  //       .catch((error) => {
  //         console.log("Borrow Error:", error);
  //         toast.error(error?.error?.data?.message);
  //       }),
  //     {
  //       pending: "Step 2 of 2: Waiting for Borrow Tx. to Accept!",
  //       error: "Transction Rejected 😏💔",
  //     }
  //   );
  // };
  // const handleBorrowFromBTC = () => {
  //   TESTBTCContract?.allowance(address, Exchange_Address)
  //     .then((responce) => {
  //       if (
  //         BigInt(parseInt(responce._hex)) < BigInt(borrowInfo?.tokens * 1e18)
  //       ) {
  //         toast.promise(
  //           TESTBTCContract?.approve(
  //             Exchange_Address,
  //             BigInt(borrowInfo?.tokens * 1e18)
  //           )
  //             .then((tx) => {
  //               toast.promise(
  //                 tx.wait().then((responce) => {
  //                   borrowFromBTC();
  //                 }),
  //                 {
  //                   pending: "Please wait allowance in process!",
  //                   error: "Something wrong with Allowance 😏💔",
  //                 }
  //               );
  //             })
  //             .catch((error) => {
  //               toast.error(error?.error?.message);
  //             }),
  //           {
  //             pending: "Step 1 of 2: Waiting for Allowance Tx. to Accept!",
  //             error: "Something wrong with Borrow 😏💔",
  //           }
  //         );
  //       } else {
  //         borrowFromBTC();
  //       }
  //     })
  //     .catch((err) => console.log(err));
  // };
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

  // React.useEffect(() => {
  //   if (ExchangeContract) getInterestRates();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  console.log("Collateral:", collateral);
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
        {/* {TESTBTCContract ? (
          <Packages handlePackagesButton={handlePackagesButton} />
        ) : (
          <div className="flex justify-center">
            <ScaleLoader size={20} />
          </div>
        )} */}
        <FAQ />
      </main>

      <footer className=""></footer>
    </div>
  );
}
