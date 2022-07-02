import { ethers } from "ethers";

export const retrieveMatic = async () => {
  return await fetch(
    `https://api.polygonscan.com/api?module=account&action=balance&address=${process.env.REACT_APP_NOUNDERSDAO_ADDRESS}&apikey=${process.env.REACT_APP_POLYGONSCAN_API_KEY}`,
  )
    .then(res => res.json())
    .then(res => {
      return convertWeiToMatic(res.result)
    });
};


export const convertWeiToMatic = ((wei:any) => {
    return ethers.utils.formatEther(wei);
})