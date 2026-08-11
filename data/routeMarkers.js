export const ROUTE_MARKERS = {
selma: [
  { id: 1, title: "Start", left: "38%", top: "82%" },
  { id: 2, title: "The Bridge", left: "72", top: "52%" },
  { id: 3, title: "The March", left: "34%", top: "44%" },
  { id: 4, title: "The Resolve", left: "43%", top: "18%" },
  { id: 5, title: "Freedom Won", left: "78%", top: "16%" },
],
  blackwallstreet: [
    { id: 1, title: "Founding a Dream", left: "14%", top: "72%" },
    { id: 2, title: "Thriving Businesses", left: "56%", top: "78%" },
    { id: 3, title: "Wealth & Prosperity", left: "50%", top: "55%" },
    { id: 4, title: "Community & Culture", left: "42%", top: "36%" },
    { id: 5, title: "Legacy Lives On", left: "58%", top: "22%" },
  ],

  autism: [
    { id: 1, title: "Awareness", left: "18%", top: "82%" },
    { id: 2, title: "Understand", left: "52%", top: "60%" },
    { id: 3, title: "Support", left: "42%", top: "45%" },
    { id: 4, title: "Inclusion", left: "60%", top: "30%" },
    { id: 5, title: "Empower", left: "28%", top: "18%" },
  ],

  amazon: [
    { id: 1, title: "Trailhead", left: "18%", top: "82%" },
    { id: 2, title: "River Bend", left: "46%", top: "66%" },
    { id: 3, title: "Canopy Walk", left: "52%", top: "48%" },
    { id: 4, title: "Hidden Falls", left: "42%", top: "32%" },
    { id: 5, title: "Expedition Complete", left: "58%", top: "16%" },
  ],
};

export const getRouteMarkers = (journeyId) => {
  return ROUTE_MARKERS[journeyId] || [];
};