import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
// import { ethers } from "ethers";
import { FaRegTimesCircle } from "react-icons/fa";
import { AiOutlineWarning } from "react-icons/ai";

export default function BorrowTokenPopup({
  borrowInfo,
  setBorrowInfo,
  categoryInfo,
  handlePackagePopupButton,
  interestRates,
  collateral,
  setCollateral,
}) {
  // console.log("colletral rate:", collateral);
  return (
    <>
      <Transition appear show={borrowInfo?.openStatus} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() =>
            setBorrowInfo((borrowInfo) => ({
              ...borrowInfo,
              openStatus: false,
            }))
          }
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-400 bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="bg-gradient-to-t from-grad-one via-grad-two to-grad-three w-full max-w-md transform overflow-hidden rounded-2xl p-7 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    onClick={() =>
                      setBorrowInfo((borrowInfo) => ({
                        ...borrowInfo,
                        openStatus: false,
                      }))
                    }
                    className="text-2xl font-semibold leading-6 flex items-center justify-between"
                  >
                    <span>Borrow Tokens</span>
                    <span className="cursor-pointer">
                      <FaRegTimesCircle />
                    </span>
                  </Dialog.Title>
                  <div className="mt-2">
                    <span className="py-0.5 px-2 bg-gray-300 text-sm font-medium rounded-lg">
                      {categoryInfo?.index === 0
                        ? "ETH Price: " +
                          (categoryInfo?.ETHRate
                            ? categoryInfo?.ETHRate
                            : "Loading...")
                        : categoryInfo?.index === 1
                        ? "BTC Price: " +
                          (categoryInfo?.BTCRate
                            ? categoryInfo?.BTCRate
                            : "Loading...")
                        : "---"}
                    </span>
                    <div className="flex justify-between items-center text-base pt-10 pb-3">
                      <span className="font-semibbold text-gray-600">
                        Token
                      </span>
                      <span>AmerG</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>
                        Paying Amount <span className="text-red-500">*</span>
                      </span>
                    </div>

                    <div className="flex justify-between items-center border border-gray-400 rounded-lg mt-1">
                      <input
                        value={borrowInfo?.token}
                        type="number"
                        onChange={(e) => {
                          setBorrowInfo((borrowInfo) => ({
                            ...borrowInfo,
                            tokens: e.target.value,
                          }));
                        }}
                        className="bg-transparent w-full text-lg py-2 px-4 outline-none"
                      />
                      <span className="pr-4">
                        {" "}
                        {categoryInfo?.index === 0 ? "TESTETH" : "TESTBTC"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-base pt-6 px-1">
                      <span className="font-semibbold text-sm text-gray-600">
                        Collateral
                      </span>
                      <div
                        className={`flex items-center bg-white rounded-full w-4/12  ${
                          collateral >= 120 && collateral <= 500
                            ? "border border-green-400"
                            : "border border-red-400"
                        }`}
                      >
                        <input
                          type="number"
                          value={collateral}
                          onChange={(e) =>
                            setCollateral(parseInt(e.target.value))
                          }
                          onBlur={(e) => {
                            if (e.target.value < 120) setCollateral(120);
                            else if (e.target.value > 500) setCollateral(500);
                            else {
                              setCollateral(parseInt(e.target.value));
                              console.log("Value: ", Number(e.target.value));
                            }
                          }}
                          className={`w-full text-sm outline-none rounded-full px-3 py-1 
            
                          `}
                        />
                        <span className="mx-3">%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm pt-2 pb-4 px-1">
                      <span className="font-semibbold text-gray-600">
                        Account Interest
                      </span>
                      <div className="flex items-center">
                        {collateral >= 401 && collateral <= 500
                          ? interestRates[0] + "%"
                          : collateral >= 301 && collateral < 401
                          ? interestRates[1] + "%"
                          : collateral >= 251 && collateral < 301
                          ? interestRates[2] + "%"
                          : collateral >= 201 && collateral < 251
                          ? interestRates[3] + "%"
                          : collateral >= 171 && collateral < 201
                          ? interestRates[4] + "%"
                          : collateral >= 120 && collateral < 171
                          ? interestRates[5] + "%"
                          : "Invalid"}
                      </div>
                    </div>
                    <span className="py-3 text-sm text-gray-600 leading-3">
                      *Trade fee changes from buying price for every successfull
                      transition.
                    </span>
                    <div className="flex items-center justify-between py-2 px-2 mt-2 rounded-md text-sm bg-pink-200 shadow-lg opacity-50 text-pink-900">
                      <div className="flex items-center ">
                        <AiOutlineWarning className="text-3xl ml-1" />
                        <span className="pl-3">* You Will Get Estimated</span>
                      </div>
                      <span className="bg-white text-black py-1 px-2 rounded-md shadow-lg">
                        {" "}
                        {categoryInfo?.index === 0
                          ? (borrowInfo?.tokens * categoryInfo?.ETHRate) /
                            (collateral / 100)
                          : categoryInfo?.index === 1
                          ? (borrowInfo?.tokens * categoryInfo?.BTCRate) /
                            (collateral / 100)
                          : "Loading..."}{" "}
                        AmerG
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end items-center">
                    <button
                      type="button"
                      placeholder="Enter Listing Price in Ethereum"
                      className="inline-flex justify-center rounded-lg mr-4 bg-transparent px-8 py-2 text-md font-medium text-gray-600 border border-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => {
                        setBorrowInfo((borrowInfo) => ({
                          ...borrowInfo,
                          openStatus: false,
                        }));
                      }}
                    >
                      Cancle
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-lg border border-transparent bg-green-400 text-green-900 disabled:bg-red-400 disabled:text-red-900 px-8 py-2 text-md font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      disabled={borrowInfo?.tokens <= 0}
                      onClick={() => {
                        handlePackagePopupButton();
                        setBorrowInfo((borrowInfo) => ({
                          ...borrowInfo,
                          openStatus: false,
                        }));
                      }}
                    >
                      Borrow AmerG
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
