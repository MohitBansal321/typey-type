import React, { useEffect, useState } from 'react';
import LessonCanvasFooter from '../pages/lessons/LessonCanvasFooter';
import FinishedZeroAndEmptyStateMessage from '../pages/lessons/FinishedZeroAndEmptyState';
import UserSettings from './UserSettings';
import { stitchTogetherLessonData, transformLessonDataToChartData } from '../utils/transformingFinishedData';
import FinishedActionButtons from '../pages/lessons/FinishedActionButtons';
import FinishedDataViz from '../pages/lessons/FinishedDataViz';
import FinishedMisstrokesSummary from '../pages/lessons/FinishedMisstrokesSummary';
import FinishedSummaryHeadings from '../pages/lessons/FinishedSummaryHeadings';
import getNumericAccuracy from '../pages/lessons/getNumericAccuracy';
import 'react-tippy/dist/tippy.css';

// fullURL = "https://docs.google.com/forms/d/e/1FAIpQLSda64Wi5L-eVzZVo6HLJ2xnD9cu83H2-2af3WEE2atFiaoKyw/viewform?usp=pp_url&entry.1884511690=lesson&entry.1202724812&entry.936119214";
const googleFormURL = "https://docs.google.com/forms/d/e/1FAIpQLSda64Wi5L-eVzZVo6HLJ2xnD9cu83H2-2af3WEE2atFiaoKyw/viewform?usp=pp_url&entry.1884511690="
const googleFormParam = "&entry.1202724812&entry.936119214";

const calculateScores = (duration, wordCount) =>
  duration > 0
    ? Math.round(Math.max(wordCount - 1, 0) / (duration / 60 / 1000))
    : 0;

const Finished = ({
  changeShowStrokesAs,
  changeShowStrokesOnMisstroke,
  changeSortOrderUserSetting,
  changeSpacePlacementUserSetting,
  changeStenoLayout,
  changeUserSetting,
  chooseStudy,
  currentLessonStrokes,
  disableUserSettings,
  globalUserSettings,
  handleBeatsPerMinute,
  handleLimitWordsChange,
  handleRepetitionsChange,
  handleStartFromWordChange,
  handleUpcomingWordsLayout,
  hideOtherSettings,
  lessonLength,
  lessonTitle,
  location,
  metWords,
  path,
  restartLesson,
  reviseLesson,
  revisionMode,
  setAnnouncementMessage,
  settings,
  startFromWordOne,
  startTime,
  suggestedNext,
  timer,
  toggleHideOtherSettings,
  topSpeedPersonalBest,
  topSpeedToday,
  totalNumberOfHintedWords,
  totalNumberOfLowExposuresSeen,
  totalNumberOfMatchedWords,
  totalNumberOfMistypedWords,
  totalNumberOfNewWordsMet,
  totalNumberOfRetainedWords,
  totalWordCount,
  updateRevisionMaterial,
  updateTopSpeedPersonalBest,
  updateTopSpeedToday,
  userSettings,
}) => {
  const [chartData, setChartData] = useState(null);
  const [confettiConfig, setConfettiConfig] = useState(null);
  const [newTopSpeedPersonalBest, setNewTopSpeedPersonalBest] = useState(false);
  const [newTopSpeedToday, setNewTopSpeedToday] = useState(false);
  const [numericAccuracy, setNumericAccuracy] = useState(0);
  const [wpm, setWpm] = useState(0);

  // update WPM used by FinishedDataViz and headings and confetti
  useEffect(() => {
    const adjustedWPM = calculateScores(timer, totalNumberOfMatchedWords);
    setWpm(adjustedWPM);
  }, [timer, totalNumberOfMatchedWords])

  // update chart in FinishedDataViz
  useEffect(() => {
    const lessonData = stitchTogetherLessonData(currentLessonStrokes, startTime, wpm);
    setChartData(transformLessonDataToChartData(lessonData));
  }, [currentLessonStrokes, startTime, wpm])

  // update hero data in FinishedDataViz
  useEffect(() => {
    setNumericAccuracy(getNumericAccuracy(totalNumberOfMistypedWords, totalNumberOfHintedWords, currentLessonStrokes, wpm));
  }, [currentLessonStrokes, totalNumberOfHintedWords, totalNumberOfMistypedWords, wpm])

  // update top speed today or ever and headings and confetti
  useEffect(() => {
    const fasterSpeedToday = wpm > topSpeedToday;
    const fasterPersonalBest = wpm > topSpeedPersonalBest;
    const minimumStrokes = currentLessonStrokes.length > 3;
    const minimumSpeed = wpm > 3;
    const thirtyStrokesOrNotRevision = (!revisionMode || currentLessonStrokes.length >= 30);

    if (fasterSpeedToday && minimumStrokes && minimumSpeed && thirtyStrokesOrNotRevision && fasterPersonalBest) {
      setConfettiConfig({sparsity: 17, colors: 5});
      updateTopSpeedToday(wpm);
      updateTopSpeedPersonalBest(wpm);
      setNewTopSpeedPersonalBest(true);
      setNewTopSpeedToday(true);
    }
    else if (fasterSpeedToday && minimumStrokes && minimumSpeed && thirtyStrokesOrNotRevision) {
      setConfettiConfig({sparsity: 170, colors: 2});
      updateTopSpeedToday(wpm);
      setNewTopSpeedPersonalBest(false);
      setNewTopSpeedToday(true);
    }
    else {
      setNewTopSpeedPersonalBest(false);
      setNewTopSpeedToday(false);
    }

    // FIXME: updating the newTopSpeedToday too frequently causes the heading text to revert to
    // lesson title instead of "New top speed for today!"
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLessonStrokes.length, revisionMode, wpm])

  return (
    <div>
      <div id="lesson-page" className="flex-wrap-md flex mx-auto mw-1920">
        <div id="main-lesson-area" className="flex-grow mx-auto mw-1440 min-w-0">
          <div className="mx-auto mw-1920">
            {settings?.customMessage && <h3 className='px3 pb0 mb0'>{settings.customMessage}</h3>}
          </div>
          <div className="mx-auto mw-1920 p3">
            <div className="lesson-canvas lesson-canvas--finished panel p3 mb3">
              {(lessonLength === 0) ?
                <FinishedZeroAndEmptyStateMessage startFromWordSetting={userSettings.startFromWord} startFromWordOneClickHandler={startFromWordOne} suggestedNextUrl={suggestedNext} />
                :
                <div className="w-100">
                  <div className="finished-lesson mx-auto mw-1440">
                    <div className="finished-summary mb3 text-center">
                      <FinishedSummaryHeadings
                        confettiConfig={confettiConfig}
                        lessonTitle={lessonTitle}
                        newTopSpeedPersonalBest={newTopSpeedPersonalBest}
                        newTopSpeedToday={newTopSpeedToday}
                        wpm={wpm}
                      />
                      <FinishedDataViz
                        wpm={wpm}
                        numericAccuracy={numericAccuracy}
                        chartData={chartData}
                        totalNumberOfNewWordsMet={totalNumberOfNewWordsMet}
                        totalNumberOfLowExposuresSeen={totalNumberOfLowExposuresSeen}
                        totalNumberOfRetainedWords={totalNumberOfRetainedWords}
                        totalNumberOfHintedWords={totalNumberOfHintedWords}
                        totalNumberOfMistypedWords={totalNumberOfMistypedWords}
                        wordsTyped={currentLessonStrokes?.length || 0}
                        setAnnouncementMessage={setAnnouncementMessage}
                      />
                      <FinishedActionButtons
                        restartPath={process.env.PUBLIC_URL + path}
                        restartLesson={restartLesson}
                        suggestedNextUrl={suggestedNext}
                      />
                    </div>
                    <FinishedMisstrokesSummary
                      currentLessonStrokes={currentLessonStrokes}
                      globalUserSettings={globalUserSettings}
                      metWords={metWords}
                      path={path}
                      reviseLesson={reviseLesson}
                      showMisstrokesSummary={currentLessonStrokes.length > 0}
                      updateRevisionMaterial={updateRevisionMaterial}
                      userSettings={userSettings}
                    />
                  </div>
                </div>
              }
            </div>
            <LessonCanvasFooter
              chooseStudy={chooseStudy}
              disableUserSettings={disableUserSettings}
              hideOtherSettings={hideOtherSettings}
              path={path}
              setAnnouncementMessage={setAnnouncementMessage}
              toggleHideOtherSettings={toggleHideOtherSettings}
              totalWordCount={totalWordCount}
              userSettings={userSettings}
            />
          </div>
          <p className="text-center"><a href={googleFormURL + encodeURIComponent(location?.pathname || '') + googleFormParam} className="text-small mt0" target="_blank" rel="noopener noreferrer" id="ga--lesson--give-feedback">Give feedback on this lesson (form opens in a new tab)</a></p>
        </div>
        <div>
          <UserSettings
            changeUserSetting={changeUserSetting}
            changeSortOrderUserSetting={changeSortOrderUserSetting}
            changeSpacePlacementUserSetting={changeSpacePlacementUserSetting}
            changeShowStrokesAs={changeShowStrokesAs}
            changeShowStrokesOnMisstroke={changeShowStrokesOnMisstroke}
            changeStenoLayout={changeStenoLayout}
            chooseStudy={chooseStudy}
            disableUserSettings={disableUserSettings}
            handleBeatsPerMinute={handleBeatsPerMinute}
            handleLimitWordsChange={handleLimitWordsChange}
            handleStartFromWordChange={handleStartFromWordChange}
            handleRepetitionsChange={handleRepetitionsChange}
            handleUpcomingWordsLayout={handleUpcomingWordsLayout}
            hideOtherSettings={hideOtherSettings}
            maxStartFromWord={lessonLength}
            path={path}
            revisionMode={revisionMode}
            setAnnouncementMessage={setAnnouncementMessage}
            toggleHideOtherSettings={toggleHideOtherSettings}
            totalWordCount={totalWordCount}
            userSettings={userSettings}
          />
        </div>
      </div>
    </div>
  );
}

export default Finished;
