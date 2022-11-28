import { makeAutoObservable, runInAction } from "mobx";
import { AxiosInstance } from "../utils/functions";
import { UserInterface, LoggedUser } from "../../data/interfaces";

class UserStore {
  isLoading: boolean = false;
  isLoggedIn: boolean = false;
  user: UserInterface = {} as any as UserInterface;
  token: string = "";
  private setLoadingState(state: boolean) {
    runInAction(() => {
      this.isLoading = state;
    });
  }

  constructor() {
    this.fetchUser();
    makeAutoObservable(this);
  }
  async logUserIn(email: string, password: string) {
    this.setLoadingState(true);
    let data = new FormData();
    data.append("email", email);
    data.append("password", password);
    const response = await AxiosInstance.post("/login/", data);
    const userLoginResponse: LoggedUser = response.data;
    runInAction(() => {
      this.user = userLoginResponse.user;
      this.token = userLoginResponse.token;
      this.isLoggedIn = true;
      localStorage.setItem("id", this.user.id.toString());
      localStorage.setItem("token", this.token);
    });
    this.setLoadingState(false);
  }
  async logUserOut() {
    this.setLoadingState(true);
    AxiosInstance.post(
      "/logout/",
      {},
      {
        headers: {
          Authorization: `Token ${this.token}`,
        },
      }
    )
      .then((response) => {
        runInAction(() => {
          this.user = {} as any as UserInterface;
          this.token = "";
          this.isLoggedIn = false;
          localStorage.clear();
        });
      })
      .catch(function (error) {
        console.log("error");
      });
    this.setLoadingState(false);
  }
  async fetchUser() {
    const id = localStorage.getItem("id");
    const token = localStorage.getItem("token");
    if (token != null) {
      AxiosInstance.get(`/api/users/${id}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
        .then((response) => {
          runInAction(() => {
            this.user = response.data;
            this.isLoggedIn = true;
            this.token = token;
          });
        })
        .catch(function (error) {
          localStorage.clear();
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
  }
  setUser(user: UserInterface) {
    runInAction(() => {
      this.user = user;
      this.isLoggedIn = true;
      localStorage.setItem("id", this.user.id.toString());
    });
  }
  setToken(token: string) {
    runInAction(() => {
      this.token = token;
      localStorage.setItem("token", this.token);
    });
  }
  getToken() {
    return this.token;
  }
  getUser() {
    return this.user;
  }
}

const userStore = new UserStore();
export default userStore;
