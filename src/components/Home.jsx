import React from 'react';
import { Outlet } from 'react-router-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { FaTrain } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <Navbar bg="dark" expand="lg" sticky="top" className="navbar-custom">
        <Container fluid className="navbar-inner">
          <Navbar.Brand href="/" className="navbar-brand-custom">
            <span className="violations-title">Violations</span>
          </Navbar.Brand>
          <div className="navbar-train-icon">
            <FaTrain size={32} />
          </div>
        </Container>
      </Navbar>

      <Container fluid className="main-content">
        <Outlet />
      </Container>
    </div>
  );
};

export default Home;
