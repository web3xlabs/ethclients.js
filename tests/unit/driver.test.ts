jest.mock('web3');
import Web3 from "web3";
import BaseClient from "@ethclients/driver";
import ClientNotInstantiatedException from "@ethclients/exceptions/ClientNotInstantiatedException";
import TransactionNotFoundException from "@ethclients/exceptions/TransactionNotFoundException";
import TransactionReceiptNotFoundException from "@ethclients/exceptions/TransactionReceiptNotFoundException";
import {when} from "jest-when";
import each from "jest-each";

jest.setTimeout(10000);

describe ('test BaseClient', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    const driverMock = (endpointList?: Array<string>, endpoint?: string) => {
        return new class extends BaseClient {
            constructor (endpointList?: Array<string>, endpoint?: string)
            {
                super('test', 1, endpoint, endpointList);
            }
        }(endpointList, endpoint);
    };

    test ('test instantiating client without endpoint or list throws error', () => {
        expect(driverMock).toThrow(new Error('An endpoint or endpoint list must be specified.'));
    });

    test ('test driver connects with specified endpoint when specified', async () => {
        const mockWeb3: any = {
            eth: {
                getChainId: jest.fn(),
            },
        };
        // @ts-ignore
        when(Web3).calledWith('http://example.com').mockReturnValue(mockWeb3);
        // @ts-ignore
        when(mockWeb3.eth.getChainId).calledWith().mockResolvedValue(1);

        const driver = driverMock([], 'http://example.com');
        await driver.connect();

        expect(Web3).toHaveBeenCalledWith('http://example.com');
        expect(mockWeb3.eth.getChainId).toHaveBeenCalledTimes(1);
    });

    test ('test driver connects to first endpoint in list when no endpoint specified', async () => {
        const mockWeb3: any = {
            eth: {
                getChainId: jest.fn(),
            },
        };
        // @ts-ignore
        when(Web3).calledWith('http://example.com/1').mockReturnValue(mockWeb3);
        // @ts-ignore
        when(mockWeb3.eth.getChainId).calledWith().mockResolvedValue(1);

        const driver = driverMock([
            'http://example.com/1',
            'http://example.com/2',
            'http://example.com/3',
        ]);
        await driver.connect();

        expect(Web3).toHaveBeenCalledWith('http://example.com/1');
        expect(mockWeb3.eth.getChainId).toHaveBeenCalledTimes(1);
    });

    test ('test driver traverses endpoint list to find working endpoint', async () => {
        const mockWeb3: any = {
            eth: {
                getChainId: jest.fn(),
            },
        };

        // @ts-ignore
        when(Web3).calledWith('http://example.com/1').mockReturnValue(mockWeb3);
        // @ts-ignore
        when(Web3).calledWith('http://example.com/2').mockReturnValue(mockWeb3);
        // @ts-ignore
        when(Web3).calledWith('http://example.com/3').mockReturnValue(mockWeb3);


        // @ts-ignore
        when(mockWeb3.eth.getChainId).calledWith().mockResolvedValueOnce(2); // invalid chain ID, will disconnect
        // @ts-ignore
        when(mockWeb3.eth.getChainId).calledWith().mockRejectedValueOnce(new Error('something went wrong')); // Error thrown during request
        // @ts-ignore
        when(mockWeb3.eth.getChainId).calledWith().mockResolvedValue(1); // Success on last endpoint

        const driver = driverMock([
            'http://example.com/1',
            'http://example.com/2',
            'http://example.com/3',
        ]);
        await driver.connect();

        expect(Web3).toHaveBeenCalledTimes(3);
        expect(Web3).toHaveBeenCalledWith('http://example.com/1');
        expect(Web3).toHaveBeenCalledWith('http://example.com/2');
        expect(Web3).toHaveBeenCalledWith('http://example.com/3');
        expect(mockWeb3.eth.getChainId).toHaveBeenCalledTimes(3);
    });

    test ('test driver traverses endpoint list 3 times before throwing exception', async () => {
        const mockWeb3: any = {
            eth: {
                getChainId: jest.fn(),
            },
        };

        // @ts-ignore
        when(Web3).calledWith('http://example.com/1').mockReturnValue(mockWeb3);
        // @ts-ignore
        when(Web3).calledWith('http://example.com/2').mockReturnValue(mockWeb3);
        // @ts-ignore
        when(Web3).calledWith('http://example.com/3').mockReturnValue(mockWeb3);


        // @ts-ignore
        when(mockWeb3.eth.getChainId).calledWith().mockRejectedValue(new Error('something went wrong')); // invalid chain ID, will disconnect

        const driver = driverMock([
            'http://example.com/1',
            'http://example.com/2',
            'http://example.com/3',
        ]);

        const connect = async () => {
            await driver.connect();
            await Promise.resolve();
        };
        await expect(connect).rejects.toThrow(new Error('Max tries reached for client connections.'));

        expect(Web3).toHaveBeenCalledTimes(9);
        expect(Web3).toHaveBeenCalledWith('http://example.com/1');
        expect(Web3).toHaveBeenCalledWith('http://example.com/2');
        expect(Web3).toHaveBeenCalledWith('http://example.com/3');
        expect(mockWeb3.eth.getChainId).toHaveBeenCalledTimes(9);
    });

    test ('test get client throws exception when client not instantiated', () => {
        const driver = driverMock([], 'http://example.com');
        const client = () => driver.client();
        expect(client).toThrow(new ClientNotInstantiatedException());
    });

    test ('test get client returns web3 client', async () => {
        const mockWeb3: any = {
            eth: {
                getChainId: jest.fn(),
            },
        };
        // @ts-ignore
        when(Web3).calledWith('http://example.com').mockReturnValue(mockWeb3);
        // @ts-ignore
        when(mockWeb3.eth.getChainId).calledWith().mockResolvedValue(1);

        const driver = driverMock([], 'http://example.com');
        await driver.connect();
        expect(driver.client()).toBe(mockWeb3);
    });

    test ('test getAccount', async () => {
        const mockWeb3: any = {
            eth: {
                getChainId: jest.fn(),
                accounts: {
                    privateKeyToAccount: jest.fn(),
                },
            },
        };

        const privateKey = 'abc123';
        const mockAccountReturn: any = { id: 42 };

        // @ts-ignore
        when(Web3).calledWith('http://example.com').mockReturnValue(mockWeb3);
        // @ts-ignore
        when(mockWeb3.eth.getChainId).calledWith().mockResolvedValue(1);
        // @ts-ignore
        when(mockWeb3.eth.accounts.privateKeyToAccount).calledWith(privateKey).mockResolvedValue(mockAccountReturn);

        const driver = driverMock([], 'http://example.com');
        await driver.connect();

        const result = await driver.getAccount(privateKey);
        expect(result).toBe(mockAccountReturn);
    });

    test ('test getContract', async () => {
        const mockWeb3: any = {
            eth: {
                getChainId: jest.fn(),
                Contract: jest.fn(),
            },
        };

        const address = '0x00000';
        const abi: any = [];

        const mockContractReturn: any = { id: 42 };

        // @ts-ignore
        when(Web3).calledWith('http://example.com').mockReturnValue(mockWeb3);
        // @ts-ignore
        when(mockWeb3.eth.getChainId).calledWith().mockResolvedValue(1);
        // @ts-ignore
        when(mockWeb3.eth.Contract).calledWith(abi, address).mockResolvedValue(mockContractReturn);

        const driver = driverMock([], 'http://example.com');
        await driver.connect();

        const result = await driver.getContract(address, abi);
        expect(result).toBe(mockContractReturn);
    });

    test ('test getTransactionCountForAddress', async () => {
        const mockWeb3: any = {
            eth: {
                getChainId: jest.fn(),
                getTransactionCount: jest.fn(),
            },
        };

        const address = '0x00000';
        const mockCount: any = 42;

        // @ts-ignore
        when(Web3).calledWith('http://example.com').mockReturnValue(mockWeb3);
        // @ts-ignore
        when(mockWeb3.eth.getChainId).calledWith().mockResolvedValue(1);
        // @ts-ignore
        when(mockWeb3.eth.getTransactionCount).calledWith(address).mockResolvedValue(mockCount);

        const driver = driverMock([], 'http://example.com');
        await driver.connect();

        const result = await driver.getTransactionCountForAddress(address);
        expect(result).toBe(mockCount);
    });

    test ('test getTransactionByHash', async () => {
        const mockWeb3: any = {
            eth: {
                getChainId: jest.fn(),
                getTransaction: jest.fn(),
            },
        };

        const hash = '0x00000';
        const mockTransactionReturn: any = { id: 42 };

        // @ts-ignore
        when(Web3).calledWith('http://example.com').mockReturnValue(mockWeb3);
        // @ts-ignore
        when(mockWeb3.eth.getChainId).calledWith().mockResolvedValue(1);
        // @ts-ignore
        when(mockWeb3.eth.getTransaction).calledWith(hash).mockResolvedValue(mockTransactionReturn);

        const driver = driverMock([], 'http://example.com');
        await driver.connect();

        const result = await driver.getTransactionByHash(hash);
        expect(result).toBe(mockTransactionReturn);
    });

    test ('test getTransactionByHash throws exception when transaction not found', async () => {
        const mockWeb3: any = {
            eth: {
                getChainId: jest.fn(),
                getTransaction: jest.fn(),
            },
        };

        const hash = '0x00000';

        // @ts-ignore
        when(Web3).calledWith('http://example.com').mockReturnValue(mockWeb3);
        // @ts-ignore
        when(mockWeb3.eth.getChainId).calledWith().mockResolvedValue(1);
        // @ts-ignore
        when(mockWeb3.eth.getTransaction).calledWith(hash).mockResolvedValue(null);

        const driver = driverMock([], 'http://example.com');
        await driver.connect();

        const getTx = async () => {
            await driver.getTransactionByHash(hash);
            await Promise.resolve();
        };

        await expect(getTx).rejects.toThrow(new TransactionNotFoundException(hash));
    });

    test ('test getTransactionReceipt', async () => {
        const mockWeb3: any = {
            eth: {
                getChainId: jest.fn(),
                getTransactionReceipt: jest.fn(),
            },
        };

        const hash = '0x00000';
        const mockTransactionReturn: any = { id: 42 };

        // @ts-ignore
        when(Web3).calledWith('http://example.com').mockReturnValue(mockWeb3);
        // @ts-ignore
        when(mockWeb3.eth.getChainId).calledWith().mockResolvedValue(1);
        // @ts-ignore
        when(mockWeb3.eth.getTransactionReceipt).calledWith(hash).mockResolvedValue(mockTransactionReturn);

        const driver = driverMock([], 'http://example.com');
        await driver.connect();

        const result = await driver.getTransactionReceipt(hash);
        expect(result).toBe(mockTransactionReturn);
    });

    test ('test getTransactionReceipt throws exception when receipt not found', async () => {
        const mockWeb3: any = {
            eth: {
                getChainId: jest.fn(),
                getTransactionReceipt: jest.fn(),
            },
        };

        const hash = '0x00000';

        // @ts-ignore
        when(Web3).calledWith('http://example.com').mockReturnValue(mockWeb3);
        // @ts-ignore
        when(mockWeb3.eth.getChainId).calledWith().mockResolvedValue(1);
        // @ts-ignore
        when(mockWeb3.eth.getTransactionReceipt).calledWith(hash).mockResolvedValue(null);

        const driver = driverMock([], 'http://example.com');
        await driver.connect();

        const getReceipt = async () => {
            await driver.getTransactionReceipt(hash);
            await Promise.resolve();
        };

        await expect(getReceipt).rejects.toThrow(new TransactionReceiptNotFoundException(hash));
    });

    each([
        true,
        false,
    ]).test ('test transactionSuccess returns correct value', async (expectedReceiptStatus: boolean) => {
        const mockWeb3: any = {
            eth: {
                getChainId: jest.fn(),
                getTransactionReceipt: jest.fn(),
            },
        };

        const hash = '0x00000';
        const mockTransactionReturn: any = { status: expectedReceiptStatus };

        // @ts-ignore
        when(Web3).calledWith('http://example.com').mockReturnValue(mockWeb3);
        // @ts-ignore
        when(mockWeb3.eth.getChainId).calledWith().mockResolvedValue(1);
        // @ts-ignore
        when(mockWeb3.eth.getTransactionReceipt).calledWith(hash).mockResolvedValue(mockTransactionReturn);

        const driver = driverMock([], 'http://example.com');
        await driver.connect();

        const result = await driver.transactionSuccess(hash);
        expect(result).toBe(expectedReceiptStatus);
    });
});
