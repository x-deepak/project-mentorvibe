import React from 'react';
import { Link } from 'react-router-dom';
import { List, ListItem, ListItemText } from '@mui/material';

const Sidebar = () => {
  return (
    <nav className="sidebar">
      <List>
        <ListItem button component={Link} to="/">
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/messages">
          <ListItemText primary="Messages" />
        </ListItem>
        <ListItem button component={Link} to="/profile">
          <ListItemText primary="My Profile" />
        </ListItem>
      </List>
    </nav>
  );
};

export default Sidebar;