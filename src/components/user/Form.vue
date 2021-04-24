<template>
    <v-form ref="form" v-model="valid" lazy-validation>
        <v-card>
            <v-card-title>{{formTitle}}</v-card-title>
            <v-card-text>
                <v-container fluid>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field
                                v-model="user.name"
                                label="*Name"
                                :rules="rules.name"
                                outlined
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field
                                v-model="user.email"
                                label="*E-mail"
                                required
                                :rules="rules.email"
                                outlined
                            ></v-text-field>
                        </v-col>    
                         <v-col cols="12">
                            <v-text-field
                                v-model="user.mobile_no"
                                label="*Mobile No."
                                required
                                :rules="rules.mobile_no"
                                outlined
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field
                                v-model="user.designation"
                                label="Designation"
                                outlined
                            ></v-text-field>
                        </v-col>                     
                        <v-col cols="12" md="6">
                            <v-checkbox 
                                v-if="isEdit"
                                v-model ="user.is_active" 
                                label="Active"
                            ></v-checkbox>  
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-checkbox  
                                v-if="isEdit"                               
                                v-model ="user.is_admin" 
                                label="Super Admin"
                            ></v-checkbox>  
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
        user: {},
        roles:[],
        disabled: false,        
        loading: false,
        rules: {            
            email: [v => !!v || 'E-Mail is required',],
            name: [v => !!v || 'Name is required',],
            mobile_no: [v => !!v || 'Mobile No. is required',],
        },
        valid: true,        
    }),    
    computed: {
        formTitle() {
            return this.user.id == undefined ? 'New User' : "Edit User (#"+this.user.id+")";
        },
        isEdit() {
            return this.user.id != undefined ? true : false;
        }
    },
    created() {
        this.user = Object.assign({},  this.$store.getters['user/user']);
        
        if(this.user.id != undefined) {
            for(var role of this.user.roles) {
                this.roles.push(role.id);
            }
        }
    },
    methods: {
        close() {
             if(this.user.id != undefined) {                
                this.$store.commit('user/CLEAR_USER');
                this.$emit('update:index', -1)    
            }
            this.user = {}
            this.$emit('refresh')
            this.$emit('update:dialog', false)
        },
        save() {
            if(this.$refs.form.validate()) {
                let action = 'user/create'
                if(this.user.id != undefined) {
                    action = 'user/update'
                    this.user._method = 'PATCH'
                }
            
                this.disabled = true;
                this.loading = true;
                 
                this.user.roles = JSON.stringify(this.roles)

                this.$store.dispatch(action,{'user':this.user,'http':this.$http})
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