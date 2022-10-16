const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("SkoinToken", () =>{

    async function deployToken(){
        const totalSupply = 100000;
        const _initialSupply = 100000;
        const SkoinToken = await ethers.getContractFactory("SkoinToken");
        const skoinToken = await SkoinToken.deploy(_initialSupply);

        const [owner, otherAccount] = await ethers.getSigners();

        return { skoinToken, totalSupply, owner, otherAccount };
    }

    describe("Deployment", function () {
        it("Should set the right total supply", async function () {
          const { skoinToken, totalSupply } = await loadFixture(deployToken);
          expect(await skoinToken.totalSupply()).to.equal(totalSupply);
        });
        it("Should set the right balance in balanceOf", async function () {
          const { skoinToken, totalSupply, owner } = await loadFixture(deployToken);
          expect(await skoinToken.balanceOf(owner.address)).to.equal(totalSupply);
        });
        it("Should set the right name", async function () {
          const { skoinToken } = await loadFixture(deployToken);
          expect(await skoinToken.name()).to.equal("Skoin");
        });
        it("Should set the right symbol", async function () {
          const { skoinToken } = await loadFixture(deployToken);
          expect(await skoinToken.symbol()).to.equal("SKM");
        });
        it("Should set the right standard", async function () {
          const { skoinToken } = await loadFixture(deployToken);
          expect(await skoinToken.standard()).to.equal("Skoin Toekn 1.0");
        });
        it("Should transfer token ownership", async function () {
          const { skoinToken, totalSupply, owner } = await loadFixture(deployToken);
          await expect(skoinToken.transfer(owner.address, totalSupply+1)).to.be.revertedWith(
            "Balance is less than amount"
          );
        });
        it("Should set the right standard", async function () {
          const { skoinToken, totalSupply ,owner, otherAccount } = await loadFixture(deployToken);
          await skoinToken.transfer(otherAccount.address, 250);
          expect(await skoinToken.balanceOf(owner.address)).to.equal(totalSupply-250);
        });
    })
})