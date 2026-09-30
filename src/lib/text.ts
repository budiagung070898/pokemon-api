interface LocalizedEntry {
  language: { name: string };
}

/** Picks entries written in English (PokéAPI returns many languages). */
export const englishOnly = <T extends LocalizedEntry>(entries: T[]) =>
  entries.filter((entry) => entry.language.name === "en");

/** Game text contains form feeds, hard line breaks and soft hyphens. */
export const cleanGameText = (text: string) =>
  text
    .replace(/­\n/g, "")
    .replace(/[\f\n\r­]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
