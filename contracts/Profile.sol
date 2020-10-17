pragma solidity ^0.5.15;

import "@nomiclabs/buidler/console.sol";


contract Profile {

    string public version = "v1";
    address public owner;
    address[] featuredSubs;

    mapping(address => string) username;
    mapping(string => address) userAddress;

    constructor() public {
      owner = msg.sender;
    }

    function setUsername(string calldata myUsername) external {
      require(!usernameExists(myUsername), "Username is already taken");
      username[msg.sender] = myUsername;
      userAddress[myUsername] = msg.sender;
    }

    function getUsername() external view returns (string memory) {
      return username[msg.sender];
    }

    function removeUsername() external {
      string memory myUsername  = username[msg.sender];
      delete userAddress[myUsername];
      delete username[msg.sender];
    }

    function getFeaturedSubCount() external view returns (uint256) {
      return featuredSubs.length;
    }

    function addFeaturedSub(address subAddress) external {
      require(!subExists(featuredSubs, subAddress), "SubDurple is already featured");
      featuredSubs.push(subAddress);
    }

    function usernameExists(string memory myUsername) public view returns (bool) {
      return userAddress[myUsername] != address(0);
    }

    function subExists(address[] memory subArray, address subAddress) public pure returns (bool) {
      for (uint i = 0; i < subArray.length; i++) {
        if (subArray[i] == subAddress) {
          return true;
        }
      }
      return false;
    }

    function removeFeaturedSub(address subAddress) external {
      require(subExists(featuredSubs, subAddress), "SubDurple is not featured");
      for (uint i = 0; i < featuredSubs.length; i++) {
        if (featuredSubs[i] == subAddress) {
          for (uint j = i; j < featuredSubs.length-1; j++){
              featuredSubs[j] = featuredSubs[j+1];
          }
          featuredSubs.length--;
          return;
        }
      }
    }
}
