import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import router from "../router/index";
import Cookies from "js-cookie";
import moment from "moment";
import img from "../../public/no-image.png";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {},
    friends: [],
    requests: [],
    chats: [],
    search: [],
    activeChat: {},
    firstMessages: [],
    usedEmail: false,
    wrongLogin: false,
  },
  getters: {
    getTheToken: (state) => {
      return state.token;
    },
    user: (state) => {
      return state.user;
    },
    friends: (state) => {
      return state.friends;
    },
    requestsArray: (state) => {
      return state.requests;
    },
    chats: (state) => {
      return state.chats;
    },
    searchResults: (state) => {
      return state.search;
    },
    getActiveChat: (state) => {
      return state.activeChat;
    },
    messages: (state) => {
      return state.firstMessages;
    },
    usedEmail: (state) => {
      return state.usedEmail;
    },
    wrongLogin: (state) => {
      return state.wrongLogin;
    },
  },
  mutations: {
    setToken(state, payload) {
      Cookies.set("token", payload);
    },
    setUserData(state, payload) {
      state.user = { ...payload };
      if (state.user.avatar) {
        state.user.avatar = "data:image/gif;base64," + state.user.avatar;
      } else {
        state.user.avatar = img;
      }

      state.user.dateOfBirth = moment(state.user.dateOfBirth).format(
        "YYYY-MM-DD"
      );
    },
    setFriends(state, payload) {
      state.friends = payload;
      state.friends.forEach((el) => {
        el.name = `${el.name} ${el.lastname}`;
        delete el.lastname;
        if (el.avatar) {
          el.avatar = "data:image/gif;base64," + el.avatar;
        } else {
          el.avatar = img;
        }
      });
    },
    setRequests(state, payload) {
      state.requests = payload;
      state.requests.forEach((el) => {
        if (el.avatar) {
          el.avatar = "data:image/gif;base64," + el.avatar;
        } else {
          el.avatar = img;
        }
      });
    },
    logOut(state) {
      Cookies.remove("token");
      Object.assign(state, {
        user: {},
        friends: [],
        requests: [],
        chats: [],
        search: [],
        activeChat: {},
        firstMessages: [],
        usedEmail: false,
        wrongLogin: false,
      });
      router.push({ name: "Log in" });
    },
    chats(state, payload) {
      state.chats = payload;

      state.chats.forEach((el) => {
        if (el.avatar) {
          el.avatar = "data:image/gif;base64," + el.avatar;
        } else {
          el.avatar = img;
        }
      });
    },
    search(state, payload) {
      state.search = payload;

      state.search.forEach((el) => {
        if (el.avatar) {
          el.avatar = "data:image/gif;base64," + el.avatar;
        } else {
          el.avatar = img;
        }
      });
    },
    setActivateChat(state, payload) {
      state.activeChat = payload;
    },
    setMessages(state, payload) {
      payload.forEach((el) => {
        el.createdAt = moment(el.createdAt).format("ddd hh:mm DD/YYYY");
      });
      state.firstMessages = payload;
    },
    usedEmail(state, payload) {
      state.usedEmail = payload;
    },
    wrongLogin(state, payload) {
      state.wrongLogin = payload;
    },
  },
  actions: {
    signUp(context, data) {
      return new Promise((resolve) => {
        axios
          .post("/api/users", data, {
            headers: {
              "content-type": "application/json",
            },
          })
          .then(() => {
            // await context.commit("setUserData", res.data.user);
            // await context.commit("setToken", res.data.token);

            router.push({ name: "Log in" });
            resolve();
          })
          .catch(async (err) => {
            if (
              err.response.data.error.includes(
                "E11000 duplicate key error collection: chat-app-friends.users index: email_1 dup key:"
              )
            ) {
              await context.commit("usedEmail", true);
            }
          });
      });
    },
    login(context, data) {
      return new Promise((resolve) => {
        axios
          .post("/api/users/login", data, {
            headers: {
              "content-type": "application/json",
            },
          })
          .then(async (res) => {
            await context.commit("setUserData", res.data.user);
            await context.commit("setToken", res.data.token);
            if (Cookies.get("token")) {
              router.push({ name: "Chat" });
            }
            resolve();
          })
          .catch(async (err) => {
            if (
              err.response.data.error.includes("The email or password is wrong")
            ) {
              await context.commit("wrongLogin", true);
            }
            console.log(err);
          });
      });
    },
    profile(context) {
      return new Promise((resolve) => {
        axios
          .get("/api/users/me", {
            headers: {
              authorization: `Bearer ${Cookies.get("token")}`,
            },
          })

          .then(async (res) => {
            await context.commit("setUserData", res.data);
            resolve();
          })
          .catch((err) => {
            console.log(err);
          });
      });
    },
    updateProfile(context, data) {
      return new Promise((resolve) => {
        axios
          .patch("/api/users/me", data, {
            headers: {
              authorization: `Bearer ${Cookies.get("token")}`,
            },
          })

          .then(async (res) => {
            // console.log(res.data);
            await context.commit("setUserData", res.data);
            resolve();
          })
          .catch((err) => {
            console.log(err);
          });
      });
    },
    uploadImage(context, data) {
      const fd = new FormData();
      fd.append("avatar", data);
      return new Promise((resolve) => {
        axios
          .post("/api/users/me/avatar", fd, {
            headers: {
              authorization: `Bearer ${Cookies.get("token")}`,
              "Content-Type": `multipart/form-data;`,
            },
          })
          .then(() => {
            resolve();
          })

          .catch((err) => {
            console.log(err);
          });
      });
    },
    getFriends(context) {
      return new Promise((resolve) => {
        axios
          .get("/api/friends", {
            headers: {
              authorization: `Bearer ${Cookies.get("token")}`,
            },
          })

          .then(async (res) => {
            // console.log(res.data);

            if (typeof res.data === "object") {
              await context.commit("setFriends", res.data);
            } else {
              await context.commit("setFriends", []);
            }
            resolve();
          })
          .catch((err) => {
            console.log(err);
          });
      });
    },
    getRequests(context) {
      return new Promise((resolve) => {
        axios
          .get("/api/request", {
            headers: {
              authorization: `Bearer ${Cookies.get("token")}`,
            },
          })

          .then(async (res) => {
            // console.log(res.data);

            await context.commit("setRequests", res.data);
            resolve();
          })
          .catch((err) => {
            console.log(err);
          });
      });
    },
    acceptRequest(context, payload) {
      return new Promise((resolve) => {
        axios
          .post(`/api/request/accept/${payload}`, "", {
            headers: {
              authorization: `Bearer ${Cookies.get("token")}`,
            },
          })
          .then(() => {
            resolve();
          })

          .catch((err) => {
            console.log(err);
          });
      });
    },
    declineRequest(context, payload) {
      return new Promise((resolve) => {
        axios
          .post(`/api/request/decline/${payload}`, "", {
            headers: {
              authorization: `Bearer ${Cookies.get("token")}`,
            },
          })
          .then(() => {
            resolve();
          })

          .catch((err) => {
            console.log(err);
          });
      });
    },
    chats(context) {
      return new Promise((resolve) => {
        axios
          .get("/api/chats", {
            headers: {
              authorization: `Bearer ${Cookies.get("token")}`,
            },
          })
          .then(async (res) => {
            await context.commit("chats", res.data);
            resolve();
          })
          .catch((err) => {
            console.log(err);
          });
      });
    },
    search(context, payload) {
      return new Promise((resolve) => {
        axios
          .get(`/api/users/${payload}`, {
            headers: {
              authorization: `Bearer ${Cookies.get("token")}`,
            },
          })
          .then(async (res) => {
            await context.commit("search", res.data);
            resolve();
          })
          .catch((err) => {
            console.log(err);
          });
      });
    },
    addFriend(context, payload) {
      return new Promise((resolve) => {
        axios
          .post(`/api/friends/${payload}`, "", {
            headers: {
              authorization: `Bearer ${Cookies.get("token")}`,
            },
          })
          .then(async () => {
            resolve();
          })
          .catch((err) => {
            console.log(err);
          });
      });
    },
    getMessages(context, payload) {
      return new Promise((resolve) => {
        axios
          .get(`/api/message/${payload}`, {
            headers: {
              authorization: `Bearer ${Cookies.get("token")}`,
            },
          })
          .then(async (res) => {
            await context.commit("setMessages", res.data);
            resolve();
          })
          .catch((err) => {
            console.log(err);
          });
      });
    },
    deleteFriend(context, payload) {
      return new Promise((resolve) => {
        axios
          .delete(`/api/friends/${payload}`, {
            headers: {
              authorization: `Bearer ${Cookies.get("token")}`,
            },
          })
          .then(() => {
            resolve();
          })
          .catch((err) => {
            console.log(err);
          });
      });
    },
  },
});
