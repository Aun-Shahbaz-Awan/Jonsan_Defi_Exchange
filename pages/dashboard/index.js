import React from "react";
import WBTCBoard from "../../components/dashboard/WBTCBoard";
import ETHBoard from "../../components/dashboard/ETHBoard";

function Index() {
  return (
    <React.Fragment>
      <ETHBoard />
      <WBTCBoard />
    </React.Fragment>
  );
}

export default Index;
