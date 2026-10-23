import { captureAccountSession, isAccountSessionEnded } from "../utils/accountStorage";


export async function processRewards(rewards = []) {
  const _accountSession = captureAccountSession();

  try {
    _accountSession.assertCurrent();

  for (const reward of rewards) {
    switch (reward.type) {
      case "wcoins":
        await _accountSession.run(async () => (awardWCoins(reward.amount)));
        break;

      case "points":
        await _accountSession.run(async () => (awardPoints(reward.amount)));
        break;

      case "tracksuit":
        await _accountSession.run(async () => (unlockTracksuit(reward.id)));
        break;

      case "badge":
        await _accountSession.run(async () => (unlockBadge(reward.id)));
        break;

      case "rank":
        await _accountSession.run(async () => (unlockRank(reward.id)));
        break;

      case "certificate":
        await _accountSession.run(async () => (unlockCertificate(reward.id)));
        break;

      case "passport":
        await _accountSession.run(async () => (unlockPassportStamp(reward.id)));
        break;

      default:
        console.log("Unknown reward:", reward.type);
    }
  }

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
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
