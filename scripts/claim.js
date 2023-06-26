const hre = require('hardhat');
const { getChainId, ethers } = hre;
const bs58 = require('bs58')

async function main() {
    let contractAddress = "0xdC78afe9cFDe0576Ff236667DC8c380615c24Ca9";

    let zkAddress = "KKNKVq7ys4ZYS43otiGt78ekG4Hhgzzo3PyaJskcMtRPX5jhhbNB7U41frDs3Q6";;
    let account = `0x${Buffer.from(bs58.decode(zkAddress)).toString('hex')}`
    let root = "0x6dfc5f949d11531804a4943ff73c7719128eee6612d89654dc5a49121b56c07d";
    let proof = [
        "0x829ef3ccd439d97584118fd1e6a91be6cbfd5bb0a9acd64404e38c7881f33149",
        "0xc9b4e9da3c3e98150d5672ea9f8051906590709e884bdf1664f6bc18f3d06149",
        "0xf721f4a0b9d2a9f13c15234fa6ef98d96fb5f00562e757138fd6b8d8048c60c9",
        "0xb79d1b18e5aa09bbe1e0c0f9f21312767096c548f3503107fd6574aed7e774bd"
    ];
    const CumulativeMerkleDrop = await ethers.getContractFactory('CumulativeMerkleDropZkBob');
    const contract = CumulativeMerkleDrop.attach(contractAddress);

    contract.claim(account, "1000000000000000000", root, proof).then(() => console.log("claimed"));
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});