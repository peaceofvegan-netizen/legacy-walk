// data/journeyStories.js

const createChapter = ({
  id,
  checkpoint,
  location,
  title,
  description,
  narration,
  xp = 20,
}) => ({
  id,
  checkpoint,
  location,
  title,
  description,
  narration,
  xp,
});

const createJourneyStory = ({
  id,
  title,
  subtitle = "",
  location = "",
  country = "",
  introduction,
  completionTitle,
  completionStory,
  certificateText,
  chapters,
}) => {
  if (!Array.isArray(chapters) || chapters.length !== 5) {
    console.warn(
      `[Journey Story Database] "${title}" must contain exactly five chapters.`
    );
  }

  return {
    id,
    title,
    subtitle,
    location,
    country,
    introduction,
    completionTitle,
    completionStory,
    certificateText,

    storyLevel: 1,
    levelXPGoal: 100,

    chapters: chapters.map((chapter, index) => ({
      ...chapter,
      checkpoint: index + 1,
      unlockPercent: index * 25,
    })),
  };
};

export const JOURNEY_STORIES = {
  "chichen-itza": {
    id: "chichen-itza",
    title: "Chichén Itzá",
    location: "Yucatán",
    country: "Mexico",
    introduction:
      "Walk through the ancient Maya city of Chichén Itzá and discover its temples, observatory, sacred spaces, and enduring legacy.",
    chapters: [
      {
        id: "chichen-itza-1",
        checkpoint: 1,
        location: "The Grand Entrance",
        title: "The Journey Begins",
        description:
          "Enter one of the most influential Maya cities in the ancient world.",
        narration:
          "Your journey begins at Chichén Itzá, where stone temples and ceremonial plazas reveal the power and knowledge of the Maya civilization.",
        xp: 20,
      },
      {
        id: "chichen-itza-2",
        checkpoint: 2,
        location: "El Castillo",
        title: "Temple of Kukulcán",
        description:
          "Discover the pyramid designed with remarkable astronomical precision.",
        narration:
          "El Castillo rises ahead, its stairways and terraces reflecting the Maya understanding of time, seasons, and the movement of the sun.",
        xp: 25,
      },
      {
        id: "chichen-itza-3",
        checkpoint: 3,
        location: "Great Ball Court",
        title: "The Sacred Game",
        description:
          "Explore the largest known ancient ball court in Mesoamerica.",
        narration:
          "Within these towering walls, athletes played a ceremonial game tied to honor, religion, and the balance between life and death.",
        xp: 30,
      },
      {
        id: "chichen-itza-4",
        checkpoint: 4,
        location: "El Caracol",
        title: "The Maya Observatory",
        description:
          "Learn how Maya astronomers studied the sky and tracked celestial cycles.",
        narration:
          "The rounded tower of El Caracol demonstrates the extraordinary scientific knowledge used to observe the heavens and guide Maya society.",
        xp: 35,
      },
      {
        id: "chichen-itza-5",
        checkpoint: 5,
        location: "Sacred Cenote",
        title: "A Civilization Remembered",
        description:
          "Complete the journey beside one of the city’s most sacred natural sites.",
        narration:
          "At the Sacred Cenote, your journey ends with a deeper appreciation for the faith, ingenuity, and resilience of the Maya people.",
        xp: 50,
      },
    ],
  },

  "machu-picchu": {
    id: "machu-picchu",
    title: "Machu Picchu",
    location: "Cusco Region",
    country: "Peru",
    introduction:
      "Climb into the Andes and explore the terraces, temples, and mountain pathways of Machu Picchu.",
    chapters: [
      {
        id: "machu-picchu-1",
        checkpoint: 1,
        location: "Sun Gate",
        title: "The Mountain Approach",
        description:
          "Begin the journey along the high trail leading toward the hidden Inca city.",
        narration:
          "Your path begins at the Sun Gate, where the first view of Machu Picchu emerges through the mountain mist.",
        xp: 20,
      },
      {
        id: "machu-picchu-2",
        checkpoint: 2,
        location: "Agricultural Terraces",
        title: "Engineering the Mountain",
        description:
          "Discover how the Inca shaped steep slopes into productive farmland.",
        narration:
          "The terraces beneath you were carefully engineered to prevent erosion, manage water, and sustain life high in the Andes.",
        xp: 25,
      },
      {
        id: "machu-picchu-3",
        checkpoint: 3,
        location: "Temple of the Sun",
        title: "Sacred Alignment",
        description:
          "Explore a temple designed around the movement of sunlight.",
        narration:
          "At the Temple of the Sun, precisely placed windows illuminate sacred stonework during important moments of the year.",
        xp: 30,
      },
      {
        id: "machu-picchu-4",
        checkpoint: 4,
        location: "Intihuatana Stone",
        title: "The Hitching Post of the Sun",
        description:
          "Learn about one of the most important ritual stones at Machu Picchu.",
        narration:
          "The Intihuatana Stone reflects the Inca relationship with the sun, the seasons, and the sacred landscape.",
        xp: 35,
      },
      {
        id: "machu-picchu-5",
        checkpoint: 5,
        location: "Sacred Plaza",
        title: "City Above the Clouds",
        description:
          "Complete the journey overlooking the preserved heart of Machu Picchu.",
        narration:
          "From the Sacred Plaza, the city stands as a lasting symbol of Inca vision, craftsmanship, and harmony with nature.",
        xp: 50,
      },
    ],
  },

  petra: {
    id: "petra",
    title: "Petra",
    location: "Ma'an Governorate",
    country: "Jordan",
    introduction:
      "Walk through narrow sandstone canyons into the ancient Nabataean city of Petra.",
    chapters: [
      {
        id: "petra-1",
        checkpoint: 1,
        location: "The Siq",
        title: "The Hidden Passage",
        description:
          "Enter Petra through the dramatic canyon that guarded the ancient city.",
        narration:
          "Your journey begins inside the Siq, where towering sandstone walls guide you toward one of history’s most remarkable cities.",
        xp: 20,
      },
      {
        id: "petra-2",
        checkpoint: 2,
        location: "The Treasury",
        title: "Carved from Stone",
        description:
          "Discover Petra’s most famous monument emerging from the canyon.",
        narration:
          "The Treasury appears suddenly before you, its elaborate façade carved directly into the rose-colored cliff.",
        xp: 25,
      },
      {
        id: "petra-3",
        checkpoint: 3,
        location: "Street of Facades",
        title: "City of Tombs",
        description:
          "Explore rows of monumental tombs cut into the rock.",
        narration:
          "Along the Street of Facades, the Nabataeans honored their dead with architecture that blended local traditions and distant influences.",
        xp: 30,
      },
      {
        id: "petra-4",
        checkpoint: 4,
        location: "Great Temple",
        title: "Power and Trade",
        description:
          "Learn how Petra grew wealthy through regional trade.",
        narration:
          "The Great Temple reflects Petra’s role as a major trading center linking Arabia, the Mediterranean, and the wider ancient world.",
        xp: 35,
      },
      {
        id: "petra-5",
        checkpoint: 5,
        location: "The Monastery",
        title: "The Final Ascent",
        description:
          "Complete the journey at one of Petra’s largest rock-cut monuments.",
        narration:
          "After the climb, the Monastery stands as a powerful reminder of Nabataean skill, endurance, and cultural achievement.",
        xp: 50,
      },
    ],
  },

  "angkor-wat": {
    id: "angkor-wat",
    title: "Angkor Wat",
    location: "Siem Reap",
    country: "Cambodia",
    introduction:
      "Explore the temple city of Angkor Wat and the spiritual world of the Khmer Empire.",
    chapters: [
      {
        id: "angkor-wat-1",
        checkpoint: 1,
        location: "Western Causeway",
        title: "Entering Angkor",
        description:
          "Begin across the long stone causeway leading toward the temple.",
        narration:
          "Your journey begins across the Western Causeway, where the towers of Angkor Wat rise above the surrounding moat.",
        xp: 20,
      },
      {
        id: "angkor-wat-2",
        checkpoint: 2,
        location: "Outer Gallery",
        title: "Stories in Stone",
        description:
          "Discover carved scenes of mythology, warfare, and royal life.",
        narration:
          "The gallery walls preserve vast stone narratives that reveal the beliefs and ambitions of the Khmer Empire.",
        xp: 25,
      },
      {
        id: "angkor-wat-3",
        checkpoint: 3,
        location: "Gallery of Bas-Reliefs",
        title: "The Churning of the Ocean",
        description:
          "Explore one of Angkor Wat’s most famous carved stories.",
        narration:
          "Gods and demons pull against one another in the great relief of the Churning of the Ocean of Milk.",
        xp: 30,
      },
      {
        id: "angkor-wat-4",
        checkpoint: 4,
        location: "Central Sanctuary",
        title: "Mountain of the Gods",
        description:
          "Climb toward the symbolic center of the temple.",
        narration:
          "The central towers represent Mount Meru, the sacred mountain at the center of the Hindu universe.",
        xp: 35,
      },
      {
        id: "angkor-wat-5",
        checkpoint: 5,
        location: "Lotus Pond",
        title: "A Living Legacy",
        description:
          "Complete the journey beside the reflecting pools of Angkor Wat.",
        narration:
          "Your journey ends with Angkor Wat reflected in the water, a lasting symbol of faith, artistry, and Cambodian identity.",
        xp: 50,
      },
    ],
  },

  "great-wall-of-china": {
    id: "great-wall-of-china",
    title: "Great Wall of China",
    location: "Beijing to Badaling",
    country: "China",
    introduction:
      "Walk along one of history’s greatest engineering and cultural legacies.",
    chapters: [
      {
        id: "great-wall-of-china-1",
        checkpoint: 1,
        location: "The Front Gate",
        title: "Historic Beginnings",
        description:
          "Begin at the fortified entrance to the Great Wall.",
        narration:
          "Your journey begins at the Front Gate, where generations of builders, soldiers, and travelers once entered the wall.",
        xp: 20,
      },
      {
        id: "great-wall-of-china-2",
        checkpoint: 2,
        location: "Watchtower Pass",
        title: "Signals Across the Empire",
        description:
          "Walk through ancient watchtowers used to protect the frontier.",
        narration:
          "From these watchtowers, smoke and fire signals carried warnings across long distances.",
        xp: 25,
      },
      {
        id: "great-wall-of-china-3",
        checkpoint: 3,
        location: "Mountain Ridge",
        title: "Walls Across the Ridges",
        description:
          "Climb the stone steps and view the wall stretching across the mountains.",
        narration:
          "The Great Wall follows the natural shape of the land, rising and falling across steep mountain ridges.",
        xp: 30,
      },
      {
        id: "great-wall-of-china-4",
        checkpoint: 4,
        location: "Ming Fortifications",
        title: "The Great Expansion",
        description:
          "Discover the strongest sections built during the Ming dynasty.",
        narration:
          "Ming engineers strengthened the wall with brick, stone, towers, and fortified passes.",
        xp: 35,
      },
      {
        id: "great-wall-of-china-5",
        checkpoint: 5,
        location: "Summit Tower",
        title: "A Legacy for All",
        description:
          "Complete the journey from a tower overlooking the distant landscape.",
        narration:
          "At the Summit Tower, the Great Wall stands as a symbol of endurance, unity, and human determination.",
        xp: 50,
      },
    ],
  },

  "terracotta-army": {
    id: "terracotta-army",
    title: "Terracotta Army",
    location: "Xi'an",
    country: "China",
    introduction:
      "Enter the underground world created to guard China’s first emperor.",
    chapters: [
      {
        id: "terracotta-army-1",
        checkpoint: 1,
        location: "Museum Entrance",
        title: "The Discovery",
        description:
          "Begin where one of the greatest archaeological finds was revealed.",
        narration:
          "Your journey begins with the discovery of thousands of life-sized clay soldiers buried for more than two thousand years.",
        xp: 20,
      },
      {
        id: "terracotta-army-2",
        checkpoint: 2,
        location: "Pit One",
        title: "The Main Formation",
        description:
          "View the largest formation of infantry and chariots.",
        narration:
          "Rows of soldiers stand in military formation, each figure shaped with unique facial details and equipment.",
        xp: 25,
      },
      {
        id: "terracotta-army-3",
        checkpoint: 3,
        location: "Command Pit",
        title: "The Generals",
        description:
          "Discover officers and commanders arranged for battle.",
        narration:
          "The command area reveals the hierarchy and organization of the army created for Emperor Qin Shi Huang.",
        xp: 30,
      },
      {
        id: "terracotta-army-4",
        checkpoint: 4,
        location: "Restoration Hall",
        title: "Rebuilding the Past",
        description:
          "Learn how archaeologists reconstruct damaged figures.",
        narration:
          "Each warrior is carefully restored from fragments, preserving evidence of ancient craftsmanship and mass production.",
        xp: 35,
      },
      {
        id: "terracotta-army-5",
        checkpoint: 5,
        location: "Imperial Tomb Complex",
        title: "The Emperor’s Legacy",
        description:
          "Complete the journey near the vast burial complex.",
        narration:
          "The Terracotta Army remains a powerful reflection of imperial ambition, belief in the afterlife, and the unification of China.",
        xp: 50,
      },
    ],
  },

  "forbidden-city": {
    id: "forbidden-city",
    title: "Forbidden City",
    location: "Beijing",
    country: "China",
    introduction:
      "Walk through the ceremonial halls and private courtyards of imperial China.",
    chapters: [
      {
        id: "forbidden-city-1",
        checkpoint: 1,
        location: "Meridian Gate",
        title: "Entering the Imperial City",
        description:
          "Begin beneath the largest gate of the Forbidden City.",
        narration:
          "Your journey begins at the Meridian Gate, once reserved for emperors, officials, and great state ceremonies.",
        xp: 20,
      },
      {
        id: "forbidden-city-2",
        checkpoint: 2,
        location: "Hall of Supreme Harmony",
        title: "The Imperial Throne",
        description:
          "Explore the ceremonial center of imperial authority.",
        narration:
          "The Hall of Supreme Harmony hosted coronations and major ceremonies at the heart of the empire.",
        xp: 25,
      },
      {
        id: "forbidden-city-3",
        checkpoint: 3,
        location: "Palace of Heavenly Purity",
        title: "Life Behind the Walls",
        description:
          "Discover the private world of the imperial household.",
        narration:
          "Beyond the ceremonial halls, the inner court reveals the daily life, responsibilities, and isolation of the emperor.",
        xp: 30,
      },
      {
        id: "forbidden-city-4",
        checkpoint: 4,
        location: "Imperial Garden",
        title: "Harmony and Reflection",
        description:
          "Walk through carefully designed gardens and pavilions.",
        narration:
          "The Imperial Garden offered a peaceful retreat shaped by stone, trees, architecture, and symbolic balance.",
        xp: 35,
      },
      {
        id: "forbidden-city-5",
        checkpoint: 5,
        location: "Gate of Divine Might",
        title: "Centuries of Power",
        description:
          "Complete the journey at the northern gate of the palace.",
        narration:
          "As you leave the Forbidden City, its vast courtyards remain a lasting record of imperial government, art, and ceremony.",
        xp: 50,
      },
    ],
  },

  "roman-empire": {
    id: "roman-empire",
    title: "Roman Empire",
    location: "Rome",
    country: "Italy",
    introduction:
      "Walk through the roads, forums, temples, and arenas of ancient Rome.",
    chapters: [
      {
        id: "roman-empire-1",
        checkpoint: 1,
        location: "Roman Forum",
        title: "Heart of the Republic",
        description:
          "Begin among the ruins of Rome’s political and civic center.",
        narration:
          "Your journey begins in the Roman Forum, where citizens debated, traded, worshiped, and shaped the future of Rome.",
        xp: 20,
      },
      {
        id: "roman-empire-2",
        checkpoint: 2,
        location: "Palatine Hill",
        title: "Birthplace of Rome",
        description:
          "Explore the hill associated with Rome’s legendary origins.",
        narration:
          "Palatine Hill became home to emperors and palaces, rising above the city that Rome would transform.",
        xp: 25,
      },
      {
        id: "roman-empire-3",
        checkpoint: 3,
        location: "Colosseum",
        title: "Arena of the Empire",
        description:
          "Discover the scale and spectacle of Rome’s greatest arena.",
        narration:
          "The Colosseum brought tens of thousands of spectators together for contests, ceremonies, and public entertainment.",
        xp: 30,
      },
      {
        id: "roman-empire-4",
        checkpoint: 4,
        location: "Appian Way",
        title: "Roads to the World",
        description:
          "Learn how Roman roads connected the empire.",
        narration:
          "The Appian Way represents the vast road network that carried armies, trade, ideas, and law across Roman territory.",
        xp: 35,
      },
      {
        id: "roman-empire-5",
        checkpoint: 5,
        location: "Pantheon",
        title: "Rome’s Enduring Influence",
        description:
          "Complete the journey beneath one of antiquity’s greatest domes.",
        narration:
          "The Pantheon closes your journey with a reminder of Rome’s lasting influence on architecture, government, engineering, and culture.",
        xp: 50,
      },
    ],
  },

  "nile-civilization": {
    id: "nile-civilization",
    title: "Nile Civilization",
    location: "Nile Valley",
    country: "Egypt",
    introduction:
      "Follow the Nile through the temples, tombs, and agricultural heart of ancient Egypt.",
    chapters: [
      {
        id: "nile-civilization-1",
        checkpoint: 1,
        location: "Riverbank Settlement",
        title: "Gift of the Nile",
        description:
          "Begin where annual floods made civilization possible.",
        narration:
          "Your journey begins beside the Nile, whose waters supported farming, transportation, trade, and daily life.",
        xp: 20,
      },
      {
        id: "nile-civilization-2",
        checkpoint: 2,
        location: "Temple of Karnak",
        title: "House of the Gods",
        description:
          "Explore one of the largest temple complexes in the ancient world.",
        narration:
          "Karnak grew over centuries as pharaohs added halls, statues, columns, and sacred spaces.",
        xp: 25,
      },
      {
        id: "nile-civilization-3",
        checkpoint: 3,
        location: "Valley of the Kings",
        title: "Tombs of the Pharaohs",
        description:
          "Discover the hidden burial places of Egypt’s rulers.",
        narration:
          "Deep within the desert cliffs, decorated tombs prepared pharaohs for the journey into the afterlife.",
        xp: 30,
      },
      {
        id: "nile-civilization-4",
        checkpoint: 4,
        location: "Luxor Temple",
        title: "Ceremony and Kingship",
        description:
          "Learn how rulers used temples to express divine authority.",
        narration:
          "Luxor Temple connected kingship, religion, and public ceremony along the Nile.",
        xp: 35,
      },
      {
        id: "nile-civilization-5",
        checkpoint: 5,
        location: "Nile Sunset",
        title: "A River Through Time",
        description:
          "Complete the journey overlooking the river that shaped Egypt.",
        narration:
          "As the sun sets over the Nile, the river remains a living link between ancient civilization and modern Egypt.",
        xp: 50,
      },
    ],
  },

  "great-zimbabwe": {
    id: "great-zimbabwe",
    title: "Great Zimbabwe",
    location: "Masvingo",
    country: "Zimbabwe",
    introduction:
      "Explore the stone enclosures and trading legacy of Great Zimbabwe.",
    chapters: [
      {
        id: "great-zimbabwe-1",
        checkpoint: 1,
        location: "Hill Complex",
        title: "The Stone City",
        description:
          "Begin among the oldest structures overlooking the site.",
        narration:
          "Your journey begins at the Hill Complex, where leaders once watched over a powerful southern African city.",
        xp: 20,
      },
      {
        id: "great-zimbabwe-2",
        checkpoint: 2,
        location: "Great Enclosure",
        title: "Walls Without Mortar",
        description:
          "Discover massive stone walls built without cement.",
        narration:
          "The Great Enclosure demonstrates advanced dry-stone construction and generations of skilled craftsmanship.",
        xp: 25,
      },
      {
        id: "great-zimbabwe-3",
        checkpoint: 3,
        location: "Conical Tower",
        title: "Symbol of Authority",
        description:
          "Explore one of the site’s most distinctive structures.",
        narration:
          "The Conical Tower remains a powerful symbol whose exact purpose continues to inspire study and debate.",
        xp: 30,
      },
      {
        id: "great-zimbabwe-4",
        checkpoint: 4,
        location: "Valley Ruins",
        title: "A Center of Trade",
        description:
          "Learn how Great Zimbabwe connected regional and overseas trade.",
        narration:
          "Objects found here reveal trade links reaching across Africa and the Indian Ocean world.",
        xp: 35,
      },
      {
        id: "great-zimbabwe-5",
        checkpoint: 5,
        location: "Panoramic Ridge",
        title: "African Achievement",
        description:
          "Complete the journey overlooking the ancient city.",
        narration:
          "Great Zimbabwe stands as a lasting monument to African statecraft, trade, architecture, and cultural achievement.",
        xp: 50,
      },
    ],
  },

  "acropolis-athens": {
    id: "acropolis-athens",
    title: "Acropolis Athens",
    location: "Athens",
    country: "Greece",
    introduction:
      "Walk through the birthplace of democracy and classical civilization.",
    chapters: [
      {
        id: "acropolis-athens-1",
        checkpoint: 1,
        location: "The Acropolis",
        title: "The Journey Begins",
        description:
          "Begin your ascent toward one of the ancient world’s most influential landmarks.",
        narration:
          "Your journey begins beneath the Acropolis, where stone pathways lead toward the sacred center of ancient Athens.",
        xp: 20,
      },
      {
        id: "acropolis-athens-2",
        checkpoint: 2,
        location: "The Parthenon",
        title: "Temple of Athena",
        description:
          "Discover the history and architecture of the Parthenon.",
        narration:
          "Ahead stands the Parthenon, built in honor of Athena and celebrated for its balance, scale, and sculptural design.",
        xp: 25,
      },
      {
        id: "acropolis-athens-3",
        checkpoint: 3,
        location: "Theater of Dionysus",
        title: "Birthplace of Theater",
        description:
          "Explore the ancient theater where Greek drama flourished.",
        narration:
          "At the foot of the Acropolis, audiences gathered to experience tragedies and comedies that still influence theater today.",
        xp: 30,
      },
      {
        id: "acropolis-athens-4",
        checkpoint: 4,
        location: "Erechtheion",
        title: "The Caryatids",
        description:
          "Learn about the sculpted figures supporting this sacred temple.",
        narration:
          "The graceful Caryatids stand as columns, combining architecture, sculpture, and religious tradition.",
        xp: 35,
      },
      {
        id: "acropolis-athens-5",
        checkpoint: 5,
        location: "Athens Viewpoint",
        title: "A Legacy of Democracy",
        description:
          "Complete the journey overlooking the city of Athens.",
        narration:
          "From this height, the enduring legacy of Athens stretches before you through democracy, philosophy, art, and architecture.",
        xp: 50,
      },
    ],
  },

  "camino-de-santiago": {
    id: "camino-de-santiago",
    title: "Camino de Santiago",
    location: "Northern Spain",
    country: "Spain",
    introduction:
      "Follow the historic pilgrimage route toward Santiago de Compostela.",
    chapters: [
      {
        id: "camino-de-santiago-1",
        checkpoint: 1,
        location: "Saint-Jean-Pied-de-Port",
        title: "The Pilgrim’s First Step",
        description:
          "Begin at a traditional starting point near the Pyrenees.",
        narration:
          "Your Camino begins with a simple step and a long road ahead, joining centuries of pilgrims seeking purpose and renewal.",
        xp: 20,
      },
      {
        id: "camino-de-santiago-2",
        checkpoint: 2,
        location: "Pamplona",
        title: "Crossing the Pyrenees",
        description:
          "Complete the demanding early mountain stage.",
        narration:
          "Beyond the Pyrenees, the route descends toward historic towns where pilgrims find rest and companionship.",
        xp: 25,
      },
      {
        id: "camino-de-santiago-3",
        checkpoint: 3,
        location: "Meseta",
        title: "The Long Plain",
        description:
          "Walk across the broad central plateau of Spain.",
        narration:
          "The Meseta offers open horizons, quiet roads, and the mental challenge of distance and repetition.",
        xp: 30,
      },
      {
        id: "camino-de-santiago-4",
        checkpoint: 4,
        location: "Cruz de Ferro",
        title: "Laying Down the Burden",
        description:
          "Reach the symbolic iron cross visited by generations of pilgrims.",
        narration:
          "At Cruz de Ferro, travelers traditionally leave a stone representing a burden, memory, or hope.",
        xp: 35,
      },
      {
        id: "camino-de-santiago-5",
        checkpoint: 5,
        location: "Santiago Cathedral",
        title: "The Pilgrimage Complete",
        description:
          "Finish at the cathedral of Santiago de Compostela.",
        narration:
          "Your Camino ends before the cathedral, but the meaning of the journey continues through reflection, gratitude, and transformation.",
        xp: 50,
      },
    ],
  },

  "kumano-kodo": {
    id: "kumano-kodo",
    title: "Kumano Kodo",
    location: "Kii Peninsula",
    country: "Japan",
    introduction:
      "Walk ancient forest pilgrimage trails connecting sacred shrines in Japan.",
    chapters: [
      {
        id: "kumano-kodo-1",
        checkpoint: 1,
        location: "Takijiri-oji",
        title: "Gateway to the Sacred Mountains",
        description:
          "Begin at the traditional entrance to the pilgrimage route.",
        narration:
          "Your journey begins at Takijiri-oji, where pilgrims leave the ordinary world and enter the sacred forest.",
        xp: 20,
      },
      {
        id: "kumano-kodo-2",
        checkpoint: 2,
        location: "Mountain Village",
        title: "Paths Through the Forest",
        description:
          "Follow stone trails through cedar-covered mountains.",
        narration:
          "The trail climbs through deep forest, connecting villages, shrines, and centuries of spiritual practice.",
        xp: 25,
      },
      {
        id: "kumano-kodo-3",
        checkpoint: 3,
        location: "Kumano Hongu Taisha",
        title: "The Great Shrine",
        description:
          "Reach one of the three major Kumano shrines.",
        narration:
          "Kumano Hongu Taisha welcomes pilgrims into a sacred tradition shaped by nature, purification, and renewal.",
        xp: 30,
      },
      {
        id: "kumano-kodo-4",
        checkpoint: 4,
        location: "Nachisan Seiganto-ji",
        title: "Temple and Waterfall",
        description:
          "Discover the famous temple overlooking Nachi Falls.",
        narration:
          "Here, temple architecture and the towering waterfall express the deep connection between spiritual life and the natural world.",
        xp: 35,
      },
      {
        id: "kumano-kodo-5",
        checkpoint: 5,
        location: "Kumano Nachi Taisha",
        title: "Renewal at Journey’s End",
        description:
          "Complete the pilgrimage at the sacred shrine complex.",
        narration:
          "Your journey ends with the sound of falling water and the legacy of pilgrims who traveled these paths for more than a thousand years.",
        xp: 50,
      },
    ],
  },

  "mecca-pilgrimage-routes": {
    id: "mecca-pilgrimage-routes",
    title: "Mecca Pilgrimage Routes",
    location: "Mecca",
    country: "Saudi Arabia",
    introduction:
      "Learn about the historic routes and sacred stages associated with pilgrimage to Mecca.",
    chapters: [
      {
        id: "mecca-pilgrimage-routes-1",
        checkpoint: 1,
        location: "Pilgrim Road",
        title: "The Journey of Intention",
        description:
          "Begin by learning how travelers historically prepared for pilgrimage.",
        narration:
          "Pilgrimage begins with intention, preparation, humility, and a shared destination.",
        xp: 20,
      },
      {
        id: "mecca-pilgrimage-routes-2",
        checkpoint: 2,
        location: "Miqāt",
        title: "Entering the Sacred State",
        description:
          "Learn about the boundary where pilgrims prepare to enter ihram.",
        narration:
          "At the miqāt, pilgrims enter a sacred state marked by simplicity, equality, and devotion.",
        xp: 25,
      },
      {
        id: "mecca-pilgrimage-routes-3",
        checkpoint: 3,
        location: "Mina",
        title: "The Valley of Tents",
        description:
          "Explore the important role of Mina during the pilgrimage.",
        narration:
          "Mina becomes a vast temporary community where pilgrims gather, rest, and continue the sacred rites.",
        xp: 30,
      },
      {
        id: "mecca-pilgrimage-routes-4",
        checkpoint: 4,
        location: "Plain of Arafat",
        title: "A Day of Reflection",
        description:
          "Learn about the central importance of standing at Arafat.",
        narration:
          "At Arafat, pilgrims gather in prayer and reflection in one of the most significant moments of the pilgrimage.",
        xp: 35,
      },
      {
        id: "mecca-pilgrimage-routes-5",
        checkpoint: 5,
        location: "Masjid al-Haram",
        title: "Unity and Completion",
        description:
          "Complete the educational journey at the sacred mosque.",
        narration:
          "The pilgrimage reflects unity, sacrifice, devotion, and the shared spiritual bond of millions of people around the world.",
        xp: 50,
      },
    ],
  },

  "via-dolorosa": {
    id: "via-dolorosa",
    title: "Via Dolorosa",
    location: "Jerusalem",
    country: "Israel",
    introduction:
      "Walk through the historic route traditionally associated with the final journey of Jesus.",
    chapters: [
      {
        id: "via-dolorosa-1",
        checkpoint: 1,
        location: "Lion’s Gate",
        title: "Entering the Old City",
        description:
          "Begin along the ancient streets of Jerusalem.",
        narration:
          "Your journey begins within the Old City, where narrow streets preserve layers of faith, memory, and history.",
        xp: 20,
      },
      {
        id: "via-dolorosa-2",
        checkpoint: 2,
        location: "First Stations",
        title: "The Path Begins",
        description:
          "Learn about the opening stations of the traditional route.",
        narration:
          "The early stations invite reflection on judgment, suffering, and courage.",
        xp: 25,
      },
      {
        id: "via-dolorosa-3",
        checkpoint: 3,
        location: "Old City Market",
        title: "Through the Crowded Streets",
        description:
          "Continue through the active streets of the Old City.",
        narration:
          "The route moves through everyday life, reminding visitors that sacred history and living communities share the same streets.",
        xp: 30,
      },
      {
        id: "via-dolorosa-4",
        checkpoint: 4,
        location: "Final Stations",
        title: "Approaching Calvary",
        description:
          "Reflect on the final stages of the traditional path.",
        narration:
          "The later stations focus on endurance, compassion, loss, and faith.",
        xp: 35,
      },
      {
        id: "via-dolorosa-5",
        checkpoint: 5,
        location: "Church of the Holy Sepulchre",
        title: "Hope Beyond Suffering",
        description:
          "Complete the journey at one of Christianity’s most sacred sites.",
        narration:
          "The journey concludes with a message of sacrifice, remembrance, and hope.",
        xp: 50,
      },
    ],
  },

  "mount-sinai": {
    id: "mount-sinai",
    title: "Mount Sinai",
    location: "Sinai Peninsula",
    country: "Egypt",
    introduction:
      "Climb the historic mountain associated with faith, revelation, and pilgrimage.",
    chapters: [
      {
        id: "mount-sinai-1",
        checkpoint: 1,
        location: "Saint Catherine’s Monastery",
        title: "At the Foot of Sinai",
        description:
          "Begin near one of the world’s oldest continuously operating monasteries.",
        narration:
          "Your climb begins beside Saint Catherine’s Monastery, surrounded by the dramatic mountains of Sinai.",
        xp: 20,
      },
      {
        id: "mount-sinai-2",
        checkpoint: 2,
        location: "Camel Path",
        title: "The Desert Ascent",
        description:
          "Follow the winding route used by generations of travelers.",
        narration:
          "The path rises gradually through the desert landscape, offering time for reflection and endurance.",
        xp: 25,
      },
      {
        id: "mount-sinai-3",
        checkpoint: 3,
        location: "Elijah’s Basin",
        title: "Rest in the Mountains",
        description:
          "Pause in the high basin beneath the summit.",
        narration:
          "The basin provides a quiet place to rest before the final climb.",
        xp: 30,
      },
      {
        id: "mount-sinai-4",
        checkpoint: 4,
        location: "Steps of Repentance",
        title: "The Final Climb",
        description:
          "Ascend the steep stone steps toward the summit.",
        narration:
          "The final steps demand patience and determination as the horizon opens around you.",
        xp: 35,
      },
      {
        id: "mount-sinai-5",
        checkpoint: 5,
        location: "Summit of Mount Sinai",
        title: "Dawn of Reflection",
        description:
          "Complete the journey at the summit.",
        narration:
          "At the summit, sunrise across the desert offers a powerful moment of reflection, faith, and renewal.",
        xp: 50,
      },
    ],
  },

  "bodh-gaya": {
    id: "bodh-gaya",
    title: "Bodh Gaya",
    location: "Bihar",
    country: "India",
    introduction:
      "Explore the sacred landscape associated with the enlightenment of the Buddha.",
    chapters: [
      {
        id: "bodh-gaya-1",
        checkpoint: 1,
        location: "Mahabodhi Temple Entrance",
        title: "Entering the Sacred Site",
        description:
          "Begin at one of Buddhism’s most important pilgrimage centers.",
        narration:
          "Your journey begins at the Mahabodhi Temple, where pilgrims from around the world gather in reflection.",
        xp: 20,
      },
      {
        id: "bodh-gaya-2",
        checkpoint: 2,
        location: "Mahabodhi Temple",
        title: "Temple of Awakening",
        description:
          "Explore the ancient temple marking the place of enlightenment.",
        narration:
          "The temple rises above the sacred grounds, honoring the moment Siddhartha Gautama became the Buddha.",
        xp: 25,
      },
      {
        id: "bodh-gaya-3",
        checkpoint: 3,
        location: "Bodhi Tree",
        title: "The Place of Enlightenment",
        description:
          "Visit the tree descended from the original Bodhi Tree.",
        narration:
          "Beneath the Bodhi Tree, meditation, discipline, and insight transformed the course of spiritual history.",
        xp: 30,
      },
      {
        id: "bodh-gaya-4",
        checkpoint: 4,
        location: "Meditation Gardens",
        title: "The Middle Way",
        description:
          "Reflect on the teachings that followed enlightenment.",
        narration:
          "The gardens invite quiet reflection on compassion, wisdom, and freedom from suffering.",
        xp: 35,
      },
      {
        id: "bodh-gaya-5",
        checkpoint: 5,
        location: "Pilgrim Courtyard",
        title: "A Global Place of Peace",
        description:
          "Complete the journey among pilgrims from many traditions.",
        narration:
          "Bodh Gaya remains a global symbol of awakening, peace, and the possibility of inner transformation.",
        xp: 50,
      },
    ],
  },

  "lourdes-pilgrimage": {
    id: "lourdes-pilgrimage",
    title: "Lourdes Pilgrimage",
    location: "Lourdes",
    country: "France",
    introduction:
      "Walk through the sacred sites, processional paths, and places of prayer at Lourdes.",
    chapters: [
      {
        id: "lourdes-pilgrimage-1",
        checkpoint: 1,
        location: "Sanctuary Entrance",
        title: "Arrival at Lourdes",
        description:
          "Begin where pilgrims enter the sanctuary grounds.",
        narration:
          "Your journey begins among people seeking prayer, healing, community, and hope.",
        xp: 20,
      },
      {
        id: "lourdes-pilgrimage-2",
        checkpoint: 2,
        location: "Grotto of Massabielle",
        title: "The Grotto",
        description:
          "Visit the site associated with the reported apparitions.",
        narration:
          "The grotto has become a place of quiet prayer and remembrance for millions of visitors.",
        xp: 25,
      },
      {
        id: "lourdes-pilgrimage-3",
        checkpoint: 3,
        location: "Spring",
        title: "Water and Healing",
        description:
          "Learn about the role of the spring in the Lourdes tradition.",
        narration:
          "Pilgrims approach the water with faith, hope, and personal intention.",
        xp: 30,
      },
      {
        id: "lourdes-pilgrimage-4",
        checkpoint: 4,
        location: "Basilica of the Rosary",
        title: "Prayer in Community",
        description:
          "Explore one of the major churches within the sanctuary.",
        narration:
          "The basilica brings together art, architecture, music, and communal prayer.",
        xp: 35,
      },
      {
        id: "lourdes-pilgrimage-5",
        checkpoint: 5,
        location: "Candlelight Procession",
        title: "Light in the Darkness",
        description:
          "Complete the journey during the evening procession.",
        narration:
          "The candlelight procession closes the journey with a moving symbol of unity, compassion, and hope.",
        xp: 50,
      },
    ],
  },

  "vatican-pilgrim-walk": {
    id: "vatican-pilgrim-walk",
    title: "Vatican Pilgrim Walk",
    location: "Vatican City",
    country: "Vatican City",
    introduction:
      "Walk through Saint Peter’s Square, the basilica, and the artistic heart of Vatican City.",
    chapters: [
      {
        id: "vatican-pilgrim-walk-1",
        checkpoint: 1,
        location: "Saint Peter’s Square",
        title: "The Pilgrim’s Arrival",
        description:
          "Begin within the great colonnades of Saint Peter’s Square.",
        narration:
          "Your journey begins in the open arms of the colonnade, where visitors from every nation gather.",
        xp: 20,
      },
      {
        id: "vatican-pilgrim-walk-2",
        checkpoint: 2,
        location: "Saint Peter’s Basilica",
        title: "A Monument of Faith",
        description:
          "Enter one of the world’s largest and most important churches.",
        narration:
          "The basilica combines sacred tradition, monumental architecture, and the work of generations of artists.",
        xp: 25,
      },
      {
        id: "vatican-pilgrim-walk-3",
        checkpoint: 3,
        location: "Michelangelo’s Pietà",
        title: "Compassion in Marble",
        description:
          "Reflect on one of Michelangelo’s most celebrated sculptures.",
        narration:
          "The Pietà expresses grief, tenderness, and extraordinary artistic skill through marble.",
        xp: 30,
      },
      {
        id: "vatican-pilgrim-walk-4",
        checkpoint: 4,
        location: "Vatican Museums",
        title: "Treasures of History",
        description:
          "Explore centuries of art and cultural preservation.",
        narration:
          "The museums preserve works from ancient civilizations, Renaissance masters, and global traditions.",
        xp: 35,
      },
      {
        id: "vatican-pilgrim-walk-5",
        checkpoint: 5,
        location: "Sistine Chapel",
        title: "The Final Masterpiece",
        description:
          "Complete the journey beneath Michelangelo’s ceiling.",
        narration:
          "Your journey concludes in the Sistine Chapel, where art, faith, history, and human creativity meet.",
        xp: 50,
      },
    ],
  },

  "st-patricks-way": {
    id: "st-patricks-way",
    title: "St. Patrick’s Way",
    location: "Northern Ireland",
    country: "United Kingdom",
    introduction:
      "Follow a pilgrimage route through landscapes associated with Saint Patrick.",
    chapters: [
      {
        id: "st-patricks-way-1",
        checkpoint: 1,
        location: "Armagh",
        title: "The Pilgrimage Begins",
        description:
          "Begin in the historic ecclesiastical city of Armagh.",
        narration:
          "Your journey begins in Armagh, long associated with the legacy of Saint Patrick and early Christianity in Ireland.",
        xp: 20,
      },
      {
        id: "st-patricks-way-2",
        checkpoint: 2,
        location: "Rural Pilgrim Road",
        title: "Faith Across the Land",
        description:
          "Walk through green countryside and historic settlements.",
        narration:
          "The route follows quiet roads and paths that connect faith, community, and the Irish landscape.",
        xp: 25,
      },
      {
        id: "st-patricks-way-3",
        checkpoint: 3,
        location: "Downpatrick",
        title: "A Place of Memory",
        description:
          "Visit a town strongly associated with Saint Patrick.",
        narration:
          "Downpatrick preserves traditions connected with the life, ministry, and burial of Saint Patrick.",
        xp: 30,
      },
      {
        id: "st-patricks-way-4",
        checkpoint: 4,
        location: "Mourne Mountains",
        title: "The Mountain Challenge",
        description:
          "Continue through the dramatic landscape of the Mournes.",
        narration:
          "The mountains test endurance while offering wide views and moments of reflection.",
        xp: 35,
      },
      {
        id: "st-patricks-way-5",
        checkpoint: 5,
        location: "Newcastle",
        title: "Journey of Heritage",
        description:
          "Complete the route near the Irish Sea.",
        narration:
          "The journey ends where mountain, sea, faith, and cultural memory come together.",
        xp: 50,
      },
    ],
  },

  "canterbury-pilgrimage": {
    id: "canterbury-pilgrimage",
    title: "Canterbury Pilgrimage",
    location: "England",
    country: "United Kingdom",
    introduction:
      "Follow the historic pilgrim road toward Canterbury Cathedral.",
    chapters: [
      {
        id: "canterbury-pilgrimage-1",
        checkpoint: 1,
        location: "London Departure",
        title: "The Road to Canterbury",
        description:
          "Begin the traditional journey from London.",
        narration:
          "Your pilgrimage begins on the road from London, following a route traveled by worshipers, merchants, and storytellers.",
        xp: 20,
      },
      {
        id: "canterbury-pilgrimage-2",
        checkpoint: 2,
        location: "Kent Countryside",
        title: "Stories Along the Way",
        description:
          "Walk through villages and fields that shaped the pilgrim experience.",
        narration:
          "The road becomes a place of conversation, storytelling, and shared purpose.",
        xp: 25,
      },
      {
        id: "canterbury-pilgrimage-3",
        checkpoint: 3,
        location: "Pilgrim Village",
        title: "Rest and Fellowship",
        description:
          "Pause at a traditional stopping place.",
        narration:
          "Inns, churches, and village communities supported generations of travelers on the road to Canterbury.",
        xp: 30,
      },
      {
        id: "canterbury-pilgrimage-4",
        checkpoint: 4,
        location: "Canterbury Gate",
        title: "The Cathedral in Sight",
        description:
          "Approach the historic city of Canterbury.",
        narration:
          "The cathedral towers rise ahead, marking the final stage of the long pilgrimage.",
        xp: 35,
      },
      {
        id: "canterbury-pilgrimage-5",
        checkpoint: 5,
        location: "Canterbury Cathedral",
        title: "The Pilgrim’s Destination",
        description:
          "Complete the journey within the cathedral precinct.",
        narration:
          "Your journey concludes at Canterbury Cathedral, a place of worship, history, conflict, and reconciliation.",
        xp: 50,
      },
    ],
  },

  "great-buddha": {
    id: "great-buddha",
    title: "Great Buddha",
    location: "Kamakura",
    country: "Japan",
    introduction:
      "Walk through Kamakura’s temple landscape toward the Great Buddha.",
    chapters: [
      {
        id: "great-buddha-1",
        checkpoint: 1,
        location: "Kamakura Entrance",
        title: "Entering the Temple City",
        description:
          "Begin within the historic streets of Kamakura.",
        narration:
          "Your journey begins in Kamakura, once a center of samurai government and Buddhist culture.",
        xp: 20,
      },
      {
        id: "great-buddha-2",
        checkpoint: 2,
        location: "Temple Path",
        title: "A Walk of Reflection",
        description:
          "Follow the quiet route toward Kōtoku-in Temple.",
        narration:
          "The path leads through a city shaped by temples, gardens, hills, and centuries of spiritual practice.",
        xp: 25,
      },
      {
        id: "great-buddha-3",
        checkpoint: 3,
        location: "Kōtoku-in Gate",
        title: "Approaching the Great Buddha",
        description:
          "Enter the temple grounds surrounding the statue.",
        narration:
          "Beyond the gate, the Great Buddha appears seated in calm meditation beneath the open sky.",
        xp: 30,
      },
      {
        id: "great-buddha-4",
        checkpoint: 4,
        location: "Great Buddha Platform",
        title: "Strength and Stillness",
        description:
          "Learn about the bronze statue and its survival through time.",
        narration:
          "Earthquakes, storms, and centuries have passed, yet the Great Buddha remains a symbol of peace and resilience.",
        xp: 35,
      },
      {
        id: "great-buddha-5",
        checkpoint: 5,
        location: "Temple Garden",
        title: "A Moment of Peace",
        description:
          "Complete the journey in quiet reflection.",
        narration:
          "Your journey ends with a moment of stillness, compassion, and respect for the traditions preserved at Kamakura.",
        xp: 50,
      },
    ],
  },

  "boston-freedom-trail": {
    id: "boston-freedom-trail",
    title: "Boston Freedom Trail",
    location: "Boston, Massachusetts",
    country: "United States",
    introduction:
      "Walk through the streets and landmarks connected to the American Revolution.",
    chapters: [
      {
        id: "boston-freedom-trail-1",
        checkpoint: 1,
        location: "Boston Common",
        title: "The Trail Begins",
        description:
          "Start at America’s oldest public park.",
        narration:
          "Your journey begins at Boston Common, a gathering place that witnessed military camps, public meetings, and changing city life.",
        xp: 20,
      },
      {
        id: "boston-freedom-trail-2",
        checkpoint: 2,
        location: "Old State House",
        title: "Revolution in the Streets",
        description:
          "Visit the center of colonial government in Massachusetts.",
        narration:
          "Outside the Old State House, conflict between colonists and British soldiers helped move the colonies toward revolution.",
        xp: 25,
      },
      {
        id: "boston-freedom-trail-3",
        checkpoint: 3,
        location: "Faneuil Hall",
        title: "The Cradle of Liberty",
        description:
          "Explore a historic marketplace and meeting hall.",
        narration:
          "Faneuil Hall became a place where citizens debated taxation, rights, independence, and the meaning of liberty.",
        xp: 30,
      },
      {
        id: "boston-freedom-trail-4",
        checkpoint: 4,
        location: "Paul Revere House",
        title: "The Midnight Ride",
        description:
          "Learn about the warning ride before the battles of Lexington and Concord.",
        narration:
          "Paul Revere’s ride carried a warning that British troops were moving into the countryside.",
        xp: 35,
      },
      {
        id: "boston-freedom-trail-5",
        checkpoint: 5,
        location: "Bunker Hill Monument",
        title: "The Cost of Revolution",
        description:
          "Complete the journey at the monument overlooking Charlestown.",
        narration:
          "The Bunker Hill Monument marks an early and costly battle that demonstrated the determination of the revolutionary forces.",
        xp: 50,
      },
    ],
  },
    "liberty-trail": {
    id: "liberty-trail",
    title: "Liberty Trail",
    location: "Historic United States",
    country: "United States",
    introduction:
      "Walk through landmarks connected to independence, civic courage, and the continuing meaning of liberty.",
    chapters: [
      {
        id: "liberty-trail-1",
        checkpoint: 1,
        location: "Liberty Square",
        title: "The Journey Begins",
        description:
          "Begin where citizens gathered to discuss rights, representation, and freedom.",
        narration:
          "Your Liberty Trail begins in a public square where ordinary voices helped shape extraordinary change.",
        xp: 20,
      },
      {
        id: "liberty-trail-2",
        checkpoint: 2,
        location: "Assembly Hall",
        title: "The Debate for Freedom",
        description:
          "Explore the importance of public debate in the movement toward independence.",
        narration:
          "Inside the assembly hall, arguments over law, taxation, and representation challenged the limits of authority.",
        xp: 25,
      },
      {
        id: "liberty-trail-3",
        checkpoint: 3,
        location: "Patriot Road",
        title: "Courage in Motion",
        description:
          "Follow the road traveled by messengers, volunteers, and local defenders.",
        narration:
          "Along this road, warnings traveled quickly and communities prepared to defend their homes and principles.",
        xp: 30,
      },
      {
        id: "liberty-trail-4",
        checkpoint: 4,
        location: "Independence Monument",
        title: "A Nation Declared",
        description:
          "Reflect on the risks taken by people who supported independence.",
        narration:
          "The declaration of liberty carried enormous promise, but also demanded sacrifice, responsibility, and continued struggle.",
        xp: 35,
      },
      {
        id: "liberty-trail-5",
        checkpoint: 5,
        location: "Freedom Overlook",
        title: "Liberty Continues",
        description:
          "Complete the journey by considering how freedom must be protected and expanded.",
        narration:
          "Your journey ends with the understanding that liberty is not only inherited; it must be practiced, defended, and shared.",
        xp: 50,
      },
    ],
  },

  "oregon-trail": {
    id: "oregon-trail",
    title: "Oregon Trail",
    location: "Missouri to Oregon",
    country: "United States",
    introduction:
      "Follow the overland route traveled by thousands of migrants seeking new homes in the American West.",
    chapters: [
      {
        id: "oregon-trail-1",
        checkpoint: 1,
        location: "Independence, Missouri",
        title: "The Westward Departure",
        description:
          "Begin at one of the major starting points of the Oregon Trail.",
        narration:
          "Your journey begins in Independence, where families loaded wagons, gathered supplies, and prepared for months on the trail.",
        xp: 20,
      },
      {
        id: "oregon-trail-2",
        checkpoint: 2,
        location: "Fort Kearny",
        title: "Life on the Plains",
        description:
          "Cross the open prairie toward an important frontier outpost.",
        narration:
          "The plains brought long days, changing weather, river crossings, and the constant challenge of protecting people and animals.",
        xp: 25,
      },
      {
        id: "oregon-trail-3",
        checkpoint: 3,
        location: "Chimney Rock",
        title: "A Landmark of Hope",
        description:
          "Reach one of the most recognizable landmarks on the trail.",
        narration:
          "Chimney Rock rose above the horizon as a sign of progress and a reminder that the hardest terrain still lay ahead.",
        xp: 30,
      },
      {
        id: "oregon-trail-4",
        checkpoint: 4,
        location: "South Pass",
        title: "Crossing the Continental Divide",
        description:
          "Travel through the broad mountain pass used by wagon trains.",
        narration:
          "South Pass offered a practical route through the Rocky Mountains, but exhaustion, weather, and distance continued to test travelers.",
        xp: 35,
      },
      {
        id: "oregon-trail-5",
        checkpoint: 5,
        location: "Willamette Valley",
        title: "The Journey West Complete",
        description:
          "Finish in the fertile valley that became the destination for many migrants.",
        narration:
          "The Willamette Valley marked the end of the trail and the beginning of new lives shaped by hope, hardship, and displacement.",
        xp: 50,
      },
    ],
  },

  "lewis-and-clark": {
    id: "lewis-and-clark",
    title: "Lewis & Clark National Historic Trail",
    location: "Missouri River to the Pacific",
    country: "United States",
    introduction:
      "Follow the expedition across rivers, plains, mountains, and homelands of Indigenous nations.",
    chapters: [
      {
        id: "lewis-and-clark-1",
        checkpoint: 1,
        location: "Camp Dubois",
        title: "The Corps of Discovery",
        description:
          "Begin where the expedition prepared to travel west.",
        narration:
          "Your journey begins at Camp Dubois, where the Corps of Discovery organized supplies, boats, and plans for an uncertain expedition.",
        xp: 20,
      },
      {
        id: "lewis-and-clark-2",
        checkpoint: 2,
        location: "Missouri River",
        title: "Against the Current",
        description:
          "Travel upriver through unfamiliar territory.",
        narration:
          "The expedition pushed against the Missouri River current while mapping the land and meeting communities along the route.",
        xp: 25,
      },
      {
        id: "lewis-and-clark-3",
        checkpoint: 3,
        location: "Fort Mandan",
        title: "Winter and Partnership",
        description:
          "Learn about the winter camp and the role of Sacagawea.",
        narration:
          "At Fort Mandan, the expedition relied on Indigenous knowledge, trade, translation, and the guidance of Sacagawea and others.",
        xp: 30,
      },
      {
        id: "lewis-and-clark-4",
        checkpoint: 4,
        location: "Rocky Mountains",
        title: "The Mountain Crossing",
        description:
          "Cross one of the expedition’s most difficult stages.",
        narration:
          "The Rocky Mountains brought hunger, cold, exhaustion, and dependence on the assistance of Indigenous peoples.",
        xp: 35,
      },
      {
        id: "lewis-and-clark-5",
        checkpoint: 5,
        location: "Fort Clatsop",
        title: "The Pacific Reached",
        description:
          "Complete the westward journey near the Pacific Ocean.",
        narration:
          "At Fort Clatsop, the expedition reached the Pacific after a journey remembered for exploration, cooperation, conflict, and lasting consequences.",
        xp: 50,
      },
    ],
  },

  "route-66": {
    id: "route-66",
    title: "Route 66",
    location: "Chicago to Santa Monica",
    country: "United States",
    introduction:
      "Travel the historic highway through small towns, deserts, roadside culture, and American migration.",
    chapters: [
      {
        id: "route-66-1",
        checkpoint: 1,
        location: "Chicago",
        title: "The Mother Road Begins",
        description:
          "Start at the eastern beginning of Route 66.",
        narration:
          "Your journey begins in Chicago, where Route 66 carried travelers toward opportunity, adventure, and the western horizon.",
        xp: 20,
      },
      {
        id: "route-66-2",
        checkpoint: 2,
        location: "Missouri Roadside",
        title: "Main Street America",
        description:
          "Discover diners, motels, service stations, and roadside communities.",
        narration:
          "Route 66 became a ribbon of local businesses and personal stories connecting cities, farms, and small towns.",
        xp: 25,
      },
      {
        id: "route-66-3",
        checkpoint: 3,
        location: "Oklahoma Plains",
        title: "Migration and Survival",
        description:
          "Learn how families traveled west during economic hardship.",
        narration:
          "During the Dust Bowl era, Route 66 carried families searching for work, security, and a chance to rebuild.",
        xp: 30,
      },
      {
        id: "route-66-4",
        checkpoint: 4,
        location: "Arizona Desert",
        title: "Neon Across the Desert",
        description:
          "Cross dramatic desert landscapes and classic roadside stops.",
        narration:
          "Neon signs, trading posts, motels, and open desert helped create the legendary visual identity of Route 66.",
        xp: 35,
      },
      {
        id: "route-66-5",
        checkpoint: 5,
        location: "Santa Monica Pier",
        title: "End of the Trail",
        description:
          "Complete the journey at the Pacific Ocean.",
        narration:
          "At Santa Monica, Route 66 reaches the ocean, closing a road trip that became a symbol of movement, reinvention, and American culture.",
        xp: 50,
      },
    ],
  },

  "gettysburg-battlefield": {
    id: "gettysburg-battlefield",
    title: "Gettysburg Battlefield",
    location: "Gettysburg, Pennsylvania",
    country: "United States",
    introduction:
      "Walk through the landscape of a decisive Civil War battle and the ground remembered through the Gettysburg Address.",
    chapters: [
      {
        id: "gettysburg-battlefield-1",
        checkpoint: 1,
        location: "McPherson Ridge",
        title: "The Battle Begins",
        description:
          "Begin where fighting opened on the first day of the battle.",
        narration:
          "Your journey begins at McPherson Ridge, where Union and Confederate forces collided in a battle neither side had fully planned.",
        xp: 20,
      },
      {
        id: "gettysburg-battlefield-2",
        checkpoint: 2,
        location: "Seminary Ridge",
        title: "Lines Take Shape",
        description:
          "Explore the positions formed as more troops arrived.",
        narration:
          "The battle expanded rapidly as armies formed long defensive lines across farms, roads, ridges, and fields.",
        xp: 25,
      },
      {
        id: "gettysburg-battlefield-3",
        checkpoint: 3,
        location: "Little Round Top",
        title: "Holding the High Ground",
        description:
          "Learn about the defense of a critical hill.",
        narration:
          "At Little Round Top, exhausted soldiers fought to prevent the Union flank from collapsing.",
        xp: 30,
      },
      {
        id: "gettysburg-battlefield-4",
        checkpoint: 4,
        location: "Pickett’s Charge",
        title: "Across the Open Field",
        description:
          "Reflect on the costly assault of the battle’s final day.",
        narration:
          "Thousands advanced across open ground under heavy fire in an attack that ended with devastating losses.",
        xp: 35,
      },
      {
        id: "gettysburg-battlefield-5",
        checkpoint: 5,
        location: "Soldiers’ National Cemetery",
        title: "A New Birth of Freedom",
        description:
          "Complete the journey at the site of the Gettysburg Address.",
        narration:
          "At the cemetery, Abraham Lincoln called the nation to honor the dead by preserving democracy and pursuing a new birth of freedom.",
        xp: 50,
      },
    ],
  },

  "ellis-island": {
    id: "ellis-island",
    title: "Ellis Island",
    location: "New York Harbor",
    country: "United States",
    introduction:
      "Follow the arrival experience of immigrants who entered the United States through Ellis Island.",
    chapters: [
      {
        id: "ellis-island-1",
        checkpoint: 1,
        location: "New York Harbor",
        title: "Land in Sight",
        description:
          "Begin aboard a ship approaching New York.",
        narration:
          "Your journey begins in New York Harbor, where arriving passengers searched the skyline for their first view of a new country.",
        xp: 20,
      },
      {
        id: "ellis-island-2",
        checkpoint: 2,
        location: "Ferry Landing",
        title: "Arrival at Ellis Island",
        description:
          "Step onto the island with thousands of other hopeful travelers.",
        narration:
          "Families entered the immigration station carrying documents, belongings, uncertainty, and hope for the future.",
        xp: 25,
      },
      {
        id: "ellis-island-3",
        checkpoint: 3,
        location: "Registry Room",
        title: "The Great Hall",
        description:
          "Experience the central inspection room.",
        narration:
          "In the Registry Room, officials processed arrivals while interpreters helped families answer questions and complete inspections.",
        xp: 30,
      },
      {
        id: "ellis-island-4",
        checkpoint: 4,
        location: "Inspection Rooms",
        title: "The Decision",
        description:
          "Learn about medical and legal examinations.",
        narration:
          "Most immigrants continued through quickly, while others faced delays, hearings, separation, or the fear of being denied entry.",
        xp: 35,
      },
      {
        id: "ellis-island-5",
        checkpoint: 5,
        location: "American Immigrant Wall",
        title: "Millions of New Beginnings",
        description:
          "Complete the journey by honoring the people who passed through the island.",
        narration:
          "Ellis Island preserves millions of stories of migration, sacrifice, family, identity, and new beginnings.",
        xp: 50,
      },
    ],
  },

  "alamo-walk": {
    id: "alamo-walk",
    title: "Alamo Walk",
    location: "San Antonio, Texas",
    country: "United States",
    introduction:
      "Explore the mission, battlefield, and layered history of the Alamo.",
    chapters: [
      {
        id: "alamo-walk-1",
        checkpoint: 1,
        location: "Mission Entrance",
        title: "Before the Battle",
        description:
          "Begin with the Alamo’s origins as a Spanish mission.",
        narration:
          "Your journey begins before the famous battle, when the site served as a mission within a changing colonial frontier.",
        xp: 20,
      },
      {
        id: "alamo-walk-2",
        checkpoint: 2,
        location: "Mission Courtyard",
        title: "Life at the Mission",
        description:
          "Learn about Indigenous communities, missionaries, and colonial life.",
        narration:
          "The mission brought together Indigenous people, Spanish religious authority, agriculture, labor, and cultural disruption.",
        xp: 25,
      },
      {
        id: "alamo-walk-3",
        checkpoint: 3,
        location: "Fortified Walls",
        title: "The Siege Begins",
        description:
          "Explore how the former mission became a defensive position.",
        narration:
          "During the Texas Revolution, defenders strengthened the old mission while Mexican forces surrounded the site.",
        xp: 30,
      },
      {
        id: "alamo-walk-4",
        checkpoint: 4,
        location: "Long Barrack",
        title: "The Final Assault",
        description:
          "Reflect on the battle and the people who died there.",
        narration:
          "The final assault ended the siege and transformed the Alamo into a powerful and contested symbol.",
        xp: 35,
      },
      {
        id: "alamo-walk-5",
        checkpoint: 5,
        location: "Alamo Plaza",
        title: "History and Memory",
        description:
          "Complete the journey by considering how the Alamo has been remembered.",
        narration:
          "The Alamo remains a place where history, legend, identity, sacrifice, and differing perspectives continue to meet.",
        xp: 50,
      },
    ],
  },

  "selma-to-montgomery": {
    id: "selma-to-montgomery",
    title: "Selma to Montgomery",
    location: "Alabama",
    country: "United States",
    introduction:
      "Follow the historic voting-rights march from Selma to the Alabama State Capitol.",
    chapters: [
      {
        id: "selma-to-montgomery-1",
        checkpoint: 1,
        location: "Brown Chapel AME Church",
        title: "The March Begins",
        description:
          "Begin at the church that served as an organizing center.",
        narration:
          "Your journey begins at Brown Chapel, where voting-rights activists organized, worshiped, planned, and prepared to march.",
        xp: 20,
      },
      {
        id: "selma-to-montgomery-2",
        checkpoint: 2,
        location: "Edmund Pettus Bridge",
        title: "Bloody Sunday",
        description:
          "Learn about the violent attack on peaceful marchers.",
        narration:
          "On Bloody Sunday, marchers crossing the bridge were attacked, and images of the violence shocked the nation.",
        xp: 25,
      },
      {
        id: "selma-to-montgomery-3",
        checkpoint: 3,
        location: "Voting Rights Trail",
        title: "The March Continues",
        description:
          "Follow the route after federal protection was secured.",
        narration:
          "Thousands joined the march, walking together through rain, fatigue, hostility, and determination.",
        xp: 30,
      },
      {
        id: "selma-to-montgomery-4",
        checkpoint: 4,
        location: "City of St. Jude",
        title: "Strength in Community",
        description:
          "Reach the final encampment before Montgomery.",
        narration:
          "At the City of St. Jude, marchers rested, gathered, and prepared for the final approach to the capital.",
        xp: 35,
      },
      {
        id: "selma-to-montgomery-5",
        checkpoint: 5,
        location: "Alabama State Capitol",
        title: "Voting Rights Victory",
        description:
          "Complete the journey at the destination of the historic march.",
        narration:
          "The march helped build support for the Voting Rights Act of 1965 and remains a symbol of disciplined, courageous action.",
        xp: 50,
      },
    ],
  },

  "golden-gate-bridge": {
    id: "golden-gate-bridge",
    title: "Golden Gate Bridge",
    location: "San Francisco, California",
    country: "United States",
    introduction:
      "Cross the Golden Gate Bridge and discover the engineering, landscape, and people behind the landmark.",
    chapters: [
      {
        id: "golden-gate-bridge-1",
        checkpoint: 1,
        location: "San Francisco Approach",
        title: "Gateway to the Pacific",
        description:
          "Begin at the southern entrance to the bridge.",
        narration:
          "Your journey begins where San Francisco meets the Golden Gate, the narrow passage connecting the bay to the Pacific Ocean.",
        xp: 20,
      },
      {
        id: "golden-gate-bridge-2",
        checkpoint: 2,
        location: "South Tower",
        title: "Building the Impossible",
        description:
          "Learn about the challenge of constructing the bridge.",
        narration:
          "Strong currents, deep water, wind, fog, and economic uncertainty made the Golden Gate one of the era’s greatest engineering challenges.",
        xp: 25,
      },
      {
        id: "golden-gate-bridge-3",
        checkpoint: 3,
        location: "Midspan",
        title: "Suspended Above the Strait",
        description:
          "Reach the center of the suspension span.",
        narration:
          "At midspan, massive cables carry the roadway while the bridge moves slightly with wind and changing loads.",
        xp: 30,
      },
      {
        id: "golden-gate-bridge-4",
        checkpoint: 4,
        location: "North Tower",
        title: "Workers of the Bridge",
        description:
          "Honor the laborers who built and maintain the landmark.",
        narration:
          "Thousands of workers contributed their skill and courage, while safety innovations helped reduce the dangers of construction.",
        xp: 35,
      },
      {
        id: "golden-gate-bridge-5",
        checkpoint: 5,
        location: "Marin Vista Point",
        title: "An International Icon",
        description:
          "Complete the crossing overlooking the bay and city.",
        narration:
          "From the Marin overlook, the Golden Gate Bridge stands as a symbol of connection, ambition, and the identity of San Francisco.",
        xp: 50,
      },
    ],
  },

  "brooklyn-bridge": {
    id: "brooklyn-bridge",
    title: "Brooklyn Bridge",
    location: "New York City",
    country: "United States",
    introduction:
      "Cross the historic bridge linking Manhattan and Brooklyn above the East River.",
    chapters: [
      {
        id: "brooklyn-bridge-1",
        checkpoint: 1,
        location: "Manhattan Entrance",
        title: "The Great Bridge Begins",
        description:
          "Start beneath the stone towers of the Brooklyn Bridge.",
        narration:
          "Your journey begins at the Manhattan approach, where the bridge rises as one of the great engineering achievements of the nineteenth century.",
        xp: 20,
      },
      {
        id: "brooklyn-bridge-2",
        checkpoint: 2,
        location: "Manhattan Tower",
        title: "A Family Vision",
        description:
          "Learn about John, Washington, and Emily Roebling.",
        narration:
          "The bridge was shaped by the Roebling family, whose vision, sacrifice, and persistence carried the project through illness and tragedy.",
        xp: 25,
      },
      {
        id: "brooklyn-bridge-3",
        checkpoint: 3,
        location: "Central Promenade",
        title: "Above the East River",
        description:
          "Walk the elevated pedestrian path between the towers.",
        narration:
          "The promenade offered walkers a dramatic new view of New York while traffic moved on the roadway below.",
        xp: 30,
      },
      {
        id: "brooklyn-bridge-4",
        checkpoint: 4,
        location: "Brooklyn Tower",
        title: "Connecting Two Cities",
        description:
          "Discover how the bridge transformed movement and growth.",
        narration:
          "The bridge strengthened ties between Brooklyn and Manhattan before their consolidation into greater New York City.",
        xp: 35,
      },
      {
        id: "brooklyn-bridge-5",
        checkpoint: 5,
        location: "Brooklyn Bridge Park",
        title: "A City Connected",
        description:
          "Complete the crossing with a view of the Manhattan skyline.",
        narration:
          "The Brooklyn Bridge remains a symbol of New York’s energy, immigration, engineering, and constant reinvention.",
        xp: 50,
      },
    ],
  },

  "tower-bridge": {
    id: "tower-bridge",
    title: "Tower Bridge",
    location: "London",
    country: "United Kingdom",
    introduction:
      "Cross London’s famous movable bridge and explore its Victorian engineering.",
    chapters: [
      {
        id: "tower-bridge-1",
        checkpoint: 1,
        location: "South Bank",
        title: "The Thames Crossing",
        description:
          "Begin beside the river at the southern approach.",
        narration:
          "Your journey begins on the Thames, where expanding London needed a new crossing without blocking river traffic.",
        xp: 20,
      },
      {
        id: "tower-bridge-2",
        checkpoint: 2,
        location: "South Tower",
        title: "Victorian Engineering",
        description:
          "Enter one of the bridge’s massive towers.",
        narration:
          "The towers conceal the machinery and structure that allowed the bridge to combine roadway, walkways, and movable bascules.",
        xp: 25,
      },
      {
        id: "tower-bridge-3",
        checkpoint: 3,
        location: "High-Level Walkway",
        title: "London from Above",
        description:
          "Cross the elevated walkway between the towers.",
        narration:
          "From the high-level walkway, the Thames reveals centuries of trade, industry, architecture, and changing city life.",
        xp: 30,
      },
      {
        id: "tower-bridge-4",
        checkpoint: 4,
        location: "Engine Rooms",
        title: "Powering the Bascules",
        description:
          "Learn how the original hydraulic machinery operated.",
        narration:
          "Steam-powered hydraulic systems once raised the bridge’s bascules to allow tall ships to pass.",
        xp: 35,
      },
      {
        id: "tower-bridge-5",
        checkpoint: 5,
        location: "North Bank",
        title: "London’s Living Landmark",
        description:
          "Complete the crossing near the Tower of London.",
        narration:
          "Tower Bridge remains a working crossing and one of the most recognizable symbols of London.",
        xp: 50,
      },
    ],
  },

  "akashi-kaikyo-bridge": {
    id: "akashi-kaikyo-bridge",
    title: "Akashi Kaikyo Bridge",
    location: "Kobe to Awaji Island",
    country: "Japan",
    introduction:
      "Cross one of the world’s great suspension bridges above the Akashi Strait.",
    chapters: [
      {
        id: "akashi-kaikyo-bridge-1",
        checkpoint: 1,
        location: "Kobe Approach",
        title: "Crossing the Akashi Strait",
        description:
          "Begin at the mainland entrance to the bridge.",
        narration:
          "Your journey begins beside a busy shipping route where powerful currents and severe weather demanded exceptional engineering.",
        xp: 20,
      },
      {
        id: "akashi-kaikyo-bridge-2",
        checkpoint: 2,
        location: "Main Tower",
        title: "Towers Above the Sea",
        description:
          "Learn how the enormous towers support the bridge.",
        narration:
          "The steel towers rise high above the strait, carrying the main cables that support the long suspended roadway.",
        xp: 25,
      },
      {
        id: "akashi-kaikyo-bridge-3",
        checkpoint: 3,
        location: "Central Span",
        title: "Engineering for Earthquakes",
        description:
          "Discover how the structure was designed for movement and seismic forces.",
        narration:
          "The bridge must flex safely under wind, traffic, temperature changes, and earthquakes.",
        xp: 30,
      },
      {
        id: "akashi-kaikyo-bridge-4",
        checkpoint: 4,
        location: "Navigation Channel",
        title: "Above a Working Strait",
        description:
          "Observe the shipping lanes below the bridge.",
        narration:
          "Large vessels pass beneath the central span, making height, clearance, and structural reliability essential.",
        xp: 35,
      },
      {
        id: "akashi-kaikyo-bridge-5",
        checkpoint: 5,
        location: "Awaji Island",
        title: "Two Shores Connected",
        description:
          "Complete the crossing on Awaji Island.",
        narration:
          "The Akashi Kaikyo Bridge connects communities while demonstrating precision, resilience, and modern Japanese engineering.",
        xp: 50,
      },
    ],
  },

  "millau-viaduct": {
    id: "millau-viaduct",
    title: "Millau Viaduct",
    location: "Tarn Valley",
    country: "France",
    introduction:
      "Cross the soaring cable-stayed viaduct above the Tarn Valley.",
    chapters: [
      {
        id: "millau-viaduct-1",
        checkpoint: 1,
        location: "Southern Approach",
        title: "A Bridge Above the Valley",
        description:
          "Begin where the viaduct approaches the Tarn Valley.",
        narration:
          "Your journey begins as the roadway rises toward a bridge designed to pass above a vast and dramatic landscape.",
        xp: 20,
      },
      {
        id: "millau-viaduct-2",
        checkpoint: 2,
        location: "First Pier",
        title: "Piers of Great Height",
        description:
          "Learn how the bridge is supported by slender concrete piers.",
        narration:
          "The piers rise from the valley floor with carefully engineered strength and remarkable visual lightness.",
        xp: 25,
      },
      {
        id: "millau-viaduct-3",
        checkpoint: 3,
        location: "Central Deck",
        title: "Floating Above the Clouds",
        description:
          "Reach the central section of the viaduct.",
        narration:
          "Fog sometimes fills the valley below, making the roadway appear to float above the clouds.",
        xp: 30,
      },
      {
        id: "millau-viaduct-4",
        checkpoint: 4,
        location: "Cable-Stayed Mast",
        title: "Balance and Tension",
        description:
          "Explore how cables stabilize the roadway.",
        narration:
          "Steel cables transfer forces from the deck into the masts, balancing weight, wind, and movement.",
        xp: 35,
      },
      {
        id: "millau-viaduct-5",
        checkpoint: 5,
        location: "Northern Viewpoint",
        title: "Architecture in the Landscape",
        description:
          "Complete the journey overlooking the full bridge.",
        narration:
          "The Millau Viaduct combines transportation, engineering, and architecture while respecting the scale of the valley around it.",
        xp: 50,
      },
    ],
  },

  "chapel-bridge": {
    id: "chapel-bridge",
    title: "Chapel Bridge",
    location: "Lucerne",
    country: "Switzerland",
    introduction:
      "Cross Lucerne’s historic wooden bridge and discover its paintings, tower, and riverside setting.",
    chapters: [
      {
        id: "chapel-bridge-1",
        checkpoint: 1,
        location: "Reuss Riverbank",
        title: "The Wooden Crossing",
        description:
          "Begin beside the river in the old city of Lucerne.",
        narration:
          "Your journey begins at the Reuss River, where Chapel Bridge has connected parts of Lucerne for centuries.",
        xp: 20,
      },
      {
        id: "chapel-bridge-2",
        checkpoint: 2,
        location: "Bridge Entrance",
        title: "A Medieval Landmark",
        description:
          "Step onto one of Europe’s oldest covered wooden bridges.",
        narration:
          "The bridge formed part of Lucerne’s historic defenses while serving as a practical river crossing.",
        xp: 25,
      },
      {
        id: "chapel-bridge-3",
        checkpoint: 3,
        location: "Painted Panels",
        title: "History Above the Walkway",
        description:
          "View triangular paintings beneath the roof.",
        narration:
          "The painted panels illustrate religious stories, local history, and the identity of Lucerne.",
        xp: 30,
      },
      {
        id: "chapel-bridge-4",
        checkpoint: 4,
        location: "Water Tower",
        title: "Guardian of the River",
        description:
          "Learn about the neighboring stone tower.",
        narration:
          "The Water Tower served different purposes over time, including defense, storage, and imprisonment.",
        xp: 35,
      },
      {
        id: "chapel-bridge-5",
        checkpoint: 5,
        location: "Old Town",
        title: "Restoration and Resilience",
        description:
          "Complete the crossing in Lucerne’s historic center.",
        narration:
          "After a devastating fire, Chapel Bridge was restored and remains a symbol of Lucerne’s history and resilience.",
        xp: 50,
      },
    ],
  },

  "magdeburg-water-bridge": {
    id: "magdeburg-water-bridge",
    title: "Magdeburg Water Bridge",
    location: "Magdeburg",
    country: "Germany",
    introduction:
      "Explore the navigable aqueduct that carries a canal across the River Elbe.",
    chapters: [
      {
        id: "magdeburg-water-bridge-1",
        checkpoint: 1,
        location: "Canal Approach",
        title: "A Bridge for Ships",
        description:
          "Begin where canal traffic approaches the water bridge.",
        narration:
          "Your journey begins on a structure designed not for cars or trains, but for boats traveling across another body of water.",
        xp: 20,
      },
      {
        id: "magdeburg-water-bridge-2",
        checkpoint: 2,
        location: "Western Abutment",
        title: "Connecting Canal Systems",
        description:
          "Learn why the bridge improved regional navigation.",
        narration:
          "The aqueduct links major canals and allows vessels to avoid difficult detours and changing river levels.",
        xp: 25,
      },
      {
        id: "magdeburg-water-bridge-3",
        checkpoint: 3,
        location: "Central Channel",
        title: "Water Above Water",
        description:
          "Reach the point where the canal crosses the Elbe.",
        narration:
          "Here, ships travel through a channel suspended above the river, creating a striking example of layered infrastructure.",
        xp: 30,
      },
      {
        id: "magdeburg-water-bridge-4",
        checkpoint: 4,
        location: "Steel Trough",
        title: "Holding a Moving Canal",
        description:
          "Discover how the bridge supports water, vessels, and structural loads.",
        narration:
          "The steel structure must support the enormous weight of the canal water while accommodating vessel movement and temperature changes.",
        xp: 35,
      },
      {
        id: "magdeburg-water-bridge-5",
        checkpoint: 5,
        location: "Eastern Canal",
        title: "Navigation Reimagined",
        description:
          "Complete the crossing as the canal continues east.",
        narration:
          "The Magdeburg Water Bridge demonstrates how engineering can reshape transportation by carrying an entire waterway across a river.",
        xp: 50,
      },
    ],
  },

  "danyang-kunshan-grand-bridge": {
    id: "danyang-kunshan-grand-bridge",
    title: "Danyang–Kunshan Grand Bridge",
    location: "Jiangsu Province",
    country: "China",
    introduction:
      "Travel along the vast railway viaduct built across cities, fields, rivers, and wetlands.",
    chapters: [
      {
        id: "danyang-kunshan-grand-bridge-1",
        checkpoint: 1,
        location: "Danyang Approach",
        title: "The Long Crossing Begins",
        description:
          "Begin at one end of the enormous elevated railway.",
        narration:
          "Your journey begins on a bridge system stretching across a densely populated and geographically varied region.",
        xp: 20,
      },
      {
        id: "danyang-kunshan-grand-bridge-2",
        checkpoint: 2,
        location: "Agricultural Plains",
        title: "Above the Fields",
        description:
          "Travel over farmland without dividing communities and roads below.",
        narration:
          "Elevating the railway allows trains to move efficiently while roads, farms, and local activity continue beneath it.",
        xp: 25,
      },
      {
        id: "danyang-kunshan-grand-bridge-3",
        checkpoint: 3,
        location: "Yangcheng Lake",
        title: "Across the Water",
        description:
          "Cross a major lake section supported by thousands of piers.",
        narration:
          "The lake crossing required careful design for water conditions, soft ground, storms, and long-term stability.",
        xp: 30,
      },
      {
        id: "danyang-kunshan-grand-bridge-4",
        checkpoint: 4,
        location: "High-Speed Rail Corridor",
        title: "Speed and Precision",
        description:
          "Learn how the viaduct supports high-speed train travel.",
        narration:
          "High-speed rail demands precise alignment, smooth transitions, and consistent structural performance over great distances.",
        xp: 35,
      },
      {
        id: "danyang-kunshan-grand-bridge-5",
        checkpoint: 5,
        location: "Kunshan Terminus",
        title: "Infrastructure at Scale",
        description:
          "Complete the journey after crossing one of the world’s longest bridges.",
        narration:
          "The Danyang–Kunshan Grand Bridge represents transportation planning and construction on an extraordinary scale.",
        xp: 50,
      },
    ],
  },

  "timbuktu-heritage": {
    id: "timbuktu-heritage",
    title: "Timbuktu Heritage",
    location: "Timbuktu",
    country: "Mali",
    introduction:
      "Explore the mosques, manuscripts, scholarship, and trading history of Timbuktu.",
    chapters: [
      {
        id: "timbuktu-heritage-1",
        checkpoint: 1,
        location: "Desert Gateway",
        title: "City at the Edge of the Sahara",
        description:
          "Begin where caravan routes approached Timbuktu.",
        narration:
          "Your journey begins at the edge of the Sahara, where trade routes connected West Africa with North Africa and beyond.",
        xp: 20,
      },
      {
        id: "timbuktu-heritage-2",
        checkpoint: 2,
        location: "Djinguereber Mosque",
        title: "Architecture of Earth",
        description:
          "Explore one of Timbuktu’s historic earthen mosques.",
        narration:
          "Built from earth and timber, the mosque reflects local materials, community maintenance, faith, and architectural knowledge.",
        xp: 25,
      },
      {
        id: "timbuktu-heritage-3",
        checkpoint: 3,
        location: "Sankore",
        title: "A Center of Learning",
        description:
          "Learn about Timbuktu’s tradition of scholarship.",
        narration:
          "Teachers and students studied law, theology, language, astronomy, medicine, and other subjects within a vibrant intellectual community.",
        xp: 30,
      },
      {
        id: "timbuktu-heritage-4",
        checkpoint: 4,
        location: "Manuscript Library",
        title: "Knowledge Preserved",
        description:
          "Discover the importance of Timbuktu’s manuscript collections.",
        narration:
          "Families preserved thousands of handwritten works, protecting evidence of African scholarship and written history.",
        xp: 35,
      },
      {
        id: "timbuktu-heritage-5",
        checkpoint: 5,
        location: "Caravan Square",
        title: "A Heritage of Exchange",
        description:
          "Complete the journey where trade and ideas once met.",
        narration:
          "Timbuktu’s legacy joins commerce, faith, scholarship, African history, and the determination to preserve cultural memory.",
        xp: 50,
      },
    ],
  },

  "victoria-falls": {
    id: "victoria-falls",
    title: "Victoria Falls",
    location: "Zambezi River",
    country: "Zambia and Zimbabwe",
    introduction:
      "Walk beside one of the world’s most powerful waterfalls and the surrounding river ecosystem.",
    chapters: [
      {
        id: "victoria-falls-1",
        checkpoint: 1,
        location: "Zambezi River",
        title: "The River Approaches",
        description:
          "Begin upstream where the broad river moves toward the falls.",
        narration:
          "Your journey begins beside the Zambezi, where calm-looking water gathers speed as it approaches a vast basalt gorge.",
        xp: 20,
      },
      {
        id: "victoria-falls-2",
        checkpoint: 2,
        location: "Devil’s Cataract",
        title: "The First Drop",
        description:
          "Reach one of the western sections of the waterfall.",
        narration:
          "At Devil’s Cataract, the river plunges into the gorge with thunderous force and rising clouds of mist.",
        xp: 25,
      },
      {
        id: "victoria-falls-3",
        checkpoint: 3,
        location: "Main Falls",
        title: "The Smoke That Thunders",
        description:
          "Stand opposite the most powerful central section.",
        narration:
          "The local name Mosi-oa-Tunya means the smoke that thunders, describing the towering spray and continuous roar.",
        xp: 30,
      },
      {
        id: "victoria-falls-4",
        checkpoint: 4,
        location: "Knife-Edge Bridge",
        title: "Through the Mist",
        description:
          "Cross a walkway surrounded by heavy spray.",
        narration:
          "The Knife-Edge Bridge places visitors inside the shifting mist, where sunlight may create bright rainbows.",
        xp: 35,
      },
      {
        id: "victoria-falls-5",
        checkpoint: 5,
        location: "Gorge Viewpoint",
        title: "The River Continues",
        description:
          "Complete the journey overlooking the narrow gorge below.",
        narration:
          "Beyond the falls, the Zambezi continues through deep gorges, supporting wildlife, communities, tourism, and regional history.",
        xp: 50,
      },
    ],
  },

  "serengeti-trail": {
    id: "serengeti-trail",
    title: "Serengeti Trail",
    location: "Serengeti Ecosystem",
    country: "Tanzania",
    introduction:
      "Travel through the grasslands, migration routes, rivers, and wildlife habitats of the Serengeti.",
    chapters: [
      {
        id: "serengeti-trail-1",
        checkpoint: 1,
        location: "Southern Plains",
        title: "Life on the Grasslands",
        description:
          "Begin across the open plains of the Serengeti.",
        narration:
          "Your journey begins where vast grasslands support herds, predators, birds, and seasonal cycles of life.",
        xp: 20,
      },
      {
        id: "serengeti-trail-2",
        checkpoint: 2,
        location: "Calving Grounds",
        title: "A New Generation",
        description:
          "Learn about the season when thousands of young animals are born.",
        narration:
          "During calving season, the plains fill with newborn wildebeest and the predators that follow the herds.",
        xp: 25,
      },
      {
        id: "serengeti-trail-3",
        checkpoint: 3,
        location: "Central Seronera",
        title: "Predators of the Plains",
        description:
          "Explore a region known for lions, leopards, and other wildlife.",
        narration:
          "The Seronera area provides water and varied habitat, supporting some of the Serengeti’s most visible predators.",
        xp: 30,
      },
      {
        id: "serengeti-trail-4",
        checkpoint: 4,
        location: "Mara River",
        title: "The Dangerous Crossing",
        description:
          "Reach the river associated with dramatic migration crossings.",
        narration:
          "At the Mara River, herds face currents, steep banks, crocodiles, and the pressure to continue moving.",
        xp: 35,
      },
      {
        id: "serengeti-trail-5",
        checkpoint: 5,
        location: "Northern Migration Route",
        title: "The Endless Journey",
        description:
          "Complete the trail along the continuing migration cycle.",
        narration:
          "The migration has no true beginning or end; it is a continuous search for water and grass across a shared ecosystem.",
        xp: 50,
      },
    ],
  },

  "kilimanjaro-base-walk": {
    id: "kilimanjaro-base-walk",
    title: "Kilimanjaro Base Walk",
    location: "Mount Kilimanjaro",
    country: "Tanzania",
    introduction:
      "Walk through farms, rainforest, moorland, and high mountain terrain around Kilimanjaro.",
    chapters: [
      {
        id: "kilimanjaro-base-walk-1",
        checkpoint: 1,
        location: "Mountain Village",
        title: "At Africa’s Highest Mountain",
        description:
          "Begin near communities living on the fertile lower slopes.",
        narration:
          "Your journey begins beneath Kilimanjaro, where volcanic soil supports farms, villages, and generations of local life.",
        xp: 20,
      },
      {
        id: "kilimanjaro-base-walk-2",
        checkpoint: 2,
        location: "Montane Rainforest",
        title: "Into the Forest",
        description:
          "Enter the humid forest belt surrounding the mountain.",
        narration:
          "The rainforest shelters monkeys, birds, dense vegetation, and streams descending from the mountain.",
        xp: 25,
      },
      {
        id: "kilimanjaro-base-walk-3",
        checkpoint: 3,
        location: "Heath and Moorland",
        title: "Changing Climate Zones",
        description:
          "Climb into a cooler, more open landscape.",
        narration:
          "As elevation increases, forest gives way to giant heathers, grasses, rocky ground, and wider views.",
        xp: 30,
      },
      {
        id: "kilimanjaro-base-walk-4",
        checkpoint: 4,
        location: "Alpine Desert",
        title: "Thin Air and Open Stone",
        description:
          "Reach the dry high-altitude zone beneath the summit.",
        narration:
          "The alpine desert is exposed, cold, and physically demanding, with limited vegetation and rapidly changing weather.",
        xp: 35,
      },
      {
        id: "kilimanjaro-base-walk-5",
        checkpoint: 5,
        location: "Summit Viewpoint",
        title: "The Roof of Africa",
        description:
          "Complete the walk with a view toward Kilimanjaro’s summit.",
        narration:
          "The mountain rises above the plains as a symbol of natural wonder, climate change, endurance, and Tanzanian identity.",
        xp: 50,
      },
    ],
  },

  "ghana-cape-coast-castle": {
    id: "ghana-cape-coast-castle",
    title: "Ghana Cape Coast Castle",
    location: "Cape Coast",
    country: "Ghana",
    introduction:
      "Walk through Cape Coast Castle and confront the history of the transatlantic slave trade.",
    chapters: [
      {
        id: "ghana-cape-coast-castle-1",
        checkpoint: 1,
        location: "Castle Courtyard",
        title: "A Fort on the Coast",
        description:
          "Begin by learning how the site became a center of European trade.",
        narration:
          "Your journey begins in a coastal fort that changed hands among European powers and became deeply tied to the trafficking of human beings.",
        xp: 20,
      },
      {
        id: "ghana-cape-coast-castle-2",
        checkpoint: 2,
        location: "Male Dungeon",
        title: "Imprisonment Below",
        description:
          "Enter the confined spaces where captive Africans were held.",
        narration:
          "In these dark rooms, people endured overcrowding, violence, fear, disease, and separation before forced transport.",
        xp: 25,
      },
      {
        id: "ghana-cape-coast-castle-3",
        checkpoint: 3,
        location: "Female Dungeon",
        title: "Lives and Families Torn Apart",
        description:
          "Reflect on the experiences of captive women.",
        narration:
          "Women faced confinement, abuse, uncertainty, and the destruction of family and community bonds.",
        xp: 30,
      },
      {
        id: "ghana-cape-coast-castle-4",
        checkpoint: 4,
        location: "Door of No Return",
        title: "Forced Across the Atlantic",
        description:
          "Reach the passage leading from the castle toward waiting ships.",
        narration:
          "Through this doorway, captive people were taken toward ships and a brutal crossing into enslavement across the Atlantic.",
        xp: 35,
      },
      {
        id: "ghana-cape-coast-castle-5",
        checkpoint: 5,
        location: "Door of Return",
        title: "Memory, Return, and Healing",
        description:
          "Complete the journey at a place of remembrance and reconnection.",
        narration:
          "Today the site honors the victims, preserves historical truth, and offers descendants a place of return, mourning, and reflection.",
        xp: 50,
      },
    ],
  },

  "nelson-mandela-freedom-walk": {
    id: "nelson-mandela-freedom-walk",
    title: "Nelson Mandela Freedom Walk",
    location: "South Africa",
    country: "South Africa",
    introduction:
      "Follow the life, imprisonment, leadership, and legacy of Nelson Mandela.",
    chapters: [
      {
        id: "nelson-mandela-freedom-walk-1",
        checkpoint: 1,
        location: "Mvezo",
        title: "Early Life and Identity",
        description:
          "Begin near Mandela’s birthplace in the Eastern Cape.",
        narration:
          "Your journey begins in the rural landscape that shaped Mandela’s early understanding of community, leadership, and responsibility.",
        xp: 20,
      },
      {
        id: "nelson-mandela-freedom-walk-2",
        checkpoint: 2,
        location: "Johannesburg",
        title: "The Struggle Against Apartheid",
        description:
          "Explore Mandela’s work as a lawyer and political organizer.",
        narration:
          "In Johannesburg, Mandela joined a growing movement challenging racial oppression, unjust laws, and apartheid rule.",
        xp: 25,
      },
      {
        id: "nelson-mandela-freedom-walk-3",
        checkpoint: 3,
        location: "Rivonia Trial",
        title: "Prepared to Sacrifice",
        description:
          "Learn about the trial that led to life imprisonment.",
        narration:
          "At the Rivonia Trial, Mandela defended the ideal of a democratic and free society despite the possibility of death.",
        xp: 30,
      },
      {
        id: "nelson-mandela-freedom-walk-4",
        checkpoint: 4,
        location: "Robben Island",
        title: "Years of Imprisonment",
        description:
          "Reflect on Mandela’s long confinement and continued leadership.",
        narration:
          "Robben Island tested Mandela’s body and spirit, but prison also became a place of discipline, education, and political resolve.",
        xp: 35,
      },
      {
        id: "nelson-mandela-freedom-walk-5",
        checkpoint: 5,
        location: "Union Buildings",
        title: "From Prisoner to President",
        description:
          "Complete the journey with South Africa’s democratic transition.",
        narration:
          "Mandela’s presidency symbolized political transformation, while his legacy continues through reconciliation, justice, and unfinished work.",
        xp: 50,
      },
    ],
  },

  "ethiopian-highlands": {
    id: "ethiopian-highlands",
    title: "Ethiopian Highlands",
    location: "Northern Ethiopia",
    country: "Ethiopia",
    introduction:
      "Travel through dramatic highlands shaped by ancient kingdoms, faith, agriculture, and mountain communities.",
    chapters: [
      {
        id: "ethiopian-highlands-1",
        checkpoint: 1,
        location: "Highland Village",
        title: "Life Above the Plains",
        description:
          "Begin among communities adapted to high-elevation farming.",
        narration:
          "Your journey begins in the Ethiopian Highlands, where steep terrain, cool air, and fertile valleys support long-established communities.",
        xp: 20,
      },
      {
        id: "ethiopian-highlands-2",
        checkpoint: 2,
        location: "Blue Nile Headwaters",
        title: "Water from the Highlands",
        description:
          "Learn how highland rivers contribute to the Nile system.",
        narration:
          "Rain falling across the highlands feeds rivers that travel far beyond Ethiopia and support life across northeastern Africa.",
        xp: 25,
      },
      {
        id: "ethiopian-highlands-3",
        checkpoint: 3,
        location: "Rock-Hewn Church",
        title: "Faith Carved in Stone",
        description:
          "Explore Ethiopia’s tradition of rock-cut sacred architecture.",
        narration:
          "Churches carved directly into stone reflect centuries of Christian faith, craftsmanship, pilgrimage, and cultural continuity.",
        xp: 30,
      },
      {
        id: "ethiopian-highlands-4",
        checkpoint: 4,
        location: "Simien Escarpment",
        title: "Mountains of Wildlife",
        description:
          "Reach a dramatic landscape supporting rare species.",
        narration:
          "The Simien Mountains shelter wildlife such as gelada monkeys and Ethiopian wolves within steep cliffs and high plateaus.",
        xp: 35,
      },
      {
        id: "ethiopian-highlands-5",
        checkpoint: 5,
        location: "Highland Summit",
        title: "A Land of Deep History",
        description:
          "Complete the journey overlooking Ethiopia’s mountain landscape.",
        narration:
          "The Ethiopian Highlands preserve a remarkable story of human history, independence, faith, biodiversity, and resilience.",
        xp: 50,
      },
    ],
  },

    "zanzibar-spice-route": {
    id: "zanzibar-spice-route",
    title: "Zanzibar Spice Route",
    location: "Zanzibar",
    country: "Tanzania",
    introduction:
      "Walk through Zanzibar’s farms, markets, historic streets, and Indian Ocean trading heritage.",
    chapters: [
      {
        id: "zanzibar-spice-route-1",
        checkpoint: 1,
        location: "Stone Town",
        title: "Gateway to Zanzibar",
        description:
          "Begin among the narrow streets and historic buildings of Stone Town.",
        narration:
          "Your journey begins in Stone Town, where African, Arab, Persian, Indian, and European influences shaped a distinctive island culture.",
        xp: 20,
      },
      {
        id: "zanzibar-spice-route-2",
        checkpoint: 2,
        location: "Spice Farm",
        title: "The Island of Spices",
        description:
          "Explore farms growing cloves, cinnamon, nutmeg, and tropical fruits.",
        narration:
          "Zanzibar became known around the world for its cloves and other spices cultivated in the island’s warm, fertile environment.",
        xp: 25,
      },
      {
        id: "zanzibar-spice-route-3",
        checkpoint: 3,
        location: "Darajani Market",
        title: "Flavors of the Island",
        description:
          "Experience the sights, sounds, and aromas of a busy market.",
        narration:
          "At Darajani Market, spices, produce, seafood, textiles, and conversation bring Zanzibar’s daily life together.",
        xp: 30,
      },
      {
        id: "zanzibar-spice-route-4",
        checkpoint: 4,
        location: "Old Harbor",
        title: "Across the Indian Ocean",
        description:
          "Learn how ocean trade connected Zanzibar with distant regions.",
        narration:
          "Sailing vessels carried spices, goods, languages, beliefs, and people between Zanzibar, Arabia, India, and the African mainland.",
        xp: 35,
      },
      {
        id: "zanzibar-spice-route-5",
        checkpoint: 5,
        location: "Forodhani Gardens",
        title: "An Island Legacy",
        description:
          "Complete the journey beside the waterfront of Stone Town.",
        narration:
          "Your journey ends where food, history, music, and the Indian Ocean reflect Zanzibar’s complex and enduring cultural identity.",
        xp: 50,
      },
    ],
  },

  "goree-island": {
    id: "goree-island",
    title: "Gorée Island",
    location: "Dakar",
    country: "Senegal",
    introduction:
      "Walk through Gorée Island while learning about memory, colonialism, and the transatlantic slave trade.",
    chapters: [
      {
        id: "goree-island-1",
        checkpoint: 1,
        location: "Island Harbor",
        title: "Arrival at Gorée",
        description:
          "Begin at the harbor connecting the island with Dakar.",
        narration:
          "Your journey begins at Gorée Island, a small place carrying a powerful history of trade, colonial rule, captivity, and remembrance.",
        xp: 20,
      },
      {
        id: "goree-island-2",
        checkpoint: 2,
        location: "Colonial Streets",
        title: "Layers of Colonial History",
        description:
          "Walk through streets shaped by competing European powers.",
        narration:
          "The island changed control several times as European nations competed for trade and influence along the West African coast.",
        xp: 25,
      },
      {
        id: "goree-island-3",
        checkpoint: 3,
        location: "House of Slaves",
        title: "Captivity and Loss",
        description:
          "Enter a memorial site associated with the slave trade.",
        narration:
          "The House of Slaves represents the imprisonment, separation, violence, and forced displacement experienced by countless African people.",
        xp: 30,
      },
      {
        id: "goree-island-4",
        checkpoint: 4,
        location: "Door of No Return",
        title: "The Atlantic Crossing",
        description:
          "Reflect on the forced removal of people from their homeland.",
        narration:
          "The doorway facing the Atlantic has become a symbol of departure, grief, ancestral memory, and the lasting consequences of enslavement.",
        xp: 35,
      },
      {
        id: "goree-island-5",
        checkpoint: 5,
        location: "Memorial Overlook",
        title: "Remembering the Ancestors",
        description:
          "Complete the journey overlooking the Atlantic Ocean.",
        narration:
          "Gorée Island asks visitors to remember those who suffered, preserve historical truth, and continue the work of justice and healing.",
        xp: 50,
      },
    ],
  },

  "eiffel-tower": {
    id: "eiffel-tower",
    title: "Eiffel Tower",
    location: "Paris",
    country: "France",
    introduction:
      "Explore the design, construction, and global legacy of the Eiffel Tower.",
    chapters: [
      {
        id: "eiffel-tower-1",
        checkpoint: 1,
        location: "Champ de Mars",
        title: "A Tower for the World’s Fair",
        description:
          "Begin beneath the landmark created for the 1889 exposition.",
        narration:
          "Your journey begins on the Champ de Mars, where an iron tower rose to celebrate engineering and mark one hundred years since the French Revolution.",
        xp: 20,
      },
      {
        id: "eiffel-tower-2",
        checkpoint: 2,
        location: "South Pillar",
        title: "Iron and Precision",
        description:
          "Learn how thousands of metal pieces were assembled.",
        narration:
          "The Eiffel Tower was constructed from carefully manufactured iron components joined with millions of rivets.",
        xp: 25,
      },
      {
        id: "eiffel-tower-3",
        checkpoint: 3,
        location: "First Platform",
        title: "Paris from Above",
        description:
          "Reach the first viewing level above the city.",
        narration:
          "From the first platform, Paris opens below while the tower’s curved structure reveals both strength and elegance.",
        xp: 30,
      },
      {
        id: "eiffel-tower-4",
        checkpoint: 4,
        location: "Second Platform",
        title: "From Controversy to Icon",
        description:
          "Learn how public opinion about the tower changed.",
        narration:
          "Many critics originally rejected the tower’s appearance, yet it gradually became one of the most recognized structures in the world.",
        xp: 35,
      },
      {
        id: "eiffel-tower-5",
        checkpoint: 5,
        location: "Summit",
        title: "The Symbol of Paris",
        description:
          "Complete the journey at the tower’s highest public level.",
        narration:
          "At the summit, the Eiffel Tower stands as a lasting symbol of Paris, innovation, imagination, and modern engineering.",
        xp: 50,
      },
    ],
  },

  "venice-canals": {
    id: "venice-canals",
    title: "Venice Canals",
    location: "Venice",
    country: "Italy",
    introduction:
      "Travel through Venice’s canals, bridges, islands, and centuries of maritime history.",
    chapters: [
      {
        id: "venice-canals-1",
        checkpoint: 1,
        location: "Grand Canal",
        title: "A City Built on Water",
        description:
          "Begin along Venice’s most important waterway.",
        narration:
          "Your journey begins on the Grand Canal, where palaces, churches, warehouses, and homes rise directly beside the water.",
        xp: 20,
      },
      {
        id: "venice-canals-2",
        checkpoint: 2,
        location: "Rialto Bridge",
        title: "The Trading Heart",
        description:
          "Cross the historic bridge near Venice’s commercial center.",
        narration:
          "The Rialto district became a center of markets, banking, shipping, and international exchange.",
        xp: 25,
      },
      {
        id: "venice-canals-3",
        checkpoint: 3,
        location: "Saint Mark’s Square",
        title: "Power of the Republic",
        description:
          "Explore the ceremonial center of historic Venice.",
        narration:
          "Saint Mark’s Square reflects the wealth and influence of a maritime republic that connected Europe with the eastern Mediterranean.",
        xp: 30,
      },
      {
        id: "venice-canals-4",
        checkpoint: 4,
        location: "Bridge of Sighs",
        title: "Justice and Confinement",
        description:
          "Learn about the enclosed bridge connecting the palace and prison.",
        narration:
          "The Bridge of Sighs became associated with prisoners viewing Venice for the final time before entering confinement.",
        xp: 35,
      },
      {
        id: "venice-canals-5",
        checkpoint: 5,
        location: "Venetian Lagoon",
        title: "Protecting a Fragile City",
        description:
          "Complete the journey beside the lagoon.",
        narration:
          "Venice’s future depends on protecting its buildings, waterways, communities, and lagoon from flooding, climate change, and heavy tourism.",
        xp: 50,
      },
    ],
  },

  "swiss-alps": {
    id: "swiss-alps",
    title: "Swiss Alps",
    location: "Alpine Switzerland",
    country: "Switzerland",
    introduction:
      "Walk through valleys, mountain villages, glaciers, and high passes of the Swiss Alps.",
    chapters: [
      {
        id: "swiss-alps-1",
        checkpoint: 1,
        location: "Alpine Village",
        title: "Life in the Mountains",
        description:
          "Begin in a village surrounded by high peaks.",
        narration:
          "Your journey begins where communities have adapted farming, architecture, transportation, and daily life to the mountain environment.",
        xp: 20,
      },
      {
        id: "swiss-alps-2",
        checkpoint: 2,
        location: "Mountain Meadow",
        title: "Across the Alpine Pastures",
        description:
          "Walk through seasonal grazing lands.",
        narration:
          "Alpine meadows support livestock, wildflowers, traditional food production, and a landscape shaped by generations of care.",
        xp: 25,
      },
      {
        id: "swiss-alps-3",
        checkpoint: 3,
        location: "Glacier Valley",
        title: "Rivers of Ice",
        description:
          "Reach a valley shaped by glaciers.",
        narration:
          "Glaciers carved many Alpine valleys and continue to provide water, though rising temperatures are causing rapid retreat.",
        xp: 30,
      },
      {
        id: "swiss-alps-4",
        checkpoint: 4,
        location: "High Mountain Pass",
        title: "Crossing the Alps",
        description:
          "Climb a historic route through the mountains.",
        narration:
          "Mountain passes carried traders, travelers, armies, and ideas across Europe long before modern tunnels and railways.",
        xp: 35,
      },
      {
        id: "swiss-alps-5",
        checkpoint: 5,
        location: "Summit Viewpoint",
        title: "A Changing Alpine World",
        description:
          "Complete the journey overlooking the peaks.",
        narration:
          "The Swiss Alps remain a place of beauty, biodiversity, human adaptation, and urgent environmental change.",
        xp: 50,
      },
    ],
  },

  "berlin-wall": {
    id: "berlin-wall",
    title: "Berlin Wall",
    location: "Berlin",
    country: "Germany",
    introduction:
      "Follow the history of a divided city, the people affected by the wall, and the movement that brought it down.",
    chapters: [
      {
        id: "berlin-wall-1",
        checkpoint: 1,
        location: "Brandenburg Gate",
        title: "A City Divided",
        description:
          "Begin near one of Berlin’s most important landmarks.",
        narration:
          "Your journey begins in a city divided after the Second World War by competing political systems and growing Cold War tensions.",
        xp: 20,
      },
      {
        id: "berlin-wall-2",
        checkpoint: 2,
        location: "Checkpoint Charlie",
        title: "Crossing the Border",
        description:
          "Explore a major crossing point between East and West Berlin.",
        narration:
          "Checkpoint Charlie became a symbol of confrontation, surveillance, restricted movement, and the danger of crossing the border.",
        xp: 25,
      },
      {
        id: "berlin-wall-3",
        checkpoint: 3,
        location: "Bernauer Strasse",
        title: "Families Separated",
        description:
          "Learn how the wall divided streets, homes, and communities.",
        narration:
          "At Bernauer Strasse, the border separated neighbors and families while escape attempts brought both courage and tragedy.",
        xp: 30,
      },
      {
        id: "berlin-wall-4",
        checkpoint: 4,
        location: "East Side Gallery",
        title: "Art on the Wall",
        description:
          "View murals created on a surviving section of the barrier.",
        narration:
          "Artists transformed part of the former wall into an open-air gallery expressing freedom, memory, protest, and hope.",
        xp: 35,
      },
      {
        id: "berlin-wall-5",
        checkpoint: 5,
        location: "Potsdamer Platz",
        title: "The Wall Falls",
        description:
          "Complete the journey in an area rebuilt after reunification.",
        narration:
          "The opening of the wall in 1989 became a powerful moment of public celebration and political transformation.",
        xp: 50,
      },
    ],
  },

  "scottish-highlands": {
    id: "scottish-highlands",
    title: "Scottish Highlands",
    location: "Northern Scotland",
    country: "United Kingdom",
    introduction:
      "Travel through mountains, glens, lochs, castles, and communities of the Scottish Highlands.",
    chapters: [
      {
        id: "scottish-highlands-1",
        checkpoint: 1,
        location: "Highland Glen",
        title: "Into the Highlands",
        description:
          "Begin within a broad valley surrounded by mountains.",
        narration:
          "Your journey begins in a glen shaped by ancient ice, changing weather, and generations of Highland life.",
        xp: 20,
      },
      {
        id: "scottish-highlands-2",
        checkpoint: 2,
        location: "Loch Shore",
        title: "Waters of the Highlands",
        description:
          "Walk beside one of Scotland’s deep freshwater lochs.",
        narration:
          "Highland lochs fill glacial valleys and support wildlife, communities, folklore, and striking landscapes.",
        xp: 25,
      },
      {
        id: "scottish-highlands-3",
        checkpoint: 3,
        location: "Clan Territory",
        title: "Clans and Kinship",
        description:
          "Learn about the social history of Highland clans.",
        narration:
          "Clan identity connected families, land, loyalty, conflict, and leadership within a changing political world.",
        xp: 30,
      },
      {
        id: "scottish-highlands-4",
        checkpoint: 4,
        location: "Ruined Castle",
        title: "Conflict and Change",
        description:
          "Explore the remains of a Highland stronghold.",
        narration:
          "Castles and ruins preserve stories of rivalries, rebellion, royal authority, and the transformation of Highland society.",
        xp: 35,
      },
      {
        id: "scottish-highlands-5",
        checkpoint: 5,
        location: "Mountain Overlook",
        title: "Highland Heritage",
        description:
          "Complete the journey overlooking the surrounding landscape.",
        narration:
          "The Highlands remain connected to language, music, migration, memory, conservation, and a powerful sense of place.",
        xp: 50,
      },
    ],
  },

  "irish-cliffs": {
    id: "irish-cliffs",
    title: "Irish Cliffs",
    location: "Cliffs of Moher",
    country: "Ireland",
    introduction:
      "Walk along Ireland’s Atlantic cliffs while exploring geology, wildlife, folklore, and coastal heritage.",
    chapters: [
      {
        id: "irish-cliffs-1",
        checkpoint: 1,
        location: "Doolin Trail",
        title: "The Atlantic Path",
        description:
          "Begin on the coastal route approaching the cliffs.",
        narration:
          "Your journey begins along Ireland’s western coast, where fields meet the open Atlantic and the cliffs rise ahead.",
        xp: 20,
      },
      {
        id: "irish-cliffs-2",
        checkpoint: 2,
        location: "Southern Cliffs",
        title: "Layers of Ancient Stone",
        description:
          "Learn how the cliffs formed over millions of years.",
        narration:
          "Layers of shale and sandstone preserve evidence of ancient sediments compressed and lifted above the sea.",
        xp: 25,
      },
      {
        id: "irish-cliffs-3",
        checkpoint: 3,
        location: "Seabird Colony",
        title: "Life on the Ledges",
        description:
          "Observe birds nesting along the cliff face.",
        narration:
          "Puffins, guillemots, razorbills, and other seabirds use narrow ledges as protected nesting sites.",
        xp: 30,
      },
      {
        id: "irish-cliffs-4",
        checkpoint: 4,
        location: "O’Brien’s Tower",
        title: "A View Across the Atlantic",
        description:
          "Reach the historic observation tower.",
        narration:
          "From O’Brien’s Tower, visitors can see across the cliffs toward islands, bays, and the broad Atlantic horizon.",
        xp: 35,
      },
      {
        id: "irish-cliffs-5",
        checkpoint: 5,
        location: "Northern Overlook",
        title: "Edge of the Ocean",
        description:
          "Complete the journey above the Atlantic.",
        narration:
          "The Cliffs of Moher close your journey with a landscape shaped by wind, waves, geology, wildlife, and Irish cultural memory.",
        xp: 50,
      },
    ],
  },

  "norwegian-fjords": {
    id: "norwegian-fjords",
    title: "Norwegian Fjords",
    location: "Western Norway",
    country: "Norway",
    introduction:
      "Travel through deep fjords, waterfalls, mountain farms, and coastal communities of Norway.",
    chapters: [
      {
        id: "norwegian-fjords-1",
        checkpoint: 1,
        location: "Fjord Village",
        title: "Between Mountain and Water",
        description:
          "Begin in a community built along the edge of a fjord.",
        narration:
          "Your journey begins where steep mountains descend directly into deep water, leaving narrow spaces for homes and farms.",
        xp: 20,
      },
      {
        id: "norwegian-fjords-2",
        checkpoint: 2,
        location: "Waterfall Trail",
        title: "Water from the Mountains",
        description:
          "Walk beside waterfalls flowing into the fjord.",
        narration:
          "Snowmelt and rain travel down the mountains in streams and waterfalls that feed the fjord below.",
        xp: 25,
      },
      {
        id: "norwegian-fjords-3",
        checkpoint: 3,
        location: "Geirangerfjord",
        title: "The Glacial Valley",
        description:
          "Explore a dramatic fjord carved by ice.",
        narration:
          "Glaciers deepened and widened this valley before retreating and allowing seawater to enter.",
        xp: 30,
      },
      {
        id: "norwegian-fjords-4",
        checkpoint: 4,
        location: "Mountain Farm",
        title: "Life on the Steep Slopes",
        description:
          "Learn how families farmed in isolated mountain locations.",
        narration:
          "Historic farms were built high above the water, demanding difficult travel and close adaptation to the landscape.",
        xp: 35,
      },
      {
        id: "norwegian-fjords-5",
        checkpoint: 5,
        location: "Fjord Summit",
        title: "Protecting the Fjords",
        description:
          "Complete the journey overlooking the valley and water.",
        narration:
          "Norway’s fjords remain places of natural beauty, cultural heritage, tourism, energy, and environmental responsibility.",
        xp: 50,
      },
    ],
  },

  "prague-old-town": {
    id: "prague-old-town",
    title: "Prague Old Town",
    location: "Prague",
    country: "Czech Republic",
    introduction:
      "Walk through Prague’s medieval streets, historic square, bridge, and architectural heritage.",
    chapters: [
      {
        id: "prague-old-town-1",
        checkpoint: 1,
        location: "Old Town Square",
        title: "The Heart of Prague",
        description:
          "Begin in the historic center of the city.",
        narration:
          "Your journey begins in Old Town Square, where merchants, residents, rulers, protesters, and visitors have gathered for centuries.",
        xp: 20,
      },
      {
        id: "prague-old-town-2",
        checkpoint: 2,
        location: "Astronomical Clock",
        title: "Time and the Heavens",
        description:
          "Explore one of the world’s oldest functioning astronomical clocks.",
        narration:
          "The clock combines timekeeping, astronomy, symbolism, and mechanical performance on the face of the Old Town Hall.",
        xp: 25,
      },
      {
        id: "prague-old-town-3",
        checkpoint: 3,
        location: "Jewish Quarter",
        title: "Memory and Community",
        description:
          "Learn about Prague’s historic Jewish community.",
        narration:
          "Synagogues, cemeteries, and preserved streets hold stories of faith, scholarship, discrimination, survival, and remembrance.",
        xp: 30,
      },
      {
        id: "prague-old-town-4",
        checkpoint: 4,
        location: "Charles Bridge",
        title: "Crossing the Vltava",
        description:
          "Walk across Prague’s historic stone bridge.",
        narration:
          "Charles Bridge connected important parts of the city while becoming a route for trade, ceremony, art, and everyday movement.",
        xp: 35,
      },
      {
        id: "prague-old-town-5",
        checkpoint: 5,
        location: "Castle Viewpoint",
        title: "The City of a Hundred Spires",
        description:
          "Complete the journey overlooking Prague’s skyline.",
        narration:
          "Prague’s towers, domes, bridges, and streets preserve a city shaped by kingdoms, empires, war, culture, and renewal.",
        xp: 50,
      },
    ],
  },

  "london-landmarks": {
    id: "london-landmarks",
    title: "London Landmarks",
    location: "London",
    country: "United Kingdom",
    introduction:
      "Walk through London’s royal, political, cultural, and riverside landmarks.",
    chapters: [
      {
        id: "london-landmarks-1",
        checkpoint: 1,
        location: "Buckingham Palace",
        title: "Royal London",
        description:
          "Begin at the official London residence of the monarch.",
        narration:
          "Your journey begins at Buckingham Palace, a setting for royal ceremonies, state occasions, public gatherings, and national tradition.",
        xp: 20,
      },
      {
        id: "london-landmarks-2",
        checkpoint: 2,
        location: "Westminster Abbey",
        title: "A Place of Ceremony",
        description:
          "Explore a church associated with coronations and national history.",
        narration:
          "Westminster Abbey has witnessed coronations, royal weddings, funerals, memorials, and the burial of influential figures.",
        xp: 25,
      },
      {
        id: "london-landmarks-3",
        checkpoint: 3,
        location: "Houses of Parliament",
        title: "Government on the Thames",
        description:
          "Learn about the center of the United Kingdom’s Parliament.",
        narration:
          "The Palace of Westminster represents centuries of political debate, constitutional change, and representative government.",
        xp: 30,
      },
      {
        id: "london-landmarks-4",
        checkpoint: 4,
        location: "Tower of London",
        title: "Fortress, Palace, and Prison",
        description:
          "Discover the many roles of the historic fortress.",
        narration:
          "The Tower of London served as a royal residence, treasury, armory, prison, execution site, and symbol of authority.",
        xp: 35,
      },
      {
        id: "london-landmarks-5",
        checkpoint: 5,
        location: "South Bank",
        title: "London Through Time",
        description:
          "Complete the journey beside the River Thames.",
        narration:
          "London’s landmarks reveal a city shaped by monarchy, migration, empire, industry, creativity, conflict, and constant change.",
        xp: 50,
      },
    ],
  },

  "paris-landmarks": {
    id: "paris-landmarks",
    title: "Paris Landmarks",
    location: "Paris",
    country: "France",
    introduction:
      "Walk through Parisian monuments, museums, boulevards, and places of cultural memory.",
    chapters: [
      {
        id: "paris-landmarks-1",
        checkpoint: 1,
        location: "Arc de Triomphe",
        title: "A Monument to History",
        description:
          "Begin at the center of a great network of Parisian avenues.",
        narration:
          "Your journey begins at the Arc de Triomphe, created to honor military history and later connected with national remembrance.",
        xp: 20,
      },
      {
        id: "paris-landmarks-2",
        checkpoint: 2,
        location: "Champs-Élysées",
        title: "The Grand Avenue",
        description:
          "Walk along one of Paris’s most famous boulevards.",
        narration:
          "The Champs-Élysées has hosted celebrations, processions, demonstrations, commerce, and moments of national importance.",
        xp: 25,
      },
      {
        id: "paris-landmarks-3",
        checkpoint: 3,
        location: "Louvre Museum",
        title: "Palace of Art",
        description:
          "Explore the transformation of a royal palace into a museum.",
        narration:
          "The Louvre preserves art and artifacts from many cultures while reflecting complex histories of collecting and empire.",
        xp: 30,
      },
      {
        id: "paris-landmarks-4",
        checkpoint: 4,
        location: "Notre-Dame",
        title: "The Cathedral of Paris",
        description:
          "Learn about the cathedral’s architecture, history, and restoration.",
        narration:
          "Notre-Dame has stood through centuries of worship, revolution, neglect, restoration, fire, and renewed preservation.",
        xp: 35,
      },
      {
        id: "paris-landmarks-5",
        checkpoint: 5,
        location: "Seine River",
        title: "The Spirit of Paris",
        description:
          "Complete the journey beside the river.",
        narration:
          "The Seine connects many of Paris’s great landmarks and reflects a city shaped by art, politics, faith, architecture, and daily life.",
        xp: 50,
      },
    ],
  },

  "tokyo-nights": {
    id: "tokyo-nights",
    title: "Tokyo Nights",
    location: "Tokyo",
    country: "Japan",
    introduction:
      "Walk through illuminated districts, historic streets, modern technology, and nighttime culture in Tokyo.",
    chapters: [
      {
        id: "tokyo-nights-1",
        checkpoint: 1,
        location: "Shibuya Crossing",
        title: "The City in Motion",
        description:
          "Begin at one of the world’s busiest pedestrian crossings.",
        narration:
          "Your journey begins beneath enormous screens and glowing signs as crowds move through Shibuya from every direction.",
        xp: 20,
      },
      {
        id: "tokyo-nights-2",
        checkpoint: 2,
        location: "Shinjuku",
        title: "Lights Above the Streets",
        description:
          "Explore a district filled with offices, restaurants, and entertainment.",
        narration:
          "Shinjuku combines skyscrapers, train stations, narrow alleys, nightlife, and the constant rhythm of a global city.",
        xp: 25,
      },
      {
        id: "tokyo-nights-3",
        checkpoint: 3,
        location: "Asakusa",
        title: "Old Tokyo After Dark",
        description:
          "Visit historic streets near Sensō-ji Temple.",
        narration:
          "Asakusa reveals an older side of Tokyo where lanterns, temple gates, shops, and traditions remain active at night.",
        xp: 30,
      },
      {
        id: "tokyo-nights-4",
        checkpoint: 4,
        location: "Akihabara",
        title: "Technology and Imagination",
        description:
          "Discover a center of electronics and popular culture.",
        narration:
          "Akihabara’s illuminated storefronts reflect Tokyo’s influence on technology, gaming, animation, design, and youth culture.",
        xp: 35,
      },
      {
        id: "tokyo-nights-5",
        checkpoint: 5,
        location: "Tokyo Skytree",
        title: "The Endless City",
        description:
          "Complete the journey overlooking Tokyo at night.",
        narration:
          "From above, Tokyo appears as a vast field of light shaped by millions of people, neighborhoods, traditions, and innovations.",
        xp: 50,
      },
    ],
  },

  "kyoto-temples": {
    id: "kyoto-temples",
    title: "Kyoto Temples",
    location: "Kyoto",
    country: "Japan",
    introduction:
      "Walk through Kyoto’s temples, shrines, gardens, gates, and centuries of spiritual tradition.",
    chapters: [
      {
        id: "kyoto-temples-1",
        checkpoint: 1,
        location: "Kiyomizu-dera",
        title: "Temple Above the City",
        description:
          "Begin at the wooden terrace overlooking Kyoto.",
        narration:
          "Your journey begins at Kiyomizu-dera, where temple buildings rise above the hillside and offer a broad view of the city.",
        xp: 20,
      },
      {
        id: "kyoto-temples-2",
        checkpoint: 2,
        location: "Fushimi Inari",
        title: "Path of a Thousand Gates",
        description:
          "Walk through the famous rows of red torii gates.",
        narration:
          "The gates lead upward through a sacred mountain landscape associated with Inari, prosperity, agriculture, and protection.",
        xp: 25,
      },
      {
        id: "kyoto-temples-3",
        checkpoint: 3,
        location: "Kinkaku-ji",
        title: "The Golden Pavilion",
        description:
          "Explore the temple reflected in a landscaped pond.",
        narration:
          "The Golden Pavilion combines architecture, water, gardens, and carefully framed views into a place of striking beauty.",
        xp: 30,
      },
      {
        id: "kyoto-temples-4",
        checkpoint: 4,
        location: "Ryōan-ji",
        title: "The Stone Garden",
        description:
          "Reflect within one of Japan’s best-known dry gardens.",
        narration:
          "Stone, gravel, space, and silence invite visitors to slow down and consider meaning beyond words.",
        xp: 35,
      },
      {
        id: "kyoto-temples-5",
        checkpoint: 5,
        location: "Arashiyama",
        title: "Harmony with Nature",
        description:
          "Complete the journey near bamboo forests and mountain temples.",
        narration:
          "Kyoto’s sacred sites preserve a long relationship between faith, architecture, seasonal change, artistry, and nature.",
        xp: 50,
      },
    ],
  },

  "seoul-heritage": {
    id: "seoul-heritage",
    title: "Seoul Heritage",
    location: "Seoul",
    country: "South Korea",
    introduction:
      "Walk through Seoul’s royal palaces, traditional neighborhoods, city walls, and modern public spaces.",
    chapters: [
      {
        id: "seoul-heritage-1",
        checkpoint: 1,
        location: "Gyeongbokgung Palace",
        title: "The Royal Capital",
        description:
          "Begin at the main palace of the Joseon dynasty.",
        narration:
          "Your journey begins at Gyeongbokgung, where royal ceremonies, government, scholarship, and daily palace life shaped the capital.",
        xp: 20,
      },
      {
        id: "seoul-heritage-2",
        checkpoint: 2,
        location: "Bukchon Hanok Village",
        title: "Traditional Neighborhoods",
        description:
          "Walk among preserved Korean houses.",
        narration:
          "Bukchon’s hanok homes reflect traditional design, family life, craftsmanship, and the challenge of preservation within a modern city.",
        xp: 25,
      },
      {
        id: "seoul-heritage-3",
        checkpoint: 3,
        location: "Jongmyo Shrine",
        title: "Ritual and Ancestral Memory",
        description:
          "Explore a royal shrine associated with Confucian ceremonies.",
        narration:
          "Jongmyo preserves rituals honoring royal ancestors through music, movement, architecture, and carefully ordered space.",
        xp: 30,
      },
      {
        id: "seoul-heritage-4",
        checkpoint: 4,
        location: "Seoul City Wall",
        title: "Defending the Capital",
        description:
          "Follow part of the historic wall around the city.",
        narration:
          "The wall crossed mountains and valleys to define and protect the historic capital.",
        xp: 35,
      },
      {
        id: "seoul-heritage-5",
        checkpoint: 5,
        location: "Cheonggyecheon Stream",
        title: "Heritage in a Modern City",
        description:
          "Complete the journey beside the restored urban stream.",
        narration:
          "Seoul brings royal history, traditional culture, modern technology, public renewal, and everyday life into one evolving city.",
        xp: 50,
      },
    ],
  },

  "singapore-gardens": {
    id: "singapore-gardens",
    title: "Singapore Gardens",
    location: "Singapore",
    country: "Singapore",
    introduction:
      "Explore Singapore’s tropical gardens, futuristic landscapes, conservation work, and urban ecology.",
    chapters: [
      {
        id: "singapore-gardens-1",
        checkpoint: 1,
        location: "Singapore Botanic Gardens",
        title: "A Tropical Garden City",
        description:
          "Begin within one of Singapore’s most historic green spaces.",
        narration:
          "Your journey begins among tropical plants, research collections, walking paths, and landscapes developed over generations.",
        xp: 20,
      },
      {
        id: "singapore-gardens-2",
        checkpoint: 2,
        location: "National Orchid Garden",
        title: "The Orchid Collection",
        description:
          "Explore one of the world’s great collections of orchids.",
        narration:
          "The Orchid Garden celebrates biodiversity, horticultural science, breeding, color, and Singapore’s national flower.",
        xp: 25,
      },
      {
        id: "singapore-gardens-3",
        checkpoint: 3,
        location: "Gardens by the Bay",
        title: "Nature and Technology",
        description:
          "Enter a modern garden built beside the city center.",
        narration:
          "Gardens by the Bay combines horticulture, environmental systems, architecture, and public space.",
        xp: 30,
      },
      {
        id: "singapore-gardens-4",
        checkpoint: 4,
        location: "Cloud Forest",
        title: "A Mountain Under Glass",
        description:
          "Explore plants from cool, high-elevation environments.",
        narration:
          "The Cloud Forest recreates a moist mountain habitat while teaching visitors about biodiversity and climate change.",
        xp: 35,
      },
      {
        id: "singapore-gardens-5",
        checkpoint: 5,
        location: "Supertree Grove",
        title: "The Future Garden",
        description:
          "Complete the journey beneath the illuminated Supertrees.",
        narration:
          "Singapore’s gardens show how dense cities can combine design, education, recreation, technology, and ecological ambition.",
        xp: 50,
      },
    ],
  },

  himalayas: {
    id: "himalayas",
    title: "Himalayas",
    location: "Himalayan Mountain Range",
    country: "Asia",
    introduction:
      "Travel through valleys, villages, monasteries, glaciers, and high mountain passes of the Himalayas.",
    chapters: [
      {
        id: "himalayas-1",
        checkpoint: 1,
        location: "Mountain Foothills",
        title: "Entering the Himalayas",
        description:
          "Begin where lower valleys rise toward the world’s highest mountains.",
        narration:
          "Your journey begins in the foothills of a mountain system created by the continuing collision of continental plates.",
        xp: 20,
      },
      {
        id: "himalayas-2",
        checkpoint: 2,
        location: "Highland Village",
        title: "Life at Elevation",
        description:
          "Learn how mountain communities adapt to difficult terrain.",
        narration:
          "Villages depend on local knowledge, seasonal farming, livestock, trade, cooperation, and careful use of limited resources.",
        xp: 25,
      },
      {
        id: "himalayas-3",
        checkpoint: 3,
        location: "Mountain Monastery",
        title: "Faith in the Mountains",
        description:
          "Visit a sacred place overlooking the valley.",
        narration:
          "Monasteries and temples connect spiritual practice with remote landscapes, pilgrimage routes, and long cultural traditions.",
        xp: 30,
      },
      {
        id: "himalayas-4",
        checkpoint: 4,
        location: "Glacial Pass",
        title: "Ice, Altitude, and Endurance",
        description:
          "Cross a difficult high-altitude stage.",
        narration:
          "Thin air, cold temperatures, unstable weather, and steep ground make high Himalayan travel physically demanding.",
        xp: 35,
      },
      {
        id: "himalayas-5",
        checkpoint: 5,
        location: "High Summit View",
        title: "The Mountains of Asia",
        description:
          "Complete the journey overlooking the great range.",
        narration:
          "The Himalayas influence climate, rivers, biodiversity, faith, culture, and the lives of millions across Asia.",
        xp: 50,
      },
    ],
  },

  "mount-fuji": {
    id: "mount-fuji",
    title: "Mount Fuji",
    location: "Honshu",
    country: "Japan",
    introduction:
      "Climb the sacred and iconic slopes of Mount Fuji from forest to summit.",
    chapters: [
      {
        id: "mount-fuji-1",
        checkpoint: 1,
        location: "Fuji Five Lakes",
        title: "The Sacred Mountain",
        description:
          "Begin with a view of Mount Fuji reflected in the lakes.",
        narration:
          "Your journey begins beneath Japan’s highest mountain, a volcano celebrated through religion, pilgrimage, poetry, and art.",
        xp: 20,
      },
      {
        id: "mount-fuji-2",
        checkpoint: 2,
        location: "Forest Trail",
        title: "Into the Mountain Forest",
        description:
          "Walk through the wooded lower slopes.",
        narration:
          "The forest shelters wildlife and gradually gives way to thinner vegetation as elevation increases.",
        xp: 25,
      },
      {
        id: "mount-fuji-3",
        checkpoint: 3,
        location: "Fifth Station",
        title: "The Climb Begins",
        description:
          "Reach a major starting point for summit routes.",
        narration:
          "At the Fifth Station, climbers prepare for steeper ground, cooler temperatures, and thinner air.",
        xp: 30,
      },
      {
        id: "mount-fuji-4",
        checkpoint: 4,
        location: "Upper Mountain Trail",
        title: "Above the Clouds",
        description:
          "Continue across the exposed volcanic slope.",
        narration:
          "The upper trail crosses dark volcanic rock as the landscape becomes increasingly open and severe.",
        xp: 35,
      },
      {
        id: "mount-fuji-5",
        checkpoint: 5,
        location: "Fuji Summit",
        title: "Sunrise from the Summit",
        description:
          "Complete the journey at the top of Mount Fuji.",
        narration:
          "At sunrise, the summit offers a powerful conclusion to a climb associated with endurance, renewal, and respect for the mountain.",
        xp: 50,
      },
    ],
  },

  "silk-road": {
    id: "silk-road",
    title: "Silk Road",
    location: "Asia to Europe",
    country: "Multiple Countries",
    introduction:
      "Travel the ancient network of routes that carried goods, beliefs, knowledge, technologies, and cultures across continents.",
    chapters: [
      {
        id: "silk-road-1",
        checkpoint: 1,
        location: "Chang’an",
        title: "The Eastern Gateway",
        description:
          "Begin in the historic capital that anchored eastern trade routes.",
        narration:
          "Your journey begins in Chang’an, where merchants prepared goods and caravans for long travel across Central Asia.",
        xp: 20,
      },
      {
        id: "silk-road-2",
        checkpoint: 2,
        location: "Gobi Desert",
        title: "Across the Desert",
        description:
          "Cross one of the route’s harshest environments.",
        narration:
          "Desert travel demanded careful planning, reliable guides, access to water, and cooperation among caravan members.",
        xp: 25,
      },
      {
        id: "silk-road-3",
        checkpoint: 3,
        location: "Samarkand",
        title: "Crossroads of Cultures",
        description:
          "Reach a major Central Asian center of trade and learning.",
        narration:
          "Samarkand brought together merchants, scholars, artisans, languages, religions, and architectural traditions.",
        xp: 30,
      },
      {
        id: "silk-road-4",
        checkpoint: 4,
        location: "Persian Caravanserai",
        title: "Rest Along the Road",
        description:
          "Learn how travelers found shelter and exchanged information.",
        narration:
          "Caravanserais provided protected places for people, animals, goods, news, and ideas to gather.",
        xp: 35,
      },
      {
        id: "silk-road-5",
        checkpoint: 5,
        location: "Mediterranean Port",
        title: "A Network Across the World",
        description:
          "Complete the journey where overland goods reached maritime trade.",
        narration:
          "The Silk Road was not one road but a vast network that transformed economies, cultures, technologies, cuisines, and beliefs.",
        xp: 50,
      },
    ],
  },

  "istanbul-crossroads": {
    id: "istanbul-crossroads",
    title: "Istanbul Crossroads",
    location: "Istanbul",
    country: "Türkiye",
    introduction:
      "Walk through a city connecting Europe and Asia across empires, waterways, markets, and faith traditions.",
    chapters: [
      {
        id: "istanbul-crossroads-1",
        checkpoint: 1,
        location: "Bosphorus Shore",
        title: "Between Two Continents",
        description:
          "Begin beside the strait separating Europe and Asia.",
        narration:
          "Your journey begins along the Bosphorus, a strategic waterway linking the Black Sea with the Mediterranean world.",
        xp: 20,
      },
      {
        id: "istanbul-crossroads-2",
        checkpoint: 2,
        location: "Hagia Sophia",
        title: "A Monument Through Empires",
        description:
          "Explore a building shaped by Byzantine and Ottoman history.",
        narration:
          "Hagia Sophia has served different religious and civic roles while preserving extraordinary architecture and layered cultural meaning.",
        xp: 25,
      },
      {
        id: "istanbul-crossroads-3",
        checkpoint: 3,
        location: "Topkapı Palace",
        title: "Center of an Empire",
        description:
          "Enter the palace complex of Ottoman rulers.",
        narration:
          "Topkapı Palace combined government, ceremony, residence, education, diplomacy, and imperial administration.",
        xp: 30,
      },
      {
        id: "istanbul-crossroads-4",
        checkpoint: 4,
        location: "Grand Bazaar",
        title: "Markets of the World",
        description:
          "Walk through one of the world’s great covered markets.",
        narration:
          "The Grand Bazaar reflects centuries of craftsmanship, commerce, negotiation, migration, and international exchange.",
        xp: 35,
      },
      {
        id: "istanbul-crossroads-5",
        checkpoint: 5,
        location: "Galata Bridge",
        title: "The Living Crossroads",
        description:
          "Complete the journey above the Golden Horn.",
        narration:
          "Istanbul remains a living crossroads where continents, histories, faiths, languages, and modern life continue to meet.",
        xp: 50,
      },
    ],
  },

  "sydney-harbor": {
    id: "sydney-harbor",
    title: "Sydney Harbor",
    location: "Sydney",
    country: "Australia",
    introduction:
      "Walk around Sydney Harbor while exploring Indigenous heritage, colonial history, engineering, and modern city life.",
    chapters: [
      {
        id: "sydney-harbor-1",
        checkpoint: 1,
        location: "Circular Quay",
        title: "Harbor Meeting Place",
        description:
          "Begin beside the ferries and waterfront of central Sydney.",
        narration:
          "Your journey begins beside a harbor that has supported Aboriginal communities for thousands of years and later became central to colonial Sydney.",
        xp: 20,
      },
      {
        id: "sydney-harbor-2",
        checkpoint: 2,
        location: "The Rocks",
        title: "Layers of Settlement",
        description:
          "Walk through one of Sydney’s oldest colonial districts.",
        narration:
          "The Rocks preserves stories of Indigenous dispossession, convict labor, working communities, maritime trade, and urban change.",
        xp: 25,
      },
      {
        id: "sydney-harbor-3",
        checkpoint: 3,
        location: "Sydney Harbour Bridge",
        title: "The Great Steel Arch",
        description:
          "Cross the engineering landmark above the water.",
        narration:
          "The Harbour Bridge connected the city’s northern and southern shores while becoming a defining symbol of Sydney.",
        xp: 30,
      },
      {
        id: "sydney-harbor-4",
        checkpoint: 4,
        location: "Sydney Opera House",
        title: "Sails Beside the Harbor",
        description:
          "Explore one of the world’s most recognizable performance venues.",
        narration:
          "The Opera House combines bold architecture, engineering experimentation, performing arts, and a dramatic waterfront setting.",
        xp: 35,
      },
      {
        id: "sydney-harbor-5",
        checkpoint: 5,
        location: "Mrs Macquarie’s Point",
        title: "The Harbor City",
        description:
          "Complete the journey with a panoramic harbor view.",
        narration:
          "Sydney Harbor brings together natural beauty, Indigenous history, immigration, industry, architecture, and modern Australian identity.",
        xp: 50,
      },
    ],
  },

  "amazon-rainforest": {
    id: "amazon-rainforest",
    title: "Amazon Rainforest",
    location: "Amazon Basin",
    country: "South America",
    introduction:
      "Travel through rivers, forest layers, Indigenous territories, wildlife habitats, and the world’s largest tropical rainforest.",
    chapters: [
      {
        id: "amazon-rainforest-1",
        checkpoint: 1,
        location: "Amazon River",
        title: "The Great River System",
        description:
          "Begin beside the enormous river network feeding the rainforest.",
        narration:
          "Your journey begins on the Amazon River, whose tributaries carry water across much of northern South America.",
        xp: 20,
      },
      {
        id: "amazon-rainforest-2",
        checkpoint: 2,
        location: "Flooded Forest",
        title: "Forest Beneath the Water",
        description:
          "Explore areas submerged during seasonal floods.",
        narration:
          "Seasonal flooding transforms the forest, allowing fish and other animals to move among submerged trees.",
        xp: 25,
      },
      {
        id: "amazon-rainforest-3",
        checkpoint: 3,
        location: "Rainforest Canopy",
        title: "Life Above the Ground",
        description:
          "Discover the dense layer of life high in the trees.",
        narration:
          "The canopy receives intense sunlight and supports insects, birds, monkeys, plants, and countless ecological relationships.",
        xp: 30,
      },
      {
        id: "amazon-rainforest-4",
        checkpoint: 4,
        location: "Indigenous Territory",
        title: "Guardians of the Forest",
        description:
          "Learn about Indigenous knowledge and stewardship.",
        narration:
          "Indigenous peoples have cared for Amazon landscapes for generations while defending their communities, rights, and territories.",
        xp: 35,
      },
      {
        id: "amazon-rainforest-5",
        checkpoint: 5,
        location: "Rainforest Overlook",
        title: "Protecting the Amazon",
        description:
          "Complete the journey by considering the rainforest’s global importance.",
        narration:
          "The Amazon supports extraordinary biodiversity, stores carbon, influences rainfall, and faces severe threats from deforestation and exploitation.",
        xp: 50,
      },
    ],
  },

  patagonia: {
    id: "patagonia",
    title: "Patagonia",
    location: "Argentina and Chile",
    country: "South America",
    introduction:
      "Walk through Patagonia’s mountains, glaciers, windswept plains, forests, and remote southern landscapes.",
    chapters: [
      {
        id: "patagonia-1",
        checkpoint: 1,
        location: "Patagonian Steppe",
        title: "The Southern Frontier",
        description:
          "Begin across the broad and windswept plains.",
        narration:
          "Your journey begins in the Patagonian steppe, where strong winds move across dry grasslands beneath an enormous sky.",
        xp: 20,
      },
      {
        id: "patagonia-2",
        checkpoint: 2,
        location: "Andean Forest",
        title: "Forests of the South",
        description:
          "Enter cool forests near the mountains.",
        narration:
          "Southern beech forests shelter wildlife and mark the transition from dry plains to the wetter Andean landscape.",
        xp: 25,
      },
      {
        id: "patagonia-3",
        checkpoint: 3,
        location: "Perito Moreno Glacier",
        title: "The Moving Wall of Ice",
        description:
          "Reach one of Patagonia’s most famous glaciers.",
        narration:
          "Perito Moreno Glacier moves slowly forward, cracking and releasing enormous sections of ice into the lake.",
        xp: 30,
      },
      {
        id: "patagonia-4",
        checkpoint: 4,
        location: "Torres del Paine",
        title: "Granite Towers",
        description:
          "Walk beneath dramatic mountain formations.",
        narration:
          "The towers rise above lakes and valleys shaped by ice, water, wind, and geological uplift.",
        xp: 35,
      },
      {
        id: "patagonia-5",
        checkpoint: 5,
        location: "Southern Overlook",
        title: "At the Edge of the World",
        description:
          "Complete the journey in Patagonia’s remote landscape.",
        narration:
          "Patagonia closes your journey with a sense of distance, wilderness, climate, resilience, and the importance of conservation.",
        xp: 50,
      },
    ],
  },

  "banff-national-park": {
    id: "banff-national-park",
    title: "Banff National Park",
    location: "Alberta",
    country: "Canada",
    introduction:
      "Walk through Rocky Mountain valleys, turquoise lakes, forests, wildlife habitats, and glacial landscapes.",
    chapters: [
      {
        id: "banff-national-park-1",
        checkpoint: 1,
        location: "Banff Townsite",
        title: "Gateway to the Rockies",
        description:
          "Begin beneath the surrounding mountain peaks.",
        narration:
          "Your journey begins in Banff, a mountain community within Canada’s oldest national park.",
        xp: 20,
      },
      {
        id: "banff-national-park-2",
        checkpoint: 2,
        location: "Lake Louise",
        title: "The Turquoise Lake",
        description:
          "Walk beside a lake colored by fine glacial sediment.",
        narration:
          "Lake Louise receives meltwater carrying tiny rock particles that reflect light and create its vivid color.",
        xp: 25,
      },
      {
        id: "banff-national-park-3",
        checkpoint: 3,
        location: "Bow Valley",
        title: "Wildlife Corridor",
        description:
          "Learn how animals move through the mountain landscape.",
        narration:
          "The Bow Valley supports elk, bears, wolves, deer, and other wildlife while roads and development create conservation challenges.",
        xp: 30,
      },
      {
        id: "banff-national-park-4",
        checkpoint: 4,
        location: "Athabasca Glacier",
        title: "The Retreating Ice",
        description:
          "Visit a glacier affected by climate change.",
        narration:
          "Markers show how far the glacier has retreated, providing visible evidence of a warming climate.",
        xp: 35,
      },
      {
        id: "banff-national-park-5",
        checkpoint: 5,
        location: "Rocky Mountain Summit",
        title: "A Protected Mountain Legacy",
        description:
          "Complete the journey overlooking the national park.",
        narration:
          "Banff’s future depends on balancing access, tourism, Indigenous history, wildlife protection, and environmental responsibility.",
        xp: 50,
      },
    ],
  },

  "niagara-falls": {
    id: "niagara-falls",
    title: "Niagara Falls",
    location: "Ontario and New York",
    country: "Canada and United States",
    introduction:
      "Walk beside Niagara Falls while exploring geology, power, tourism, and the Great Lakes water system.",
    chapters: [
      {
        id: "niagara-falls-1",
        checkpoint: 1,
        location: "Niagara River",
        title: "Water from the Great Lakes",
        description:
          "Begin along the river flowing toward the falls.",
        narration:
          "Your journey begins on the Niagara River, which carries water from Lake Erie toward Lake Ontario.",
        xp: 20,
      },
      {
        id: "niagara-falls-2",
        checkpoint: 2,
        location: "American Falls",
        title: "The First Great Drop",
        description:
          "Reach the American side of the waterfall.",
        narration:
          "The American Falls pour over a broad cliff where fallen rock has collected beneath the powerful water.",
        xp: 25,
      },
      {
        id: "niagara-falls-3",
        checkpoint: 3,
        location: "Horseshoe Falls",
        title: "The Great Curve of Water",
        description:
          "Stand near the largest section of Niagara Falls.",
        narration:
          "Horseshoe Falls carries an enormous volume of water over its curved edge into clouds of mist below.",
        xp: 30,
      },
      {
        id: "niagara-falls-4",
        checkpoint: 4,
        location: "Hydroelectric Station",
        title: "Power from the River",
        description:
          "Learn how Niagara’s water generates electricity.",
        narration:
          "Engineers redirect part of the river through turbines, producing hydroelectric power while maintaining the falls’ flow.",
        xp: 35,
      },
      {
        id: "niagara-falls-5",
        checkpoint: 5,
        location: "Niagara Gorge",
        title: "A Landscape Still Changing",
        description:
          "Complete the journey downstream from the falls.",
        narration:
          "Niagara Falls continues to reshape the gorge through erosion while remaining a shared natural and cultural landmark.",
        xp: 50,
      },
    ],
  },

  "pacific-coast-highway": {
    id: "pacific-coast-highway",
    title: "Pacific Coast Highway",
    location: "California Coast",
    country: "United States",
    introduction:
      "Travel along California’s Pacific coastline through cliffs, beaches, forests, bridges, and coastal communities.",
    chapters: [
      {
        id: "pacific-coast-highway-1",
        checkpoint: 1,
        location: "Northern California Coast",
        title: "The Coastal Road Begins",
        description:
          "Begin where forested hills meet the Pacific Ocean.",
        narration:
          "Your journey begins along a coastline shaped by waves, tectonic forces, fog, forests, and communities facing the open ocean.",
        xp: 20,
      },
      {
        id: "pacific-coast-highway-2",
        checkpoint: 2,
        location: "Golden Gate",
        title: "Crossing into San Francisco",
        description:
          "Travel through one of California’s most famous coastal gateways.",
        narration:
          "The Golden Gate connects the Pacific with San Francisco Bay and marks an important stage of the coastal route.",
        xp: 25,
      },
      {
        id: "pacific-coast-highway-3",
        checkpoint: 3,
        location: "Big Sur",
        title: "Road Above the Cliffs",
        description:
          "Follow the highway through dramatic coastal mountains.",
        narration:
          "At Big Sur, the road curves between steep cliffs and the ocean through one of the route’s most celebrated landscapes.",
        xp: 30,
      },
      {
        id: "pacific-coast-highway-4",
        checkpoint: 4,
        location: "Bixby Creek Bridge",
        title: "Engineering the Coast",
        description:
          "Cross the historic concrete arch bridge.",
        narration:
          "Bixby Creek Bridge carries the highway across a deep canyon while blending engineering with the surrounding scenery.",
        xp: 35,
      },
      {
        id: "pacific-coast-highway-5",
        checkpoint: 5,
        location: "Southern California Shore",
        title: "The Pacific Journey Complete",
        description:
          "Finish beside the beaches of Southern California.",
        narration:
          "The Pacific Coast Highway closes your journey through natural beauty, coastal communities, tourism, erosion, and environmental change.",
        xp: 50,
      },
    ],
  },

  "coast-to-coast-usa": {
    id: "coast-to-coast-usa",
    title: "Coast to Coast USA",
    location: "Atlantic to Pacific",
    country: "United States",
    introduction:
      "Cross the United States through cities, plains, rivers, deserts, mountains, and regional cultures.",
    chapters: [
      {
        id: "coast-to-coast-usa-1",
        checkpoint: 1,
        location: "Atlantic Coast",
        title: "The Continental Journey Begins",
        description:
          "Begin beside the Atlantic Ocean.",
        narration:
          "Your journey begins on the Atlantic coast with thousands of miles of landscapes, communities, and histories ahead.",
        xp: 20,
      },
      {
        id: "coast-to-coast-usa-2",
        checkpoint: 2,
        location: "Appalachian Mountains",
        title: "Across the Eastern Ridges",
        description:
          "Cross one of North America’s oldest mountain systems.",
        narration:
          "The Appalachian region carries deep Indigenous history, migration stories, industry, music, and distinctive mountain communities.",
        xp: 25,
      },
      {
        id: "coast-to-coast-usa-3",
        checkpoint: 3,
        location: "Great Plains",
        title: "The Open Center",
        description:
          "Travel across broad grasslands and agricultural regions.",
        narration:
          "The Great Plains support farming and ranching while preserving the memory of Indigenous nations, wildlife, settlement, and environmental change.",
        xp: 30,
      },
      {
        id: "coast-to-coast-usa-4",
        checkpoint: 4,
        location: "Rocky Mountains",
        title: "The Western Divide",
        description:
          "Cross the high mountains of the continental interior.",
        narration:
          "The Rockies create a dramatic barrier of peaks, passes, forests, rivers, and changing climates.",
        xp: 35,
      },
      {
        id: "coast-to-coast-usa-5",
        checkpoint: 5,
        location: "Pacific Coast",
        title: "Ocean to Ocean",
        description:
          "Complete the journey beside the Pacific Ocean.",
        narration:
          "The coast-to-coast journey ends after crossing a nation shaped by movement, diversity, conflict, opportunity, and many regional identities.",
        xp: 50,
      },
    ],
  },

  "around-the-world": {
    id: "around-the-world",
    title: "Around the World",
    location: "Global Journey",
    country: "Multiple Countries",
    introduction:
      "Complete a global journey connecting continents, cultures, landscapes, histories, and communities.",
    chapters: [
      {
        id: "around-the-world-1",
        checkpoint: 1,
        location: "The Global Starting Gate",
        title: "One Planet, Many Journeys",
        description:
          "Begin a worldwide route across continents and cultures.",
        narration:
          "Your journey begins with a single step on a planet shared by billions of people, countless communities, and extraordinary natural environments.",
        xp: 20,
      },
      {
        id: "around-the-world-2",
        checkpoint: 2,
        location: "Across the Continents",
        title: "Landscapes of the World",
        description:
          "Travel through mountains, forests, deserts, plains, and cities.",
        narration:
          "Each continent holds distinct environments shaped by geology, climate, biodiversity, and human adaptation.",
        xp: 25,
      },
      {
        id: "around-the-world-3",
        checkpoint: 3,
        location: "Global Crossroads",
        title: "Cultures in Motion",
        description:
          "Explore the movement of people, languages, beliefs, and ideas.",
        narration:
          "Migration, trade, travel, conflict, and cooperation have connected societies throughout human history.",
        xp: 30,
      },
      {
        id: "around-the-world-4",
        checkpoint: 4,
        location: "Shared Planet",
        title: "Challenges Without Borders",
        description:
          "Consider global challenges requiring shared solutions.",
        narration:
          "Climate change, public health, inequality, conservation, and peace extend beyond national borders and require cooperation.",
        xp: 35,
      },
      {
        id: "around-the-world-5",
        checkpoint: 5,
        location: "World Legacy Finish",
        title: "The Global Legacy",
        description:
          "Complete the worldwide journey with a renewed sense of connection.",
        narration:
          "Your journey ends with the understanding that every place has a story and every step can deepen respect for our shared world.",
        xp: 50,
      },
    ],
  },

    "underground-railroad": {
    id: "underground-railroad",
    title: "Underground Railroad",
    location: "United States and Canada",
    country: "United States",
    introduction:
      "Follow the secret routes, safe houses, communities, and courageous people who resisted slavery and helped freedom seekers escape.",
    chapters: [
      {
        id: "underground-railroad-1",
        checkpoint: 1,
        location: "Plantation Edge",
        title: "The Decision to Escape",
        description:
          "Begin with the dangerous choice to seek freedom.",
        narration:
          "Your journey begins with a decision made under extreme danger: to leave slavery behind and risk everything for freedom.",
        xp: 20,
      },
      {
        id: "underground-railroad-2",
        checkpoint: 2,
        location: "Night Forest",
        title: "Traveling in Secret",
        description:
          "Move through forests and back roads under cover of darkness.",
        narration:
          "Freedom seekers often traveled at night, relying on courage, memory, natural landmarks, and trusted guidance.",
        xp: 25,
      },
      {
        id: "underground-railroad-3",
        checkpoint: 3,
        location: "Safe House",
        title: "A Network of Resistance",
        description:
          "Reach a hidden location offering food, shelter, and protection.",
        narration:
          "Black communities, abolitionists, faith groups, and other allies formed networks that offered shelter and helped people continue north.",
        xp: 30,
      },
      {
        id: "underground-railroad-4",
        checkpoint: 4,
        location: "Border Crossing",
        title: "Freedom Still at Risk",
        description:
          "Approach a free state or the Canadian border.",
        narration:
          "Crossing into a free state did not always guarantee safety because federal law allowed the capture of escaped people.",
        xp: 35,
      },
      {
        id: "underground-railroad-5",
        checkpoint: 5,
        location: "Freedom Community",
        title: "A New Beginning",
        description:
          "Complete the journey within a community built by formerly enslaved people.",
        narration:
          "The Underground Railroad remains a story of resistance, solidarity, self-liberation, and the determination to build a life in freedom.",
        xp: 50,
      },
    ],
  },

  "freedom-riders-trail": {
    id: "freedom-riders-trail",
    title: "Freedom Riders Trail",
    location: "American South",
    country: "United States",
    introduction:
      "Follow the routes of the Freedom Riders who challenged segregation in interstate travel.",
    chapters: [
      {
        id: "freedom-riders-trail-1",
        checkpoint: 1,
        location: "Washington, D.C.",
        title: "The Ride Begins",
        description:
          "Begin where interracial groups boarded buses headed south.",
        narration:
          "Your journey begins with Freedom Riders determined to test whether federal desegregation rulings would be enforced.",
        xp: 20,
      },
      {
        id: "freedom-riders-trail-2",
        checkpoint: 2,
        location: "Virginia and the Carolinas",
        title: "Testing Segregated Facilities",
        description:
          "Enter waiting rooms and terminals divided by race.",
        narration:
          "Freedom Riders peacefully used facilities reserved for white passengers, directly challenging segregation.",
        xp: 25,
      },
      {
        id: "freedom-riders-trail-3",
        checkpoint: 3,
        location: "Anniston, Alabama",
        title: "Violence on the Road",
        description:
          "Learn about the attack and burning of a Freedom Riders bus.",
        narration:
          "Near Anniston, a mob attacked a bus and set it on fire, placing the riders’ lives in immediate danger.",
        xp: 30,
      },
      {
        id: "freedom-riders-trail-4",
        checkpoint: 4,
        location: "Montgomery",
        title: "Courage Under Attack",
        description:
          "Reflect on continued violence and national attention.",
        narration:
          "In Montgomery, riders and supporters were attacked, yet new volunteers continued the campaign rather than allowing violence to end it.",
        xp: 35,
      },
      {
        id: "freedom-riders-trail-5",
        checkpoint: 5,
        location: "Jackson, Mississippi",
        title: "The Ride Changes the Law",
        description:
          "Complete the journey where riders were arrested and jailed.",
        narration:
          "The Freedom Riders helped force stronger federal enforcement against segregation in interstate travel facilities.",
        xp: 50,
      },
    ],
  },

  "rosa-parks-freedom-walk": {
    id: "rosa-parks-freedom-walk",
    title: "Rosa Parks Freedom Walk",
    location: "Montgomery, Alabama",
    country: "United States",
    introduction:
      "Walk through the events surrounding Rosa Parks, the Montgomery Bus Boycott, and the fight against segregation.",
    chapters: [
      {
        id: "rosa-parks-freedom-walk-1",
        checkpoint: 1,
        location: "Montgomery Bus Stop",
        title: "A Daily System of Injustice",
        description:
          "Begin with the segregated bus system of Montgomery.",
        narration:
          "Your journey begins in a city where Black passengers faced daily humiliation, unequal treatment, and forced segregation.",
        xp: 20,
      },
      {
        id: "rosa-parks-freedom-walk-2",
        checkpoint: 2,
        location: "Cleveland Avenue Bus",
        title: "Rosa Parks Refuses",
        description:
          "Learn about the moment Rosa Parks refused to surrender her seat.",
        narration:
          "Rosa Parks remained seated, drawing on years of activism and refusing to cooperate with an unjust system.",
        xp: 25,
      },
      {
        id: "rosa-parks-freedom-walk-3",
        checkpoint: 3,
        location: "Holt Street Baptist Church",
        title: "The Boycott Organizes",
        description:
          "Explore how the community built a mass protest.",
        narration:
          "Churches, neighborhood leaders, women organizers, drivers, and thousands of residents formed a disciplined boycott.",
        xp: 30,
      },
      {
        id: "rosa-parks-freedom-walk-4",
        checkpoint: 4,
        location: "Montgomery Streets",
        title: "Walking for Justice",
        description:
          "Follow the routes traveled by people who refused city buses.",
        narration:
          "For more than a year, people walked, shared rides, and endured threats while sustaining the boycott.",
        xp: 35,
      },
      {
        id: "rosa-parks-freedom-walk-5",
        checkpoint: 5,
        location: "Civil Rights Memorial",
        title: "A Movement in Motion",
        description:
          "Complete the journey by honoring the boycott’s impact.",
        narration:
          "The Montgomery Bus Boycott became a major victory against segregation and helped strengthen the modern Civil Rights Movement.",
        xp: 50,
      },
    ],
  },

  "black-wall-street": {
    id: "black-wall-street",
    title: "Black Wall Street",
    location: "Tulsa, Oklahoma",
    country: "United States",
    introduction:
      "Walk through the prosperity, destruction, resilience, and memory of Tulsa’s Greenwood District.",
    chapters: [
      {
        id: "black-wall-street-1",
        checkpoint: 1,
        location: "Greenwood Avenue",
        title: "A Thriving Black Community",
        description:
          "Begin in one of the most prosperous Black business districts in the United States.",
        narration:
          "Your journey begins in Greenwood, where Black-owned businesses, professionals, churches, schools, and families built a strong community.",
        xp: 20,
      },
      {
        id: "black-wall-street-2",
        checkpoint: 2,
        location: "Business District",
        title: "Building Economic Independence",
        description:
          "Explore the businesses that earned Greenwood the name Black Wall Street.",
        narration:
          "Banks, hotels, theaters, restaurants, shops, newspapers, and medical practices circulated wealth within the community.",
        xp: 25,
      },
      {
        id: "black-wall-street-3",
        checkpoint: 3,
        location: "Greenwood in 1921",
        title: "The Tulsa Race Massacre",
        description:
          "Learn about the white mob violence that destroyed the district.",
        narration:
          "In 1921, a white mob attacked Greenwood, killing residents, burning homes and businesses, and displacing thousands.",
        xp: 30,
      },
      {
        id: "black-wall-street-4",
        checkpoint: 4,
        location: "Rebuilding Greenwood",
        title: "Resilience After Destruction",
        description:
          "Discover how survivors rebuilt despite discrimination and lack of support.",
        narration:
          "Greenwood residents rebuilt homes, businesses, and institutions while facing insurance denials, legal barriers, and continued racism.",
        xp: 35,
      },
      {
        id: "black-wall-street-5",
        checkpoint: 5,
        location: "Greenwood Rising",
        title: "Truth, Memory, and Justice",
        description:
          "Complete the journey at a place dedicated to preserving Greenwood’s history.",
        narration:
          "Black Wall Street remains a symbol of Black achievement, racial violence, resilience, and the ongoing demand for truth and justice.",
        xp: 50,
      },
    ],
  },

  "mlk-legacy-walk": {
    id: "mlk-legacy-walk",
    title: "Martin Luther King Jr. Legacy Walk",
    location: "United States",
    country: "United States",
    introduction:
      "Follow the life, leadership, speeches, campaigns, and enduring legacy of Dr. Martin Luther King Jr.",
    chapters: [
      {
        id: "mlk-legacy-walk-1",
        checkpoint: 1,
        location: "Auburn Avenue",
        title: "Early Life in Atlanta",
        description:
          "Begin in the neighborhood where Martin Luther King Jr. was born.",
        narration:
          "Your journey begins on Auburn Avenue, where family, church, education, and the Black community shaped King’s early life.",
        xp: 20,
      },
      {
        id: "mlk-legacy-walk-2",
        checkpoint: 2,
        location: "Dexter Avenue Baptist Church",
        title: "Leadership in Montgomery",
        description:
          "Explore King’s role during the Montgomery Bus Boycott.",
        narration:
          "As a young pastor, King became a major public leader in a mass movement built through local organization and collective sacrifice.",
        xp: 25,
      },
      {
        id: "mlk-legacy-walk-3",
        checkpoint: 3,
        location: "Lincoln Memorial",
        title: "A Dream Before the Nation",
        description:
          "Reflect on the 1963 March on Washington.",
        narration:
          "Before a vast crowd, King connected racial justice, citizenship, dignity, and the unfinished promise of American democracy.",
        xp: 30,
      },
      {
        id: "mlk-legacy-walk-4",
        checkpoint: 4,
        location: "Selma Campaign",
        title: "The Fight for Voting Rights",
        description:
          "Learn about King’s participation in the movement for ballot access.",
        narration:
          "The Selma campaign exposed violent resistance to voting rights and helped build national support for federal action.",
        xp: 35,
      },
      {
        id: "mlk-legacy-walk-5",
        checkpoint: 5,
        location: "National Civil Rights Museum",
        title: "The Work Continues",
        description:
          "Complete the journey by reflecting on King’s assassination and legacy.",
        narration:
          "King’s life ended in Memphis, but his call for justice, nonviolence, economic equality, and human dignity continues.",
        xp: 50,
      },
    ],
  },

  "malcolm-x-harlem": {
    id: "malcolm-x-harlem",
    title: "Malcolm X Harlem",
    location: "Harlem, New York",
    country: "United States",
    introduction:
      "Walk through Harlem and explore the life, transformation, leadership, and legacy of Malcolm X.",
    chapters: [
      {
        id: "malcolm-x-harlem-1",
        checkpoint: 1,
        location: "Harlem Streets",
        title: "A Community in Motion",
        description:
          "Begin in the neighborhood that became central to Malcolm X’s public life.",
        narration:
          "Your journey begins in Harlem, a center of Black culture, politics, art, business, debate, and activism.",
        xp: 20,
      },
      {
        id: "malcolm-x-harlem-2",
        checkpoint: 2,
        location: "Temple No. 7",
        title: "A Powerful Voice Emerges",
        description:
          "Learn about Malcolm X’s leadership in the Nation of Islam.",
        narration:
          "Malcolm X became known for disciplined organization, sharp criticism of racism, and a message of Black dignity and self-determination.",
        xp: 25,
      },
      {
        id: "malcolm-x-harlem-3",
        checkpoint: 3,
        location: "Harlem Rally",
        title: "Speaking Truth to Power",
        description:
          "Explore his influence as a public speaker and organizer.",
        narration:
          "His speeches challenged segregation, police abuse, economic exploitation, political hypocrisy, and the demand that Black people remain passive.",
        xp: 30,
      },
      {
        id: "malcolm-x-harlem-4",
        checkpoint: 4,
        location: "International Journey",
        title: "A Changing Worldview",
        description:
          "Learn how travel influenced Malcolm X’s political and spiritual development.",
        narration:
          "Travel through Africa and the Middle East broadened his understanding of global liberation, faith, and human rights.",
        xp: 35,
      },
      {
        id: "malcolm-x-harlem-5",
        checkpoint: 5,
        location: "Audubon Ballroom",
        title: "A Legacy of Transformation",
        description:
          "Complete the journey at the site associated with his assassination.",
        narration:
          "Malcolm X’s legacy continues through his defense of Black humanity, intellectual growth, courage, and willingness to transform.",
        xp: 50,
      },
    ],
  },

  "maya-angelou-journey": {
    id: "maya-angelou-journey",
    title: "Maya Angelou Journey",
    location: "United States and Global",
    country: "United States",
    introduction:
      "Follow the life, writing, performance, activism, and enduring voice of Maya Angelou.",
    chapters: [
      {
        id: "maya-angelou-journey-1",
        checkpoint: 1,
        location: "Stamps, Arkansas",
        title: "Finding a Voice",
        description:
          "Begin in the Southern town that shaped Angelou’s childhood.",
        narration:
          "Your journey begins in Stamps, where hardship, family, racism, literature, and silence shaped Maya Angelou’s early life.",
        xp: 20,
      },
      {
        id: "maya-angelou-journey-2",
        checkpoint: 2,
        location: "San Francisco",
        title: "Breaking Barriers",
        description:
          "Learn about Angelou’s early work and determination.",
        narration:
          "In San Francisco, she pursued education, performance, and employment while refusing to accept limits placed on her.",
        xp: 25,
      },
      {
        id: "maya-angelou-journey-3",
        checkpoint: 3,
        location: "Harlem Writers Guild",
        title: "The Writer Emerges",
        description:
          "Explore the community that encouraged her literary work.",
        narration:
          "The Harlem Writers Guild supported Angelou as she transformed memory, struggle, humor, and survival into powerful writing.",
        xp: 30,
      },
      {
        id: "maya-angelou-journey-4",
        checkpoint: 4,
        location: "Civil Rights Movement",
        title: "Art and Activism",
        description:
          "Learn about her work with major civil-rights leaders.",
        narration:
          "Angelou combined writing and performance with activism, working alongside movements for Black freedom and international justice.",
        xp: 35,
      },
      {
        id: "maya-angelou-journey-5",
        checkpoint: 5,
        location: "Poet’s Stage",
        title: "Still I Rise",
        description:
          "Complete the journey by honoring her literary legacy.",
        narration:
          "Maya Angelou’s words continue to affirm dignity, courage, memory, resilience, and the power of telling one’s story.",
        xp: 50,
      },
    ],
  },


  "autism-awareness": {
    id: "autism-awareness",
    title: "Autism Awareness",
    location: "Global Awareness Journey",
    country: "Global",
    introduction:
      "Walk a journey centered on understanding, acceptance, inclusion, communication, and respect for autistic people.",
    chapters: [
      {
        id: "autism-awareness-1",
        checkpoint: 1,
        location: "Understanding Begins",
        title: "Every Mind Is Different",
        description:
          "Begin by recognizing autism as a broad spectrum of experiences, strengths, needs, and ways of communicating.",
        narration:
          "Your journey begins with understanding. Autism is not one experience, and every autistic person has a unique combination of strengths, challenges, preferences, and ways of connecting with the world.",
        xp: 20,
      },
      {
        id: "autism-awareness-2",
        checkpoint: 2,
        location: "Sensory Path",
        title: "Experiencing the Environment",
        description:
          "Learn how sound, light, texture, movement, and crowds can affect people differently.",
        narration:
          "Some autistic people experience sensory input more intensely or seek specific forms of sensory stimulation. Thoughtful environments can reduce stress and support comfort.",
        xp: 25,
      },
      {
        id: "autism-awareness-3",
        checkpoint: 3,
        location: "Communication Bridge",
        title: "Many Ways to Communicate",
        description:
          "Explore spoken language, gestures, devices, writing, and other forms of communication.",
        narration:
          "Communication does not look the same for everyone. Respect means listening carefully, allowing time, and valuing each person’s preferred way of expressing themselves.",
        xp: 30,
      },
      {
        id: "autism-awareness-4",
        checkpoint: 4,
        location: "Inclusion Square",
        title: "Belonging Without Pressure",
        description:
          "Learn how schools, workplaces, families, and communities can become more inclusive.",
        narration:
          "Inclusion is more than allowing someone to be present. It means removing barriers, offering support, respecting boundaries, and creating genuine opportunities to participate.",
        xp: 35,
      },
      {
        id: "autism-awareness-5",
        checkpoint: 5,
        location: "Acceptance Finish",
        title: "Respect, Support, and Acceptance",
        description:
          "Complete the journey by committing to dignity, accessibility, and inclusion.",
        narration:
          "This journey ends with acceptance. Autistic people deserve respect, safety, opportunity, self-determination, and communities that value who they are.",
        xp: 50,
      },
    ],
  },

  "breast-cancer-awareness": {
    id: "breast-cancer-awareness",
    title: "Breast Cancer Awareness",
    location: "Global Awareness Journey",
    country: "Global",
    introduction:
      "Walk in support of education, early detection, treatment, survivors, caregivers, and those remembered.",
    chapters: [
      {
        id: "breast-cancer-awareness-1",
        checkpoint: 1,
        location: "Pink Ribbon Start",
        title: "Awareness Saves Lives",
        description:
          "Begin with the importance of understanding breast health and recognizing changes.",
        narration:
          "Your journey begins with awareness. Learning what is normal for your body and speaking with a healthcare professional about changes can support earlier evaluation.",
        xp: 20,
      },
      {
        id: "breast-cancer-awareness-2",
        checkpoint: 2,
        location: "Screening Path",
        title: "Early Detection",
        description:
          "Learn about screening conversations and individual risk.",
        narration:
          "Screening recommendations vary by age, health history, and risk. Regular conversations with qualified medical professionals help people make informed decisions.",
        xp: 25,
      },
      {
        id: "breast-cancer-awareness-3",
        checkpoint: 3,
        location: "Treatment Bridge",
        title: "Strength Through Treatment",
        description:
          "Honor the people navigating diagnosis, surgery, medication, radiation, and recovery.",
        narration:
          "Treatment can be physically and emotionally demanding. Patients may rely on medical teams, caregivers, family, friends, and support communities throughout the process.",
        xp: 30,
      },
      {
        id: "breast-cancer-awareness-4",
        checkpoint: 4,
        location: "Survivor Garden",
        title: "Survival and Life After Treatment",
        description:
          "Recognize survivorship, long-term care, and emotional healing.",
        narration:
          "Survivorship can include relief, fear, fatigue, follow-up care, identity changes, and renewed purpose. Every person’s recovery experience is different.",
        xp: 35,
      },
      {
        id: "breast-cancer-awareness-5",
        checkpoint: 5,
        location: "Hope Memorial",
        title: "Walk for Hope",
        description:
          "Complete the journey by honoring survivors, caregivers, researchers, and those lost.",
        narration:
          "This journey ends in hope and remembrance. Continued education, research, access to care, and community support can make a meaningful difference.",
        xp: 50,
      },
    ],
  },

  "cancer-awareness": {
    id: "cancer-awareness",
    title: "Cancer Awareness",
    location: "Global Awareness Journey",
    country: "Global",
    introduction:
      "Walk in support of prevention education, early diagnosis, treatment, research, survivors, families, and remembrance.",
    chapters: [
      {
        id: "cancer-awareness-1",
        checkpoint: 1,
        location: "Awareness Gate",
        title: "Understanding Cancer",
        description:
          "Begin by learning that cancer includes many different diseases.",
        narration:
          "Your journey begins with understanding. Cancer is not one condition but a broad group of diseases involving abnormal cell growth in different parts of the body.",
        xp: 20,
      },
      {
        id: "cancer-awareness-2",
        checkpoint: 2,
        location: "Prevention Path",
        title: "Reducing Risk",
        description:
          "Learn how prevention and risk reduction can support long-term health.",
        narration:
          "Some cancer risks can be reduced through avoiding tobacco, protecting skin, receiving recommended vaccines, maintaining healthy habits, and following medical guidance.",
        xp: 25,
      },
      {
        id: "cancer-awareness-3",
        checkpoint: 3,
        location: "Diagnosis Bridge",
        title: "The Moment Everything Changes",
        description:
          "Recognize the emotional and practical impact of diagnosis.",
        narration:
          "A cancer diagnosis can bring fear, uncertainty, difficult decisions, and major changes for patients and the people who care about them.",
        xp: 30,
      },
      {
        id: "cancer-awareness-4",
        checkpoint: 4,
        location: "Research Center",
        title: "Progress Through Science",
        description:
          "Explore how research improves detection, treatment, and survival.",
        narration:
          "Research continues to improve surgery, radiation, medications, immunotherapy, precision treatment, supportive care, and quality of life.",
        xp: 35,
      },
      {
        id: "cancer-awareness-5",
        checkpoint: 5,
        location: "Unity Memorial",
        title: "Together Against Cancer",
        description:
          "Complete the journey by honoring patients, survivors, caregivers, researchers, and those remembered.",
        narration:
          "This journey ends with unity. Awareness, compassion, research, equitable care, and community support remain essential in the fight against cancer.",
        xp: 50,
      },
    ],
  },

  "heart-challenge": {
    id: "heart-challenge",
    title: "Heart Challenge",
    location: "Global Wellness Journey",
    country: "Global",
    introduction:
      "Walk a journey focused on heart health, movement, prevention, recovery, and lifelong wellness.",
    chapters: [
      {
        id: "heart-challenge-1",
        checkpoint: 1,
        location: "Heart Health Start",
        title: "Every Step Supports the Heart",
        description:
          "Begin by understanding how regular movement supports cardiovascular wellness.",
        narration:
          "Your journey begins with movement. Walking can support circulation, endurance, energy, and overall cardiovascular health when performed safely and consistently.",
        xp: 20,
      },
      {
        id: "heart-challenge-2",
        checkpoint: 2,
        location: "Healthy Habits Path",
        title: "Daily Choices Matter",
        description:
          "Learn how sleep, nutrition, stress, and activity affect heart health.",
        narration:
          "Heart health is influenced by many daily habits, including physical activity, food choices, sleep, tobacco exposure, stress management, and medical care.",
        xp: 25,
      },
      {
        id: "heart-challenge-3",
        checkpoint: 3,
        location: "Warning Signs Bridge",
        title: "Recognizing an Emergency",
        description:
          "Learn the importance of taking possible heart-attack symptoms seriously.",
        narration:
          "Chest pressure, shortness of breath, sweating, nausea, or pain spreading to the arm, back, neck, or jaw can require immediate emergency care.",
        xp: 30,
      },
      {
        id: "heart-challenge-4",
        checkpoint: 4,
        location: "Recovery Hill",
        title: "Healing and Rehabilitation",
        description:
          "Honor people recovering from heart conditions and cardiac procedures.",
        narration:
          "Recovery may involve medication, supervised rehabilitation, gradual activity, emotional support, and long-term lifestyle changes.",
        xp: 35,
      },
      {
        id: "heart-challenge-5",
        checkpoint: 5,
        location: "Heart Hero Finish",
        title: "A Stronger Future",
        description:
          "Complete the challenge by committing to sustainable heart-healthy habits.",
        narration:
          "This journey ends with a commitment to care for your heart through movement, informed choices, medical guidance, and steady progress.",
        xp: 50,
      },
    ],
  },

  "mental-health-awareness": {
    id: "mental-health-awareness",
    title: "Mental Health Awareness",
    location: "Global Wellness Journey",
    country: "Global",
    introduction:
      "Walk a supportive journey centered on emotional wellness, connection, stigma reduction, coping skills, and reaching for help.",
    chapters: [
      {
        id: "mental-health-awareness-1",
        checkpoint: 1,
        location: "Awareness Start",
        title: "Mental Health Is Health",
        description:
          "Begin by recognizing emotional and psychological wellness as part of overall health.",
        narration:
          "Your journey begins with a simple truth: mental health is part of health. People can experience stress, anxiety, depression, grief, trauma, and other challenges at any stage of life.",
        xp: 20,
      },
      {
        id: "mental-health-awareness-2",
        checkpoint: 2,
        location: "Stigma-Free Path",
        title: "Ending Silence and Shame",
        description:
          "Learn how stigma can prevent people from seeking support.",
        narration:
          "Judgment and shame can make people feel isolated. Respectful language, listening, and honest conversation can help create safer communities.",
        xp: 25,
      },
      {
        id: "mental-health-awareness-3",
        checkpoint: 3,
        location: "Coping Skills Bridge",
        title: "Tools for Difficult Days",
        description:
          "Explore healthy ways to manage stress and emotional pressure.",
        narration:
          "Helpful strategies may include movement, breathing, sleep routines, journaling, time outdoors, social support, professional care, and reducing overwhelming demands.",
        xp: 30,
      },
      {
        id: "mental-health-awareness-4",
        checkpoint: 4,
        location: "Support Circle",
        title: "Reaching Out",
        description:
          "Recognize the importance of trusted people and professional support.",
        narration:
          "Asking for help is a sign of strength. Friends, family, counselors, doctors, support groups, and crisis services can all play an important role.",
        xp: 35,
      },
      {
        id: "mental-health-awareness-5",
        checkpoint: 5,
        location: "Hope Finish",
        title: "You Are Not Alone",
        description:
          "Complete the journey with a message of support, dignity, and hope.",
        narration:
          "This journey ends with hope. Recovery is not always a straight path, but support, treatment, connection, and compassion can help people move forward.",
        xp: 50,
      },
    ],
  },

  "diabetes-awareness": {
    id: "diabetes-awareness",
    title: "Diabetes Awareness",
    location: "Global Health Journey",
    country: "Global",
    introduction:
      "Walk a journey focused on diabetes education, prevention, daily management, medical care, and long-term wellness.",
    chapters: [
      {
        id: "diabetes-awareness-1",
        checkpoint: 1,
        location: "Understanding Start",
        title: "Understanding Diabetes",
        description:
          "Begin by learning how diabetes affects blood glucose regulation.",
        narration:
          "Your journey begins with understanding. Diabetes affects how the body produces or uses insulin and how glucose is managed in the bloodstream.",
        xp: 20,
      },
      {
        id: "diabetes-awareness-2",
        checkpoint: 2,
        location: "Prevention Path",
        title: "Reducing Type 2 Diabetes Risk",
        description:
          "Learn how movement, nutrition, sleep, and medical care can support prevention.",
        narration:
          "For some people, regular activity, balanced nutrition, weight management, sleep, and medical support can reduce the risk of developing type 2 diabetes.",
        xp: 25,
      },
      {
        id: "diabetes-awareness-3",
        checkpoint: 3,
        location: "Daily Management Bridge",
        title: "Managing Each Day",
        description:
          "Explore monitoring, medication, food choices, and activity planning.",
        narration:
          "Daily management may include checking glucose, taking medication or insulin, planning meals, staying active, and responding to changing blood-sugar levels.",
        xp: 30,
      },
      {
        id: "diabetes-awareness-4",
        checkpoint: 4,
        location: "Whole-Body Care",
        title: "Protecting Long-Term Health",
        description:
          "Learn why regular medical care is important.",
        narration:
          "Diabetes care can include monitoring the heart, kidneys, eyes, nerves, circulation, and feet to reduce the risk of complications.",
        xp: 35,
      },
      {
        id: "diabetes-awareness-5",
        checkpoint: 5,
        location: "Health Advocate Finish",
        title: "Knowledge Builds Strength",
        description:
          "Complete the journey with a commitment to education, access, and support.",
        narration:
          "This journey ends with empowerment. Accurate information, consistent care, healthy routines, and community support can help people live well with diabetes.",
        xp: 50,
      },
    ],
  },

  "veterans-honor-walk": {
    id: "veterans-honor-walk",
    title: "Veterans Honor Walk",
    location: "United States",
    country: "United States",
    introduction:
      "Walk in honor of military veterans, service members, families, sacrifice, recovery, and remembrance.",
    chapters: [
      {
        id: "veterans-honor-walk-1",
        checkpoint: 1,
        location: "Service Gate",
        title: "The Call to Serve",
        description:
          "Begin by recognizing the people who entered military service.",
        narration:
          "Your journey begins by honoring people who served in different branches, roles, eras, and circumstances.",
        xp: 20,
      },
      {
        id: "veterans-honor-walk-2",
        checkpoint: 2,
        location: "Training Ground",
        title: "Preparation and Discipline",
        description:
          "Learn about the demands of military training and teamwork.",
        narration:
          "Training develops physical readiness, technical skill, discipline, trust, and the ability to work under difficult conditions.",
        xp: 25,
      },
      {
        id: "veterans-honor-walk-3",
        checkpoint: 3,
        location: "Deployment Bridge",
        title: "Service Away from Home",
        description:
          "Recognize the impact of deployment on service members and families.",
        narration:
          "Deployments may involve danger, separation, uncertainty, responsibility, and major sacrifices for both service members and their loved ones.",
        xp: 30,
      },
      {
        id: "veterans-honor-walk-4",
        checkpoint: 4,
        location: "Homecoming Path",
        title: "The Journey Home",
        description:
          "Learn about transition, recovery, disability, and reintegration.",
        narration:
          "Returning home can bring relief and pride, but also challenges involving employment, physical injuries, trauma, relationships, and identity.",
        xp: 35,
      },
      {
        id: "veterans-honor-walk-5",
        checkpoint: 5,
        location: "Honor Memorial",
        title: "Service Remembered",
        description:
          "Complete the journey by honoring veterans, families, the wounded, and those who died.",
        narration:
          "This walk ends in gratitude and remembrance, while recognizing the continuing responsibility to support veterans and their families.",
        xp: 50,
      },
    ],
  },
    "trans-siberian-trek": {
    id: "trans-siberian-trek",
    title: "Trans-Siberian Trek",
    location: "Moscow to Vladivostok",
    country: "Russia",
    introduction:
      "Travel across an immense continental route through historic cities, forests, mountains, rivers, and the landscapes of Siberia.",
    chapters: [
      {
        id: "trans-siberian-trek-1",
        checkpoint: 1,
        location: "Moscow",
        title: "The Continental Journey Begins",
        description:
          "Begin in Moscow before traveling east across Russia.",
        narration:
          "Your journey begins in Moscow, where travelers prepare to cross thousands of miles, multiple time zones, and some of the largest landscapes on Earth.",
        xp: 20,
      },
      {
        id: "trans-siberian-trek-2",
        checkpoint: 2,
        location: "Ural Mountains",
        title: "Between Europe and Asia",
        description:
          "Cross the mountain region traditionally associated with the boundary between Europe and Asia.",
        narration:
          "The Ural Mountains mark a symbolic continental divide, connecting rather than separating the many communities and environments along the route.",
        xp: 25,
      },
      {
        id: "trans-siberian-trek-3",
        checkpoint: 3,
        location: "Western Siberia",
        title: "Across the Taiga",
        description:
          "Travel through vast forests, rivers, wetlands, and remote settlements.",
        narration:
          "Siberia’s taiga stretches across enormous distances, supporting wildlife, natural resources, Indigenous communities, towns, and transportation corridors.",
        xp: 30,
      },
      {
        id: "trans-siberian-trek-4",
        checkpoint: 4,
        location: "Lake Baikal",
        title: "The Great Siberian Lake",
        description:
          "Reach one of the world’s deepest and oldest freshwater lakes.",
        narration:
          "Lake Baikal contains an extraordinary amount of freshwater and supports species found nowhere else on Earth.",
        xp: 35,
      },
      {
        id: "trans-siberian-trek-5",
        checkpoint: 5,
        location: "Vladivostok",
        title: "The Pacific Terminus",
        description:
          "Complete the journey at Russia’s Pacific coast.",
        narration:
          "At Vladivostok, the Trans-Siberian journey ends after crossing a continent shaped by extraordinary distance, cultural diversity, difficult history, and human endurance.",
        xp: 50,
      },
    ],
  },

  "lycian-way": {
    id: "lycian-way",
    title: "The Lycian Way",
    location: "Mediterranean Coast",
    country: "Türkiye",
    introduction:
      "Follow a long-distance trail through coastal mountains, ancient Lycian ruins, villages, forests, and Mediterranean landscapes.",
    chapters: [
      {
        id: "lycian-way-1",
        checkpoint: 1,
        location: "Fethiye",
        title: "The Coastal Trail Begins",
        description:
          "Begin near the western entrance to the Lycian Way.",
        narration:
          "Your journey begins near Fethiye, where mountain paths rise above the Mediterranean and connect modern communities with ancient landscapes.",
        xp: 20,
      },
      {
        id: "lycian-way-2",
        checkpoint: 2,
        location: "Butterfly Valley",
        title: "Cliffs Above the Sea",
        description:
          "Cross steep coastal terrain overlooking hidden beaches and valleys.",
        narration:
          "The trail follows rugged cliffs where forests, waterfalls, isolated coves, and bright Mediterranean water meet.",
        xp: 25,
      },
      {
        id: "lycian-way-3",
        checkpoint: 3,
        location: "Xanthos",
        title: "The Lycian Civilization",
        description:
          "Explore the remains of an important ancient Lycian city.",
        narration:
          "Xanthos preserves tombs, monuments, inscriptions, and evidence of a civilization that developed a distinctive political and cultural identity.",
        xp: 30,
      },
      {
        id: "lycian-way-4",
        checkpoint: 4,
        location: "Mount Olympos",
        title: "Fire from the Mountain",
        description:
          "Reach the region associated with ancient ruins and natural flames.",
        narration:
          "Near Olympos, natural gas flames emerge from the rocky ground and may have inspired stories of the fire-breathing Chimera.",
        xp: 35,
      },
      {
        id: "lycian-way-5",
        checkpoint: 5,
        location: "Antalya Coast",
        title: "The Mediterranean Finish",
        description:
          "Complete the route along the eastern Mediterranean coast.",
        narration:
          "The Lycian Way ends with a legacy of ancient cities, mountain villages, demanding trails, coastal beauty, and cultural continuity.",
        xp: 50,
      },
    ],
  },

  "cordillera-huayhuash": {
    id: "cordillera-huayhuash",
    title: "Cordillera Huayhuash Circuit",
    location: "Peruvian Andes",
    country: "Peru",
    introduction:
      "Trek through a high-altitude circuit of glacial lakes, mountain passes, remote communities, and dramatic Andean peaks.",
    chapters: [
      {
        id: "cordillera-huayhuash-1",
        checkpoint: 1,
        location: "Matacancha",
        title: "Entering the High Andes",
        description:
          "Begin beneath the snow-covered peaks of the Huayhuash range.",
        narration:
          "Your journey begins at high elevation, where careful pacing and preparation are essential before entering the remote mountain circuit.",
        xp: 20,
      },
      {
        id: "cordillera-huayhuash-2",
        checkpoint: 2,
        location: "Cacananpunta Pass",
        title: "The First Great Pass",
        description:
          "Climb across a demanding high-altitude mountain pass.",
        narration:
          "The trail rises into thin air, revealing broad valleys, rocky slopes, grazing animals, and distant glaciers.",
        xp: 25,
      },
      {
        id: "cordillera-huayhuash-3",
        checkpoint: 3,
        location: "Carhuacocha Lake",
        title: "The Glacial Lakes",
        description:
          "Reach a high lake beneath towering mountain walls.",
        narration:
          "Carhuacocha reflects the surrounding peaks while receiving cold water from snowfields and retreating glaciers.",
        xp: 30,
      },
      {
        id: "cordillera-huayhuash-4",
        checkpoint: 4,
        location: "Siula Pass",
        title: "The Highest Challenge",
        description:
          "Cross one of the circuit’s most demanding stages.",
        narration:
          "The climb toward Siula Pass tests endurance with steep terrain, unstable weather, cold winds, and reduced oxygen.",
        xp: 35,
      },
      {
        id: "cordillera-huayhuash-5",
        checkpoint: 5,
        location: "Huayllapa Valley",
        title: "The Mountain Circuit Complete",
        description:
          "Complete the journey after descending toward inhabited valleys.",
        narration:
          "The Huayhuash Circuit ends with respect for Andean communities, fragile ecosystems, glacial water, and the strength required to cross the high mountains.",
        xp: 50,
      },
    ],
  },

  "chornohora-ridge": {
    id: "chornohora-ridge",
    title: "Chornohora Ridge",
    location: "Carpathian Mountains",
    country: "Ukraine",
    introduction:
      "Walk across the highest mountain ridge in Ukraine through forests, alpine meadows, steep summits, and Carpathian cultural landscapes.",
    chapters: [
      {
        id: "chornohora-ridge-1",
        checkpoint: 1,
        location: "Carpathian Forest",
        title: "The Ridge Journey Begins",
        description:
          "Begin beneath the high peaks within the forested Carpathians.",
        narration:
          "Your journey begins among dense forests, mountain streams, traditional communities, and trails rising toward the open ridge.",
        xp: 20,
      },
      {
        id: "chornohora-ridge-2",
        checkpoint: 2,
        location: "Alpine Meadow",
        title: "Above the Tree Line",
        description:
          "Climb from the forest into broad highland meadows.",
        narration:
          "Above the trees, open grasslands reveal sweeping mountain views and seasonal grazing areas shaped by local traditions.",
        xp: 25,
      },
      {
        id: "chornohora-ridge-3",
        checkpoint: 3,
        location: "Lake Brebeneskul",
        title: "The Mountain Lake",
        description:
          "Reach a high-altitude lake beneath the ridge.",
        narration:
          "Lake Brebeneskul rests in a glacial basin surrounded by steep slopes, changing weather, and fragile alpine vegetation.",
        xp: 30,
      },
      {
        id: "chornohora-ridge-4",
        checkpoint: 4,
        location: "Hoverla Ascent",
        title: "Climbing Ukraine’s Highest Peak",
        description:
          "Complete the steep ascent toward Mount Hoverla.",
        narration:
          "The route to Hoverla demands steady movement as wind, fog, rain, and rapidly changing mountain conditions test walkers.",
        xp: 35,
      },
      {
        id: "chornohora-ridge-5",
        checkpoint: 5,
        location: "Mount Hoverla",
        title: "The Carpathian Summit",
        description:
          "Complete the journey at Ukraine’s highest point.",
        narration:
          "From Mount Hoverla, the Chornohora Ridge represents natural beauty, cultural heritage, national identity, resilience, and the enduring strength of the Ukrainian people.",
        xp: 50,
      },
    ],
  },
};

export const getJourneyStory = journeyId => {
  const normalizedJourneyId = String(journeyId || "")
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");

  return JOURNEY_STORIES[normalizedJourneyId] || null;
};

export const getJourneyStoryCount = () =>
  Object.keys(JOURNEY_STORIES).length;

export const getJourneyChapter = (
  journeyId,
  checkpointNumber
) => {
  const story = getJourneyStory(journeyId);

  if (!story) {
    return null;
  }

  return (
    story.chapters.find(
      chapter =>
        Number(chapter.checkpoint) ===
        Number(checkpointNumber)
    ) || null
  );
};

export const getUnlockedJourneyChapters = (
  journeyId,
  completedCheckpoints = []
) => {
  const story = getJourneyStory(journeyId);

  if (!story) {
    return [];
  }

  const unlockedCheckpointNumbers = new Set(
    completedCheckpoints.map(Number)
  );

  return story.chapters.filter(
    chapter =>
      Number(chapter.checkpoint) === 1 ||
      unlockedCheckpointNumbers.has(
        Number(chapter.checkpoint)
      )
  );
};

export default JOURNEY_STORIES;