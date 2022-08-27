import Web3 from 'web3';
import Schema_v06 from './LSP-schema.json'
import { ERC725JSONSchema } from '@erc725/erc725.js';

export const getData = async (address: string, keys: string[], web3: Web3) => {
  const Contract = new web3.eth.Contract(
    [
      {
        stateMutability: 'view',
        type: 'function',
        inputs: [
          {
            internalType: 'bytes32[]',
            name: '_keys',
            type: 'bytes32[]',
          },
        ],
        name: 'getData',
        outputs: [
          {
            internalType: 'bytes[]',
            name: 'values',
            type: 'bytes[]',
          },
        ],
      },
    ],
    address,
  );

  let data: string[] = [];
  try {
    data = await Contract.methods.getData(keys).call();
  } catch (err: any) {
    console.log(err.message);
  }

  return data;
};

export const getUPData = async () => {
  const dataResult: {
    key: string;
    value: string;
    schema: ERC725JSONSchema;
  }[] = [];

  const dataKeys = Schema_v06.map((schema) => schema.key);

  const result = await getData(address, dataKeys, web3);

  result.map((_, i) => {
    dataResult.push({
      key: dataKeys[i],
      value: result[i],
      schema: Schema_v06[i] as ERC725JSONSchema,
    });
  });
}