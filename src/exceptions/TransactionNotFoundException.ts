export default class TransactionNotFoundException extends Error
{
    constructor (transactionHash: string)
    {
        super('Transaction ' + transactionHash + ' was not found');
    }
}