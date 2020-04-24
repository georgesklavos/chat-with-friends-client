<template>
  <v-content class="profile">
    <v-overlay :value="load">
      <v-progress-circular indeterminate size="100" color="light-blue"></v-progress-circular>
    </v-overlay>
    <v-btn absolute dark top left outlined href="/chat">
      <v-icon color="blue" size="50">keyboard_backspace</v-icon>
    </v-btn>
    <v-row align="center" justify="center" style="margin-top:10vh">
      <v-col cols="12" sm="8" md="4">
        <v-card class="mx-auto my-12" max-width="400">
          <v-form
            align="center"
            ref="form"
            v-model="valid"
            lazy-validation
            class="pa-md-7 mx-lg-auto"
          >
            <v-avatar size="120">
              <img :src="user.avatar" alt="John" />
            </v-avatar>

            <v-text-field :rules="[rules.required]" v-model="user.name" label="Name"></v-text-field>
            <v-text-field :rules="[rules.required]" v-model="user.lastname" label="Last Name"></v-text-field>
            <v-text-field
              :rules="[rules.required, rules.email]"
              v-model="user.email"
              label="Email"
              disabled
            ></v-text-field>

            <v-menu v-model="menu" :close-on-content-click="false" ref="menu" max-width="290">
              <template v-slot:activator="{ on }">
                <v-text-field
                  :rules="[rules.required]"
                  v-model="user.dateOfBirth"
                  label="Birthday date"
                  readonly
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                ref="picker"
                v-model="user.dateOfBirth"
                :max="new Date().toISOString().substr(0, 10)"
                min="1950-01-01"
                @change="save"
              ></v-date-picker>
            </v-menu>

            <v-text-field :rules="[rules.required]" v-model="user.gender" label="Gender" disabled></v-text-field>

            <v-btn color="blue" @click="changeProfile()" class="mr-10">Save</v-btn>
            <v-btn
              color="blue"
              style="margin-left:40px"
              @click="pickAFile()"
              class="mr-10"
            >Change image</v-btn>

            <input
              type="file"
              hidden
              ref="fileInput"
              accept="image/jpg, image/jpeg, image/png"
              @change="onFilePicked"
            />
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-content>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Profile",
  data() {
    return {
      show1: false,
      menu: false,
      valid: false,
      avatar: null,
      load: false,

      objectToSend: {
        name: "",
        lastname: "",
        dateOfBirth: ""
      },
      rules: {
        required: value => !!value || "Required.",
        min: v => v.length >= 8 || "Min 8 characters",
        email: v => /.+@.+/.test(v) || "E-mail must be valid"
      }
    };
  },
  watch: {
    menu(val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = "YEAR"));
    }
  },

  async created() {
    this.$store.dispatch("profile");
  },
  computed: {
    ...mapGetters(["user"])
  },
  methods: {
    ...mapActions(["uploadImage", "profile"]),
    changeProfile: async function() {
      this.load = true;
      Object.keys(this.objectToSend).forEach(el => {
        this.objectToSend[el] = this.user[el];
      });
      await this.$store
        .dispatch("updateProfile", this.objectToSend)
        .then(() => {
          this.load = false;
        });
    },
    async save(date) {
      this.$refs.menu.save(date);
    },
    pickAFile: function() {
      this.$refs.fileInput.click();
    },
    onFilePicked: async function(event) {
      this.load = true;
      await this.$store
        .dispatch("uploadImage", event.target.files[0])
        .then(async () => {
          await this.$store.dispatch("profile").then(() => {
            this.load = false;
          });
        });
    }
  }
};
</script>
