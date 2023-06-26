<div align="center">
    <img src="https://github.com/1inch/farming/blob/master/.github/1inch_github_w.svg#gh-light-mode-only">
    <img src="https://github.com/1inch/farming/blob/master/.github/1inch_github_b.svg#gh-dark-mode-only">
</div>

# Merkle Distribution
[![Build Status](https://github.com/1inch/merkle-distribution/actions/workflows/test.yml/badge.svg)](https://github.com/1inch/merkle-distribution/actions)
[![Coverage Status](https://coveralls.io/repos/github/1inch/merkle-distribution/badge.svg?branch=master)](https://coveralls.io/github/1inch/merkle-distribution?branch=master)

Set of smart contracts for gas efficient merkle tree drops. 

## Sequential cumulative Merkle Tree drops

Each next Merkle Tree root replaces previous one and should contain cumulative balances of all the participants. Cumulative claimed amount is used as invalidation for every participant.

## Signature-based drop

Each entry of the drop contains private key which is used to sign the address of the receiver. This is done to safely distribute the drop and prevent MEV stealing.

## ZkBob Example
1. Add your zkAddresses in the `./scripts/prepare.js`
2. Run `yarn hardhat --network local run ./scripts/prepare.js`
3. Copy merkle root to the `./deploy/deploy-zkbob.js`
4. Fill token address, direct deposit queue address in the `./deploy/deploy-zkbob.js`
5. Run `yarn deploy local`
6. Send some tokens to the contract address
7. Copy the contract address, merkle root, zkAddress, and proof to the `./scripts/claim.js`
8. Run `yarn hardhat --network local run ./scripts/claim.js`
