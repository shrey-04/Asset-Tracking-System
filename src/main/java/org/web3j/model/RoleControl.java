package org.web3j.model;

import io.reactivex.Flowable;
import io.reactivex.functions.Function;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.Callable;
import org.web3j.abi.EventEncoder;
import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.Address;
import org.web3j.abi.datatypes.Bool;
import org.web3j.abi.datatypes.DynamicArray;
import org.web3j.abi.datatypes.Event;
import org.web3j.abi.datatypes.Type;
import org.web3j.abi.datatypes.generated.Bytes32;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameter;
import org.web3j.protocol.core.RemoteCall;
import org.web3j.protocol.core.RemoteFunctionCall;
import org.web3j.protocol.core.methods.request.EthFilter;
import org.web3j.protocol.core.methods.response.BaseEventResponse;
import org.web3j.protocol.core.methods.response.Log;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.tx.Contract;
import org.web3j.tx.TransactionManager;
import org.web3j.tx.gas.ContractGasProvider;

/**
 * <p>Auto generated code.
 * <p><strong>Do not modify!</strong>
 * <p>Please use the <a href="https://docs.web3j.io/command_line.html">web3j command line tools</a>,
 * or the org.web3j.codegen.SolidityFunctionWrapperGenerator in the 
 * <a href="https://github.com/web3j/web3j/tree/master/codegen">codegen module</a> to update.
 *
 * <p>Generated with web3j version 4.8.7.
 */
@SuppressWarnings("rawtypes")
public class RoleControl extends Contract {
    public static final String BINARY = "608060405234801561001057600080fd5b50611220806100206000396000f3fe608060405234801561001057600080fd5b506004361061012c5760003560e01c80638cb92832116100ad578063ab2ca63d11610071578063ab2ca63d14610254578063b941719e1461025c578063d391014b14610264578063d547741f1461026c578063ff50a32e1461027f5761012c565b80638cb92832146101fe5780639172fac91461020657806391d1485414610226578063a217fddf14610239578063a5e834a6146102415761012c565b80633e96e868116100f45780633e96e868146101b557806361f86a06146101c85780636cc8bb49146101db5780637357f421146101e35780637635cfed146101f65761012c565b806301ffc9a7146101315780631c432c601461015a578063248a9ca31461016d5780632f2ff15d1461018d57806336568abe146101a2575b600080fd5b61014461013f366004610ed8565b610287565b60405161015191906110ef565b60405180910390f35b610144610168366004610f3b565b6102b2565b61018061017b366004610e94565b6102e3565b60405161015191906110fa565b6101a061019b366004610eac565b6102f8565b005b6101a06101b0366004610eac565b610321565b6101a06101c3366004610f00565b610370565b6101a06101d6366004610f3b565b6103c6565b610180610431565b6101806101f1366004610f00565b610455565b6101a0610472565b6101806106f4565b610219610214366004610f00565b610718565b60405161015191906110a2565b610144610234366004610eac565b61081f565b610180610848565b6101a061024f366004610f3b565b61084d565b6101806108b8565b6101806108dc565b610180610900565b6101a061027a366004610eac565b610924565b610180610943565b60006001600160e01b03198216637965db0b60e01b14806102ac57506102ac82610967565b92915050565b60006102dc6001846040516102c79190610f7f565b9081526020016040518091039020548361081f565b9392505050565b60009081526020819052604090206001015490565b610301826102e3565b6103128161030d610980565b610984565b61031c83836109e8565b505050565b610329610980565b6001600160a01b0316816001600160a01b0316146103625760405162461bcd60e51b81526004016103599061116b565b60405180910390fd5b61036c8282610a6d565b5050565b6000816040516020016103839190610f7f565b604051602081830303815290604052805190602001209050806001836040516103ac9190610f7f565b9081526040519081900360200190205561036c8180610af0565b6103ee6001836040516103d99190610f7f565b908152602001604051809103902054826109e8565b61031c81600260006001866040516104069190610f7f565b9081526020016040518091039020548152602001908152602001600020610b4390919063ffffffff16565b7f0d6cceaa37e5e7618474d8eb3448c6d3f2360829c16d7bd3a0564a84b4ba3d5881565b805160208183018101805160018252928201919093012091525481565b7f0d6cceaa37e5e7618474d8eb3448c6d3f2360829c16d7bd3a0564a84b4ba3d5860016040516104a190610f9b565b9081526020016040518091039020819055507f2172861495e7b85edac73e3cd5fbb42dd675baadf627720e687bcfdaca02509660016040516104e290610fd0565b9081526020016040518091039020819055507fb8ca5430e403d88aa14f3587e1aa5a2121b1acebf2201dde30800337ea6af075600160405161052390611018565b9081526020016040518091039020819055507f1b39c7c0c375780ec21b274a128c58d4089565cb683c2f99914de8f80e9fb852600160405161056490610fb7565b9081526020016040518091039020819055507f4c0b5511aa21b1d04ba2469999afe0d4e88f0c2808c1f6757d340f3c452adbb460016040516105a590611000565b9081526020016040518091039020819055507f24e10bb56ae192d65e460af48b631524c4b630b41a8f64398a35180291cd161260016040516105e690610fe6565b908152604051908190036020019020556106207f0d6cceaa37e5e7618474d8eb3448c6d3f2360829c16d7bd3a0564a84b4ba3d5880610af0565b61064a7f2172861495e7b85edac73e3cd5fbb42dd675baadf627720e687bcfdaca02509680610af0565b6106747fb8ca5430e403d88aa14f3587e1aa5a2121b1acebf2201dde30800337ea6af07580610af0565b61069e7f1b39c7c0c375780ec21b274a128c58d4089565cb683c2f99914de8f80e9fb85280610af0565b6106c87f4c0b5511aa21b1d04ba2469999afe0d4e88f0c2808c1f6757d340f3c452adbb480610af0565b6106f27f24e10bb56ae192d65e460af48b631524c4b630b41a8f64398a35180291cd161280610af0565b565b7f24e10bb56ae192d65e460af48b631524c4b630b41a8f64398a35180291cd161281565b60606000610755600260006001866040516107339190610f7f565b9081526020016040518091039020548152602001908152602001600020610b58565b905060608167ffffffffffffffff8111801561077057600080fd5b5060405190808252806020026020018201604052801561079a578160200160208202803683370190505b50905060005b82811015610817576107eb81600260006001896040516107c09190610f7f565b9081526020016040518091039020548152602001908152602001600020610b6390919063ffffffff16565b8282815181106107f757fe5b6001600160a01b03909216602092830291909101909101526001016107a0565b509392505050565b6000918252602082815260408084206001600160a01b0393909316845291905290205460ff1690565b600081565b6108756001836040516108609190610f7f565b90815260200160405180910390205482610924565b61031c816002600060018660405161088d9190610f7f565b9081526020016040518091039020548152602001908152602001600020610b6f90919063ffffffff16565b7f1b39c7c0c375780ec21b274a128c58d4089565cb683c2f99914de8f80e9fb85281565b7fb8ca5430e403d88aa14f3587e1aa5a2121b1acebf2201dde30800337ea6af07581565b7f2172861495e7b85edac73e3cd5fbb42dd675baadf627720e687bcfdaca02509681565b61092d826102e3565b6109398161030d610980565b61031c8383610a6d565b7f4c0b5511aa21b1d04ba2469999afe0d4e88f0c2808c1f6757d340f3c452adbb481565b6001600160e01b031981166301ffc9a760e01b14919050565b3390565b61098e828261081f565b61036c576109a6816001600160a01b03166014610b84565b6109b1836020610b84565b6040516020016109c292919061102d565b60408051601f198184030181529082905262461bcd60e51b825261035991600401611103565b6109f2828261081f565b61036c576000828152602081815260408083206001600160a01b03851684529091529020805460ff19166001179055610a29610980565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b610a77828261081f565b1561036c576000828152602081815260408083206001600160a01b03851684529091529020805460ff19169055610aac610980565b6001600160a01b0316816001600160a01b0316837ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b60405160405180910390a45050565b6000610afb836102e3565b600084815260208190526040808220600101859055519192508391839186917fbd79b86ffe0ab8e8776151514217cd7cacd52c909f66475c3af44e129f0b00ff9190a4505050565b60006102dc836001600160a01b038416610cad565b60006102ac82610cf7565b60006102dc8383610cfb565b60006102dc836001600160a01b038416610d1f565b6060808260020260020167ffffffffffffffff81118015610ba457600080fd5b506040519080825280601f01601f191660200182016040528015610bcf576020820181803683370190505b509050600360fc1b81600081518110610be457fe5b60200101906001600160f81b031916908160001a905350600f60fb1b81600181518110610c0d57fe5b60200101906001600160f81b031916908160001a905350600160028402015b6001811115610c8e576f181899199a1a9b1b9c1cb0b131b232b360811b85600f1660108110610c5757fe5b1a60f81b828281518110610c6757fe5b60200101906001600160f81b031916908160001a90535060049490941c9360001901610c2c565b5083156102dc5760405162461bcd60e51b815260040161035990611136565b6000610cb98383610de7565b610cef575081546001818101845560008481526020808220909301849055845484825282860190935260409020919091556102ac565b5060006102ac565b5490565b6000826000018281548110610d0c57fe5b9060005260206000200154905092915050565b60008181526001830160205260408120548015610ddd5783546000198083019101808214610d97576000866000018281548110610d5857fe5b9060005260206000200154905080876000018481548110610d7557fe5b6000918252602080832090910192909255918252600188019052604090208390555b8554869080610da257fe5b6001900381819060005260206000200160009055905585600101600086815260200190815260200160002060009055600193505050506102ac565b60009150506102ac565b60009081526001919091016020526040902054151590565b80356001600160a01b03811681146102ac57600080fd5b600082601f830112610e26578081fd5b813567ffffffffffffffff80821115610e3d578283fd5b604051601f8301601f191681016020018281118282101715610e5d578485fd5b604052828152925082848301602001861015610e7857600080fd5b8260208601602083013760006020848301015250505092915050565b600060208284031215610ea5578081fd5b5035919050565b60008060408385031215610ebe578081fd5b82359150610ecf8460208501610dff565b90509250929050565b600060208284031215610ee9578081fd5b81356001600160e01b0319811681146102dc578182fd5b600060208284031215610f11578081fd5b813567ffffffffffffffff811115610f27578182fd5b610f3384828501610e16565b949350505050565b60008060408385031215610f4d578182fd5b823567ffffffffffffffff811115610f63578283fd5b610f6f85828601610e16565b925050610ecf8460208501610dff565b60008251610f918184602087016111ba565b9190910192915050565b6f2927a622afa9aaa822a92fa0a226a4a760811b815260100190565b6c2927a622afa9aaa8282624a2a960991b8152600d0190565b692927a622afa0a226a4a760b11b8152600a0190565b6d524f4c455f57415245484f55534560901b8152600e0190565b6b2927a622afa1a0a92924a2a960a11b8152600c0190565b682927a622afaaa9a2a960b91b815260090190565b60007f416363657373436f6e74726f6c3a206163636f756e7420000000000000000000825283516110658160178501602088016111ba565b7001034b99036b4b9b9b4b733903937b6329607d1b60179184019182015283516110968160288401602088016111ba565b01602801949350505050565b6020808252825182820181905260009190848201906040850190845b818110156110e35783516001600160a01b0316835292840192918401916001016110be565b50909695505050505050565b901515815260200190565b90815260200190565b60006020825282518060208401526111228160408501602087016111ba565b601f01601f19169190910160400192915050565b6020808252818101527f537472696e67733a20686578206c656e67746820696e73756666696369656e74604082015260600190565b6020808252602f908201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560408201526e103937b632b9903337b91039b2b63360891b606082015260800190565b60005b838110156111d55781810151838201526020016111bd565b838111156111e4576000848401525b5050505056fea264697066735822122015fd27c7a218873268d364ab3a57d3da90194963b2200a9b498528b0df542cfe64736f6c63430007010033";

    public static final String FUNC_DEFAULT_ADMIN_ROLE = "DEFAULT_ADMIN_ROLE";

    public static final String FUNC_ROLE_ADMIN = "ROLE_ADMIN";

    public static final String FUNC_ROLE_CARRIER = "ROLE_CARRIER";

    public static final String FUNC_ROLE_SUPER_ADMIN = "ROLE_SUPER_ADMIN";

    public static final String FUNC_ROLE_SUPPLIER = "ROLE_SUPPLIER";

    public static final String FUNC_ROLE_USER = "ROLE_USER";

    public static final String FUNC_ROLE_WAREHOUSE = "ROLE_WAREHOUSE";

    public static final String FUNC_ADDROLE = "addRole";

    public static final String FUNC_CHECKUSERROLE = "checkUserRole";

    public static final String FUNC_GETMEMBERSFROMROLES = "getMembersFromRoles";

    public static final String FUNC_GETROLEADMIN = "getRoleAdmin";

    public static final String FUNC_GRANTROLE = "grantRole";

    public static final String FUNC_GRANTROLES = "grantRoles";

    public static final String FUNC_HASROLE = "hasRole";

    public static final String FUNC_RENOUNCEROLE = "renounceRole";

    public static final String FUNC_REVOKEROLE = "revokeRole";

    public static final String FUNC_REVOKEROLES = "revokeRoles";

    public static final String FUNC_ROLESMAPPING = "rolesMapping";

    public static final String FUNC_SETUPROLES = "setupRoles";

    public static final String FUNC_SUPPORTSINTERFACE = "supportsInterface";

    public static final Event ROLEADMINCHANGED_EVENT = new Event("RoleAdminChanged", 
            Arrays.<TypeReference<?>>asList(new TypeReference<Bytes32>(true) {}, new TypeReference<Bytes32>(true) {}, new TypeReference<Bytes32>(true) {}));
    ;

    public static final Event ROLEGRANTED_EVENT = new Event("RoleGranted", 
            Arrays.<TypeReference<?>>asList(new TypeReference<Bytes32>(true) {}, new TypeReference<Address>(true) {}, new TypeReference<Address>(true) {}));
    ;

    public static final Event ROLEREVOKED_EVENT = new Event("RoleRevoked", 
            Arrays.<TypeReference<?>>asList(new TypeReference<Bytes32>(true) {}, new TypeReference<Address>(true) {}, new TypeReference<Address>(true) {}));
    ;

    @Deprecated
    protected RoleControl(String contractAddress, Web3j web3j, Credentials credentials, BigInteger gasPrice, BigInteger gasLimit) {
        super(BINARY, contractAddress, web3j, credentials, gasPrice, gasLimit);
    }

    protected RoleControl(String contractAddress, Web3j web3j, Credentials credentials, ContractGasProvider contractGasProvider) {
        super(BINARY, contractAddress, web3j, credentials, contractGasProvider);
    }

    @Deprecated
    protected RoleControl(String contractAddress, Web3j web3j, TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit) {
        super(BINARY, contractAddress, web3j, transactionManager, gasPrice, gasLimit);
    }

    protected RoleControl(String contractAddress, Web3j web3j, TransactionManager transactionManager, ContractGasProvider contractGasProvider) {
        super(BINARY, contractAddress, web3j, transactionManager, contractGasProvider);
    }

    public List<RoleAdminChangedEventResponse> getRoleAdminChangedEvents(TransactionReceipt transactionReceipt) {
        List<Contract.EventValuesWithLog> valueList = extractEventParametersWithLog(ROLEADMINCHANGED_EVENT, transactionReceipt);
        ArrayList<RoleAdminChangedEventResponse> responses = new ArrayList<RoleAdminChangedEventResponse>(valueList.size());
        for (Contract.EventValuesWithLog eventValues : valueList) {
            RoleAdminChangedEventResponse typedResponse = new RoleAdminChangedEventResponse();
            typedResponse.log = eventValues.getLog();
            typedResponse.role = (byte[]) eventValues.getIndexedValues().get(0).getValue();
            typedResponse.previousAdminRole = (byte[]) eventValues.getIndexedValues().get(1).getValue();
            typedResponse.newAdminRole = (byte[]) eventValues.getIndexedValues().get(2).getValue();
            responses.add(typedResponse);
        }
        return responses;
    }

    public Flowable<RoleAdminChangedEventResponse> roleAdminChangedEventFlowable(EthFilter filter) {
        return web3j.ethLogFlowable(filter).map(new Function<Log, RoleAdminChangedEventResponse>() {
            @Override
            public RoleAdminChangedEventResponse apply(Log log) {
                Contract.EventValuesWithLog eventValues = extractEventParametersWithLog(ROLEADMINCHANGED_EVENT, log);
                RoleAdminChangedEventResponse typedResponse = new RoleAdminChangedEventResponse();
                typedResponse.log = log;
                typedResponse.role = (byte[]) eventValues.getIndexedValues().get(0).getValue();
                typedResponse.previousAdminRole = (byte[]) eventValues.getIndexedValues().get(1).getValue();
                typedResponse.newAdminRole = (byte[]) eventValues.getIndexedValues().get(2).getValue();
                return typedResponse;
            }
        });
    }

    public Flowable<RoleAdminChangedEventResponse> roleAdminChangedEventFlowable(DefaultBlockParameter startBlock, DefaultBlockParameter endBlock) {
        EthFilter filter = new EthFilter(startBlock, endBlock, getContractAddress());
        filter.addSingleTopic(EventEncoder.encode(ROLEADMINCHANGED_EVENT));
        return roleAdminChangedEventFlowable(filter);
    }

    public List<RoleGrantedEventResponse> getRoleGrantedEvents(TransactionReceipt transactionReceipt) {
        List<Contract.EventValuesWithLog> valueList = extractEventParametersWithLog(ROLEGRANTED_EVENT, transactionReceipt);
        ArrayList<RoleGrantedEventResponse> responses = new ArrayList<RoleGrantedEventResponse>(valueList.size());
        for (Contract.EventValuesWithLog eventValues : valueList) {
            RoleGrantedEventResponse typedResponse = new RoleGrantedEventResponse();
            typedResponse.log = eventValues.getLog();
            typedResponse.role = (byte[]) eventValues.getIndexedValues().get(0).getValue();
            typedResponse.account = (String) eventValues.getIndexedValues().get(1).getValue();
            typedResponse.sender = (String) eventValues.getIndexedValues().get(2).getValue();
            responses.add(typedResponse);
        }
        return responses;
    }

    public Flowable<RoleGrantedEventResponse> roleGrantedEventFlowable(EthFilter filter) {
        return web3j.ethLogFlowable(filter).map(new Function<Log, RoleGrantedEventResponse>() {
            @Override
            public RoleGrantedEventResponse apply(Log log) {
                Contract.EventValuesWithLog eventValues = extractEventParametersWithLog(ROLEGRANTED_EVENT, log);
                RoleGrantedEventResponse typedResponse = new RoleGrantedEventResponse();
                typedResponse.log = log;
                typedResponse.role = (byte[]) eventValues.getIndexedValues().get(0).getValue();
                typedResponse.account = (String) eventValues.getIndexedValues().get(1).getValue();
                typedResponse.sender = (String) eventValues.getIndexedValues().get(2).getValue();
                return typedResponse;
            }
        });
    }

    public Flowable<RoleGrantedEventResponse> roleGrantedEventFlowable(DefaultBlockParameter startBlock, DefaultBlockParameter endBlock) {
        EthFilter filter = new EthFilter(startBlock, endBlock, getContractAddress());
        filter.addSingleTopic(EventEncoder.encode(ROLEGRANTED_EVENT));
        return roleGrantedEventFlowable(filter);
    }

    public List<RoleRevokedEventResponse> getRoleRevokedEvents(TransactionReceipt transactionReceipt) {
        List<Contract.EventValuesWithLog> valueList = extractEventParametersWithLog(ROLEREVOKED_EVENT, transactionReceipt);
        ArrayList<RoleRevokedEventResponse> responses = new ArrayList<RoleRevokedEventResponse>(valueList.size());
        for (Contract.EventValuesWithLog eventValues : valueList) {
            RoleRevokedEventResponse typedResponse = new RoleRevokedEventResponse();
            typedResponse.log = eventValues.getLog();
            typedResponse.role = (byte[]) eventValues.getIndexedValues().get(0).getValue();
            typedResponse.account = (String) eventValues.getIndexedValues().get(1).getValue();
            typedResponse.sender = (String) eventValues.getIndexedValues().get(2).getValue();
            responses.add(typedResponse);
        }
        return responses;
    }

    public Flowable<RoleRevokedEventResponse> roleRevokedEventFlowable(EthFilter filter) {
        return web3j.ethLogFlowable(filter).map(new Function<Log, RoleRevokedEventResponse>() {
            @Override
            public RoleRevokedEventResponse apply(Log log) {
                Contract.EventValuesWithLog eventValues = extractEventParametersWithLog(ROLEREVOKED_EVENT, log);
                RoleRevokedEventResponse typedResponse = new RoleRevokedEventResponse();
                typedResponse.log = log;
                typedResponse.role = (byte[]) eventValues.getIndexedValues().get(0).getValue();
                typedResponse.account = (String) eventValues.getIndexedValues().get(1).getValue();
                typedResponse.sender = (String) eventValues.getIndexedValues().get(2).getValue();
                return typedResponse;
            }
        });
    }

    public Flowable<RoleRevokedEventResponse> roleRevokedEventFlowable(DefaultBlockParameter startBlock, DefaultBlockParameter endBlock) {
        EthFilter filter = new EthFilter(startBlock, endBlock, getContractAddress());
        filter.addSingleTopic(EventEncoder.encode(ROLEREVOKED_EVENT));
        return roleRevokedEventFlowable(filter);
    }

    public RemoteFunctionCall<byte[]> DEFAULT_ADMIN_ROLE() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(FUNC_DEFAULT_ADMIN_ROLE, 
                Arrays.<Type>asList(), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Bytes32>() {}));
        return executeRemoteCallSingleValueReturn(function, byte[].class);
    }

    public RemoteFunctionCall<byte[]> ROLE_ADMIN() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(FUNC_ROLE_ADMIN, 
                Arrays.<Type>asList(), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Bytes32>() {}));
        return executeRemoteCallSingleValueReturn(function, byte[].class);
    }

    public RemoteFunctionCall<byte[]> ROLE_CARRIER() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(FUNC_ROLE_CARRIER, 
                Arrays.<Type>asList(), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Bytes32>() {}));
        return executeRemoteCallSingleValueReturn(function, byte[].class);
    }

    public RemoteFunctionCall<byte[]> ROLE_SUPER_ADMIN() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(FUNC_ROLE_SUPER_ADMIN, 
                Arrays.<Type>asList(), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Bytes32>() {}));
        return executeRemoteCallSingleValueReturn(function, byte[].class);
    }

    public RemoteFunctionCall<byte[]> ROLE_SUPPLIER() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(FUNC_ROLE_SUPPLIER, 
                Arrays.<Type>asList(), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Bytes32>() {}));
        return executeRemoteCallSingleValueReturn(function, byte[].class);
    }

    public RemoteFunctionCall<byte[]> ROLE_USER() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(FUNC_ROLE_USER, 
                Arrays.<Type>asList(), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Bytes32>() {}));
        return executeRemoteCallSingleValueReturn(function, byte[].class);
    }

    public RemoteFunctionCall<byte[]> ROLE_WAREHOUSE() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(FUNC_ROLE_WAREHOUSE, 
                Arrays.<Type>asList(), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Bytes32>() {}));
        return executeRemoteCallSingleValueReturn(function, byte[].class);
    }

    public RemoteFunctionCall<TransactionReceipt> addRole(String roleToAdd) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_ADDROLE, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Utf8String(roleToAdd)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<Boolean> checkUserRole(String role, String add) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(FUNC_CHECKUSERROLE, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Utf8String(role), 
                new org.web3j.abi.datatypes.Address(160, add)), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Bool>() {}));
        return executeRemoteCallSingleValueReturn(function, Boolean.class);
    }

    public RemoteFunctionCall<List> getMembersFromRoles(String role) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(FUNC_GETMEMBERSFROMROLES, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Utf8String(role)), 
                Arrays.<TypeReference<?>>asList(new TypeReference<DynamicArray<Address>>() {}));
        return new RemoteFunctionCall<List>(function,
                new Callable<List>() {
                    @Override
                    @SuppressWarnings("unchecked")
                    public List call() throws Exception {
                        List<Type> result = (List<Type>) executeCallSingleValueReturn(function, List.class);
                        return convertToNative(result);
                    }
                });
    }

    public RemoteFunctionCall<byte[]> getRoleAdmin(byte[] role) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(FUNC_GETROLEADMIN, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Bytes32(role)), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Bytes32>() {}));
        return executeRemoteCallSingleValueReturn(function, byte[].class);
    }

    public RemoteFunctionCall<TransactionReceipt> grantRole(byte[] role, String account) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_GRANTROLE, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Bytes32(role), 
                new org.web3j.abi.datatypes.Address(160, account)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> grantRoles(String role, String add) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_GRANTROLES, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Utf8String(role), 
                new org.web3j.abi.datatypes.Address(160, add)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<Boolean> hasRole(byte[] role, String account) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(FUNC_HASROLE, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Bytes32(role), 
                new org.web3j.abi.datatypes.Address(160, account)), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Bool>() {}));
        return executeRemoteCallSingleValueReturn(function, Boolean.class);
    }

    public RemoteFunctionCall<TransactionReceipt> renounceRole(byte[] role, String account) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_RENOUNCEROLE, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Bytes32(role), 
                new org.web3j.abi.datatypes.Address(160, account)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> revokeRole(byte[] role, String account) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_REVOKEROLE, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Bytes32(role), 
                new org.web3j.abi.datatypes.Address(160, account)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> revokeRoles(String role, String add) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_REVOKEROLES, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Utf8String(role), 
                new org.web3j.abi.datatypes.Address(160, add)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<byte[]> rolesMapping(String param0) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(FUNC_ROLESMAPPING, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Utf8String(param0)), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Bytes32>() {}));
        return executeRemoteCallSingleValueReturn(function, byte[].class);
    }

    public RemoteFunctionCall<TransactionReceipt> setupRoles() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_SETUPROLES, 
                Arrays.<Type>asList(), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<Boolean> supportsInterface(byte[] interfaceId) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(FUNC_SUPPORTSINTERFACE, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Bytes4(interfaceId)), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Bool>() {}));
        return executeRemoteCallSingleValueReturn(function, Boolean.class);
    }

    @Deprecated
    public static RoleControl load(String contractAddress, Web3j web3j, Credentials credentials, BigInteger gasPrice, BigInteger gasLimit) {
        return new RoleControl(contractAddress, web3j, credentials, gasPrice, gasLimit);
    }

    @Deprecated
    public static RoleControl load(String contractAddress, Web3j web3j, TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit) {
        return new RoleControl(contractAddress, web3j, transactionManager, gasPrice, gasLimit);
    }

    public static RoleControl load(String contractAddress, Web3j web3j, Credentials credentials, ContractGasProvider contractGasProvider) {
        return new RoleControl(contractAddress, web3j, credentials, contractGasProvider);
    }

    public static RoleControl load(String contractAddress, Web3j web3j, TransactionManager transactionManager, ContractGasProvider contractGasProvider) {
        return new RoleControl(contractAddress, web3j, transactionManager, contractGasProvider);
    }

    public static RemoteCall<RoleControl> deploy(Web3j web3j, Credentials credentials, ContractGasProvider contractGasProvider) {
        return deployRemoteCall(RoleControl.class, web3j, credentials, contractGasProvider, BINARY, "");
    }

    @Deprecated
    public static RemoteCall<RoleControl> deploy(Web3j web3j, Credentials credentials, BigInteger gasPrice, BigInteger gasLimit) {
        return deployRemoteCall(RoleControl.class, web3j, credentials, gasPrice, gasLimit, BINARY, "");
    }

    public static RemoteCall<RoleControl> deploy(Web3j web3j, TransactionManager transactionManager, ContractGasProvider contractGasProvider) {
        return deployRemoteCall(RoleControl.class, web3j, transactionManager, contractGasProvider, BINARY, "");
    }

    @Deprecated
    public static RemoteCall<RoleControl> deploy(Web3j web3j, TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit) {
        return deployRemoteCall(RoleControl.class, web3j, transactionManager, gasPrice, gasLimit, BINARY, "");
    }

    public static class RoleAdminChangedEventResponse extends BaseEventResponse {
        public byte[] role;

        public byte[] previousAdminRole;

        public byte[] newAdminRole;
    }

    public static class RoleGrantedEventResponse extends BaseEventResponse {
        public byte[] role;

        public String account;

        public String sender;
    }

    public static class RoleRevokedEventResponse extends BaseEventResponse {
        public byte[] role;

        public String account;

        public String sender;
    }
}
