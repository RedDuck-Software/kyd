// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

library DoubleLinkedList {
    struct List {
        Node[] nodes;
        uint256 head;
        uint256 tail;
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

    function createList(List storage list) internal {
        list.nodes.push(
            Node(Data(address(0), 0), type(uint256).max, type(uint256).max)
        );
        list.head = 0;
        list.tail = 0;
    }

    function increaseAmount(
        List storage list,
        uint256 id,
        uint256 amount
    ) internal isValidNode(list, id) {
        require(
            list.nodes[id].data.amount == amount && id != 0,
            "Invalid data"
        );
        list.nodes[id].data.amount += amount;
    }

    function insertAfter(
        List storage list,
        uint256 id,
        Data memory data
    ) internal isValidNode(list, id) returns (uint256 newID) {
        Node storage node = list.nodes[id];

        if (node.prev != type(uint256).max) {
            require(
                list.nodes[node.prev].data.amount <= data.amount,
                "Invalid id"
            );
        }

        if (list.nodes[id].next != type(uint256).max) {
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

        node.next = newID;

        return newID;
    }

    function remove(
        List storage list,
        uint256 id
    ) internal isValidNode(list, id) {
        Node storage node = list.nodes[id];

        if (node.next != type(uint256).max && node.prev != type(uint256).max) {
            list.nodes[node.next].prev = node.prev;
            list.nodes[node.prev].next = node.next;
        }

        if (node.prev == type(uint256).max) {
            list.nodes[node.next].prev = type(uint256).max;
        }
        if (node.next == type(uint256).max) {
            list.nodes[node.prev].next = type(uint256).max;
        }

        if (id == list.tail) {
            list.tail = node.prev;
        }

        delete list.nodes[id];
    }

    function getNodes(List storage list) public view returns (Node[] memory) {
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
