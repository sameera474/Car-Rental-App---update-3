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
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCustomTheme } from "../context/ThemeContext";
import DarkModeIcon from "@mui/icons-material/Brightness4";
import LightModeIcon from "@mui/icons-material/LightMode";
import logoDark from "../assets/logo-dark.png";
import logoLight from "../assets/logo-light.png";

const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const { isDarkMode, toggleTheme } = useCustomTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const profilePath = user?.role ? `/${user.role}/profile` : "/profile";
  const logo = isDarkMode ? logoLight : logoDark;

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    setAnchorEl(null);
    navigate("/");
  };

  const commonLinks = [
    { path: "/", text: "Home" },
    { path: "/about", text: "About Us" },
    { path: "/contact", text: "Contact Us" },
  ];

  let authLinks = [];
  if (user) {
    const prefix = `/${user.role}`;
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
  const getAvatarUrl = (avatar, id) => {
    if (!avatar) return `https://i.pravatar.cc/100?u=${id}`;
    if (avatar.startsWith("http")) return avatar;
    return `${import.meta.env.VITE_API_URL}/uploads/avatars/${avatar}`;
  };

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
    </Box>
  );

  const renderDrawerLinks = () => (
    <Box sx={{ width: 250, px: 2, pt: 2 }}>
      <List>
        {commonLinks.map((link) => (
          <ListItem
            button
            key={link.path}
            component={Link}
            to={link.path}
            onClick={handleDrawerToggle}
          >
            <ListItemText
              primary={link.text}
              primaryTypographyProps={{ color: theme.palette.text.primary }}
            />
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
                <ListItemText
                  primary={link.text}
                  primaryTypographyProps={{ color: theme.palette.text.primary }}
                />
              </ListItem>
            ))}
            <ListItem
              button
              component={Link}
              to={profilePath}
              onClick={handleDrawerToggle}
            >
              <ListItemText
                primary="My Profile"
                primaryTypographyProps={{ color: theme.palette.text.primary }}
              />
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{ color: theme.palette.text.primary }}
              />
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
              <ListItemText
                primary="Login"
                primaryTypographyProps={{ color: theme.palette.text.primary }}
              />
            </ListItem>
            <ListItem
              button
              component={Link}
              to="/register"
              onClick={handleDrawerToggle}
            >
              <ListItemText
                primary="Register"
                primaryTypographyProps={{ color: theme.palette.text.primary }}
              />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="fixed" color="primary">
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          {/* Mobile: Left [menu] center [brand] right [toggle] */}
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              alignItems: "center",
              flexGrow: 1,
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
            <Link
              to="/"
              style={{ textDecoration: "none", color: "inherit", flexGrow: 1 }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  justifyContent: "center",
                }}
              >
                <img
                  src={logo}
                  alt="Logo"
                  style={{ width: "48px", height: "48px" }}
                />
                <Typography variant="h6" noWrap>
                  SAM Car Rentals
                </Typography>
              </Box>
            </Link>
            <IconButton onClick={toggleTheme} color="inherit">
              {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Box>

          {/* Desktop layout: Brand left, nav + user + toggle right */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <img
                  src={logo}
                  alt="Logo"
                  style={{ width: "48px", height: "48px" }}
                />
                <Typography variant="h6" noWrap component="div">
                  SAM Car Rentals
                </Typography>
              </Box>
            </Link>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {renderDesktopLinks()}
              {user ? (
                <>
                  <IconButton
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                    color="inherit"
                  >
                    <Avatar
                      alt={user.name}
                      src={getAvatarUrl(user.avatar, user.id)}
                    />
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
              <IconButton onClick={toggleTheme} color="inherit">
                {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        PaperProps={{
          sx: {
            backgroundColor: theme.palette.background.default,
          },
        }}
      >
        {renderDrawerLinks()}
      </Drawer>
    </>
  );
};

export default NavBar;
