<template>
  <v-app id="inspire">
    <app-snackbar></app-snackbar>
    <v-navigation-drawer
      v-if="authenicated"
      v-model="drawer"
      app
    >
      <template v-slot:prepend>
        <v-list>
          <v-list-item three-line>
            <v-list-item-avatar color="primary">
              <v-icon>mdi-account-circle</v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>{{profile.name}}</v-list-item-title>
              <v-list-item-subtitle>
                  
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn icon color='accent' class='mr-3' v-on="on">
                          <v-icon>mdi-history</v-icon> 
                      </v-btn>
                    </template>
                    <span>Last Activity: {{profile.last_login_at}}</span>
                  </v-tooltip>
              
                  <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                      <v-btn icon color='deep-purple' class='mr-3' v-on="on">
                          <v-icon>mdi-lock-open</v-icon>
                      </v-btn>
                    </template>
                    <span>Change Password</span>
                  </v-tooltip>
              
                  <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                      <v-btn icon color='deep-orange' class='mr-3' v-on="on" @click="logout">
                          <v-icon>mdi-logout-variant</v-icon>
                      </v-btn>
                      </template>
                    <span>Logout</span>
                  </v-tooltip>

              </v-list-item-subtitle>              
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </template>
      
      <v-divider></v-divider>

      <v-list>
        <template v-for="item in items">
          <v-list-group            
              v-if="item.children"                 
              :key="item.title" 
              :prepend-icon="item.icon" 
              :append-icon="item['icon-alt'] ? item['icon-alt'] : ''"
              color="secondary"
          >
            <template v-slot:activator>                    
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </template>
            <v-list-item color="primary" v-for="(child, i) in item.children" :key="i" router :to="child.link">
              <v-list-item-icon  v-if="child.icon" >
                <v-icon v-text="child.icon"></v-icon>
              </v-list-item-icon>       
              <v-list-item-title v-text="child.title"></v-list-item-title>                            
            </v-list-item>
          </v-list-group>

          <v-list-item color="primary" v-else :key="item.title" link router :to="item.link" >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>   
    </v-navigation-drawer>

    <v-app-bar v-if="authenicated" app class="primary" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>Ideas</v-toolbar-title>
    </v-app-bar>

    <v-main>
        <router-view></router-view>
    </v-main>
    <v-footer v-if="authenicated" padless class="font-weight-medium secondary" dark>
        <v-col class="text-center" cols="12">
            <span class="px-4">&copy; {{ new Date().getFullYear() }} - Ideas</span>
        </v-col>
    </v-footer>
  </v-app>
</template>

<script>
  export default {
    data: () => ({ 
      drawer: null ,
      items: [
        { icon: 'mdi-file-document-multiple', title: 'Categories' ,link: '/category', slug: 'category_menu' },
        { icon: 'mdi-format-list-checks', title: 'To Do\'s', link: '/todo', slug: 'todo_menu' },          
      ],    
    }),
    computed: {
      authenicated() {
        return this.$store.getters['auth/isAuthenticated'];
      },
      profile() {
        return this.$store.getters['auth/profile']; 
      }
    },
    created() {
      if(this.authenicated){
        this.getUser();  
      }
    },  
    methods: {
      getUser() {       
        this.$store.dispatch('auth/user',{'http':this.$http})
          .then(() => {
          })
          .catch(() => {
            setTimeout(() => { this.$store.commit('snackbar/CLEAR_SNACKBAR');},4000)
            window.location.replace('/login')
          });
      },  
      logout() {
        this.$store.dispatch('auth/logout', {'http':this.$http})
          .then(() => {
            this.$router.push({name:'Login'})
            setTimeout(() => { this.$store.commit('snackbar/CLEAR_SNACKBAR');},4000)
          })
          .catch(() => {
            this.$router.push({name:'Login'})
          });
      }
    }
  }
</script>