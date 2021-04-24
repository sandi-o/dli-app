<template>
     <v-form ref="form" v-model="valid" lazy-validation>
        <v-card>
            <v-card-title>{{formTitle}}</v-card-title>
            <v-card-text>
                <v-container fluid>
                <v-row>            
                    <v-col cols="12">
                        <v-text-field
                            v-model="category.name"
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
        formTitle() {
            return this.category.id == undefined ? 'New Category' : "Edit Category (#"+this.category.id+")";
        }
    },
    created() {
        this.category = Object.assign({},  this.$store.getters['category/category']);    
    },
    methods: {
        close() {
             if(this.category.id != undefined) {                
                this.$store.commit('category/CLEAR_CATEGORY');
                this.$emit('update:index', -1)    
            }
            this.category = {}
            this.$emit('refresh')
            this.$emit('update:dialog', false)
        },
        save() {
            
            if(this.$refs.form.validate()) {
                let action = 'category/create'
                if(this.category.id != undefined) {
                    action = 'category/update'
                    this.category._method = 'PATCH'
                }

                this.disabled = true;
                this.loading = true;

                this.$store.dispatch(action,{'category':this.category,'http':this.$http})
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