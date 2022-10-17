//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.1;

contract SkoinToken {

    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    string public name = "Skoin";    
    string public symbol = "SKM";    
    string public standard = "Skoin Toekn 1.0";    

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value 
    );

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    constructor(uint256 _initialSupply){
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }

    function transfer(address payable _to, uint256 _value) public returns(bool success){
        require(balanceOf[msg.sender] >= _value, "Balance is less than amount");

        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    // Account to approve to send Skoin tokens on my behalf
    function approve(address _spender, uint256 _value) public returns(bool success){
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    // Transfer Skoin tokens to approved account, msg.sender is a thrid party and _from will be the owner
    function transferFrom(address payable _from, address payable _to, uint256 _value) public returns(bool success){
        require(balanceOf[_from] >= _value, "Balance is less than transfer value");
        require(allowance[_from][msg.sender] >= _value, "allowance is less than the transfer value");
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
    }
}