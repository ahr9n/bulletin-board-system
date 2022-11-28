import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
} from "@mui/material";
import TimeAgo from "react-timeago";
import UserStore from "../stores/UserStore";
import ThreadStore from "../stores/ThreadStore";
import { Thread } from "../../data/interfaces";

function ThreadCard({
  thread,
  boardTitle,
}: {
  thread: Thread;
  boardTitle: string | null;
}) {
  const navigate = useNavigate();
  function navigateToPosts() {
    if (boardTitle == null) {
      boardTitle = "";
    }
    navigate(
      `/threads/${thread.id}/posts/?threadTitle=${thread.title}&boardTitle=${boardTitle}&isLocked=${thread.is_locked}`
    );
  }
  function navigateToProfile() {
    if (thread.last_reply_poster_id)
      navigate(`/profile/${thread.last_reply_poster_id}/`);
  }
  function handleLock() {
    ThreadStore.lockThread(thread.id, thread.board);
  }
  function handleUnlock() {
    ThreadStore.unlockThread(thread.id, thread.board);
  }
  return (
    <Card
      sx={{
        marginTop: "30px",
      }}
    >
      <CardContent>
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          onClick={navigateToPosts}
          style={{ cursor: "pointer" }}
        >
          {thread.title}
        </Typography>
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          onClick={navigateToProfile}
          style={{ cursor: "pointer" }}
        >
          <b>Last Replier: </b>
          {thread.last_reply_poster_name != null
            ? thread.last_reply_poster_name
            : "No posts yet!"}
        </Typography>
        <Typography gutterBottom variant="h6" component="div">
          <p style={{ textAlign: "left", color: "gray" }}>
            <b>Date:</b>{" "}
            {thread.last_reply_date != null ? (
              <TimeAgo date={thread.last_reply_date} />
            ) : (
              "No posts yet!"
            )}
          </p>
        </Typography>
        <Typography gutterBottom variant="h6" component="div">
          <b>Locked: </b>
          {thread.is_locked ? "Yes" : "No"}
        </Typography>
      </CardContent>
      <CardActions>
        {UserStore.user != null &&
        (UserStore.user.is_administrator || UserStore.user.is_moderator) ? (
          thread.is_locked ? (
            <Button size="large" onClick={() => handleUnlock()}>
              Unlock
            </Button>
          ) : (
            <Button size="large" onClick={() => handleLock()}>
              Lock
            </Button>
          )
        ) : null}
      </CardActions>
    </Card>
  );
}
export default ThreadCard;
