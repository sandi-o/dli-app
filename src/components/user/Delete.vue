<template>
    <v-dialog v-model="dialog" max-width="500" persistent scrollable>
        <v-card>
            <v-card-title>{{formTitle}}</v-card-title>
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="12">
                            <div class="overline">Name</div>
                            <div class="body-1">{{user.name}}</div>
                        </v-col>
                        <v-col cols="12">
                            <div class="overline">E-Mail</div>
                            <div class="body-1">{{user.code}}</div>
                        </v-col>
                        <v-col cols="12">
                            <div class="overline">Mobile Number</div>
                            <div class="body-1">{{user.action}}</div>
                        </v-col>
                        <v-col cols="12">
                            <div class="overline">Designation</div>
                            <div class="body-1">{{user.designation}}</div>
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
                <v-btn color="primary" @click="remove" :loading = "loading">
                    <v-icon right dark>mdi-delete-circle</v-icon>
                    Delete
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
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
        remarks: '',
    }),
    computed: {
        user () {
            return this.$store.getters['user/user']
        },
        formTitle() {
            return "Delete this User: " + this.user.id
        }
    },
    methods: {
        close() {
            this.$store.commit('user/CLEAR_USER');
            this.$emit('update:index', -1)    
            this.$emit('reload')
            this.$emit('update:dialog', false)
        },
        remove() {            
            this.loading = true
            this.disabled = true
            this.$store.dispatch('user/remove',{'id':this.user.id,'http': this.$http})
                .then(() => {
                    this.loading = false
                    this.disabled = false                    
                    this.close()
                    setTimeout(() => {                
                        this.$store.commit('snackbar/CLEAR_SNACKBAR');
                    },4000);
                })
                .catch(() => {
                    this.loading = false
                    this.disabled = false
                    setTimeout(() => {                
                        this.$store.commit('snackbar/CLEAR_SNACKBAR');
                    },4000);
                })
        }
    }
}
</script>