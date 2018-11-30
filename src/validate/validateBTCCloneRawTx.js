const { Transaction, crypto, script, address } = require('bitcoinjs-lib');

const isBTCCloneRawTxValid = (rawTx, bitcoinjsLibNetwork) => {
  console.log('isBTCCloneRawTxValid >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
  try {
    const tx = Transaction.fromHex(rawTx);

    const inputs = (tx.ins || []).map((input, n) => {
      const scriptData = script.toASM(input.script);
      const pubKey = scriptData.split(' ')[1];
      const addr = pubKey
        ? getAddressFromPublicKey(pubKey, bitcoinjsLibNetwork)
        : '';
      return {
        addr,
        txid: input.hash.reverse().toString('hex'),
        n: input.index,
        script: scriptData,
        sequence: input.sequence,
      };
    });

    const outputs = (tx.outs || []).map((out, n) =>
      format(out, n, bitcoinjsLibNetwork),
    );

    const decodedTx = {
      inputs,
      outputs,
      txid: tx.getId(),
      version: tx.version,
      locktime: tx.locktime,
    };

    return decodedTx;
  } catch (error) {
    return false;
  }
};

const getAddressFromPublicKey = (publicKey, network) => {
  const publicKeyBuff = new Buffer(publicKey, 'hex');
  return address.toBase58Check(
    crypto.hash160(publicKeyBuff),
    network.pubKeyHash,
  );
};

const format = (out, n, network) => {
  const vout = {
    n,
    satoshi: out.value,
    value: (1e-8 * out.value).toFixed(8),
    scriptPubKey: {
      asm: script.toASM(out.script),
      hex: out.script.toString('hex'),
      type: script.classifyOutput(out.script),
      addresses: [],
    },
  };

  switch (vout.scriptPubKey.type) {
    case 'pubkeyhash':
    case 'scripthash':
      vout.scriptPubKey.addresses.push(
        address.fromOutputScript(out.script, network),
      );
      break;
  }
  return vout;
};

module.exports = isBTCCloneRawTxValid;
