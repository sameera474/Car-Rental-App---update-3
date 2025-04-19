// File: client/src/components/NavBar.jsx
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  // Compute the profile path based on user role.
  const profilePath = user && user.role ? `/${user.role}/profile` : "/profile";

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    setAnchorEl(null);
    navigate("/");
  };

  // General links available to all visitors.
  const commonLinks = [
    { path: "/", text: "Home" },
    { path: "/about", text: "About Us" },
    { path: "/contact", text: "Contact Us" },
  ];

  // Authenticated user links (role-specific).
  let authLinks = [];
  if (user) {
    const prefix = `/${user.role}`;
    // You can adjust these links as needed for each role.
    // For example, you may wish to have different links for 'user', 'manager', etc.
    if (user.role === "user") {
      authLinks = [
        { path: `${prefix}/dashboard`, text: "Dashboard" },
        { path: `${prefix}/cars`, text: "Available Cars" },
        { path: `${prefix}/myrentals`, text: "My Rentals" },
      ];
    } else if (user.role === "manager") {
      authLinks = [
        { path: `${prefix}/dashboard`, text: "Dashboard" },
        { path: `${prefix}/manage-cars`, text: "Manage Cars" },
        { path: `${prefix}/rental-requests`, text: "Rental Requests" },
        { path: `${prefix}/returned-cars`, text: "Returned Cars" },
        { path: `${prefix}/manage-users`, text: "Manage Users" },
      ];
    } else if (user.role === "boss") {
      authLinks = [
        { path: `${prefix}/dashboard`, text: "Dashboard" },
        { path: `${prefix}/manage-managers`, text: "Manage Managers" },
        { path: `${prefix}/financial-report`, text: "Financial Report" },
      ];
    } else if (user.role === "admin") {
      authLinks = [
        { path: `${prefix}/dashboard`, text: "Dashboard" },
        { path: `${prefix}/manage-bosses`, text: "Manage Bosses" },
        { path: `${prefix}/reset-system`, text: "Reset System" },
      ];
    }
  }

  // Desktop links: visible on md and up.
  const renderDesktopLinks = () => (
    <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}>
      {commonLinks.map((link) => (
        <Button key={link.path} color="inherit" component={Link} to={link.path}>
          {link.text}
        </Button>
      ))}
      {user &&
        authLinks.map((link) => (
          <Button
            key={link.path}
            color="inherit"
            component={Link}
            to={link.path}
          >
            {link.text}
          </Button>
        ))}
      {user ? (
        <>
          <IconButton
            onClick={(e) => setAnchorEl(e.currentTarget)}
            color="inherit"
          >
            {user.avatar ? (
              <Avatar alt={user.name} src={user.avatar} />
            ) : (
              <Avatar sx={{ bgcolor: "secondary.main" }}>
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </Avatar>
            )}
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem
              component={Link}
              to={profilePath}
              onClick={() => setAnchorEl(null)}
            >
              My Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </>
      ) : (
        <>
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
          <Button color="inherit" component={Link} to="/register">
            Register
          </Button>
        </>
      )}
    </Box>
  );

  // Mobile Drawer: visible on xs screens.
  const renderDrawerLinks = () => (
    <Box sx={{ width: 250 }}>
      <List>
        {commonLinks.map((link) => (
          <ListItem
            button
            key={link.path}
            component={Link}
            to={link.path}
            onClick={handleDrawerToggle}
          >
            <ListItemText primary={link.text} />
          </ListItem>
        ))}
        {user && (
          <>
            {authLinks.map((link) => (
              <ListItem
                button
                key={link.path}
                component={Link}
                to={link.path}
                onClick={handleDrawerToggle}
              >
                <ListItemText primary={link.text} />
              </ListItem>
            ))}
            <ListItem
              button
              component={Link}
              to={profilePath}
              onClick={handleDrawerToggle}
            >
              <ListItemText primary="My Profile" />
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        )}
        {!user && (
          <>
            <ListItem
              button
              component={Link}
              to="/login"
              onClick={handleDrawerToggle}
            >
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem
              button
              component={Link}
              to="/register"
              onClick={handleDrawerToggle}
            >
              <ListItemText primary="Register" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleDrawerToggle}
            sx={{ display: { xs: "block", md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Car Rental App
          </Typography>
          {renderDesktopLinks()}
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Improves performance on mobile.
        }}
      >
        {renderDrawerLinks()}
      </Drawer>
    </>
  );
};

export default NavBar;
