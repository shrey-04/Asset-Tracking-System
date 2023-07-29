//SPDX-License-Identifier: Unlicensed
pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

import "./RoleControl.sol";

contract Logistics is RoleControl {

    constructor() {
        setupRoles();
    }

    enum AssetStates {CREATED, RECEIVED, IN_TRANSIT, FINAL_STATION, OUT_FOR_DELIVERY, DELIVERED, RETURNED, REFUSED, RETURN_COMPLETE} AssetStates assetStates;

    struct Asset {
        string assetId;
        string assetName;
        string info;
        string assetCreationTime;
        string userAddress;
        string finalDestination;
        uint8 quantity;
        AssetStates state;
        address callerAddress;
    }

    struct TrackingInformation {
        address owner;
        string allTrackingDetails;
    }

    Asset[] allAssets;

    mapping(string => Asset) public assetMapping;
    mapping(string => TrackingInformation[]) trackingInformation;

    event sendTrackingID(string trackId);
    event GenericLog(string logMsg);
    event LogMsgWithAddress(string logMsg, address addrss);

    function generateAsset(string memory id, string memory name, string memory info, string memory initTime, string memory source, string memory dest,
        uint8 quantity, string memory trackingMsg) public {

        if (hasRole(ROLE_SUPPLIER, msg.sender) || hasRole(ROLE_SUPER_ADMIN, msg.sender) || hasRole(ROLE_ADMIN, msg.sender)) {
            Asset memory singleAsset = Asset(id, name, info, initTime, source, dest, quantity, AssetStates.CREATED, msg.sender);

            assetMapping[id] = singleAsset;
            allAssets.push(singleAsset);

            trackingInformation[id].push(TrackingInformation(msg.sender, trackingMsg));

            emit sendTrackingID(id);
        } else {
            emit LogMsgWithAddress("Caller is not a supplier ", msg.sender);
            revert();
        }
    }

    function saveTrackingHistory(string memory assetId, string memory trackingMsg, uint merchantState) public {
        AssetStates currentState = assetMapping[assetId].state;
        AssetStates proposedState = AssetStates(merchantState);

        if (uint(currentState) < uint(proposedState) && (uint(proposedState) <= (uint(currentState) + 1) || proposedState == AssetStates.RETURNED)
            && currentState != AssetStates.DELIVERED) {

            checkRoleAuthority(proposedState);

            trackingInformation[assetId].push(TrackingInformation(msg.sender, trackingMsg));
            assetMapping[assetId].state = proposedState;

            emit GenericLog(trackingMsg);
        } else if (currentState == AssetStates.RETURNED && proposedState == AssetStates.RETURN_COMPLETE) {
            trackingInformation[assetId].push(TrackingInformation(msg.sender, trackingMsg));
            assetMapping[assetId].state = proposedState;

            emit GenericLog(trackingMsg);
        } else if (currentState == AssetStates.RETURNED) {
            emit GenericLog("Already requested for cancellation");
        } else if (currentState == AssetStates.DELIVERED) {
            emit GenericLog("Package is already delivered");
        } else {
            emit GenericLog("Something went wrong");
            revert();
        }
    }

    function checkRoleAuthority(AssetStates proposedState) private view {
        if (proposedState == AssetStates.RETURNED) {
            require(hasRole(ROLE_USER, msg.sender) || hasRole(ROLE_SUPER_ADMIN, msg.sender) || hasRole(ROLE_ADMIN, msg.sender), "Caller is not a supplier");
        }
        else if (proposedState == AssetStates.RECEIVED) {
            require(hasRole(ROLE_SUPPLIER, msg.sender) || hasRole(ROLE_SUPER_ADMIN, msg.sender) || hasRole(ROLE_ADMIN, msg.sender), "Caller is not a supplier");
        }
        else if ((proposedState == AssetStates.IN_TRANSIT) || (proposedState == AssetStates.OUT_FOR_DELIVERY) || (proposedState == AssetStates.DELIVERED)) {
            require(hasRole(ROLE_CARRIER, msg.sender) || hasRole(ROLE_SUPER_ADMIN, msg.sender) || hasRole(ROLE_ADMIN, msg.sender), "Caller is not a carrier");
        }
        else if (proposedState == AssetStates.FINAL_STATION) {
            require(hasRole(ROLE_WAREHOUSE, msg.sender) || hasRole(ROLE_SUPER_ADMIN, msg.sender) || hasRole(ROLE_ADMIN, msg.sender), "Caller is not a warehouse");
        }
        else {
            require(false, "Role is not defined for this state");
        }
    }

    //This function is created to store the asset-transaction mappings.
    function returnAllAssets() public view returns (Asset[] memory){
        return allAssets;
    }

    //This function is created to fetch the transaction details for particular asset.
    function returnSingleTrackingInfo(string memory id) public view returns (TrackingInformation[] memory){
        return trackingInformation[id];
    }
}
