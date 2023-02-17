import React, { Fragment, useState } from "react";
import { BsArrowRight } from "react-icons/bs";
// Web 3
import { ethers } from "ethers";
import { useSigner, useAccount } from "wagmi";
import {
  AmerG_Address,
  BTCVault_Address,
  TWBTC_Address,
} from "./../../contracts/Addresses";
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
import { AmerG_ABI, BTC_Vault_ABI, TWBTC_ABI } from "../../contracts/AbisNew";

function WBTCBoard() {
  const { data: signer } = useSigner();
  const { address } = useAccount();
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [userVaults, setUserVaults] = React.useState([]);
  const [selectedVault, setSelectedVault] = React.useState(0);
  const [vaultInfo, setVaultInfo] = React.useState([]);
  const [totalInterest, setTotalInterest] = React.useState(0);
  const [interestRateInfo, setInterestRateInfo] = useState([]);
  const [refinancePercentage, setRefinancePercentage] = useState(0);
  const [reimburseAmount, setReimburseAmount] = useState(0);
  const [btcExchangeRate, setBtcExchangeRate] = useState(0);
  const [addWBTCAmount, setAddWBTCAmount] = useState(0);

  let AmerGContract,
    TWBTCContract,
    VaultContract = "";
  if (signer) {
    AmerGContract = new ethers.Contract(AmerG_Address, AmerG_ABI, signer);
    TWBTCContract = new ethers.Contract(TWBTC_Address, TWBTC_ABI, signer);
    VaultContract = new ethers.Contract(
      BTCVault_Address,
      BTC_Vault_ABI,
      signer
    );
  }
  // ______________________________________________________________________________ [ CALL ]
  const payInterest = () => {
    toast.promise(
      VaultContract?.payInterest(selectedVault)
        .then((tx) => {
          setIsLoaded(false);
          toast.promise(
            tx.wait().then((responce) => {
              console.log("Final Responce:", responce);
              getVaultInfo();
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
    AmerGContract?.allowance(address, BTCVault_Address)
      .then((responce) => {
        if (BigInt(parseInt(responce._hex)) < BigInt(totalInterest)) {
          toast.promise(
            AmerGContract?.approve(
              BTCVault_Address,
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
  // ============================================================ [ReFinance]
  const handleRefinance = () => {
    toast.promise(
      VaultContract?.refinance(selectedVault, refinancePercentage)
        .then((tx) => {
          setIsLoaded(false);
          toast.promise(
            tx.wait().then((responce) => {
              console.log("Refinance Responce:", responce);
              getVaultInfo();
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
          toast.error(error?.error?.message);
        }),
      {
        pending: "Waiting for Refinance Tx. to Accept!",
        error: "Transction Rejected 😏💔",
      }
    );
  };
  // Reimburse ================================================== [ReImburse]
  const reimburse = () => {
    toast.promise(
      VaultContract?.reimburse(selectedVault, BigInt(reimburseAmount * 1e18))
        .then((tx) => {
          setIsLoaded(false);
          toast.promise(
            tx.wait().then((responce) => {
              console.log("Reimburse Responce:", responce);
              getVaultInfo();
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
    AmerGContract?.allowance(address, BTCVault_Address)
      .then((responce) => {
        if (BigInt(parseInt(responce._hex)) < BigInt(reimburseAmount * 1e18)) {
          toast.promise(
            AmerGContract?.approve(
              BTCVault_Address,
              BigInt(parseInt(vaultInfo[0], 10))
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
  // Collateral ================================================= [Collateral]
  const handleWBTCDepositToVault = () => {
    toast.promise(
      VaultContract?.depositToVault(
        selectedVault,
        BigInt(addWBTCAmount * 1e8),
        BigInt(
          (addWBTCAmount * 1e18 * btcExchangeRate) /
            (parseInt(vaultInfo[2], 10) / 100)
        )
      )
        .then((tx) => {
          setIsLoaded(false);
          toast.promise(
            tx.wait().then((responce) => {
              setIsLoaded(true);
              console.log("Final Responce:", responce);
              toast.success("Borrow Successfully 🥳🎉🎊!");
            }),
            {
              pending: "Please wait borrow in process!",
              error: "Transction Rejected 😏💔",
            }
          );
        })
        .catch((error) => {
          console.log("Borrow Error:", error);
          toast.error(error?.error?.data?.message);
          toast.error(error?.error?.message);
        }),
      {
        pending: "Step 2 of 2: Waiting for Borrow Tx. to Accept!",
        error: "Transction Rejected 😏💔",
      }
    );
  };

  const handleDepositToVault = () => {
    TWBTCContract?.allowance(address, BTCVault_Address)
      .then((responce) => {
        console.log("Borrow From BTC: Before IF!:", parseInt(responce._hex));
        console.log("Current Allowance:", BigInt(parseInt(responce._hex)));
        if (
          BigInt(parseInt(responce._hex)) <
          BigInt(parseInt(addWBTCAmount * 1e8))
        ) {
          toast.promise(
            TWBTCContract?.approve(
              BTCVault_Address,
              BigInt(parseInt(addWBTCAmount * 1e8))
            )
              .then((tx) => {
                toast.promise(
                  tx.wait().then((responce) => {
                    console.log("Welcome to Borrow: Approved!");
                    // ---------------------------------------------------------------- [ Now Borrow -> ]
                    handleWBTCDepositToVault();
                    // ---------------------------------------------------------------- [ Now Borrow <- ]
                  }),
                  {
                    pending: "Please wait allowance in process!",
                    error: "Something wrong with Allowance 😏💔",
                  }
                );
              })
              .catch((error) => {
                console.log("Approve Error:", error);
                toast.error(error?.error?.message);
              }),
            {
              pending: "Step 1 of 2: Waiting for Allowance Tx. to Accept!",
              error: "Something wrong with Borrow 😏💔",
            }
          );
        } else {
          handleWBTCDepositToVault();
        }
      })
      .catch((err) => console.log(err));
  };
  // _________________________________ [Get All Vaults of User]
  const getAllVaults = () => {
    VaultContract.vaultsOf(address)
      .then((vaultIds) => {
        console.log("Vaults:", vaultIds);
        setUserVaults(vaultIds);
        setSelectedVault(parseInt(vaultIds, 10));
        setIsLoaded(true);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };
  // _________________________________ [Get Interest Rate   Info]
  const getInterestRateInfo = async () => {
    const i0 = await VaultContract.interestRates(0);
    const i1 = await VaultContract.interestRates(1);
    const i2 = await VaultContract.interestRates(2);
    const i3 = await VaultContract.interestRates(3);
    const i4 = await VaultContract.interestRates(4);
    const i5 = await VaultContract.interestRates(5);

    setInterestRateInfo([
      parseInt(i0._hex, 16),
      parseInt(i1._hex, 16),
      parseInt(i2._hex, 16),
      parseInt(i3._hex, 16),
      parseInt(i4._hex, 16),
      parseInt(i5._hex, 16),
    ]);
  };
  // _________________________________ [Get Selected Vaults Info]
  const getVaultInfo = () => {
    VaultContract.vaults(selectedVault)
      .then((info) => {
        console.log("Vault info:", info);
        setVaultInfo(info);
      })
      .catch((error) => {
        console.log("getBorrowInfo Error:", error);
      });

    VaultContract.totalInterest(selectedVault)
      .then((info) => {
        console.log("Total Interest:", info);
        setTotalInterest(parseInt(info._hex, 16));
      })
      .catch((error) => {
        console.log("getBorrowInfo Error:", error);
      });
    // _________ [Get Eth Exchange Rate]
    VaultContract.btcExchangeRate()
      .then((info) => {
        setBtcExchangeRate(parseInt(info._hex, 16));
      })
      .catch((error) => {
        console.log("getBorrowInfo Error:", error);
      });
    getInterestRateInfo();
  };

  // useEffect ______________________
  React.useEffect(() => {
    if (signer) getAllVaults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signer, address]);

  React.useEffect(() => {
    if (signer) getVaultInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVault]);

  return (
    <React.Fragment>
      <ToastContainer />
      <div className="text-primary my-12 max-w-6xl mx-auto">
        {/* <h5 className="text-center text-3xl font-medium mb-8">DASHBOARD</h5> */}
        <div className="grid grid-cols-1 md:grid-cols-2 mx-3 md:mx-0 gap-8">
          {/* Column 1 */}
          <div className="bg-gradient-to-r from-[#FDD34D] via-[#FDD34D] to-[#FDD34D] rounded-xl p-7 shadow-xl">
            <div className="flex justify-between items-center mb-3">
              <h6 className="text-xl font-medium">Pay your WBTC Interest</h6>
              <div className="w-24 ml-4">
                {isLoaded ? (
                  <Tab.Group>
                    <Tab.List className="flex space-x-1 rounded-full p-1 bg-secondary-light">
                      <Tab
                        key="BTC"
                        className="w-full rounded-full py-1 text-xs font-medium leading-5 text-primary bg-white shadow outline-none "
                      >
                        WBTC
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
                Please Select One of the Vault Id to Pay Its Interest.
              </p>
              <Listbox value={selectedVault} onChange={setSelectedVault}>
                <div className="relative border border-primary rounded-lg w-3/12">
                  <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                    <span className="block truncate">{selectedVault}</span>
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
                      {userVaults.map((vaultsId, index) => (
                        <Listbox.Option
                          key={index}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active
                                ? "bg-amber-100 text-amber-900"
                                : "text-gray-900"
                            }`
                          }
                          value={parseInt(vaultsId, 10)}
                        >
                          {({ selectedVault }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selectedVault ? "font-medium" : "font-normal"
                                }`}
                              >
                                {parseInt(vaultsId, 10)}
                              </span>
                              {selectedVault ? (
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
              {isLoaded ? parseInt(vaultInfo[0], 10) / 1e18 : "Loading..."}
            </p>
            <p className="flex items-center leading-8 font-medium cursor-pointer hover:gap-1">
              Borrowed From
              <span className="mx-2">
                <BsArrowRight />
              </span>
              {isLoaded
                ? parseInt(vaultInfo[1], 10) / 1e8 + " WBTC"
                : "Loading..."}
            </p>
            <p className="flex items-center leading-8 font-medium cursor-pointer hover:gap-1">
              Collateral Percentage
              <span className="mx-2">
                <BsArrowRight />
              </span>
              {isLoaded ? parseInt(vaultInfo[2], 10) + "%" : "Loading..."}
            </p>
            <p className="flex items-center leading-8 font-medium cursor-pointer hover:gap-1">
              Last Paid On
              <span className="mx-2">
                <BsArrowRight />
              </span>
              {isLoaded
                ? new Date(parseInt(vaultInfo[3], 10) * 1000).toDateString() +
                  " - " +
                  new Date(
                    parseInt(vaultInfo[3], 10) * 1000
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
                ? parseInt(vaultInfo[2], 10) >= 401 &&
                  parseInt(vaultInfo[2], 10) <= 500
                  ? parseInt(interestRateInfo[0], 10) / 100 + "%"
                  : parseInt(vaultInfo[2], 10) >= 301 &&
                    parseInt(vaultInfo[2], 10) < 401
                  ? parseInt(interestRateInfo[1], 10) / 100 + "%"
                  : parseInt(vaultInfo[2], 10) >= 251 &&
                    parseInt(vaultInfo[2], 10) <= 301
                  ? parseInt(interestRateInfo[2], 10) / 100 + "%"
                  : parseInt(vaultInfo[2], 10) >= 201 &&
                    parseInt(vaultInfo[2], 10) < 251
                  ? parseInt(interestRateInfo[3], 10) / 100 + "%"
                  : parseInt(vaultInfo[2], 10) >= 171 &&
                    parseInt(vaultInfo[2], 10) <= 201
                  ? parseInt(interestRateInfo[4], 10) / 100 + "%"
                  : parseInt(vaultInfo[2], 10) >= 120 &&
                    parseInt(vaultInfo[2], 10) <= 171
                  ? parseInt(interestRateInfo[5], 10) / 100 + "%"
                  : "Invalid Collateral"
                : "Loading..."}
            </p>
            <div className="flex flex-col md:flex-row items-center md:justify-between leading-8 mt-4 font-medium cursor-pointer hover:gap-1">
              <div>
                <h3 className="text-xs ml-1 mb-0.5">Acumulated Interest</h3>
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
            {/* Column 2.0 */}
            <div className="bg-gradient-to-r from-grad-three via-grad-two to-grad-one rounded-xl px-6 py-6 mb-8 shadow-xl">
              {/* Collateral */}
              <h6 className="text-xl font-medium">Collateral</h6>
              <p className="text-gray-600 text-sm my-auto pb-2">
                You can add more collateral into existing vault.
              </p>

              <div className="flex flex-col md:flex-row mb-4 w-full">
                <div className="flex flex-col mr-4">
                  <label className="text-xs text-gray-600 mb-1">Vault ID</label>
                  <input
                    value={selectedVault}
                    disabled={true}
                    className="bg-white rounded-lg border border-gray-300 px-4 py-1 outline-none w-20"
                  />
                </div>
                <div className="flex flex-col w-full">
                  <label className="text-xs text-gray-600 mb-1">
                    You will get estimated:{" "}
                    <span className="font-medium text-green-700">
                      {" "}
                      {parseFloat(
                        (btcExchangeRate * addWBTCAmount) /
                          (parseInt(vaultInfo[2], 10) / 100)
                      ).toFixed(2)}{" "}
                      AmerG
                    </span>
                  </label>
                  <input
                    placeholder="Enter WBTC Value"
                    value={addWBTCAmount}
                    // disabled={true}
                    onChange={(e) => {
                      setAddWBTCAmount(e.target.value);
                    }}
                    className="bg-white rounded-lg border border-gray-300 px-4 py-1 outline-none w-auto"
                  />
                </div>
                <button
                  onClick={() => handleDepositToVault()}
                  className="bg-gradient-to-r from-grad-three via-grad-two to-grad-one text-primary border border-primary hover:scale-95 rounded-lg outline-none shadow-xl min-w-[6rem] py-1 px-2 mt-2 md:ml-4 md:mt-auto"
                >
                  Add
                </button>
              </div>
            </div>
            {/* Column 2.1 */}
            <div className="bg-gradient-to-r from-grad-three via-grad-two to-grad-one rounded-xl px-6 py-6 mb-8 shadow-xl">
              {/* Refinance */}
              <h6 className="text-xl font-medium">Refinance</h6>
              <p className="text-gray-600 text-sm my-auto pb-2">
                You can refinance the collateral between 120% to 500%.
              </p>
              <div className="flex flex-col md:flex-row mb-4 w-full">
                <div className="flex flex-col mr-4">
                  <label className="text-xs text-gray-600 mb-1">Vault ID</label>
                  <input
                    value={selectedVault}
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
                  className="bg-gradient-to-r from-grad-one via-grad-two to-grad-three text-primary border border-primary hover:scale-95 rounded-lg outline-none shadow-xl min-w-[6rem]  py-1 px-2 mt-2 md:ml-4 md:mt-auto"
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
                  <label className="text-xs text-gray-600 mb-1">Vault ID</label>
                  <input
                    value={selectedVault}
                    disabled={true}
                    className="bg-white rounded-lg border border-gray-300 px-4 py-1 outline-none w-20"
                  />
                </div>
                <div className="flex flex-col w-full">
                  <label className="text-xs text-gray-600 mb-1">
                    Amount{" "}
                    {isLoaded
                      ? "(" +
                        parseInt(vaultInfo[0], 10) / 1e18 +
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
                  className="bg-gradient-to-r from-grad-one via-grad-two to-grad-three text-primary border border-primary hover:scale-95 rounded-lg outline-none shadow-xl min-w-[6rem]  py-1 px-2 mt-2 md:ml-4 md:mt-auto"
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

export default WBTCBoard;
