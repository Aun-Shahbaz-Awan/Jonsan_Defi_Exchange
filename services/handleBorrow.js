import { ethers } from "ethers";
import { toast } from "react-toastify";

export const borrowFromETH = (
  vaultContract,
  categoryInfo,
  borrowInfo,
  collateral
) => {
  toast.promise(
    vaultContract
      ?.createVault(
        BigInt(
          (categoryInfo?.ETHRate * borrowInfo?.tokens * 1e18) /
            ((collateral + 1) / 100)
        ),
        {
          value: ethers.utils.parseEther(borrowInfo?.tokens.toString()),
        }
      )
      .then((tx) =>
        toast.promise(
          tx.wait().then((responce) => {
            console.log("Final Borrow Responce:", responce);
            toast.success("Borrow Successfully 🥳🎉🎊!");
          }),
          {
            pending: "Please wait borrow in process!",
            error: "Transction Rejected 😏💔",
          }
        )
      )
      .catch((error) => {
        console.log("Borrow Error:", error);
        toast.error(error?.message);
        toast.error(error?.error?.data?.message);
      }),
    {
      pending: "Waiting for Borrow Tx. to Accept!",
      error: "Transction Rejected 😏💔",
    }
  );
};

const handleBorrowFromBTC = (
  TWBTCVaultContract,
  categoryInfo,
  borrowInfo,
  collateral
) => {
  toast.promise(
    TWBTCVaultContract?.createVault(
      BigInt(borrowInfo?.tokens * 1e8),
      BigInt(
        (borrowInfo?.tokens * 1e18 * categoryInfo?.BTCRate) / (collateral / 100)
      )
    )
      .then((tx) =>
        toast.promise(
          tx.wait().then((responce) => {
            console.log("Final Responce:", responce);
            toast.success("Borrow Successfully 🥳🎉🎊!");
          }),
          {
            pending: "Please wait borrow in process!",
            error: "Transction Rejected 😏💔",
          }
        )
      )
      .catch((error) => {
        console.log("Borrow Error:", error);
        toast.error(error?.error?.data?.message);
        toast.error(error?.error?.message);
      }),
    {
      pending: "Step 2 of 2: Waiting for Borrow Tx. to Accept!",
      error: "Transction Rejected 😏💔",
    }
  );
};

export const borrowFromBTC = (
  TWBTCContract,
  TWBTCVaultContract,
  TWBTCVaultContractAddress,
  UserAddress,
  categoryInfo,
  borrowInfo,
  collateral
) => {
  TWBTCContract?.allowance(UserAddress, TWBTCVaultContractAddress)
    .then((responce) => {
      console.log("Borrow From BTC: Before IF!:", parseInt(responce._hex));
      console.log("Current Allowance:", BigInt(parseInt(responce._hex)));
      if (
        BigInt(parseInt(responce._hex)) <
        BigInt(parseInt(borrowInfo?.tokens * 1e8))
      ) {
        toast.promise(
          TWBTCContract?.approve(
            TWBTCVaultContractAddress,
            BigInt(parseInt(borrowInfo?.tokens * 1e8))
          )
            .then((tx) => {
              toast.promise(
                tx.wait().then((responce) => {
                  console.log("Welcome to Borrow: Approved!");
                  // ---------------------------------------------------------------- [ Now Borrow -> ]
                  handleBorrowFromBTC(
                    TWBTCVaultContract,
                    categoryInfo,
                    borrowInfo,
                    collateral
                  );
                  // ---------------------------------------------------------------- [ Now Borrow <- ]
                }),
                {
                  pending: "Please wait allowance in process!",
                  error: "Something wrong with Allowance 😏💔",
                }
              );
            })
            .catch((error) => {
              console.log("Approve Error:", error);
              toast.error(error?.error?.message);
            }),
          {
            pending: "Step 1 of 2: Waiting for Allowance Tx. to Accept!",
            error: "Something wrong with Borrow 😏💔",
          }
        );
      } else {
        handleBorrowFromBTC(
          TWBTCVaultContract,
          categoryInfo,
          borrowInfo,
          collateral
        );
      }
    })
    .catch((err) => console.log(err));
};
