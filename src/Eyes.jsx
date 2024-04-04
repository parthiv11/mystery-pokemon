import React from 'react';
import './Eyes.css';

class Eyes extends React.Component {
  render() {
    return (
      <div className="box">
        <div className="eyeContainer">
          <div className="eyeLid">
            <div className="eyes">
              <div className="eye"></div>
            </div>
          </div>
          <div className="eyeLid">
            <div className="eyes">
              <div className="eye right"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Eyes;
