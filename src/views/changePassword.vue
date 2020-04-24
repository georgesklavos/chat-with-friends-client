<template>
  <v-content class="changePassword">
    <v-btn absolute dark top left outlined href="/chat">
      <v-icon color="blue" size="50">keyboard_backspace</v-icon>
    </v-btn>
    <v-row align="center" justify="center" style="margin-top:25vh">
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
              v-model="password"
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[rules.required]"
              :type="show1 ? 'text' : 'password'"
              name="input-10-1"
              label="Password"
              @click:append="show1 = !show1"
            ></v-text-field>
            <v-text-field
              v-model="confirmPassword"
              :rules="[rules.required, rules.same]"
              type="password"
              name="input-10-1"
              label="Confirm Password"
              @click:append="show2 = !show2"
            ></v-text-field>

            <v-btn color="blue" @click="changePass()" class="mr-10">Save</v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-content>
</template>

<script>
export default {
  name: "changePassword",
  data() {
    return {
      password: "",
      confirmPassword: "",
      valid: false,
      show1: false,
      rules: {
        required: value => !!value || "Required.",
        min: v => v.length >= 8 || "Min 8 characters",
        same: () =>
          this.password == this.confirmPassword ||
          "New passsword and confirm must be the same"
      }
    };
  },
  methods: {
    changePass: function() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch("updateProfile", { password: this.password });
      }
    }
  }
};
</script>
