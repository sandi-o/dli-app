const state = {
    categories: [],
    category: {},
    tasks: [],
    status: '', 
};

const getters = {
    categories: state => state.categories,
    category: state => state.category,
    tasks: state => state.tasks,
    status: state => state.status,
};

const actions = {
    fetchCategories: ({commit},payload) => {        
        commit('STATUS','fetching data');
        
        let action = '/api/categories';
        if(payload.options != undefined) {
            const {sortBy, sortDesc,  page, itemsPerPage } = payload.options;
            action = '/api/categories?page='+page  +'&per_page='+itemsPerPage+'&sort_by='+sortBy+'&sort_desc='+sortDesc;
        }
        
        return new Promise((resolve, reject) => {
            payload.http.get(action)
            .then(response => {
                commit('STATUS', 'success');
                commit('SET_CATEGORIES', response.data);
                resolve(response.data);
            })
            .catch(errors => {
                commit('STATUS', 'error');
                commit('snackbar/SET_SNACKBAR',{text: errors.response.data.message, visible: true, color: 'error', timeout: 5000},{ root: true });
                reject(errors);
            })
        });
    },

    create: ({commit}, payload) => {
        commit('STATUS','storing data');
        return new Promise((resolve, reject) => {
            payload.http.post('/api/categories', payload.category)
            .then(response => {
                commit('STATUS', 'stored');
                commit('snackbar/SET_SNACKBAR',{text: response.data.message, visible: true, color: 'success', timeout: 5000},{ root: true });
                resolve(response.data);
            })
            .catch(errors => {
                commit('STATUS', 'error storing');
                commit('snackbar/SET_SNACKBAR',{text: errors.response.data.message, visible: true, color: 'error', timeout: 5000},{ root: true });
                reject(errors);
            })
        });
    },
    remove: ({commit}, payload) => {
        commit('STATUS','removing data');
        return new Promise((resolve, reject) => {
            payload.http.delete('/api/categories/'+payload.id)
            .then(response => {
                commit('STATUS', 'removed');
                commit('snackbar/SET_SNACKBAR',{text: response.data.message, visible: true, color: 'success', timeout: 5000},{ root: true });
                resolve(response.data);
            })
            .catch(errors => {
                commit('STATUS', 'error removing');
                commit('snackbar/SET_SNACKBAR',{text: errors.response.data.message, visible: true, color: 'error', timeout: 5000},{ root: true });
                reject(errors);
            })
        });
    },
    update: ({commit}, payload) => {
        commit('STATUS','updating data');
        return new Promise((resolve, reject) => {
            payload.http.post('/api/categories/'+payload.category.id, payload.category)
            .then(response => {
                commit('STATUS', 'updated');
                commit('snackbar/SET_SNACKBAR',{text: response.data.message, visible: true, color: 'success', timeout: 5000},{ root: true });
                resolve(response.data);
            })
            .catch(errors => {
                commit('STATUS', 'error updating');
                commit('snackbar/SET_SNACKBAR',{text: errors.response.data.message, visible: true, color: 'error', timeout: 5000},{ root: true });
                reject(errors);
            })
        });
    },
};

const mutations = {
    STATUS: (state, status) => {
        state.status = status;
    },
    SET_CATEGORIES: (state, data) => {
        state.categories = data
    },
    CLEAR_CATEGORIES: (state) => {
        state.categories = []
    },
    SET_CATEGORY: (state, category) => {
        state.category = category
    },
    CLEAR_CATEGORY: (state) => {
        state.category = {}
    },
    SET_CATEGORY_DEPTARTMENTS: (state, tasks) => {
        state.tasks = tasks
    },
    CLEAR_CATEGORY_DEPARTMENTS: (state) => {
        state.tasks = []
    }
}

export default {
    namespaced:true,
    state,
    getters,
    actions,
    mutations,
}