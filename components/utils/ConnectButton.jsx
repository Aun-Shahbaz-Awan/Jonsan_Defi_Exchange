import { ConnectButton } from "@rainbow-me/rainbowkit";
import { RiArrowDropDownLine } from "react-icons/ri";

export const Button = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");
        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="flex items-center font-medium bg-gradient-to-r from-grad-one via-grad-two to-grad-three rounded-xl shadow-md py-2 px-4"
                  >
                    Connect Wallet
                  </button>
                );
              }
              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="border border-red-500 bg-red-200 py-1.5 px-6 rounded-xl"
                  >
                    Wrong network
                  </button>
                );
              }
              return (
                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    onClick={openChainModal}
                    style={{ display: "flex", alignItems: "center" }}
                    type="button"
                    className="flex items-center bg-gradient-to-r from-grad-one via-grad-two to-grad-three rounded-xl shadow-md py-1 px-4"
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 16,
                          height: 16,
                          borderRadius: 999,
                          overflow: "hidden",
                          marginRight: 8,
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? "Chain icon"}
                            src={chain.iconUrl}
                            style={{ width: 16, height: 16 }}
                          />
                        )}
                      </div>
                    )}
                    <span className="flex items-center font-medium">
                      <span className="hidden md:block">{chain.name}</span>
                      <RiArrowDropDownLine className="text-2xl" />
                    </span>
                  </button>
                  <button
                    onClick={openAccountModal}
                    type="button"
                    className="flex items-center font-medium bg-gradient-to-r from-grad-one via-grad-two to-grad-three rounded-xl shadow-md py-1 px-4"
                  >
                    {account.displayBalance ? ` ${account.displayBalance}` : ""}
                    <span className="border-l-2 border-white rounded-lg py-1 pl-4 ml-3 flex items-center">
                      {account.displayName}
                      <RiArrowDropDownLine className="text-2xl" />
                    </span>
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
