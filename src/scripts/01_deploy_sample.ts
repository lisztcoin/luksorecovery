import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";

const deployUniversalProfile: DeployFunction = async ({
    deployments,
    getNamedAccounts,
}: HardhatRuntimeEnvironment) => {
    const { deploy } = deployments;
    const { owner } = await getNamedAccounts();
    console.log(owner);
    await deploy("LSP11BasicSocialRecovery", {
        from: owner,
        args: ['0x05A722E8cE93cf96d015D71A929608BB1EcF4122'],
        gasPrice: ethers.BigNumber.from(20_000_000_000), // in wei
        log: true,
    });
};

export default deployUniversalProfile;
