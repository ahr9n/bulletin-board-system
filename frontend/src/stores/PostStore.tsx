import { makeAutoObservable, runInAction } from "mobx";
import { AxiosInstance } from "../utils/functions";
import { Post, PostsResponse } from "../../data/interfaces";
import UserStore from "./UserStore";

class PostStore {
  isLoading: boolean = false;
  totalPostsCount: number = 0;
  pagesCount: number = 0;

  posts: { [postId: string]: Post } = {};
  private setLoadingState(state: boolean) {
    runInAction(() => {
      this.isLoading = state;
    });
  }

  constructor() {
    // this.fetchPosts();
    makeAutoObservable(this);
  }
  async fetchProfilePosts(id: string, page: number) {
    this.setLoadingState(true);
    const response = await AxiosInstance.get(
      `/api/posts/?last_reply_poster_id=${id}&ordering=-last_reply_date`,
      {
        params: {
          page: page,
        },
      }
    );
    const postsResponse: PostsResponse = response.data;
    const results: Post[] | null = postsResponse.results;
    runInAction(() => {
      this.totalPostsCount = postsResponse.count;
      this.pagesCount = Math.ceil(this.totalPostsCount / 20);
      if (this.pagesCount === 0) {
        this.pagesCount = 1;
      }
    });
    if (results != null) {
      runInAction(() => {
        this.posts = {};
        results.forEach((post: Post) => {
          this.posts[post.id] = post;
        });
      });
    } else {
      this.posts = {};
    }
    this.setLoadingState(false);
  }
  async fetchPosts(id: string, page: number) {
    this.setLoadingState(true);
    const response = await AxiosInstance.get(`/api/posts/?thread__id=${id}`, {
      params: {
        page: page,
      },
    });
    const postsResponse: PostsResponse = response.data;
    const results: Post[] | null = postsResponse.results;
    runInAction(() => {
      this.totalPostsCount = postsResponse.count;
      this.pagesCount = Math.ceil(this.totalPostsCount / 20);
      if (this.pagesCount === 0) {
        this.pagesCount = 1;
      }
    });
    if (results != null) {
      runInAction(() => {
        this.posts = {};
        results.forEach((post: Post) => {
          this.posts[post.id] = post;
        });
      });
    } else {
      this.posts = {};
    }
    this.setLoadingState(false);
  }
  async postMessage(message: string, threadID: string) {
    const data = new FormData();
    data.append("author", UserStore.getUser().id.toString());
    data.append("thread", threadID);
    data.append("message", message);
    AxiosInstance.post("/api/posts/", data, {
      headers: {
        Authorization: `Token ${UserStore.getToken()}`,
      },
    })
      .then(() => {
        this.fetchPosts(threadID, this.pagesCount);
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
  getPosts(): Post[] {
    return Object["values"](this.posts);
  }
  getPageCount() {
    return this.pagesCount;
  }
}

const postStore = new PostStore();
export default postStore;
