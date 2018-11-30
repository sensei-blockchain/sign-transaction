const Tx = require('ethereumjs-tx');
const BigNumber = require('bignumber.js');

const isETHCloneRawTxValid = rawTx => {
  console.log('isETHCloneRawTxValid >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
  try {
    const tx = new Tx(rawTx);
    const decodedTx = {
      nonce: parseInt(tx.nonce.toString('hex'), 16),
      gasPrice: new BigNumber(parseInt(tx.gasPrice.toString('hex'), 16)),
      gasLimit: new BigNumber(parseInt(tx.gasLimit.toString('hex'), 16)),
      to: `0x${tx.to.toString('hex')}`,
      value: new BigNumber(parseInt(tx.value.toString('hex'), 16)),
      data: tx.data.toString('hex'),
      from: `0x${tx.from.toString('hex')}`,
    };
    console.log(decodedTx);
    console.log('============================================================')
    return decodedTx;
  } catch (error) {
    return false;
  }
};

module.exports = isETHCloneRawTxValid;
