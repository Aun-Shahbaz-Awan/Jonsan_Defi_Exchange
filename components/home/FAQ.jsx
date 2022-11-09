import React from "react";
import { BsArrowRight } from "react-icons/bs";

function FAQ() {
  return (
    <div className="text-primary my-12 max-w-6xl mx-auto">
      <h5 className="text-center text-2xl font-medium mb-8">
        Have some questions?
      </h5>
      <div className="grid grid-cols-1 md:grid-cols-2 mx-3 md:mx-0 gap-8">
        {/* Column 1 */}
        <div className="bg-gradient-to-br from-grad-one via-grad-two to-grad-three rounded-xl p-7">
          <h6 className="text-xl font-medium">Learn</h6>
          <p className="text-gray-600 text-sm mb-3 mt-1">
            Deep dive into oasis.app functionalities and glossary
          </p>
          <p className="flex items-center leading-8 font-medium cursor-pointer hover:gap-1">
            Get started
            <span className="ml-2">
              <BsArrowRight />
            </span>
          </p>
          <p className="flex items-center leading-8 font-medium cursor-pointer hover:gap-1">
            Tutorials
            <span className="ml-2">
              <BsArrowRight />
            </span>
          </p>
          <p className="flex items-center leading-8 font-medium cursor-pointer hover:gap-1">
            Key concepts
            <span className="ml-2">
              <BsArrowRight />
            </span>
          </p>
        </div>
        {/* Column 2 */}
        <div className="bg-gradient-to-tr from-grad-three via-grad-two to-grad-one rounded-xl px-6 py-6">
          <h6 className="text-xl font-medium">Support</h6>
          <p className="text-gray-600 text-sm mb-3 mt-1">
            Contact Oasis.app team whenever you need
          </p>
          <p className="flex items-center leading-8 font-medium cursor-pointer hover:gap-1">
            FAQ
            <span className="ml-2">
              <BsArrowRight />
            </span>
          </p>
          <p className="flex items-center leading-8 font-medium cursor-pointer hover:gap-1">
            Discord
            <span className="ml-2">
              <BsArrowRight />
            </span>
          </p>
          <p className="flex items-center leading-8 font-medium cursor-pointer hover:gap-1">
            Twitter
            <span className="ml-2">
              <BsArrowRight />
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default FAQ;
