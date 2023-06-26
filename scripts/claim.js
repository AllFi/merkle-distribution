const hre = require('hardhat');
const { getChainId, ethers } = hre;
const bs58 = require('bs58')

async function main() {
    let address = "0xFcCeD5E997E7fb1D0594518D3eD57245bB8ed17E";
    
    let zkAddress = "p64j5vtKm2SUFJbv3FkTZUb1aCRp4xcXk66v14Je7GZSpe5ZNqiJBHUtXC85Mr";;
    let account = `0x${Buffer.from(bs58.decode(zkAddress)).toString('hex')}`
    let root = "0xc1f080b7a112450a5f0315d551f24da621e3fef4562af52652ee7685c35d2c00";
    let proof = [
        "0xcdb59eb609d2de1a47d19afd978806186e36782287fb51e233c780f0e661b9b2",
        "0x47eee686a0ca7a6d4afdfd769aa650aebc79813868156d5595f72563b4768fb8",
        "0xd3c67eb07e2fafc81e26223c774a6cc12314599921545bcc295ac7de105b7807",
        "0x47eee686a0ca7a6d4afdfd769aa650aebc79813868156d5595f72563b4768fb8"
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