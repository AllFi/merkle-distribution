const hre = require('hardhat');
const { getChainId, ethers } = hre;
const bs58 = require('bs58')

async function main() {
    let contractAddress = "0x5017A545b09ab9a30499DE7F431DF0855bCb7275";

    let zkAddressRaw = "KKNKVq7ys4ZYS43otiGt78ekG4Hhgzzo3PyaJskcMtRPX5jhhbNB7U41frDs3Q6";;
    let zkAddress = `0x${Buffer.from(bs58.decode(zkAddressRaw)).toString('hex')}`
    let account = "0x1dF62f291b2E969fB0849d99D9Ce41e2F137006e";
    let root = "0x9a2052debb5177d96dbb4f8e1d8a69ad2c92739bc6723dcb9a849f192bbf0037";
    let proof = [
        "0x642badbcdb6b83600785e620465d6902ced85d6aadf83a125f5240ee929ac4ff",
        "0x76c729327d4b29ca3bc9f40fba3c7f6e08b0d022905946fbb57f2ad211603c90",
        "0xbb1435bd8d3bfa30dfb76805731d6f2c2a54e5ab34102ee282863ccaf9622708",
        "0xe3775a65410ce6779b447a5e52e390dd0b26fe5b00d4de4bc8f832a48259f58b"
      ];
    const CumulativeMerkleDrop = await ethers.getContractFactory('CumulativeMerkleDropZkBob');
    const contract = CumulativeMerkleDrop.attach(contractAddress);

    contract.claim(zkAddress, account, "1000000000000000000", root, proof).then(() => console.log("claimed"));
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});