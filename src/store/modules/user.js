const state = {
    status: '',
    users: [],    
    user: {},
};

const getters = {
    status: state => state.status,
    users: state => state.users,
    user: state => state.user    
};

const actions = {
    //fetch all users   
    fetchUsers:({commit},payload) => {        
        return new Promise((resolve, reject) => {            
            commit('STATUS','fetching data');
            payload.http.get('/api/users')
            .then(response => {
                commit('STATUS', 'success');
                commit('SET_USERS', response.data);
                resolve(response.data);
            })
            .catch(errors => {
                commit('STATUS', 'error');
                commit('snackbar/SET_SNACKBAR',{text: errors.response.data.message, visible: true, color: 'error', timeout: 5000},{ root: true });
                reject(errors);
            })
        });
    },
    fetchUsersByRole:({commit},payload) => {
        return new Promise((resolve, reject) => {  
            commit('STATUS','fetching data');
            payload.http.get('/api/users/'+payload.role_id+'/role')
            .then(response => {
                commit('STATUS', 'success');             
                // commit('SET_USERS', {'users':response.data, 'role':payload.role_id});

                resolve(response.data);
            })
            .catch(errors => {
                commit('STATUS', 'error');
                commit('snackbar/SET_SNACKBAR',{text: errors.response.data.message, visible: true, color: 'error', timeout: 5000},{ root: true });
                reject(errors);
            })
        });
    },
    //change a user password
    change: ({commit}, payload) => {
        commit('STATUS','changing password');
        return new Promise ((resolve, reject) => {
            payload.http.patch('/api/users/'+payload.id+'/change', payload)
            .then(response => {
                commit('STATUS','password change');
                commit('snackbar/SET_SNACKBAR',{text: response.data.message, visible: true, color: 'success'},{ root: true });
                resolve(response) 
            })
            .catch(errors => {               
                commit('PWD_ERR',errors.response.data); 
                commit('snackbar/SET_SNACKBAR',{text: errors.response.data.message, visible: true, color: 'error', timeout: 5000},{ root: true });
                reject(errors.response.data);
            });
        });
    },
    //create a user (within the system)
    create: ({commit}, payload) => {
        commit('STATUS','storing user');
        return new Promise((resolve, reject) => {
            payload.http.post('/api/users', payload.user)
            .then(response => {
                commit('STATUS', 'user stored');
                commit('snackbar/SET_SNACKBAR',{text: 'Username:' +response.data.email +' Password: '+ response.data.password, visible: true, color: 'success', timeout: -1},{ root: true });
                resolve(response.data);
            })
            .catch(errors => {
                commit('STATUS', 'error storing user');
                commit('snackbar/SET_SNACKBAR',{text: errors.response.data.message, visible: true, color: 'error', timeout: 5000},{ root: true });
                reject(errors);
            })
        });
    },
    //deactivate a user
    deactivate: ({commit}, payload) => {
        commit('STATUS','deactivating user');
        return new Promise((resolve, reject) => {
            payload.http.post('/api/users/'+payload.id+'/deactivate')
            .then(response => {
                commit('STATUS', 'user deactivated');
                commit('snackbar/SET_SNACKBAR',{text: response.data.message, visible: true, color: 'success', timeout: 5000},{ root: true });
                resolve(response.data);
            })
            .catch(errors => {
                commit('STATUS', 'error deactivating user');
                commit('snackbar/SET_SNACKBAR',{text: errors.response.data.message, visible: true, color: 'error', timeout: 5000},{ root: true });
                reject(errors);
            })
        });
    },
    //delete a user
    remove: ({commit}, payload) => {
        commit('STATUS','removing user');
        return new Promise((resolve, reject) => {
            payload.http.delete('/api/users/'+payload.id)
            .then(response => {
                commit('STATUS', 'user removed');
                commit('snackbar/SET_SNACKBAR',{text: response.data.message, visible: true, color: 'success', timeout: 5000},{ root: true });
                resolve(response.data);
            })
            .catch(errors => {
                commit('STATUS', 'error removing user');
                commit('snackbar/SET_SNACKBAR',{text: errors.response.data.message, visible: true, color: 'error', timeout: 5000},{ root: true });
                reject(errors);
            })
        });
    },
    //update a user    
    update: ({commit}, payload) => {
        commit('STATUS','updating user');
        return new Promise((resolve, reject) => {
            payload.http.post('/api/users/'+payload.user.id, payload.user)
            .then(response => {
                commit('STATUS', 'updated');
                commit('snackbar/SET_SNACKBAR',{text: response.data.message, visible: true, color: 'success', timeout: 5000},{ root: true });
                resolve(response.data);
            })
            .catch(errors => {
                commit('STATUS', 'error updating user');
                commit('snackbar/SET_SNACKBAR',{text: errors.response.data.message, visible: true, color: 'error', timeout: 5000},{ root: true });
                reject(errors);
            })
        });
    },

};

const mutations = {
    STATUS : (state, status) => {
        state.status = status 
    },
    SET_USERS: (state, users) => {       
        state.users = users        
    },
    CLEAR_USERS: (state) => {
        state.users = []
    },  
    SET_USER: (state, user) => {
        state.user = user
    },
    CLEAR_USER: (state) => {
        state.user = {}
    },
    PWD_ERR:(state, err) =>{
        let errors=err.errors;
        console.log(errors);
        state.status = 'error';
        state.err = errors;
    }
};

export default {
    namespaced:true,
    state,
    getters,
    actions,
    mutations,
}