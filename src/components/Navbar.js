import React from 'react';
import { Navbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const AppNavbar = () => {
  const navigate = useNavigate();
  const authToken = localStorage.getItem("token");

  const redirectToLogin = () => navigate("/login");
  const redirectToSignup = () => navigate("/signup");
  const logoutUser = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Navbar bg="light" expand="lg" style={{ backgroundColor: '#e6f0ff' }}>
      <Container>
        {/* Brand */}
        <Navbar.Brand
          as={Link}
          to="/"
          style={{
            fontWeight: 'bold',
            fontSize: '1.6rem',
            fontFamily: 'Segoe UI, sans-serif',
            letterSpacing: '1px',
            color: '#007bff'
          }}
        >
          Nex<span style={{ color: '#000' }}>Era</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          {/* LEFT NAVIGATION - only if logged in */}
          {authToken && (
            <Nav className="me-auto" style={{ marginLeft: '60px' }}>
              <Nav.Link
                as={Link}
                to="/"
                style={{ fontFamily: 'Segoe UI, sans-serif', fontWeight: 'bold' }}
              >
                Dashboard
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/upload"
                style={{ fontFamily: 'Segoe UI, sans-serif', fontWeight: 'bold' }}
              >
                Generate Quiz
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/results"
                style={{ fontFamily: 'Segoe UI, sans-serif', fontWeight: 'bold' }}
              >
                View Responses
              </Nav.Link>
            </Nav>
          )}

          {/* RIGHT NAVIGATION */}
          <Nav className="ms-auto">
            {authToken ? (
              <Dropdown className="ms-4">
                <Dropdown.Toggle variant="outline-primary" id="user-menu">
                  Profile
                </Dropdown.Toggle>
                <Dropdown.Menu align="end">
                  <Dropdown.Item
                    as={Link}
                    to="/profile/view"
                    style={{ fontFamily: 'Segoe UI, sans-serif', fontWeight: '600' }}
                  >
                    View Profile
                  </Dropdown.Item>
                  <Dropdown.Item
                    as={Link}
                    to="/profile/edit"
                    style={{ fontFamily: 'Segoe UI, sans-serif', fontWeight: '600' }}
                  >
                    Edit Profile
                  </Dropdown.Item>
                  <Dropdown.Item
                    as={Link}
                    to="/history"
                    style={{ fontFamily: 'Segoe UI, sans-serif', fontWeight: '600' }}
                  >
                    Quiz History
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item
                    onClick={logoutUser}
                    style={{ fontFamily: 'Segoe UI, sans-serif', fontWeight: '600' }}
                  >
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <>
                <Button
                  variant="outline-primary"
                  className="me-2"
                  onClick={redirectToLogin}
                >
                  Login
                </Button>
                <Button
                  variant="outline-primary"
                  onClick={redirectToSignup}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
