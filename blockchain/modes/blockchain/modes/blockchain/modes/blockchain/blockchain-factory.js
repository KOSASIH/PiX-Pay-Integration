const SimulatedAdapter = require("./modes/simulated.adapter");
const SandboxAdapter = require("./modes/sandbox.adapter");
const MainnetAdapter = require("./modes/mainnet.adapter");

function createBlockchain() {
  const mode = process.env.BLOCKCHAIN_MODE || "simulated";

  switch (mode) {
    case "sandbox":
      return new SandboxAdapter();
    case "mainnet":
      return new MainnetAdapter();
    case "simulated":
    default:
      return new SimulatedAdapter();
  }
}

module.exports = createBlockchain;
