pragma solidity ^0.5.15;

import "@nomiclabs/buidler/console.sol";


contract Sub {

    struct Post {
      string ipfsHash;
      address op;
    }


    string public version = "v1";
    string public name = "funny";
    Post[] public posts;
    int public udurp = 0;
    int public ddurp = 0;

    address public owner;

    constructor() public {
        owner = msg.sender;
    }

    function makePost(string calldata ipfsHash) external {
      posts.push(Post(
        {
          ipfsHash: ipfsHash,
          op: msg.sender
        }
      ));
    }

    function getPostCount() external view returns (uint256) {
      return posts.length;
    }

    function getPost(uint256 index) external view returns (string memory, address) {
      return (posts[index].ipfsHash, posts[index].op);
    }

    function upDurp() external {
      udurp += 1;
    }

    function downDurp() external {
      ddurp -= 1;
    }
}
