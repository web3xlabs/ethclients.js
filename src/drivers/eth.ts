import BaseClient from "@ethclients/driver";

const CHAIN = 'eth';
const CHAIN_ID = 1;

export default class ETHClient extends BaseClient
{
    constructor (endpointList?: Array<string>, endpoint?: string)
    {
        super(CHAIN, CHAIN_ID, endpoint, endpointList);
    }
}
