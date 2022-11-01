import React, { Fragment, useState } from "react";
import { BsArrowRight } from "react-icons/bs";
// Web 3
import { ethers } from "ethers";
import { useSigner, useAccount } from "wagmi";
import {
  GUSD_Address,
  TESTBNB_Address,
  TESTETH_Address,
  Exchange_Address,
} from "./../../contracts/Addresses";
import { Token_Abi, Exchange_Abi } from "../../contracts/Abis";
// Headless UI
import { Listbox, Transition } from "@headlessui/react";
import { BiCheck, BiChevronsDown } from "react-icons/bi";
// Toast
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Loader
import ScaleLoader from "react-spinners/ScaleLoader";

function Index() {
  const { data: signer } = useSigner();
  const { address } = useAccount();
  // Select BTC Id
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [BTCTxIds, setBTCTxIds] = React.useState([]);
  const [selectedTxId, setSelectedTxId] = useState(0);
  const [borrowInfo, setBorrowInfo] = useState([]);
  const [totalInterest, setTotalInterest] = useState(0);
  const [refinancePercentage, setRefinancePercentage] = useState(0);
  const [reimburseAmount, setReimburseAmount] = useState(0);

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

  const getBtcTxIds = () => {
    ExchangeContract.getBtcTxIds(address)
      .then((txIds) => {
        setBTCTxIds(txIds);
        setSelectedTxId(parseInt(txIds, 10));
        setIsLoaded(true);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };
  // Get Borrow Info =======================================>>>
  const getBorrowInfo = () => {
    ExchangeContract.getBorrowInfo(selectedTxId)
      .then((info) => {
        setBorrowInfo(info);
        // console.log("Borrow Info:", info);
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
  // useEffect =============================================>>>
  React.useEffect(() => {
    if (signer) getBtcTxIds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signer, address]);

  React.useEffect(() => {
    if (signer && selectedTxId) getBorrowInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTxId]);

  return (
    <React.Fragment>
      <ToastContainer />
      <div className="text-primary my-12 max-w-6xl mx-auto">
        <h5 className="text-center text-3xl font-medium mb-8">DASHBOARD</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 mx-3 md:mx-0 gap-8">
          {/* Column 1 */}
          <div className="bg-gradient-to-r from-grad-one via-grad-two to-grad-three rounded-xl p-7 shadow-xl">
            <div className="flex justify-between items-center">
              <h6 className="text-xl font-medium">Pay your BTC Interest</h6>
              <div className="w-20 ml-4">
                {isLoaded ? (
                  <Listbox value={selectedTxId} onChange={setSelectedTxId}>
                    <div className="relative border border-primary rounded-lg">
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
                                      selectedTxId
                                        ? "font-medium"
                                        : "font-normal"
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
                ) : (
                  <div className="flex justify-center">
                    <ScaleLoader size={20} />
                  </div>
                )}
              </div>
            </div>
            <p className="text-gray-600 text-sm my-auto py-2">
              Please Select One of the Transaction Id to Pay Its Interest.
            </p>
            <p className="flex items-center leading-8 font-medium cursor-pointer hover:gap-1">
              Total Borrowed GUST
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
              {isLoaded ? parseInt(borrowInfo[4], 10) + "%" : "Loading..."}
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

                <span className="ml-3">GUST</span>
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
                        " GUST Available)"
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
      </div>
    </React.Fragment>
  );
}

export default Index;
