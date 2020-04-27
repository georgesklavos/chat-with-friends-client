<template>
  <v-content>
    <searchProfile :show="profile" :data="profileData" @closed="closeProfile"></searchProfile>
    <v-dialog :value="show" @click:outside="close" max-width="600">
      <v-card style="height:70vh">
        <div id="searchAndTitle">
          <h1 style="width:110px; margin-left:40%">Friends</h1>
          <v-text-field
            required
            placeholder="Search..."
            rounded
            outlined
            v-model="friend"
            @input="searchFriends"
            style="padding-bottom:0px;height:50px;margin:0 3% 0 5%"
          ></v-text-field>
        </div>

        <v-list>
          <v-list-item v-for="(friend, index) in friendsInTheList" :key="index">
            <v-col cols sm="7" md="2">
              <v-list-item-avatar size="50">
                <v-img :src="friend.avatar"></v-img>
              </v-list-item-avatar>
            </v-col>

            <v-col cols sm="7" md="4">
              <v-list-item-content>
                <v-list-item-title>
                  {{
                  friend.name
                  }}
                </v-list-item-title>
              </v-list-item-content>
            </v-col>
            <v-col>
              <v-btn text color="error" @click="deleteFriend(friend)">Delete</v-btn>
            </v-col>
            <v-col>
              <v-btn
                absolute
                dark
                top
                outlined
                style="padding-top:10px"
                @click="showProfile(friend)"
              >
                <v-icon color="blue" size="40">account_circle</v-icon>
              </v-btn>
            </v-col>
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>
  </v-content>
</template>

<script>
import searchProfile from "../components/searchProfile";

import { mapGetters } from "vuex";
export default {
  name: "friends",
  components: { searchProfile },
  props: ["show"],
  data() {
    return {
      profile: false,
      profileData: {},
      friend: "",
      friendsInTheList: [],
      headers: [
        {
          text: "Name",
          value: "name"
        },
        { text: "Last Name", value: "lastname" }
      ]
    };
  },
  computed: {
    ...mapGetters(["friends"])
  },
  async created() {
    await this.$store.dispatch("getFriends");
    this.friendsInTheList = this.friends;
  },
  methods: {
    close: function() {
      this.$emit("closed", this.show);
    },
    showProfile: function(data) {
      this.profile = true;
      this.profileData = data;
    },
    deleteFriend: async function(friend) {
      console.log("Clicked");
      console.log(friend);
      const index = this.friendsInTheList.indexOf(friend);
      if (index > -1) {
        this.friendsInTheList.splice(index, 1);
        await this.$store.dispatch("deleteFriend", friend._id);
      }
    },
    closeProfile: function() {
      this.profile = false;
    },
    searchFriends: function() {
      if (this.friend === "") {
        this.friendsInTheList = this.friends;
      } else {
        this.friendsInTheList = [];
        this.friends.forEach(el => {
          if (el.name.includes(this.friend)) {
            this.friendsInTheList.push(el);
          }
        });
      }
    }
  }
};
</script>

<style scoped>
.searchAndTitle {
  position: -webkit-sticky;
  position: sticky;
  top: 10px;
}
</style>
