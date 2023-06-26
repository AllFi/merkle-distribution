const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');
const fs = require('fs');
const { toBN } = require('../test/helpers/utils');

function findSortedIndex(self, h) {
    return self.leaves.indexOf(h);
}

function makeDrop(wallets, amounts) {
    const elements = wallets.map((w, i) => w + toBN(amounts[i]).toString(16, 64));
    const hashedElements = elements.map(keccak256).map(x => MerkleTree.bufferToHex(x));
    const tree = new MerkleTree(elements, keccak256, { hashLeaves: true, sort: true });
    const root = tree.getHexRoot();
    const leaves = tree.getHexLeaves();
    const proofs = leaves.map(tree.getHexProof, tree);  
    return { hashedElements, leaves, root, proofs };
}

const zip = (a, b) => a.map((k, i) => [k, b[i]]);
const w1 = "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1";
const accounts = Array(10).fill().map((_, i) => w1);
const amounts = Array(10).fill().map((_, i) => '1000000000000000000');
const drop = makeDrop(accounts, amounts);

console.log(
    JSON.stringify({
        merkleRoot: drop.root,
        tokenTotal: '0x' + amounts.map(toBN).reduce((a, b) => a.add(b), toBN('0')).toString(16),
        claims: zip(accounts, amounts).map(([w, amount]) => ({
            wallet: w,
            amount: '0x' + toBN(amount).toString(16),
            proof: drop.proofs[findSortedIndex(drop, MerkleTree.bufferToHex(keccak256(w + toBN(amount).toString(16, 64))))],
        })).reduce((a, { wallet, amount, proof }) => {
            a[wallet] = { amount, proof };
            return a;
        }, {}),
    }, null, 2),
);