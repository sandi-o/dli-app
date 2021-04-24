const state = {
    access_token: localStorage.getItem("access_token") || '',
    status: '',
    hasLoadedOnce: false,
    profile: {},
    err: []
};

const getters = {
    isAuthenticated: state => !!state.access_token,
    status: state => state.status,
    err: state =>state.err,
    profile: state => state.profile,
};

const actions = {
    //to do reset password that came from the email (with token and session validity)
    //login from the system
    login: ({commit,dispatch}, payload) => {           
        return new Promise((resolve, reject) => {
            commit('AUTH_STATUS','logging in');
            
            payload.http.post('/login', {'email':payload.email, 'password': payload.password})
                .then(response => {        
                    let token = response.data.access_token;
                    commit('AUTH_STATUS','login successful');
                    commit('AUTH_SUCCESS', token);
                    localStorage.setItem('access_token',token)
                    
                    dispatch('user',payload);

                    resolve(token);
                })
                .catch(errors => {      
                    commit('snackbar/SET_SNACKBAR',{text: errors.response.data.message, visible: true, color: 'error'},{ root: true });            
                    commit('AUTH_ERROR', errors.response.data);           
                    reject(errors);
                })
        });
    },
    //logout from the system
    logout: ({commit},payload) => {
        commit('AUTH_STATUS','logging out');
        localStorage.clear();
        return new Promise((resolve, reject) => {
            payload.http.post('/logout')
                .then((response) => {
                    commit('AUTH_STATUS','logout successful');                    
                    commit('AUTH_LOGOUT');
                    commit('CLEAR_AUTH_USER')
                    commit('snackbar/SET_SNACKBAR',{text: response.data.message, visible: true, color: 'success'},{ root: true });            
                    resolve(response.data);
                })
                .catch((err) => {
                    commit('AUTH_ERROR', err.response.data);
                    reject(err);
                });
        })
    },
    // //register a user
    // register: ({commit,dispatch},payload) => {
    //     return new Promise((resolve, reject) => {
    //         commit('AUTH_STATUS','registering user');
            
    //         this._vm.$http.post('/api/register', payload)
    //             .then(response => {
    //                 //to do since register for this web app is supposedly by an authernticated user not just anyone                    
    //                 console.log(response)
                    
    //                 let access_token = 'Bearer ' + response.data.access_token;
    //                 Cookies.set('access_token', access_token);
    //                 this._vm.$http.defaults.headers.common['Authorization'] = access_token;
                    
    //                 commit('AUTH_STATUS','registration successful');
    //                 commit('AUTH_SUCCESS', access_token);
    //                 dispatch('user');
    //                 resolve(access_token);                    
    //             })
    //             .catch(err => {                    
    //                 commit('snackbar/SET_SNACKBAR',{text: err.response.data.message, visible: true, color: 'error'},{ root: true });
    //                 commit('AUTH_ERROR', err.response.data);
                    
    //                 Cookies.remove('access_token');
                    
    //                 reject(err);
    //             })
    //     });
    // },
    // //request for a password reset base on input email
    // reset: ({commit}, payload) => {
    //     commit('AUTH_STATUS','sending forgot password link');
    //     return new Promise((resolve, reject) => {
    //         this._vm.$http.post('/password/email', payload)
    //         .then((response) => {
    //             commit('AUTH_STATUS','email sent');
    //             commit('snackbar/SET_SNACKBAR',{text: response.data.message, visible: true, color: 'success', timeout: -1},{ root: true });
    //             resolve(response.data);
    //         }).catch(errors => {
    //             commit('AUTH_STATUS', 'error sending password email');
    //             commit('snackbar/SET_SNACKBAR',{text: errors.response.data.message, visible: true, color: 'error', timeout: 5000},{ root: true });                 
    //             reject(errors);
    //         });
    //     });
    // },
    //request for the authenticated user details
    user: ({commit, dispatch},payload) => {
        commit('AUTH_STATUS','fetching user')
        return new Promise ((resolve, reject) => {
            payload.http.get('/api/user')
            .then((resp) => {
                commit('AUTH_USER', resp.data);
                resolve(resp.data)
            })
            .catch(errors => {
                commit('snackbar/SET_SNACKBAR',{text: errors.response.data.message, visible: true, color: 'error'},{ root: true });
                // if resp is unauthorized, logout, to
                dispatch('logout')
                commit('AUTH_ERROR', errors.response.data);                
                reject(errors)
            })
        })
    },
};

const mutations = {
    AUTH_STATUS: (state, msg) => {
        state.status = msg;
    },
    AUTH_SUCCESS: (state, access_token) => {
        state.status = 'user authorized';
        state.access_token = access_token;        
        state.hasLoadedOnce = true;        
    },
    AUTH_ERROR: (state, err) => {     
        console.log(err);
        state.err = err;
        state.status = 'error';
        state.hasLoadedOnce = true;
    },
    AUTH_LOGOUT: (state) => {
        state.access_token = '';        
    },
    AUTH_USER: (state, resp) => {
        state.status = 'success';
        state.profile = resp
        state.hasLoadedOnce = true;
    },
    CLEAR_AUTH_USER: (state) => {
        state.profile = {}
    },
};

export default {
    namespaced:true,
    state,
    getters,
    actions,
    mutations,
}