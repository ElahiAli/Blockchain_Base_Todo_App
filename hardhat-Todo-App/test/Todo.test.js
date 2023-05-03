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

        it("users payment status should be true", async () => {
          await todo.initialPayment("LaraEmerson", { value: fee.toString() });
          const payStatus = await todo.getUserPaymentStatus();
          assert.equal(payStatus, true);
        });
      });

      describe("createTask", function () {
        it("only owner can create new task", async () => {
          await expect(
            todo
              .connect(client)
              .createTask("Todo Unit Test", "writing test for Todo contract", 1)
          ).to.be.reverted;
        });

        it("before creating the first task , payment needed", async () => {
          await expect(
            todo.createTask(
              "Todo Unit Test",
              "writing test for Todo contract",
              1
            )
          ).to.be.reverted;
        });

        it("emit an event after creating a new task", async () => {
          const fee = ethers.utils.parseEther("1");
          await todo.initialPayment("LaraEmerson", { value: fee });
          expect(
            await todo.createTask(
              "Todo Unit Test",
              "writing test for Todo contract",
              1
            )
          ).to.emit(todo, "TaskCreated");
        });
      });

      describe("updateTask", function () {
        beforeEach(async function () {
          const fee = ethers.utils.parseEther("1");
          await todo.initialPayment("LaraEmerson", { value: fee });
          await todo.createTask(
            "Todo Unit Test",
            "writing test for Todo contract",
            1
          );
        });

        it("only owner can update a task", async () => {
          await expect(todo.connect(client).updateTask(2, 1)).to.be.reverted;
        });

        it("updating the status of the task", async () => {
          const initialTask = await todo.getTask(1);
          const initialStatus = initialTask[2];

          const updateTx = await todo.updateTask(2, 1);
          await updateTx.wait(1);

          const updatedTask = await todo.getTask(1);
          const updatedStatus = updatedTask[2];

          assert.equal(initialStatus.toString(), "1");
          assert.equal(updatedStatus.toString(), "2");
        });

        it("emit an event after updating a task", async () => {
          expect(await todo.updateTask(2, 1)).to.emit(todo, "TaskUpdated");
        });
      });

      describe("getAllTasks", function () {
        beforeEach(async function () {
          const fee = ethers.utils.parseEther("1");
          await todo.initialPayment("LaraEmerson", { value: fee });
          await todo.createTask(
            "Todo Unit Test",
            "writing test for Todo contract",
            1
          );
          await todo.createTask(
            "Checking getAllTasks Function",
            "this is just a normal test",
            1
          );
        });

        it("only owner can see all the tasks", async () => {
          await expect(todo.connect(client).getAllTasks()).to.be.reverted;
        });

        it("getting all the tasks", async () => {
          const taskList = await todo.getAllTasks();
          const taskCount = await todo.getTaskCount();
          let allTaskList = [];
          for (let index = 0; index < taskCount; index++) {
            allTaskList.push(taskList[index][0]);
          }

          assert.equal(allTaskList[0], "Todo Unit Test");
          assert.equal(allTaskList[1], "Checking getAllTasks Function");
        });
      });
    });
