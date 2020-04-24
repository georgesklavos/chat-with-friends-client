<template>
  <v-content>
    <v-overlay :value="load">
      <v-progress-circular indeterminate size="100" color="light-blue"></v-progress-circular>
    </v-overlay>

    <div v-show="load === false">
      <v-row align="center" no-gutters>
        <v-col cols="12" sm="4" md="3">
          <v-card class="pa-2" outlined tile style="height: 100vh;">
            <friends-and-search @loaded="showPage" @messages="loadChat"></friends-and-search>
          </v-card>
        </v-col>
        <v-col cols="12" sm="4" md="7">
          <v-card class="pa-2" outlined tile style="height: 100vh;">
            <chat v-if="chat"></chat>
          </v-card>
        </v-col>
        <v-col cols="12" sm="2">
          <v-card class="pa-2" outlined tile style="height: 100vh;">
            <info-chat></info-chat>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-content>
</template>

<script>
import infoChat from "../components/infoChat";
import chat from "../components/chat";
import friendsAndSearch from "../components/friendsAndSearch";

export default {
  name: "Chat",
  components: { infoChat, chat, friendsAndSearch },
  data() {
    return {
      load: true,
      chat: false
    };
  },
  methods: {
    showPage: function(value) {
      if (value) {
        this.load = false;
      }
    },
    loadChat: function(value) {
      if (value) {
        this.chat = value;
      }
    }
  },
  async created() {
    this.load = true;
  }
};
</script>
