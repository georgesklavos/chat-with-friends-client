<template>
  <v-content class="signUp">
    <app-bar></app-bar>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="mx-auto my-12" max-width="400">
          <v-form
            align="center"
            ref="form"
            v-model="valid"
            lazy-validation
            class="pa-md-7 mx-lg-auto"
          >
            <v-text-field :rules="[rules.required]" v-model="signUp.name" label="Name"></v-text-field>
            <v-text-field :rules="[rules.required]" v-model="signUp.lastname" label="Last Name"></v-text-field>
            <v-text-field
              :error-messages="emailUsed"
              :rules="[rules.required, rules.email]"
              v-model="signUp.email"
              label="Email"
            ></v-text-field>
            <v-text-field
              v-model="signUp.password"
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[rules.required, rules.min]"
              :type="show1 ? 'text' : 'password'"
              name="input-10-1"
              label="Password"
              hint="At least 8 characters"
              counter
              @click:append="show1 = !show1"
            ></v-text-field>
            <v-menu v-model="menu" :close-on-content-click="false" ref="menu" max-width="290">
              <template v-slot:activator="{ on }">
                <v-text-field
                  :rules="[rules.required]"
                  v-model="signUp.dateOfBirth"
                  label="Birthday date"
                  readonly
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                ref="picker"
                v-model="signUp.dateOfBirth"
                :max="new Date().toISOString().substr(0, 10)"
                min="1950-01-01"
                @change="save"
              ></v-date-picker>
            </v-menu>

            <v-radio-group :rules="[rules.required]" label="Gender:" v-model="signUp.gender" row>
              <v-radio label="Male" value="Male"></v-radio>
              <v-radio label="Female" value="Female"></v-radio>
              <v-radio label="Other" value="Other"></v-radio>
            </v-radio-group>

            <v-btn color="blue" @click="showSignUp()" class="mr-10">Sign up</v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-content>
</template>

<script>
import appBar from "../components/appBar.vue";
import { mapGetters } from "vuex";
export default {
  name: "Home",
  components: { appBar },
  data() {
    return {
      show1: false,
      menu: false,
      valid: false,
      signUp: {
        name: "",
        lastname: "",
        password: "",
        gender: null,
        email: "",
        dateOfBirth: ""
      },

      rules: {
        required: value => !!value || "Required.",
        min: v => v.length >= 8 || "Min 8 characters",
        email: v => /.+@.+\..+/.test(v) || "E-mail must be valid"
      }
    };
  },
  created() {
    this.$store.commit("usedEmail", false);
  },

  computed: {
    ...mapGetters(["usedEmail", "usedEmail"]),
    emailUsed() {
      const errors = [];
      if (this.usedEmail) {
        errors.push("This email is already in use");
        return errors;
      } else {
        return [];
      }
    }
  },
  watch: {
    menu(val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = "YEAR"));
    }
  },
  methods: {
    showSignUp: function() {
      if (this.$refs.form.validate()) {
        this.$store.commit("usedEmail", false);
        this.$store.dispatch("signUp", this.signUp);
      }
    },
    save(date) {
      this.$refs.menu.save(date);
    }
  }
};
</script>
