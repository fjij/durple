# Durple

## Quick start

The first things you need to do are cloning this repository and installing its
dependencies:

```sh
git clone https://github.com/fjij/durple.git
cd durple
npm install
```

Once installed, let's run Buidler's testing network:

```sh
npx buidler node
```

Then, on a new terminal, go to the repository's root folder and run this to
deploy your contract and get some ETH

```sh
npx buidler run scripts/deploy.js --network localhost
npx buidler --network localhost faucet 0x...
```
where `0x...` is your wallet address.

Finally, we can run the frontend with:

```sh
cd frontend
npm install
npm start
```

Open [http://localhost:3000/](http://localhost:3000/) to see your Dapp. You will
need to have [Metamask](http://metamask.io) installed and listening to
`localhost 8545`.
