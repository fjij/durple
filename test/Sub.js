const { expect } = require("chai");


describe("Sub contract", function () {
  let contract;
  let owner;

  beforeEach(async function () {
    const factory = await ethers.getContractFactory("Sub");
    [owner] = await ethers.getSigners();

    contract = await factory.deploy();
    await contract.deployed();
  });

  describe("Deployment", function() {

    it("Should set the correct owner", async function() {
      expect(await contract.owner()).to.equal(await owner.getAddress());
    });

    it("Should have no posts", async function() {
      expect(await contract.getPostCount()).to.equal(0);
    });

  });

  describe("Posts", function() {

    it("Should receive our post", async function() {
      await contract.makePost("hash");
      expect(await contract.getPostCount()).to.equal(1);
    });

    it("Should give us the right hash back", async function() {
      await contract.makePost("hash");
      let [ipfsHash, op] = await contract.getPost(0);
      expect(ipfsHash).to.equal("hash");
    });

    it("Should have the right op", async function() {
      await contract.makePost("hash");
      let [ipfsHash, op] = await contract.getPost(0);
      expect(op).to.equal(await owner.getAddress());
    });

  });
});
