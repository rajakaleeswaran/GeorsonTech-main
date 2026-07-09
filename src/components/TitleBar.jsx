import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Components.css';

function TitleBar({ title, bg }) {
  return (
    <div className="comp-titlebar">
      <div className="comp-title-img-cont">
        {bg && <img src={bg} alt={title} />}
      </div>
      <div className="comp-title-p-cont">
        <p>{title}</p>
        <div className="comp-title-breadcrumb">
          <Link to="/">Home</Link> &nbsp;/&nbsp; {title}
        </div>
      </div>
    </div>
  );
}

export default TitleBar;