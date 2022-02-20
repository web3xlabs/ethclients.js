# ethclients.js

[![Test and Lint](https://github.com/web3xlabs/ethclients.js/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/web3xlabs/ethclients.js/actions/workflows/ci.yml)

Provides Smart Chain clients for JS bots.

![](.github/web3x.png)

A [Web3X](https://web3x.net) Product

Licensed under [GPLv3](LICENSE.md):
* Free to use (including commercial use) and modify
* Required to open-source any modifications

### Installation

#### Setup NPM installation from Github Packages
This package is located on GitHub Packages. You will need to configure your project to install from this
registry.

See: [Installing a Package](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#installing-a-package)

#### Add Package

```
yarn add @web3xlabs/ethclients.js # Using Yarn
npm install @web3xlabs/ethclients.js # Using NPM
```

### Supported Clients
* Ethereum - `ETHClient`
* Binance - `BSCClient`
* KuCoin - `KucoinClient`
* Cronos - `CronosClient`
* Avax - `AvaxClient`

### Usage

```typescript
import {
    BSCClient,
    KucoinClient,
    ETHClient,
    CronosClient,
    AvaxClient,
    BaseClient
} from '@web3xlabs/ethclients.js';

const client = new BSCClient([
    // Endpoints list
]);
await client.connect();

console.log(await client.isConnected());
```

### Endpoints and Lists

Each client instance accepts an `Array<string>` of RPC endpoints. These endpoints may be HTTP/S, or WS/S, and
the client will determine the correct provider based on the endpoint passed in.

It is a good idea to pass in multiple endpoints if possible, as the client driver will automatically failover
to the next available endpoint if an error is encountered during a request.

#### Public RPC Endpoints

**Warning:** These endpoints are provided by the community without an uptime guarantee. These endpoints will often
work for testing, but be aware of any latency or delay, and also be aware that they may stop working at any time.

**Ethereum:**
```
https://main-light.eth.linkpool.io
wss://main-light.eth.linkpool.io/ws
```

**Binance:**
```
https://bsc-dataseed.binance.org/
https://bsc-dataseed1.defibit.io/
https://bsc-dataseed1.ninicoin.io/
wss://bsc-ws-node.nariox.org:443
```

**KuCoin:**
```
https://rpc-mainnet.kcc.network/
```

**Cronos:**
```
https://evm-cronos.org/
```

**Avax:**
```
https://api.avax.network/ext/bc/C/rpc
```

## Advanced

Each client instance accepts an optional `endpoint: string` argument that will override
the default endpoint for the client to connect to.

Providing an endpoint that begins with `http://` or `https://` will automatically use the
`HttpProvider` connection provider. Endpoints that begin with `ws://` or `wss://` will
automatically use the `WebsocketProvider` connection provider.

Each client also provides an endpoint list specific to that chain's public RPC endpoints. This
list will be looped over 3 times during connection attempts, and if the current endpoint does
not connect successfully, the next endpoint will be tried.

```typescript
import { ETHClient } from '@web3xlabs/ethclients.js';

const client = new ETHClient('https://invalid-rpc-url.com');

// Will log an error for the given endpoint then reconnect using a valid endpoint.
await client.connect(); 
```

Providing no `endpoint` to the client will cause the client to attempt connection on the first
endpoint in its list. If that endpoint fails, it will continue through the list as described.

```typescript
import { BSCClient } from '@web3xlabs/ethclients.js';

const client = new BSCClient(); // Will use first endpoint in list
await client.connect();
```
