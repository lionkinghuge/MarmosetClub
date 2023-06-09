/* eslint-disable camelcase */
/* eslint @typescript-eslint/no-var-requires: "off" */
import axios from "axios";
import process from "process";
import { Buffer } from "buffer";
const { create } = require("ipfs-http-client");
const baseURL = process.env.REACT_APP_API_BASE_URL = "https://a0-api.artzero.io";
const projectId = process.env.REACT_APP_IPFS_PROJECT_ID;
const projectKey = process.env.REACT_APP_IPFS_PROJECT_KEY;
const IPFS_BASE_URL = "https://artzeronft.infura-ipfs.io/ipfs";

export const clientAPI = async (method, url, options) => {
  if (!options) options = {};
  const urlencodedOptions = new URLSearchParams(
    Object.entries(options)
  ).toString();

  const { data } = await axios({
    baseURL,
    url,
    method,
    data: urlencodedOptions,
    headers: {
      Accept: "*/*",
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });

  if (method.toLowerCase() === "post") {
    if (data?.status === "OK") {
      return data?.ret;
    } else {
      return data?.message;
    }
  } else if (method.toLowerCase() === "get") {
    if (data?.status === "OK") {
      return data?.ret;
    } else if (data?.status === "FAILED") {
      return data?.message;
    } else return data;
  }
};

// new API client call
const client = async (
  method,
  url,
  options = {},
  baseURL = process.env.REACT_APP_API_BASE_URL
) => {
  const headers = {
    Accept: "*/*",
    "Content-Type": "application/x-www-form-urlencoded"
  };

  const urlencodedOptions = new URLSearchParams(
    Object.entries(options)
  ).toString();

  const { data } = await axios({
    baseURL,
    url,
    method,
    headers,
    data: urlencodedOptions
  });

  if (data?.status === "FAILED") {
    console.log("error FAILED @ xx>>", url, data?.message);
  }

  return data;
};

export const APICall = {
  // get list of Bidder by Address
  getBidsByBidderAddress: async ({
    bidder,
    limit = 10000,
    offset = 0,
    sort = -1
  }) => {
    return await client("POST", "/getBidsByBidderAddress", {
      bidder,
      limit,
      offset,
      sort
    });
  },

  // Ask BE Update API Calls
  askBeCacheImage: async ({ input, is1024 = false, is1920 = false }) => {
    return await client("POST", "/cacheImage", {
      input,
      is1024,
      is1920
    });
  },

  askBeUpdateBidsData: async ({ collection_address, seller, token_id }) => {
    return await client("POST", "/updateBids", {
      collection_address,
      seller,
      token_id
    });
  },

  askBeUpdateNftData: async ({ collection_address, token_id }) => {
    return await client("POST", "/updateNFT", {
      collection_address,
      token_id
    });
  },

  askBeUpdateCollectionData: async ({ collection_address }) => {
    return await client("POST", "/updateCollection", {
      collection_address
    });
  },

  updateCollectionEmail: async ({ collection_address, email }) => {
    const ret = await client("POST", "/updateCollectionEmail", {
      collection_address,
      email
    });

    return ret;
  },
  askBeUpdateProjectData: async ({ project_address }) => {
    const ret = await client("POST", "/updateProject", {
      project_address
    });

    return ret;
  },

  // Event API Calls
  getPurchaseEvents: async ({ collection_address, limit = 6,
    offset = 0,
    sort = -1 }) => {
    let { ret: result } = await client("POST", "/getPurchaseEvents", {
      limit,
      offset,
      sort,
      collection_address
    });

    result = result.map((item) => {
      return { ...item, type: "PURCHASE" };
    });

    return result;
  },

  getBidWinEvents: async ({ collection_address, limit = 6,
    offset = 0,
    sort = -1 }) => {
    let { ret: result } = await client("POST", "/getBidWinEvents", {
      limit,
      offset,
      sort,
      collection_address
    });

    result = result.map((item) => {
      return { ...item, type: "BID ACCEPTED" };
    });

    return result;
  },

  getUnlistEvents: async ({ collection_address, limit = 6,
    offset = 0,
    sort = -1 }) => {
    let { ret: result } = await client("POST", "/getUnlistEvents", {
      limit,
      offset,
      sort,
      collection_address
    });

    result = result.map((item) => {
      return { ...item, type: "UNLIST" };
    });

    return result;
  },

  getNewListEvents: async ({ collection_address, limit = 6,
    offset = 0,
    sort = -1 }) => {
    let { ret: result } = await client("POST", "/getNewListEvents", {
      limit,
      offset,
      sort,
      collection_address
    });

    result = result.map((item) => {
      return { ...item, type: "LIST" };
    });

    return result;
  },

  // Collection API Calls

  getAllCollections: async ({
    limit = 6,
    offset = 0,
    sort = -1,
    isActive = true,
    ignoreNoNFT = false
  }) => {
    const ret = await client("POST", "/getCollections", {
      limit,
      offset,
      sort,
      isActive,
      ignoreNoNFT
    });

    return ret;
  },

  getFeaturedCollections: async () => {
    return await client("GET", "/getFeaturedCollections", {});
  },

  getCollectionCount: async () => {
    return await client("GET", "/getCollectionCount", {});
  },

  getCollectionByAddress: async ({ collection_address }) => {
    return await client("POST", "/getCollectionByAddress", {
      collection_address
    });
  },

  getCollectionByID: async ({ id }) => {
    return await client("POST", "/getCollectionByID", { id });
  },

  getCollectionsByVolume: async ({
    limit = 5,
    offset = 0,
    sort = -1,
    isActive = true
  }) => {
    const ret = await client("POST", "/getCollectionsByVolume", {
      limit,
      offset,
      sort,
      isActive
    });

    return ret;
  },

  getCollectionsByOwner: async ({
    owner,
    limit = 1000,
    offset = 0,
    sort = -1
  }) => {
    const ret = await client("POST", "/getCollectionsByOwner", {
      owner,
      limit,
      offset,
      sort
    });

    return ret;
  },

  getCollectionsCountByOwner: async ({ owner, noNFT }) => {
    const ret = await client("POST", "/countCollectionsByOwner", {
      owner,
      noNFT
    });

    return ret;
  },

  getCollectionFloorPrice: async ({ collection_address }) => {
    return await client("POST", "/getFloorPrice", {
      collection_address
    });
  },

  getSearchResult: async ({
    keywords,
    limit = 10,
    ignoreNoNFT = true,
    isActive = true
  }) => {
    const result = await client("POST", "/searchCollections", {
      keywords,
      limit,
      ignoreNoNFT,
      isActive
    });

    return result;
  },

  // get NFTs of collection address by traits
  searchNFTOfCollectionByTraits: async ({
    traitFilters = {},
    collectionAddress,
    limit = 12,
    offset = 0,
    sort = -1
  }) => {
    const result = await client("POST", "/searchNFTOfCollectionByTraits", {
      traitFilters,
      collectionAddress,
      limit,
      offset,
      sort
    });

    return result;
  },

  newMintingEvent: async ({
    project,
    mint_amount,
    minter,
    phase_id,
    price,
    project_mint_fee
  }) => {
    const result = await client("POST", "/newMintingEvent", {
      project,
      mint_amount,
      minter,
      phase_id,
      price,
      project_mint_fee
    });

    return result;
  },

  // NFT API Calls
  getNftJson: async ({ tokenID = 1, token_uri }) => {
    const url = `/getJSON?input=${token_uri}${tokenID.toString()}.json`;

    return await client("GET", url, {});
  },

  getNFTsByOwner: async ({
    owner,
    limit = 10000,
    offset = 0,
    sort = -1,
    isActive = true
  }) => {
    return await client("POST", "/getNFTsByOwner", {
      owner,
      limit,
      offset,
      sort,
      isActive
    });
  },

  getNFTsByOwnerAndCollection: async ({
    collection_address,
    owner,
    limit = 10000,
    offset = 0,
    sort = -1
  }) => {
    return await client("POST", "/getNFTsByOwnerAndCollection", {
      collection_address,
      owner,
      limit,
      offset,
      sort
    });
  },

  getTotalLaunchVolume: async () => {
    return await client("GET", "/getTotalVolume", {});
  },

  getNFTByID: async ({ collection_address, token_id }) => {
    return await client("POST", "/getNFTByID", {
      collection_address,
      token_id
    });
  },

  getOwnershipHistoryOfNFT: async ({ owner, collection_address, token_id }) => {
    const ret = await client("POST", "/getOwnershipHistory", {
      owner,
      collection_address,
      token_id
    });

    return ret;
  },

  // Project API Calls
  getProjectInfoByHash: async ({ projectHash }) => {
    return await client("GET", `/${projectHash}`, {}, IPFS_BASE_URL);
  },

  getAllProjects: async ({
    limit = 100,
    offset = 0,
    sort = -1,
    isActive = true
  }) => {
    const ret = await client("POST", "/getProjects", {
      limit,
      offset,
      sort,
      isActive
    });

    return ret;
  },

  // Rewards API Calls
  getAllRewardPayout: async ({ limit = 1000, offset = 0, sort = -1 }) => {
    const ret = await client("POST", "/getAddRewardHistory", {
      limit,
      offset,
      sort
    });

    return ret;
  },

  getAllRewardClaimed: async ({
    staker_address = "",
    limit = 1000,
    offset = 0,
    sort = -1
  }) => {
    const option = { limit, offset, sort };

    if (staker_address) {
      option.staker_address = staker_address;
    }
    const ret = await client("POST", "/getClaimRewardHistory", option);

    return ret;
  }
};

// IPFS API client call
const authorization =
  "Basic " + Buffer.from(projectId + ":" + projectKey).toString("base64");

export const ipfsClient = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization
  }
});
