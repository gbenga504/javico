import React from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Container,
  Button,
  Grid,
  Paper,
  useTheme
} from "@material-ui/core";

import NavBar from "../../components/NavBar";

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
        <Box py={30} style={{ textAlign: "center" }}>
          <Container maxWidth="md">
            <Typography
              style={{ color: "white", fontWeight: 700 }}
              variant="overline"
            >
              where experts, beginners, and every developer in between intersect
            </Typography>
            <Typography
              style={{ color: "white", fontWeight: 700 }}
              variant="h2"
            >
              Interactive surface for on-the-go code review
            </Typography>
            <Button
              size="large"
              component={Link}
              to="/code"
              color="primary"
              variant="contained"
              style={{ marginTop: 40 }}
            >
              Try out the editor
            </Button>
          </Container>
        </Box>
        <Box py={30} style={{ textAlign: "center" }}>
          <Container maxWidth="md">
            <Typography
              style={{
                color: "white",
                fontWeight: 700,
                textAlign: "left",
                marginBottom: theme.spacing(20)
              }}
              variant="h3"
            >
              Interactive surface for on-the-go code review
            </Typography>
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
        <Box py={30} style={{ textAlign: "center" }}>
          <Container maxWidth="md">
            <Grid container spacing={10}>
              <Grid item xs={12} sm={6}>
                <Paper
                  style={{
                    padding: theme.spacing(10),
                    minHeight: 460,
                    textAlign: "left",
                    color: "white",
                    backdropFilter: "blur(4px)",
                    WebkitBackdropFilter: "blur(4px)", // Fix on Mobile
                    background:
                      "linear-gradient(rgba(255,255,255,.04), rgba(255,255,255,0.04))"
                  }}
                >
                  <Typography
                    style={{
                      color: "white",
                      fontWeight: 700,
                      textAlign: "left",
                      marginBottom: theme.spacing(10)
                    }}
                    variant="h3"
                  >
                    We are on a mission
                  </Typography>
                  <Typography
                    variant="body1"
                    style={{ marginTop: theme.spacing(3) }}
                  >
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                    Necessitatibus excepturi non unde? Provident iusto
                    consequuntur praesentium animi quasi numquam tempore!
                    Explicabo, dicta ea voluptatem consequuntur temporibus
                    consectetur atque doloribus sint!
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper
                  style={{
                    padding: theme.spacing(10),
                    minHeight: 460,
                    textAlign: "left",
                    color: "white",
                    backdropFilter: "blur(4px)",
                    WebkitBackdropFilter: "blur(4px)", // Fix on Mobile
                    background:
                      "linear-gradient(rgba(255,255,255,.04), rgba(255,255,255,0.04))"
                  }}
                >
                  <Typography
                    style={{
                      color: "white",
                      fontWeight: 700,
                      textAlign: "left",
                      marginBottom: theme.spacing(10)
                    }}
                    variant="h3"
                  >
                    We are open-source
                  </Typography>
                  <Typography
                    variant="body1"
                    style={{ marginTop: theme.spacing(3) }}
                  >
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                    Necessitatibus excepturi non unde? Provident iusto
                    consequuntur praesentium animi quasi numquam tempore!
                    Explicabo, dicta ea voluptatem consequuntur temporibus
                    consectetur atque doloribus sint!
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
        <Box
          style={{
            minHeight: 360,
            color: "white",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)", // Fix on Mobile
            background:
              "linear-gradient(rgba(255,255,255,.04), rgba(255,255,255,0.04))"
          }}
        ></Box>
      </Box>
    </Box>
  );
};

export default React.memo(HomePage);
