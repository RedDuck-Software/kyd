// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;
import "hardhat/console.sol";

library DoubleLinkedList {
    struct List {
        Node[] nodes;
        uint256 head;
        uint256 tail;
        uint256 length;
    }

    struct Data {
        address user;
        uint256 amount;
    }

    struct Node {
        Data data;
        uint256 prev;
        uint256 next;
    }

    function initalize(List storage list) internal {
        list.nodes.push(
            Node(Data(address(0), 0), type(uint256).max, type(uint256).max)
        );
    }

    function increaseAmount(
        List storage list,
        address expectedUser,
        uint256 id,
        uint256 amount
    ) internal isValidNode(list, id) {
        require(list.length != 0, "Invalid length");

        Node storage node = list.nodes[id];

        require(node.data.user == expectedUser, "Mismatch user");

        if (node.next != type(uint256).max) {
            require(
                list.nodes[node.next].data.amount >= node.data.amount + amount,
                "Invalid id"
            );
        }

        node.data.amount += amount;
    }

    function getNodeData(
        List storage list,
        uint256 id
    ) internal view returns (Data memory) {
        return list.nodes[id].data;
    }

    function getNode(
        List storage list,
        uint256 id
    ) internal view returns (Node memory) {
        return list.nodes[id];
    }

    function insertAfter(
        List storage list,
        uint256 id,
        Data memory data
    ) internal isValidNode(list, id) returns (uint256 newID) {
        if (list.length == 0) {
            list.nodes.push(Node(data, type(uint256).max, type(uint256).max));
            list.head = list.nodes.length - 1;
            list.tail = list.nodes.length - 1;
            list.length++;
            return list.nodes.length - 1;
        }

        Node storage node = list.nodes[id];

        if (node.prev != type(uint256).max) {
            require(
                list.nodes[node.prev].data.amount <= data.amount,
                "Invalid id"
            );
        }

        if (node.next != type(uint256).max) {
            require(
                list.nodes[node.next].data.amount >= data.amount,
                "Invalid id"
            );
        }

        require(node.data.amount <= data.amount, "Invalid id");

        list.nodes.push(Node({data: data, prev: id, next: node.next}));

        newID = list.nodes.length - 1;

        if (node.next != type(uint256).max) {
            list.nodes[node.next].prev = newID;
        } else {
            list.tail = newID;
        }

        list.length++;

        node.next = newID;

        return newID;
    }

    function insertBefore(
        List storage list,
        uint256 id,
        Data memory data
    ) internal isValidNode(list, id) returns (uint256 newID) {
        if (list.length == 0) {
            list.nodes.push(Node(data, type(uint256).max, type(uint256).max));
            list.length++;
            return 0;
        }

        Node storage node = list.nodes[id];

        if (node.prev != type(uint256).max) {
            require(
                list.nodes[node.prev].data.amount >= data.amount,
                "Invalid id"
            );
        }

        if (node.next != type(uint256).max) {
            require(
                list.nodes[node.next].data.amount <= data.amount,
                "Invalid id"
            );
        }

        require(node.data.amount >= data.amount, "Invalid id");

        list.nodes.push(Node({data: data, next: id, prev: node.prev}));

        newID = list.nodes.length - 1;

        if (node.prev != type(uint256).max) {
            list.nodes[node.prev].next = newID;
        } else {
            list.head = newID;
        }

        list.length++;

        node.prev = newID;

        return newID;
    }

    function remove(
        List storage list,
        address expectedUser,
        uint256 id
    ) internal isValidNode(list, id) returns (uint256 removedAmount) {
        Node storage node = list.nodes[id];

        removedAmount = node.data.amount;

        require(node.data.user == expectedUser, "Invalid user");

        if (node.next != type(uint256).max && node.prev != type(uint256).max) {
            list.nodes[node.next].prev = node.prev;
            list.nodes[node.prev].next = node.next;
        }

        if (node.prev == type(uint256).max && node.next != type(uint256).max) {
            list.nodes[node.next].prev = type(uint256).max;
        }
        if (node.next == type(uint256).max && node.prev != type(uint256).max) {
            list.nodes[node.prev].next = type(uint256).max;
        }
        if (id == list.tail) {
            list.tail = node.prev != type(uint256).max ? node.prev : 0;
        }

        if (id == list.head) {
            list.head = node.next != type(uint256).max ? node.next : 0;
        }

        list.length--;

        delete list.nodes[id];
    }

    function getNodes(List storage list) internal view returns (Node[] memory) {
        return list.nodes;
    }

    modifier isValidNode(List storage list, uint256 id) {
        require(
            id == 0 || (id != type(uint).max && id < list.nodes.length),
            "Invalid id"
        );
        _;
    }
}
