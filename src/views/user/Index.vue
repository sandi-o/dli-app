<template>
    <v-container fluid>
        <v-data-table
            :headers="headers"
            :items="users"
            :options.sync="options"
			:server-items-length="totalUsers"
            :loading="dataTableLoader"
            sort-by="id"
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
                <v-dialog
                    v-model="formDialog"
                    max-width="500px"
                    persistent
                    scrollable
                >
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            color="primary"
                            dark
                            class="mb-2"
                            v-bind="attrs"
                            v-on="on"
                        >
                            New
                        </v-btn>
                    </template>
                    <user-form
                        v-if="formDialog"
                        :dialog.sync="formDialog"
                        :index.sync ="userIndex"
                        @refresh="initialize"
                    >
                    </user-form>
                </v-dialog>
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

            <template v-slot:item.is_active="{item}">
                <span v-if="item.is_active" class="success--text">Active</span>
                <span v-else class="error--text">Inactive</span>
            </template>

            <template v-slot:item.actions="{item}">
                <v-tooltip bottom>
                    <template v-slot:activator="{on}">
                        <v-icon                
                            class="ml-1 mr-1"
                            v-on="on"
                            color="secondary"
                            @click="edit(item)"
                        >
                            mdi-pencil
                        </v-icon>
                    </template>
					<span>Edit</span>
                </v-tooltip>

                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-icon
                            v-on="on"
                            color="accent"
                            class="ml-1 mr-1"
                            @click="resetPassword(item)"
                        >
                        mdi-lock-reset
                        </v-icon>
                    </template>
                    <span>Reset Password</span>
                </v-tooltip>	

                <v-tooltip bottom>
                    <template v-slot:activator="{on}">
                        <v-icon
                            v-on="on"
                            color="error"
                            class="ml-1 mr-1"
                            @click="remove(item)"
                        >
                            mdi-delete
                        </v-icon>
                    </template>
					<span>Delete</span>
                </v-tooltip>
            </template>
        </v-data-table>
        <user-delete-form v-if="deleteFormDialog" :dialog.sync="deleteFormDialog" :index.sync ="userIndex" @reload="initialize"></user-delete-form>
    </v-container>
</template>
<script>
import UserDeleteForm from '@/components/user/Delete';
import UserForm from '@/components/user/Form';

export default {
    components: {
        UserDeleteForm,
        UserForm
    },
    data: () => ({
        userIndex: -1, 
        dataTableLoader: false,
        deleteFormDialog: false,
        filtered: false,
        formDialog: false,        
        options: {},
        resetDialog: false,
        searchDialog: false
    }),

    computed: {
        users() {
            return  this.$store.getters['user/users'].data;
        },
        headers() {
            return [
                { text: 'Id', value: 'id',},                
                { text: 'Name', value: 'name'},
                { text: 'E-Mail', value: 'email'},
                { text: 'Mobile No.', value: 'mobile_no'},
                { text: 'Designation', value: 'designation'},
                { text: 'Status', value: 'is_active' },
                { text: 'Last Activity', value: 'last_login_at'},
                { text: 'Actions', value: 'actions', sortable: false, filterable: false },
            ];
        },
        searchColor() {
			return this.filtered ? 'success' : 'secondary';
		},
		searchIcon() {
			return this.filtered ? 'mdi-filter' : 'mdi-magnify';
		},
        title() {
            return 'Users';
        },
        totalUsers() {
            return this.$store.getters['user/users'].total;
        }
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
            this.$store.dispatch('user/fetchUsers',{'http':this.$http,'options': this.options})
                .then(() => {
                    this.dataTableLoader = false
                })
                .catch(() => {
                    this.dataTableLoader = false
                    setTimeout(() => {  this.$store.commit('snackbar/CLEAR_SNACKBAR'); },4000);                 
                }) 
        },

        edit(row) {
            this.userIndex = this.users.indexOf(row);
            this.$store.commit('user/SET_USER',row);
            this.formDialog = true
        },

        remove (row) {
            this.userIndex = this.users.indexOf(row);
            this.$store.commit('user/SET_USER',row);
            this.deleteFormDialog = true
        },
        reset(row) {
            this.userIndex = this.users.indexOf(row)
            this.$store.commit('user/SET_USER',row);
            this.resetDialog = true
        },	
        
        search() {
            this.searchDialog = true
        }
    },
  }
</script>