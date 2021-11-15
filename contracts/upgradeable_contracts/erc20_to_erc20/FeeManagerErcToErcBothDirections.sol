pragma solidity 0.4.24;

import "../../interfaces/IBurnableMintableERC677Token.sol";
import "../../libraries/Address.sol";
import "../ValidatorsFeeManager.sol";
import "../ERC677Storage.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/AddressUtils.sol";

contract FeeManagerErcToErcBothDirections is ValidatorsFeeManager {
    bytes32 internal constant ERC20_TOKEN = 0x15d63b18dbc21bf4438b7972d80076747e1d93c4f87552fe498c90cbde51665e; // keccak256(abi.encodePacked("erc20token"))
    bytes32 internal constant ERC677_TOKEN = 0xa8b0ade3e2b734f043ce298aca4cc8d19d74270223f34531d0988b7d00cba21d; // keccak256(abi.encodePacked("erc677token"))

    function getFeeManagerMode() external pure returns (bytes4) {
        return 0xd7de965f; // bytes4(keccak256(abi.encodePacked("manages-both-directions")))
    }

    function erc20token() public view returns (ERC20) {
        return ERC20(addressStorage[ERC20_TOKEN]);
    }

    function erc677token() public view returns (IBurnableMintableERC677Token) {
        return IBurnableMintableERC677Token(addressStorage[ERC677_TOKEN]);
    }

    function onAffirmationFeeDistribution(address _rewardAddress, uint256 _fee) internal {
        erc20token().transfer(_rewardAddress, _fee);
    }

    function onSignatureFeeDistribution(address _rewardAddress, uint256 _fee) internal {
        erc677token().mint(_rewardAddress, _fee);
    }
}
