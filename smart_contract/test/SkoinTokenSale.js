const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("SkoinTokenSale", () =>{

    async function deployToken(){
        const totalSupply = 100000;
        const tokenPrice = 1000000000;
        const SkoinToken = await ethers.getContractFactory("SkoinToken");
        const skoinToken = await SkoinToken.deploy(totalSupply);
        const SkoinTokenSale = await ethers.getContractFactory("SkoinTokenSale");
        const skoinTokenSale = await SkoinTokenSale.deploy(skoinToken.address, tokenPrice);

        const [owner, otherAccount, otherAccount2, otherAccount3] = await ethers.getSigners();

        return { skoinTokenSale, skoinToken, tokenPrice, owner, otherAccount, otherAccount2, otherAccount3 };
    }

    describe("Deployment", function () {
        it("Hearbeat test for address", async function () {
          const { skoinTokenSale } = await loadFixture(deployToken);
          expect(await skoinTokenSale.address).to.be.a.properAddress;
        });
        it("Should have correct address for tokenContract", async function () {
            const { skoinTokenSale } = await loadFixture(deployToken);
            expect(await skoinTokenSale.tokenContract()).to.be.a.properAddress;
        });
        it("Should have correct token price", async function () {
            const { skoinTokenSale, tokenPrice } = await loadFixture(deployToken);
            expect(await skoinTokenSale.tokenPrice()).to.equal(tokenPrice);
        });
        it("Should facilitate token buying", async function () {
            const { skoinTokenSale, tokenPrice, skoinToken } = await loadFixture(deployToken);
            await skoinToken.transfer(skoinTokenSale.address, 10);
            const numberOfTokens = 5;
            const value = numberOfTokens*tokenPrice
            await skoinTokenSale.buyToken(numberOfTokens,{value: value});
            expect(await skoinTokenSale.tokensSold()).to.equal(5);
        });
        it("Should emit Sell event for buying", async function () {
            const { skoinTokenSale, tokenPrice, skoinToken } = await loadFixture(deployToken);
            await skoinToken.transfer(skoinTokenSale.address, 10);
            const numberOfTokens = 5;
            const value = numberOfTokens*tokenPrice
            await skoinTokenSale.buyToken(numberOfTokens,{value: value});
            expect(await skoinTokenSale.tokensSold()).to.emit(skoinTokenSale, "Sell");
        });
        it("Should not sell if value is not correct", async function () {
            const { skoinTokenSale } = await loadFixture(deployToken);
            const numberOfTokens = 50;
            await expect(skoinTokenSale.buyToken(numberOfTokens, {value: 5})).to.be.revertedWith("Value is not correct according to token price");
        });
        it("Should not sell if number of tokens is more than current balance", async function () {
            const { skoinTokenSale, skoinToken, tokenPrice } = await loadFixture(deployToken);
            await skoinToken.transfer(skoinTokenSale.address, 10);
            const numberOfTokens = 50;
            const value = numberOfTokens*tokenPrice
            await expect(skoinTokenSale.buyToken(numberOfTokens, {value: value})).to.be.revertedWith("Sale contract doesn't have requested number of tokens");
        });
        it("Should not allow other accounts to end token sale", async function () {
            const { skoinTokenSale, otherAccount } = await loadFixture(deployToken);
            await expect(skoinTokenSale.connect(otherAccount).endSale()).to.be.revertedWith("Only admin can end token sale");
        });
        it("Should revert if transfer of remaining balance fails", async function () {
            const { skoinTokenSale } = await loadFixture(deployToken);
            expect(await skoinTokenSale.endSale()).to.be.revertedWith("Remaining tokens could not be transferred back to admin");
        });
        it("Should remove all balance from current contract on self destruct", async function () {
            const { skoinTokenSale, skoinToken } = await loadFixture(deployToken);
            await skoinToken.transfer(skoinTokenSale.address, 10);
            await skoinTokenSale.endSale();
            expect(await skoinToken.balanceOf(skoinTokenSale.address)).to.equal(0);
        });
    })
})