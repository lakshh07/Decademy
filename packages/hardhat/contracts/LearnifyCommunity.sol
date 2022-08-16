// SPDX-License-Identifier: MIT

pragma solidity ^0.8.15;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "hardhat/console.sol";

library SafeMath {
    function add(uint256 x, uint256 y) internal pure returns (uint256 z) {
        require((z = x + y) >= x, "ds-math-add-overflow");
    }

    function sub(uint256 x, uint256 y) internal pure returns (uint256 z) {
        require((z = x - y) <= x, "ds-math-sub-underflow");
    }

    function mul(uint256 x, uint256 y) internal pure returns (uint256 z) {
        require(y == 0 || (z = x * y) / y == x, "ds-math-mul-overflow");
    }
}

contract LearnifyCommunity is Ownable, ReentrancyGuard {
    using SafeMath for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private _messageCount;

    struct Community {
        address sender;
        string message;
        string attachment;
        uint256 time;
    }

    event MessageSent(
        address sender,
        string message,
        string attachment,
        uint256 time
    );

    mapping(uint256 => Community) internal idToMessage;

    function sendMessage(string memory _message, string memory _attachment)
        external
        nonReentrant
    {
        require(bytes(_message).length > 0, "message required");

        _messageCount.increment();
        uint256 messageCount = _messageCount.current();

        idToMessage[messageCount] = Community(
            msg.sender,
            _message,
            _attachment,
            block.timestamp
        );

        emit MessageSent(msg.sender, _message, _attachment, block.timestamp);
    }

    function fetchMsg() external view returns (Community[] memory) {
        uint256 totalMessageCount = _messageCount.current();
        uint256 currentIndex = 0;

        Community[] memory community = new Community[](totalMessageCount);

        for (uint256 i = 0; i < totalMessageCount; i++) {
            uint256 currentNumber = i.add(1);
            Community storage currentMessage = idToMessage[currentNumber];
            community[currentIndex] = currentMessage;
            currentIndex += 1;
        }
        return community;
    }
}
