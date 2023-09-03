import React, { FunctionComponent } from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';

const version = `${process.env.REACT_APP_VERSION}`;
const homepage = `${process.env.REACT_APP_HOMEPAGE}`;

/**
 * 
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
              onSelect={() => { if (onReset) { onReset(); } }}>
              Reset
              </NavDropdown.Item>
            <NavDropdown.Item
              onSelect={() => { if (onLoad) { onLoad('sample1.json'); } }}>
              Basic sample
            </NavDropdown.Item>
            <NavDropdown.Item
              onSelect={() => { if (onLoad) { onLoad('bodies3.json'); } }}>
              3 Bodies
            </NavDropdown.Item>
            <NavDropdown.Item
              onSelect={() => { if (onLoad) { onLoad('solaris.json'); } }}>
              Solaris (Earth - Sun)
            </NavDropdown.Item>
            <NavDropdown.Item
              onSelect={() => { if (onLoad) { onLoad('selene.json'); } }}>
              Selene (Moon -Earth)
              </NavDropdown.Item>
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
