import React, { FunctionComponent } from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';

const version = `${process.env.REACT_APP_VERSION}`;
const homepage = `${process.env.REACT_APP_HOMEPAGE}`;

const PREDEFINED = [
  {
    text: 'Basic sample',
    url: 'sample1.yml'
  },
  {
    text: 'Cross product sample',
    url: 'cross.yml'
  },
  {
    text: '3 Bodies',
    url: 'bodies3.yml'
  },
  {
    text: 'Solaris (Earth - Sun)',
    url: 'solaris.yml'
  },
  {
    text: 'Selene (Moon -Earth)',
    url: 'selene.yml'
  }
];

/**
 * renders the navigation bar
 */
export const LbNavBar: FunctionComponent<Readonly<{
  onReset?: () => void;
  onLoad?: (arg: string) => void;
  onImport?: () => void;
  onExport?: () => void;
}>> = ({ onReset, onLoad, onImport, onExport }) => {
  return (
    <Navbar variant="dark" bg="dark" expand="lg" >
      <Navbar.Brand href="http://www.mmarini.org">www.mmarini.org</Navbar.Brand>
      <Navbar.Toggle aria-controls="navbar-nav" />
      <Navbar.Collapse id="navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href={`/${homepage}`}>Leibniz {version}</Nav.Link>
          <NavDropdown id="predefined-menu" title="Predefined">
            <NavDropdown.Item
              onClick={() => { if (onReset) { onReset(); } }}>
              Reset
            </NavDropdown.Item>
            {PREDEFINED.map(({ text, url }) => (
              <NavDropdown.Item
                onClick={() => { if (onLoad) { onLoad(url); } }}>
                {text}
              </NavDropdown.Item>
            ))}
          </NavDropdown>
          <Nav.Link
            onClick={() => { if (onImport) { onImport(); } }}>
            Import
          </Nav.Link>
          <Nav.Link
            onClick={() => { if (onExport) { onExport(); } }}>
            Export
          </Nav.Link>
          <Nav.Link href="https://github.com/m-marini/leibniz/wiki/Expression-syntax" target="leibniz-help">
            Help
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
