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
  // console.log("Interest Rate:", parseInt(interestRates[0]?._hex, 16));
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
                      <span>GUSD</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>
                        Paying Amount <span className="text-red-500">*</span>
                      </span>
                      <span className="text-xs">
                        Account Interest:{" "}
                        {collateral >= 200 && collateral <= 500
                          ? parseInt(interestRates[0]?._hex, 16) / 100 + "%"
                          : collateral >= 190 && collateral < 200
                          ? parseInt(interestRates[1]?._hex, 16) / 100 + "%"
                          : collateral >= 170 && collateral < 190
                          ? parseInt(interestRates[2]?._hex, 16) / 100 + "%"
                          : collateral >= 150 && collateral < 170
                          ? parseInt(interestRates[3]?._hex, 16) / 100 + "%"
                          : collateral >= 130 && collateral < 150
                          ? parseInt(interestRates[4]?._hex, 16) / 100 + "%"
                          : collateral >= 120 && collateral < 130
                          ? parseInt(interestRates[5]?._hex, 16) / 100 + "%"
                          : "Invalid"}
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
                    <span className="text-right text-xs text-red-400 ml-1">
                      {borrowInfo?.tokens > 0 || borrowInfo?.tokens === 0 ? (
                        <span className="text-right text-xs text-gray-700">
                          You Will Get Estimated{" "}
                          {categoryInfo?.index === 0
                            ? (borrowInfo?.tokens * categoryInfo?.ETHRate) /
                              (collateral / 100)
                            : categoryInfo?.index === 1
                            ? (borrowInfo?.tokens * categoryInfo?.BTCRate) /
                              (collateral / 100)
                            : "Loading..."}
                          GUSD
                        </span>
                      ) : (
                        "Price must be greater then 1"
                      )}
                    </span>

                    <div className="flex justify-between items-center text-base pt-10 pb-3">
                      <span className="font-semibbold text-gray-600">
                        Collateral
                      </span>
                      <div className="flex items-center">
                        <span className="flex justify-end">
                          <input
                            type="number"
                            value={collateral}
                            onChange={(e) => setCollateral(e.target.value)}
                            onBlur={(e) => {
                              if (e.target.value < 120) setCollateral(120);
                              else if (e.target.value > 500) setCollateral(500);
                              else setCollateral(e.target.value);
                            }}
                            className={`w-7/12 text-sm outline-none rounded-full px-3 py-1 ${
                              collateral >= 120 && collateral <= 500
                                ? "border border-green-400"
                                : "border border-red-400"
                            }`}
                          />
                        </span>
                        <span className="ml-2">%</span>
                      </div>
                    </div>
                    <span className="py-3 text-sm text-gray-600 leading-3">
                      *Trade fee changes from buying price for every successfull
                      transition.
                    </span>
                    <div className="flex items-center py-2 px-3 mt-2 rounded-md text-sm bg-pink-200 shadow-lg opacity-50 text-pink-700">
                      <AiOutlineWarning className="text-3xl ml-1" />
                      <span className="pl-3">
                        * Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit.
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
                      Borrow GUSD
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
