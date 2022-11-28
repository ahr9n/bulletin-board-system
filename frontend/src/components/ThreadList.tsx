import React, { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { observer } from "mobx-react";
import {
  Box,
  Container,
  CssBaseline,
  GlobalStyles,
  List,
  Pagination,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Divider,
  CircularProgress,
} from "@mui/material";
import UserStore from "../stores/UserStore";
import ThreadStore from "../stores/ThreadStore";
import ThreadCard from "./ThreadCard";

function ThreadsList() {
  const { boardId } = useParams() as {
    boardId: string;
  };
  const queryParams = new URLSearchParams(useLocation().search);
  const boardTitle = queryParams.get("boardTitle");
  const [page, setPage] = React.useState(1);
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  useEffect(() => {
    ThreadStore.fetchThreads(boardId, page);
  }, [boardId, page]);

  async function handleThread(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let title: string;
    let is_sticky: boolean;
    title = data.get("title")!.toString();
    const sticky = data.get("sticky");
    if (sticky == null) {
      is_sticky = false;
    } else {
      is_sticky = true;
    }
    try {
      await ThreadStore.createThread(boardId, title, is_sticky);
    } catch (error: any) {
      console.log(error.response.status);
    }
  }
  function stickyThreadsList() {
    const threads = ThreadStore.getStickyThreads(boardId);
    if (threads.length !== 0)
      return (
        <React.Fragment>
          <Typography
            color="inherit"
            justifyContent="left"
            display="flex"
            variant="h5"
          >
            Sticky Threads
          </Typography>
          <List
            sx={{
              marginRight: "30px",
              marginLeft: "30px",
              marginBottom: "30px",
            }}
          >
            {threads.map((thread) => {
              return (
                <ThreadCard
                  key={thread.id}
                  thread={thread}
                  boardTitle={boardTitle}
                />
              );
            })}
          </List>
          <hr />
        </React.Fragment>
      );
  }
  function nonStickyThreadsList() {
    const threads = ThreadStore.getNonStickyThreads(boardId);
    if (threads.length !== 0)
      return (
        <React.Fragment>
          <Typography
            color="inherit"
            justifyContent="left"
            display="flex"
            variant="h5"
          >
            Non-Sticky Threads
          </Typography>
          <List
            sx={{
              marginRight: "30px",
              marginLeft: "30px",
              marginBottom: "30px",
            }}
          >
            {threads.map((thread) => {
              return (
                <ThreadCard
                  key={thread.id}
                  thread={thread}
                  boardTitle={boardTitle}
                />
              );
            })}
          </List>
        </React.Fragment>
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
        {ThreadStore.isLoading ? (
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
            {stickyThreadsList()}
            {nonStickyThreadsList()}
            {UserStore.user != null && UserStore.user.is_banned === false ? (
              <Box
                component="form"
                onSubmit={handleThread}
                noValidate
                sx={{ mt: 1 }}
              >
                <Divider variant="fullWidth" style={{ margin: "30px 0" }} />
                <Typography
                  color="inherit"
                  justifyContent="center"
                  display="flex"
                  variant="h5"
                >
                  Create Thread
                </Typography>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="title"
                  label="Thread Title"
                  name="title"
                  inputProps={{ maxLength: 64 }}
                />
                <FormControlLabel
                  control={<Checkbox value="sticky" color="primary" />}
                  label="Sticky"
                  name="sticky"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Create Thread
                </Button>
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
                count={ThreadStore.pagesCount}
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

export default observer(ThreadsList);
