import React, { FormEvent } from "react";
import {
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Dialog,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";

import { AxiosInstance } from "../utils/functions";

import UserStore from "../stores/UserStore";
import BoardStore from "../stores/BoardStore";
import TopicStore from "../stores/TopicStore";

import { BoardFormInterface } from "../../data/interfaces";
import ProfileStore from "../stores/ProfileStore";

function BoardForm() {
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [topic, setTopic] = React.useState("undefined");

  const titleHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const title = event.target.value;
    setTitle(title);
  };
  const descriptionHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const description = event.target.value;
    setDescription(description);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setTitle("");
    setDescription("");
    setTopic("");
    setOpen(false);
  };
  const handleTopic = (event: SelectChangeEvent<{}>) => {
    setTopic(event.target.value as string);
  };

  const handleForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    const data = {
      title: title,
      description: description,
      image:
        e.currentTarget.picture.files[0] ||
        "https://reactnativeelements.com/img/avatar/avatar--icon.jpg",
      author: UserStore.getUser().id,
      topic: topic,
    };
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key as keyof BoardFormInterface]);
    });
    AxiosInstance.post(`/api/boards/`, formData, {
      headers: {
        Authorization: `Token ${UserStore.getToken()}`,
      },
    })
      .then(() => {
        BoardStore.fetchBoards();
        handleClose();
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", error.message);
        }
        console.log(error.config);
      });
  };
  return (
    <div>
      <Button
        variant="outlined"
        color="primary"
        onClick={handleClickOpen}
        style={{ height: "35px", marginLeft: "5px", marginRight: "5px" }}
      >
        Add Board
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add Board</DialogTitle>
        <DialogContent>
          <form id="add-board" onSubmit={handleForm}>
            <TextField
              autoFocus
              margin="dense"
              id="title"
              value={title}
              onChange={titleHandler}
              label="Board Title"
              required
              fullWidth
            />
            <FormControl style={{ width: "200px" }}>
              <InputLabel id="topic">Topic</InputLabel>
              <Select
                labelId="topic"
                id="topic"
                value={topic}
                // something wrong
                onChange={handleTopic}
                required
              >
                {TopicStore.getTopicsList().map((topic, index) => (
                  <MenuItem key={index} value={topic.id}>
                    {topic.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              id="description"
              value={description}
              onChange={descriptionHandler}
              label="Board Description"
              required
              fullWidth
            />
            Picture:{" "}
            <input
              accept="image/*"
              name="picture"
              type="file"
              multiple={false}
              // required
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button form="add-board" type="submit" color="primary">
            Add
          </Button>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default BoardForm;
