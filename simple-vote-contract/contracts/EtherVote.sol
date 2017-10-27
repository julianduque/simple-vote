pragma solidity ^0.4.4;

contract EtherVote {
  event LogProposal (string proposal, bytes32 proposalHash, address addr);
  event LogVote (bytes32 proposalHash, bool support, address addr);

  function propose (string proposal, bytes32 proposalHash) public {
    LogProposal(proposal, proposalHash, msg.sender);
  }

  function vote (bytes32 proposalHash, bool support) public {
    LogVote(proposalHash, support, msg.sender);
  }

  function () public {
    revert();
  }
}
