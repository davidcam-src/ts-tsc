import { SSM } from 'aws-sdk';

const ssm = new SSM({ region: 'us-east-1' });

export function getBambooApiKey(): Promise<string> {
  return ssm
    .getParameter({
      Name: '/treesearch/dev/bamboo/API_KEY',
      WithDecryption: true,
    })
    .promise()
    .then((data) => data.Parameter?.Value ?? '');
}

// function getDataLakeClientId(): Promise<string> {
//   return ssm
//     .getParameter({
//       Name: '/treesearch/dev/datalake/CLIENT_ID',
//       WithDecryption: true,
//     })
//     .promise()
//     .then((data) => data.Parameter?.Value ?? '');
// }
