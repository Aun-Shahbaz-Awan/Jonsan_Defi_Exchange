import React from "react";
import { BsArrowRight } from "react-icons/bs";
import { useAccount } from "wagmi";

export default function CategoryCard({ data, index, handlePackagesButton }) {
  const { isDisconnected } = useAccount();
  return (
    <div className={`${data?.bgColor} text-primary px-7 py-10 rounded-xl`}>
      {/* Heading */}
      <div className="flex justify-between">
        <div className="w-3/4">
          <h4 className="text-lg font-medium leading-6 mb-2">{data?.title}</h4>
          <p className="text-sm text-gray-600 leading-5">{data?.description}</p>
        </div>
        <div className="flex justify-center items-center bg-white rounded-full h-16 w-16">
          <data.icon className="text-3xl" />
        </div>
      </div>
      {/* Card */}
      <div
        className={`${data?.cardColor} px-2 py-4 my-8 rounded-xl text-center`}
      >
        <p className="text-gray-600">
          With {data?.with} {data?.unit} 👇
        </p>
        <p className="font-medium">
          Get up to {data?.upto} {data?.unit} exposure
        </p>
      </div>
      {/* Data */}
      <div className="px-2 my-10">
        <div className="flex justify-between text-sm mb-3">
          <span className="text-gray-600">Max Multiple</span>
          <span className="font-medium">{data?.MM}</span>
        </div>
        <div className="flex justify-between text-sm mb-3">
          <span className="text-gray-600">Current Liquidity Available</span>
          <span className="font-medium">{data?.CLA}</span>
        </div>
        <div className="flex justify-between text-sm mb-3">
          <span className="text-gray-600">Variable Annual Fee</span>
          <span className="font-medium">{data?.VAF}</span>
        </div>
        <div className="flex justify-between text-sm mb-3">
          <span className="text-gray-600">Protocol</span>
          <span className="font-medium">{data?.Protocol}</span>
        </div>
      </div>

      {/* Button */}
      {isDisconnected ? (
        <button className="flex justify-center items-center bg-primary text-white rounded-full py-2.5 px-auto w-full mt-8">
          Connect Wallet First
        </button>
      ) : (
        <button
          onClick={() => {
            handlePackagesButton(data?.button, index);
          }}
          disabled={data?.button === "Coming Soon"}
          className="flex justify-center items-center bg-primary text-white rounded-full py-2.5 px-auto w-full mt-8"
        >
          {data?.button} <BsArrowRight className="ml-3" />
        </button>
      )}
    </div>
  );
}
