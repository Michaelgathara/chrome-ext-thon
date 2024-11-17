function stripNonEnglishCharacters(input: string): string {
  // Testing to see if non-english text inside the text is messing with our output
  // This gives more successes but not always guranteed
  return input.replace(/[^a-zA-Z\s]/g, "");
}
