const { expect } = require("chai");


describe("Profile contract", function () {
  let contract;
  let owner;
  let addr1;

  beforeEach(async function () {
    const factory = await ethers.getContractFactory("Profile");
    [owner, addr1] = await ethers.getSigners();

    contract = await factory.deploy();
    await contract.deployed();
  });

  describe("Deployment", function() {

    it("Should set the correct owner", async function() {
      expect(await contract.owner()).to.equal(await owner.getAddress());
    });

    it("Should start with no featured subs", async function() {
      expect(await contract.getFeaturedSubCount()).to.equal(0);
    });

  });

  describe("Usernames", function() {

    it("Should be able to set my username", async function() {
      await contract.setUsername("test");
      expect(await contract.getUsername()).to.equal("test");
    });

    it("Should detect if a username is in use", async function() {
      await contract.setUsername("test");
      await expect(contract.setUsername("test")).to.be.revertedWith("Username is already taken");
    });

    it("Should be able to delete my username", async function() {
      await contract.setUsername("test");
      await contract.removeUsername();
      expect(await contract.getUsername()).to.equal("");
    });

  });

  describe("Featured Subs", function() {

    it("Should be able to add a featured sub", async function() {
      await contract.addFeaturedSub("0xc783df8a850f42e7f7e57013759c285caa701eb6", "funny");
      expect(await contract.getFeaturedSubCount()).to.equal(1);
    });

    it("Should store the right values in featuredSubs", async function() {
      await contract.addFeaturedSub("0xc783df8a850f42e7f7e57013759c285caa701eb6", "funny");
      await expect(await contract.getFeaturedSubCount()).to.equal(1);
      await contract.addFeaturedSub("0xead9c93b79ae7c1591b1fb5323bd777e86e150d4", "cool");
      const [sub1, name1] = await contract.getFeaturedSub(0);
      const [sub2, name2] = await contract.getFeaturedSub(1);
      expect(sub1.toString().toLowerCase()).to.equal("0xc783df8a850f42e7f7e57013759c285caa701eb6")
      expect(sub2.toString().toLowerCase()).to.equal("0xead9c93b79ae7c1591b1fb5323bd777e86e150d4")
      expect(name1).to.equal("funny");
      expect(name2).to.equal("cool");
    });

    it("Should detect if a sub is already featured", async function() {
      await contract.addFeaturedSub("0xc783df8a850f42e7f7e57013759c285caa701eb6", "funny");
      await expect(contract.addFeaturedSub("0xc783df8a850f42e7f7e57013759c285caa701eb6", "funny"))
      .to.be.revertedWith("SubDurple is already featured");
    });

    it("Should only let the owner feature subs", async function() {
      await expect(contract.connect(addr1).addFeaturedSub("0xc783df8a850f42e7f7e57013759c285caa701eb6", "funny"))
      .to.be.revertedWith("Only the owner can feature SubDurples");
    });

    it("Should be able to remove a featured sub", async function() {
      await contract.addFeaturedSub("0xc783df8a850f42e7f7e57013759c285caa701eb6", "funny");
      await contract.removeFeaturedSub("0xc783df8a850f42e7f7e57013759c285caa701eb6");
      expect(await contract.getFeaturedSubCount()).to.equal(0);
    });

    it("Should detect if a sub isn't featured when you try to remove one", async function() {
      await expect(contract.removeFeaturedSub("0xc783df8a850f42e7f7e57013759c285caa701eb6"))
      .to.be.revertedWith("SubDurple is not featured");
    });

    it("Should only let the owner remove subs", async function() {
      await contract.addFeaturedSub("0xc783df8a850f42e7f7e57013759c285caa701eb6", "funny");
      await expect(contract.connect(addr1).removeFeaturedSub("0xc783df8a850f42e7f7e57013759c285caa701eb6"))
      .to.be.revertedWith("Only the owner can remove featured SubDurples");
    });

  });
});
