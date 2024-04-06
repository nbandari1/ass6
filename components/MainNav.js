import { Container, Nav, Navbar, Form, Button, NavDropdown } from "react-bootstrap";
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { readToken, removeToken } from '../lib/authenticate';

export default function MainNav() {
  const router = useRouter();
  const token = readToken();

  function logout() {
    removeToken();
    router.push('/login');
  }

  const [searchField, setSearchField] = useState("");

  async function submitForm(e) {
    e.preventDefault();
    if (searchField.trim() !== "") {
      const queryString = `title=true&q=${searchField.trim()}`;
      router.push(`/artwork?${queryString}`);
      setSearchField("");
    }
  }

  return (
    <Navbar expand="lg" className="fixed-top navbar-dark bg-primary">
      <Container>
        <Navbar.Brand>Nishnath Bandari</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link href="/" passHref><Nav.Link active={router.pathname === "/"}>Home</Nav.Link></Link>
            {token && <Link href="/search" passHref><Nav.Link active={router.pathname === "/search"}>Advanced Search</Nav.Link></Link>}
          </Nav>
          <Form className="d-flex" onSubmit={submitForm}>
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
            />
            <Button type="submit" variant="success">Search</Button>
          </Form>
          <Nav>
            {token ? (
              <NavDropdown title={token.userName} id="basic-nav-dropdown">
                <Link href="/favourites" passHref><NavDropdown.Item active={router.pathname === "/favourites"}>Favourites</NavDropdown.Item></Link>
                <Link href="/history" passHref><NavDropdown.Item active={router.pathname === "/history"}>Search History</NavDropdown.Item></Link>
                <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav>
                <Link href="/register" passHref><Nav.Link active={router.pathname === "/register"}>Register</Nav.Link></Link>
                <Link href="/login" passHref><Nav.Link active={router.pathname === "/login"}>Login</Nav.Link></Link>
              </Nav>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
