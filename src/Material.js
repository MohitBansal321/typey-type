import React, { Component } from 'react';
import {matchSplitText} from './typey-type';
import './App.css';

class Material extends Component {
  render() {
    const [matched, unmatched] = matchSplitText(this.props.currentPhrase, this.props.actualText, this.props.settings, this.props.userSettings);
    return (
      <div className="mb1">
        <div className="visually-hidden">Material to type:
          <div role="status" aria-live="assertive">
            <div className="material"><pre><span className="steno-material">{matched + unmatched}</span></pre></div>
          </div>
        </div>
        <div className="expected">
          <div className="material"><pre><span className="matched steno-material">{matched}</span><span className="steno-material">{unmatched}</span></pre></div>
        </div>
      </div>
    );
  }
}

export default Material;
