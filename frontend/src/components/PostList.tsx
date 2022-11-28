import React, { useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { observer } from "mobx-react";
import {
  Avatar,
  Box,
  Container,
  CssBaseline,
  GlobalStyles,
  Grid,
  List,
  Pagination,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import TimeAgo from "react-timeago";
import MarkdownView from "react-showdown";
import UserStore from "../stores/UserStore";
import PostStore from "../stores/PostStore";
import { Post } from "../../data/interfaces";

function PostList() {
  const navigate = useNavigate();
  const { threadId } = useParams() as {
    threadId: string;
  };
  const queryParams = new URLSearchParams(useLocation().search);
  const threadTitle = queryParams.get("threadTitle");
  const boardTitle = queryParams.get("boardTitle");
  const isLocked = queryParams.get("isLocked");
  const [page, setPage] = React.useState(1);
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  useEffect(() => {
    PostStore.fetchPosts(threadId, page);
  }, [threadId, page]);
  function navigateToProfile(id: number | null) {
    if (id != null) navigate(`/profile/${id}/`);
  }
  async function handlePost(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let message: string;
    message = data.get("message")!.toString();
    try {
      await PostStore.postMessage(message, threadId);
    } catch (error: any) {
      console.log(error.response.status);
    }
  }
  function postItem(post: Post) {
    return (
      <Paper style={{ padding: "40px 20px", width: "100%" }}>
        <Grid container wrap="nowrap" spacing={2}>
          <Grid item>
            <Avatar alt={post.author_name} src={post.author_avatar} />
          </Grid>
          <Grid justifyContent="left" item xs zeroMinWidth>
            <Typography
              color="inherit"
              fontWeight="bold"
              onClick={() => navigateToProfile(post.author)}
              style={{ cursor: "pointer" }}
            >
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
            {posts.map((post) => {
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
        {PostStore.isLoading ? (
          <Box sx={{ display: "flex" }} style={{ justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : (
          <React.Fragment>
            <Typography
              color="inherit"
              justifyContent="center"
              display="flex"
              variant="h4"
            >
              {boardTitle}
            </Typography>
            <Typography
              color="inherit"
              justifyContent="center"
              display="flex"
              variant="h4"
            >
              {threadTitle}
            </Typography>
            {postsList()}
            {isLocked === "false" &&
            UserStore.user != null &&
            UserStore.user.is_banned === false ? (
              <Box
                component="form"
                onSubmit={handlePost}
                noValidate
                sx={{ mt: 1 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="message"
                  label="Post Message"
                  name="message"
                  InputProps={{
                    endAdornment: (
                      <Button type="submit" variant="contained">
                        Post
                      </Button>
                    ),
                  }}
                />
              </Box>
            ) : null}
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
                count={PostStore.pagesCount}
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
export default observer(PostList);
