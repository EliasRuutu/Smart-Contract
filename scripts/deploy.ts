import { ethers } from "hardhat";
async function main() {
  const [owner] = await ethers.getSigners();
  console.log(await owner.getAddress());
  //   const BidifyToken = await ethers.getContractFactory("BidifyToken");
  //   const bidify = await BidifyToken.deploy("BidifyToken", "BDC");
  //   console.log('BidifyToken Contract deployed at:', await bidify.getAddress());
  // ------   Sepolia  ------------------
  // const linkAddress = "0x779877A7B0D9E8603169DdbD7836e478b4624789";
  // const wrapperAddress = "0xab18414CD93297B0d12ac29E63Ca20f515b3DB46";
  // const owners = [await owner.getAddress()];
  const VRFv2DirectFundingConsumer = await ethers.getContractFactory(
    "VRFv2DirectFundingConsumer"
  );
  const test = await VRFv2DirectFundingConsumer.deploy();
  console.log(
    "VRFv2DirectFundingConsumer Contract deployed at:",
    await test.getAddress()
  );
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
