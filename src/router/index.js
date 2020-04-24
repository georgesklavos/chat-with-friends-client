import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/home.vue";
import Cookies from "js-cookie";

// import friendsAndSearch from "../components/friendsAndSearch.vue"
// import signUp from "../views/signUp.vue";
// import signIn from "../views/signIn.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    beforeEnter: (to, from, next) => {
      if (Cookies.get("token")) {
        next("/chat");
      } else {
        next();
      }
    }
  },
  {
    path: "/signup",
    name: "Sign Up",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import("../views/signUp.vue"),
    beforeEnter: (to, from, next) => {
      if (Cookies.get("token")) {
        next("/chat");
      } else {
        next();
      }
    }
  },
  {
    path: "/login",
    name: "Log in",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import("../views/logIn.vue"),
    beforeEnter: (to, from, next) => {
      if (Cookies.get("token")) {
        next("/chat");
      } else {
        next();
      }
    }
  },
  {
    path: "/chat",
    name: "Chat",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import("../views/chat.vue"),
    beforeEnter: (to, from, next) => {
      if (Cookies.get("token")) {
        next();
      } else {
        next("/login");
      }
    }
  },
  {
    path: "/profile",
    name: "Profile",

    component: () => import("../views/profile.vue"),
    beforeEnter: (to, from, next) => {
      if (Cookies.get("token")) {
        next();
      } else {
        next("/login");
      }
    }
  },
  {
    path: "/changePassword",
    name: "Change Password",

    component: () => import("../views/changePassword.vue"),
    beforeEnter: (to, from, next) => {
      if (Cookies.get("token")) {
        next();
      } else {
        next("/login");
      }
    }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
