export const DEFAULT_AVATAR_PROFILE = {
  gender: "male",
  age: "young",
  skinTone: "dark",
  hairStyle: "curly",
  hairColor: "black",
  outfit: "defaultBlack",
};

export function buildAvatarKey(profile) {
  const p = { ...DEFAULT_AVATAR_PROFILE, ...profile };

  return `${p.age}_${p.gender}_${p.skinTone}_${p.hairStyle}_${p.hairColor}_${p.outfit}`;
}

export function getAvatarDescription(profile) {
  const p = { ...DEFAULT_AVATAR_PROFILE, ...profile };

  return `${p.age} ${p.gender} • ${p.skinTone} skin • ${p.hairStyle} hair • ${p.outfit}`;
}