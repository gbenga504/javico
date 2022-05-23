import React, { useEffect, useState } from "react";
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
  Divider,
  CircularProgress
} from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import { withNotificationBanner } from "@javico/common/lib/components";
import { Apis } from "@javico/common/lib/utils";
import {
  IBannerStyle,
  IDuration
} from "@javico/common/lib/components/NotificationBanner";

import NavBar from "../../components/NavBar";
import { getCurrentUserState } from "../../redux/auth/reducers";
import { ISourceCodeMetaData } from "../../utils/Constants";
import CodeCard from "../../components/CodeCard";

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

const HomePage: React.FC<IProps> = ({ onSetNotificationSettings }) => {
  const theme = useTheme();
  const classes = useStyles();
  const [currentTab, setCurrentTab] = useState(0);
  const [isLoadingUserSourceCodes, setIsLoadingUserSourceCodes] = useState<
    boolean
  >(false);
  const currentUser = useSelector(getCurrentUserState);
  const [
    isFetchingSourceCodeMetaData,
    setIsFetchingSourceCodeMetaData
  ] = useState<boolean>(false);
  const [userSourceCodes, setUserSourceCodes] = useState<
    Array<ISourceCodeMetaData>
  >([]);
  const [lastVisibleSourceCode, setLastVisibleSourceCode] = useState<any>(null);

  useEffect(() => {
    if (
      userSourceCodes.length === 0 &&
      isLoadingUserSourceCodes === false &&
      !!currentUser?.username
    ) {
      setIsLoadingUserSourceCodes(true);
      Apis.sourceCodes.initialUserSourceCodesFetch(
        { params: { ownerId: currentUser.uid } },
        function(querySnapshot: any) {
          const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
          let sourceCodes: Array<any> = [];
          querySnapshot.docs.forEach((el: any, index: number) => {
            console.log("hgdhkjgkdjhgkdhjgdkhgd querySnapshot ", el);
            sourceCodes.push({
              ...el.data(),
              id: el.id
            });
          });
          setIsLoadingUserSourceCodes(false);
          setUserSourceCodes(sourceCodes);
          setLastVisibleSourceCode(lastVisible);
        },
        function(error: any) {
          onSetNotificationSettings(error.message, "danger", "long");
        }
      );
    }
  }, [currentUser?.username]);

  // console.log("dhghkdgkhdhdgdhgdhjdkjh currentUser ", userSourceCodes[0]);

  function fetchSourceCodeMetaData(): void {
    if (!currentUser) return;
    setIsFetchingSourceCodeMetaData(true);
    Apis.sourceCodes
      .fetchUserSourceCodes({
        params: {
          ownerId: currentUser.uid,
          after: lastVisibleSourceCode,
          limit: 12
        }
      })
      .then((res: any) => {
        // const { sourceCode, readme, ownerId, title } = res.data();
        setIsFetchingSourceCodeMetaData(false);
        console.log("gjhgskjhgkshjgkshgsk ", res);
        // setSourceCodeMetaData({
        //     sourceCode,
        //     readme,
        //     ownerId,
        //     title,
        //     sourceCodeId: res.id
        // });
      })
      .catch((error: any) => {
        setIsFetchingSourceCodeMetaData(false);
        onSetNotificationSettings(error.message, "danger", "long");
      });
  }

  const handleChange = (event: any, newCurrentTab: number) => {
    setCurrentTab(newCurrentTab);
  };

  const userProfileInformation = (
    <Box display="flex" alignItems="center" style={{ color: "white" }}>
      <Avatar style={{ height: 100, width: 100 }} src={currentUser?.photoURL} />
      <Box ml={5}>
        <Typography style={{ fontWeight: 700, textAlign: "left" }} variant="h4">
          @{currentUser?.username}
          <Typography
            style={{ textAlign: "left", color: "#ccc", marginLeft: 8 }}
            variant="caption"
          >
            ({currentUser?.displayName})
          </Typography>
        </Typography>

        <Typography variant="body1">{currentUser?.bio}</Typography>
        <Box display="flex" alignItems="center" style={{ color: "#ccc" }}>
          <Typography
            color="primary"
            variant="body2"
            style={{ marginRight: 24 }}
          >
            5 codes
          </Typography>
          <Typography
            color="primary"
            variant="body2"
            style={{ marginRight: 24 }}
          >
            0 follower
          </Typography>
          <Typography color="primary" variant="body2">
            0 following
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  const userProfileInformationLoading = (
    <Box display="flex" alignItems="center" style={{ color: "white" }}>
      <Skeleton
        animation="wave"
        variant="circle"
        style={{ backgroundColor: "#333" }}
        width={100}
        height={100}
      />
      <Box ml={5} style={{ flex: 1 }}>
        <Skeleton
          animation="wave"
          height={10}
          style={{ backgroundColor: "#333", marginBottom: 6, maxWidth: 320 }}
          width="80%"
        />
        <Skeleton
          animation="wave"
          height={10}
          style={{ backgroundColor: "#333", marginBottom: 6 }}
        />
        <Skeleton
          animation="wave"
          height={10}
          style={{ backgroundColor: "#333", marginBottom: 6, maxWidth: 620 }}
        />
        <Skeleton
          animation="wave"
          height={10}
          style={{ backgroundColor: "#333", marginBottom: 6, maxWidth: 520 }}
          width="80%"
        />
      </Box>
    </Box>
  );

  return (
    <Box bgcolor="black" style={{ overflow: "scroll" }}>
      <Box
        style={{
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)", // Fix on Mobile
          minHeight: "100vh",
          background:
            "linear-gradient(rgba(255,255,255,.04), rgba(255,255,255,0.04))"
        }}
      >
        <NavBar />
        <Box pt={20} pb={10}>
          <Container maxWidth="md">
            {currentUser?.username
              ? userProfileInformation
              : userProfileInformationLoading}
          </Container>
        </Box>
        <Container maxWidth="md">
          <Paper className={classes.root}>
            <Tabs
              value={currentTab}
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
        <Box pt={20} pb={30}>
          <Container maxWidth="md">
            {currentTab === 0 && (
              <>
                {isLoadingUserSourceCodes && (
                  <Box
                    minHeight={320}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Box mb={1}>
                      <CircularProgress />
                    </Box>
                    <Typography color="primary" variant="body2">
                      Fetching code...
                    </Typography>
                  </Box>
                )}
                <Grid container spacing={10}>
                  {userSourceCodes.map(
                    (
                      {
                        sourceCode,
                        photoURL,
                        author,
                        title,
                        createdAt,
                        id
                      }: any,
                      index: any
                    ) => (
                      <Grid item key={index} xs={12} sm={6} md={4}>
                        <CodeCard
                          sourceCode={sourceCode}
                          photoURL={photoURL}
                          title={title}
                          codeURL={`/${currentUser.username}/${id}`}
                          createdAt={createdAt.seconds}
                          authorURL={`/${currentUser.username}`}
                          author={"@" + currentUser.username}
                        />
                      </Grid>
                    )
                  )}
                </Grid>
              </>
            )}
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default React.memo(withNotificationBanner(HomePage));
