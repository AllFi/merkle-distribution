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
    const zkAddresses = [
        "p64j5vtKm2SUFJbv3FkTZUb1aCRp4xcXk66v14Je7GZSpe5ZNqiJBHUtXC85Mr",
        "G3Wo7ERfGjT9h2b4xTEcW2dfQfJmiYDUVVtXKQUT8PEbjRCT59saRfTu6S58myi",
        "SHHvV4r1ojj7Aa3Zyo5sxadPxDZ62znjBXT8PdcPNtWGMzU5CvDPRW2RFwHUW3m",
        "3u9gjStCGJF453d9VqAy2JR8kPc1ysDK39wghL1SWXJJ8suBTRcKjYoZ71KUiRE",
        "GCuKF8oTem6e7bWMaURi6Fgkhy5fs2pMX5HSJD73xWvPwH15DRDBLdovRPfhayL",
        "P46CMrVKEVm5GBQmozHWiwfGxQDmQEPvJJHTmti6rDrP6mSKqxiBWhjjUggBDqi",
        "UPypV2D8Mb6vgqu33A1jPNZn9mwfQDWbq3PxndyCqUThtwAzkGfYE2aXRQL3Au3",
        "TJExto9rJZ2A1TxJkMw2Zbb9t6fmwRZXufmEj1tDM2nQLRw1rpVkVS53XtH5NfT",
        "KKNKVq7ys4ZYS43otiGt78ekG4Hhgzzo3PyaJskcMtRPX5jhhbNB7U41frDs3Q6",
        "EVW7K6NzpBaGCvGiTsaNsXTpJDLGbkaudUEHnQVrdGTAQr24cVExJKPgWC3ViUt"
    ];
    
    const accounts = zkAddresses.map((zkAddress) => `0x${Buffer.from(bs58.decode(zkAddress)).toString('hex')}`);
    const amounts = Array(10).fill().map((_) => '1000000000000000000');
    
    const drop = makeDrop(accounts, amounts);
    
    console.log(
        JSON.stringify({
            merkleRoot: drop.root,
            tokenTotal: amounts.map(toBN).reduce((a, b) => a.add(b), toBN('0')).toString(10),
            claims: zip(accounts, amounts).map(([w, amount], i) => ({
                wallet: zkAddresses[i],
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