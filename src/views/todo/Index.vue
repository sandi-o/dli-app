<template>
    <v-container fluid>
        <v-data-table
            :headers="headers"
            :items="todos"
            :loading="dataTableLoader"
            sort-by="completed_count"
			sort-desc            
            loading-text="Fetching Data, Please wait..."
            class="elevation-1"
        >
            <template v-slot:top>
            <v-toolbar
                flat
            >
                <v-toolbar-title>{{title}}</v-toolbar-title>
                <v-divider
                    class="mx-4"
                    inset
                    vertical
                ></v-divider>
                <v-spacer></v-spacer>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-btn 
                            v-on="on"
                            class="mb-2 ml-1" 
                            :color="searchColor"
                            fab 
                            dark 
                            small
                            @click="search" 
                            :loading="dataTableLoader"
                        ><v-icon dark>{{searchIcon}}</v-icon>
                        </v-btn> 
                    </template>
                    <span>Search</span>
                </v-tooltip>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-btn 
                            v-on="on"
                            class="mb-2 ml-1" 
                            color="accent"
                            fab 
                            dark 
                            small
                            @click="initialize" 
                            :loading="dataTableLoader"
                        ><v-icon dark>mdi-refresh</v-icon>
                        </v-btn> 
                    </template>
                    <span>Refresh</span>
                </v-tooltip>             
            </v-toolbar>
            </template>

            <template v-slot:item.completed="{item}">
                <v-icon v-if="item.completed" color="success" >mdi-check</v-icon>
                <v-icon v-else color="error">mdi-close</v-icon>
            </template>

        </v-data-table>
    </v-container>
</template>
<script>
export default {
    data: () => ({
        todoIndex: -1, 
        dataTableLoader: false,
        filtered: false,
        formDialog: false,        
        searchDialog: false
    }),

    computed: {
        todos() {
            return  this.$store.getters['todo/todos'];
        },
        headers() {
            return [
                { text: 'User', value: 'user.name' },
                { text: 'Completed Count', value: 'completed_count' },
                
            ];
        },
        searchColor() {
			return this.filtered ? 'success' : 'secondary';
		},
		searchIcon() {
			return this.filtered ? 'mdi-filter' : 'mdi-magnify';
		},
        title() {
            return 'To Do\'s';
        },     
    },

    watch: {
        filtered (val) {
            if(!val) this.initialize();
        },
        options: {
			handler() {			
				this.initialize();		
			},
			deep: true,
		},
        $route() {
			// this.$store.commit('fault/CLEAR_FILTERS'); // clear filters
			this.filtered = false; // reset filter
			this.options.page = 1; // reset page
			this.initialize();
		},
    },

    mounted() {
		this.initialize();
	},

    methods: {
        initialize () {
            this.dataTableLoader = true
            this.$store.dispatch('todo/fetchTodos',{'http':this.$http,'options': this.options})
                .then(() => {
                    this.dataTableLoader = false
                })
                .catch(() => {
                    this.dataTableLoader = false
                    setTimeout(() => {  this.$store.commit('snackbar/CLEAR_SNACKBAR'); },4000);                 
                }) 
        },
        search() {
            this.searchDialog = true
        }        
    },
  }
</script>