import TransactionNotFoundException from "@ethclients/exceptions/TransactionNotFoundException";

describe ('test TransactionNotFoundException', () => {
    test ('test exception', () => {
        const hash = '0x00000';
        const exception = new TransactionNotFoundException(hash);
        expect(exception.message).toBe('Transaction 0x00000 was not found');
    });
});
