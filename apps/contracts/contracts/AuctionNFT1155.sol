// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {ERC1155Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract AuctionNFT1155 is OwnableUpgradeable, ERC1155Upgradeable {
    mapping(uint256 => uint256) public burntTokens;

    event Burn(address indexed from, uint256 indexed tokenId, bytes data);

    error NotAnOwner(address from);
    error AlreadyBurnt(uint256 tokenId);
    error CannotBurn(uint256 tokenId, uint256 amount);
    error CannotTransfer();

    constructor() {
        _disableInitializers();
    }

    function initialize(
        string memory _uri,
        address _owner
    ) external initializer {
        __Ownable_init(_owner);
        __ERC1155_init(_uri);
    }

    function mint(address to, uint256 tokenId) external onlyOwner {
        _mint(to, tokenId, 1, bytes(""));
    }

    function _update(
        address,
        address,
        uint256[] memory,
        uint256[] memory
    ) internal virtual override {
        revert CannotTransfer();
    }
}
