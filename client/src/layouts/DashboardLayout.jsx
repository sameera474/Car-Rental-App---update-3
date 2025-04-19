import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Container,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DashboardLayout = ({ children }) => {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <Container
        sx={{ display: "flex", minHeight: "80vh", paddingTop: "20px" }}
      >
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Paper sx={{ padding: 2 }}>
              <List>
                <ListItem component={Link} to="/dashboard" button>
                  <ListItemText primary="Dashboard" />
                </ListItem>
                <ListItem component={Link} to="/profile" button>
                  <ListItemText primary="Profile" />
                </ListItem>
                {user?.role === "manager" && (
                  <>
                    <ListItem component={Link} to="/manager/cars" button>
                      <ListItemText primary="Manage Cars" />
                    </ListItem>
                    <ListItem component={Link} to="/manager/rentals" button>
                      <ListItemText primary="Approve Rentals" />
                    </ListItem>
                  </>
                )}
                {user?.role === "boss" && (
                  <>
                    <ListItem component={Link} to="/boss/managers" button>
                      <ListItemText primary="Manage Managers" />
                    </ListItem>
                    <ListItem component={Link} to="/boss/revenue" button>
                      <ListItemText primary="Financial Report" />
                    </ListItem>
                  </>
                )}
                {user?.role === "admin" && (
                  <>
                    <ListItem component={Link} to="/admin/bosses" button>
                      <ListItemText primary="Manage Bosses" />
                    </ListItem>
                    <ListItem component={Link} to="/admin/reset" button>
                      <ListItemText primary="Reset System" />
                    </ListItem>
                  </>
                )}
              </List>
            </Paper>
          </Grid>
          <Grid item xs={9}>
            {children}
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
};

export default DashboardLayout;
