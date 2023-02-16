import React, { Fragment, useState } from "react";
import { BsArrowRight } from "react-icons/bs";
// Web 3
import { ethers } from "ethers";
import { useSigner, useAccount } from "wagmi";
import {
  GUSD_Address,
  TESTBTC_Address,
  // TESTETH_Address,
  Exchange_Address,
} from "./../../contracts/Addresses";
import { Token_Abi, StableCoin_Abi, Exchange_Abi } from "../../contracts/Abis";
// Headless UI
import { Listbox, Transition } from "@headlessui/react";
import { BiCheck, BiChevronsDown } from "react-icons/bi";
// import { Switch } from "@headlessui/react";
import { Tab } from "@headlessui/react";
// Toast
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Loader
import ScaleLoader from "react-spinners/ScaleLoader";

function ETHBoard() {
  const { data: signer } = useSigner();
  const { address } = useAccount();
  // Select BTC Id
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [BTCTxIds, setBTCTxIds] = React.useState([]);
  const [selectedTxId, setSelectedTxId] = useState(0);
  const [borrowInfo, setBorrowInfo] = useState([]);
  const [interestRateInfo, setInterestRateInfo] = useState([]);
  const [totalInterest, setTotalInterest] = useState(0);
  const [refinancePercentage, setRefinancePercentage] = useState(0);
  const [reimburseAmount, setReimburseAmount] = useState(0);
  // OnlyOwner
  const [ownerAddress, setOwnerAddress] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [isBTCSelected, setIsBTCSelected] = useState(true);
  const [returnCollateralTxId, setReturnCollateralTxId] = useState(0);
  const [coldWalletAddress, setColdWalletAddress] = useState("");
  const [refinanceFee, setRefinanceFee] = useState(0);
  const [interestRates, setInterestRates] = useState("");
  const [btcFeedAddress, setBtcFeedAddress] = useState("");
  const [ethFeedAddress, setEthFeedAddress] = useState("");
  // Withdraw - OnlyOwner
  const [withdrawBtcAmount, setWithdrawBtcAmount] = useState(0);
  const [withdrawEthAmount, setWithdrawEthAmount] = useState(0);
  const [withdrawTokensAmount, setWithdrawTokensAmount] = useState(0);

  let GUSDContract,
    TESTBNBContract,
    // TESTETHContract,
    ExchangeContract = "";
  if (signer) {
    GUSDContract = new ethers.Contract(GUSD_Address, StableCoin_Abi, signer);
    TESTBNBContract = new ethers.Contract(TESTBTC_Address, Token_Abi, signer);
    // TESTETHContract = new ethers.Contract(TESTETH_Address, Token_Abi, signer);
    ExchangeContract = new ethers.Contract(
      Exchange_Address,
      Exchange_Abi,
      signer
    );
  }

  const getTxIds = () => {
    if (isBTCSelected)
      ExchangeContract.getBtcTxIds(address)
        .then((txIds) => {
          setBTCTxIds(txIds);
          setSelectedTxId(parseInt(txIds, 10));
          setIsLoaded(true);
        })
        .catch((error) => {
          console.log("Error:", error);
        });
    else {
      ExchangeContract.getEthTxIds(address)
        .then((txIds) => {
          setBTCTxIds(txIds);
          setSelectedTxId(parseInt(txIds, 10));
          setIsLoaded(true);
        })
        .catch((error) => {
          console.log("Error:", error);
        });
    }
  };
  // Get Borrow Info =======================================>>>
  const getBorrowInfo = () => {
    ExchangeContract.owner()
      .then((info) => {
        setOwnerAddress(info);
        address === info ? setIsOwner(true) : setIsOwner(false);
        console.log("Is Owner:", isOwner);
      })
      .catch((error) => {
        console.log("getBorrowInfo Error:", error);
      });
    ExchangeContract.getBorrowInfo(selectedTxId)
      .then((info) => {
        setBorrowInfo(info);
      })
      .catch((error) => {
        console.log("getBorrowInfo Error:", error);
      });
    ExchangeContract.getTotalInterest(selectedTxId)
      .then((info) => {
        setTotalInterest(parseInt(info._hex, 16));
      })
      .catch((error) => {
        console.log("getBorrowInfo Error:", error);
      });
    ExchangeContract.getInterestRates()
      .then((info) => {
        setInterestRateInfo(info);
      })
      .catch((error) => {
        console.log("getBorrowInfo Error:", error);
      });
  };
  // Pay Interest ==========================================>>>
  const payInterest = () => {
    toast.promise(
      ExchangeContract?.payInterest(selectedTxId)
        .then((tx) => {
          setIsLoaded(false);
          toast.promise(
            tx.wait().then((responce) => {
              console.log("Final Responce:", responce);
              getBorrowInfo();
              setIsLoaded(true);
              toast.success("Interest Paid Successfully 🥳🎉🎊!");
            }),
            {
              pending: "Payment in Process...",
              error: "Transction Rejected 😏💔",
            }
          );
        })
        .catch((error) => {
          console.log("Borrow Error:", error);
          toast.error(error?.error?.data?.message);
        }),
      {
        pending: "Step 2 of 2: Waiting for Payment Tx. to Accept!",
        error: "Transction Rejected 😏💔",
      }
    );
  };
  const handlePayInterest = () => {
    GUSDContract?.allowance(
      address,
      "0x802304d9715F2E49878d151cf51b0A6e3B04f5c3"
    )
      .then((responce) => {
        if (BigInt(parseInt(responce._hex)) < BigInt(totalInterest)) {
          toast.promise(
            GUSDContract?.approve(
              Exchange_Address,
              BigInt(totalInterest + 10000000000000000)
            )
              .then((tx) => {
                toast.promise(
                  tx.wait().then((responce) => {
                    payInterest();
                  }),
                  {
                    pending: "Please Wait: Allowance in process!",
                    error: "Something wrong with Allowance 😏💔",
                  }
                );
              })
              .catch((error) => {
                toast.error(error?.error?.message);
              }),
            {
              pending: "Step 1 of 2: Waiting for Allowance Tx. to Accept!",
              error: "Something wrong with Borrow 😏💔",
            }
          );
        } else {
          payInterest();
        }
      })
      .catch((err) => console.log("Find total Allowance Error:", err));
  };
  // Refinance =============================================>>>
  const handleRefinance = () => {
    toast.promise(
      ExchangeContract?.refinance(selectedTxId, refinancePercentage)
        .then((tx) => {
          setIsLoaded(false);
          toast.promise(
            tx.wait().then((responce) => {
              console.log("Refinance Responce:", responce);
              getBorrowInfo();
              setIsLoaded(true);
              toast.success("Refinance Successfully 🥳🎉🎊!");
            }),
            {
              pending: "Refinance in Process...",
              error: "Transction Rejected 😏💔",
            }
          );
        })
        .catch((error) => {
          console.log("Borrow Error:", error);
          toast.error(error?.error?.data?.message);
        }),
      {
        pending: "Waiting for Refinance Tx. to Accept!",
        error: "Transction Rejected 😏💔",
      }
    );
  };
  // Reimburse =============================================>>>
  const reimburse = () => {
    toast.promise(
      ExchangeContract?.reimburse(selectedTxId, BigInt(reimburseAmount * 1e18))
        .then((tx) => {
          setIsLoaded(false);
          toast.promise(
            tx.wait().then((responce) => {
              console.log("Reimburse Responce:", responce);
              getBorrowInfo();
              setIsLoaded(true);
              toast.success("Reimburse Successfully 🥳🎉🎊!");
            }),
            {
              pending: "Reimburse in Process...",
              error: "Transction Rejected 😏💔",
            }
          );
        })
        .catch((error) => {
          console.log("Borrow Error:", error);
          toast.error(error?.error?.data?.message);
        }),
      {
        pending: "Step 2 of 2: Waiting for Reimburse Tx. to Accept!",
        error: "Transction Rejected 😏💔",
      }
    );
  };
  const handleReimburse = () => {
    GUSDContract?.allowance(
      address,
      "0x802304d9715F2E49878d151cf51b0A6e3B04f5c3"
    )
      .then((responce) => {
        if (BigInt(parseInt(responce._hex)) < BigInt(reimburseAmount * 1e18)) {
          toast.promise(
            GUSDContract?.approve(
              Exchange_Address,
              BigInt(parseInt(borrowInfo[0], 10))
            )
              .then((tx) => {
                toast.promise(
                  tx.wait().then((responce) => {
                    reimburse();
                  }),
                  {
                    pending: "Please Wait: Allowance in process!",
                    error: "Something wrong with Allowance 😏💔",
                  }
                );
              })
              .catch((error) => {
                toast.error(error?.error?.message);
              }),
            {
              pending: "Step 1 of 2: Waiting for Allowance Tx. to Accept!",
              error: "Something wrong with Borrow 😏💔",
            }
          );
        } else {
          reimburse();
        }
      })
      .catch((err) => console.log("Find total Allowance Error:", err));
  };
  // ReturnCollateral ======================================>>>
  const handleReturnCollateral = () => {
    toast.promise(
      ExchangeContract?.returnCollateral(returnCollateralTxId)
        .then((tx) => {
          setIsLoaded(false);
          toast.promise(
            tx.wait().then((responce) => {
              console.log("Final Responce:", responce);
              getBorrowInfo();
              setIsLoaded(true);
              toast.success("Return Collateral Successfully 🥳🎉🎊!");
            }),
            {
              pending: "Return Collateral in Process...",
              error: "Transction Rejected 😏💔",
            }
          );
        })
        .catch((error) => {
          console.log("Borrow Error:", error);
          toast.error(error?.error?.data?.message);
        }),
      {
        pending: "Waiting for Tx. to Accept!",
        error: "Transction Rejected 😏💔",
      }
    );
  };
  // Set Cold Wallet =======================================>>>
  const handleSetColdWallet = () => {
    toast.promise(
      ExchangeContract?.setColdWallet(coldWalletAddress)
        .then((tx) => {
          setIsLoaded(false);
          toast.promise(
            tx.wait().then((responce) => {
              console.log("Final Responce:", responce);
              getBorrowInfo();
              setIsLoaded(true);
              toast.success("Cold Wallet Set Successfully 🥳🎉🎊!");
            }),
            {
              pending: "Setting Cold Wallet in Process...",
              error: "Transction Rejected 😏💔",
            }
          );
        })
        .catch((error) => {
          console.log("Borrow Error:", error);
          toast.error(error?.error?.data?.message);
        }),
      {
        pending: "Waiting for Tx. to Accept!",
        error: "Transction Rejected 😏💔",
      }
    );
  };
  // Set Refinance Fee =====================================>>>
  const handleSetRefinanceFee = () => {
    toast.promise(
      ExchangeContract?.setRefinanceFee(refinanceFee)
        .then((tx) => {
          setIsLoaded(false);
          toast.promise(
            tx.wait().then((responce) => {
              console.log("Final Responce:", responce);
              getBorrowInfo();
              setIsLoaded(true);
              toast.success("Refinance Fee Set Successfully 🥳🎉🎊!");
            }),
            {
              pending: "Setting Refinance Fee in Process...",
              error: "Transction Rejected 😏💔",
            }
          );
        })
        .catch((error) => {
          console.log("Borrow Error:", error);
          toast.error(error?.error?.data?.message);
        }),
      {
        pending: "Waiting for Tx. to Accept!",
        error: "Transction Rejected 😏💔",
      }
    );
  };
  // Set Interest Rates =====================================>>>
  const handleSetInterestRates = () => {
    const interestRatesArray = interestRates.split(",").map((element) => {
      return Number(element) * 100;
    });
    console.log("Interest rates", interestRatesArray);
    toast.promise(
      ExchangeContract?.setInterestRates(interestRatesArray)
        .then((tx) => {
          setIsLoaded(false);
          toast.promise(
            tx.wait().then((responce) => {
              console.log("Final Responce:", responce);
              getBorrowInfo();
              setIsLoaded(true);
              toast.success("Refinance Fee Set Successfully 🥳🎉🎊!");
            }),
            {
              pending: "Setting Refinance Fee in Process...",
              error: "Transction Rejected 😏💔",
            }
          );
        })
        .catch((error) => {
          console.log("Borrow Error:", error);
          toast.error(error?.error?.data?.message);
        }),
      {
        pending: "Waiting for Tx. to Accept!",
        error: "Transction Rejected 😏💔",
      }
    );
  };
  // Set Price Feeds =====================================>>>
  const handleSetPriceFeeds = () => {
    toast.promise(
      ExchangeContract?.setPriceFeeds(btcFeedAddress, ethFeedAddress)
        .then((tx) => {
          setIsLoaded(false);
          toast.promise(
            tx.wait().then((responce) => {
              console.log("Final Responce:", responce);
              getBorrowInfo();
              setIsLoaded(true);
              toast.success("Price Feeds Set Successfully 🥳🎉🎊!");
            }),
            {
              pending: "Setting Price Feeds in Process...",
              error: "Transction Rejected 😏💔",
            }
          );
        })
        .catch((error) => {
          console.log("Error:", error);
          toast.error(error?.error?.data?.message);
        }),
      {
        pending: "Waiting for Tx. to Accept!",
        error: "Transction Rejected 😏💔",
      }
    );
  };
  // Widthdraw ===============================================================>>>
  // Widthdraw BTC =========================================>>>
  const handleWithdrawBtc = () => {
    toast.promise(
      ExchangeContract?.withdrawBtc(BigInt(withdrawBtcAmount * 1e18))
        .then((tx) => {
          setIsLoaded(false);
          toast.promise(
            tx.wait().then((responce) => {
              console.log("Final Responce:", responce);
              getBorrowInfo();
              setIsLoaded(true);
              toast.success("Withdraw BTC Successfully 🥳🎉🎊!");
            }),
            {
              pending: "Withdraw BTC in Process...",
              error: "Transction Rejected 😏💔",
            }
          );
        })
        .catch((error) => {
          console.log("Borrow Error:", error);
          toast.error(error?.error?.data?.message);
        }),
      {
        pending: "Waiting for Tx. to Accept!",
        error: "Transction Rejected 😏💔",
      }
    );
  };
  // Widthdraw BTC =========================================>>>
  const handleWithdrawEth = () => {
    toast.promise(
      ExchangeContract?.withdrawEth(BigInt(withdrawEthAmount * 1e18))
        .then((tx) => {
          setIsLoaded(false);
          toast.promise(
            tx.wait().then((responce) => {
              console.log("Final Responce:", responce);
              getBorrowInfo();
              setIsLoaded(true);
              toast.success("Withdraw ETH Successfully 🥳🎉🎊!");
            }),
            {
              pending: "Withdraw ETH in Process...",
              error: "Transction Rejected 😏💔",
            }
          );
        })
        .catch((error) => {
          console.log("Borrow Error:", error);
          toast.error(error?.error?.data?.message);
        }),
      {
        pending: "Waiting for Tx. to Accept!",
        error: "Transction Rejected 😏💔",
      }
    );
  };
  // Widthdraw Tokens(AmerG) ================================>>>
  const handleWithdrawTokens = () => {
    toast.promise(
      ExchangeContract?.withdrawTokens(BigInt(withdrawTokensAmount * 1e18))
        .then((tx) => {
          setIsLoaded(false);
          toast.promise(
            tx.wait().then((responce) => {
              console.log("Final Responce:", responce);
              getBorrowInfo();
              setIsLoaded(true);
              toast.success("Withdraw Tokens Successfully 🥳🎉🎊!");
            }),
            {
              pending: "Withdraw Tokens in Process...",
              error: "Transction Rejected 😏💔",
            }
          );
        })
        .catch((error) => {
          console.log("Borrow Error:", error);
          toast.error(error?.error?.data?.message);
        }),
      {
        pending: "Waiting for Tx. to Accept!",
        error: "Transction Rejected 😏💔",
      }
    );
  };

  // useEffect =============================================>>>
  React.useEffect(() => {
    if (signer) getTxIds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signer, address, isBTCSelected]);

  React.useEffect(() => {
    if (signer && selectedTxId) getBorrowInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTxId, isBTCSelected]);

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <React.Fragment>
      <ToastContainer />
      <div className="text-primary my-12 max-w-6xl mx-auto">
        <h5 className="text-center text-3xl font-medium mb-8">DASHBOARD</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 mx-3 md:mx-0 gap-8">
          {/* Column 1 */}
          <div className="bg-gradient-to-r from-grad-one via-grad-two to-grad-three rounded-xl p-7 shadow-xl">
            <div className="flex justify-between items-center mb-3">
              <h6 className="text-xl font-medium">
                Pay your {isBTCSelected ? "BTC" : "ETH"} Interest
              </h6>
              <div className="w-24 ml-4">
                {isLoaded ? (
                  <Tab.Group>
                    <Tab.List className="flex space-x-1 rounded-full p-1 bg-secondary-light">
                      <Tab
                        key="BTC"
                        onClick={() => setIsBTCSelected(true)}
                        className={({ selected }) =>
                          classNames(
                            "w-full rounded-full py-1 text-xs font-medium leading-5 text-primary",
                            selected
                              ? "bg-white shadow outline-none "
                              : "text-gray-600 hover:bg-white/[0.3] hover:text-gray-800"
                          )
                        }
                      >
                        BTC
                      </Tab>
                      <Tab
                        key="ETH"
                        onClick={() => setIsBTCSelected(false)}
                        className={({ selected }) =>
                          classNames(
                            "w-full rounded-full py-1 text-xs font-medium leading-5 text-primary",
                            selected
                              ? "bg-white shadow outline-none"
                              : "text-gray-600 hover:bg-white/[0.3] hover:text-gray-800"
                          )
                        }
                      >
                        ETH
                      </Tab>
                    </Tab.List>
                  </Tab.Group>
                ) : (
                  <div className="flex justify-center">
                    <ScaleLoader size={20} />
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center mb-3 w-full">
              <p className="text-gray-600 text-sm my-auto py-2 w-9/12">
                Please Select One of the Transaction Id to Pay Its Interest.
              </p>
              <Listbox
                value={selectedTxId}
                onChange={setSelectedTxId}
                // className="w-2/12"
              >
                <div className="relative border border-primary rounded-lg w-3/12">
                  <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                    <span className="block truncate">{selectedTxId}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <BiChevronsDown
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {BTCTxIds.map((txId, idIndex) => (
                        <Listbox.Option
                          key={idIndex}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active
                                ? "bg-amber-100 text-amber-900"
                                : "text-gray-900"
                            }`
                          }
                          value={parseInt(txId, 10)}
                        >
                          {({ selectedTxId }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selectedTxId ? "font-medium" : "font-normal"
                                }`}
                              >
                                {parseInt(txId, 10)}
                              </span>
                              {selectedTxId ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                  <BiCheck
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div>

            <p className="flex items-center leading-8 font-medium cursor-pointer hover:gap-1">
              Total Borrowed AmerG
              <span className="mx-2">
                <BsArrowRight />
              </span>
              {isLoaded ? parseInt(borrowInfo[0], 10) / 1e18 : "Loading..."}
            </p>
            <p className="flex items-center leading-8 font-medium cursor-pointer hover:gap-1">
              Borrowed From
              <span className="mx-2">
                <BsArrowRight />
              </span>
              {isLoaded ? parseInt(borrowInfo[1], 10) / 1e18 : "Loading..."}
              {borrowInfo[6] ? " BTC" : " ETH"}
            </p>
            <p className="flex items-center leading-8 font-medium cursor-pointer hover:gap-1">
              Collateral Percentage
              <span className="mx-2">
                <BsArrowRight />
              </span>
              {isLoaded ? parseInt(borrowInfo[2], 10) + "%" : "Loading..."}
            </p>
            <p className="flex items-center leading-8 font-medium cursor-pointer hover:gap-1">
              Last Paid On
              <span className="mx-2">
                <BsArrowRight />
              </span>
              {isLoaded
                ? new Date(parseInt(borrowInfo[3], 10) * 1000).toDateString() +
                  " - " +
                  new Date(
                    parseInt(borrowInfo[3], 10) * 1000
                  ).toLocaleTimeString()
                : "Loading..."}
            </p>
            <p className="flex items-center leading-8 font-medium cursor-pointer hover:gap-1">
              Account Interest
              <span className="mx-2">
                <BsArrowRight />
              </span>
              {/* {isLoaded ? parseInt(borrowInfo[4], 10) : "Loading..."} */}
              {isLoaded
                ? parseInt(borrowInfo[2], 10) >= 401 &&
                  parseInt(borrowInfo[2], 10) <= 500
                  ? parseInt(interestRateInfo[0], 10) / 100 + "%"
                  : parseInt(borrowInfo[2], 10) >= 301 &&
                    parseInt(borrowInfo[2], 10) < 401
                  ? parseInt(interestRateInfo[1], 10) / 100 + "%"
                  : parseInt(borrowInfo[2], 10) >= 251 &&
                    parseInt(borrowInfo[2], 10) <= 301
                  ? parseInt(interestRateInfo[2], 10) / 100 + "%"
                  : parseInt(borrowInfo[2], 10) >= 201 &&
                    parseInt(borrowInfo[2], 10) < 251
                  ? parseInt(interestRateInfo[3], 10) / 100 + "%"
                  : parseInt(borrowInfo[2], 10) >= 171 &&
                    parseInt(borrowInfo[2], 10) <= 201
                  ? parseInt(interestRateInfo[4], 10) / 100 + "%"
                  : parseInt(borrowInfo[2], 10) >= 120 &&
                    parseInt(borrowInfo[2], 10) <= 171
                  ? parseInt(interestRateInfo[5], 10) / 100 + "%"
                  : "Invalid Collateral"
                : "Loading..."}
            </p>
            <div className="flex flex-col md:flex-row items-center md:justify-between leading-8 mt-4 font-medium cursor-pointer hover:gap-1">
              <div>
                {isLoaded ? (
                  <input
                    value={totalInterest / 1e18}
                    disabled={true}
                    className="bg-white rounded-lg px-4 py-1 outline-none"
                  />
                ) : (
                  "Loading..."
                )}

                <span className="ml-3">AmerG</span>
              </div>

              <button
                onClick={() => handlePayInterest()}
                className="bg-gradient-to-r from-grad-three via-grad-two to-grad-one text-primary border border-primary hover:scale-95 rounded-lg px-4 py-1 mt-4 w-auto md:mt-0 outline-none shadow-xl"
              >
                Pay Interest
              </button>
            </div>
          </div>
          {/* Column 2 */}
          <div>
            {/* Column 2.1 */}
            <div className="bg-gradient-to-r from-grad-three via-grad-two to-grad-one rounded-xl px-6 py-6 mb-8 shadow-xl">
              {/* Refinance */}
              <h6 className="text-xl font-medium">Refinance</h6>
              <p className="text-gray-600 text-sm my-auto pb-2">
                You can refinance the collateral between 120% to 500%.
              </p>
              <div className="flex flex-col md:flex-row mb-4 w-full">
                <div className="flex flex-col mr-4">
                  <label className="text-xs text-gray-600 mb-1">Tx ID</label>
                  <input
                    value={selectedTxId}
                    disabled={true}
                    className="bg-white rounded-lg border border-gray-300 px-4 py-1 outline-none w-20"
                  />
                </div>
                <div className="flex flex-col w-full">
                  <label className="text-xs text-gray-600 mb-1">
                    Collateral Percentage
                  </label>
                  <input
                    placeholder="Set % between 120 to 500"
                    value={refinancePercentage}
                    // disabled={true}
                    onChange={(e) => {
                      setRefinancePercentage(e.target.value);
                    }}
                    className="bg-white rounded-lg border border-gray-300 px-4 py-1 outline-none w-auto"
                  />
                </div>
                <button
                  onClick={() => handleRefinance()}
                  className="bg-gradient-to-r from-grad-one via-grad-two to-grad-three text-primary border border-primary hover:scale-95 rounded-lg outline-none shadow-xl py-1 px-2 mt-2 md:ml-4 md:mt-auto"
                >
                  Update
                </button>
              </div>
            </div>
            {/* Column 2.2 */}
            <div className="bg-gradient-to-r from-grad-three via-grad-two to-grad-one rounded-xl px-6 py-6 shadow-xl">
              {/* Reimburse */}
              <h6 className="text-xl font-medium">Reimburse</h6>
              <p className="text-gray-600 text-sm my-auto pb-2">
                You can return stable coin if you do not want to pay interest.
              </p>
              <div className="flex flex-col md:flex-row mb-4 w-full">
                <div className="flex flex-col mr-4">
                  <label className="text-xs text-gray-600 mb-1">Tx ID</label>
                  <input
                    value={selectedTxId}
                    disabled={true}
                    className="bg-white rounded-lg border border-gray-300 px-4 py-1 outline-none w-20"
                  />
                </div>
                <div className="flex flex-col w-full">
                  <label className="text-xs text-gray-600 mb-1">
                    Ammout{" "}
                    {isLoaded
                      ? "(" +
                        parseInt(borrowInfo[0], 10) / 1e18 +
                        " AmerG Available)"
                      : "(Loading...)"}
                  </label>
                  <input
                    placeholder="Enter reimbburse Value"
                    value={reimburseAmount}
                    onChange={(e) => setReimburseAmount(e.target.value)}
                    className="bg-white rounded-lg border border-gray-300 px-4 py-1 outline-none w-auto"
                  />
                </div>
                <button
                  onClick={() => handleReimburse()}
                  className="bg-gradient-to-r from-grad-one via-grad-two to-grad-three text-primary border border-primary hover:scale-95 rounded-lg outline-none shadow-xl py-1 px-2 mt-2 md:ml-4 md:mt-auto"
                >
                  Return
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Only Owner */}
        {isOwner ? (
          <div>
            <h5 className="text-center text-3xl font-medium mt-12 mb-8">
              ONLY OWNER
            </h5>
            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gradient-to-r from-grad-one via-grad-two to-grad-three rounded-xl p-7 mx-3 md:mx-0  shadow-xl">
              {/* returnCollateral */}
              <div className="px-6 py-6 border border-gray-400 rounded-xl">
                <h6 className="text-xl font-medium">Return Collateral</h6>
                <p className="text-gray-600 text-sm my-auto pb-2">
                  You can return assets back to user for any reason.
                </p>
                <div className="flex flex-col md:flex-row mb-4 w-full">
                  <div className="flex flex-col w-full">
                    <label className="text-xs text-gray-600 mb-1">Tx ID</label>
                    <input
                      placeholder="Please enter Tx Id to return collateral"
                      value={returnCollateralTxId}
                      // disabled={true}
                      onChange={(e) => {
                        setReturnCollateralTxId(e.target.value);
                      }}
                      className="bg-white rounded-lg border border-gray-300 px-4 py-1 outline-none w-auto"
                    />
                  </div>
                  <button
                    onClick={() => handleReturnCollateral()}
                    className="bg-gradient-to-r from-grad-one via-grad-two to-grad-three text-primary border border-primary hover:scale-95 rounded-lg outline-none shadow-xl py-1 px-2 mt-2 md:ml-4 md:mt-auto"
                  >
                    Return
                  </button>
                </div>
              </div>
              {/* setColdWallet */}
              <div className="px-6 py-6 border border-gray-400 rounded-xl">
                <h6 className="text-xl font-medium">Set Cold Wallet</h6>
                <p className="text-gray-600 text-sm my-auto pb-2">
                  You can new cold wallet address here.
                </p>
                <div className="flex flex-col md:flex-row mb-4 w-full">
                  <div className="flex flex-col w-full">
                    <label className="text-xs text-gray-600 mb-1">
                      Wallet Address
                    </label>
                    <input
                      placeholder="0x012..."
                      value={coldWalletAddress}
                      onChange={(e) => {
                        setColdWalletAddress(e.target.value);
                      }}
                      className="bg-white rounded-lg border border-gray-300 px-4 py-1 outline-none w-auto"
                    />
                  </div>
                  <button
                    onClick={() => handleSetColdWallet()}
                    className="bg-gradient-to-r from-grad-one via-grad-two to-grad-three text-primary border border-primary hover:scale-95 rounded-lg outline-none shadow-xl py-1 px-2 mt-2 md:ml-4 md:mt-auto"
                  >
                    Set_Wallet
                  </button>
                </div>
              </div>
              {/* setInterestRates - incomplete */}
              <div className="px-6 py-6 border border-gray-400 rounded-xl">
                <h6 className="text-xl font-medium">Set Interest Rate</h6>
                <p className="text-gray-600 text-sm my-auto pb-2">
                  You can set new interest rates here (must be 6 comma
                  separated).
                </p>
                <div className="flex flex-col md:flex-row mb-4 w-full">
                  <div className="flex flex-col w-full">
                    <label className="text-xs text-gray-600 mb-1">
                      Rates 0.1, 1.5, 3, 4, 6, 8 etc
                    </label>
                    <input
                      placeholder="0.5,2,3,4,5,7"
                      value={interestRates}
                      onChange={(e) => {
                        setInterestRates(e.target.value);
                      }}
                      className="bg-white rounded-lg border border-gray-300 px-4 py-1 outline-none w-auto"
                    />
                  </div>
                  <button
                    onClick={() => handleSetInterestRates()}
                    className="bg-gradient-to-r from-grad-one via-grad-two to-grad-three text-primary border border-primary hover:scale-95 rounded-lg outline-none shadow-xl py-1 px-2 mt-2 md:ml-4 md:mt-auto"
                  >
                    Set_Rate
                  </button>
                </div>
                <h6 className="text-xl font-medium mt-4 mb-1">
                  Current Interest Rates
                </h6>
                <div className="flex items-center">
                  Annual Interest
                  <span className="mx-2">
                    <BsArrowRight />
                  </span>
                  {interestRateInfo.map((rate, key) => {
                    return (
                      <span key={"rate" + key}>
                        {parseInt(rate._hex, 16) / 100 + "%"},&nbsp;
                      </span>
                    );
                  })}
                </div>
              </div>
              {/* setPriceFeeds - incomplete */}
              <div className="px-6 py-6 border border-gray-400 rounded-xl">
                <h6 className="text-xl font-medium">Set Price Feeds</h6>
                <p className="text-gray-600 text-sm my-auto pb-2">
                  You can set new interest rates here (must be 6 comma
                  separated).
                </p>
                <div className="flex flex-col md:flex-row mb-4 w-full">
                  <div className="flex flex-col w-full">
                    <label className="text-xs text-gray-600 mb-1">
                      BTC Feed
                    </label>
                    <input
                      placeholder="Enter BTC Feed Address"
                      value={btcFeedAddress}
                      onChange={(e) => {
                        setBtcFeedAddress(e.target.value);
                      }}
                      className="bg-white rounded-lg border border-gray-300 px-4 py-1 outline-none w-auto mb-4"
                    />
                    <label className="text-xs text-gray-600 mb-1">
                      ETH Feed
                    </label>
                    <input
                      placeholder="Enter ETH Feed Address"
                      value={ethFeedAddress}
                      onChange={(e) => {
                        setEthFeedAddress(e.target.value);
                      }}
                      className="bg-white rounded-lg border border-gray-300 px-4 py-1 outline-none w-auto"
                    />
                  </div>
                  <button
                    onClick={() => handleSetPriceFeeds()}
                    className="bg-gradient-to-r from-grad-one via-grad-two to-grad-three text-primary border border-primary hover:scale-95 rounded-lg outline-none shadow-xl py-1 px-2 mt-2 md:ml-4 md:mt-auto"
                  >
                    Set_Price
                  </button>
                </div>
              </div>
              {/* setRefinanceFee */}
              <div className="px-6 py-6 border border-gray-400 rounded-xl">
                <h6 className="text-xl font-medium">Set Refinance Fee</h6>
                <p className="text-gray-600 text-sm my-auto pb-2">
                  You can set refinance fee here.
                </p>
                <div className="flex flex-col md:flex-row mb-4 w-full">
                  <div className="flex flex-col w-full">
                    <label className="text-xs text-gray-600 mb-1">
                      New Fee
                    </label>
                    <input
                      placeholder="0x012..."
                      value={refinanceFee}
                      onChange={(e) => {
                        setRefinanceFee(e.target.value);
                      }}
                      className="bg-white rounded-lg border border-gray-300 px-4 py-1 outline-none w-auto"
                    />
                  </div>
                  <button
                    onClick={() => handleSetRefinanceFee()}
                    className="bg-gradient-to-r from-grad-one via-grad-two to-grad-three text-primary border border-primary hover:scale-95 rounded-lg outline-none shadow-xl py-1 px-2 mt-2 md:ml-4 md:mt-auto"
                  >
                    Set_Fee
                  </button>
                </div>
              </div>
            </div>
            <h5 className="text-center text-3xl font-medium mt-12 mb-8">
              Withdraw Functions
            </h5>
            {/* Row 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gradient-to-r from-grad-one via-grad-two to-grad-three rounded-xl p-7 mx-3 md:mx-0  shadow-xl">
              {/* withdrawBtc */}
              <div className="px-6 py-6 border border-gray-400 rounded-xl">
                <h6 className="text-xl font-medium">Withdraw BTC</h6>
                <p className="text-gray-600 text-sm my-auto pb-2">
                  You can widthdraw BTC form here.
                </p>
                <div className="flex flex-col md:flex-row mb-4 w-full">
                  <div className="flex flex-col w-full">
                    <label className="text-xs text-gray-600 mb-1">Amount</label>
                    <input
                      placeholder="Enter BTC Amount"
                      value={withdrawBtcAmount}
                      onChange={(e) => {
                        setWithdrawBtcAmount(e.target.value);
                      }}
                      className="bg-white rounded-lg border border-gray-300 px-4 py-1 outline-none w-auto"
                    />
                  </div>
                  <button
                    onClick={() => handleWithdrawBtc()}
                    className="bg-gradient-to-r from-grad-one via-grad-two to-grad-three text-primary border border-primary hover:scale-95 rounded-lg outline-none shadow-xl py-1 px-2 mt-2 md:ml-4 md:mt-auto"
                  >
                    Widthdraw
                  </button>
                </div>
              </div>
              {/* withdrawEth */}
              <div className="px-6 py-6 border border-gray-400 rounded-xl">
                <h6 className="text-xl font-medium">Withdraw ETH</h6>
                <p className="text-gray-600 text-sm my-auto pb-2">
                  You can widthdraw ETH form here.
                </p>
                <div className="flex flex-col md:flex-row mb-4 w-full">
                  <div className="flex flex-col w-full">
                    <label className="text-xs text-gray-600 mb-1">Amount</label>
                    <input
                      placeholder="Enter ETH Amount"
                      value={withdrawEthAmount}
                      onChange={(e) => {
                        setWithdrawEthAmount(e.target.value);
                      }}
                      className="bg-white rounded-lg border border-gray-300 px-4 py-1 outline-none w-auto"
                    />
                  </div>
                  <button
                    onClick={() => handleWithdrawEth()}
                    className="bg-gradient-to-r from-grad-one via-grad-two to-grad-three text-primary border border-primary hover:scale-95 rounded-lg outline-none shadow-xl py-1 px-2 mt-2 md:ml-4 md:mt-auto"
                  >
                    Widthdraw
                  </button>
                </div>
              </div>
              {/* withdrawTokens */}
              <div className="px-6 py-6 border border-gray-400 rounded-xl">
                <h6 className="text-xl font-medium">Withdraw Tokens (AmerG)</h6>
                <p className="text-gray-600 text-sm my-auto pb-2">
                  You can widthdraw Tokens(AmerG) form here.
                </p>
                <div className="flex flex-col md:flex-row mb-4 w-full">
                  <div className="flex flex-col w-full">
                    <label className="text-xs text-gray-600 mb-1">Amount</label>
                    <input
                      placeholder="Enter AmerG Amount"
                      value={withdrawTokensAmount}
                      onChange={(e) => {
                        setWithdrawTokensAmount(e.target.value);
                      }}
                      className="bg-white rounded-lg border border-gray-300 px-4 py-1 outline-none w-auto"
                    />
                  </div>
                  <button
                    onClick={() => handleWithdrawTokens()}
                    className="bg-gradient-to-r from-grad-one via-grad-two to-grad-three text-primary border border-primary hover:scale-95 rounded-lg outline-none shadow-xl py-1 px-2 mt-2 md:ml-4 md:mt-auto"
                  >
                    Widthdraw
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </React.Fragment>
  );
}

export default ETHBoard;
