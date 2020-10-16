pragma solidity ^0.5.15;

import "@nomiclabs/buidler/console.sol";


contract Sub {

    struct Content {
      string ipfsHash;
      address op;
      uint256 udurp;
      uint256 ddurp;
      uint256 timeCreated; // timeCreated and age will be in seconds
      mapping(address => bool) udurped;
      mapping(address => bool) ddurped;
      uint256[] commentIndices; // array, under a Content, that contains the index address of comments in content[]
    }


    string public version = "v1";
    string public name = "funny";
    Content[] content;
    uint256[] postIndices; // array that contains the index addresses of posts in content[]

    address public owner;

    constructor() public {
      owner = msg.sender;
    }

// makes a post and pushes it to the end of content. Also adds the index of that
//  posts to postIndices
    function makePost(string calldata ipfsHash) external {
      Content memory temp;
      temp.ipfsHash = ipfsHash;
      temp.op = msg.sender;
      temp.udurp = 0;
      temp.ddurp = 0;
      temp.timeCreated = now;
      postIndices.push(content.length);
      content.push(temp);
    }

// takes ipfsHash and contentIndex, and adds a comment to it
    function makeComment(string calldata ipfsHash, uint256 contentIndex)
    external {
      Content memory temp;
      temp.ipfsHash = ipfsHash;
      temp.op = msg.sender;
      temp.udurp = 0;
      temp.ddurp = 0;
      temp.timeCreated = now;
      content[contentIndex].commentIndices.push(content.length);
      content.push(temp);
    }

// gets the number of posts in content
    function getPostCount() external view returns (uint256) {
      return postIndices.length;
    }

// gets the number of comments directly under a specific content
    function getCommentCount(uint256 contentIndex) external view returns
    (uint256) {
      return content[contentIndex].commentIndices.length;
    }

// give the postIndex, and return the corresponding index for content[]
// ie convert postIndex into contentIndex
    function getPostIndex(uint256 postIndex) external view returns (uint256) {
      return postIndices[postIndex];
    }

// give contentIndex and commentIndex, and return the corresponding index for content[]
// ie convert commentIndex into contentIndex
    function getCommentIndex(uint256 contentIndex, uint256 commentIndex)
    external view returns (uint256) {
      return content[contentIndex].commentIndices[commentIndex];
    }

// give the index number from content[], and return what the content at that position
    function getContent(uint256 contentIndex) external view returns (
      string memory, address, uint256, uint256, uint256) {
      return (content[contentIndex].ipfsHash, content[contentIndex].op,
        content[contentIndex].udurp, content[contentIndex].ddurp,
        content[contentIndex].timeCreated);
    }

// give content index and upDurp
    function upDurp(uint256 index) external {
      require(!content[index].udurped[msg.sender], "Already upDurped");
      if (content[index].ddurped[msg.sender]) {
        content[index].ddurp -= 1;
        content[index].ddurped[msg.sender] = false;
      }
      content[index].udurp += 1;
      content[index].udurped[msg.sender] = true;
    }

// give content index and downDurp
    function downDurp(uint256 index) external {
      require(!content[index].ddurped[msg.sender], "Already downDurped");
      if (content[index].udurped[msg.sender]) {
        content[index].udurp -= 1;
        content[index].udurped[msg.sender] = false;
      }
      content[index].ddurp += 1;
      content[index].ddurped[msg.sender] = true;
    }

// checks if content is upDurped
    function isUpDurped(uint256 index) external view returns (bool) {
      return content[index].udurped[msg.sender];
    }

// checks if content is downDurped
    function isDownDurped(uint256 index) external view returns (bool) {
      return content[index].ddurped[msg.sender];
    }

// undos an upDurp or a downDurp
    function undoDurp(uint256 index) external {
      require(content[index].ddurped[msg.sender] ||
        content[index].udurped[msg.sender], "Nothing to undo");
      if (content[index].ddurped[msg.sender]) {
        content[index].ddurped[msg.sender] = false;
        content[index].ddurp -= 1;
      } else if (content[index].udurped[msg.sender]) {
        content[index].udurped[msg.sender] = false;
        content[index].udurp -= 1;
      }
    }

}
