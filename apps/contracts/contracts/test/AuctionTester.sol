// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Auction} from "../Auction.sol";

contract AuctionTester is Auction {
    function _disableInitializers() internal virtual override {}
}
