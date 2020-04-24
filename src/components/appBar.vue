<template>
  <v-app-bar app color="primary" dark>
    <router-link to="/">
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <!-- <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />-->
        <v-toolbar-title style="color: white">Message Me</v-toolbar-title>
      </div>
    </router-link>

    <v-spacer></v-spacer>

    <div class="hidden-sm-and-down">
      <v-btn href="/signup" text>
        <span class="mr-2">Sign up</span>
      </v-btn>

      <v-btn href="/login" text>
        <span class="mr-2">log in</span>
      </v-btn>
    </div>

    <div class="hidden-md-and-up">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <v-navigation-drawer v-model="drawer" app :right="true" absolute temporary>
        <v-list>
          <v-list-item v-for="item in items" :key="item.text" link :to="item.route">
            <v-list-item-content>
              <v-list-item-title style="text-align:center">{{ item.text }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
    </div>
  </v-app-bar>
</template>

<script>
export default {
  name: "appBar",

  data() {
    return {
      drawer: false,
      links1: 2,
      items: [
        { text: "Sign up", route: "/signup" },
        { text: "Log in", route: "/login" }
      ]
    };
  }
};
</script>
