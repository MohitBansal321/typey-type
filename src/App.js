import React, { Component } from 'react';
import { randomise, isLessonTextValid } from './utils';
import {
  createWordListFromMetWords,
  parseCustomMaterial,
  parseWordList,
  fetchLessonIndex,
  setupLessonProgress,
  fetchDictionaries,
  fetchDictionaryIndex,
  getLesson,
  generateDictionaryEntries,
  loadPersonalPreferences,
  matchSplitText,
  parseLesson,
  removeWhitespaceAndSumUniqMetWords,
  repetitionsRemaining,
  processDictionary,
  shouldShowStroke,
  strokeAccuracy,
  swapKeyValueInDictionary,
  trimAndSumUniqMetWords,
  targetStrokeCount,
  updateCapitalisationStrokesInNextItem,
  writePersonalPreferences
} from './typey-type';
import {
  Route,
  Switch
} from 'react-router-dom';
import queryString from 'query-string';
import DocumentTitle from 'react-document-title';
import GoogleAnalytics from 'react-ga';
import Loadable from 'react-loadable';
import PageLoading from './PageLoading';
import Announcements from './Announcements';
import ErrorBoundary from './ErrorBoundary'
import Lessons from './Lessons';
import Home from './Home';
import Header from './Header';
import Support from './Support';
import Contribute from './Contribute';
import Progress from './Progress';
import Flashcards from './Flashcards';
import PageNotFound from './PageNotFound';
import Footer from './Footer';
import Zipper from './zipper';
import './App.css';

const AsyncDictionaries = Loadable({
  loader: () => import("./Dictionaries"),
  loading: PageLoading,
  delay: 300
});

// Test PageLoadingPastDelay at Dictionaries route:
// import PageLoadingPastDelay from './PageLoadingPastDelay';
// const AsyncDictionaries = Loadable({
//   loader: () => import('./PageLoadingPastDelay'), // oh no!
//   loading: PageLoading,
// });

// Test PageLoadingFailed at Dictionaries route:
// import PageLoadingFailed from './PageLoadingFailed';
// const AsyncDictionaries = Loadable({
//   loader: () => import('./PageLoadingFailed'), // oh no!
//   loading: PageLoading,
// });

const fallbackLesson = {
  sourceMaterial: [
    {phrase: 'The', stroke: '-T'},
    {phrase: 'process', stroke: 'PROEUS'},
    {phrase: 'of', stroke: '-F'},
    {phrase: 'writing', stroke: 'WREUG'},
    {phrase: 'shorthand', stroke: 'SHORT/HA*PBD'},
    {phrase: 'is', stroke: 'S'},
    {phrase: 'called', stroke: 'KAULD'},
    {phrase: 'stenography.', stroke: 'STEPB/TKPWRAEF TP-PL'},
    {phrase: 'It\'s', stroke: 'T-S'},
    {phrase: 'typed', stroke: 'TAOEUPD'},
    {phrase: 'with a', stroke: 'WA*EU'},
    {phrase: 'stenotype', stroke: 'STEPB/TAOEUP'},
    {phrase: 'or', stroke: 'OR'},
    {phrase: 'fancy', stroke: 'TPAPB/SEU'},
    {phrase: 'keyboard.', stroke: 'KAOEBD TP-PL'},
    {phrase: 'You can', stroke: 'KU'},
    {phrase: 'transcribe,', stroke: 'TREUB KW-BG'},
    {phrase: 'caption,', stroke: 'KAPGS KW-BG'},
    {phrase: 'dictate,', stroke: 'TKEUBG/TAEUT KW-BG'},
    {phrase: 'code,', stroke: 'KOED KW-BG'},
    {phrase: 'chat,', stroke: 'KHAT KW-BG'},
    {phrase: 'or', stroke: 'OR'},
    {phrase: 'write', stroke: 'WREU'},
    {phrase: 'prose', stroke: 'PROES'},
    {phrase: 'at', stroke: 'AT'},
    {phrase: 'over', stroke: 'OEFR'},
    {phrase: '200', stroke: '#T-Z'},
    {phrase: 'words', stroke: 'WORDZ'},
    {phrase: 'per', stroke: 'PER'},
    {phrase: 'minute.', stroke: 'PHEUPB TP-PL'},
    {phrase: 'Typey type', stroke: 'TAOEUP/KWREU TAOEUP'},
    {phrase: 'uses', stroke: 'AOUFS'},
    {phrase: 'spaced', stroke: 'SPAEUFD'},
    {phrase: 'repetitions', stroke: 'REP/TEUGS/-S'},
    {phrase: 'and', stroke: 'SKP'},
    {phrase: 'hundreds', stroke: 'HUPBS'},
    {phrase: 'of', stroke: '-F'},
    {phrase: 'lessons', stroke: 'HROEFPBS'},
    {phrase: 'to', stroke: 'TO'},
    {phrase: 'help', stroke: 'HEP'},
    {phrase: 'you', stroke: 'U'},
    {phrase: 'master', stroke: 'PHAFRT'},
    {phrase: 'typing', stroke: 'TAOEUPG'},
    {phrase: 'with', stroke: 'W'},
    {phrase: 'stenography.', stroke: 'STEPB/TKPWRAEF TP-PL'}
  ],
  presentedMaterial: [
    {phrase: 'The', stroke: '-T'},
    {phrase: 'process', stroke: 'PROEUS'},
    {phrase: 'of', stroke: '-F'},
    {phrase: 'writing', stroke: 'WREUG'},
    {phrase: 'shorthand', stroke: 'SHORT/HA*PBD'},
    {phrase: 'is', stroke: 'S'},
    {phrase: 'called', stroke: 'KAULD'},
    {phrase: 'stenography.', stroke: 'STEPB/TKPWRAEF TP-PL'},
    {phrase: 'It\'s', stroke: 'T-S'},
    {phrase: 'typed', stroke: 'TAOEUPD'},
    {phrase: 'with a', stroke: 'WA*EU'},
    {phrase: 'stenotype', stroke: 'STEPB/TAOEUP'},
    {phrase: 'or', stroke: 'OR'},
    {phrase: 'fancy', stroke: 'TPAPB/SEU'},
    {phrase: 'keyboard.', stroke: 'KAOEBD TP-PL'},
    {phrase: 'You can', stroke: 'KU'},
    {phrase: 'transcribe,', stroke: 'TREUB KW-BG'},
    {phrase: 'caption,', stroke: 'KAPGS KW-BG'},
    {phrase: 'dictate,', stroke: 'TKEUBG/TAEUT KW-BG'},
    {phrase: 'code,', stroke: 'KOED KW-BG'},
    {phrase: 'chat,', stroke: 'KHAT KW-BG'},
    {phrase: 'or', stroke: 'OR'},
    {phrase: 'write', stroke: 'WREU'},
    {phrase: 'prose', stroke: 'PROES'},
    {phrase: 'at', stroke: 'AT'},
    {phrase: 'over', stroke: 'OEFR'},
    {phrase: '200', stroke: '#T-Z'},
    {phrase: 'words', stroke: 'WORDZ'},
    {phrase: 'per', stroke: 'PER'},
    {phrase: 'minute.', stroke: 'PHEUPB TP-PL'},
    {phrase: 'Typey type', stroke: 'TAOEUP/KWREU TAOEUP'},
    {phrase: 'uses', stroke: 'AOUFS'},
    {phrase: 'spaced', stroke: 'SPAEUFD'},
    {phrase: 'repetitions', stroke: 'REP/TEUGS/-S'},
    {phrase: 'and', stroke: 'SKP'},
    {phrase: 'hundreds', stroke: 'HUPBS'},
    {phrase: 'of', stroke: '-F'},
    {phrase: 'lessons', stroke: 'HROEFPBS'},
    {phrase: 'to', stroke: 'TO'},
    {phrase: 'help', stroke: 'HEP'},
    {phrase: 'you', stroke: 'U'},
    {phrase: 'master', stroke: 'PHAFRT'},
    {phrase: 'typing', stroke: 'TAOEUPG'},
    {phrase: 'with', stroke: 'W'},
    {phrase: 'stenography.', stroke: 'STEPB/TKPWRAEF TP-PL'}
  ],
  settings: {
    ignoredChars: ''
  },
  title: 'Steno', subtitle: '',
  newPresentedMaterial: new Zipper([{phrase: '', stroke: ''}]),
  path: ''
};

class App extends Component {
  constructor(props) {
    super(props);
    this.charsPerWord = 5;
    // When updating default state for anything stored in local storage,
    // add the same default to personal preferences code.
    this.state = {
      announcementMessage: null,
      value: '',
      currentPhraseAttempts: [],
      currentPhraseID: 0,
      currentLessonStrokes: [],
      customLessonMaterial: ``,
      customLesson: fallbackLesson,
      actualText: ``,
      dictionaryIndex: [{
        "title": "Dictionary",
        "author": "Typey Type",
        "category": "Typey Type",
        "tagline": "Typey Type’s dictionary is a version of the Plover dictionary with misstrokes removed for the top 10,000 words.",
        "subcategory": "",
        "link": "/support#typey-type-dictionary",
        "path": "/dictionaries/typey-type/typey-type.json"
      }],
      flashcardsMetWords: {
        "the": {
          phrase: "the",
          stroke: "-T",
          rung: 0,
        },
      },
      lessonNotFound: false,
      lessonsProgress: {
      },
      flashcardsProgress: {
      },
      fullscreen: false,
      hideOtherSettings: false,
      nextLessonPath: '',
      previousCompletedPhraseAsTyped: '',
      repetitionsRemaining: 1,
      startTime: null,
      showStrokesInLesson: false,
      timer: null,
      totalNumberOfMatchedWords: 0,
      numberOfMatchedChars: 0,
      totalNumberOfMatchedChars: 0,
      totalNumberOfNewWordsMet: 0,
      totalNumberOfLowExposuresSeen: 0,
      totalNumberOfRetainedWords: 0,
      totalNumberOfMistypedWords: 0,
      totalNumberOfHintedWords: 0,
      disableUserSettings: false,
      metWords: {
        '.': 0
      },
      revisionMode: false,
      userSettings: {
        blurMaterial: false,
        caseSensitive: false,
        simpleTypography: true,
        retainedWords: true,
        limitNumberOfWords: 45,
        newWords: true,
        repetitions: 3,
        showScoresWhileTyping: true,
        showStrokes: true,
        showStrokesAsDiagrams: false,
        hideStrokesOnLastRepetition: true,
        spacePlacement: 'spaceOff',
        speakMaterial: false,
        sortOrder: 'sortOff',
        seenWords: true,
        startFromWord: 1,
        study: 'discover',
        stenoLayout: 'stenoLayoutAmericanSteno' // 'stenoLayoutAmericanSteno' || 'stenoLayoutPalantype' || 'stenoLayoutDanishSteno' || 'stenoLayoutItalianMichelaSteno' || 'stenoLayoutKoreanModernC' || 'stenoLayoutKoreanModernS'
      },
      lesson: fallbackLesson,
      lessonIndex: [{
        "title": "Steno",
        "subtitle": "",
        "category": "Drills",
        "subcategory": "",
        "path": process.env.PUBLIC_URL + "/drills/steno/lesson.txt"
      }],
      revisionMaterial: [
      ]
    };
  }

  componentDidMount() {
    this.setPersonalPreferences();
    fetchLessonIndex().then((json) => {
      this.setState({ lessonIndex: json }, () => {
        setupLessonProgress(json);
      })
    }).catch(() => {
      let json = [{
        "title": "Steno",
        "subtitle": "",
        "category": "Drills",
        "subcategory": "",
        "path": process.env.PUBLIC_URL + "/drills/steno/lesson.txt"
      }];

      this.setState({ lessonIndex: json}, () => {
        setupLessonProgress(json);
      })
    });
  }

  handleStopLesson(event) {
    event.preventDefault();
    this.stopLesson();
  }

  stopLesson() {
    this.stopTimer();

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    writePersonalPreferences('userSettings', this.state.userSettings);
    writePersonalPreferences('metWords', this.state.metWords);
    writePersonalPreferences('flashcardsMetWords', this.state.flashcardsMetWords);
    writePersonalPreferences('flashcardsProgress', this.state.flashcardsProgress);

    if (this.state.lesson.path && !this.state.lesson.path.endsWith("/lessons/custom")) {
      let lessonsProgress = this.updateLessonsProgress(this.state.lesson.path);
      writePersonalPreferences('lessonsProgress', lessonsProgress);
    }

    let currentLessonStrokes = this.state.currentLessonStrokes;
    for (let i = 0; i < currentLessonStrokes.length; i++) {
      if (currentLessonStrokes[i].accuracy === true) {
        currentLessonStrokes[i].checked = false;
      }
    }

    this.setState({
      actualText: '',
      currentPhraseID: this.state.lesson.presentedMaterial.length,
      previousCompletedPhraseAsTyped: '',
      currentPhraseAttempts: [],
      disableUserSettings: false,
      numberOfMatchedChars: 0,
      totalNumberOfMatchedChars: 0
    }, () => {
      this.stopTimer();
    });
  }

  startTimer() {
    this.intervalID = window.setInterval(this.updateWPM.bind(this), 1000);
  }

  stopTimer() {
    if (this.intervalID) {
      clearInterval(this.intervalID);
      this.intervalID = null;
    }
  }

  updateWPM() {
    this.setState({
      timer: new Date() - this.state.startTime
    });
  }

  setPersonalPreferences(source) {
    let metWords = this.state.metWords;
    let flashcardsMetWords = this.state.flashcardsMetWords;
    let flashcardsProgress = this.state.flashcardsProgress;
    let lessonsProgress = this.state.lessonsProgress;
    let userSettings = this.state.userSettings;
    if (source && source !== '') {
      try {
        let parsedSource = JSON.parse(source);
        if (parsedSource && typeof parsedSource === "object") {
          metWords = parsedSource;
        }
      }
      catch (error) { }
    }
    else {
      [metWords, userSettings, flashcardsMetWords, flashcardsProgress, lessonsProgress] = loadPersonalPreferences();
    }
    this.setState({
      flashcardsMetWords: flashcardsMetWords,
      flashcardsProgress: flashcardsProgress,
      lessonsProgress: lessonsProgress,
      metWords: metWords,
      userSettings: userSettings
    }, () => {
      writePersonalPreferences('flashcardsMetWords', this.state.flashcardsMetWords);
      writePersonalPreferences('flashcardsProgress', this.state.flashcardsProgress);
      writePersonalPreferences('lessonsProgress', this.state.lessonsProgress);
      writePersonalPreferences('metWords', this.state.metWords);
      writePersonalPreferences('userSettings', this.state.userSettings);
      this.setupLesson();
    });
  }

  handleLimitWordsChange(event) {
    let currentState = this.state.userSettings;
    let newState = Object.assign({}, currentState);

    const name = "limitNumberOfWords"
    const value = event;

    newState[name] = value;

    this.setState({userSettings: newState}, () => {
      if (!(name === 'caseSensitive')) {
        this.setupLesson();
      }
      writePersonalPreferences('userSettings', this.state.userSettings);
    });

    let labelString = value;
    if (!value) { labelString = "BAD_INPUT"; }

    GoogleAnalytics.event({
      category: 'UserSettings',
      action: 'Change limit word count',
      label: labelString
    });

    return value;
  }

  handleStartFromWordChange(event) {
    let currentState = this.state.userSettings;
    let newState = Object.assign({}, currentState);

    const name = "startFromWord"
    const value = event;

    newState[name] = value;

    this.setState({userSettings: newState}, () => {
      if (!(name === 'caseSensitive')) {
        this.setupLesson();
      }
      writePersonalPreferences('userSettings', this.state.userSettings);
    });

    let labelString = value;
    if (!value) { labelString = "BAD_INPUT"; }

    GoogleAnalytics.event({
      category: 'UserSettings',
      action: 'Change start from word',
      label: labelString
    });

    return value;
  }

  handleRepetitionsChange(event) {
    let currentState = this.state.userSettings;
    let newState = Object.assign({}, currentState);

    const name = "repetitions"
    const value = event;

    newState[name] = value;

    this.setState({userSettings: newState}, () => {
      if (!(name === 'caseSensitive')) {
        this.setupLesson();
      }
      writePersonalPreferences('userSettings', this.state.userSettings);
    });

    let labelString = value;
    if (!value) { labelString = "BAD_INPUT"; }

    GoogleAnalytics.event({
      category: 'UserSettings',
      action: 'Change repetitions',
      label: labelString
    });

    return value;
  }

  changeShowStrokesInLesson(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;

    this.setState({showStrokesInLesson: value});
    const element = document.getElementById('your-typed-text');
    if (element) { element.focus(); }

    if (this.props.location.pathname.includes('custom')) {
      GoogleAnalytics.event({
        category: 'Stroke hint',
        action: 'Reveal',
        label: 'CUSTOM_LESSON'
      });
    }
    else {
      let labelShowStrokesInLesson = 'true';
      try {
        labelShowStrokesInLesson = this.state.lesson.newPresentedMaterial.current.phrase + ": " + this.state.lesson.newPresentedMaterial.current.stroke;
      } catch { }

      GoogleAnalytics.event({
        category: 'Stroke hint',
        action: 'Reveal',
        label: labelShowStrokesInLesson
      });
    }

    return value;
  }

  changeFullscreen(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    this.setState({fullscreen: value});
    return value;
  }

  updateLessonsProgress(lessonpath) {
    let lessonsProgress = Object.assign({}, this.state.lessonsProgress);

    // This is actually UNIQUE numberOfWordsSeen.
    // Updating localStorage data to rename it, however, seems low value.
    let numberOfWordsSeen = 0;

    if (lessonsProgress[lessonpath] && lessonsProgress[lessonpath].numberOfWordsSeen) {
      numberOfWordsSeen = lessonsProgress[lessonpath].numberOfWordsSeen;
    }

    let metWords = this.state.metWords;
    let sourceMaterial;
    sourceMaterial = (this.state.lesson && this.state.lesson.sourceMaterial) ? this.state.lesson.sourceMaterial : [{phrase: "the", stroke: "-T"}];
    let len = sourceMaterial.length;
    let accumulator = 0;

    let normalisedMetWords = {};
    Object.keys(metWords).forEach(function(key,index) {
      normalisedMetWords[key.trim().toLowerCase()] = metWords[key];
    });

    let alreadyChecked = [];
    let wordsLeftToDiscover = [];
    for (let i = 0; i < len; ++i) {
      let sourceMaterialPhrase = sourceMaterial[i].phrase;
      sourceMaterialPhrase = sourceMaterialPhrase.trim();
      sourceMaterialPhrase = sourceMaterialPhrase.toLowerCase();

      // have you seen this word?
      if (normalisedMetWords[sourceMaterialPhrase] && normalisedMetWords[sourceMaterialPhrase] > 0) {

        // have you seen this word and seen it in this lesson already?
        if (!(alreadyChecked.indexOf(sourceMaterialPhrase) > -1)) {
          alreadyChecked.push(sourceMaterialPhrase);
          accumulator = accumulator + 1;
        }
      }
      else {
        wordsLeftToDiscover.push(sourceMaterialPhrase);
      }
    }

    let uniqueLowerCasedWordsLeftToDiscover = [...new Set(wordsLeftToDiscover)];

    numberOfWordsSeen = accumulator;
    let numberOfWordsToDiscover = 0;
    if (uniqueLowerCasedWordsLeftToDiscover && uniqueLowerCasedWordsLeftToDiscover.length > 0) {
      numberOfWordsToDiscover = uniqueLowerCasedWordsLeftToDiscover.length;
    }

    lessonsProgress[lessonpath] = {
      numberOfWordsSeen: numberOfWordsSeen,
      numberOfWordsToDiscover: numberOfWordsToDiscover
    }

    this.setState({
      lessonsProgress: lessonsProgress,
    }, () => {
      writePersonalPreferences('lessonsProgress', this.state.lessonsProgress);
    });
    return lessonsProgress;
  }

  updateFlashcardsProgress(lessonpath) {
    let flashcardsProgress = Object.assign({}, this.state.flashcardsProgress);

    flashcardsProgress[lessonpath] = {
      lastSeen: Date.now()
    }
    this.setState({
      flashcardsProgress: flashcardsProgress,
    }, () => {
      writePersonalPreferences('flashcardsProgress', this.state.flashcardsProgress);
    });
    return flashcardsProgress;
  }

  updateFlashcardsMetWords(word, feedback, stroke, rung = 0) {
    let localStroke = stroke || "XXX";
    let flashcardsMetWords = Object.assign({}, this.state.flashcardsMetWords);
    if (flashcardsMetWords[word]) {
      if (flashcardsMetWords[word].rung) {
        rung = flashcardsMetWords[word].rung;
      }
    }

    if (feedback === "easy") {
      rung = rung + 1;
      // debugger
    } else if (feedback === "hard") {
      rung = rung - 1;
      // debugger
      if (rung < 0 ) { rung = 0;}
    }

    flashcardsMetWords[word] = {
      phrase: word,
      stroke: localStroke,
      rung: rung
    }

    // debugger

    this.setState({
      flashcardsMetWords: flashcardsMetWords,
    }, () => {
      writePersonalPreferences('flashcardsMetWords', flashcardsMetWords);
    });
    // debugger
    return flashcardsMetWords;
  }

  setupRevisionLesson(metWords, userSettings, newSeenOrMemorised) {
    let newUserSettings = Object.assign({}, userSettings);
    newUserSettings.newWords = newSeenOrMemorised[0];
    newUserSettings.seenWords = newSeenOrMemorised[1];
    newUserSettings.retainedWords = newSeenOrMemorised[2];
    if (newSeenOrMemorised[1] && !newSeenOrMemorised[2]) {
      newUserSettings.study = 'revise';
      newUserSettings.sortOrder = 'sortNew';
      newUserSettings.limitNumberOfWords = 50;
      newUserSettings.repetitions = 3;
      newUserSettings.showStrokes = false;
    }
    else if (newSeenOrMemorised[2] && !newSeenOrMemorised[1]) {
      newUserSettings.study = 'drill';
      newUserSettings.sortOrder = 'sortRandom';
      newUserSettings.limitNumberOfWords = 100;
      newUserSettings.repetitions = 3;
      newUserSettings.showStrokes = false;
    } else {
      newUserSettings.study = 'practice';
      newUserSettings.sortOrder = 'sortOff';
      newUserSettings.limitNumberOfWords = 0;
      newUserSettings.repetitions = 1;
      newUserSettings.showStrokes = false;
    }

    let lesson = {};
    let stenoLayout = "stenoLayoutAmericanSteno";
    if (this.state.userSettings) { stenoLayout = this.state.userSettings.stenoLayout; }

    fetchDictionaries().then((json) => {
      let sourceWordsAndStrokes = swapKeyValueInDictionary(json);
      // remove garbage like {^}
      let processedSourceWordsAndStrokes = Object.assign({}, processDictionary(sourceWordsAndStrokes, stenoLayout));
      // grab metWords, trim spaces, and sort by times seen
      let myWords = createWordListFromMetWords(metWords).join("\n");
      // parseWordList appears to remove empty lines and other garbage, we might not need it here
      let result = parseWordList(myWords);
        // perhaps we can replace these with result = createWordListFromMetWords?
        // let myWords = createWordListFromMetWords(metWords).join("\n");
        // let result = parseWordList(myWords);
      if (result && result.length > 0) {
        // look up strokes for each word
        let dictionary = generateDictionaryEntries(result, processedSourceWordsAndStrokes);
        if (dictionary && dictionary.length > 0) {
          lesson.sourceMaterial = dictionary;
          lesson.presentedMaterial = dictionary;
          lesson.newPresentedMaterial = new Zipper([dictionary]);
          lesson.settings = {
            ignoredChars: '',
            customMessage: ''
          };
          lesson.path = process.env.PUBLIC_URL + '/lessons/progress/seen/'
          lesson.title = 'Your revision words'
          if (newSeenOrMemorised[2]) { lesson.path = process.env.PUBLIC_URL + '/lessons/progress/memorised/'; }
          if (newSeenOrMemorised[2]) { lesson.title = 'Your memorised words'; }
          if (newSeenOrMemorised[1] && newSeenOrMemorised[2]) { lesson.title = 'Your words'; }
          if (newSeenOrMemorised[1] && newSeenOrMemorised[2]) { lesson.path = process.env.PUBLIC_URL + '/lessons/progress/'; }
          lesson.subtitle = ''
        }
      }
      this.setState({
        announcementMessage: 'Navigated to: Your revision words',
        currentPhraseID: 0,
        lesson: lesson,
        userSettings: newUserSettings
      }, () => {
        this.setupLesson();

        if (this.mainHeading) {
          this.mainHeading.focus();
        } else {
          const element = document.getElementById('your-typed-text');
          if (element) { element.focus(); }
        }
      });
    }).catch((e) => {
      console.log('Unable to load Typey Type dictionary', e)
    });
  }

  updateRevisionMaterial(event) {
    let newCurrentLessonStrokes = this.state.currentLessonStrokes.map(stroke => ({...stroke}));
    const target = event.target;
    const checked = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name.replace(/-checkbox/,'');
    const index = name;

    newCurrentLessonStrokes[index].checked = checked;

    this.setState({currentLessonStrokes: newCurrentLessonStrokes});
    return checked;
  }

  changeUserSetting(event) {
    let currentState = this.state.userSettings;
    let newState = Object.assign({}, currentState);

    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    newState[name] = value;

    if (!newState.speakMaterial && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    this.setState({userSettings: newState}, () => {
      if (!(name === 'caseSensitive')) {
        this.setupLesson();
      }
      writePersonalPreferences('userSettings', this.state.userSettings);
    });

    let labelString = value;
    if (!value) { labelString = "BAD_INPUT"; }

    GoogleAnalytics.event({
      category: 'UserSettings',
      action: 'Change ' + name,
      label: labelString
    });

    return value;
  }

  changeSortOrderUserSetting(event) {
    let currentState = this.state.userSettings;
    let newState = Object.assign({}, currentState);

    const name = 'sortOrder'
    const value = event.target.value;

    newState[name] = value;

    this.setState({userSettings: newState}, () => {
      if (!(name === 'caseSensitive')) {
        this.setupLesson();
      }
      writePersonalPreferences('userSettings', this.state.userSettings);
    });

    let labelString = value;
    if (!value) { labelString = "BAD_INPUT"; }

    GoogleAnalytics.event({
      category: 'UserSettings',
      action: 'Change sort order',
      label: labelString
    });

    return value;
  }

  changeShowStrokesAs(event) {
    let newState = Object.assign({}, this.state.userSettings);

    const name = 'showStrokesAsDiagrams'
    const value = event.target.value;

    if (value === 'strokesAsText') {
      newState[name] = false;
    } else {
      newState[name] = true;
    }

    this.setState({userSettings: newState}, () => {
      writePersonalPreferences('userSettings', this.state.userSettings);
    });

    let labelString = value;
    if (!value) { labelString = "BAD_INPUT"; }

    GoogleAnalytics.event({
      category: 'UserSettings',
      action: 'Change show strokes as',
      label: labelString
    });

    return value;
  }

  changeShowScoresWhileTyping(event) {
    let newState = Object.assign({}, this.state.userSettings);

    newState['showScoresWhileTyping'] = !newState['showScoresWhileTyping'];

    GoogleAnalytics.event({
      category: 'UserSettings',
      action: 'Change show scores while typing',
      label: newState['showScoresWhileTyping'].toString()
    });

    this.setState({userSettings: newState}, () => {
      writePersonalPreferences('userSettings', this.state.userSettings);
    });
    return newState['showScoresWhileTyping'];
  }

  chooseStudy(event) {
    let currentState = this.state.userSettings;
    let newState = Object.assign({}, currentState);

    const name = 'study'
    const value = event.target.value;

    newState[name] = value;

    switch (value) {
      case "discover":
        newState.showStrokes = true;
        newState.hideStrokesOnLastRepetition = true;
        newState.newWords = true;
        newState.seenWords = false;
        newState.retainedWords = false;
        newState.repetitions = 5;
        newState.limitNumberOfWords = 15;
        newState.sortOrder = 'sortOff';
        break;
      case "revise":
        newState.showStrokes = false;
        newState.hideStrokesOnLastRepetition = true;
        newState.newWords = false;
        newState.seenWords = true;
        newState.retainedWords = false;
        newState.repetitions = 3;
        newState.limitNumberOfWords = 50;
        newState.sortOrder = 'sortNew';
        break;
      case "drill":
        newState.showStrokes = false;
        newState.hideStrokesOnLastRepetition = true;
        newState.newWords = false;
        newState.seenWords = true;
        newState.retainedWords = true;
        newState.repetitions = 3;
        newState.limitNumberOfWords = 100;
        newState.sortOrder = 'sortRandom';
        break;
      case "practice":
        newState.showStrokes = false;
        newState.hideStrokesOnLastRepetition = true;
        newState.newWords = true;
        newState.seenWords = true;
        newState.retainedWords = true;
        newState.repetitions = 1;
        newState.limitNumberOfWords = 0;
        newState.sortOrder = 'sortOff';
        break;
      default:
        break;
    }

    this.setState({userSettings: newState}, () => {
      if (!(name === 'caseSensitive')) {
        this.setupLesson();
      }
      writePersonalPreferences('userSettings', this.state.userSettings);
    });

    let labelString = value;
    if (!value) { labelString = "BAD_INPUT"; }

    GoogleAnalytics.event({
      category: 'UserSettings',
      action: 'Choose Study Type',
      label: labelString
    });

    return value;
  }

  changeSpacePlacementUserSetting(event) {
    let currentState = this.state.userSettings;
    let newState = Object.assign({}, currentState);

    const name = 'spacePlacement'
    const value = event.target.value;

    newState[name] = value;

    this.setState({userSettings: newState}, () => {
      if (!(name === 'caseSensitive')) {
        this.setupLesson();
      }
      writePersonalPreferences('userSettings', this.state.userSettings);
    });

    let labelString = value;
    if (!value) { labelString = "BAD_INPUT"; }

    GoogleAnalytics.event({
      category: 'UserSettings',
      action: 'Change spacePlacement',
      label: labelString
    });

    return value;
  }

  changeStenoLayout(event) {
    let currentState = this.state.userSettings;
    let newState = Object.assign({}, currentState);

    const name = 'stenoLayout'
    const value = event.target.value;

    newState[name] = value;

    this.setState({userSettings: newState}, () => {
      if (!(name === 'caseSensitive')) {
        this.setupLesson();
      }
      writePersonalPreferences('userSettings', this.state.userSettings);
    });

    let labelString = value;
    if (!value) { labelString = "BAD_INPUT"; }

    GoogleAnalytics.event({
      category: 'UserSettings',
      action: 'Change steno layout',
      label: labelString
    });

    return value;
  }

  setupLesson() {
    if (this.state.lesson.path && !this.state.lesson.path.endsWith("/lessons/custom") && !this.state.lesson.path.endsWith("/lessons/custom/setup")) {
      let lessonsProgress = this.updateLessonsProgress(this.state.lesson.path);
      writePersonalPreferences('lessonsProgress', lessonsProgress);
    }

    let newLesson = Object.assign({}, this.state.lesson);
    newLesson.presentedMaterial = newLesson.sourceMaterial.map(line => ({...line}));
    if (this.state.revisionMode) {
      newLesson.presentedMaterial = this.state.revisionMaterial.map(line => ({...line}));
    }

    this.stopTimer();

    const parsedParams = queryString.parse(this.props.location.search);

    let newSettings = Object.assign({}, this.state.userSettings);
    for (const [param, paramVal] of Object.entries(parsedParams)) {
      if (param in this.state.userSettings) {
        const booleanParams = [
          'blurMaterial',
          'caseSensitive',
          'simpleTypography',
          'retainedWords',
          'newWords',
          'showScoresWhileTyping',
          'showStrokes',
          'showStrokesAsDiagrams',
          'hideStrokesOnLastRepetition',
          'speakMaterial',
          'seenWords'
        ];

        if (booleanParams.includes(param)) {
          if (paramVal === "1") { newSettings[param] = true; }
          if (paramVal === "0") { newSettings[param] = false; }
        }

        const spacePlacementValidValues = [
          'spaceOff',
          'spaceBeforeOutput',
          'spaceAfterOutput',
          'spaceExact'
        ];

        if (param === 'spacePlacement' && spacePlacementValidValues.includes(paramVal)) {
          newSettings[param] = paramVal;
        }

        const sortOrderValidValues = [
          'sortOff',
          'sortNew',
          'sortOld',
          'sortRandom'
        ];

        if (param === 'sortOrder' && sortOrderValidValues.includes(paramVal)) {
          newSettings[param] = paramVal;
        }

        const studyValidValues = [
          'discover',
          'revise',
          'drill',
          'practice'
        ];

        if (param === 'study' && studyValidValues.includes(paramVal)) {
          newSettings[param] = paramVal;
        }

        const stenoLayoutValidValues = [
          'stenoLayoutAmericanSteno',
          'stenoLayoutPalantype',
          'stenoLayoutDanishSteno',
          'stenoLayoutItalianMichelaSteno',
          'stenoLayoutItalianMelaniSteno',
          'stenoLayoutKoreanModernC',
          'stenoLayoutKoreanModernS'
        ];

        if (param === 'stenoLayout' && stenoLayoutValidValues.includes(paramVal)) {
          newSettings[param] = paramVal;
        }

        if ((param === 'repetitions' || param === 'limitNumberOfWords' || param === 'startFromWord') && isNormalInteger(paramVal)) {
          newSettings[param] = paramVal;
        }
      }
    }

    this.setState({userSettings: newSettings}, () => {
      writePersonalPreferences('userSettings', this.state.userSettings);

      this.props.history.replace({
        pathname: this.props.location.pathname,
        search: ""
      });

      if (this.state.userSettings.simpleTypography) {
        newLesson.presentedMaterial = replaceSmartTypographyInPresentedMaterial.call(this, newLesson.presentedMaterial);
      }

      newLesson.presentedMaterial = filterByFamiliarity.call(this, newLesson.presentedMaterial, this.state.metWords, this.state.userSettings, this.state.revisionMode);

      if (this.state.revisionMode && this.state.userSettings.limitNumberOfWords > 0) {
        newLesson.presentedMaterial = newLesson.presentedMaterial.slice(0, this.state.userSettings.limitNumberOfWords);
      }
      else if (this.state.revisionMode) {
        // Don't do anything to limit material if it's a revision lesson without limitNumberOfWords set
        // newLesson.presentedMaterial = newLesson.presentedMaterial.slice(0);
      }
      else if (this.state.userSettings.startFromWord > 0 && this.state.userSettings.limitNumberOfWords > 0) {
        let startFrom = this.state.userSettings.startFromWord - 1;
        newLesson.presentedMaterial = newLesson.presentedMaterial.slice(startFrom, startFrom + this.state.userSettings.limitNumberOfWords);
      }
      else if (this.state.userSettings.startFromWord > 0) {
        let startFrom = this.state.userSettings.startFromWord - 1;
        newLesson.presentedMaterial = newLesson.presentedMaterial.slice(startFrom);
      }
      else if (this.state.userSettings.limitNumberOfWords > 0) {
        newLesson.presentedMaterial = newLesson.presentedMaterial.slice(0, this.state.userSettings.limitNumberOfWords);
      }

      newLesson.presentedMaterial = sortLesson.call(this, newLesson.presentedMaterial);

      let reps = this.state.userSettings.repetitions;
      let repeatedLesson = newLesson.presentedMaterial;
      if (reps > 0) {
        for (let i = 1; i < reps && i < 30; i++) {
          repeatedLesson = repeatedLesson.concat(newLesson.presentedMaterial);
        }
      }
      newLesson.presentedMaterial = repeatedLesson;
      newLesson.newPresentedMaterial = new Zipper(repeatedLesson);

      let target = targetStrokeCount(newLesson.presentedMaterial[0] || { phrase: '', stroke: 'TK-LS' });

      this.setState({
        actualText: ``,
        announcementMessage: 'Navigated to: ' + newLesson.title,
        currentPhraseAttempts: [],
        currentLessonStrokes: [],
        disableUserSettings: false,
        numberOfMatchedChars: 0,
        previousCompletedPhraseAsTyped: '',
        repetitionsRemaining: reps,
        startTime: null,
        timer: null,
        targetStrokeCount: target,
        totalNumberOfMatchedChars: 0,
        totalNumberOfMatchedWords: 0,
        totalNumberOfNewWordsMet: 0,
        totalNumberOfLowExposuresSeen: 0,
        totalNumberOfRetainedWords: 0,
        totalNumberOfMistypedWords: 0,
        totalNumberOfHintedWords: 0,
        lesson: newLesson,
        currentPhraseID: 0
      });

    });
  }

  handleLesson(path) {
    getLesson(path).then((lessonText) => {
      if (isLessonTextValid(lessonText)) {
        this.setState({lessonNotFound: false});
        let lesson = parseLesson(lessonText, path);
        this.setState({
          announcementMessage: 'Navigated to: ' + lesson.title,
          lesson: lesson,
          currentPhraseID: 0
        }, () => {
          this.setupLesson();

          if (this.mainHeading) {
            this.mainHeading.focus();
          } else {
            const element = document.getElementById('your-typed-text');
            if (element) { element.focus(); }
          }
        });
      } else {
        this.setState({lessonNotFound: true});
      }
    }).catch((e) => {
      console.log('Unable to load lesson', e)
    });
  }

  startCustomLesson() {
    let lesson = Object.assign({}, this.state.customLesson);
    lesson.title = 'Custom'
    this.setState({
      announcementMessage: 'Navigated to: Custom',
      currentPhraseID: 0,
      lesson: lesson
    }, () => {
      this.setupLesson();
    });
  }

  clearCustomLesson () {
    let customLesson = {
      sourceMaterial: [ {phrase: 'The', stroke: '-T'} ],
      presentedMaterial: [ {phrase: 'The', stroke: '-T'} ],
      settings: { ignoredChars: '' },
      title: 'Steno', subtitle: '',
      newPresentedMaterial: new Zipper([{phrase: '', stroke: ''}]),
      path: ''
    };
    let customLessonMaterial = '';
    let lesson = {
      sourceMaterial: [],
      presentedMaterial: [{phrase: 'The', stroke: '-T'}],
      settings: { ignoredChars: '' },
      title: 'Custom',
      subtitle: '',
      newPresentedMaterial: new Zipper([{phrase: 'The', stroke: '-T'}]),
      path: process.env.PUBLIC_URL + '/lessons/custom'
    }
    this.setState({
      announcementMessage: 'Navigated to: ' + lesson.title,
      customLesson: customLesson,
      customLessonMaterial: customLessonMaterial,
      lesson: lesson,
      currentPhraseID: 0
    }, () => {
      this.setupLesson();
    });
  }

  createCustomLesson(event) {
    if (event && event.target) {
      let providedText = event.target.value || '';
      let [lesson, validationState, validationMessages] = parseCustomMaterial(providedText);
      if (event.target.value.length < 1) { console.log("customLessonMaterial: " + event.target.value); }
      this.setState({
        lesson: lesson,
        currentPhraseID: 0,
        customLesson: lesson,
        customLessonMaterial: providedText,
        customLessonMaterialValidationState: validationState,
        customLessonMaterialValidationMessages: validationMessages
      }, () => {
        this.setupLesson();
      });
    }
    else { // for navigating straight to custom lesson page without setup
      // debugger;
    // TODO: is this the place where I should set a default empty custom lesson?
      let lesson = Object.assign({}, this.state.customLesson);
      lesson.title = 'Custom'
      this.setState({
        customLesson: lesson,
        lesson: lesson,
        currentPhraseID: 0
      }, () => {
        this.setupLesson();
      });
    }
    return event;
  }

  toggleHideOtherSettings() {
    let newState = !this.state.hideOtherSettings;
    this.setState({
      hideOtherSettings: newState
    });

    GoogleAnalytics.event({
      category: 'UserSettings',
      action: 'Toggle hide other settings',
      label: newState.toString()
    });
  }

  setAnnouncementMessage(app, content) {
    let newAnnouncementMessage = "";
    if (content) {
      if (typeof content === "string") {
        newAnnouncementMessage = content;
      // TODO: if we want to make this function generic for other announcement objects, here is the
      // start of a handler for that:
      } else if (typeof content === "object") {
        if (isElement(content)) {
          newAnnouncementMessage = content.querySelector('.tippy-tooltip-content').innerText;
        }
      }
      // newAnnouncementMessage = content.querySelector('.tippy-tooltip-content').innerText;
    }
    app.setState({announcementMessage: newAnnouncementMessage});

    // TODO: figure out how to re-announce things if the announcement hasn't
    // changed content but you've encountered a new instance of the same
    // content that should be announced
    // if (this.state.announcementMessage === newAnnouncementMessage) {
    //   app.setState({
    //     announcementSubsequentMessage: newAnnouncementMessage,
    //     announcementMessage: "",
    //   });
    // } else {
    //   app.setState({
    //     announcementMessage: newAnnouncementMessage,
    //     announcementSubsequentMessage: "",
    //   });
    // }
  }

  setAnnouncementMessageString(string) {
    this.setState({announcementMessage: string});
  }

  reviseLesson(event) {
    event.preventDefault();
    let currentLessonStrokes = this.state.currentLessonStrokes;
    let revisionMode = true;
    let newRevisionMaterial = [];
    for (let i = 0; i < currentLessonStrokes.length; i++) {
      if (currentLessonStrokes[i].checked === true) {
        newRevisionMaterial.push({ phrase: currentLessonStrokes[i].word, stroke: currentLessonStrokes[i].stroke });
      }
    }
    if (newRevisionMaterial.length === 0 ) {
      newRevisionMaterial.push(this.state.lesson.sourceMaterial);
      revisionMode = false;
    }
    this.setState({
      revisionMaterial: newRevisionMaterial,
      revisionMode: revisionMode
    }, () => {
      this.stopLesson();
      this.setupLesson();
    });
    this.restartLesson(event, revisionMode);
  }

  restartLesson(event, revise = false) {
    event.preventDefault();
    let revisionMode = revise;
    this.setState({
      currentPhraseID: 0,
      revisionMode: revisionMode
    }, () => {
      this.stopLesson();
      this.setupLesson();
      const element = document.getElementById('your-typed-text');
      if (element) { element.focus(); }
    });
  }

  updateMarkup(event) {
    let actualText = event.target.value;

    if (this.state.startTime === null) {
      this.setState({
        startTime: new Date(),
        timer: 0,
        disableUserSettings: true
      });
      this.startTimer();
    }

    // This informs word count, WPM, moving onto next phrase, ending lesson
    // eslint-disable-next-line
    let [matchedChars, unmatchedChars, _, unmatchedActual] =
      matchSplitText(this.state.lesson.presentedMaterial[this.state.currentPhraseID].phrase, actualText, this.state.lesson.settings, this.state.userSettings);

    matchedChars = matchedChars.replace(new RegExp(this.state.lesson.settings.ignoredChars,'g'), '');

    let [numberOfMatchedChars, numberOfUnmatchedChars] = [matchedChars, unmatchedChars].map(text => text.length);

    let currentPhraseAttempts = this.state.currentPhraseAttempts;
    currentPhraseAttempts.push(actualText);
    // console.log(this.state.currentPhraseAttempts);

    var newState = {
      currentPhraseAttempts: currentPhraseAttempts,
      numberOfMatchedChars: numberOfMatchedChars,
      totalNumberOfMatchedWords: (this.state.totalNumberOfMatchedChars + numberOfMatchedChars) / this.charsPerWord,
      totalNumberOfNewWordsMet: this.state.totalNumberOfNewWordsMet,
      totalNumberOfLowExposuresSeen: this.state.totalNumberOfLowExposuresSeen,
      totalNumberOfRetainedWords: this.state.totalNumberOfRetainedWords,
      totalNumberOfMistypedWords: this.state.totalNumberOfMistypedWords,
      totalNumberOfHintedWords: this.state.totalNumberOfHintedWords,
      actualText: actualText,
      metWords: this.state.metWords,
      userSettings: this.state.userSettings
    };

    // let testStrokeAccuracy = strokeAccuracy(this.state.currentPhraseAttempts, this.state.targetStrokeCount);
    // console.log(testStrokeAccuracy.strokeAccuracy);
    // console.log(testStrokeAccuracy.attempts);

    if (numberOfUnmatchedChars === 0) {
      let phraseMisstrokes = strokeAccuracy(this.state.currentPhraseAttempts, this.state.targetStrokeCount);
      let accurateStroke = phraseMisstrokes.strokeAccuracy; // false
      let attempts = phraseMisstrokes.attempts; // [" sign", " ss"]
      newState.currentPhraseAttempts = []; // reset for next word
      newState.currentLessonStrokes = this.state.currentLessonStrokes; // [{word: "cat", attempts: ["cut"], stroke: "KAT"}, {word: "sciences", attempts ["sign", "ss"], stroke: "SAOEUPB/EPBC/-S"]
        newState.currentLessonStrokes.push({
          word: this.state.lesson.presentedMaterial[this.state.currentPhraseID].phrase,
          attempts: attempts,
          stroke: this.state.lesson.presentedMaterial[this.state.currentPhraseID].stroke,
          checked: true,
          accuracy: accurateStroke
        });
      // can these newState assignments be moved down below the scores assignments?

      let strokeHintShown = shouldShowStroke(this.state.showStrokesInLesson, this.state.userSettings.showStrokes, this.state.repetitionsRemaining, this.state.userSettings.hideStrokesOnLastRepetition);

      if (strokeHintShown) { newState.totalNumberOfHintedWords = this.state.totalNumberOfHintedWords + 1; }

      if (!accurateStroke) { newState.totalNumberOfMistypedWords = this.state.totalNumberOfMistypedWords + 1; }

      if (!strokeHintShown && accurateStroke) {

        // for suffixes and prefixes, record material with ignored chars instead of actualText
        let lesson = this.state.lesson;
        if (lesson && lesson.settings && lesson.settings.ignoredChars && lesson.settings.ignoredChars.length > 0 ) {
          actualText = this.state.lesson.presentedMaterial[this.state.currentPhraseID].phrase;
          if (this.state.userSettings.spacePlacement === 'spaceBeforeOutput') {
            actualText = ' ' + this.state.lesson.presentedMaterial[this.state.currentPhraseID].phrase;
          } else if (this.state.userSettings.spacePlacement === 'spaceAfterOutput') {
            actualText = this.state.lesson.presentedMaterial[this.state.currentPhraseID].phrase + ' ';
          }
        }

        const meetingsCount = newState.metWords[actualText] || 0;
        Object.assign(newState, increaseMetWords.call(this, meetingsCount));
        newState.metWords[actualText] = meetingsCount + 1;
      }

      if (this.state.userSettings.speakMaterial) {
        let remaining = this.state.lesson.newPresentedMaterial.getRemaining();
        if (remaining && remaining.length > 0 && remaining[0].hasOwnProperty('phrase')) {
          this.say(remaining[0].phrase);
        }
      }

      let nextPhraseID = this.state.currentPhraseID + 1;
      let nextItem = this.state.lesson.presentedMaterial[nextPhraseID];

      if (!!nextItem && this.state.lesson.presentedMaterial && this.state.lesson.presentedMaterial[this.state.currentPhraseID] && this.state.lesson.presentedMaterial[this.state.currentPhraseID].phrase) {
        let lastWord = this.state.lesson.presentedMaterial[this.state.currentPhraseID].phrase;
        nextItem = updateCapitalisationStrokesInNextItem(nextItem, lastWord);
      }

      let target = targetStrokeCount(nextItem || { phrase: '', stroke: 'TK-LS' });
      newState.targetStrokeCount = target;
      this.state.lesson.newPresentedMaterial.visitNext();

      newState.repetitionsRemaining = repetitionsRemaining(this.state.userSettings, this.state.lesson.presentedMaterial, this.state.currentPhraseID + 1);
      newState.totalNumberOfMatchedChars = this.state.totalNumberOfMatchedChars + numberOfMatchedChars;
      newState.previousCompletedPhraseAsTyped = actualText;
      newState.actualText = '';
      newState.showStrokesInLesson = false;
      newState.currentPhraseID = nextPhraseID;

    }

    this.setState(newState, () => {
      if (this.isFinished()) {
        this.stopLesson();
      }
    });
  }

  say(utterance) {
    let synth = window.speechSynthesis;
    if (utterance === ",") { utterance = "comma"; }
    if (utterance === ":") { utterance = "colon"; }
    if (utterance === ".") { utterance = "full stop"; }
    if (utterance === ")") { utterance = "closing bracket"; }
    if (utterance === "!") { utterance = "exclamation mark"; }
    if (window.SpeechSynthesisUtterance) {
      let utterThis = new SpeechSynthesisUtterance(utterance);
      synth.speak(utterThis);
    }
  }

  sayCurrentPhraseAgain() {
    // if (this.state.userSettings.speakMaterial) {
    //   let currentPhrase = this.state.lesson.presentedMaterial[this.state.currentPhraseID];
    //   if (currentPhrase && currentPhrase.hasOwnProperty('phrase')) {
    //     this.say(currentPhrase.phrase);
    //   }
    // }
  }

  studyType(userSettings) {
    if (
      userSettings.blurMaterial === false &&
      userSettings.showStrokes === true &&
      userSettings.newWords === true &&
      userSettings.seenWords === false &&
      userSettings.retainedWords === false &&
      userSettings.repetitions === 3 &&
      userSettings.limitNumberOfWords === 15 &&
      userSettings.sortOrder === 'sortOff'
    ) { return 'discover'; }

    return 'custom';
  }

  isFinished() {
    let presentedMaterialLength = (this.state.lesson && this.state.lesson.presentedMaterial) ? this.state.lesson.presentedMaterial.length : 0;
    return (this.state.currentPhraseID === presentedMaterialLength);
  }

  presentCompletedMaterial() {
    return this.state.lesson.newPresentedMaterial ? this.state.lesson.newPresentedMaterial.getCompleted().map(item => item.phrase).join(" ") : [];
  }

  presentUpcomingMaterial() {
    return this.state.lesson.newPresentedMaterial ? this.state.lesson.newPresentedMaterial.getRemaining().slice(0,31).map(item => item.phrase).join(" ") : [];
  }

  setDictionaryIndex() {
    fetchDictionaryIndex().then((json) => {
      this.setState({ dictionaryIndex: json })
    });
  }

  render() {
    let completedMaterial = this.presentCompletedMaterial();
    let upcomingMaterial = this.presentUpcomingMaterial();
    let header = <Header
      fullscreen={this.state.fullscreen}
      restartLesson={this.restartLesson.bind(this)}
      items={this.state.lessonIndex}
      lessonSubTitle={this.state.lesson.subtitle}
      lessonTitle={this.state.lesson.title}
      nextLessonPath={this.state.nextLessonPath}
      onChange={(ev, value) => {
        this.setState({
          value: ev.target.value
        });

        let labelString = value;
        if (!value) { labelString = "BAD_INPUT"; }

        if (value && value.toString()) {
          GoogleAnalytics.event({
            category: 'Search',
            action: 'Change',
            label: labelString
          });
        } else {
          GoogleAnalytics.event({
            category: 'Search',
            action: 'Change',
            label: 'EMPTY_SEARCH_TEXT'
          });
        }
      }}
      onSelect={(value, item) => {
        this.setState({
          value: value,
          nextLessonPath: item.path
        })

        let searchSelectLabel = value;
        if (item && item.path) { searchSelectLabel = item.path; }

        GoogleAnalytics.event({
          category: 'Search',
          action: 'Select',
          label: searchSelectLabel.toString()
        });
      }}
      path={this.state.lesson.path}
      settings={this.state.lesson.settings}
      handleStopLesson={this.handleStopLesson.bind(this)}
      value={this.state.value}
    />

    let stateLesson = this.state.lesson;
    if ((Object.keys(stateLesson).length === 0 && stateLesson.constructor === Object) || !stateLesson) {
      stateLesson = {
        sourceMaterial: [ {phrase: 'The', stroke: '-T'} ],
        presentedMaterial: [ {phrase: 'The', stroke: '-T'}, ],
        settings: { ignoredChars: '' },
        title: 'Steno', subtitle: '',
        newPresentedMaterial: new Zipper([{phrase: '', stroke: ''}]),
        path: ''
      };
    }

    let presentedMaterialCurrentItem = (stateLesson.presentedMaterial && stateLesson.presentedMaterial[this.state.currentPhraseID]) ? stateLesson.presentedMaterial[this.state.currentPhraseID] : { phrase: '', stroke: '' };
    let app = this;
      return (
        <div className="app">
          <Announcements message={this.state.announcementMessage} />
          <div>
            <Switch>
              <Route exact={true} path="/" render={(props) =>
                <div>
                  {header}
                  <DocumentTitle title='Typey Type for Stenographers'>
                    <Home
                      setAnnouncementMessage={function () { app.setAnnouncementMessage(app, this) }}
                      setAnnouncementMessageString={this.setAnnouncementMessageString.bind(this)}
                      {...props}
                    />
                  </DocumentTitle>
                </div>
                }
              />
              <Route path="/support" render={ () =>
                <div>
                  {header}
                  <DocumentTitle title={'Typey Type | About'}>
                    <ErrorBoundary>
                      <Support
                        setAnnouncementMessage={function () { app.setAnnouncementMessage(app, this) }}
                        setAnnouncementMessageString={this.setAnnouncementMessageString.bind(this)}
                      />
                    </ErrorBoundary>
                  </DocumentTitle>
                </div>
                }
              />
              <Route path="/contribute" render={ () =>
                <div>
                  {header}
                  <DocumentTitle title={'Typey Type | Contribute'}>
                    <ErrorBoundary>
                      <Contribute />
                    </ErrorBoundary>
                  </DocumentTitle>
                </div>
                }
              />
              <Route path="/progress" render={ () =>
                <div>
                  {header}
                  <DocumentTitle title={'Typey Type | Progress'}>
                    <ErrorBoundary>
                      <Progress
                        setAnnouncementMessage={function () { app.setAnnouncementMessage(app, this) }}
                        setAnnouncementMessageString={this.setAnnouncementMessageString.bind(this)}
                        setPersonalPreferences={this.setPersonalPreferences.bind(this)}
                        metWords={this.state.metWords}
                        flashcardsMetWords={this.state.flashcardsMetWords}
                        flashcardsProgress={this.state.flashcardsProgress}
                        lessonsProgress={this.state.lessonsProgress}
                        lessonIndex={this.state.lessonIndex}
                      />
                    </ErrorBoundary>
                  </DocumentTitle>
                </div>
                }
              />
              <Route path="/flashcards" render={ () =>
                <div>
                  {header}
                  <DocumentTitle title={'Typey Type | Flashcards'}>
                    <Flashcards
                      locationpathname={this.props.location.pathname}
                      flashcardsMetWords={this.state.flashcardsMetWords}
                      flashcardsProgress={this.state.flashcardsProgress}
                      fullscreen={this.state.fullscreen}
                      lessonpath="flashcards"
                      updateFlashcardsMetWords={this.updateFlashcardsMetWords.bind(this)}
                      updateFlashcardsProgress={this.updateFlashcardsProgress.bind(this)}
                      changeFullscreen={this.changeFullscreen.bind(this)}
                    />
                  </DocumentTitle>
                </div>
                }
              />
              <Route path="/dictionaries" render={ (props) =>
                <div>
                  {header}
                  <DocumentTitle title={'Typey Type | Dictionaries'}>
                    <ErrorBoundary>
                      <AsyncDictionaries
                        setAnnouncementMessage={function () { app.setAnnouncementMessage(app, this) }}
                        setAnnouncementMessageString={this.setAnnouncementMessageString.bind(this)}
                        setDictionaryIndex={this.setDictionaryIndex.bind(this)}
                        dictionaryIndex={this.state.dictionaryIndex}
                        {...props}
                      />
                    </ErrorBoundary>
                  </DocumentTitle>
                </div>
                }
              />
              <Route path="/lessons" render={ (props) =>
                <div>
                  {header}
                  <DocumentTitle title={'Typey Type | Lessons'}>
                    <ErrorBoundary>
                      <Lessons
                        customLessonMaterial={this.state.customLessonMaterial}
                        customLessonMaterialValidationState={this.state.customLessonMaterialValidationState}
                        customLessonMaterialValidationMessages={this.state.customLessonMaterialValidationMessages}
                        updateFlashcardsMetWords={this.updateFlashcardsMetWords.bind(this)}
                        updateFlashcardsProgress={this.updateFlashcardsProgress.bind(this)}
                        flashcardsMetWords={this.state.flashcardsMetWords}
                        flashcardsProgress={this.state.flashcardsProgress}
                        lessonsProgress={this.state.lessonsProgress}
                        lessonNotFound={this.state.lessonNotFound}
                        fullscreen={this.state.fullscreen}
                        changeFullscreen={this.changeFullscreen.bind(this)}
                        restartLesson={this.restartLesson.bind(this)}
                        reviseLesson={this.reviseLesson.bind(this)}
                        items={this.state.lessonIndex}
                        lessonSubTitle={this.state.lesson.subtitle}
                        lessonTitle={this.state.lesson.title}
                        nextLessonPath={this.state.nextLessonPath}
                        onChange={(ev, value) => {
                        this.setState({
                        value: ev.target.value
                        })}}
                        onSelect={(value, item) => this.setState({
                        value: value,
                        nextLessonPath: item.path
                        })}
                        path={this.state.lesson.path}
                        handleStopLesson={this.handleStopLesson.bind(this)}
                        value={this.state.value}
                        lessonIndex={this.state.lessonIndex}
                        lesson={this.state.lesson}
                        handleLesson={this.handleLesson.bind(this)}
                        actualText={this.state.actualText}
                        changeShowStrokesInLesson={this.changeShowStrokesInLesson.bind(this)}
                        changeSortOrderUserSetting={this.changeSortOrderUserSetting.bind(this)}
                        changeSpacePlacementUserSetting={this.changeSpacePlacementUserSetting.bind(this)}
                        changeStenoLayout={this.changeStenoLayout.bind(this)}
                        changeShowScoresWhileTyping={this.changeShowScoresWhileTyping.bind(this)}
                        changeShowStrokesAs={this.changeShowStrokesAs.bind(this)}
                        changeUserSetting={this.changeUserSetting.bind(this)}
                        chooseStudy={this.chooseStudy.bind(this)}
                        completedPhrases={completedMaterial}
                        createCustomLesson={this.createCustomLesson.bind(this)}
                        currentLessonStrokes={this.state.currentLessonStrokes}
                        currentPhraseID={this.state.currentPhraseID}
                        currentPhrase={presentedMaterialCurrentItem.phrase}
                        currentStroke={presentedMaterialCurrentItem.stroke}
                        disableUserSettings={this.state.disableUserSettings}
                        handleLimitWordsChange={this.handleLimitWordsChange.bind(this)}
                        handleStartFromWordChange={this.handleStartFromWordChange.bind(this)}
                        handleRepetitionsChange={this.handleRepetitionsChange.bind(this)}
                        hideOtherSettings={this.state.hideOtherSettings}
                        metWords={this.state.metWords}
                        previousCompletedPhraseAsTyped={this.state.previousCompletedPhraseAsTyped}
                        repetitionsRemaining={this.state.repetitionsRemaining}
                        revisionMaterial={this.state.revisionMaterial}
                        revisionMode={this.state.revisionMode}
                        updateRevisionMaterial={this.updateRevisionMaterial.bind(this)}
                        sayCurrentPhraseAgain={this.sayCurrentPhraseAgain.bind(this)}
                        setAnnouncementMessage={function () { app.setAnnouncementMessage(app, this) }}
                        setAnnouncementMessageString={this.setAnnouncementMessageString.bind(this)}
                        stopLesson={this.stopLesson.bind(this)}
                        clearCustomLesson={this.clearCustomLesson.bind(this)}
                        startCustomLesson={this.startCustomLesson.bind(this)}
                        setupRevisionLesson={this.setupRevisionLesson.bind(this)}
                        setupLesson={this.setupLesson.bind(this)}
                        settings={this.state.lesson.settings}
                        showStrokesInLesson={this.state.showStrokesInLesson}
                        targetStrokeCount={this.state.targetStrokeCount}
                        timer={this.state.timer}
                        toggleHideOtherSettings={this.toggleHideOtherSettings.bind(this)}
                        charsPerWord={this.charsPerWord}
                        totalNumberOfMatchedWords={this.state.totalNumberOfMatchedWords}
                        totalNumberOfNewWordsMet={this.state.totalNumberOfNewWordsMet}
                        totalNumberOfLowExposuresSeen={this.state.totalNumberOfLowExposuresSeen}
                        totalNumberOfRetainedWords={this.state.totalNumberOfRetainedWords}
                        totalNumberOfMistypedWords={this.state.totalNumberOfMistypedWords}
                        totalNumberOfHintedWords={this.state.totalNumberOfHintedWords}
                        totalWordCount={stateLesson.presentedMaterial.length}
                        upcomingPhrases={upcomingMaterial}
                        updateMarkup={this.updateMarkup.bind(this)}
                        userSettings={this.state.userSettings}
                        {...props}
                      />
                    </ErrorBoundary>
                  </DocumentTitle>
                </div>
                }
              />
              <Route render={ (props) =>
                <div>
                  <DocumentTitle title={'Typey Type | Page not found'}>
                    <PageNotFound
                      setAnnouncementMessage={function () { app.setAnnouncementMessage(app, this) }}
                    />
                  </DocumentTitle>
                </div>
                }
              />
            </Switch>
          </div>
          <Footer
            fullscreen={this.state.fullscreen}
          />
        </div>
      );
  }
}

function increaseMetWords(meetingsCount) {
  let newState = {};

  if (meetingsCount === 0) {
    // console.log("meetingsCount = 0;");
    newState.totalNumberOfNewWordsMet = this.state.totalNumberOfNewWordsMet + 1;
  }
  else if (meetingsCount >= 1 && meetingsCount <= 29) {
    // console.log("meetingsCount 1–29;");
    newState.totalNumberOfLowExposuresSeen = this.state.totalNumberOfLowExposuresSeen + 1;
  }
  else if (meetingsCount >= 30) {
    // console.log("meetingsCount&gt;30;");
    newState.totalNumberOfRetainedWords = this.state.totalNumberOfRetainedWords + 1;
  }
  return newState;
}

function replaceSmartTypographyInPresentedMaterial(presentedMaterial, userSettings = this.state.userSettings) {
  if (userSettings.simpleTypography) {
    let presentedMaterialLength = presentedMaterial.length;
    for (let i = 0; i < presentedMaterialLength; i++) {

      // dashes: em dash, en dash, non-breaking hyphen, mongolian soft hyphen, double hyphen
      replaceSmartTypographyInPhraseAndStroke(presentedMaterial[i], /[—–‑᠆⹀]/g, "-", /^(EPL\/TKA\*RB|TPH-RB|PH-RB)$/, 'H-PB');

      // curly single quote
      replaceSmartTypographyInPhraseAndStroke(presentedMaterial[i], /[‘’]/g, "'", /^(TP-P|TP-L)$/, 'AE');

      // ellipsis
      replaceSmartTypographyInPhraseAndStroke(presentedMaterial[i], /[…]/g, "...", /^SKWR-RBGSZ$/, 'HR-PS');

      // grave used as left single quote
      replaceSmartTypographyInPhraseAndStroke(presentedMaterial[i], /[`]/g, "'", /^(TR\*RL|TR-RL|KH-FG|KH\*FG)$/, 'A*E');

      // curly left double quote
      replaceSmartTypographyInPhraseAndStroke(presentedMaterial[i], /[“]/g, '"', /^KW-GS$/, 'KW-GS');

      // curly right double quote
      replaceSmartTypographyInPhraseAndStroke(presentedMaterial[i], /[”]/g, '"', /^KR-GS$/, 'KR-GS');
    }
  }
  return presentedMaterial;
}

function replaceSmartTypographyInPhraseAndStroke(presentedMaterialItem, smartTypographyRegex, dumbTypographyChar, smartTypographyStrokesRegex, dumbTypographyStroke) {
  if (presentedMaterialItem.phrase.match(smartTypographyRegex)) {
    presentedMaterialItem.phrase = presentedMaterialItem.phrase.replace(smartTypographyRegex, dumbTypographyChar);
    presentedMaterialItem.stroke = presentedMaterialItem.stroke.split(' ').map(stroke => {
      return stroke.replace(smartTypographyStrokesRegex, dumbTypographyStroke);
    }).join(' ');

    // by keeping this inside this function and only after matching on unusual hyphens or dashes, we don't replace people's preferred hyphen stroke for normal hyphens
    if (presentedMaterialItem.phrase === '-' && presentedMaterialItem.stroke === 'XXX') { presentedMaterialItem.stroke = 'H-PB'; }
  }
}

function sortLesson(presentedMaterial, met = this.state.metWords, userSettings = this.state.userSettings) {
  if (userSettings.sortOrder === 'sortRandom') {
    return randomise(presentedMaterial);
  }
  else if ((userSettings.sortOrder === 'sortNew') || (userSettings.sortOrder === 'sortOld')) {

    let spaceBefore = "";
    let spaceAfter = "";
    if (userSettings && userSettings.spacePlacement && userSettings.spacePlacement === "spaceBeforeOutput" ) { spaceBefore = " "; }
    if (userSettings && userSettings.spacePlacement && userSettings.spacePlacement === "spaceAfterOutput" ) { spaceAfter = " "; }

    presentedMaterial.sort(function(a, b) {
      let seenA = met[spaceBefore + a.phrase + spaceAfter] || 0;
      let seenB = met[spaceBefore + b.phrase + spaceAfter] || 0;
      return seenB - seenA;
    });

    if (userSettings.sortOrder === 'sortNew') {
      presentedMaterial = presentedMaterial.reverse();
    }
  }
  return presentedMaterial;
}

function filterByFamiliarity(presentedMaterial, met = this.state.metWords, userSettings = this.state.userSettings, revisionMode = this.state.revisionMode) {

  if (userSettings.spacePlacement === 'spaceExact') {
    met = trimAndSumUniqMetWords(met);
  }

  if (userSettings.spacePlacement === 'spaceOff') {
    met = removeWhitespaceAndSumUniqMetWords(met);
  }

  var localRevisionMode = revisionMode,
    newWords = userSettings.newWords,
    seenWords = userSettings.seenWords,
    retainedWords = userSettings.retainedWords,
    spacePlacement = userSettings.spacePlacement;

  var testNewWords = function(phrase) {
    if (!(phrase in met)) {
      return true;
    } else {
      return (met[phrase] < 1);
    }
  }
  var testSeenWords = function(phrase) {
    if (!(phrase in met)) {
      return false;
    } else {
      return ((met[phrase] > 0) && (met[phrase] < 30));
    }
  }
  var testRetainedWords = function(phrase) {
    if (!(phrase in met)) {
      return false;
    } else {
      return (met[phrase] > 29);
    }
  }

  var tests = [];
  if (localRevisionMode) {
    tests.push(testNewWords);
    tests.push(testSeenWords);
    tests.push(testRetainedWords);
  } else {
    if (retainedWords) {
      tests.push(testRetainedWords);
    }
    if (seenWords) {
      tests.push(testSeenWords);
    }
    if (newWords) {
      tests.push(testNewWords);
    }
  }

  var filterFunction = function (phrase) {
    if (spacePlacement === 'spaceBeforeOutput') {
      phrase = ' '+phrase;
    } else if (spacePlacement === 'spaceAfterOutput') {
      phrase = phrase+' ';
    } else if (spacePlacement === 'spaceOff') {
      phrase = phrase.replace(/\s/g,'');
    }
    for (var i = 0; i < tests.length; i++) {
      if (tests[i](phrase)) {
        return true;
      };
    }
    return false;
  }

  return presentedMaterial.filter(item => filterFunction(item.phrase) );
}

function isElement(obj) {
  try {
    return obj instanceof HTMLElement;
  }
  catch(e){
    return (typeof obj==="object") &&
      (obj.nodeType===1) && (typeof obj.style === "object") &&
      (typeof obj.ownerDocument ==="object");
  }
}

function isNormalInteger(str) {
  let n = Math.floor(Number(str));
  return n !== Infinity && String(n) === str && n >= 0;
}

export default App;
export {increaseMetWords, filterByFamiliarity, sortLesson, replaceSmartTypographyInPresentedMaterial};
