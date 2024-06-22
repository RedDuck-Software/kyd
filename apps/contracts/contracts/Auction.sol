//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.23;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./libraries/DoubleLinkedList.sol";
import "./libraries/DecimalsCorrectionLibrary.sol";
import "./libraries/UniswapV3Actions.sol";
import "./gelato/GelatoVRFConsumerBase.sol";
import "./interfaces/IAuction.sol";
import "./AuctionNFT.sol";

contract Auction is IAuction, OwnableUpgradeable, GelatoVRFConsumerBase {
    using DoubleLinkedList for DoubleLinkedList.List;
    using DecimalsCorrectionLibrary for uint256;

    DoubleLinkedList.List list;

    event Donate(address indexed user, address indexed stable, uint256 amount);
    event AuctionEnded();
    event RewardsDistributed();

    error InvalidEthDonate();

    uint256 public constant MAX_RANDOM_WINNERS = 10;
    uint256 public constant MAX_TOP_WINNERS = 10;

    uint256 public totalDonated;

    address[] stables;
    bytes ethToStablePath;
    address swapStable;
    address uniswapV3Router;
    uint256[] topWinnersNfts;
    uint256 public goal;
    address public nft;
    address public nftParticipate;
    uint256 public randomWinners;
    uint256 public randomWinnerNftId;
    uint256 public participationNftId;
    address public gelatoOperator;

    uint256 public randomness;

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
        stables = _params.stables;
        ethToStablePath = _params.ethToStablePath;
        swapStable = _params.swapStable;
        uniswapV3Router = _params.uniswapV3Router;
        topWinnersNfts = _params.topWinners;
        gelatoOperator = _params.gelatoOperator;
        nftParticipate = _params.nftParticipate;

        list.initalize();
    }

    function finish() external onlyOwner {
        _finishAuction();

        emit AuctionEnded();
    }

    function distributeRewards() external {
        require(randomness != 0, "");
        _distibute();

        emit RewardsDistributed();
    }

    function withdrawMult(
        address[] calldata _stables,
        uint256[] calldata amounts
    ) external {
        require(_stables.length == amounts.length, "Mismatched length");

        for (uint i = 0; i < _stables.length; i++) {
            ERC20Upgradeable(_stables[i]).transfer(owner(), amounts[i]);
        }
    }

    function donateEth(
        uint256 indexToInsert,
        uint256 indexOfExisting,
        bool existingNode
    ) external payable {
        if (msg.value == 0) {
            revert InvalidEthDonate();
        }

        uint256 stableAmount = UniswapV3Actions.swap(
            uniswapV3Router,
            ethToStablePath,
            address(this),
            msg.value
        );

        stableAmount = stableAmount.convertToBase18(
            ERC20Upgradeable(swapStable).decimals()
        );

        _donate(
            stableAmount,
            indexToInsert,
            indexOfExisting,
            existingNode,
            swapStable
        );
    }

    function donate(
        address stable,
        uint256 amount,
        uint256 indexToInsert,
        uint256 indexOfExisting,
        bool existingNode
    ) external {
        ERC20Upgradeable(stable).transferFrom(
            msg.sender,
            address(this),
            amount
        );

        amount = amount.convertToBase18(ERC20Upgradeable(stable).decimals());

        _donate(amount, indexToInsert, indexOfExisting, existingNode, stable);
    }

    function _donate(
        uint256 amount,
        uint256 indexToInsert,
        uint256 indexOfExisting,
        bool existingNode,
        address stable
    ) internal {
        totalDonated += amount;

        if (existingNode) {
            if (indexToInsert == indexOfExisting) {
                list.increaseAmount(indexOfExisting, amount);
            } else {
                list.remove(indexOfExisting);
                list.insertAfter(
                    indexToInsert,
                    DoubleLinkedList.Data({user: msg.sender, amount: amount})
                );
            }
        } else {
            list.insertAfter(
                indexToInsert,
                DoubleLinkedList.Data({user: msg.sender, amount: amount})
            );
        }

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

    function _fulfillRandomness(
        uint256 _randomness,
        uint256,
        bytes memory
    ) internal override {
        randomness = _randomness;
    }

    function _finishAuction() private {
        _requestRandomness("");
    }

    function _distibute() private {
        uint256 _randomWinners = randomWinners;

        for (uint i; i < topWinnersNfts.length; i++) {
            DoubleLinkedList.Node memory node = list.getNode(list.head);

            if (node.data.user == address(0)) return;

            _mint(nft, node.data.user, randomWinnerNftId);
            list.remove(list.head);
        }

        for (uint256 i; _randomWinners == 0; i++) {
            uint256 randomValue = uint256(
                keccak256(abi.encodePacked(randomness, i))
            ) % list.length;

            DoubleLinkedList.Data memory data = list.getNodeData(randomValue);

            // if random value repeated
            if (data.user == address(0)) continue;

            _mint(nft, data.user, randomWinnerNftId);

            list.remove(randomValue);

            _randomWinners--;
        }
    }

    function _mint(address _nft, address to, uint256 id) private {
        AuctionNFT(_nft).mint(to, id);
    }

    function _operator() internal view override returns (address) {
        return gelatoOperator;
    }
}
