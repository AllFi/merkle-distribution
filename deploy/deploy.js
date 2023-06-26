const hre = require('hardhat');
const { getChainId, ethers } = hre;

module.exports = async ({ deployments, getNamedAccounts }) => {
    console.log('running deploy script');
    console.log('network id ', await getChainId());

    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    console.log(`deployer: ${deployer}`);

    const args = ['0xCfEB869F69431e42cdB54A4F4f105C19C080A601'];

    const merkleDrop = await deploy('CumulativeMerkleDrop', {
        from: deployer,
        args,
        skipIfAlreadyDeployed: true,
    });

    const CumulativeMerkleDrop = await ethers.getContractFactory('CumulativeMerkleDrop');
    const cumulativeMerkleDrop = CumulativeMerkleDrop.attach(merkleDrop.address);

    const txn = await cumulativeMerkleDrop.setMerkleRoot(
        '0x8c51757e9e9e063c40ea6be00b7eb030548d3e4b04e0804758260a45f9886e34',
    );
    await txn;

    console.log('CumulativeMerkleDrop deployed to:', merkleDrop.address);

    if (await getChainId() !== '31337') {
        await hre.run('verify:verify', {
            address: merkleDrop.address,
            constructorArguments: args,
        });
    }
};

//module.exports.skip = async () => true;
