import { getDefaultProvider, Wallet, utils } from 'ethers'; // ethers v5
import { Provider, TransactionResponse } from '@ethersproject/providers'; // ethers v5
import { ERC721Client } from '@imtbl/contracts';

const CONTRACT_ADDRESS = 'YOUR_CONTRACT_ADDRESS';
const PRIVATE_KEY = '46c3de2f280cce7754c48ef2fb996cf3d723ddc4da7538a17147747a84cc5ee6';
const TOKEN_ID1 = 1;
const TOKEN_ID2 = 2;
const TOKEN_ID3 = 3;

const provider = getDefaultProvider('https://rpc.testnet.immutable.com');

const mint = async (provider: Provider): Promise<TransactionResponse> => {
  // Bound contract instance
  const contract = new ERC721Client(CONTRACT_ADDRESS);
  // The wallet of the intended signer of the mint request
  const wallet = new Wallet(PRIVATE_KEY, provider);
  const minterRole = await contract.MINTER_ROLE(provider);
  const hasMinterRole = await contract.hasRole(
    provider,
    minterRole,
    wallet.address
  );

  if (!hasMinterRole) {
    // Handle scenario without permissions...
    console.log('Account doesnt have permissions to mint.');
    return Promise.reject(
      new Error('Account doesnt have permissions to mint.')
    );
  }

  // Construct the mint requests
  const requests = [
    {
      to: '0xA4851cF4F71B3C382c4fe5f9094D5723BB443b97',
      tokenIds: [TOKEN_ID1, TOKEN_ID2, TOKEN_ID3],
    }
  ];
const currentGasPrice = await provider.getGasPrice();
  
  // Optionally increase the gas price to ensure the transaction goes through
  const adjustedGasPrice = currentGasPrice.add(utils.parseUnits('10', 'gwei'));

  const populatedTransaction = await contract.populateMintBatch(requests);
  populatedTransaction.gasPrice = adjustedGasPrice;
  const result = await wallet.sendTransaction(populatedTransaction);
  console.log(result); // To get the TransactionResponse value
  return result;
};

mint(provider);
