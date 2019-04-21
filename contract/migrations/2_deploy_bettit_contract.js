const Migrations = artifacts.require("Bettit");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
};
