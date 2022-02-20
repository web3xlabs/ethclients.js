import BaseClient from "@ethclients/driver";

const CHAIN = 'cronos';
const CHAIN_ID = 25;

export default class CronosClient extends BaseClient
{
    constructor (endpointList?: Array<string>, endpoint?: string)
    {
        super(CHAIN, CHAIN_ID, endpoint, endpointList);
    }
}
