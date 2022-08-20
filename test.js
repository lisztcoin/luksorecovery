const NFTStorage = require('nft.storage')

// read the API key from an environment variable. You'll need to set this before running the example!
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDMzMUI4YjhiNjIwRjI0MWFiOTFiRTVhNTkyMzNiODdkNThFNThkOTUiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYzMDMxODE2Mjg3MCwibmFtZSI6ImtleSJ9.dOwpXNNx0Fl8bKOSRqJ-Sa0qfquuZDnY6OQBLJlBVU4"
const CHECKIN_IMAGE = "https://nftstorage.link/ipfs/bafybeidwsd2zmmijkbckvg7rlx2k7qbofk7q7thbq32ruu34c42gi6jt3y"
const CHEERS_IMAGE = "https://nftstorage.link/ipfs/bafybeigfwtf6rhah6t6sxfso5pwd7n7ywl53lhydj24sn7im6y4bf3kgyu"

function checkinNFTJSON() {
  return {
    image: CHECKIN_IMAGE,
    name: "NFT for checking-in",
    description: "You've checked in three times for your goals! Keep going!"
  }
}

function cheersNFTJSON() {
  return {
    image: CHEERS_IMAGE,
    name: "NFT for cheers",
    description: "You goal is popular and got three cheers from others! Keep going!"
  }
}

async function storeExampleNFT() {
  const nft = {
    image: "https://user-images.githubusercontent.com/87873179/144324736-3f09a98e-f5aa-4199-a874-13583bf31951.jpg", // use image Blob as `image` field
    name: "Storing the World's Most Valuable Virtual Assets with NFT.Storage",
    description: "The metaverse is here. Where is it all being stored?",
    properties: {
      type: "blog-post",
      origins: {
        http: "https://nft.storage/blog/post/2021-11-30-hello-world-nft-storage/",
        ipfs: "ipfs://bafybeieh4gpvatp32iqaacs6xqxqitla4drrkyyzq6dshqqsilkk3fqmti/blog/post/2021-11-30-hello-world-nft-storage/"
      },
      authors: [{ name: "David Choi" }],
      content: {
        "text/markdown": "The last year has witnessed the explosion of NFTs onto the world’s mainstage. From fine art to collectibles to music and media, NFTs are quickly demonstrating just how quickly grassroots Web3 communities can grow, and perhaps how much closer we are to mass adoption than we may have previously thought. <... remaining content omitted ...>"
      }
    }
  }

  const client = new NFTStorage({ token: API_KEY })
  const metadata = await client.store(nft)

  console.log('NFT data stored!')
  console.log('Metadata URI: ', metadata.url)
}

storeExampleNFT()