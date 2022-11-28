import { makeAutoObservable, runInAction } from "mobx";
import { AxiosInstance } from "../utils/functions";
import { Board } from "../../data/interfaces";
import UserStore from "./UserStore";

class BoardStore {
  boards: { [boardId: string]: Board } = {};
  isLoading: boolean = false;
  private setLoadingState(state: boolean) {
    runInAction(() => {
      this.isLoading = state;
    });
  }

  constructor() {
    this.fetchBoards();
    makeAutoObservable(this);
  }
  async fetchBoards() {
    this.setLoadingState(true);
    const response = await AxiosInstance.get("/api/boards/");
    const results: Board[] = response.data;
    runInAction(() => {
      this.boards = {};
      results.forEach((board: Board) => {
        this.boards[board.id] = board;
      });
    });
    this.setLoadingState(false);
  }
  async deleteBoard(board_id: number) {
    AxiosInstance.delete(`/api/boards/${board_id}/`, {
      headers: {
        Authorization: `Token ${UserStore.getToken()}`,
      },
    })
      .then(() => {
        this.fetchBoards();
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
  }
  getBoardsList(): Board[] {
    return Object["values"](this.boards);
  }
}

const boardStore = new BoardStore();
export default boardStore;
