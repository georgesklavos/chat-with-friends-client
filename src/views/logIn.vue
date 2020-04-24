<template>
  <v-content class="signIn">
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
            <v-text-field
              :rules="[rules.required, rules.email]"
              :error-messages="loginWrong"
              v-model="login.email"
              label="Email"
            ></v-text-field>
            <v-text-field
              v-model="login.password"
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[rules.required, rules.min]"
              :type="show1 ? 'text' : 'password'"
              name="input-10-1"
              label="Password"
              hint="At least 8 characters"
              counter
              @click:append="show1 = !show1"
            ></v-text-field>

            <v-btn color="blue" @click="sendLogin()" class="mr-10">Login</v-btn>
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
  components: {
    appBar
  },
  data() {
    return {
      show1: false,
      valid: true,

      login: {
        email: "",
        password: ""
      },
      rules: {
        required: value => !!value || "Required.",
        min: v => v.length >= 8 || "Min 8 characters",
        email: v => /.+@.+\..+/.test(v) || "E-mail must be valid"
      }
    };
  },
  computed: {
    ...mapGetters(["wrongLogin"]),
    loginWrong() {
      const errors = [];
      if (this.wrongLogin) {
        errors.push("This email or password is wrong");
        return errors;
      } else {
        return [];
      }
    }
  },
  created() {
    this.$store.commit("wrongLogin", false);
  },
  methods: {
    sendLogin: function() {
      if (this.$refs.form.validate()) {
        console.log(this.login);
        this.$store.dispatch("login", this.login);
      }
    }
  }
};
</script>
