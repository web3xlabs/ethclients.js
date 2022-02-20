export default class EndpointListExhaustedException extends Error
{
    constructor (message?: string)
    {
        super(message || 'Ran out of endpoints to try. Unable to connect client.');
    }
}