<template>
  <v-content>
    <v-row>
      <v-col>
        <v-row style="margin-left:25%">
          <v-avatar size="150">
            <v-img :src="getActiveChat.avatar"></v-img>
          </v-avatar>
        </v-row>
        <v-row style="margin:30px 0 0 22%">
          <h2>{{getActiveChat.firstName + " " + getActiveChat.lastname}}</h2>
        </v-row>
      </v-col>
    </v-row>
  </v-content>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "infoChat",

  data() {
    return {};
  },
  computed: {
    ...mapGetters(["getActiveChat"])
  }
};
</script>
