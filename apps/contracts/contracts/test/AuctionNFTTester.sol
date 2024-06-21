// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {AuctionNFT} from "../AuctionNFT.sol";

contract AuctionNFTTester is AuctionNFT {
    function _disableInitializers() internal virtual override {}
}
