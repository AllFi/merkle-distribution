const hre = require('hardhat');
const { getChainId, ethers } = hre;

module.exports = async ({ deployments, getNamedAccounts }) => {
    console.log('running deploy script');
    console.log('network id ', await getChainId());

    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    console.log(`deployer: ${deployer}`);

    const tokenAddress = '0xCfEB869F69431e42cdB54A4F4f105C19C080A601';
    const directDepositAddress = '0x9b1f7F645351AF3631a656421eD2e40f2802E6c0'
    const merkleRoot = '0x9a2052debb5177d96dbb4f8e1d8a69ad2c92739bc6723dcb9a849f192bbf0037'
    
    const args = [tokenAddress, directDepositAddress];
    const merkleDrop = await deploy('CumulativeMerkleDropZkBob', {
        from: deployer,
        args,
        skipIfAlreadyDeployed: true,
        maxFeePerGas: 100000000000,
        maxPriorityFeePerGas: 2000000000,
    });

    const CumulativeMerkleDrop = await ethers.getContractFactory('CumulativeMerkleDrop');
    const cumulativeMerkleDrop = CumulativeMerkleDrop.attach(merkleDrop.address);

    const txn = await cumulativeMerkleDrop.setMerkleRoot(
        merkleRoot,
        {
            maxFeePerGas: 100000000000,
            maxPriorityFeePerGas: 2000000000,
        },
    );
    await txn;

    console.log('CumulativeMerkleDropZkBob deployed to:', merkleDrop.address);

    if (await getChainId() !== '31337') {
        await hre.run('verify:verify', {
            address: merkleDrop.address,
            constructorArguments: args,
        });
    }
};
