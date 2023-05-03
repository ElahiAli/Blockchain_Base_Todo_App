# Blockchain Base Todo App

This is a simple Todo list application built using Blockchain technology. The application allows users to add and edit their Todo tasks, which are stored on a decentralized Blockchain network. This ensures that the data is secure and cannot be tampered with.

## Features

- Add new tasks
- Edit existing tasks
- View all Todo tasks
- Securely store data on the Blockchain network

## Technologies Used

- Solidity
- Hardhat
- Etherscan
- sepolia

## Prerequisites

- Node.js
- Hardhat
- yarn

## Installation

1. Clone the repository:

```
git clone https://github.com/ElahiAli/Blockchain_Base_Todo_App.git
```

2. Install the dependencies:

```
cd Blockchain_Base_Todo_App
yarn add --dev yarn-install
```

3. Start the localhost Blockchain network:

```
yarn hardhat node
```

4. Compile the smart contracts:

```
yarn hardhat compile
```

5. Deploy the smart contracts on hardhat default netwrok , localhost and sepolia testnet :

```
yarn hardhat deploy
yarn hardhat deploy --network localhost
yarn hardhat deploy --network sepolia
```

6. Run all the test or only one:

```
yarn hardhat test
yarn hardaht test --grep "testName"
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
