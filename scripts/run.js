const main = async() => {
    const waveContractFactory = await hre.ethers.getContractFactory('wavePortal');
    const waveContract = await waveContractFactory.deploy({
        value: hre.ethers.utils.parseEther('0.2'),
    });
    await waveContract.deployed();
    console.log("Contract addy: ", waveContract.address);

    let contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
    console.log("Contract balance: ", hre.ethers.utils.formatEther(contractBalance));


    // test that cool down (30 sec) is working
    // should throw an since second tx subitted < 30 sec after first tx
    let waveTx = await waveContract.wave("test wave #1!");
    await waveTx.wait();
    let waveTx2 = await waveContract.wave("test wave #2");
    await waveTx2.wait();

    contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
    console.log("Contract balance: ", hre.ethers.utils.formatEther(contractBalance));

    let allWaves = await waveContract.getAllWaves();
    console.log(allWaves);
};

const runMain = async() => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

runMain();