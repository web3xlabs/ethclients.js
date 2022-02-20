import EndpointListExhaustedException from "@ethclients/exceptions/EndpointListExhaustedException";

describe ('test EndpointListExhaustedException', () => {
    test ('test exception', () => {
        const exception = new EndpointListExhaustedException();
        expect(exception.message).toBe('Ran out of endpoints to try. Unable to connect client.');

        const exceptionCustom = new EndpointListExhaustedException('custom message');
        expect(exceptionCustom.message).toBe('custom message');
    });
});
