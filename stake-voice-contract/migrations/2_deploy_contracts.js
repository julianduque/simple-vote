const EtherVote = artifacts.require("./EtherVote.sol")

module.exports = function (deployer) {
  deployer.deploy(EtherVote)
}
