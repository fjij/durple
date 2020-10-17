pragma solidity ^0.5.15;

import "@nomiclabs/buidler/console.sol";


contract Profile {

    struct Sub {
      address subAddress;
      string name;
    }

    string public version = "v1";
    address public owner;
    Sub[] public featuredSubs;

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

    function getFeaturedSub(uint256 index) external view returns (address, string memory) {
      return (featuredSubs[index].subAddress, featuredSubs[index].name);
    }

    function addFeaturedSub(address subAddress, string calldata name) external {
      require(msg.sender == owner, "Only the owner can feature SubDurples");
      require(!subExists(subAddress), "SubDurple is already featured");
      Sub memory temp;
      temp.subAddress = subAddress;
      temp.name = name;
      featuredSubs.push(temp);
    }

    function usernameExists(string memory myUsername) public view returns (bool) {
      return userAddress[myUsername] != address(0);
    }

    function subExists(address subAddress) public view returns (bool) {
      for (uint i = 0; i < featuredSubs.length; i++) {
        if (featuredSubs[i].subAddress == subAddress) {
          return true;
        }
      }
      return false;
    }

    function removeFeaturedSub(address subAddress) external {
      require(msg.sender == owner, "Only the owner can remove featured SubDurples");
      require(subExists(subAddress), "SubDurple is not featured");
      for (uint i = 0; i < featuredSubs.length; i++) {
        if (featuredSubs[i].subAddress == subAddress) {
          for (uint j = i; j < featuredSubs.length-1; j++){
              featuredSubs[j] = featuredSubs[j+1];
          }
          featuredSubs.length--;
          return;
        }
      }
    }
}
