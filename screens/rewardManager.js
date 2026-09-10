import AsyncStorage from "@react-native-async-storage/async-storage";

export async function processRewards(rewards = []) {
  for (const reward of rewards) {
    switch (reward.type) {
      case "wcoins":
        await awardWCoins(reward.amount);
        break;

      case "points":
        await awardPoints(reward.amount);
        break;

      case "tracksuit":
        await unlockTracksuit(reward.id);
        break;

      case "badge":
        await unlockBadge(reward.id);
        break;

      case "rank":
        await unlockRank(reward.id);
        break;

      case "certificate":
        await unlockCertificate(reward.id);
        break;

      case "passport":
        await unlockPassportStamp(reward.id);
        break;

      default:
        console.log("Unknown reward:", reward.type);
    }
  }
}
async function awardWCoins(amount) {
  console.log("Award WCoins:", amount);
}

async function awardPoints(amount) {
  console.log("Award Points:", amount);
}

async function unlockTracksuit(id) {
  console.log("Unlock Tracksuit:", id);
}

async function unlockBadge(id) {
  console.log("Unlock Badge:", id);
}

async function unlockRank(id) {
  console.log("Unlock Rank:", id);
}

async function unlockCertificate(id) {
  console.log("Unlock Certificate:", id);
}

async function unlockPassportStamp(id) {
  console.log("Unlock Passport Stamp:", id);
}
