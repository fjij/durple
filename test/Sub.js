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
      let [ipfsHash, op, ud, dd] = await contract.getPost(0);
      expect(ipfsHash).to.equal("hash");
    });

    it("Should have the right op", async function() {
      await contract.makePost("hash");
      let [ipfsHash, op, ud, dd] = await contract.getPost(0);
      expect(op).to.equal(await owner.getAddress());
    });

  });

  describe("UpDurps", function() {

    it("Should start with zero upDurps", async function() {
      await contract.makePost("hash");
      let [ipfsHash, op, ud, dd] = await contract.getPost(0);
      expect(ud).to.equal(0);
    });

    it("Should start with zero downDurps", async function() {
      await contract.makePost("hash");
      let [ipfsHash, op, ud, dd] = await contract.getPost(0);
      expect(dd).to.equal(0);
    });

    it("Should get one upDurp", async function() {
      await contract.makePost("hash");
      await contract.upDurp(0);
      let [ipfsHash, op, ud, dd] = await contract.getPost(0);
      expect(ud).to.equal(1);
    });

    it("Should get one downDurp", async function() {
      await contract.makePost("hash");
      await contract.downDurp(0);
      let [ipfsHash, op, ud, dd] = await contract.getPost(0);
      expect(dd).to.equal(1);
    });

    it("Should get one downDurp after downDurping after an upDurp", async function() {
      await contract.makePost("hash");
      await contract.upDurp(0);
      await contract.downDurp(0);
      let [ipfsHash, op, ud, dd] = await contract.getPost(0);
      expect(dd).to.equal(1);
    });

    it("Should have no upDurps after downDurping after an upDurp", async function() {
      await contract.makePost("hash");
      await contract.upDurp(0);
      await contract.downDurp(0);
      let [ipfsHash, op, ud, dd] = await contract.getPost(0);
      expect(ud).to.equal(0);
    });

    it("Should have no downDurps after upDurping after a downDurp", async function() {
      await contract.makePost("hash");
      await contract.downDurp(0);
      await contract.upDurp(0);
      let [ipfsHash, op, ud, dd] = await contract.getPost(0);
      expect(dd).to.equal(0);
    });
    it("Should have one upDurp after upDurping after a downDurp", async function() {
      await contract.makePost("hash");
      await contract.downDurp(0);
      await contract.upDurp(0);
      let [ipfsHash, op, ud, dd] = await contract.getPost(0);
      expect(ud).to.equal(1);
    });

  });

});
