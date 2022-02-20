import TransactionReceiptNotFoundException from "@ethclients/exceptions/TransactionReceiptNotFoundException";

describe ('test TransactionReceiptNotFoundException', () => {
    test ('test exception', () => {
        const hash = '0x00000';
        const exception = new TransactionReceiptNotFoundException(hash);
        expect(exception.message).toBe('Receipt for transaction 0x00000 was not found');
    });
});
