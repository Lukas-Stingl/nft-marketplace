const NFTCollection = artifacts.require("NFTCollection");
const NFTMarketplace = artifacts.require("NFTMarketplace");
const HelloWorld = artifacts.require("HelloWorld");

module.exports = async function (deployer) {
  await deployer.deploy(NFTCollection);

  const deployedNFT = await NFTCollection.deployed();
  const NFTAddress = deployedNFT.address;
  await deployer.deploy(NFTMarketplace, NFTAddress, HelloWorld);
};