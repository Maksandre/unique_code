1. TN handles one distribution admin private key (APK)
2. When the user claims a reward (both welcome bonus or leaderboard reward) APK triggers simple transfer transaction using unique sdk https://docs.unique.network/build/sdk/v2/balances.html#transfer.
   1. No smart contracts involved: transaction status should be securely handled on the backend to protect against multiple claims or . Smart contract can provide some benefits as well as flaws and would make things more complicated
   2. Important: make sure to handle nonces correctly https://docs.unique.network/tutorials/mass-transactions.html
