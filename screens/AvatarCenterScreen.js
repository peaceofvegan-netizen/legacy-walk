// screens/AvatarCenterScreen.js

import React from "react";

import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  avatarOptions,
} from "../data/avatarOptions";

import {
  TRACKSUIT_TIERS,
} from "../utils/tracksuitConfig";

import {
  getTracksuitProgress,
  canUserEquipTracksuit,
} from "../utils/tracksuitProgress";

import {
  getCurrentAvatarVisual,
  getTracksuitVisual,
} from "../utils/avatarVisualResolver";

import {
  getCurrentAvatarSuit,
  setCurrentAvatarSuit,
  getAvatarWardrobeState,
} from "../utils/avatarWardrobeStorage";


// ============================================================
// LEGATHON WALK — AVATAR CENTER
// ============================================================
//
// COMPLETE AVATAR / TRACKSUIT SYSTEM
//
// • Normal avatar selection
// • Age / race / gender avatar matching
// • Journey Lifetime Steps progression
// • Blue / Green / Red / Yellow / Elite
// • Persistent equipped tracksuit
// • Premium / Elite access rules
// • Full-body tracksuit avatar image
// • Safe fallback to normal avatar
//
// IMPORTANT:
//
// This screen NEVER adds steps.
//
// It only reads:
//
// lifetimeSteps
//
// That value must continue to be maintained by the central
// step tracking engine.
//
// ============================================================


// ============================================================
// DEFAULT AVATAR
// ============================================================

function getDefaultAvatar() {
  return (
    avatarOptions?.[0] ||
    null
  );
}


// ============================================================
// SAFE NUMBER
// ============================================================

function safeNumber(
  value
) {
  const number =
    Number(value);

  if (
    !Number.isFinite(
      number
    ) ||
    number < 0
  ) {
    return 0;
  }

  return number;
}


// ============================================================
// NORMALIZE MEMBERSHIP
// ============================================================
//
// Supported:
//
// basic
// free
// premium
// elite
//
// ============================================================

function normalizeMembership(
  value
) {
  const membership =
    String(
      value ||
      "basic"
    )
      .trim()
      .toLowerCase();


  if (
    membership.includes(
      "elite"
    )
  ) {
    return "elite";
  }


  if (
    membership.includes(
      "premium"
    )
  ) {
    return "premium";
  }


  return "basic";
}


// ============================================================
// AVATAR RANK
// ============================================================

function getRank(
  lifetimeSteps
) {
  const steps =
    safeNumber(
      lifetimeSteps
    );


  if (
    steps >=
    4250000
  ) {
    return "Elite Legend";
  }


  if (
    steps >=
    1250000
  ) {
    return "Legend";
  }


  if (
    steps >=
    750000
  ) {
    return "Pathfinder";
  }


  if (
    steps >=
    400000
  ) {
    return "Trailblazer";
  }


  if (
    steps >=
    150000
  ) {
    return "Explorer";
  }


  return "Rookie";
}


// ============================================================
// ACTION BUTTON
// ============================================================

function ActionButton({
  icon,
  title,
  subtitle,
  onPress,
}) {
  return (
    <TouchableOpacity
      style={
        styles.actionButton
      }
      onPress={
        onPress
      }
      activeOpacity={
        0.82
      }
    >
      <Text
        style={
          styles.actionIcon
        }
      >
        {icon}
      </Text>


      <View
        style={
          styles.actionTextWrap
        }
      >
        <Text
          style={
            styles.actionTitle
          }
        >
          {title}
        </Text>

        <Text
          style={
            styles.actionSubtitle
          }
        >
          {subtitle}
        </Text>
      </View>


      <Text
        style={
          styles.actionArrow
        }
      >
        ›
      </Text>
    </TouchableOpacity>
  );
}


// ============================================================
// MAIN SCREEN
// ============================================================

export default function AvatarCenterScreen({
  goBack,
  goToAvatarPicker,
  goToRewards,

  // ----------------------------------------------------------
  // Membership can be passed by App.js.
  //
  // Example:
  //
  // subscriptionTier="premium"
  //
  // or:
  //
  // membershipTier="elite"
  //
  // ----------------------------------------------------------

  subscriptionTier,
  membershipTier,
}) {

  // ==========================================================
  // STATE
  // ==========================================================

  const [
    avatarName,
    setAvatarName,
  ] =
    React.useState(
      "Legacy Walker"
    );


  const [
    selectedAvatar,
    setSelectedAvatar,
  ] =
    React.useState(
      getDefaultAvatar()
    );


  const [
    lifetimeSteps,
    setLifetimeSteps,
  ] =
    React.useState(0);


  const [
    equippedSuit,
    setEquippedSuit,
  ] =
    React.useState(
      "default"
    );


  const [
    resolvedAvatarImage,
    setResolvedAvatarImage,
  ] =
    React.useState(
      getDefaultAvatar()?.image ||
      null
    );


  const [
    avatarVisual,
    setAvatarVisual,
  ] =
    React.useState(null);


  const [
    loadingVisual,
    setLoadingVisual,
  ] =
    React.useState(false);


  const [
    screenReady,
    setScreenReady,
  ] =
    React.useState(false);


  // ==========================================================
  // MEMBERSHIP
  // ==========================================================

  const membership =
    normalizeMembership(
      subscriptionTier ||
      membershipTier
    );


  // ==========================================================
  // REFRESH AVATAR VISUAL
  // ==========================================================

  const refreshAvatarVisual =
    React.useCallback(
      async (
        avatar =
          selectedAvatar
      ) => {

        if (!avatar?.id) {

          setResolvedAvatarImage(
            avatar?.image ||
            null
          );

          setAvatarVisual(
            null
          );

          return;
        }


        try {

          setLoadingVisual(
            true
          );


          const visual =
            await getCurrentAvatarVisual(
              avatar.id
            );


          setAvatarVisual(
            visual
          );


          setResolvedAvatarImage(
            visual?.image ||
            avatar.image ||
            null
          );

        } catch (error) {

          console.log(
            "Refresh avatar visual error:",
            error
          );


          setResolvedAvatarImage(
            avatar.image ||
            null
          );

        } finally {

          setLoadingVisual(
            false
          );
        }
      },
      [
        selectedAvatar
      ]
    );


  // ==========================================================
  // LOAD AVATAR CENTER
  // ==========================================================

  const loadAvatarCenter =
    React.useCallback(
      async () => {

        try {

          const [
            savedSteps,
            savedProfile,
            wardrobe,
          ] =
            await Promise.all([

              AsyncStorage.getItem(
                "lifetimeSteps"
              ),

              AsyncStorage.getItem(
                "avatarProfile"
              ),

              getAvatarWardrobeState(),

            ]);


          // --------------------------------------------------
          // JOURNEY LIFETIME STEPS
          // --------------------------------------------------

          setLifetimeSteps(
            safeNumber(
              savedSteps
            )
          );


          // --------------------------------------------------
          // WARDROBE
          // --------------------------------------------------

          setEquippedSuit(
            wardrobe?.suitId ||
            "default"
          );


          // --------------------------------------------------
          // AVATAR PROFILE
          // --------------------------------------------------

          let avatar =
            getDefaultAvatar();


          if (
            savedProfile
          ) {

            try {

              const profile =
                JSON.parse(
                  savedProfile
                );


              setAvatarName(
                profile?.name ||
                "Legacy Walker"
              );


              const foundAvatar =
                avatarOptions.find(
                  (option) =>
                    option.id ===
                    profile?.avatarId
                );


              if (
                foundAvatar
              ) {
                avatar =
                  foundAvatar;
              }

            } catch (error) {

              console.log(
                "Avatar profile parse error:",
                error
              );
            }
          }


          setSelectedAvatar(
            avatar
          );


          // --------------------------------------------------
          // RESOLVE THE ACTUAL DISPLAY IMAGE
          // --------------------------------------------------

          if (
            avatar?.id
          ) {

            const visual =
              await getCurrentAvatarVisual(
                avatar.id
              );


            setAvatarVisual(
              visual
            );


            setResolvedAvatarImage(
              visual?.image ||
              avatar.image ||
              null
            );
          }


          setScreenReady(
            true
          );

        } catch (error) {

          console.log(
            "Avatar Center Load Error:",
            error
          );


          setScreenReady(
            true
          );
        }
      },
      []
    );


  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  React.useEffect(
    () => {

      loadAvatarCenter();

    },
    [
      loadAvatarCenter
    ]
  );


  // ==========================================================
  // PERIODIC STEP / WARDROBE REFRESH
  // ==========================================================
  //
  // Keeps progress current if steps change while this screen
  // is open.
  //
  // ==========================================================

  React.useEffect(
    () => {

      const timer =
        setInterval(
          async () => {

            try {

              const [
                savedSteps,
                currentSuit,
              ] =
                await Promise.all([

                  AsyncStorage.getItem(
                    "lifetimeSteps"
                  ),

                  getCurrentAvatarSuit(),

                ]);


              setLifetimeSteps(
                safeNumber(
                  savedSteps
                )
              );


              setEquippedSuit(
                currentSuit ||
                "default"
              );

            } catch (error) {

              console.log(
                "Avatar Center refresh error:",
                error
              );
            }

          },
          3000
        );


      return () =>
        clearInterval(
          timer
        );

    },
    []
  );


  // ==========================================================
  // REFRESH IMAGE WHEN AVATAR OR SUIT CHANGES
  // ==========================================================

  React.useEffect(
    () => {

      if (
        !screenReady ||
        !selectedAvatar?.id
      ) {
        return;
      }


      refreshAvatarVisual(
        selectedAvatar
      );

    },
    [
      selectedAvatar?.id,
      equippedSuit,
      screenReady
    ]
  );


  // ==========================================================
  // SELECT AVATAR
  // ==========================================================

  async function selectAvatar(
    avatar
  ) {

    if (
      !avatar?.id
    ) {
      return;
    }


    try {

      const profile = {
        name:
          avatarName,

        avatarId:
          avatar.id,
      };


      await AsyncStorage.setItem(
        "avatarProfile",
        JSON.stringify(
          profile
        )
      );


      setSelectedAvatar(
        avatar
      );


      // ------------------------------------------------------
      // KEEP CURRENT TRACKSUIT
      //
      // Changing avatar should NOT unequip the tracksuit.
      //
      // ------------------------------------------------------

      const visual =
        await getCurrentAvatarVisual(
          avatar.id
        );


      setAvatarVisual(
        visual
      );


      setResolvedAvatarImage(
        visual?.image ||
        avatar.image ||
        null
      );

    } catch (error) {

      console.log(
        "Select avatar error:",
        error
      );
    }
  }


  // ==========================================================
  // EQUIP TRACKSUIT
  // ==========================================================

  async function equipSuit(
    suit
  ) {

    if (
      !suit?.id
    ) {
      return;
    }


    const eligibility =
      canUserEquipTracksuit({
        lifetimeSteps,

        suitId:
          suit.id,

        subscriptionTier:
          membership,
      });


    // --------------------------------------------------------
    // STEP LOCK
    // --------------------------------------------------------

    if (
      eligibility.reason ===
      "steps"
    ) {

      Alert.alert(
        "Tracksuit Locked",
        `${Number(
          eligibility.progress?.remaining ||
          0
        ).toLocaleString()} Journey Lifetime Steps remaining.`
      );

      return;
    }


    // --------------------------------------------------------
    // PREMIUM LOCK
    // --------------------------------------------------------

    if (
      eligibility.reason ===
      "premium_required"
    ) {

      Alert.alert(
        "Premium Required",
        "Blue, Green, Red, and Yellow tracksuits are available to Premium and Elite members."
      );

      return;
    }


    // --------------------------------------------------------
    // ELITE LOCK
    // --------------------------------------------------------

    if (
      eligibility.reason ===
      "elite_required"
    ) {

      Alert.alert(
        "Elite Required",
        "The Black & Gold Elite Tracksuit is available to Elite members."
      );

      return;
    }


    if (
      !eligibility.allowed
    ) {

      Alert.alert(
        "Tracksuit Unavailable",
        "This tracksuit cannot be equipped yet."
      );

      return;
    }


    try {

      // ------------------------------------------------------
      // AUTHORITATIVE WARDROBE SAVE
      // ------------------------------------------------------

      const result =
        await setCurrentAvatarSuit(
          suit.id,
          suit.level
        );


      if (
        !result?.success
      ) {

        throw new Error(
          "Unable to save equipped tracksuit."
        );
      }


      setEquippedSuit(
        result.suitId
      );


      // ------------------------------------------------------
      // IMMEDIATE VISUAL UPDATE
      // ------------------------------------------------------

      if (
        selectedAvatar?.id
      ) {

        const preview =
          getTracksuitVisual({
            avatarId:
              selectedAvatar.id,

            suitId:
              result.suitId,
          });


        if (
          preview?.image
        ) {

          setResolvedAvatarImage(
            preview.image
          );

          setAvatarVisual(
            preview
          );

        } else {

          await refreshAvatarVisual(
            selectedAvatar
          );
        }
      }


      Alert.alert(
        "Tracksuit Equipped",
        `${suit.name} is now being worn.`
      );

    } catch (error) {

      console.log(
        "Equip tracksuit error:",
        error
      );


      Alert.alert(
        "Unable to Equip",
        "The tracksuit could not be equipped."
      );
    }
  }


  // ==========================================================
  // REMOVE TRACKSUIT
  // ==========================================================

  async function wearDefaultOutfit() {

    try {

      await setCurrentAvatarSuit(
        "default",
        0
      );


      setEquippedSuit(
        "default"
      );


      if (
        selectedAvatar
      ) {

        setResolvedAvatarImage(
          selectedAvatar.image ||
          null
        );


        await refreshAvatarVisual(
          selectedAvatar
        );
      }

    } catch (error) {

      console.log(
        "Wear default outfit error:",
        error
      );
    }
  }


  // ==========================================================
  // EDIT AVATAR NAME
  // ==========================================================

  function editAvatarName() {

    if (
      Platform.OS !==
      "ios"
    ) {

      Alert.alert(
        "Edit Avatar Name",
        "Avatar name editing is currently available on iPhone."
      );

      return;
    }


    Alert.prompt(
      "Edit Avatar Name",
      "Enter a new avatar name.",
      async (text) => {

        const newName =
          String(
            text || ""
          ).trim();


        if (
          !newName
        ) {
          return;
        }


        try {

          const profile = {
            name:
              newName,

            avatarId:
              selectedAvatar?.id ||
              getDefaultAvatar()?.id,
          };


          await AsyncStorage.setItem(
            "avatarProfile",
            JSON.stringify(
              profile
            )
          );


          setAvatarName(
            newName
          );

        } catch (error) {

          console.log(
            "Edit avatar name error:",
            error
          );
        }
      }
    );
  }


  // ==========================================================
  // DERIVED VALUES
  // ==========================================================

  const rank =
    getRank(
      lifetimeSteps
    );


  const unlockedBySteps =
    TRACKSUIT_TIERS.filter(
      (suit) =>
        getTracksuitProgress(
          lifetimeSteps,
          suit
        ).unlocked
    );


  const nextSuit =
    TRACKSUIT_TIERS.find(
      (suit) =>
        !getTracksuitProgress(
          lifetimeSteps,
          suit
        ).unlocked
    ) ||
    null;


  const nextProgress =
    nextSuit
      ? getTracksuitProgress(
          lifetimeSteps,
          nextSuit
        )
      : null;


  const currentSuit =
    TRACKSUIT_TIERS.find(
      (suit) =>
        suit.id ===
        equippedSuit
    ) ||
    null;


  // ==========================================================
  // UI
  // ==========================================================

  return (
    <ScrollView
      style={
        styles.container
      }
      contentContainerStyle={
        styles.content
      }
      showsVerticalScrollIndicator={
        false
      }
    >

      {/* ====================================================
          TOP BAR
      ==================================================== */}

      <View
        style={
          styles.topRow
        }
      >

        {goBack ? (
          <TouchableOpacity
            style={
              styles.backButton
            }
            onPress={
              goBack
            }
            activeOpacity={
              0.82
            }
          >
            <Text
              style={
                styles.backButtonText
              }
            >
              ‹ Back
            </Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}


        <View
          style={[
            styles.membershipBadge,

            membership ===
              "elite" &&
              styles.eliteBadge,
          ]}
        >
          <Text
            style={
              styles.membershipBadgeText
            }
          >
            {membership ===
            "elite"
              ? "👑 ELITE"
              : membership ===
                "premium"
              ? "👑 PREMIUM"
              : "BASIC"}
          </Text>
        </View>

      </View>


      {/* ====================================================
          HEADER
      ==================================================== */}

      <Text
        style={
          styles.kicker
        }
      >
        LEGATHON WALK
      </Text>


      <Text
        style={
          styles.title
        }
      >
        Avatar Center
      </Text>


      <Text
        style={
          styles.subtitle
        }
      >
        Your Legacy. Your Journey. Your Avatar.
      </Text>


      {/* ====================================================
          HERO
      ==================================================== */}

      <View
        style={
          styles.heroCard
        }
      >

        <View
          style={
            styles.avatarStage
          }
        >

          <View
            style={
              styles.glowCircle
            }
          />


          {resolvedAvatarImage ? (
            <Image
              source={
                resolvedAvatarImage
              }
              style={
                styles.avatarImage
              }
              resizeMode="contain"
            />
          ) : (
            <View
              style={
                styles.avatarPlaceholder
              }
            >
              <Text
                style={
                  styles.avatarPlaceholderText
                }
              >
                🙂
              </Text>
            </View>
          )}


          <View
            style={
              styles.rankBadge
            }
          >
            <Text
              style={
                styles.rankBadgeText
              }
            >
              {rank}
            </Text>
          </View>

        </View>


        <View
          style={
            styles.heroInfo
          }
        >

          <Text
            style={
              styles.heroKicker
            }
          >
            YOUR AVATAR
          </Text>


          <Text
            style={
              styles.avatarName
            }
          >
            {avatarName}
          </Text>


          <Text
            style={
              styles.avatarLabel
            }
          >
            {selectedAvatar?.label ||
              selectedAvatar?.id ||
              "Avatar"}
          </Text>


          {currentSuit ? (
            <View
              style={
                styles.wearingPill
              }
            >
              <Text
                style={
                  styles.wearingPillText
                }
              >
                ✓ Wearing {currentSuit.name}
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              style={
                styles.defaultOutfitPill
              }
              onPress={
                wearDefaultOutfit
              }
            >
              <Text
                style={
                  styles.defaultOutfitText
                }
              >
                Default Outfit
              </Text>
            </TouchableOpacity>
          )}


          {loadingVisual ? (
            <Text
              style={
                styles.loadingText
              }
            >
              Updating outfit…
            </Text>
          ) : null}


          {__DEV__ &&
          avatarVisual?.fallbackUsed ? (
            <Text
              style={
                styles.debugText
              }
            >
              Normal avatar fallback active
            </Text>
          ) : null}

        </View>

      </View>


      {/* ====================================================
          LIFETIME STEPS
      ==================================================== */}

      <View
        style={
          styles.lifetimeCard
        }
      >

        <Text
          style={
            styles.lifetimeLabel
          }
        >
          JOURNEY LIFETIME STEPS
        </Text>


        <Text
          style={
            styles.lifetimeNumber
          }
        >
          {Math.floor(
            lifetimeSteps
          ).toLocaleString()}
        </Text>


        <Text
          style={
            styles.lifetimeNote
          }
        >
          Marathon steps do not advance tracksuit progression.
        </Text>

      </View>


      {/* ====================================================
          NEXT UNLOCK
      ==================================================== */}

      <View
        style={
          styles.nextCard
        }
      >

        <Text
          style={
            styles.nextTitle
          }
        >
          👑 Next Legathon Unlock
        </Text>


        <Text
          style={
            styles.nextSuitName
          }
        >
          {nextSuit
            ? nextSuit.name
            : "All Tracksuits Unlocked"}
        </Text>


        <View
          style={
            styles.progressTrack
          }
        >
          <View
            style={[
              styles.progressFill,
              {
                width:
                  `${
                    nextProgress
                      ? nextProgress.percent100
                      : 100
                  }%`,
              },
            ]}
          />
        </View>


        <Text
          style={
            styles.nextRemaining
          }
        >
          {nextProgress
            ? `${nextProgress.remaining.toLocaleString()} steps remaining`
            : "Every tracksuit milestone has been completed."}
        </Text>

      </View>


      {/* ====================================================
          ACTIONS
      ==================================================== */}

      <View
        style={
          styles.actions
        }
      >

        <ActionButton
          icon="🙂"
          title="Change Avatar"
          subtitle="Choose your age, race, and gender avatar"
          onPress={
            goToAvatarPicker
          }
        />


        <ActionButton
          icon="✏️"
          title="Edit Name"
          subtitle="Update your avatar display name"
          onPress={
            editAvatarName
          }
        />


        <ActionButton
          icon="🎁"
          title="Rewards"
          subtitle="View your Legathon rewards"
          onPress={
            goToRewards
          }
        />


        <ActionButton
          icon="⭐"
          title="Milestones"
          subtitle={`${unlockedBySteps.length} of ${TRACKSUIT_TIERS.length} tracksuit milestones completed`}
          onPress={() => {}}
        />

      </View>


      {/* ====================================================
          AVATAR SHOWCASE
      ==================================================== */}

      <View
        style={
          styles.sectionHeader
        }
      >
        <Text
          style={
            styles.sectionTitle
          }
        >
          Your Avatar Showcase
        </Text>

        <Text
          style={
            styles.sectionSideText
          }
        >
          Collection
        </Text>
      </View>


      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.avatarStrip
        }
      >

        {avatarOptions.map(
          (avatar) => {

            const active =
              avatar.id ===
              selectedAvatar?.id;


            return (
              <TouchableOpacity
                key={
                  avatar.id
                }
                style={[
                  styles.avatarCard,

                  active &&
                    styles.avatarCardActive,
                ]}
                onPress={() =>
                  selectAvatar(
                    avatar
                  )
                }
                activeOpacity={
                  0.82
                }
              >

                <Image
                  source={
                    active &&
                    resolvedAvatarImage
                      ? resolvedAvatarImage
                      : avatar.image
                  }
                  style={
                    styles.avatarCardImage
                  }
                  resizeMode="contain"
                />


                <Text
                  style={
                    styles.avatarCardLabel
                  }
                  numberOfLines={
                    1
                  }
                >
                  {avatar.label ||
                    avatar.id}
                </Text>


                {active ? (
                  <Text
                    style={
                      styles.activeLabel
                    }
                  >
                    ACTIVE
                  </Text>
                ) : null}

              </TouchableOpacity>
            );
          }
        )}

      </ScrollView>


      {/* ====================================================
          WARDROBE
      ==================================================== */}

      <Text
        style={
          styles.wardrobeTitle
        }
      >
        Wardrobe Unlocks
      </Text>


      {membership ===
      "basic" ? (
        <View
          style={
            styles.membershipNotice
          }
        >
          <Text
            style={
              styles.membershipNoticeTitle
            }
          >
            Premium Wardrobe
          </Text>

          <Text
            style={
              styles.membershipNoticeText
            }
          >
            Tracksuits are available to Premium and Elite members. Your Journey Lifetime Steps continue to accumulate.
          </Text>
        </View>
      ) : null}


      {TRACKSUIT_TIERS.map(
        (suit) => {

          const progress =
            getTracksuitProgress(
              lifetimeSteps,
              suit
            );


          const access =
            canUserEquipTracksuit({
              lifetimeSteps,

              suitId:
                suit.id,

              subscriptionTier:
                membership,
            });


          const equipped =
            equippedSuit ===
            suit.id;


          let buttonLabel =
            "Locked";


          if (
            equipped
          ) {
            buttonLabel =
              "Wearing";
          } else if (
            access.allowed
          ) {
            buttonLabel =
              "Wear Suit";
          } else if (
            progress.unlocked &&
            access.reason ===
              "premium_required"
          ) {
            buttonLabel =
              "Premium";
          } else if (
            progress.unlocked &&
            access.reason ===
              "elite_required"
          ) {
            buttonLabel =
              "Elite";
          }


          return (
            <View
              key={
                suit.id
              }
              style={
                styles.suitCard
              }
            >

              {/* ----------------------------------------------
                  TRACKSUIT PREVIEW
              ---------------------------------------------- */}

              <SuitPreview
                selectedAvatar={
                  selectedAvatar
                }
                suit={
                  suit
                }
              />


              <View
                style={
                  styles.suitContent
                }
              >

                <Text
                  style={
                    styles.suitName
                  }
                >
                  {suit.name}
                </Text>


                <Text
                  style={
                    styles.suitRequirement
                  }
                >
                  Walk{" "}
                  {Number(
                    suit.tierSteps
                  ).toLocaleString()}{" "}
                  additional Journey Steps
                  {"\n"}
                  Unlocks at{" "}
                  {Number(
                    suit.unlockAt
                  ).toLocaleString()}{" "}
                  lifetime steps
                </Text>


                <View
                  style={
                    styles.suitProgressTrack
                  }
                >
                  <View
                    style={[
                      styles.suitProgressFill,
                      {
                        width:
                          `${progress.percent100}%`,
                      },
                    ]}
                  />
                </View>


                <Text
                  style={
                    progress.unlocked
                      ? styles.unlockedText
                      : styles.lockedText
                  }
                >
                  {progress.unlocked
                    ? "✅ Walking milestone completed"
                    : `🔒 ${progress.remaining.toLocaleString()} steps remaining`}
                </Text>


                <TouchableOpacity
                  style={[
                    styles.equipButton,

                    !access.allowed &&
                      !equipped &&
                      styles.equipButtonDisabled,

                    equipped &&
                      styles.equipButtonActive,
                  ]}
                  disabled={
                    equipped
                  }
                  onPress={() =>
                    equipSuit(
                      suit
                    )
                  }
                  activeOpacity={
                    0.82
                  }
                >
                  <Text
                    style={
                      styles.equipButtonText
                    }
                  >
                    {buttonLabel}
                  </Text>
                </TouchableOpacity>

              </View>

            </View>
          );
        }
      )}


      {/* ====================================================
          RETURN TO DEFAULT OUTFIT
      ==================================================== */}

      {equippedSuit !==
      "default" ? (
        <TouchableOpacity
          style={
            styles.defaultButton
          }
          onPress={
            wearDefaultOutfit
          }
          activeOpacity={
            0.82
          }
        >
          <Text
            style={
              styles.defaultButtonText
            }
          >
            Wear Default Outfit
          </Text>
        </TouchableOpacity>
      ) : null}

    </ScrollView>
  );
}


// ============================================================
// SUIT PREVIEW
// ============================================================
//
// Shows THIS selected avatar wearing each tracksuit.
//
// No generic product image is required.
//
// ============================================================

function SuitPreview({
  selectedAvatar,
  suit,
}) {

  const preview =
    React.useMemo(
      () => {

        if (
          !selectedAvatar?.id ||
          !suit?.id
        ) {
          return null;
        }


        return getTracksuitVisual({
          avatarId:
            selectedAvatar.id,

          suitId:
            suit.id,
        });

      },
      [
        selectedAvatar?.id,
        suit?.id
      ]
    );


  const image =
    preview?.image ||
    selectedAvatar?.image ||
    null;


  return (
    <View
      style={
        styles.suitPreview
      }
    >

      {image ? (
        <Image
          source={
            image
          }
          style={
            styles.suitPreviewImage
          }
          resizeMode="contain"
        />
      ) : null}

    </View>
  );
}


// ============================================================
// STYLES
// ============================================================

const styles =
  StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor:
        "#03070D",
    },


    content: {
      paddingHorizontal: 28,
      paddingTop: 52,
      paddingBottom: 170,
    },


    // --------------------------------------------------------
    // TOP
    // --------------------------------------------------------

    topRow: {
      flexDirection:
        "row",

      justifyContent:
        "space-between",

      alignItems:
        "center",

      marginBottom: 42,
    },


    backButton: {
      borderWidth: 2,
      borderColor:
        "#E2B93B",

      borderRadius: 40,

      paddingVertical: 13,
      paddingHorizontal: 22,
    },


    backButtonText: {
      color:
        "#E8C149",

      fontSize: 18,
      fontWeight:
        "900",
    },


    membershipBadge: {
      borderRadius: 40,
      borderWidth: 2,
      borderColor:
        "#566277",

      backgroundColor:
        "#101827",

      paddingVertical: 12,
      paddingHorizontal: 20,
    },


    eliteBadge: {
      borderColor:
        "#E1B538",

      backgroundColor:
        "#241B08",
    },


    membershipBadgeText: {
      color:
        "#FFD64A",

      fontSize: 15,
      fontWeight:
        "900",
    },


    // --------------------------------------------------------
    // HEADER
    // --------------------------------------------------------

    kicker: {
      color:
        "#A7F2D8",

      fontSize: 16,
      fontWeight:
        "900",

      letterSpacing: 6,

      marginBottom: 14,
    },


    title: {
      color:
        "#FFFFFF",

      fontSize: 56,
      lineHeight: 62,

      fontWeight:
        "900",

      marginBottom: 12,
    },


    subtitle: {
      color:
        "#C8D2E0",

      fontSize: 19,
      lineHeight: 28,

      fontWeight:
        "700",

      marginBottom: 32,
    },


    // --------------------------------------------------------
    // HERO
    // --------------------------------------------------------

    heroCard: {
      backgroundColor:
        "#0D1B30",

      borderWidth: 2,
      borderColor:
        "#DDB536",

      borderRadius: 32,

      overflow:
        "hidden",

      marginBottom: 24,
    },


    avatarStage: {
      height: 575,

      justifyContent:
        "center",

      alignItems:
        "center",

      backgroundColor:
        "#071426",

      position:
        "relative",
    },


    glowCircle: {
      position:
        "absolute",

      width: 390,
      height: 390,

      borderRadius: 195,

      backgroundColor:
        "#281A60",

      borderWidth: 4,

      borderColor:
        "#7946E5",
    },


    avatarImage: {
      width:
        "88%",

      height:
        "88%",

      zIndex: 2,
    },


    avatarPlaceholder: {
      width: 230,
      height: 230,

      borderRadius: 115,

      justifyContent:
        "center",

      alignItems:
        "center",

      zIndex: 2,
    },


    avatarPlaceholderText: {
      fontSize: 86,
    },


    rankBadge: {
      position:
        "absolute",

      bottom: 18,

      zIndex: 5,

      backgroundColor:
        "#08111F",

      borderColor:
        "#DBB33A",

      borderWidth: 1,

      borderRadius: 30,

      paddingVertical: 8,
      paddingHorizontal: 20,
    },


    rankBadgeText: {
      color:
        "#FFD54B",

      fontWeight:
        "900",

      fontSize: 16,
    },


    heroInfo: {
      padding: 28,

      alignItems:
        "center",
    },


    heroKicker: {
      color:
        "#FFD54B",

      fontWeight:
        "900",

      letterSpacing: 3,

      marginBottom: 8,
    },


    avatarName: {
      color:
        "#FFFFFF",

      fontSize: 40,

      fontWeight:
        "900",

      textAlign:
        "center",
    },


    avatarLabel: {
      color:
        "#E8BE3C",

      fontSize: 18,

      fontWeight:
        "800",

      marginTop: 7,

      textAlign:
        "center",
    },


    wearingPill: {
      marginTop: 18,

      borderRadius: 30,

      borderWidth: 1,

      borderColor:
        "#64DDA5",

      backgroundColor:
        "#10392B",

      paddingHorizontal: 18,
      paddingVertical: 9,
    },


    wearingPillText: {
      color:
        "#A8F2D7",

      fontWeight:
        "900",
    },


    defaultOutfitPill: {
      marginTop: 18,

      borderRadius: 30,

      borderWidth: 1,

      borderColor:
        "#44536A",

      paddingHorizontal: 18,
      paddingVertical: 9,
    },


    defaultOutfitText: {
      color:
        "#CFD8E5",

      fontWeight:
        "800",
    },


    loadingText: {
      color:
        "#8291A6",

      marginTop: 10,
    },


    debugText: {
      color:
        "#A7B0BE",

      fontSize: 11,

      marginTop: 8,
    },


    // --------------------------------------------------------
    // LIFETIME CARD
    // --------------------------------------------------------

    lifetimeCard: {
      backgroundColor:
        "#101B2D",

      borderWidth: 1,
      borderColor:
        "#29415E",

      borderRadius: 26,

      padding: 26,

      marginBottom: 24,
    },


    lifetimeLabel: {
      color:
        "#A6F1D6",

      fontSize: 14,

      letterSpacing: 2,

      fontWeight:
        "900",
    },


    lifetimeNumber: {
      color:
        "#FFFFFF",

      fontSize: 44,

      fontWeight:
        "900",

      marginTop: 8,
    },


    lifetimeNote: {
      color:
        "#9BA9BA",

      fontSize: 14,

      lineHeight: 21,

      marginTop: 8,
    },


    // --------------------------------------------------------
    // NEXT
    // --------------------------------------------------------

    nextCard: {
      padding: 26,

      borderRadius: 26,

      borderWidth: 2,

      borderColor:
        "#DDB536",

      backgroundColor:
        "#101827",

      marginBottom: 24,
    },


    nextTitle: {
      color:
        "#FFD54B",

      fontSize: 20,

      fontWeight:
        "900",

      marginBottom: 15,
    },


    nextSuitName: {
      color:
        "#FFFFFF",

      fontSize: 34,

      lineHeight: 40,

      fontWeight:
        "900",

      marginBottom: 20,
    },


    progressTrack: {
      height: 16,

      borderRadius: 20,

      backgroundColor:
        "#293449",

      overflow:
        "hidden",

      marginBottom: 16,
    },


    progressFill: {
      height:
        "100%",

      borderRadius: 20,

      backgroundColor:
        "#E7BC2F",
    },


    nextRemaining: {
      color:
        "#A6F1D6",

      fontSize: 18,

      fontWeight:
        "900",
    },


    // --------------------------------------------------------
    // ACTIONS
    // --------------------------------------------------------

    actions: {
      gap: 15,

      marginBottom: 38,
    },


    actionButton: {
      minHeight: 108,

      backgroundColor:
        "#0D1B30",

      borderRadius: 23,

      borderWidth: 1,

      borderColor:
        "#294562",

      flexDirection:
        "row",

      alignItems:
        "center",

      paddingHorizontal: 20,
    },


    actionIcon: {
      width: 66,

      textAlign:
        "center",

      fontSize: 34,
    },


    actionTextWrap: {
      flex: 1,

      paddingHorizontal: 10,
    },


    actionTitle: {
      color:
        "#FFFFFF",

      fontSize: 22,

      fontWeight:
        "900",
    },


    actionSubtitle: {
      color:
        "#B5C0D0",

      fontSize: 14,

      lineHeight: 20,

      marginTop: 4,

      fontWeight:
        "700",
    },


    actionArrow: {
      color:
        "#CFD7E2",

      fontSize: 42,
    },


    // --------------------------------------------------------
    // SHOWCASE
    // --------------------------------------------------------

    sectionHeader: {
      flexDirection:
        "row",

      justifyContent:
        "space-between",

      alignItems:
        "center",

      marginBottom: 17,
    },


    sectionTitle: {
      color:
        "#FFFFFF",

      fontSize: 27,

      fontWeight:
        "900",
    },


    sectionSideText: {
      color:
        "#A6F1D6",

      fontSize: 14,

      fontWeight:
        "800",
    },


    avatarStrip: {
      gap: 13,

      paddingRight: 20,

      marginBottom: 40,
    },


    avatarCard: {
      width: 160,
      height: 245,

      borderRadius: 22,

      borderWidth: 1,

      borderColor:
        "#29415E",

      backgroundColor:
        "#0D192A",

      padding: 10,

      alignItems:
        "center",
    },


    avatarCardActive: {
      borderWidth: 3,

      borderColor:
        "#DDB536",
    },


    avatarCardImage: {
      width: 130,
      height: 174,
    },


    avatarCardLabel: {
      color:
        "#FFFFFF",

      fontSize: 13,

      fontWeight:
        "800",

      textAlign:
        "center",

      maxWidth: 135,
    },


    activeLabel: {
      color:
        "#A6F1D6",

      fontSize: 12,

      fontWeight:
        "900",

      marginTop: 5,
    },


    // --------------------------------------------------------
    // WARDROBE
    // --------------------------------------------------------

    wardrobeTitle: {
      color:
        "#FFFFFF",

      fontSize: 39,

      lineHeight: 46,

      fontWeight:
        "900",

      marginBottom: 22,
    },


    membershipNotice: {
      padding: 22,

      borderRadius: 22,

      borderWidth: 1,

      borderColor:
        "#56448B",

      backgroundColor:
        "#171229",

      marginBottom: 22,
    },


    membershipNoticeTitle: {
      color:
        "#FFD54B",

      fontSize: 19,

      fontWeight:
        "900",
    },


    membershipNoticeText: {
      color:
        "#CDD5E0",

      fontSize: 15,

      lineHeight: 22,

      marginTop: 8,
    },


    suitCard: {
      borderRadius: 28,

      overflow:
        "hidden",

      borderWidth: 1,

      borderColor:
        "#29415E",

      backgroundColor:
        "#0D192A",

      marginBottom: 24,
    },


    suitPreview: {
      height: 440,

      backgroundColor:
        "#07101D",

      justifyContent:
        "center",

      alignItems:
        "center",
    },


    suitPreviewImage: {
      width:
        "94%",

      height:
        "94%",
    },


    suitContent: {
      padding: 26,
    },


    suitName: {
      color:
        "#FFFFFF",

      fontSize: 32,

      lineHeight: 39,

      fontWeight:
        "900",

      marginBottom: 12,
    },


    suitRequirement: {
      color:
        "#D8DFE8",

      fontSize: 16,

      lineHeight: 24,

      fontWeight:
        "700",

      marginBottom: 18,
    },


    suitProgressTrack: {
      height: 15,

      borderRadius: 20,

      overflow:
        "hidden",

      backgroundColor:
        "#293449",

      marginBottom: 16,
    },


    suitProgressFill: {
      height:
        "100%",

      borderRadius: 20,

      backgroundColor:
        "#E7BC2F",
    },


    unlockedText: {
      color:
        "#8CE7B8",

      fontSize: 17,

      fontWeight:
        "900",

      marginBottom: 18,
    },


    lockedText: {
      color:
        "#FFD54B",

      fontSize: 17,

      fontWeight:
        "900",

      marginBottom: 18,
    },


    equipButton: {
      minHeight: 68,

      borderRadius: 34,

      justifyContent:
        "center",

      alignItems:
        "center",

      backgroundColor:
        "#18A954",
    },


    equipButtonActive: {
      borderWidth: 2,

      borderColor:
        "#61E99A",
    },


    equipButtonDisabled: {
      backgroundColor:
        "#465268",
    },


    equipButtonText: {
      color:
        "#07100B",

      fontSize: 20,

      fontWeight:
        "900",
    },


    defaultButton: {
      minHeight: 68,

      borderRadius: 34,

      borderWidth: 2,

      borderColor:
        "#DDB536",

      justifyContent:
        "center",

      alignItems:
        "center",

      marginTop: 8,
    },


    defaultButtonText: {
      color:
        "#FFD54B",

      fontSize: 18,

      fontWeight:
        "900",
    },

  });