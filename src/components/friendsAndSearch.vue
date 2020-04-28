<template>
  <v-content>
    <searchProfile
      :show="showProfile"
      :data="profileData"
      @closed="closeProfile"
    ></searchProfile>
    <friends :show="showFriends" @closed="closeFriends"></friends>
    <v-overlay :value="load">
      <v-progress-circular
        indeterminate
        size="100"
        color="light-blue"
      ></v-progress-circular>
    </v-overlay>
    <v-row>
      <v-col cols="4" sm="3" md="3">
        <v-avatar style="padding-right:0px" size="80">
          <img :src="user.avatar" />
        </v-avatar>
      </v-col>
      <v-col>
        <h1 style="font-size:300%">Chats</h1>
      </v-col>
      <v-col></v-col>
      <v-col>
        <v-menu offset-y v-model="settings">
          <template v-slot:activator="{ on }">
            <v-btn
              v-on="on"
              :large="true"
              style="margin-top:20px"
              :text="true"
              icon
            >
              <v-icon large color="black">settings</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(item, index) in items"
              :key="index"
              @click="show(item)"
            >
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
      <v-col>
        <v-menu :close-on-content-click="false" offset-y v-model="requests">
          <template v-slot:activator="{ on }">
            <v-btn
              v-on="on"
              :large="true"
              style="margin-top:20px"
              :text="true"
              icon
            >
              <v-badge
                color="blue"
                :content="requestsArray.length"
                :value="requestsArray.length"
                overlap
              >
                <v-icon x-large color="black">person</v-icon>
              </v-badge>
            </v-btn>
          </template>
          <v-list style="max-height: 50vh" class="overflow-y-auto">
            <v-list-item
              v-show="requestsArray.length !== 0"
              v-for="(item, index) in requestsArray"
              :key="index"
            >
              <v-list-item-avatar size="50">
                <v-img :src="item.avatar"></v-img>
              </v-list-item-avatar>
              <v-list-item-title style="margin-left:10px; margin-right:10px;">{{
                item.name + " " + item.lastname
              }}</v-list-item-title>
              <v-btn
                small
                color="primary"
                style="margin-left:10px;"
                @click="accept(item)"
                >Accept</v-btn
              >
              <v-btn
                small
                color="error"
                style="margin-left:10px;"
                @click="decline(item)"
                >Decline</v-btn
              >
            </v-list-item>
            <v-list-item v-show="requestsArray.length === 0">
              <v-list-item-title style="margin-left:10px; margin-right:10px;"
                >You have no friend requests</v-list-item-title
              >
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
    </v-row>
    <v-row style="padding-left:2%; padding-right:2%">
      <v-text-field
        dense
        v-model="search"
        outlined
        rounded
        placeholder="Type for search"
        @input="getSearch"
      ></v-text-field>
      <!-- @blur="close()" -->
    </v-row>
    <v-divider></v-divider>
    <v-col style="max-height: 80vh" class="overflow-y-auto">
      <v-list v-if="search !== '' && loadSearch === true">
        <v-list-item>
          <v-col>
            <v-list-item-content>
              <v-row>
                <v-col cols="12">
                  <v-row justify="center" align="center" style="height:600px">
                    <v-progress-circular
                      color="primary"
                      size="100"
                      indeterminate
                    ></v-progress-circular>
                  </v-row>
                </v-col>
              </v-row>
            </v-list-item-content>
          </v-col>
        </v-list-item>
      </v-list>

      <v-list v-if="search !== '' && loadSearch === false">
        <v-list-item v-for="(friend, index) in searchResults" :key="index">
          <v-list-item-avatar size="50">
            <v-img :src="friend.avatar"></v-img>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{
              friend.name + " " + friend.lastname
            }}</v-list-item-title>
          </v-list-item-content>

          <v-col md="3" style="padding-left:0; padding-right:0;">
            <v-btn
              absolute
              dark
              top
              outlined
              @click="add(friend, index)"
              style="padding-left:1%; padding-right:1%"
            >
              <v-icon color="blue" size="40">{{ personAddIcon[index] }}</v-icon>
            </v-btn>
          </v-col>
          <v-col md="2" style="padding-left:0; padding-right:0;">
            <v-btn
              absolute
              dark
              top
              outlined
              @click="profile(friend)"
              style="padding-left:1%; padding-right:1%"
            >
              <v-icon color="blue" size="40">account_circle</v-icon>
            </v-btn>
          </v-col>
        </v-list-item>
      </v-list>

      <v-list v-if="search !== '' && searchResults.length === 0">
        <v-list-item>
          <v-col>
            <v-list-item-content>
              <v-list-item-title>No users</v-list-item-title>
            </v-list-item-content>
          </v-col>
        </v-list-item>
      </v-list>

      <v-list v-if="search === ''">
        <v-list-item
          v-for="(friend, index) in chats"
          :key="index"
          @click="friendChat(friend)"
        >
          <v-list-item-avatar size="50">
            <v-img :src="friend.avatar"></v-img>
          </v-list-item-avatar>
          <v-col>
            <v-list-item-content>
              <v-list-item-title>{{
                friend.name + " " + friend.lastname
              }}</v-list-item-title>
            </v-list-item-content>
          </v-col>
        </v-list-item>
      </v-list>
    </v-col>
  </v-content>
</template>

<script>
import { mapGetters } from "vuex";
import io from "socket.io-client";
import searchProfile from "../components/searchProfile";
import friends from "../components/friends";
import Cookies from "js-cookie";

export default {
  name: "friendsAndSearch",
  components: { searchProfile, friends },
  data() {
    return {
      settings: false,
      requests: false,
      image: "",
      showProfile: false,
      showFriends: false,
      personAddIcon: [],
      search: "",
      profileData: {},
      searchResults: [],
      loadSearch: false,
      socket: io(process.env.VUE_APP_IO_URL, {
        query: { token: `${Cookies.get("token")}` },
      }),
      load: false,
      value: "",
      items: [
        { title: "Profile", route: "Profile" },
        { title: "Friends", route: "Friends" },
        { title: "Change password", route: "Change Password" },
        { title: "Log out" },
      ],
    };
  },
  computed: mapGetters(["user", "requestsArray", "chats", "getActiveChat"]),

  async created() {
    await this.loadData();
    this.socket.emit("join", this.user.name, (error) => {
      if (error) {
        alert(error);
      }
    });

    this.socket.on(`requestsOn-${this.user._id}`, async () => {
      await this.getRequests();
    });

    this.socket.on(`chats-${this.user._id}`, async () => {
      await this.$store.dispatch("chats");
      await this.$store.dispatch("getFriends");
    });

    this.socket.on(`deleteFriend-${this.user._id}`, async () => {
      await this.$store.dispatch("chats");
      await this.$store.dispatch("getFriends");
    });

    if (this.chats.length > 0) {
      this.$store.commit("setActivateChat", {
        user: this.chats[0]._id,
        chat: this.chats[0].chat,
        firstName: this.chats[0].name,
        lastname: this.chats[0].lastname,
        avatar: this.chats[0].avatar,
      });
      await this.$store.dispatch("getMessages", this.getActiveChat.chat);

      this.$emit("messages", true);
    } else {
      this.$store.commit("setActivateChat", {
        user: "",
        chat: "",
        firstName: "",
        lastname: "",
        avatar: "",
      });

      this.$emit("noFriends");
    }
  },
  methods: {
    add: async function(friend, index) {
      console.log(friend._id);
      console.log(friend.name + " " + friend.lastname);
      this.personAddIcon[index] = "how_to_reg";
      this.load = true;
      this.load = false;
      await this.$store.dispatch("addFriend", friend._id);
    },
    closeProfile() {
      this.showProfile = false;
    },
    closeFriends() {
      this.showFriends = false;
    },
    profile: function(profile) {
      this.showProfile = true;
      this.profileData = profile;
    },
    getSearch: async function() {
      if (this.search.trim()) {
        this.loadSearch = true;
        await this.$store.dispatch("search", this.search);
        this.loadSearch = false;
        this.searchResults = await this.$store.getters.searchResults;

        for (let i = 0; i <= this.searchResults.length; i++) {
          this.personAddIcon[i] = "person_add";
        }
      }
    },
    update: function() {
      this.socket.emit(`requestsOn`, "Client", () => {
        // this.$store.dispatch("getRequests");
        // console.log(data);
      });
    },
    show: function(value) {
      if (value.title === "Log out") {
        this.$store.commit("logOut");
      } else if (value.title === "Friends") {
        this.showFriends = true;
      } else {
        this.$router.push({ name: value.route });
      }
    },
    friendChat: async function(value) {
      this.$store.commit("setActivateChat", {
        user: value._id,
        chat: value.chat,
        firstName: value.name,
        lastname: value.lastname,
        avatar: value.avatar,
      });
      console.log(this.getActiveChat.chat);
      this.$emit("messages", false);
      await this.$store.dispatch("getMessages", this.getActiveChat.chat);
      this.$emit("messages", true);
    },
    loadData: async function() {
      await this.$store.dispatch("profile");
      await this.$store.dispatch("chats");
      await this.getRequests();
      this.$emit("loaded", true);
    },
    getRequests: async function() {
      await this.$store.dispatch("getRequests");
    },
    accept(item) {
      console.log(item);
      const index = this.requestsArray.indexOf(item);
      if (index > -1) {
        this.requestsArray.splice(index, 1);
      }
      this.$store.dispatch("acceptRequest", item._id);
      this.$store.dispatch("getFriends");
    },
    decline(item) {
      console.log(this.requestsArray.indexOf(item));
      const index = this.requestsArray.indexOf(item);
      if (index > -1) {
        this.requestsArray.splice(index, 1);
      }
      // this.$store.commit("setRequests", this.requestsArray);
      this.$store.dispatch("declineRequest", item._id);
    },
  },

  async beforeCreate() {},
  // beforeRouteEnter(to, from, next) {}
};
</script>
