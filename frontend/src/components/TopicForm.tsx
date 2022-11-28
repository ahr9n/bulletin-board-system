import React, { FormEvent } from "react";
import {
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Dialog,
} from "@mui/material";
import TopicStore from "../stores/TopicStore";

function TopicForm() {
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");

  const titleHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const title = event.target.value;
    setTitle(title);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setTitle("");
    setOpen(false);
  };
  const handleForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await TopicStore.addTopic(title);
      handleClose();
    } catch (error: any) {
      console.log(error.response.status);
    }
  };
  return (
    <div>
      <Button
        variant="outlined"
        color="primary"
        onClick={handleClickOpen}
        style={{ height: "35px", marginLeft: "5px", marginRight: "5px" }}
      >
        Add Topic
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add Board</DialogTitle>
        <DialogContent>
          <form id="add-topic" onSubmit={handleForm}>
            <TextField
              autoFocus
              margin="dense"
              id="title"
              value={title}
              onChange={titleHandler}
              label="Topic Title"
              required
              fullWidth
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button form="add-topic" type="submit" color="primary">
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

export default TopicForm;
