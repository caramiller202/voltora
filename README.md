# Voltora – Decentralized Renewable Energy Trading Network

A blockchain-powered platform for peer-to-peer renewable energy trading using smart contracts, enabling tokenized energy exchange, fair pricing, and transparent settlement between producers and consumers.

---

## Overview

Voltora is composed of a modular suite of smart contracts designed to manage every aspect of decentralized energy trading. The system promotes green energy adoption by enabling microgrid participants to tokenize, list, trade, and settle surplus energy using secure and verifiable blockchain protocols.

### Smart Contract Modules

1. **Identity & Registration Contract** – Handles participant onboarding and KYC linkage
2. **Energy Tokenization Contract** – Converts generated energy into tradable digital assets
3. **Marketplace Listing Contract** – Facilitates energy offer creation and updates
4. **Trade Matching & Execution Contract** – Matches energy buyers and sellers
5. **Escrow & Settlement Contract** – Manages payments and secure delivery
6. **Reputation Tracking Contract** – Tracks user reliability and energy delivery history
7. **Dynamic Pricing Oracle Contract** – Integrates real-time pricing data
8. **Regulatory Compliance Contract** – Enforces legal and geographic rules
9. **Incentives & Rewards Contract** – Distributes staking rewards or rebates
10. **Dispute Resolution Contract** – Enables arbitration in case of trade conflicts

---

## Features

- Peer-to-peer renewable energy marketplace
- Tokenized kilowatt-hour (kWh) trading
- Transparent price discovery
- Automated escrow and payments
- Geographic compliance enforcement
- Green energy incentives
- Integrated reputation scoring
- Modular smart contract architecture

---

## Smart Contracts

### Identity & Registration Contract
- Links users with verified smart meters
- Enables KYC-compliant onboarding
- Assigns roles (producer/consumer/hybrid)

### Energy Tokenization Contract
- Converts energy (kWh) into fungible `E-Tokens`
- Embeds metadata: timestamp, location, source type
- Prevents double issuance

### Marketplace Listing Contract
- Allows producers to create energy offers
- Defines amount, rate, availability window
- Enables modification or cancellation

### Trade Matching & Execution Contract
- Matches offers and bids based on parameters
- Executes atomic swaps of tokens for energy
- Prevents front-running via batching logic

### Escrow & Settlement Contract
- Holds buyer funds during transaction
- Confirms energy delivery via oracle/meter
- Releases funds to seller post-verification

### Reputation Tracking Contract
- Tracks successful deliveries, disputes, delays
- Assigns reliability scores to participants
- Enables community trust-building

### Dynamic Pricing Oracle Contract
- Fetches external energy pricing data
- Suggests competitive bid/offer prices
- Can be updated with new trusted feeds

### Regulatory Compliance Contract
- Restricts trading to approved geographies
- Enforces local grid/utility rules
- Enables blacklisting of non-compliant actors

### Incentives & Rewards Contract
- Distributes rewards to eco-friendly producers
- Supports staking of `E-Tokens`
- Enables liquidity mining or rebate campaigns

### Dispute Resolution Contract
- Initiates arbitration flow for failed deliveries
- Allows submission of evidence (meter logs, timestamps)
- Governs refund or penalty logic

---

## Installation

1. Install Clarinet CLI  
2. Clone this repository  
3. Run tests: `npm run test`  

---

## Usage

Each smart contract in Voltora is modular and can be deployed independently based on your market structure or local regulations. Refer to individual contract documentation for specific deployment instructions and API schemas.

---

## Testing

Tests are written using Vitest and can be run using:

```bash
npm run test
```

## License

MIT License
