import * as React from "react";
import { Component } from "react";
import SOURCE_NAMESPACES from "../constant/sourceNamespaces";
import splitBriefsIntoStrokes from "./../utils/splitBriefsIntoStrokes";
import lookupListOfStrokesAndDicts from "../utils/lookupListOfStrokesAndDicts";

import misstrokesJSON from "../json/misstrokes.json";
import PloverMisstrokesDetail from "./PloverMisstrokesDetail";
import StrokesAsDiagrams from "./StrokesAsDiagrams";
import MatchedModifiedTranslation from "./MatchedModifiedTranslation";
import LookupResultsOutlinesAndDicts from "./LookupResultsOutlinesAndDicts";

class StrokesForWords extends Component {
  state = {
    modifiedWordOrPhrase: "",
    phrase: "",
    listOfStrokesAndDicts: [],
  };

  componentDidMount() {
    // if (this.props.globalLookupDictionary && this.props.globalLookupDictionary.size < 2 && !this.props.globalLookupDictionaryLoaded) {

    const shouldUsePersonalDictionaries =
      this.props.personalDictionaries &&
      Object.entries(this.props.personalDictionaries).length > 0 &&
      !!this.props.personalDictionaries.dictionariesNamesAndContents;

    this.props
      .fetchAndSetupGlobalDict(
        true,
        shouldUsePersonalDictionaries ? this.props.personalDictionaries : null
      )
      .then(() => {
        if (
          this.props.lookupTerm &&
          this.props.lookupTerm !== undefined &&
          this.props.lookupTerm.length > 0
        ) {
          this.setState({ phrase: this.props.lookupTerm });
          this.updateWordsForStrokes(this.props.lookupTerm);
        }
      })
      .catch((error) => {
        console.error(error);
        // this.showDictionaryErrorNotification();
      });
    // }
  }

  handleWordsOnChange(event) {
    let phrase = event.target.value;
    this.updateWordsForStrokes(phrase);
  }

  updateWordsForStrokes(phrase) {
    if (this.props.onChange) {
      this.props.onChange(phrase);
    }

    let [listOfStrokesAndDicts, modifiedWordOrPhrase] =
      lookupListOfStrokesAndDicts(phrase, this.props.globalLookupDictionary);

    if (!this.props.globalUserSettings?.showMisstrokesInLookup) {
      listOfStrokesAndDicts = listOfStrokesAndDicts.filter(
        (row) =>
          row[2] === SOURCE_NAMESPACES.get("user") ||
          !(
            misstrokesJSON[row[0]] &&
            modifiedWordOrPhrase === misstrokesJSON[row[0]]
          )
      );
    }

    if (this.props.trackPhrase) {
      this.props.trackPhrase(phrase);
    }

    this.setState({
      modifiedWordOrPhrase,
      phrase,
      listOfStrokesAndDicts,
    });
  }

  render() {
    const stenoLayout =
      this.props.userSettings?.stenoLayout ?? "stenoLayoutAmericanSteno";

    const brief =
      this.state.listOfStrokesAndDicts &&
      this.state.listOfStrokesAndDicts[0] &&
      this.state.listOfStrokesAndDicts[0][0]
        ? this.state.listOfStrokesAndDicts[0][0]
        : "";

    const strokes = splitBriefsIntoStrokes(brief);

    return this.props.globalLookupDictionaryLoaded ? (
      <React.Fragment>
        <label
          htmlFor="words-for-strokes"
          className="input-textarea-label input-textarea-label--large mb1 overflow-hidden"
        >
          Enter words to look up
        </label>
        <textarea
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          className="input-textarea input-textarea--large mb3 w-100 overflow-hidden"
          id="words-for-strokes"
          onChange={this.handleWordsOnChange.bind(this)}
          placeholder="e.g. quadruplicate"
          rows={1}
          spellCheck={false}
          value={this.state.phrase}
          wrap="off"
        ></textarea>
        <MatchedModifiedTranslation
          listOfStrokesAndDicts={this.state.listOfStrokesAndDicts}
          modifiedWordOrPhrase={this.state.modifiedWordOrPhrase}
          phrase={this.state.phrase}
        />
        <div className="mb1">
          <StrokesAsDiagrams
            listOfStrokesAndDicts={this.state.listOfStrokesAndDicts}
            stenoLayout={stenoLayout}
            strokes={strokes}
            userSettings={this.props.userSettings}
          />
        </div>
        <LookupResultsOutlinesAndDicts
          listOfStrokesAndDicts={this.state.listOfStrokesAndDicts}
          stenoLayout={stenoLayout}
        />
        <PloverMisstrokesDetail
          showMisstrokesInLookup={
            this.props.globalUserSettings?.showMisstrokesInLookup
          }
        />
      </React.Fragment>
    ) : (
      <>Loading…</>
    );
  }
}

export default StrokesForWords;
