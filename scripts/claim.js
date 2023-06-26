const hre = require('hardhat');
const { getChainId, ethers } = hre;

async function main() {
    let address = "0xD86C8F0327494034F60e25074420BcCF560D5610";
    
    let account = "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1";
    let root = "0x8c51757e9e9e063c40ea6be00b7eb030548d3e4b04e0804758260a45f9886e34";
    let proof = [
        "0xae8f1cb988dec5621d364f98f5a3af9345ee70a6932e9800854ea4a3969b6e7c",
        "0x69278580d530cffe3c681b0cadd224a333e6b4f860417aee7b1b8a198448bc1b",
        "0x1f3c430f4dc8df5507aa4fd0c658905403a43a25eb1726814be91433bc2b551a",
        "0x69278580d530cffe3c681b0cadd224a333e6b4f860417aee7b1b8a198448bc1b"
      ];
    
    console.log(`Chain Id: ${await getChainId()}`);
    const CumulativeMerkleDrop = await ethers.getContractFactory('CumulativeMerkleDrop');
    const contract = CumulativeMerkleDrop.attach(address);

    console.log(`Merkle Root: ${await contract.merkleRoot()}`);
    console.log(await contract.token());

    contract.claim(account, "1000000000000000000", root, proof).then(() => console.log("claimed"));
}
  
main().then(() => {
    process.exitCode = 0;
}).catch((error) => {
    console.error(error);
    process.exitCode = 1;
});