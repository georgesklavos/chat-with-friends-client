<template>
  <div>
    <v-dialog :value="show" @click:outside="close" max-width="400">
      <v-card>
        <v-form align="center" class="pa-md-7 mx-lg-auto">
          <v-avatar size="120">
            <img :src="data.avatar" alt="John" />
          </v-avatar>

          <v-text-field v-model="data.name" label="Name" disabled></v-text-field>
          <v-text-field v-model="data.lastname" label="Last Name" disabled></v-text-field>
          <v-text-field v-model="data.email" label="Email" disabled></v-text-field>

          <v-text-field disabled v-model="date"></v-text-field>

          <v-text-field v-model="data.gender" label="Gender" disabled></v-text-field>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "searchProfile",
  props: ["show", "data"],
  data() {
    return {};
  },
  computed: {
    date: function() {
      return moment(this.data.dateOfBirth).format("YYYY-MM-DD");
    }
  },
  methods: {
    close: function() {
      this.$emit("closed", this.show);
    }
  }
};
</script>