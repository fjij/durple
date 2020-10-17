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
      let [ipfsHash, op, ud, dd, tc] = await contract.getContent(0);
      expect(ipfsHash).to.equal("hash");
    });

    it("Should have the right op", async function() {
      await contract.makePost("hash");
      let [ipfsHash, op, ud, dd, tc] = await contract.getContent(0);
      expect(op).to.equal(await owner.getAddress());
    });

    it("Should have the right number of posts", async function() {
      await contract.makePost("hash");
      await contract.makePost("poo");
      await contract.makePost("pee");
      await contract.makeComment("abc", 0);
      expect(await contract.getPostCount()).to.equal(3);
    });

    it("Should be able to convert postIndex into contentIndex", async function() {
      await contract.makePost("hash");
      await contract.makeComment("poo", 0);
      await contract.makePost("pee");
      await contract.makeComment("abc", 0);
      expect(await contract.getPostIndex(1)).to.equal(2);
    });

    it("Should have the correct time it was created", async function() {
      await contract.makePost("hash");
      time = Date.now()/1000;
      let [ipfsHash, op, ud, dd, tc] = await contract.getContent(0);
      expect(true).to.equal(time - tc <= 1);
    });

  });

  describe("Comments", function() {

    it("Should receive our comment", async function() {
      await contract.makePost("hash");
      await contract.makeComment("abc", 0);
      expect(await contract.getCommentCount(0)).to.equal(1);
    });

    it("Should give us the right hash back", async function() {
      await contract.makePost("hash");
      await contract.makeComment("abc", 0);
      let [ipfsHash, op, ud, dd, tc] = await contract.getContent(0);
      expect(ipfsHash).to.equal("hash");
    });

    it("Should have the right op", async function() {
      await contract.makePost("hash");
      await contract.makeComment("abc", 0);
      let [ipfsHash, op, ud, dd, tc] = await contract.getContent(0);
      expect(op).to.equal(await owner.getAddress());
    });

    it("Should have the right number of comments", async function() {
      await contract.makePost("hash");
      await contract.makePost("poo");
      await contract.makeComment("pee", 0);
      await contract.makeComment("abc", 0);
      expect(await contract.getCommentCount(0)).to.equal(2);
    });

    it("Should be able to convert commentIndex into contentIndex", async function() {
      await contract.makePost("hash");
      await contract.makeComment("poo", 0);
      await contract.makePost("pee");
      await contract.makeComment("abc", 2);
      expect(await contract.getCommentIndex(2, 0)).to.equal(3);
    });

  });

  describe("UpDurps", function() {

    it("Should start with zero upDurps", async function() {
      await contract.makePost("hash");
      let [ipfsHash, op, ud, dd, tc] = await contract.getContent(0);
      expect(ud).to.equal(0);
    });

    it("Should start with zero downDurps", async function() {
      await contract.makePost("hash");
      let [ipfsHash, op, ud, dd, tc] = await contract.getContent(0);
      expect(dd).to.equal(0);
    });

    it("Should get one upDurp", async function() {
      await contract.makePost("hash");
      await contract.upDurp(0);
      let [ipfsHash, op, ud, dd, tc] = await contract.getContent(0);
      expect(ud).to.equal(1);
    });

    it("Should get one downDurp", async function() {
      await contract.makePost("hash");
      await contract.downDurp(0);
      let [ipfsHash, op, ud, dd, tc] = await contract.getContent(0);
      expect(dd).to.equal(1);
    });

    it("Should get one downDurp after downDurping after an upDurp", async function() {
      await contract.makePost("hash");
      await contract.upDurp(0);
      await contract.downDurp(0);
      let [ipfsHash, op, ud, dd, tc] = await contract.getContent(0);
      expect(dd).to.equal(1);
    });

    it("Should have no upDurps after downDurping after an upDurp", async function() {
      await contract.makePost("hash");
      await contract.upDurp(0);
      await contract.downDurp(0);
      let [ipfsHash, op, ud, dd, tc] = await contract.getContent(0);
      expect(ud).to.equal(0);
    });

    it("Should have no downDurps after upDurping after a downDurp", async function() {
      await contract.makePost("hash");
      await contract.downDurp(0);
      await contract.upDurp(0);
      let [ipfsHash, op, ud, dd, tc] = await contract.getContent(0);
      expect(dd).to.equal(0);
    });

    it("Should have one upDurp after upDurping after a downDurp", async function() {
      await contract.makePost("hash");
      await contract.downDurp(0);
      await contract.upDurp(0);
      let [ipfsHash, op, ud, dd, tc] = await contract.getContent(0);
      expect(ud).to.equal(1);
    });

    it("Should produce an error after upDurping after an upDurp", async function() {
      await contract.makePost("hash");
      await contract.upDurp(0);
      await expect(contract.upDurp(0)).to.be.revertedWith("Already upDurped");
    });

    it("Should produce an error after downDurping after a downDurp", async function() {
      await contract.makePost("hash");
      await contract.downDurp(0);
      await expect(contract.downDurp(0)).to.be.revertedWith("Already downDurped");
    });

    it("Should be able to undo an upDurp", async function() {
      await contract.makePost("hash");
      await contract.upDurp(0);
      await contract.undoDurp(0);
      let [ipfsHash, op, ud, dd, tc] = await contract.getContent(0);
      expect(ud).to.equal(0);
    });

    it("Should be able to undo a downDurp", async function() {
      await contract.makePost("hash");
      await contract.downDurp(0);
      await contract.undoDurp(0);
      let [ipfsHash, op, ud, dd, tc] = await contract.getContent(0);
      expect(dd).to.equal(0);
    });

    it("Should produce an error after undoDurping content without a Durp", async function() {
      await contract.makePost("hash");
      await expect(contract.undoDurp(0)).to.be.revertedWith("Nothing to undo");
    });

    it("Should be able to detect if content is upDurped", async function() {
      await contract.makePost("hash");
      await contract.upDurp(0);
      expect(true).to.equal(await contract.isUpDurped(0));
    });

    it("Should be able to detect if content is downDurped", async function() {
      await contract.makePost("hash");
      await contract.downDurp(0);
      expect(true).to.equal(await contract.isDownDurped(0));
    });

    it("Should be able to detect if content is not upDurped", async function() {
      await contract.makePost("hash");
      expect(false).to.equal(await contract.isUpDurped(0));
    });

    it("Should be able to detect if content is not downDurped", async function() {
      await contract.makePost("hash");
      expect(false).to.equal(await contract.isDownDurped(0));
    });

    it("Should produce the right hotness", async function() {
      await contract.makePost("hash");
      await contract.upDurp(0);
      expect(await contract.getHotness(0)).to.equal(500000);
    });

  });
});
