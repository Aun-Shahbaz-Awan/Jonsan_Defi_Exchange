import React from "react";
import { Button } from "./../components/utils/ConnectButton";
import { HiOutlineMenu } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";

function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <>
      <div className="p-3 md:p-5">
        <div className="flex justify-between items-center bg-white bg-opacity-40 backdrop-blur-sm border border-white border-opacity-50 shadow-[0_4px_30px_rgba(0,0,0,0.2)] rounded-xl p-3">
          <h4 className="font-bold pl-5 w-1/3">Exchange</h4>
          <div className="w-1/3 hidden md:flex justify-center">
            <div>
              <span className="mr-6 cursor-pointer">Borrow</span>
              <span className="mr-6 cursor-pointer">Earn</span>
              <span className="cursor-pointer">Assets</span>
            </div>
          </div>
          <div className="w-1/3 hidden md:flex justify-end">
            <Button />
          </div>
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="block md:hidden mr-3"
          >
            {isOpen ? <AiOutlineClose /> : <HiOutlineMenu />}
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {isOpen && (
        <div className="p-3">
          <div className="w-full flex justify-between items-center bg-white bg-opacity-40 backdrop-blur-sm border border-white border-opacity-50 shadow-[0_4px_30px_rgba(0,0,0,0.2)] rounded-xl p-3">
            <div className="text-center w-full my-3">
              <li className="list-none mb-3 cursor-pointer">Borrow</li>
              <li className="list-none mb-3 cursor-pointer">Earn</li>
              <li className="list-none mb-3 cursor-pointer">Assets</li>
              <span className="flex justify-center">
                <Button />
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
