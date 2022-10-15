import React from "react";
import {Button} from "./../components/utils/ConnectButton";
// import { ConnectButton } from "@rainbow-me/rainbowkit";

function Navbar() {
  return (
    <div className="p-5">
      <div className="flex justify-between items-center bg-white bg-opacity-40 backdrop-blur-sm border border-white border-opacity-50 shadow-[0_4px_30px_rgba(0,0,0,0.2)] rounded-xl p-3">
        <h4 className="font-bold pl-5 w-1/3">Exchange</h4>
        <div className="w-1/3 flex justify-center">
          <div>
            <span className="mr-6">Borrow</span>
            <span className="mr-6">Earn</span>
            <span className="">Assets</span>
          </div>
        </div>
        <div className="w-1/3 flex justify-end">
          {/* <ConnectButton /> */}
          <Button />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
