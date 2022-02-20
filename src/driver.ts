import Web3 from "web3";
import ClientNotInstantiatedException from "@ethclients/exceptions/ClientNotInstantiatedException";
import EndpointListExhaustedException from "@ethclients/exceptions/EndpointListExhaustedException";
import {Account, Transaction, TransactionReceipt} from "web3-core";
import {Contract} from "web3-eth-contract";
import TransactionNotFoundException from "@ethclients/exceptions/TransactionNotFoundException";
import TransactionReceiptNotFoundException from "@ethclients/exceptions/TransactionReceiptNotFoundException";

export default abstract class BaseClient
{
    protected web3?: Web3;

    protected chain: string;
    protected chainId: number;

    protected endpoint: string;
    protected endpointList: Array<string>;

    protected constructor (chain: string, chainId: number, endpoint?: string, endpointList?: Array<string>)
    {
        this.chain = chain;
        this.chainId = chainId;

        if (endpoint === undefined) {
            // Try to use first endpoint in list
            if (endpointList === undefined || endpointList.length === 0) {
                throw new Error('An endpoint or endpoint list must be specified.');
            }

            endpoint = endpointList[0];
        }

        this.endpoint = endpoint;
        this.endpointList = endpointList || [];
    }

    public async connect (tries: number = 0): Promise<Web3>
    {
        /**
         * Helper function that returns 0 or 1, intended to either
         * increment or leave number of `tries` for this method the same
         *
         * Intention is for the `tries` number to only increment after the full
         * endpoint list is exhausted. Otherwise we would never get through
         * long endpoint lists.
         *
         * @param index
         */
        const tryNextEndpoint = (index: number): number => {
            try {
                this.nextEndpoint(index);
                return 0;
            } catch (e) {
                if (e instanceof EndpointListExhaustedException) {
                    this.endpoint = this.endpointList[0];
                    return 1;
                }

                throw e;
            }
        };

        if (tries >= 3) {
            throw new Error('Max tries reached for client connections.');
        }

        const index = this.endpointList.indexOf(this.endpoint);
        try {
            this.web3 = new Web3(this.endpoint);
        } catch (e) {
            console.error(String(e));
            console.error('Failed to connect on ' + this.endpoint);
            return await this.connect(tries + tryNextEndpoint(index));
        }

        // Check if connected
        const connected = await this.isConnected();
        if (!connected) {
            console.error('Failed to connect on ' + this.endpoint);
            return await this.connect(tries + tryNextEndpoint(index));
        }

        return this.web3;
    }

    protected nextEndpoint (currentIndex: number): void
    {
        if (currentIndex >= (this.endpointList.length - 1)) {
            throw new EndpointListExhaustedException();
        }

        this.endpoint = this.endpointList[currentIndex + 1];
    }

    public async isConnected (): Promise<boolean>
    {
        if (!this.web3) {
            return false;
        }

        try {
            const chainId = await this.web3.eth.getChainId();
            return chainId === this.chainId;
        } catch (e) {
            console.error(String(e));
            return false;
        }
    }

    public client (): Web3
    {
        if (!this.web3) {
            throw new ClientNotInstantiatedException();
        }

        return this.web3;
    }

    public getAccount (privateKey: string): Account
    {
        return this.client().eth.accounts.privateKeyToAccount(privateKey);
    }

    public getContract (address: string, abi: any): Contract
    {
        const client = this.client();
        return new client.eth.Contract(abi, address);
    }

    public async getTransactionCountForAddress (address: string): Promise<number>
    {
        const client = this.client();
        return await client.eth.getTransactionCount(address);
    }

    public async getTransactionByHash (hash: string): Promise<Transaction>
    {
        const client = this.client();
        const transaction = await client.eth.getTransaction(hash);
        if (transaction === null || transaction === undefined) {
            throw new TransactionNotFoundException(hash);
        }

        return transaction;
    }

    public async getTransactionReceipt (transactionHash: string): Promise<TransactionReceipt>
    {
        const client = this.client();
        const receipt = await client.eth.getTransactionReceipt(transactionHash);
        if (receipt === null) {
            throw new TransactionReceiptNotFoundException(transactionHash);
        }

        return receipt;
    }

    public async transactionSuccess (transactionHash: string): Promise<boolean>
    {
        const receipt = await this.getTransactionReceipt(transactionHash);
        return receipt.status;
    }
}
