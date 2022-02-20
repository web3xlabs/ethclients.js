import BaseClient from "@ethclients/driver";

const CHAIN = 'avax';
const CHAIN_ID = 43114;

export default class AvaxClient extends BaseClient
{
    constructor (endpointList?: Array<string>, endpoint?: string)
    {
        super(CHAIN, CHAIN_ID, endpoint, endpointList);
    }
}
