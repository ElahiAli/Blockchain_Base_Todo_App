const { getNamedAccounts, deployments, ethers } = require("hardhat");

async function createTask() {
  const deployer = (await getNamedAccounts()).deployer;
  //   await deployments.fixture(["all"]);
  console.log(`deployer Address is: ${deployer}`);

  console.log("getting the Contract");
  const todo = await ethers.getContract("Todo", deployer);

  console.log("initializing...");
  const fee = ethers.utils.parseEther("1");
  const initTx = await todo.initialPayment("Ali Elahi", { value: fee });
  await initTx.wait(1);

  console.log("creating a task...");
  const createTaskTx = await todo.createTask(
    "writing scripts",
    "just for remembering",
    0
  );
  await createTaskTx.wait(1);

  const id = 1;
  const getTaskTx = await todo.getTask(id);
  console.log(`task with id ${id} is ${getTaskTx}`);

  const all = await todo.getAllTasks();
  console.log(`all task : ${all}`);
}

createTask()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error, process.exit(1));
  });
