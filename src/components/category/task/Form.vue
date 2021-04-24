<template>
     <v-form ref="form" v-model="valid" lazy-validation>
        <v-card>
            <v-card-title>{{formTitle}}</v-card-title>
            <v-card-text>
                <v-container fluid>
                <v-row>            
                    <v-col cols="12">
                        <v-text-field
                            v-model="task.name"
                            label="*Name"
                            :rules="rules.name"
                            outlined
                        ></v-text-field>
                    </v-col>                
                </v-row>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-btn color="error" text @click="close" :disabled="disabled">
                    <v-icon right dark>mdi-cancel</v-icon>            
                    Cancel
                </v-btn>
                <v-spacer></v-spacer>           
                <v-btn color="primary" @click="save" :loading="loading">
                    <v-icon right dark>mdi-content-save</v-icon>
                    Save
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-form>
</template>

<script>
export default {
    props: {
        dialog: Boolean,
        index : {type: Number, default: -1}        
    },
    data: () => ({
        disabled: false,        
        loading: false,
        rules: {                     
            name: [v => !!v || 'Name is required',],
        },
        valid: true,        
    }),    
    computed: {        
        category() {
            return this.$store.getters['category/category'];
        },
        formTitle() {
            return this.task.id == undefined ? 'New Task' : "Edit Task (#"+this.task.id+")";
        }
    },
    created() {
        this.task = Object.assign({},  this.$store.getters['task/task']);    
    },
    methods: {
        close() {
             if(this.task.id != undefined) {                
                this.$store.commit('task/CLEAR_TASK');
                this.$emit('update:index', -1)    
            }
            this.task = {}
            this.$emit('refresh')
            this.$emit('update:dialog', false)
        },
        save() {
            
            if(this.$refs.form.validate()) {
                let action = 'task/create'
                if(this.task.id != undefined) {
                    action = 'task/update'
                    this.task._method = 'PATCH'
                }

                this.disabled = true;
                this.loading = true;
                
                this.$store.dispatch(action,{'task':this.task,'http':this.$http,'category_id':this.category.id})
                .then(() => {
                    this.close();
                    this.loading = false;
                    this.disabled = false;
                    setTimeout(() => {  this.$store.commit('snackbar/CLEAR_SNACKBAR'); },4000); 
                })
                .catch(() => {
                    this.loading = false;
                    this.disabled = false;
                    setTimeout(() => { this.$store.commit('snackbar/CLEAR_SNACKBAR'); },4000); 
                });
            }
        }
    }
}
</script>

<style>

</style>