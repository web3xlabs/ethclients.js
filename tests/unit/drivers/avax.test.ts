import {AvaxClient} from "@ethclients/index";
import Web3 from "web3";

jest.mock('web3');

beforeEach(() => {
    // @ts-ignore
    Web3.mockClear();
});

test ('test basic client config', async () => {
    // @ts-ignore
    Web3.mockImplementation(() => {
        return {
            eth: {
                async getChainId () {
                    return 43114;
                },
            },
        };
    });

    const endpoint = 'https://example.com';

    const client = new AvaxClient([], endpoint);
    await client.connect();

    expect(Web3).toHaveBeenCalledWith(endpoint);
});
