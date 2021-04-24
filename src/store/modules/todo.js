const state = {
    todos: [],
    todo: {},
    status: '', 
};

const getters = {
    todos: state => state.todos,
    todo: state => state.todo,
    status: state => state.status,
};

const actions = {
    fetchTodos: ({commit},payload) => {        
        commit('STATUS','fetching data');
    
        return new Promise((resolve, reject) => {
            payload.http.get('/api/todos')
            .then(response => {
                commit('STATUS', 'success');
                commit('SET_TODOS', response.data);
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
            payload.http.post('/api/todos', payload.todo)
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
            payload.http.delete('/api/todos/'+payload.id)
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
            payload.http.post('/api/todos/'+payload.todo.id, payload.todo)
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
    SET_TODOS: (state, data) => {
        state.todos = data
    },
    CLEAR_TODOS: (state) => {
        state.todos = []
    },
    SET_TODO: (state, todo) => {
        state.todo = todo
    },
    CLEAR_TODO: (state) => {
        state.todo = {}
    },
}

export default {
    namespaced:true,
    state,
    getters,
    actions,
    mutations,
}