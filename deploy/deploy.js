const hre = require('hardhat');
const { getChainId, ethers } = hre;

module.exports = async ({ deployments, getNamedAccounts }) => {
    console.log('running deploy script');
    console.log('network id ', await getChainId());

    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    console.log(`deployer: ${deployer}`);

    const token = "0xCfEB869F69431e42cdB54A4F4f105C19C080A601";
    const dd = "0x9b1f7F645351AF3631a656421eD2e40f2802E6c0";
    const args = [token, dd];

    const merkleDrop = await deploy('CumulativeMerkleDrop', {
        from: deployer,
        args,
        skipIfAlreadyDeployed: true,
    });

    const CumulativeMerkleDrop = await ethers.getContractFactory('CumulativeMerkleDrop');
    const cumulativeMerkleDrop = CumulativeMerkleDrop.attach(merkleDrop.address);

    const txn = await cumulativeMerkleDrop.setMerkleRoot(
        '0xc1f080b7a112450a5f0315d551f24da621e3fef4562af52652ee7685c35d2c00',
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
