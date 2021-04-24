<template>
    <v-container fluid>
        <v-data-table
            :headers="headers"
            :items="categories"
            :options.sync="options"
			:server-items-length="totalCategories"
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
                    max-width="700px"
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
                    <category-form
                        v-if="formDialog"
                        :dialog.sync="formDialog"
                        :index.sync ="categoryIndex"
                        @refresh="initialize"
                    >
                    </category-form>
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

            <template v-slot:item.color="{ item }">
                <v-icon  :color="item.color" >mdi-palette</v-icon>
            </template>
            
            <template v-slot:item.actions="{item}">
                <v-tooltip bottom>
                    <template v-slot:activator="{on}">
                        <v-icon                
                            class="mx-1 my-1"
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
                    <template v-slot:activator="{on}">
                        <v-icon
                            v-on="on"
                            color="error"
                            class="mx-1 my-1"
                            @click="remove(item)"
                        >
                            mdi-delete
                        </v-icon>
                    </template>
					<span>Delete</span>
                </v-tooltip>

                <v-tooltip bottom>
                    <template v-slot:activator="{on}">
                        <v-icon
                            v-on="on"
                            color="accent"
                            class="mx-1 my-1"
                            @click="task(item)"
                        >
                            mdi-format-list-numbered
                        </v-icon>
                    </template>
					<span>Tasks</span>
                </v-tooltip>
            </template>
        </v-data-table>
        <category-delete-form v-if="deleteFormDialog" :dialog.sync="deleteFormDialog" :index.sync ="categoryIndex" @reload="initialize"></category-delete-form>
        <tasks v-if="taskDialog" :dialog.sync="taskDialog" :index.sync ="categoryIndex" @reload="initialize"></tasks>
    </v-container>
</template>
<script>
import CategoryDeleteForm from '@/components/category/Delete';
import CategoryForm from '@/components/category/Form';
import Tasks from '@/components/category/task/Index';

export default {
    components: {
        CategoryDeleteForm,
        CategoryForm,
        Tasks
    },
    data: () => ({
        categoryIndex: -1, 
        dataTableLoader: false,
        deleteFormDialog: false,
        filtered: false,
        formDialog: false,        
        options: {},
        taskDialog: false,
        searchDialog: false
    }),

    computed: {
        categories() {
            return  this.$store.getters['category/categories'].data;
        },
        headers() {
            return [
                { text: 'Id', value: 'id',},            
                { text: 'Name', value: 'name' },				
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
            return 'Categories';
        },
        totalCategories() {
            return this.$store.getters['category/categories'].total;
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
            this.$store.dispatch('category/fetchCategories',{'http':this.$http,'options': this.options})
                .then(() => {
                    this.dataTableLoader = false
                })
                .catch(() => {
                    this.dataTableLoader = false
                    setTimeout(() => {  this.$store.commit('snackbar/CLEAR_SNACKBAR'); },4000);                 
                }) 
        },

        edit(row) {
            this.categoryIndex = this.categories.indexOf(row);
            this.$store.commit('category/SET_CATEGORY',row);
            this.formDialog = true
        },

        remove (row) {
            this.categoryIndex = this.categories.indexOf(row);
            this.$store.commit('category/SET_CATEGORY',row);
            this.deleteFormDialog = true
        },
        
        task (row) {
            this.categoryIndex = this.categories.indexOf(row);
            this.$store.commit('category/SET_CATEGORY',row);
            this.taskDialog = true
        },

        search() {
            this.searchDialog = true
        }        
    },
  }
</script>