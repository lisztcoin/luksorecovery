import { NFTStorage, File, Blob } from 'nft.storage'

// I know exposing this isn't ideal but in case judge want to try the project out it will be easier for them.
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDMzMUI4YjhiNjIwRjI0MWFiOTFiRTVhNTkyMzNiODdkNThFNThkOTUiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYzMDMxODE2Mjg3MCwibmFtZSI6ImtleSJ9.dOwpXNNx0Fl8bKOSRqJ-Sa0qfquuZDnY6OQBLJlBVU4"
export const CHECKIN_IMAGE = "https://nftstorage.link/ipfs/bafkreiebfyxfc643k2nfyub7vpnzrsjlr4gfvkfdhc3b7vxmf27h4dnx7i"
export const CHEERS_IMAGE = "https://nftstorage.link/ipfs/bafkreifkhvhviw674tkto4z5ltyajrtfwjdpktc4pyvfvgtnvpugedgg7u"
export const GOAL_ACHIEVED_IMAGE = "https://nftstorage.link/ipfs/bafkreihbxpfkbsqe6rmpfopcpxedsagxxbgphip2vnz4p7rcce7ujmketi"

export function checkinNFTJSON() {
  return {
    image: CHECKIN_IMAGE,
    name: "Recorded Your Efforts",
    description: "You've checked in three times for your goals! Keep going! (project by Goal Keeper NFT)"
  }
}

export function cheersNFTJSON() {
  return {
    image: CHEERS_IMAGE,
    name: "Showed Your Love",
    description: "You goal is popular and got three cheers from others! Keep going! (project by Goal Keeper NFT)"
  }
}

export function goalAchievedNFTJSON(name: string) {
  return {
    image: GOAL_ACHIEVED_IMAGE,
    name: "Congrats! Goal " + name + " Achieved!",
    description: "You goal " + name + " is achieved. You are the best. (project by Goal Keeper NFT)"
  }
}

export async function uploadCheckinNFT() {
  const client = new NFTStorage({ token: API_KEY })
  const blob = new Blob([JSON.stringify(checkinNFTJSON(), null, 2)], { type: 'application/json' });
  return await client.storeBlob(blob);
}

export async function uploadCheersNFT() {
  const client = new NFTStorage({ token: API_KEY })
  const blob = new Blob([JSON.stringify(cheersNFTJSON(), null, 2)], { type: 'application/json' });
  return await client.storeBlob(blob);
}

export async function uploadGoalAchievedNFT(name: string) {
  const client = new NFTStorage({ token: API_KEY })
  const blob = new Blob([JSON.stringify(goalAchievedNFTJSON(name), null, 2)], { type: 'application/json' });
  return await client.storeBlob(blob);
}