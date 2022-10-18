const main = async () => {
  const SkoinToken = await hre.ethers.getContractFactory("SkoinToken");
  const skoinToken = await SkoinToken.deploy(1000000);

  await skoinToken.deployed();

  console.log(
    `SkoinToken deployed to: ${skoinToken.address}`
  );

  const SkoinTokenSale = await hre.ethers.getContractFactory("SkoinTokenSale");
  const skoinTokenSale = await SkoinTokenSale.deploy(skoinToken.address, 1000000000);

  await skoinTokenSale.deployed();

  console.log(`SkoinTokenSale deployed to: ${skoinTokenSale.address}`);
}

const runMain = async () => {
  try{
    await main() 
    process.exit(0)
  }catch(error){
    console.log(error)
    process.exit(1)
  }
}

runMain()