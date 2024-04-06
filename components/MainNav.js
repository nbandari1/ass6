import { Container, Nav, Navbar, Form, Button, NavDropdown } from "react-bootstrap";
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useAtom } from "jotai";
import { searchHistoryAtom } from "../store";
import { addToHistory } from "../lib/userData";
import { readToken, removeToken } from '../lib/';

export default function MainNav() {
  const router = useRouter();
  const token = readToken();

  function logout() {
    setIsExpanded(false);
    removeToken();
    router.push('/login');
  }

  const [searchField, setSearchField] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

  async function submitForm(e) {
    e.preventDefault();
    if (searchField !== "") {
      const queryString = `title=true&q=${searchField}`;
      setSearchHistory(current => [...current, queryString]);
      await addToHistory(queryString);
      router.push(`/artwork?${queryString}`);
      setSearchField("");
      setIsExpanded(false);
    }
  }

  return (
    <>
      <Navbar expand="lg" className="fixed-top navbar-dark bg-primary" expanded={isExpanded}>
        <Container>
          <Navbar.Brand>Nishnath Bandari</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setIsExpanded(!isExpanded)} />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Link href="/" passHref><Nav.Link active={router.pathname === "/"} onClick={() => setIsExpanded(false)}>Home</Nav.Link></Link>
              {token && <Link href="/search" passHref><Nav.Link active={router.pathname === "/search"} onClick={() => setIsExpanded(false)}>Advanced Search</Nav.Link></Link>}
            </Nav>
            {token && (
              <>
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
                  <NavDropdown title={token.userName} id="basic-nav-dropdown">
                    <Link href="/favourites" passHref><NavDropdown.Item active={router.pathname === "/favourites"}>Favourites</NavDropdown.Item></Link>
                    <Link href="/history" passHref><NavDropdown.Item active={router.pathname === "/history"}>Search History</NavDropdown.Item></Link>
                    <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                  </NavDropdown>
                </Nav>
              </>
            )}
            {!token && (
              <Nav className="ml-auto">
                <Link href="/register" passHref><Nav.Link active={router.pathname === "/register"} onClick={() => setIsExpanded(false)}>Register</Nav.Link></Link>
                <Link href="/login" passHref><Nav.Link active={router.pathname === "/login"} onClick={() => setIsExpanded(false)}>Login</Nav.Link></Link>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <br /><br /><br />
    </>
  );
}
