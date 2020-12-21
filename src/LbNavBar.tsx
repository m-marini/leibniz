import React, { FunctionComponent } from 'react';
import './App.css';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';

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
      <Navbar.Brand>
        <a href="#brand">Leibniz</a>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="navbar-nav" />
      <Navbar.Collapse id="navbar-nav">
        <Nav className="mr-auto" >
          <NavDropdown id="predefined-menu" title="Predefined">
            <NavDropdown.Item
              onSelect={() => { if (onReset) { onReset(); } }}>
              Reset
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
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
