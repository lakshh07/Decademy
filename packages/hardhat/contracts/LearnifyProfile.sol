// SPDX-License-Identifier: MIT

pragma solidity ^0.8.15;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "hardhat/console.sol";

contract LearnifyProfile is ReentrancyGuard {
    mapping(address => User) userData;

    struct User {
        uint256 id;
        string userHash;
    }

    function fetchUserData(address _userAddress)
        external
        view
        returns (string memory)
    {
        require(_userAddress != address(0), "User address required");
        return userData[_userAddress].userHash;
    }

    function updateData(address _userAddress, string memory _hash)
        external
        nonReentrant
    {
        require(_userAddress != address(0), "User address required");
        require(bytes(_hash).length != 0, "profile hash required");
        userData[_userAddress].userHash = _hash;
    }
}
