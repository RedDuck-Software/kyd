// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {ERC1155Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract AuctionNFT1155 is OwnableUpgradeable, ERC1155Upgradeable {
    mapping(uint256 => uint256) public burntTokens;

    uint256 public id = 1;

    event Burn(address indexed from, uint256 indexed tokenId, bytes data);

    error NotAnOwner(address from);
    error AlreadyBurnt(uint256 tokenId);
    error CannotBurn(uint256 tokenId, uint256 amount);
    error CannotTransfer(uint256 tokenId);

    constructor() {
        _disableInitializers();
    }

    function initialize(string memory uri) external initializer {
        __Ownable_init(msg.sender);
        __ERC1155_init(uri);
    }

    function mint(
        address to,
        uint256 tokenId,
        uint256 amount
    ) external onlyOwner {
        _mint(to, tokenId, amount, bytes(""));
        id++;
    }

    function burn(
        uint256 tokenId,
        uint256 amount,
        bytes calldata data
    ) external {
        if (balanceOf(msg.sender, tokenId) == 0) {
            revert NotAnOwner(msg.sender);
        }
        if (balanceOf(msg.sender, tokenId) - burntTokens[tokenId] > amount) {
            revert CannotBurn(tokenId, amount);
        }

        burntTokens[tokenId] += amount;

        emit Burn(msg.sender, tokenId, data);
    }

    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values
    ) internal virtual override {
        for (uint256 i = 0; i < ids.length; ++i) {
            if (burntTokens[ids[i]] > values[i]) {
                revert CannotTransfer(i);
            }
        }

        super._update(from, to, ids, values);
    }
}
