import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActions,
  Button,
  styled,
} from "@mui/material";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";

import UserStore from "../stores/UserStore";
import BoardStore from "../stores/BoardStore";
import { Board } from "../../data/interfaces";

function BoardCard({ board }: { board: Board }) {
  const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "#f5f5f9",
      color: "rgba(0, 0, 0, 0.87)",
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: "1px solid #dadde9",
    },
  }));

  const navigate = useNavigate();
  function navigateToThreads() {
    navigate(`/boards/${board.id}/threads/?boardTitle=${board.title}`);
  }

  function handleDelete() {
    BoardStore.deleteBoard(board.id);
  }

  return (
    <HtmlTooltip
      title={
        <React.Fragment>
          <Typography color="inherit">{board.description}</Typography>
          <hr />
          <Typography color="inherit">
            <b>Threads: </b>
            {board.threads_count}
          </Typography>
          <Typography color="inherit">
            <b>Posts: </b>
            {board.posts_count}
          </Typography>
        </React.Fragment>
      }
    >
      <Card sx={{ maxWidth: 345 }}>
        <CardMedia
          component="img"
          height="140"
          image={board.image}
          alt={board.title}
          onClick={navigateToThreads}
          style={{ cursor: "pointer" }}
        />
        <CardContent>
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            onClick={navigateToThreads}
            style={{ cursor: "pointer" }}
          >
            {board.title}
          </Typography>
        </CardContent>
        {UserStore.user != null && UserStore.user.is_administrator ? (
          <CardActions>
            <Button size="large" onClick={() => handleDelete()}>
              Delete
            </Button>
          </CardActions>
        ) : null}
      </Card>
    </HtmlTooltip>
  );
}
export default BoardCard;
