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
}) {
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
                        ? "ETH Price: " + categoryInfo?.tokenRate
                        : categoryInfo?.index === 1
                        ? "BTC Price: " + categoryInfo?.tokenRate
                        : "---"}
                    </span>
                    <div className="flex justify-between items-center text-base pt-10 pb-3">
                      <span className="font-semibbold text-gray-600">
                        Token
                      </span>
                      <span>GUSD</span>
                    </div>
                    <span>
                      Paying Amount <span className="text-red-500">*</span>
                    </span>
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
                      <span className="pr-4">TESTBNB</span>
                    </div>
                    <span className="text-right text-xs text-red-400 ml-1">
                      {borrowInfo?.tokens > 0 || borrowInfo?.tokens === 0 ? (
                        <span className="text-right text-xs text-gray-700">
                          You Will Get Estimated{" "}
                          {(borrowInfo?.tokens * categoryInfo?.tokenRate) /
                            1.25} GUSD
                        </span>
                      ) : (
                        "Price must be greater then 1"
                      )}
                    </span>

                    <div className="flex justify-between items-center text-base pt-10 pb-3">
                      <span className="font-semibbold text-gray-600">
                        Collateral
                      </span>
                      <span>125%</span>
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
