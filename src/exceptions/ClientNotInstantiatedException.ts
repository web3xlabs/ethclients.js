export default class ClientNotInstantiatedException extends Error
{
    constructor (message?: string)
    {
        super(message || 'Client not instantiated. Have to called connect()?');
    }
}