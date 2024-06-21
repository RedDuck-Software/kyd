//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.23;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./libraries/DoubleLinkedList.sol";
import "./gelato/GelatoVRFConsumerBase.sol";
import "./interfaces/IAuction.sol";

contract Auction is IAuction, OwnableUpgradeable, GelatoVRFConsumerBase {
    using DoubleLinkedList for DoubleLinkedList.List;

    DoubleLinkedList.List list;

    event Donate(
        address indexed user,
        address indexed stable,
        address indexToInsert,
        address indexOfExisting,
        bool existingNode
    );

    constructor() {
        _disableInitializers();
    }

    function initialize(IAuction.AuctionParams calldata params) external {}

    function withdrawMult(
        address[] calldata stables,
        uint256[] calldata amounts
    ) external {
        require(stables.length == amounts.length, "Mismatched length");

        for (uint i = 0; i < stables.length; i++) {
            ERC20Upgradeable(stables[i]).transfer(owner(), amounts[i]);
        }
    }

    function donate(
        address stable,
        uint256 amount,
        uint256 indexToInsert,
        uint256 indexOfExisting,
        bool existingNode
    ) external {
        uint256 index;

        ERC20Upgradeable(stable).transferFrom(
            msg.sender,
            address(this),
            amount
        );

        if (existingNode) {
            if (indexToInsert == indexOfExisting) {
                list.increaseAmount(indexOfExisting, amount);
                index = indexOfExisting;
            } else {
                list.remove(indexOfExisting);
                index = list.insertAfter(
                    indexToInsert,
                    DoubleLinkedList.Data({user: msg.sender, amount: amount})
                );
            }
        } else {
            index = list.insertAfter(
                indexToInsert,
                DoubleLinkedList.Data({user: msg.sender, amount: amount})
            );
        }
    }

    function _fulfillRandomness(
        uint256 randomness,
        uint256 requestId,
        bytes memory extraData
    ) internal override {}

    function _operator() internal view override returns (address) {}
}
