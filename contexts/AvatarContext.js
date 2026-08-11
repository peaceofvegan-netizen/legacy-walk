import React, { createContext, useContext, useState } from "react";

const AvatarContext = createContext({
  selectedAvatarId: "LW-AVT-000-01",
  setSelectedAvatarId: () => {},
  equippedOutfit: null,
  setEquippedOutfit: () => {},
});

export function AvatarProvider({ children }) {
  const [selectedAvatarId, setSelectedAvatarId] =
    useState("LW-AVT-000-01");

  const [equippedOutfit, setEquippedOutfit] =
    useState(null);

  return (
    <AvatarContext.Provider
      value={{
        selectedAvatarId,
        setSelectedAvatarId,
        equippedOutfit,
        setEquippedOutfit,
      }}
    >
      {children}
    </AvatarContext.Provider>
  );
}

export function useAvatar() {
  return useContext(AvatarContext);
}