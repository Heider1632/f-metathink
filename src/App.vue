<template>
  <v-app id="keep">
    <v-app-bar
      app
      clipped-left
      color="teal"
    >
      <v-app-bar-nav-icon v-if="$route.path !== '/login'" @click="drawer = !drawer" />
      <span class="title ml-3 mr-5">Meta<span class="font-weight-light">Think</span></span>
      <v-text-field
        v-if="$route.path == '/'"
        solo-inverted
        flat
        hide-details
        label="Search"
        prepend-inner-icon="mdi-magnify"
      />

      <v-spacer />
      
      <v-btn
        v-if="$route.name == 'login'"
        icon 
        @click="go('/register')"
      >
        <v-icon>mdi-account-outline</v-icon>
      </v-btn>
      
      <v-btn
        v-if="$store.state.user"
        icon 
        @click="logout"
      >
        <v-icon>mdi-account-arrow-right-outline</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer
      v-if="validateRoute"
      v-model="drawer"
      app
      clipped
      color="grey lighten-4"
    >
      <v-list
        dense
        class="grey lighten-4"
      >
        <template v-if="$store.state.type == 'list'" >
        <template v-for="(item, i) in items">
          <v-row
            v-if="item.heading"
            :key="i"
            align="center"
          >
            <v-col cols="6">
              <v-subheader v-if="item.heading">
                {{ item.heading }}
              </v-subheader>
            </v-col>
            <v-col
              cols="6"
              class="text-right"
            >
              <v-btn
                small
                text
              >edit</v-btn>
            </v-col>
          </v-row>
          <v-divider
            v-else-if="item.divider"
            :key="i"
            dark
            class="my-4"
          />
          <v-list-item
            v-else
            :key="i"
            link
            @click="go(item.path)"
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="grey--text">
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
        </template>
        <template v-else>
          <draggable v-model="items" :options="{group:{ name:'people',  pull:'clone', put:false }}" @change="log">
            <div v-for="(item, i) in items" :key="i">
              <v-row
                v-if="item.heading"
                :key="i"
                align="center"
              >
                <v-col cols="12">
                  <v-subheader v-if="item.heading">
                    {{ item.heading }}
                  </v-subheader>
                </v-col>
              </v-row>
              <v-divider
                v-else-if="item.divider"
                :key="i"
                dark
                class="my-4"
              />
              <v-list-item
                v-else
                :key="i"
                link
                @click="go(item.path)"
              >
                <v-list-item-action>
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title class="grey--text">
                    {{ item.text }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </div>
          </draggable>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-content>
      <v-container
        fluid
        class="grey lighten-4 fill-height"
      >
        <router-view/>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import draggable from 'vuedraggable'
export default {
  name: 'App',
  components: {
    draggable
  },
  watch: {
    $route (val) {
      if (val.name != 'new'){
        this.$store.commit('setNavbarItems', [
          { icon: 'mdi-lightbulb', text: 'View', path: '/' },
          { divider: true },
          { heading: 'Routes' },
          { icon: 'mdi-plus-circle-outline', text: 'Create new CG', path: '/new' }
        ])

        this.$store.commit('setType', 'list')
      }
    }
  },
  mounted () {

    console.log(this.$route)

    this.$store.dispatch('autoLogin');

    
    this.$store.commit('setNavbarItems', [
      { icon: 'mdi-lightbulb', text: 'View', path: '/' },
      { divider: true },
      { heading: 'Labels' },
      { icon: 'mdi-plus-circle-outline', text: 'Create new CG', path: '/new' }
    ])
  },
  data: () => ({
    drawer: null,
  }),
  methods: {
    go(path){
      // alert(path)
      this.$router.push(path)
    },
    log(evt){
      console.log(evt)
    },
    logout () {
      localStorage.removeItem('jwt');
      this.$store.commit('setUser', null);
      this.$router.push('/login')
    }
  },
  computed: {
    validateRoute(){
      if (this.$route.path == "/login" || this.$route.path == "/register"){
        return false
      }

      return true;
    },
    items: {
      get () {
        return this.$store.state.navbarItems
      },
      set (value) {
        this.$store.commit('setNavbarItems', value)
      }
    }
  }
};
</script>