//SPDX-License-Identifier: UNLICENSED
import "./SkoinToken.sol";

pragma solidity ^0.8.0;

contract SkoinTokenSale {

    address payable admin;
    SkoinToken public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokensSold;

    event Sell(
        address _buyer,
        uint256 amount
    );

    constructor(SkoinToken _tokenContract, uint256 _tokenPrice){
        admin = payable(msg.sender);   // the person who deploys the contract
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }

    function multiply(uint x, uint y) internal pure returns(uint z){
        require(y==0 || (z = x * y) / y == x);
    }

    function buyToken(uint256 _numberOfTokens) public payable{
        require(msg.value == multiply(_numberOfTokens, tokenPrice), "Value is not correct according to token price");
        require(tokenContract.balanceOf(address(this)) >= _numberOfTokens, "Sale contract doesn't have requested number of tokens");
        require(tokenContract.transfer(msg.sender, _numberOfTokens), "Transfer failed"); // actual buy functionality

        tokensSold += _numberOfTokens;

        emit Sell(msg.sender, _numberOfTokens);
    }

    function endSale() public {
        require(msg.sender == admin, "Only admin can end token sale");
        require(tokenContract.transfer(admin, tokenContract.balanceOf(address(this))), 
            "Remaining tokens could not be transferred back to admin");  // transfer all remaining tokens to admin
        selfdestruct(admin);
    }
}