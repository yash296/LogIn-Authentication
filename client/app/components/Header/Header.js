import React from 'react';

import { Link } from 'react-router-dom';

const Header = () => (
  <header>
  <nav className= "navbar navbar-default">
    <p>Sense8 Assignment</p>
    <Link to="/">Home</Link>


    </nav>
  </header>
);

export default Header;
