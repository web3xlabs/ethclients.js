export default class TransactionNotFoundException extends Error
{
    constructor (transactionHash: string)
    {
        super('Receipt for transaction ' + transactionHash + ' was not found');
    }
}