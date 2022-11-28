import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { observer } from "mobx-react";
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Divider,
  GlobalStyles,
  Grid,
  List,
  Pagination,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";
import TimeAgo from "react-timeago";
import MarkdownView from "react-showdown";
import UserStore from "../stores/UserStore";
import ProfileStore from "../stores/ProfileStore";
import PostStore from "../stores/PostStore";
import { Post } from "../../data/interfaces";

function Profile() {
  const { profileId } = useParams() as {
    profileId: string;
  };
  const [page, setPage] = React.useState(1);
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  useEffect(() => {
    PostStore.fetchProfilePosts(profileId, page);
  }, [profileId, page]);
  useEffect(() => {
    ProfileStore.fetchProfile(profileId);
  }, [profileId]);
  function handleBan() {
    ProfileStore.manageBan(true, ProfileStore.profile.id);
  }
  function handleUnBan() {
    ProfileStore.manageBan(false, ProfileStore.profile.id);
  }
  function postItem(post: Post) {
    return (
      <Paper style={{ padding: "40px 20px", width: "100%" }}>
        <Grid container wrap="nowrap" spacing={2}>
          <Grid item>
            <Avatar
              alt={ProfileStore.getProfile().username}
              src={ProfileStore.getProfile().avatar}
            />
          </Grid>
          <Grid justifyContent="left" item xs zeroMinWidth>
            <Typography color="inherit" fontWeight="bold">
              {post.author_name}
            </Typography>
            <MarkdownView
              style={{ textAlign: "left" }}
              markdown={post.message}
            />
            <p style={{ textAlign: "left", color: "gray" }}>
              <b>Posted:</b> <TimeAgo date={post.created_at} />
            </p>
          </Grid>
        </Grid>
      </Paper>
    );
  }
  function postsList() {
    const posts = PostStore.getPosts();
    if (posts.length !== 0)
      return (
        <React.Fragment>
          <List
            sx={{
              marginRight: "30px",
              marginLeft: "30px",
              marginBottom: "30px",
            }}
          >
            {posts.reverse().map((post) => {
              if (post.author === ProfileStore.getProfile().id) {
                return (
                  <Box
                    key={post.id}
                    sx={{
                      marginTop: "10px",
                      marginBottom: "30px",
                      backgroundColor: "palegreen",
                    }}
                    display="flex"
                    justifyContent="center"
                  >
                    {postItem(post)}
                  </Box>
                );
              }
            })}
          </List>
        </React.Fragment>
      );
    else
      return (
        <Typography color="inherit" justifyContent="center" display="flex">
          No Posts Found
        </Typography>
      );
  }
  return (
    <React.Fragment>
      <GlobalStyles
        styles={{ ul: { margin: 0, padding: 0, listStyle: "none" } }}
      />
      <CssBaseline />
      <Container
        style={{
          marginTop: "20px",
          display: "-ms-flexbox",
          justifyContent: "center",
          justifyItems: "center",
        }}
      >
        {ProfileStore.isLoading ? (
          <Box sx={{ display: "flex" }} style={{ justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : (
          <React.Fragment>
            <Box sx={{ display: "flex" }} style={{ justifyContent: "center" }}>
              <Avatar
                alt={ProfileStore.getProfile().username}
                src={ProfileStore.getProfile().avatar}
                sx={{ width: 60, height: 60 }}
              />
            </Box>
            <Typography
              color="inherit"
              justifyContent="center"
              display="flex"
              variant="h4"
            >
              {ProfileStore.getProfile().first_name}{" "}
              {ProfileStore.getProfile().last_name}
            </Typography>
            <Typography
              color="inherit"
              justifyContent="center"
              display="flex"
              variant="h5"
            >
              {ProfileStore.getProfile().username}
            </Typography>
            {ProfileStore.getProfile().is_administrator ? (
              <Typography
                color="inherit"
                justifyContent="center"
                display="flex"
                variant="h5"
              >
                <b>ADMINISTRATOR</b>
              </Typography>
            ) : ProfileStore.getProfile().is_moderator ? (
              <Typography
                color="inherit"
                justifyContent="center"
                display="flex"
                variant="h5"
              >
                <b>MODERATOR</b>
              </Typography>
            ) : null}
            <Typography
              color="inherit"
              justifyContent="center"
              display="flex"
              variant="h5"
            >
              {ProfileStore.getProfile().gender}
            </Typography>
            <Typography
              color="inherit"
              justifyContent="center"
              display="flex"
              variant="h5"
            >
              {ProfileStore.getProfile().about}
            </Typography>
            <Typography
              color="inherit"
              justifyContent="center"
              display="flex"
              variant="h5"
            >
              <i>Hometown: </i>
              <b>{ProfileStore.getProfile().hometown}</b>
            </Typography>
            <Typography
              color="inherit"
              justifyContent="center"
              display="flex"
              variant="h5"
            >
              <i>Present Location: </i>
              <b>{ProfileStore.getProfile().present_location}</b>
            </Typography>
            <Typography
              color="inherit"
              justifyContent="center"
              display="flex"
              variant="h5"
            >
              <i>Website: </i>
              <b>
                <a href={"//" + ProfileStore.getProfile().website}>
                  {ProfileStore.getProfile().website}
                </a>
              </b>
            </Typography>
            <Typography
              color="inherit"
              justifyContent="center"
              display="flex"
              variant="h5"
            >
              <i>Interests: </i>
              <b>{ProfileStore.getProfile().interests}</b>
            </Typography>
            {ProfileStore.getProfile().is_banned ? (
              <Typography
                style={{ color: "#FF0000" }}
                justifyContent="center"
                display="flex"
                variant="h5"
              >
                <b>Banned</b>
              </Typography>
            ) : null}
          </React.Fragment>
        )}
        {UserStore.user != null &&
        UserStore.getUser().id !== ProfileStore.getProfile().id &&
        (UserStore.getUser().is_administrator ||
          UserStore.getUser().is_moderator) ? (
          ProfileStore.getProfile().is_administrator === false ? (
            ProfileStore.getProfile().is_banned ? (
              <Box
                sx={{ display: "flex" }}
                style={{ justifyContent: "center" }}
              >
                <Button
                  style={{
                    height: "35px",
                    marginLeft: "5px",
                    marginRight: "5px",
                    backgroundColor: "#FF0000",
                    borderColor: "#FF0000",
                    color: "#FFFFFF",
                  }}
                  variant="contained"
                  size="small"
                  onClick={() => handleUnBan()}
                >
                  UnBan
                </Button>
              </Box>
            ) : (
              <Box
                sx={{ display: "flex" }}
                style={{ justifyContent: "center" }}
              >
                <Button
                  style={{
                    height: "35px",
                    marginLeft: "5px",
                    marginRight: "5px",
                    color: "#FF0000",
                    borderColor: "#FF0000",
                    backgroundColor: "#FFFFFF",
                  }}
                  variant="outlined"
                  size="small"
                  onClick={() => handleBan()}
                >
                  Ban
                </Button>
              </Box>
            )
          ) : null
        ) : null}
        <Divider variant="fullWidth" style={{ margin: "30px 0" }} />
        {PostStore.isLoading ? (
          <Box sx={{ display: "flex" }} style={{ justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : (
          <React.Fragment>
            {postsList()}
            <Box
              sx={{
                marginTop: "10px",
                marginBottom: "30px",
              }}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Pagination
                variant="outlined"
                shape="rounded"
                count={PostStore.getPageCount()}
                page={page}
                onChange={handleChange}
              />
            </Box>
          </React.Fragment>
        )}
      </Container>
    </React.Fragment>
  );
}

export default observer(Profile);
