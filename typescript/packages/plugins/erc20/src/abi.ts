import { parseAbi } from "viem";

export const ERC20_ABI = parseAbi([
	"function transfer(address to, uint256 amount) external returns (bool)",
	"function balanceOf(address account) external view returns (uint256)",
]);
