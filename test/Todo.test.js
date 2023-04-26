const { network, getNamedAccounts, deployments, ethers } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const { assert, expect } = require("chai");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Todo", function () {
      let deployer, client, todo;
      beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer;
        client = (await getNamedAccounts()).client;
        await deployments.fixture(["all"]);
        todo = await ethers.getContract("Todo", deployer);
      });

      describe("constructor", function () {
        it("initialize variable correctly", async () => {
          const owner = await todo.getOwner();

          assert.equal(owner, deployer);
        });
      });

      describe("initialPayment", function () {
        let fee;
        beforeEach(async function () {
          fee = ethers.utils.parseEther("1");
        });

        it("should revert if value is less than minimum", async () => {
          const Fee = ethers.utils.parseEther("0.01");
          await expect(
            todo.initialPayment("LaraEmerson", { value: Fee.toString() })
          ).to.be.revertedWith("Not enough ETH.");
        });

        it("emit an event when payment happend.", async () => {
          expect(
            await todo.initialPayment("LaraEmerson", { value: fee.toString() })
          ).to.emit(todo, "Payed");
        });

        it("users name should return his/her address", async () => {
          await todo.initialPayment("LaraEmerson", { value: fee.toString() });
          const userAddress = await todo.getUserAddress("LaraEmerson");
          assert.equal(userAddress, deployer);
        });
      });

      describe("createTask", function () {
        beforeEach(async function () {});
        it("");
      });
    });
