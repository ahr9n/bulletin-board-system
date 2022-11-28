import React, { useEffect } from "react";
import { observer } from "mobx-react";
import {
  Container,
  CssBaseline,
  GlobalStyles,
  Grid,
  Box,
  Button,
  CircularProgress,
} from "@mui/material";

import UserStore from "../stores/UserStore";
import TopicStore from "../stores/TopicStore";
import BoardStore from "../stores/BoardStore";

import BoardCard from "./BoardCard";
import BoardForm from "./BoardForm";
import TopicForm from "./TopicForm";

import "./BoardList.css";

function BoardList() {
  const [group_by_topic, setGroup_by_topic] = React.useState(false);
  const handleGroup_by_topic = () => {
    setGroup_by_topic(!group_by_topic);
  };

  useEffect(() => {
    BoardStore.fetchBoards();
  }, []);

  return (
    <React.Fragment>
      <GlobalStyles
        styles={{ ul: { margin: 0, padding: 0, listStyle: "none" } }}
      />
      <CssBaseline />
      <Container
        style={{
          marginTop: "20px",
          justifyContent: "center",
        }}
      >
        {BoardStore.isLoading ? (
          <Box sx={{ display: "flex" }} style={{ justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={0} justifyContent="center" marginTop="20px">
            {UserStore.user.is_administrator && (
              <Container
                style={{ display: "flex", flexDirection: "row-reverse" }}
              >
                {group_by_topic ? (
                  <Button
                    style={{ height: "35px", marginLeft: "5px", marginRight: "5px" }}
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={handleGroup_by_topic}
                  >
                    Group By Topic
                  </Button>) : (
                  <Button
                    style={{ height: "35px", marginLeft: "5px", marginRight: "5px" }}
                    variant="contained"
                    color='inherit'
                    size="small"
                    onClick={handleGroup_by_topic}
                  >
                    Group By Topic
                  </Button>)}
                <BoardForm />
                <TopicForm />
              </Container>
            )}
            {group_by_topic ? (
              <>
                {TopicStore.getTopicsList().map((topic) => (
                  <Container key={topic.id}>
                    <div className='Title'>
                      <p>{topic.title}</p>
                    </div>
                    <Grid container spacing={3}
                      rowSpacing={1}
                      justifyContent="center"
                      alignItems="center">
                      {BoardStore.getBoardsList().filter((board) => board.topic === topic.id)
                        .map((board) => {
                          return (
                            <Grid
                              item
                              key={board.id}
                              xs={12}
                              sm={6}
                              md={4}
                              style={{ padding: "20px" }}
                            >
                              <BoardCard board={board} />
                            </Grid>
                          );
                        })}
                    </Grid>
                  </Container>
                ))}
              </>
            ) : (
              <>
                {BoardStore.getBoardsList().map((board) => {
                  return (
                    <Grid
                      item
                      key={board.id}
                      xs={12}
                      sm={6}
                      md={4}
                      style={{ padding: "20px" }}
                    >
                      <BoardCard board={board} />
                    </Grid>
                  );
                })}
              </>
            )}
          </Grid>
        )}
      </Container>
    </React.Fragment>
  );
}

export default observer(BoardList);