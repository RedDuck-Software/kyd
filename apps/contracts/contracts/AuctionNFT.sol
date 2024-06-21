// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract AuctionNFT is OwnableUpgradeable, ERC721URIStorageUpgradeable {
    mapping(uint256 => bool) public isBurnt;

    event Burn(address indexed from, uint256 indexed tokenId, bytes data);

    constructor() {
        _disableInitializers();
    }

    function __AuctionNFT_init(
        string memory name,
        string memory symbol
    ) internal onlyInitializing {
        __ERC721_init(name, symbol);
        __Ownable_init(msg.sender);
        __ERC721URIStorage_init();
    }

    function mint(address to, uint256 tokenId) external onlyOwner {
        _mint(to, tokenId);
    }

    function burn(address from, uint256 tokenId, bytes calldata data) external {
        require(
            ownerOf(tokenId) == from || msg.sender == owner(),
            "ANFT: not an owner"
        );
        require(!isBurnt[tokenId], "ANFT: already burnt");

        isBurnt[tokenId] = true;

        emit Burn(from, tokenId, data);
    }

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal virtual override returns (address) {
        require(!isBurnt[tokenId], "ANFT: cannot transfer");

        super._update(to, tokenId, auth);
    }
}
