const { network } = require("hardhat");
const { verify } = require("../helper-function");
const { developmentChains } = require("../helper-hardhat-config");

module.exports = async function ({ deployments, getNamedAccounts }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  log("Deploying....");
  const todo = await deploy("Todo", {
    from: deployer,
    log: true,
    args: [],
  });
  log("Deployed!");

  if (!developmentChains.includes(network.name)) {
    await verify(todo.address, []);
  }
};

module.exports.tags = ["all", "todo"];
