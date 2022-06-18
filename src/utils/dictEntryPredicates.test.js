import {
  hasMoreThan2Letters,
  hasNoRepeatLetters,
  hasOnlyLettersOrSpaces,
} from "./dictEntryPredicates";

describe("hasMoreThan2Letters", () => {
  it("returns true for word most words", () => {
    expect(hasMoreThan2Letters("sat")).toEqual(true);
  });

  it("returns false for short words", () => {
    expect(hasMoreThan2Letters("to")).toEqual(false);
  });
});

describe("hasNoRepeatLetters", () => {
  it("returns true for word made of unique letters", () => {
    expect(hasNoRepeatLetters("quiet")).toEqual(true);
  });

  it("returns false for word with repeated letters", () => {
    expect(hasNoRepeatLetters("test")).toEqual(false);
  });
});

describe("hasOnlyLettersOrSpaces", () => {
  it("returns true for phrasing brief", () => {
    expect(hasOnlyLettersOrSpaces("of the")).toEqual(true);
  });

  it("returns true for uppercase phrase", () => {
    expect(hasOnlyLettersOrSpaces("FRIDAY")).toEqual(true);
  });

  it("returns false for phrasing brief", () => {
    expect(hasOnlyLettersOrSpaces("didn't")).toEqual(false);
  });
});