// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract WhiteList {

  bytes32 public merkleRoot;
  address public tokenAddress;

  mapping(address => bool) public isClaimed;

  constructor(bytes32 _merkleRoot, address _tokenAddress) {
    merkleRoot = _merkleRoot;
    tokenAddress = _tokenAddress;
  }

  function claim (bytes32[] calldata proof, uint256 amount) public {
    require(!isClaimed[msg.sender], "Already claimed!!");
    bytes32 leaf = keccak256(abi.encodePacked(msg.sender, amount));
    bool verified = MerkleProof.verifyCalldata(proof, merkleRoot, leaf);
    require(verified, 'Invalid proof.');
    require(IERC20(tokenAddress).transfer(msg.sender, amount), "Transfer failed!!");
    isClaimed[msg.sender] = true;
  }


}
