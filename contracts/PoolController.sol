// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./DuckToken.sol";
import "./Pool.sol";

contract PoolController is Ownable {
	
	// DUCK TOKEN
	DuckToken public duck;
	// Array of pools
	Pool[] public pools;
	
	address public devAddress;
    address public ddimTokenAddress;
    address public drainAddress;

	// Mapping is address is pool
	mapping(address => bool) public canMint;

	event NewPool(address indexed poolAddress, address lpToken);

	constructor(address _duckTokenAddress, address _devAddress, address _ddimTokenAddress, address _drainAddress) public {
		duck = DuckToken(_duckTokenAddress);
		devAddress = _devAddress;
		ddimTokenAddress = _ddimTokenAddress;
		drainAddress = _drainAddress;
	}

	function setDrainAddress(address _drainAddress) public onlyOwner {
		drainAddress = _drainAddress;
	}
	
	// Add a new pool. Can only be called by the owner.
	function newPool(address lpToken, uint startingBlock, uint[] memory blocks, uint[] memory farmingSupplies) public onlyOwner {
		Pool pool = new Pool(lpToken, startingBlock, blocks, farmingSupplies);
		pools.push(pool);

		canMint[address(pool)] = true;
		emit NewPool(address(pool), lpToken);
	}

	// Update already created pool by adding NEW period. Can only be called by the owner.
	function addPeriod(uint poolIndex, uint startingBlock, uint blocks, uint farmingSupply) public onlyOwner {
		pools[poolIndex].addPeriod(startingBlock, blocks, farmingSupply);
	}
	
	// Add new revenue for a pool. Can only be called by the owner. 
	function addRevenue(uint poolIndex, address tokenAddress, uint amount, address _revenueSource) public onlyOwner {
	    pools[poolIndex].addRevenue(tokenAddress, amount, _revenueSource);
	}

	function changeEmergencyWithdrawStatus(uint poolIndex, bool status) public onlyOwner {
		pools[poolIndex].changeEmergencyWithdrawStatus(status);
	}

	// Mint DUCK TOKEN. Can be called by pools only
	function mint(address to, uint value) public {
		require(canMint[msg.sender], "only pools");
		duck.transferFrom(drainAddress, to, value);
	}
}