import { makeAutoObservable, runInAction } from "mobx";
import { AxiosInstance } from "../utils/functions";
import { Topic } from "../../data/interfaces";
import UserStore from "./UserStore";

class TopicStore {
  isLoading: boolean = false;
  topics: { [topicID: string]: Topic } = {};
  private setLoadingState(state: boolean) {
    runInAction(() => {
      this.isLoading = state;
    });
  }

  constructor() {
    this.fetchTopics();
    makeAutoObservable(this);
  }
  async fetchTopics() {
    this.setLoadingState(true);
    const response = await AxiosInstance.get("/api/topics/");
    const results: Topic[] = response.data;
    runInAction(() => {
      this.topics = {};
      results.forEach((topic: Topic) => {
        this.topics[topic.id] = topic;
      });
    });
    this.setLoadingState(false);
  }
  async addTopic(name: string) {
    const formData = new FormData();
    formData.append("author", UserStore.getUser().id.toString());
    formData.append("title", name);
    AxiosInstance.post("/api/topics/", formData, {
      headers: {
        Authorization: `Token ${UserStore.getToken()}`,
      },
    })
      .then(() => {
        this.fetchTopics();
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
  getTopicsList(): Topic[] {
    return Object["values"](this.topics);
  }
}

const topicStore = new TopicStore();
export default topicStore;
