import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Typography,
  Container,
  Avatar,
  Grid,
  Paper,
  useTheme,
  Tabs,
  Tab,
  Divider
} from "@material-ui/core";

import NavBar from "../../components/NavBar";
import { getCurrentUserState } from "../../redux/auth/reducers";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    background: "transparent"
  }
});

const TESTIMONIALS = [
  {
    name: "Jenny Wilson",
    rating: 5,
    dateCreate: "April 19, 2021",
    content: `Excellent Work! Thanks a lot!`
  },
  {
    name: "Cody Fisher",
    rating: 5,
    dateCreate: "April 19, 2021",
    content: `It's a very good dashboard and we are really liking the product . We've done some things, like migrate to TS and implementing a react useContext api, to fit our job methodology but the product is one of the best in terms of design and application architecture.`
  },
  {
    name: "Marvin McKinney",
    rating: 5,
    dateCreate: "April 19, 2021",
    content: `Customer support is realy fast and helpful the desgin of this theme is looks amazing also the code is very clean and readble realy good job !`
  },
  {
    name: "Darrell Steward",
    rating: 5,
    dateCreate: "April 19, 2021",
    content: `Amazing, really good code quality and gives you a lot of examples for implementations.`
  },
  {
    name: "Jacob Jones",
    rating: 5,
    dateCreate: "April 19, 2021",
    content: `Got a few questions after purchasing the product. The owner responded very fast and very helpfull. Overall the code is excellent and works very good. 5/5 stars!`
  },
  {
    name: "Bessie Cooper",
    rating: 5,
    dateCreate: "April 19, 2021",
    content: `CEO of Codealy.io here. We’ve built a developer assessment platform that makes sense - tasks are based on git repositories and run in virtual machines. We automate the pain points - storing candidates code. Thanks!`
  }
];

const HomePage: React.FC = () => {
  const theme = useTheme();
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: any, newValue: number) => {
    setValue(newValue);
  };

  const currentUser = useSelector(getCurrentUserState);

  return (
    <Box bgcolor="black" style={{ overflow: "scroll" }}>
      <Box
        style={{
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)", // Fix on Mobile
          background:
            "linear-gradient(rgba(255,255,255,.04), rgba(255,255,255,0.04))"
        }}
      >
        <NavBar />
        <Box pt={20} pb={10}>
          <Container maxWidth="md">
            <Box display="flex" alignItems="center" style={{ color: "white" }}>
              <Avatar
                style={{ height: 100, width: 100 }}
                src={currentUser?.photoURL}
              />
              <Box ml={5}>
                <Typography
                  style={{ fontWeight: 700, textAlign: "left" }}
                  variant="h4"
                >
                  {currentUser?.username}
                </Typography>
                <Box display="flex" alignItems="center">
                  <Typography variant="body1" style={{ marginRight: 24 }}>
                    5 codes
                  </Typography>
                  <Typography variant="body1" style={{ marginRight: 24 }}>
                    0 follower
                  </Typography>
                  <Typography variant="body1">0 following</Typography>
                </Box>
              </Box>
            </Box>
          </Container>
        </Box>
        <Container maxWidth="md">
          <Paper className={classes.root}>
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Tab
                style={{ fontSize: 14, textTransform: "none" }}
                label="Codes"
              />
              <Tab
                style={{ fontSize: 14, textTransform: "none" }}
                label="Saved"
              />
              <Tab
                style={{ fontSize: 14, textTransform: "none" }}
                label="Tagged"
              />
            </Tabs>
            <Divider
              style={{ backgroundColor: "#333", height: 0.5, zIndex: -3 }}
            />
          </Paper>
        </Container>
        <Box pt={20} pb={30} style={{ textAlign: "center" }}>
          <Container maxWidth="md">
            <Grid container spacing={10}>
              {TESTIMONIALS.map(({ name, content }, index) => (
                <Grid item key={index} xs={12} sm={6} md={4}>
                  <Paper
                    style={{
                      padding: theme.spacing(10),
                      minHeight: 360,
                      textAlign: "left",
                      color: "white",
                      backdropFilter: "blur(4px)",
                      WebkitBackdropFilter: "blur(4px)", // Fix on Mobile
                      background:
                        "linear-gradient(rgba(255,255,255,.04), rgba(255,255,255,0.04))"
                    }}
                  >
                    <Typography
                      style={{ fontWeight: 700 }}
                      variant="h6"
                      gutterBottom
                    >
                      {name}
                    </Typography>
                    <Typography
                      variant="body1"
                      style={{ marginTop: theme.spacing(3) }}
                    >
                      {content}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default React.memo(HomePage);
