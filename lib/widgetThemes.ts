// Widget-card backdrops — CSS gradients + soft blurred accent shapes, not
// photography (nothing web-fetchable/licensable was available), built from
// colors already in the brand palette so they still read as "on-theme"
// nature-ish widget backdrops like the reference app's photo cards.
export interface WidgetTheme {
  name: string;
  stops: { offset: number; color: string }[];
  accentColor: string;
}

export const WIDGET_THEMES: WidgetTheme[] = [
  {
    name: "Teal Grove",
    stops: [
      { offset: 0, color: "#1f4d49" },
      { offset: 0.55, color: "#4f918d" },
      { offset: 1, color: "#8fbbb8" },
    ],
    accentColor: "#c7e3e1",
  },
  {
    name: "Coral Dusk",
    stops: [
      { offset: 0, color: "#8a3924" },
      { offset: 0.55, color: "#e8836f" },
      { offset: 1, color: "#f6c3b3" },
    ],
    accentColor: "#fbe1d8",
  },
  {
    name: "Deep Ink",
    stops: [
      { offset: 0, color: "#14110d" },
      { offset: 0.55, color: "#4a3a2c" },
      { offset: 1, color: "#8a6a4a" },
    ],
    accentColor: "#e8a33d",
  },
];

export function pickWidgetTheme(word: string): WidgetTheme {
  let hash = 0;
  for (let i = 0; i < word.length; i++) {
    hash = (hash * 31 + word.charCodeAt(i)) >>> 0;
  }
  return WIDGET_THEMES[hash % WIDGET_THEMES.length];
}

export function cssGradient(theme: WidgetTheme): string {
  const stops = theme.stops.map((s) => `${s.color} ${s.offset * 100}%`).join(", ");
  return `linear-gradient(135deg, ${stops})`;
}
