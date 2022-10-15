import React from "react";
import { BsArrowRight } from "react-icons/bs";

function Hero() {
  return (
    <div className="flex flex-col items-center my-24 text-primary px-6">
      <button className="text-primary bg-white shadow-md rounded-full flex items-center">
        <div className="h-8 w-8 bg-primary rounded-full m-2"></div>
        <div className="pr-6 pl-1 py-3 flex items-center">
          Refer a Friend. Earn DAI today <BsArrowRight className="ml-3" />
        </div>
      </button>
      <h4 className="text-5xl text-primary text-center leading-[1.2] font-medium mt-10 mb-6">
        Deploy your crypto into DeFi
      </h4>
      <p className="text-secondary-dark max-w-xl text-center mb-10">
        Earn a yield, Multiply your exposure or Borrow against your crypto. ETH,
        BTC and 30 more cryptos available to put to work.
      </p>
      <button className="bg-primary text-white rounded-full py-3 px-6 flex items-center">
        See Products <BsArrowRight className="ml-3" />
      </button>
      <div className="mt-12 flex flex-wrap justify-center gap-8">
        <div className="flex justify-between items-center bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 shadow-[0_1px_5px_rgba(0,0,0,0.15)] rounded-full px-10 py-2">
          One
        </div>
        <div className="flex justify-between items-center bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 shadow-[0_1px_5px_rgba(0,0,0,0.15)] rounded-full px-10 py-2">
          Two
        </div>
        <div className="flex justify-between items-center bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 shadow-[0_1px_5px_rgba(0,0,0,0.15)] rounded-full px-10 py-2">
          Three
        </div>
        <div className="flex justify-between items-center bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 shadow-[0_1px_5px_rgba(0,0,0,0.15)] rounded-full px-10 py-2">
          Four
        </div>
        <div className="flex justify-between items-center bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 shadow-[0_1px_5px_rgba(0,0,0,0.15)] rounded-full px-10 py-2">
          Five
        </div>
      </div>
      <div className="w-full flex flex-col md:flex-row gap-6 items-center justify-between max-w-4xl mt-20">
        <div className="text-center">
          <p className="text-secondary-dark">30 Day Volume</p>
          <h4 className="text-4xl font-medium">$1.55B</h4>
        </div>
        <div className="text-center">
          <p className="text-secondary-dark">Managed on Oasis</p>
          <h4 className="text-4xl font-medium">$2.60B</h4>
        </div>
        <div className="text-center">
          <p className="text-secondary-dark">Median Vault</p>
          <h4 className="text-4xl font-medium">$99.62K</h4>
        </div>
      </div>
    </div>
  );
}

export default Hero;
