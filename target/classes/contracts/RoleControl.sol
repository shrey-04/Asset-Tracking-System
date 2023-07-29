//SPDX-License-Identifier: Unlicensed
pragma solidity ^0.7.1;
pragma experimental ABIEncoderV2;

import "../contracts/rolecontrol/access/AccessControl.sol";
import "../contracts/rolecontrol/utils/structs/EnumerableSet.sol";

/**
 * This contract is created to create and assign the roles to the users.
 */
contract RoleControl is AccessControl {

    bytes32 public constant ROLE_SUPER_ADMIN = keccak256("ROLE_SUPER_ADMIN");
    bytes32 public constant ROLE_ADMIN = keccak256("ROLE_ADMIN");
    bytes32 public constant ROLE_USER = keccak256("ROLE_USER");
    bytes32 public constant ROLE_SUPPLIER = keccak256("ROLE_SUPPLIER");
    bytes32 public constant ROLE_CARRIER = keccak256("ROLE_CARRIER");
    bytes32 public constant ROLE_WAREHOUSE = keccak256("ROLE_WAREHOUSE");

    mapping(string => bytes32) public rolesMapping;

    using EnumerableSet for EnumerableSet.AddressSet;

    mapping(bytes32 => EnumerableSet.AddressSet) private _roleMembers;

    function setupRoles() public {
        rolesMapping["ROLE_SUPER_ADMIN"] = ROLE_SUPER_ADMIN;
        rolesMapping["ROLE_ADMIN"] = ROLE_ADMIN;
        rolesMapping["ROLE_USER"] = ROLE_USER;
        rolesMapping["ROLE_SUPPLIER"] = ROLE_SUPPLIER;
        rolesMapping["ROLE_CARRIER"] = ROLE_CARRIER;
        rolesMapping["ROLE_WAREHOUSE"] = ROLE_WAREHOUSE;

        _setRoleAdmin(ROLE_SUPER_ADMIN, ROLE_SUPER_ADMIN);
        _setRoleAdmin(ROLE_ADMIN, ROLE_ADMIN);
        _setRoleAdmin(ROLE_USER, ROLE_USER);
        _setRoleAdmin(ROLE_SUPPLIER, ROLE_SUPPLIER);
        _setRoleAdmin(ROLE_CARRIER, ROLE_CARRIER);
        _setRoleAdmin(ROLE_WAREHOUSE, ROLE_WAREHOUSE);
    }

    function grantRoles(string memory role, address add) public {
        _grantRole(rolesMapping[role], add);
        _roleMembers[rolesMapping[role]].add(add);
    }

    function getMembersFromRoles(string memory role) public view returns (address[] memory){
        uint256 index = _roleMembers[rolesMapping[role]].length();
        address[] memory _members = new address[](index);

        for (uint i = 0; i < index; i++) {
            _members[i] = _roleMembers[rolesMapping[role]].at(i);
        }

        return _members;
    }

    function revokeRoles(string memory role, address add) public {
        revokeRole(rolesMapping[role], add);
        _roleMembers[rolesMapping[role]].remove(add);
    }

    function addRole(string memory roleToAdd) public {
        bytes32 toByte_Role = keccak256(abi.encodePacked(roleToAdd));
        rolesMapping[roleToAdd] = toByte_Role;
        _setRoleAdmin(toByte_Role, toByte_Role);
    }

    function checkUserRole(string memory role, address add) public view returns (bool) {
        return hasRole(rolesMapping[role], add);
    }
}
