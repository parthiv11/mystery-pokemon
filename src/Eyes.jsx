import React from 'react';
import './Eyes.css';

function Eyes({ animation }) {
  return (
    <div className="box">
      <div className="eyeContainer">
        <div className="eyeLid">
          <div className="eyes">
            <div className={`eye ${animation}`}></div>
          </div>
        </div>
        <div className="eyeLid">
          <div className='eyes'>
            <div className={`eye right ${animation}`}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Eyes;
