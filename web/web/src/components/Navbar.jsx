// * : libraries
import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../helpers/AuthContext';
import { FaUserCircle } from 'react-icons/fa';
// * : components
// import { NavbarContainer, NavbarLogo, NavbarMenu } from './Navbar.styles';
import logoImg from '../img/logo.svg';
// * : styles
const NavbarContainer = styled.nav`
  width: 100vw;
  background-color: white;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  height: 70px;
  box-shadow: 0px -3px 3px 0px #f0f0f0 inset;
  font-family: ${(props) => props.theme.defaultFont};
  font-weight: bold;
`;
const NavbarLogo = styled.img`
  width:100px;
  height:44px;
  object-fit: fill;
  margin-bottom: 10px;
  cursor: pointer;
`;
const NavbarMenu = styled.ul`
  display: flex;
  list-style: none;
  padding-left: 0px;
`;
const MenuItem = styled(NavLink)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 10px;
  text-decoration: none;
  white-space: pre;
  color: black;
  &:hover {
    background-color: ${(props) => props.theme.mainColor};
    border-radius: 5px;
    cursor: pointer;
  }
  &.active {
    border-bottom: 2px solid ${(props) => props.theme.mainColor};
  }
  & + & {
    margin-left: 1rem;
  }
`;

function Navbar({ menus }) {
  const { authState } = useContext(AuthContext);
  const [menuMatching, setMenuMatching] = useState({
    일정생성: `../`,
    마이페이지: `myPage/${authState.username}`,
  });
  const navigate = useNavigate();

  useEffect(() => {
    setMenuMatching({
      Home: '../',
      일정생성: `../`,
      마이페이지: `myPage/${authState.username}`,
    });
  }, [authState]);

  return (
    <NavbarContainer>
      <NavbarLogo src={logoImg} onClick={()=>navigate('/')}></NavbarLogo>
      <NavbarMenu>
        {menus.map((menu) => (
          <MenuItem
            key={menu}
            className={({ isActive }) =>
              `nav-link ${isActive ? 'activated' : ''}`
            }
            // end={menu.name === 'all'}
            to={menu === 'all' ? '/' : `/${menuMatching[menu]}`}
          >
            {menu === '마이페이지' ? <FaUserCircle size="25" /> : menu}
          </MenuItem>
        ))}
      </NavbarMenu>
    </NavbarContainer>
  );
}

Navbar.propTypes = {
  menus: PropTypes.node,
};
Navbar.defaultProps = {
  menus: [],
};
export default Navbar;
