const state = {
    tasks: [],
    task: {},
    status: '', 
};

const getters = {
    tasks: state => state.tasks,
    task: state => state.task,
    status: state => state.status,
};

const actions = {
    fetchTasks: ({commit},payload) => {        
        commit('STATUS','fetching data');
    
        return new Promise((resolve, reject) => {
            payload.http.get('/api/tasks/'+payload.category.id)
            .then(response => {
                commit('STATUS', 'success');
                commit('SET_TASKS', response.data);
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
            payload.http.post('/api/tasks/'+payload.category_id, payload.task)
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
            payload.http.delete('/api/tasks/'+payload.id)
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
            payload.http.post('/api/tasks/'+payload.task.id, payload.task)
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
    SET_TASKS: (state, data) => {
        state.tasks = data
    },
    CLEAR_TASKS: (state) => {
        state.tasks = []
    },
    SET_TASK: (state, task) => {
        state.task = task
    },
    CLEAR_TASK: (state) => {
        state.task = {}
    },
}

export default {
    namespaced:true,
    state,
    getters,
    actions,
    mutations,
}