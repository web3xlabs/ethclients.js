import BaseClient from "@ethclients/driver";

const CHAIN = 'bsc';
const CHAIN_ID = 56;

export default class BSCClient extends BaseClient
{
    constructor (endpointList?: Array<string>, endpoint?: string)
    {
        super(CHAIN, CHAIN_ID, endpoint, endpointList);
    }
}
