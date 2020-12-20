# gameswap-subgraph

### Installation

1. `yarn`
2. `yarn prepare:<config>` (i.e `kovan`, `local`, `staging`, `mainnet`)
3. `yarn codegen`

### Development

Firstly, the subgraph can be created by running: `yarn create:local`; this should lead to a number of logs on the graph node.

Once the subgraph has been created, it can be deployed at any time with: `yarn deploy:local`.

This will cause the graph to start processing blocks and mapping events. Eventually, the
subgraph will have been (re)created.

If changes are made to the contracts, `subgraph.yaml`, or the GraphQL schema, run `yarn codegen`;
this re-create the `generated` folder.

**NB:** Type-checking is performed at build time; `yarn tsc` won't work.

---

## Deployment

1. `yarn`
2. Ensure correct config in `/config/<config>.json`
3. `yarn prepare:<config>`
4. `yarn codegen`
5. `yarn deploy:<config> <access token>`
