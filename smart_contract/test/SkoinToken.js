const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("SkoinToken", () =>{

    async function deployToken(){
        const totalSupply = 100000;

        const SkoinToken = await ethers.getContractFactory("SkoinToken");
        const skoinToken = await SkoinToken.deploy();

        return { skoinToken, totalSupply };
    }

    describe("Deployment", function () {
        it("Should set the right total supply", async function () {
          const { skoinToken, totalSupply } = await loadFixture(deployToken);
          expect(await skoinToken.totalSupply()).to.equal(totalSupply);
        });
    })
})