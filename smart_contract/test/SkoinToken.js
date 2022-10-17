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

        const [owner, otherAccount, otherAccount2, otherAccount3] = await ethers.getSigners();

        return { skoinToken, totalSupply, owner, otherAccount, otherAccount2, otherAccount3 };
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
        it("Should subtract the right amount from senders balance", async function () {
          const { skoinToken, totalSupply ,owner, otherAccount } = await loadFixture(deployToken);
          expect(await skoinToken.transfer(otherAccount.address, 250))
            .to.changeTokenBalance(skoinToken, owner.address, totalSupply+250);
        });
        it("Should set add the right amount to receivers balance", async function () {
          const { skoinToken , otherAccount } = await loadFixture(deployToken);
          expect(await skoinToken.transfer(otherAccount.address, 250))
            .to.changeTokenBalance(skoinToken, otherAccount.address, 250);
        });
        it("Should approve tokens for delegated transfer", async function () {
          const { skoinToken, totalSupply ,owner, otherAccount } = await loadFixture(deployToken);
          expect(await skoinToken.approve(otherAccount.address, 100)).to.emit(skoinToken, "Approval")
            .withArgs(owner.address, otherAccount.address , 100);;
        });
        it("Should change the allowance correctly", async function () {
          const { skoinToken, owner, otherAccount } = await loadFixture(deployToken);
          await skoinToken.approve(otherAccount.address, 100);
          const returnAllowance = await skoinToken.allowance(owner.address, otherAccount.address);
          expect(returnAllowance.toNumber()).to.equal(100);
        });
        it("Should check value is more than transfer amount for transferFrom", async function () {
          const { skoinToken, otherAccount, otherAccount2, otherAccount3 } = await loadFixture(deployToken);
          await expect(skoinToken.transferFrom(otherAccount.address, otherAccount2.address, 102)).to.be.revertedWith(
            "Balance is less than transfer value"
          );
        });
        it("Should check allowance value is more than transfer amount for transferFrom", async function () {
          const { skoinToken, owner ,otherAccount } = await loadFixture(deployToken);
          await skoinToken.approve(otherAccount.address, 101);
          await expect(skoinToken.transferFrom(owner.address, otherAccount.address, 102)).to.be.revertedWith(
            "allowance is less than the transfer value"
          );
        });
        it("Should update balance correctly for transferFrom", async function () {
          const { skoinToken, owner, otherAccount, totalSupply } = await loadFixture(deployToken);
          await skoinToken.approve(otherAccount.address, 102);
          await skoinToken.allowance(owner.address,otherAccount.address);
          await skoinToken.connect(otherAccount).transferFrom(owner.address, otherAccount.address, 100);
          expect(await skoinToken.balanceOf(owner.address)).to.be.equal(totalSupply-100);
        });
        it("Should update allowance correctly for transferFrom", async function () {
          const { skoinToken, owner, otherAccount } = await loadFixture(deployToken);
          await skoinToken.approve(otherAccount.address, 102);
          await skoinToken.allowance(owner.address,otherAccount.address);
          await skoinToken.connect(otherAccount).transferFrom(owner.address, otherAccount.address, 100);
          expect(await skoinToken.allowance(owner.address,otherAccount.address)).to.be.equal(2);
        });
        it("Should amit Transfer event for transferFrom", async function () {
          const { skoinToken, owner, otherAccount } = await loadFixture(deployToken);
          await skoinToken.approve(otherAccount.address, 102);
          await skoinToken.allowance(owner.address,otherAccount.address);
          expect(await skoinToken.connect(otherAccount).transferFrom(owner.address, otherAccount.address, 100)).to.emit(skoinToken, "Transfer");
        });
    })
})