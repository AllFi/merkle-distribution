const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');
const { toBN } = require('../test/helpers/utils');
const bs58 = require('bs58')

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

async function main() {
    const zip = (a, b) => a.map((k, i) => [k, b[i]]);
    const accounts = [
        "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1",
        "0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0",
        "0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b",
        "0xE11BA2b4D45Eaed5996Cd0823791E0C93114882d",
        "0xd03ea8624C8C5987235048901fB614fDcA89b117",
        "0x95cED938F7991cd0dFcb48F0a06a40FA1aF46EBC",
        "0x3E5e9111Ae8eB78Fe1CC3bb8915d5D461F3Ef9A9",
        "0x28a8746e75304c0780E011BEd21C72cD78cd535E",
        "0xACa94ef8bD5ffEE41947b4585a84BdA5a3d3DA6E",
        "0x1dF62f291b2E969fB0849d99D9Ce41e2F137006e"
    ];
    
    const amounts = Array(10).fill().map((_) => '1000000000000000000');
    
    const drop = makeDrop(accounts, amounts);
    
    console.log(
        JSON.stringify({
            merkleRoot: drop.root,
            tokenTotal: amounts.map(toBN).reduce((a, b) => a.add(b), toBN('0')).toString(10),
            claims: zip(accounts, amounts).map(([w, amount], i) => ({
                wallet: accounts[i],
                amount: amount,
                proof: drop.proofs[findSortedIndex(drop, MerkleTree.bufferToHex(keccak256(w + toBN(amount).toString(16, 64))))],
            })).reduce((a, { wallet, amount, proof }) => {
                a[wallet] = { amount, proof };
                return a;
            }, {}),
        }, null, 2),
    );
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});