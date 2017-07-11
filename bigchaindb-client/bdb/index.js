const driver = require('bigchaindb-driver')
const bip39 = require('bip39')

const API_ENDPOINT = 'https://ipdb-proxy-cmpyydtxja.now.sh/api/v1/'
const conn = new driver.Connection(API_ENDPOINT)


module.exports = {

    generateKeypair: () => new driver.Ed25519Keypair(),

    generateMnemonic: () => bip39.generateMnemonic(),

    keypairFromMnemonic: mnemonicSeed => {
        const seed = bip39.mnemonicToSeed(mnemonicSeed)
        return new driver.Ed25519Keypair(seed.slice(0, 32))
    },

    publish: ({ publicKey, privateKey }, payload) => {
        // Create a transation
        const tx = driver.Transaction.makeCreateTransaction(
            payload,
            null,
            [ driver.Transaction.makeOutput(
                driver.Transaction.makeEd25519Condition(publicKey))
            ],
            publicKey
        )

        // sign/fulfill the transaction
        const txSigned = driver.Transaction.signTransaction(tx, privateKey)

        // send it off to BigchainDB
        return conn.postTransaction(txSigned)
           .then(() => txSigned)
    },

    getUnspents: publicKey =>
        conn.listOutputs({ public_key: publicKey, unspent: 'true'})
            .then(unspents => unspents.map(elem => elem.split('/')[2])),

    getTransaction: txId =>
        new Promise((resolve, reject) => {
            let tx = localStorage.getItem(txId)
            if (tx) {
                resolve(JSON.parse(tx))
            } else {
                conn.getTransaction(txId)
                .then(tx => {
                    localStorage.setItem(txId, JSON.stringify(tx))
                    resolve(tx)
                })
                .catch(reason => reject(reason))
            }
        }),

    getProfile: publicKey =>
        conn.listOutputs({ public_key: publicKey, unspent: 'true'})
            .then(unspents => unspents.map(elem => elem.split('/')[2]))
            .then(txs => Promise.all(txs.map(tx => getTransaction(tx))))
            .then(txs => txs.filter(elem => { try {
                return elem.asset.data.profile && elem.operation === 'CREATE'
            } catch (err) { return false }}))
            .then(txs => txs[0]),

    textSearch: query => conn.searchAssets(query)
}
