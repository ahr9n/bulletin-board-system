import { makeAutoObservable, runInAction } from "mobx";
import { AxiosInstance } from "../utils/functions";
import { Thread, ThreadsResponse } from "../../data/interfaces";
import UserStore from "./UserStore";

class ThreadStore {
  isLoading: boolean = false;
  stickyThreads: { [threadId: string]: Thread[] } = {};
  nonStickyThreads: { [threadId: string]: Thread[] } = {};
  totalThreadsCount: number = 0;
  pagesCount: number = 0;
  private setLoadingState(state: boolean) {
    runInAction(() => {
      this.isLoading = state;
    });
  }

  constructor() {
    makeAutoObservable(this);
  }
  async fetchThreads(id: string, page: number) {
    this.setLoadingState(true);
    const response = await AxiosInstance.get(`/api/threads/?board__id=${id}`, {
      params: {
        page: page,
      },
    });
    const threadsResponse: ThreadsResponse = response.data;
    const results: Thread[] | null = threadsResponse.results;
    const sticky: Thread[] = [];
    const nonSticky: Thread[] = [];
    const empty_sticky: Thread[] = [];
    const empty_non_sticky: Thread[] = [];

    if (results != null) {
      results.forEach((thread: Thread) => {
        if (thread.is_sticky) {
          if (thread.last_reply_poster_name != null) {
            sticky.push(thread);
          } else {
            empty_sticky.push(thread);
          }
        } else {
          if (thread.last_reply_poster_name != null) {
            nonSticky.push(thread);
          } else {
            empty_non_sticky.push(thread);
          }
        }
      });
    }
    sticky.push(...empty_sticky);
    nonSticky.push(...empty_non_sticky);
    runInAction(() => {
      this.stickyThreads[id] = sticky;
      this.nonStickyThreads[id] = nonSticky;
      this.totalThreadsCount = threadsResponse.count;
      this.pagesCount = Math.ceil(this.totalThreadsCount / 20);
      if (this.pagesCount === 0) {
        this.pagesCount = 1;
      }
    });
    this.setLoadingState(false);
  }
  async createThread(boardID: string, title: string, is_sticky: boolean) {
    const data = new FormData();
    data.append("author", UserStore.getUser().id.toString());
    data.append("board", boardID);
    data.append("title", title);
    data.append("is_sticky", is_sticky.toString());
    AxiosInstance.post("/api/threads/", data, {
      headers: {
        Authorization: `Token ${UserStore.getToken()}`,
      },
    })
      .then(() => {
        this.fetchThreads(boardID, this.pagesCount);
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
  async lockThread(thread_id: number, board_id: number) {
    const data = new FormData();
    data.append("is_locked", "true");

    AxiosInstance.patch(`/api/threads/${thread_id}/`, data, {
      headers: {
        Authorization: `Token ${UserStore.getToken()}`,
      },
    })
      .then(() => {
        this.fetchThreads(board_id.toString(), this.pagesCount);
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
  async unlockThread(thread_id: number, board_id: number) {
    const data = new FormData();
    data.append("is_locked", "false");
    AxiosInstance.patch(`/api/threads/${thread_id}/`, data, {
      headers: {
        Authorization: `Token ${UserStore.getToken()}`,
      },
    })
      .then(() => {
        this.fetchThreads(board_id.toString(), this.pagesCount);
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
  getStickyThreads(id: string): Thread[] {
    if (this.stickyThreads[id] === undefined) return [];
    return Object["values"](this.stickyThreads[id]);
  }
  getNonStickyThreads(id: string): Thread[] {
    if (this.nonStickyThreads[id] === undefined) return [];
    return Object["values"](this.nonStickyThreads[id]);
  }
}

const threadStore = new ThreadStore();
export default threadStore;
