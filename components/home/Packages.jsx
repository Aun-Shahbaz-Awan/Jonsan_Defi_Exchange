import React, { useState } from "react";
import { Tab } from "@headlessui/react";
import CategoryCard from "../utils/CategoryCard";
import { FaEthereum, FaBtc, FaPushed } from "react-icons/fa";

let categories = [
  "Borrow on Exchange",
  "Multiply on Exchange",
  "Earn on Exchange",
];
let categoryOneDetails = [
  {
    id: "multiple1",
    title: "Lowest ETH borrowing cost",
    description:
      "The stability fee and cheapest vault for borrowing using ETH",
    icon: FaEthereum,
    unit: "ETH",
    with: "119.00",
    upto: "150,000.00",
    MM: "4.33x",
    CLA: "25.64M",
    VAF: "3.00%",
    Protocol: "Maker (ETH-B)",
    button: "Borrow",

    bgColor: "bg-c_purple-light",
    cardColor: "bg-c_purple-dark",
  },
  {
    id: "multiple2",
    title: "Lowest BTC borrowing cost",
    description:
      "The biggest possible Multiple to maximize your exposure to BTC",
    icon: FaBtc,
    unit: "BTC",
    with: 116,
    upto: 502.28,
    MM: "4.33x",
    CLA: "25.64M",
    VAF: "3.00%",
    Protocol: "Maker (ETH-B)",
    button: "Borrow",

    bgColor: "bg-c_yellow-light",
    cardColor: "bg-c_yellow-dark",
  },
  // {
  //   id: "multiple3",
  //   title: "Lowest stETH borrowing cost",
  //   description:
  //     "Great for Borrowing or Multiplying while earning staking rewards",
  //   icon: FaPushed,
  //   unit: "WSTETH",
  //   with: 116,
  //   upto: 502.28,
  //   MM: "4.33x",
  //   CLA: "25.64M",
  //   VAF: "3.00%",
  //   Protocol: "Maker (ETH-B)",
  //   button: "Coming Soon",
  //   bgColor: "bg-c_blue-light",
  //   cardColor: "bg-c_blue-dark",
  // },
];
let categoryTwoDetails = [
  // {
  //   id: "multiple1",
  //   title: "Highest ETH multiple option",
  //   description:
  //     "The biggest possible Multiple to maximize your exposure to ETH",
  //   icon: FaEthereum,
  //   unit: "ETH",
  //   with: 116,
  //   upto: 502.28,
  //   MM: "4.33x",
  //   CLA: "25.64M",
  //   VAF: "3.00%",
  //   Protocol: "Maker (ETH-B)",
  //   button: "Coming Soon",
  //   bgColor: "bg-c_purple-light",
  //   cardColor: "bg-c_purple-dark",
  // },
  {
    id: "multiple2",
    title: "Highest wBTC multiple option",
    description:
      "The biggest possible Multiple to maximize your exposure to WBTC",
    icon: FaBtc,
    unit: "WBTC",
    with: 116,
    upto: 502.28,
    MM: "4.33x",
    CLA: "25.64M",
    VAF: "3.00%",
    Protocol: "Maker (ETH-B)",
    button: "Coming Soon",
    bgColor: "bg-c_yellow-light",
    cardColor: "bg-c_yellow-dark",
  },
  // {
  //   id: "multiple3",
  //   title: "StETH with medium cost and multiple",
  //   description:
  //     "Great for Borrowing or Multiplying while earning staking rewards",
  //   icon: FaPushed,
  //   unit: "WSTETH",
  //   with: 116,
  //   upto: 502.28,
  //   MM: "4.33x",
  //   CLA: "25.64M",
  //   VAF: "3.00%",
  //   Protocol: "Maker (ETH-B)",
  //   button: "Coming Soon",
  //   bgColor: "bg-c_blue-light",
  //   cardColor: "bg-c_blue-dark",
  // },
];
let categoryThreeDetails = [
  {
    id: "multiple1",
    title: "Highest ETH multiple option",
    description:
      "The biggest possible Multiple to maximize your exposure to ETH",
    icon: FaEthereum,
    unit: "ETH",
    with: 116,
    upto: 502.28,
    MM: "4.33x",
    CLA: "25.64M",
    VAF: "3.00%",
    Protocol: "Maker (ETH-B)",
    button: "Coming Soon",
    bgColor: "bg-c_purple-light",
    cardColor: "bg-c_purple-dark",
  },
  // {
  //   id: "multiple2",
  //   title: "Highest wBTC multiple option",
  //   description:
  //     "The biggest possible Multiple to maximize your exposure to WBTC",
  //   icon: FaBtc,
  //   unit: "WBTC",
  //   with: 116,
  //   upto: 502.28,
  //   MM: "4.33x",
  //   CLA: "25.64M",
  //   VAF: "3.00%",
  //   Protocol: "Maker (ETH-B)",
  //   button: "Coming Soon",
  //   bgColor: "bg-c_yellow-light",
  //   cardColor: "bg-c_yellow-dark",
  // },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Packages({ handlePackagesButton }) {
  return (
    <div className="w-full px-3 py-16 sm:px-0">
      <Tab.Group>
        <div className="max-w-lg mx-auto">
          <Tab.List className="flex space-x-1 rounded-full p-1 bg-secondary-light">
            {categories.map((category) => (
              <Tab
                key={category}
                className={({ selected }) =>
                  classNames(
                    "w-full rounded-full py-2.5 text-sm font-medium leading-5 text-primary",
                    selected
                      ? "bg-white shadow outline-none"
                      : "text-gray-600 hover:bg-white/[0.3] hover:text-gray-800"
                  )
                }
              >
                {category}
              </Tab>
            ))}
          </Tab.List>
        </div>
        {/* Panel */}
        <Tab.Panels className="mt-2">
          <Tab.Panel>
            <div className="text-gray-600 text-center max-w-2xl mx-auto my-10">
              Multiply your exposure to your favorite crypto assets. Browse our
              featured products here. See all Multiply collateral types →
            </div>
            <div
              className={`grid grid-cols-1 md:grid-cols-2 md:max-w-3xl gap-8 mx-auto`}
            >
              {categoryOneDetails.map((details, index) => (
                <CategoryCard
                  key={index}
                  data={details}
                  index={index}
                  handlePackagesButton={handlePackagesButton}
                />
              ))}
            </div>
          </Tab.Panel>
          <Tab.Panel>
            <div className="text-gray-600 text-center max-w-2xl mx-auto my-10">
              Borrow Dai against your favorite crypto assets. Use the Dai
              however you like. See all Borrow collateral types →
            </div>
            <div
              className={`grid grid-cols-1 md:grid-cols-1 md:max-w-sm gap-8 mx-auto`}
            >
              {categoryTwoDetails.map((details, index) => (
                <CategoryCard
                  key={index}
                  data={details}
                  index={index}
                  handlePackagesButton={handlePackagesButton}
                />
              ))}
            </div>
          </Tab.Panel>
          <Tab.Panel>
            <div className="text-gray-600 text-center max-w-xl md:max-w-2xl mx-auto my-10">
              Put your crypto assets to work today. Start generating the best
              yields. Select your Earn product below. Learn more about Earn →
            </div>
            <div
              className={`grid grid-cols-1 md:grid-cols-1 md:max-w-sm gap-8 mx-auto`}
            >
              {categoryThreeDetails.map((details, index) => (
                <CategoryCard
                  key={index}
                  data={details}
                  index={index}
                  handlePackagesButton={handlePackagesButton}
                />
              ))}
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
