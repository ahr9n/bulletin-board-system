import { makeAutoObservable, runInAction } from "mobx";
import { AxiosInstance } from "../utils/functions";
import { UserInterface } from "../../data/interfaces";
import UserStore from "./UserStore";

class ProfileStore {
  isLoading: boolean = false;
  profile: UserInterface = {} as any as UserInterface;
  private setLoadingState(state: boolean) {
    runInAction(() => {
      this.isLoading = state;
    });
  }

  constructor() {
    makeAutoObservable(this);
  }
  async manageBan(status: boolean, id: number) {
    const data = new FormData();
    data.append("is_banned", status.toString());
    AxiosInstance.patch(`/api/users/${id}/`, data, {
      headers: {
        Authorization: `Token ${UserStore.getToken()}`,
      },
    })
      .then((res) => {
        this.fetchProfile(id.toString());
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
  async fetchProfile(id: string) {
    this.setLoadingState(true);
    AxiosInstance.get(`/api/users/${id}/`)
      .then((response) => {
        runInAction(() => {
          this.profile = response.data;
        });
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
    this.setLoadingState(false);
  }
  getProfile() {
    return this.profile;
  }
}

const profileStore = new ProfileStore();
export default profileStore;
