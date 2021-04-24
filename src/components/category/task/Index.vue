<template>
<v-dialog v-model="dialog" max-width="700" persistent scrollable>
    <v-card>     
        <v-data-table
            :headers="headers"
            :items="tasks"
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
                            class="mx-1"
                            v-bind="attrs"
                            v-on="on"
                        >
                            New
                        </v-btn>
                    </template>
                    <task-form
                        v-if="formDialog"
                        :dialog.sync="formDialog"
                        :index.sync ="taskIndex"
                        @refresh="initialize"
                    >
                    </task-form>
                </v-dialog>
              
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-btn 
                            v-on="on"
                            class="mx-1 my-1" 
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

                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-btn  
                            v-on="on"
                            class="mx-1 my-1" 
                            color="error"
                            fab 
                            dark 
                            small 
                            @click="close"
                        ><v-icon>mdi-close</v-icon>                                 
                        </v-btn> 
                    </template>
                    <span>Close</span>
                </v-tooltip> 
                            
            </v-toolbar>
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
            </template>
        </v-data-table>
        <task-delete-form v-if="deleteFormDialog" :dialog.sync="deleteFormDialog" :index.sync ="taskIndex" @reload="initialize"></task-delete-form>    
    </v-card>    
</v-dialog>
</template>
<script>
import TaskDeleteForm from '@/components/category/task/Delete';
import TaskForm from '@/components/category/task/Form';

export default {
    components: {
        TaskDeleteForm,
        TaskForm
    },
    props: {
        dialog: Boolean,
        index : {type: Number, default: -1}
    },
    data: () => ({
        taskIndex: -1, 
        dataTableLoader: false,
        deleteFormDialog: false,
        formDialog: false,        
    }),

    computed: {
        category() {
            return this.$store.getters['category/category'];
        },
        tasks() {
            return  this.$store.getters['task/tasks'];
        },
        headers() {
            return [
                { text: 'Id', value: 'id',},            
                { text: 'Name', value: 'name' },				
                { text: 'Actions', value: 'actions', sortable: false, filterable: false },
            ];
        },     
        title() {
            return this.category.name +' Tasks';
        },   
    },

    watch: {
        options: {
			handler() {			
				this.initialize();		
			},
			deep: true,
		},
        $route() {
			this.options.page = 1; // reset page
			this.initialize();
		},
    },

    mounted() {
		this.initialize();
	},

    methods: {
        close() {               
            this.$store.commit('category/CLEAR_CATEGORY');
            this.$emit('update:index', -1);               
            this.$emit('refresh')
            this.$emit('update:dialog', false)
        },
        initialize () {
            this.dataTableLoader = true
            this.$store.dispatch('task/fetchTasks',{'http':this.$http,'options': this.options, 'category': this.category})
                .then(() => {
                    this.dataTableLoader = false
                })
                .catch(() => {
                    this.dataTableLoader = false
                    setTimeout(() => {  this.$store.commit('snackbar/CLEAR_SNACKBAR'); },4000);                 
                }) 
        },

        edit(row) {
            this.taskIndex = this.tasks.indexOf(row);
            this.$store.commit('task/SET_TASK',row);
            this.formDialog = true
        },

        remove (row) {
            this.taskIndex = this.tasks.indexOf(row);
            this.$store.commit('task/SET_TASK',row);
            this.deleteFormDialog = true
        },     
    },
  }
</script>