import BaseClient from "@ethclients/driver";

const CHAIN = 'kcc';
const CHAIN_ID = 321;

export default class KucoinClient extends BaseClient
{
    constructor (endpointList?: Array<string>, endpoint?: string)
    {
        super(CHAIN, CHAIN_ID, endpoint, endpointList);
    }
}
