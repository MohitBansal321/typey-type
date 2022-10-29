import getRankedOutlineFromLookupEntry from "./getRankedOutlineFromLookupEntry";

const findFingerspellingOutline = (
  wordOrPhrase: string,
  globalLookupDictionary: any,
  strokeForOneCharacterWordPart: string,
  affixList: any,
  precedingChar: string
) => {
  if (precedingChar === " ") {
    let modifiedWordOrPhrase = `{${wordOrPhrase}}`; // for `houses?" It`
    let lookupEntry = globalLookupDictionary.get(modifiedWordOrPhrase);
    if (lookupEntry) {
      strokeForOneCharacterWordPart = getRankedOutlineFromLookupEntry(
        lookupEntry,
        modifiedWordOrPhrase,
        affixList
      );
    } else {
      modifiedWordOrPhrase = wordOrPhrase; // for ` B`
      lookupEntry = globalLookupDictionary.get(modifiedWordOrPhrase);
      if (lookupEntry) {
        strokeForOneCharacterWordPart = getRankedOutlineFromLookupEntry(
          lookupEntry,
          modifiedWordOrPhrase,
          affixList
        );
      }
    }
  } else {
    // try look up capital letters and numbers from personal dictionaries:
    let modifiedWordOrPhrase = `{&${wordOrPhrase}}`; // for `B`
    let lookupEntry = globalLookupDictionary.get(modifiedWordOrPhrase);
    if (lookupEntry) {
      strokeForOneCharacterWordPart = getRankedOutlineFromLookupEntry(
        lookupEntry,
        modifiedWordOrPhrase,
        affixList
      );
    } else {
      // try look up lowercase letters from personal dictionaries:
      modifiedWordOrPhrase = `{>}{&${wordOrPhrase}}`; // for `b`
      lookupEntry = globalLookupDictionary.get(modifiedWordOrPhrase);
      if (lookupEntry) {
        strokeForOneCharacterWordPart = getRankedOutlineFromLookupEntry(
          lookupEntry,
          modifiedWordOrPhrase,
          affixList
        );
      }
    }
  }

  return strokeForOneCharacterWordPart;
};
export default findFingerspellingOutline;