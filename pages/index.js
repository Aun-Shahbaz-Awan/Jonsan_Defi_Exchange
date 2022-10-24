import React, { useEffect } from "react";
//  WEB3
import { BigNumber, ethers } from "ethers";
import { useSigner, useAccount } from "wagmi";
import {
  GUSD_Address,
  TESTBNB_Address,
  TESTETH_Address,
  Exchange_Address,
} from "./../contracts/Addresses";
import { Token_Abi, Exchange_Abi } from "../contracts/Abis";
// COMP.
import Head from "next/head";
import FAQ from "../components/home/FAQ";
import Hero from "../components/home/Hero";
import Packages from "../components/home/Packages";
import BorrowTokenPopup from "../components/utils/modals/BorrowTokenPopup";
// TOAST
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const { data: signer } = useSigner();
  const { address } = useAccount();

  const [borrowInfo, setBorrowInfo] = React.useState({
    openStatus: false,
    tokens: 0,
  });
  const [categoryInfo, setCategoryInfo] = React.useState({
    name: "",
    index: 0,
    tokenRate: 0,
  });

  let GUSDContract,
    TESTBNBContract,
    TESTETHContract,
    ExchangeContract = "";
  if (signer) {
    GUSDContract = new ethers.Contract(GUSD_Address, Token_Abi, signer);
    TESTBNBContract = new ethers.Contract(TESTBNB_Address, Token_Abi, signer);
    TESTETHContract = new ethers.Contract(TESTETH_Address, Token_Abi, signer);
    ExchangeContract = new ethers.Contract(
      Exchange_Address,
      Exchange_Abi,
      signer
    );
  }
  console.log("Ex Contract:", ExchangeContract);

  const getBTCRate = () => {
    if (categoryInfo.name !== "") {
      if (categoryInfo.name === "Borrow" && categoryInfo.index === 1) {
        console.log("Getting BTC Rate...");
        ExchangeContract?.getBtcRate()
          .then((responce) => {
            console.log("BTC Rate Responce:", parseInt(responce?._hex));
            setCategoryInfo((categoryInfo) => ({
              ...categoryInfo,
              tokenRate: parseInt(responce?._hex),
            }));
          })
          .catch((error) => {
            console.log("getBTCRate() Error:", error);
            toast.error("2: ", error?.error?.message);
          });
        console.log("Getting BTC Rate...");
      }
    }
  };

  const borrowBTC = () => {
    toast.promise(
      ExchangeContract?.borrowTokensForBtc(
        BigInt(borrowInfo?.tokens * 1e18),
        BigInt((categoryInfo?.tokenRate * borrowInfo?.tokens * 1e18) / 1.25)
      )
        .then((tx) =>
          toast.promise(
            tx.wait().then((responce) => {
              console.log("Final Responce:", responce);
              toast.success("Borrow Successfully 🥳🎉🎊!");
            }),
            {
              pending: "Waiting for Transaction to Approve",
              error: "Transction Rejected 😏💔",
            }
          )
        )
        .catch((error) => {
          console.log("Borrow Error:", error);
          toast.error(error?.error?.data?.message);
        }),
      {
        pending: "Waiting for Transaction to Approve",
        error: "Transction Rejected 😏💔",
      }
    );
  };
  const handleBorrowFromBTC = () => {
    console.log(
      "Borrowing some Token from BTC...",
      (categoryInfo?.tokenRate * borrowInfo?.tokens) / 1.25
    );
    console.log("CategoryInfo:", categoryInfo, "BorrowInfo:", borrowInfo);
    console.log("Acc", address);
    TESTBNBContract?.allowance(
      address,
      "0x802304d9715F2E49878d151cf51b0A6e3B04f5c3"
    )
      .then((responce) => {
        if (
          BigInt(parseInt(responce._hex)) < BigInt(borrowInfo?.tokens * 1e18)
        ) {
          toast.promise(
            TESTBNBContract?.approve(
              Exchange_Address,
              BigInt(borrowInfo?.tokens * 1e18)
            )
              .then((tx) => {
                tx.wait().then((responce) => {
                  borrowBTC();
                });
              })
              .catch((error) => {
                console.log("error:", error);
                toast.error(error?.error?.message);
              }),
            {
              pending: "Borrow in Process",
              error: "Something wrong with Borrow 😏💔",
            }
          );
        } else {
          borrowBTC();
        }
        console.log(">>>", BigInt(parseInt(responce._hex)));
      })
      .catch((err) => console.log(err));
  };

  const handlePackagePopupButton = () => {
    console.log("cName:", categoryInfo.name, "cId:", categoryInfo.index);
    // Borrow From BTC
    if (categoryInfo?.name === "Borrow" && categoryInfo?.index === 1) {
      handleBorrowFromBTC();
    }
    setBorrowInfo((borrowInfo) => ({
      ...borrowInfo,
      openStatus: false,
    }));
  };

  const handlePackagesButton = (categoryName, categoryId) => {
    setCategoryInfo({ name: categoryName, index: categoryId });
    setBorrowInfo((borrowInfo) => ({
      ...borrowInfo,
      openStatus: true,
    }));
  };

  useEffect(() => {
    getBTCRate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryInfo?.index, categoryInfo?.name]);

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
        />
        <Hero />
        <Packages handlePackagesButton={handlePackagesButton} />
        <FAQ />
      </main>

      <footer className=""></footer>
    </div>
  );
}
