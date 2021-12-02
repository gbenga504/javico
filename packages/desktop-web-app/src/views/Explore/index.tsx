import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  useTheme,
  Avatar
} from "@material-ui/core";
import { withNotificationBanner } from "@javico/common/lib/components";
import { Apis } from "@javico/common/lib/utils";
import {
  IBannerStyle,
  IDuration
} from "@javico/common/lib/components/NotificationBanner";

import NavBar from "../../components/NavBar";
import { getCurrentUserState } from "../../redux/auth/reducers";
import { ISourceCodeMetaData } from "../../utils/Constants";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    background: "transparent"
  }
});

interface IProps {
  onSetNotificationSettings: (
    text: string,
    style?: IBannerStyle,
    duration?: IDuration
  ) => null;
}

const TESTIMONIALS: any = [
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
  },
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

const HomePage: React.FC<IProps> = ({ onSetNotificationSettings }) => {
  const theme = useTheme();
  const currentUser = useSelector(getCurrentUserState);

  console.log("gjhgskjhgkshjgkshgsk ", currentUser);

  const [
    isFetchingSourceCodeMetaData,
    setIsFetchingSourceCodeMetaData
  ] = useState<boolean>(false);
  const [
    sourceCodeMetaData,
    setSourceCodeMetaData
  ] = useState<null | ISourceCodeMetaData>(null);

  useEffect(() => {
    // fetchSourceCodeMetaData();
    // eslint-disable-next-line
  }, [currentUser?.username]);

  function fetchSourceCodeMetaData(): void {
    if (!currentUser) return;
    setIsFetchingSourceCodeMetaData(true);
    // Apis.sourceCodes
    //     .fetchSourceCodes({
    //         params: { ownerId: currentUser.uid }
    //     })
    //     .then(res => {
    //         const { sourceCode, readme, ownerId, title } = res.data();
    //         setIsFetchingSourceCodeMetaData(false);
    //         setSourceCodeMetaData({
    //             sourceCode,
    //             readme,
    //             ownerId,
    //             title,
    //             sourceCodeId: res.id
    //         });
    //     })
    //     .catch((error: any) => {
    //         setIsFetchingSourceCodeMetaData(false);
    //         onSetNotificationSettings(error.message, "danger", "long");
    //     });
  }

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
              <Typography
                style={{ fontWeight: 700, textAlign: "left" }}
                variant="h4"
              >
                Explore
              </Typography>
            </Box>
          </Container>
        </Box>
        <Box pb={30}>
          <Container maxWidth="md">
            <Grid container spacing={10}>
              {TESTIMONIALS.map(({ name, content }: any, index: any) => (
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
                  <Box
                    pt={3}
                    display="flex"
                    alignItems="center"
                    style={{ color: "white" }}
                  >
                    <Avatar
                      style={{ height: 30, width: 30 }}
                      src={currentUser?.photoURL}
                    />
                    <Box
                      ml={3}
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      style={{ flex: 1 }}
                    >
                      <Box>
                        <Typography
                          style={{ marginBottom: -5 }}
                          variant="body2"
                        >
                          {currentUser?.username}
                        </Typography>
                        <Typography variant="caption" style={{ color: "#bbb" }}>
                          18 hours ago
                        </Typography>
                      </Box>
                      <Typography color="primary" variant="body2">
                        12 comments
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default React.memo(withNotificationBanner(HomePage));
