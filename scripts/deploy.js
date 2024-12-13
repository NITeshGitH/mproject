const hre = require("hardhat");

async function main() {
  // Deploy Tracking contract
  const Tracking = await hre.ethers.getContractFactory("Tracking");
  const tracking = await Tracking.deploy();
  await tracking.deployed();
  console.log(`Tracking deployed to ${tracking.address}`);

  // Deploy PharmaSupplyChain contract
  const PharmaSupplyChain = await hre.ethers.getContractFactory("PharmaSupplyChain");
  const pharmaSupplyChain = await PharmaSupplyChain.deploy();
  await pharmaSupplyChain.deployed();
  console.log(`PharmaSupplyChain deployed to ${pharmaSupplyChain.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
