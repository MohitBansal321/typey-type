import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

class Footer extends Component {
  render() {
    return (
      <footer role="contentinfo">
        <p className="text-center mt1 mb0"><small>Made with <span aria-label="love" role="img">❤️</span> by <a href="https://twitter.com/didoesdigital">@DiDoesDigital</a>.</small></p>
        <p className="text-center mb0"><small><Link to="/support">Learn more about Typey&nbsp;type</Link>.</small></p>
        <p className="text-center mb0"><small><Link to="/contribute">Contribute to Typey&nbsp;type</Link>.</small></p>
        <p className="text-center mb1"><small><a href="https://didoesdigital.com/#newsletter" target="_blank" rel="noopener noreferrer">Sign up to steno news<span className="external-link" aria-label=" (External link)" title="(External link)"></span></a>.</small></p>
      </footer>
    )
  }
}

export default Footer;
