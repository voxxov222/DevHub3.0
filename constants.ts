
export const NANO_BANANA_CONTRACT_CODE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Nano Banana (NBAN) ERC20 token
/// @notice 1,000,000,000 total supply, minted to deployer
contract NanoBanana is ERC20, Ownable {
    constructor() ERC20("Nano Banana", "NBAN") {
        // initialSupply = 1,000,000,000 * 10^18
        uint256 initialSupply = 1000000000 * (10 ** decimals());
        _mint(msg.sender, initialSupply);
    }

    /// @notice Owner-only emergency mint (optional).
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
`;
