<template>
  <v-content class="chat">
    <div class="chatMessages" ref="chatMessages">
      <div v-for="(item,index) in messages" :key="index">
        <div v-if="item.sender !== user._id" style="direction: ltr">
          <v-avatar style="margin-right:10px">
            <img :src="getActiveChat.avatar" />
          </v-avatar>
          <div class="textDiv other">
            <p class="text">{{ item.message }}</p>
          </div>
        </div>
        <div v-if="item.sender === user._id" style="  direction: rtl;">
          <v-avatar style="margin-left:10px">
            <img :src="user.avatar" />
          </v-avatar>
          <div class="textDiv user">
            <p class="text">{{ item.message }}</p>
          </div>
        </div>
      </div>
    </div>

    <div>
      <p id="typeText" style="margin-bottom:0px">{{ textTyping }}</p>
      <div
        style="display:block; margin-bottom:0px"
        v-on:keyup.enter="sendMessage()"
        @keypress="sendPress()"
        class="messageForm"
      >
        <v-text-field
          required
          placeholder="Right a message"
          rounded
          outlined
          class="input"
          v-model="message"
          style="padding-bottom:0px"
        ></v-text-field>
      </div>
    </div>
  </v-content>
</template>

<script>
import io from "socket.io-client";
import Cookies from "js-cookie";
import { mapGetters } from "vuex";

export default {
  name: "chat",
  data() {
    return {
      valid: false,
      message: "",
      socket: io("http://localhost:3000", {
        query: { token: `${Cookies.get("token")}` }
      }),
      typing: false,
      textTyping: "",
      timeout: ""
    };
  },
  computed: {
    ...mapGetters(["user", "messages", "getActiveChat"])
  },
  async created() {
    // await this.$store.dispatch("profile");
    console.log(`messageSend-${this.user._id}-${this.getActiveChat.chat}`);
    this.socket.on(
      `messageSend-${this.user._id}-${this.getActiveChat.chat}`,
      async value => {
        this.messages.push(value);
        this.$nextTick(() => {
          this.autoScroll();
        });
      }
    );

    this.socket.on(
      `receiveType-${this.user._id}-${this.getActiveChat.chat}`,
      async data => {
        if (data.type) {
          this.typing = true;
          this.textTyping = `${data.name} is typing`;
        } else {
          this.textTyping = "";
          this.typing = false;
        }
      }
    );
    this.$nextTick(() => {
      this.$refs.chatMessages.scrollTop = this.$refs.chatMessages.scrollHeight;
    });
  },
  updated() {
    this.$refs.chatMessages.scrollTop = this.$refs.chatMessages.scrollHeight;
  },

  methods: {
    timeoutFunction: function() {
      this.typing = false;
      this.socket.emit(`type-${this.user._id}`, {
        name: this.user.name,
        userId: this.getActiveChat.user,
        chat: this.getActiveChat.chat,
        type: false
      });
    },
    sendPress: function() {
      this.socket.emit(`type-${this.user._id}`, {
        name: this.user.name,
        userId: this.getActiveChat.user,
        chat: this.getActiveChat.chat,
        type: true
      });
      clearTimeout(this.timeout);
      this.timeout = setTimeout(this.timeoutFunction, 2000);
    },
    sendMessage: function() {
      this.message = this.message.trim();
      if (this.message) {
        let data = {
          friend: this.getActiveChat.user,
          chat: this.getActiveChat.chat,
          message: this.message,
          sender: this.user._id
        };

        this.socket.emit(`messageGet-${this.user._id}`, data);

        this.messages.push({
          sender: this.user._id,
          message: this.message
        });
        this.message = "";
      }

      this.$nextTick(() => {
        this.autoScroll();
      });
    },
    autoScroll: function() {
      // New message element
      const $newMessage = this.$refs.chatMessages.lastElementChild;
      // Height of the new message
      const newMessageStyles = getComputedStyle($newMessage);
      const newMessageMargin = parseInt(newMessageStyles.marginBottom);
      const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;
      // Visible height
      const visibleHeigth = this.$refs.chatMessages.offsetHeight;
      // Heigth of messages container
      const containerHeight = this.$refs.chatMessages.scrollHeight;
      // How far have i scrolled?
      const scrollOffset = this.$refs.chatMessages.scrollTop + visibleHeigth;
      if (containerHeight - newMessageHeight <= scrollOffset) {
        this.$refs.chatMessages.scrollTop = this.$refs.chatMessages.scrollHeight;
      }
    }
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}
.chatMessages::-webkit-scrollbar {
  width: 9px;
  background-color: #f5f5f5;
}

#typeText:empty::before {
  background: black;
  content: "\200b";
}

.chatMessages::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #f5f5f5;
}

.chatMessages::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #828282;
}

.chatMessages {
  display: block;
  flex-grow: 1;
  padding: 24px 5px 0 5px;
  overflow-y: scroll;
  height: 86vh;
  width: 100.8%;
  margin-bottom: 10px;
}

.text {
  display: block;
  white-space: pre-wrap;
  word-break: break-all;
  padding: 8px;
  text-align: center;
  width: auto;
  margin-bottom: 0;
}
.chat {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  max-height: 100vh;
}
.textDiv {
  box-sizing: border-box;
  border-radius: 20px 0 20px 20px;
  display: inline-block;
  max-width: 40%;
  width: auto;
  margin-top: 20px;
}

.user {
  background: #2196f3;
  color: white;
}
.other {
  background: #d7e5f7;
  border-radius: 0 25px 25px 25px;
}
.messageForm {
  display: flex;
}
</style>
