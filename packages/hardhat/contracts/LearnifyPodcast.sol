// SPDX-License-Identifier: MIT

pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "hardhat/console.sol";

contract LearnifyPodcast is ERC1155, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    string public name;
    string public symbol;
    Counters.Counter private _memberCount;

    mapping(uint256 => string) public tokenURI;

    struct Member {
        uint256 id;
        address memberAddress;
        uint256 tokenId;
        uint256 amount;
    }

    Member[] public membersList;

    constructor() ERC1155("") {
        name = "LearnifyPodcast";
        symbol = "LRNFYPD";
    }

    function mint(
        address _to,
        uint256 _id,
        uint256 _amount
    ) external {
        _mint(_to, _id, _amount, "");
        _memberCount.increment();
        uint256 memberCount = _memberCount.current();
        membersList.push(Member(memberCount, _to, _id, _amount));
    }

    function mintBatch(
        address _to,
        uint256[] memory _ids,
        uint256[] memory _amounts
    ) external onlyOwner {
        _mintBatch(_to, _ids, _amounts, "");
    }

    function burn(
        address _from,
        uint256 _id,
        uint256 _amount
    ) external onlyOwner {
        _burn(_from, _id, _amount);
    }

    function burnBatch(uint256[] memory _ids, uint256[] memory _amounts)
        external
        onlyOwner
    {
        _burnBatch(msg.sender, _ids, _amounts);
    }

    function burnForMint(
        address _from,
        uint256[] memory _burnIds,
        uint256[] memory _burnAmounts,
        uint256[] memory _mintIds,
        uint256[] memory _mintAmounts
    ) external onlyOwner {
        _burnBatch(_from, _burnIds, _burnAmounts);
        _mintBatch(_from, _mintIds, _mintAmounts, "");
    }

    function setURI(uint256 _id, string memory _uri) external onlyOwner {
        tokenURI[_id] = _uri;
        emit URI(_uri, _id);
    }

    function uri(uint256 _id) public view override returns (string memory) {
        return tokenURI[_id];
    }

    function fetchMembers() public view returns (Member[] memory) {
        return membersList;
    }

    function currentId() public view returns (uint256) {
        return _memberCount.current();
    }
}
