// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {ERC721URIStorageUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract AuctionNFT is OwnableUpgradeable, ERC721URIStorageUpgradeable {
    mapping(uint256 => bool) public isBurnt;

    event Burn(address indexed from, uint256 indexed tokenId, bytes data);

    error NotAnOwner(address from);
    error AlreadyBurnt(uint256 tokenId);
    error CannotTransfer(uint256 tokenId);

    constructor() {
        _disableInitializers();
    }

    function initialize(
        string memory name,
        string memory symbol
    ) external initializer {
        __ERC721_init(name, symbol);
        __Ownable_init(msg.sender);
        __ERC721URIStorage_init();
    }

    function mint(address to, uint256 tokenId) external onlyOwner {
        _safeMint(to, tokenId);
    }

    function burn(address from, uint256 tokenId, bytes calldata data) external {
        if (ownerOf(tokenId) != from) {
            revert NotAnOwner(from);
        }
        if (isBurnt[tokenId]) {
            revert AlreadyBurnt(tokenId);
        }

        isBurnt[tokenId] = true;

        emit Burn(from, tokenId, data);
    }

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal virtual override returns (address) {
        if (isBurnt[tokenId]) {
            revert CannotTransfer(tokenId);
        }

        super._update(to, tokenId, auth);
    }
}
