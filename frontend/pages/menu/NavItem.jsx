import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Router from 'next/router';

const styles = {
  link: {
    marginRight: '10px',
    color: 'black',
    fontSize: '14px',
    padding: '5px',
  },
};

const NavItem = ({ linkUrl, linkText, onClose }) => {
  return (
    <MenuItem
      onClick={(e) => {
        e.preventDefault();
        Router.push(linkUrl);
        onClose();
      }}
    >
      <span className="site-nav-item" style={styles.link}>
        {linkText}
      </span>
    </MenuItem>
  );
};

export default NavItem;
