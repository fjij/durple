pragma solidity ^0.5.15;

import "@nomiclabs/buidler/console.sol";


contract Sub {

    struct Post {
      string ipfsHash;
      address op;
      uint256 udurp;
      uint256 ddurp;
      mapping(address => bool) udurped;
      mapping(address => bool) ddurped;
    }


    string public version = "v1";
    string public name = "funny";
    Post[] public posts;


    address public owner;

    constructor() public {
        owner = msg.sender;
    }

    function makePost(string calldata ipfsHash) external {
      posts.push(Post(
        {
          ipfsHash: ipfsHash,
          op: msg.sender,
          udurp: 0,
          ddurp: 0
        }
      ));
    }

    function getPostCount() external view returns (uint256) {
      return posts.length;
    }

    function getPost(uint256 index) external view returns (string memory, address, uint256, uint256) {
      return (posts[index].ipfsHash, posts[index].op, posts[index].udurp, posts[index].ddurp);
    }

    function upDurp(uint256 index) external {
      require(!posts[index].udurped[msg.sender], "Already upDurped");
      if (posts[index].ddurped[msg.sender]) {
        posts[index].ddurp -= 1;
        posts[index].ddurped[msg.sender] = false;
      }
      posts[index].udurp += 1;
      posts[index].udurped[msg.sender] = true;
    }

    function downDurp(uint256 index) external {
      require(!posts[index].ddurped[msg.sender], "Already downDurped");
      if (posts[index].udurped[msg.sender]) {
        posts[index].udurp -= 1;
        posts[index].udurped[msg.sender] = false;
      }
      posts[index].ddurp += 1;
      posts[index].ddurped[msg.sender] = true;
    }

}
