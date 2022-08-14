// SPDX-License-Identifier: MIT

pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
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

contract LearnifyPodcast is ERC1155, Ownable, ReentrancyGuard {
    using SafeMath for uint256;
    using Counters for Counters.Counter;
    string public name;
    string public symbol;
    Counters.Counter private _podcastCount;

    mapping(uint256 => string) public tokenURI;
    mapping(uint256 => Podcast) private idToPodcast;

    struct Podcast {
        uint256 podcastCount;
        string id;
        address payable uploader;
        string name;
        string description;
        string image;
        string music;
        uint256 price;
        string metadataUrl;
    }

    event PodcastCreated(
        uint256 podcastCount,
        string id,
        address uploader,
        string name,
        string description,
        string image,
        string music,
        uint256 price,
        string metadataUrl
    );

    constructor() ERC1155("") {
        name = "Podcast";
        symbol = "PD";
    }

    function createPodcast(
        string memory _id,
        string memory _metadata,
        uint256 _price,
        string memory _name,
        string memory _description,
        string memory _image,
        string memory _music
    ) external nonReentrant {
        require(bytes(_id).length > 0, "Id not found");
        require(bytes(_metadata).length > 0, "Metadata not found");
        require(_price >= 0, "Price not found");
        require(msg.sender != address(0), "Sender Address not found");

        _podcastCount.increment();
        uint256 podcastCount = _podcastCount.current();

        idToPodcast[podcastCount] = Podcast(
            podcastCount,
            _id,
            payable(msg.sender),
            _name,
            _description,
            _image,
            _music,
            _price,
            _metadata
        );

        mint(msg.sender, podcastCount, 1);
        setURI(podcastCount, _metadata);

        emit PodcastCreated(
            podcastCount,
            _id,
            msg.sender,
            _name,
            _description,
            _image,
            _music,
            _price,
            _metadata
        );
    }

    function mintPodcast(string memory _id, uint256 _podcastCounter)
        external
        payable
        nonReentrant
    {
        require(bytes(_id).length > 0, "Id not found");
        require(
            bytes(_id).length == bytes(idToPodcast[_podcastCounter].id).length
        );
        require(
            msg.sender != idToPodcast[_podcastCounter].uploader,
            "uploader cannot mint own podcast"
        );
        require(
            msg.value == idToPodcast[_podcastCounter].price,
            "Value is less or greater than price"
        );

        mint(msg.sender, _podcastCounter, 1);
        idToPodcast[_podcastCounter].uploader.transfer(msg.value);
    }

    function fetchPodcast() external view returns (Podcast[] memory) {
        uint256 totalPodcastCount = _podcastCount.current();
        uint256 currentIndex = 0;

        Podcast[] memory podcasts = new Podcast[](totalPodcastCount);

        for (uint256 i = 0; i < totalPodcastCount; i++) {
            uint256 currentNumber = i.add(1);
            Podcast storage currentPodcast = idToPodcast[currentNumber];
            podcasts[currentIndex] = currentPodcast;
            currentIndex += 1;
        }
        return podcasts;
    }

    function mint(
        address _to,
        uint256 _id,
        uint256 _amount
    ) internal {
        _mint(_to, _id, _amount, "");
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
        delete idToPodcast[_id];
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

    function setURI(uint256 _id, string memory _uri) public {
        tokenURI[_id] = _uri;
        emit URI(_uri, _id);
    }

    function uri(uint256 _id) public view override returns (string memory) {
        return tokenURI[_id];
    }

    function currentId() public view returns (uint256) {
        return _podcastCount.current();
    }
}
