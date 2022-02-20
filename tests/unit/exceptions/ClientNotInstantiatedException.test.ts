import ClientNotInstantiatedException from "@ethclients/exceptions/ClientNotInstantiatedException";

describe ('test ClientNotInstantiatedException', () => {
    test ('test exception', () => {
        const exception = new ClientNotInstantiatedException();
        expect(exception.message).toBe('Client not instantiated. Have to called connect()?');

        const exceptionCustom = new ClientNotInstantiatedException('custom message');
        expect(exceptionCustom.message).toBe('custom message');
    });
});
