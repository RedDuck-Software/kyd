//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.23;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./libraries/DoubleLinkedList.sol";
import "./libraries/DecimalsCorrectionLibrary.sol";
import "./gelato/GelatoVRFConsumerBase.sol";
import "./interfaces/IAuction.sol";
import "./AuctionNFT.sol";

import "hardhat/console.sol";

contract Auction is IAuction, OwnableUpgradeable, GelatoVRFConsumerBase {
    using DoubleLinkedList for DoubleLinkedList.List;
    using DecimalsCorrectionLibrary for uint256;

    DoubleLinkedList.List list;

    event Donate(address indexed user, address indexed stable, uint256 amount);
    event AuctionEnded();
    event RewardsDistributed();

    uint256 public constant MAX_RANDOM_WINNERS = 10;
    uint256 public constant MAX_TOP_WINNERS = 10;

    mapping(address => bool) public userDonated;
    mapping(address => bool) public supportedStables;

    uint256 public totalDonated;

    uint256[] topWinnersNfts;
    uint256 public goal;
    address public nft;
    address public nftParticipate;
    uint256 public randomWinners;
    uint256 public randomWinnerNftId;
    uint256 public participationNftId;
    address public gelatoOperator;

    uint256 public randomness;
    bool public nftsDistributed;

    constructor() {
        _disableInitializers();
    }

    function initialize(
        IAuction.AuctionParams calldata _params
    ) external initializer {
        __Ownable_init(_params.owner);

        require(_params.randomWinners <= MAX_RANDOM_WINNERS, "");
        require(_params.topWinners.length <= MAX_TOP_WINNERS, "");

        goal = _params.goal;
        nft = _params.nft;
        randomWinners = _params.randomWinners;
        randomWinnerNftId = _params.randomWinnerNftId;
        participationNftId = _params.participationNftId;

        for (uint i; i < _params.stables.length; i++) {
            supportedStables[_params.stables[i]] = true;
        }

        topWinnersNfts = _params.topWinners;
        gelatoOperator = _params.gelatoOperator;
        nftParticipate = _params.nftParticipate;
    }

    function finish() external onlyOwner {
        _finishAuction();

        emit AuctionEnded();
    }

    function distributeRewards() external {
        require(randomness != 0, "Randomness is not set");
        _distibute();

        emit RewardsDistributed();
    }

    function withdrawMult(
        address[] calldata _stables,
        uint256[] calldata amounts
    ) external onlyOwner {
        require(_stables.length == amounts.length, "Mismatched length");
        require(nftsDistributed, "Not distributed");

        for (uint i = 0; i < _stables.length; i++) {
            ERC20Upgradeable(_stables[i]).transfer(owner(), amounts[i]);
        }
    }

    function donate(
        address stable,
        uint256 amount,
        uint256 indexToInsert,
        uint256 indexOfExisting,
        bool before
    ) external {
        require(supportedStables[stable], "not supported");

        // FIXME: safe transfer from
        ERC20Upgradeable(stable).transferFrom(
            msg.sender,
            address(this),
            amount
        );

        amount = amount.convertToBase18(ERC20Upgradeable(stable).decimals());

        totalDonated += amount;

        if (userDonated[msg.sender]) {
            if (indexToInsert == indexOfExisting) {
                list.increaseAmount(msg.sender, indexOfExisting, amount);
            } else {
                uint256 prevAmount = list.remove(msg.sender, indexOfExisting);

                if (before) {
                    list.insertBefore(
                        indexToInsert,
                        DoubleLinkedList.Data({
                            user: msg.sender,
                            amount: amount + prevAmount
                        })
                    );
                } else {
                    list.insertAfter(
                        indexToInsert,
                        DoubleLinkedList.Data({
                            user: msg.sender,
                            amount: amount + prevAmount
                        })
                    );
                }
            }
        } else {
            if (before) {
                list.insertBefore(
                    indexToInsert,
                    DoubleLinkedList.Data({user: msg.sender, amount: amount})
                );
            } else {
                list.insertAfter(
                    indexToInsert,
                    DoubleLinkedList.Data({user: msg.sender, amount: amount})
                );
            }
        }

        userDonated[msg.sender] = true;

        emit Donate(stable, msg.sender, amount);

        if (totalDonated >= goal) {
            _finishAuction();
        }
    }

    function getUser(
        uint256 id
    ) external view returns (DoubleLinkedList.Data memory) {
        return list.getNodeData(id);
    }

    function getNodes() external view returns (DoubleLinkedList.Node[] memory) {
        return list.getNodes();
    }

    function _fulfillRandomness(
        uint256 _randomness,
        uint256,
        bytes memory
    ) internal override {
        randomness = _randomness;
    }

    function _finishAuction() internal virtual {
        _requestRandomness("");
    }

    function _distibute() private {
        uint256 _randomWinners = randomWinners;

        for (uint i; i < topWinnersNfts.length; i++) {
            if (list.tail == type(uint256).max) return;

            DoubleLinkedList.Node memory node = list.getNode(list.tail);

            _mint(nft, node.data.user, i);
            list.remove(node.data.user, list.tail);
        }

        for (uint256 i; _randomWinners == 0; i++) {
            uint256 randomValue = uint256(
                keccak256(abi.encodePacked(randomness, i))
            ) % list.length;

            DoubleLinkedList.Data memory data = list.getNodeData(randomValue);

            // if random value repeated
            if (data.user == address(0)) continue;

            _mint(nft, data.user, randomWinnerNftId);

            console.log("nft distributed");

            list.remove(data.user, randomValue);

            _randomWinners--;
        }

        nftsDistributed = true;
    }

    function _mint(address _nft, address to, uint256 id) private {
        AuctionNFT(_nft).mint(to, id);
    }

    function _operator() internal view override returns (address) {
        return gelatoOperator;
    }
}
