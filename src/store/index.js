import Vue from 'vue';
import Vuex from 'vuex';

import auth from './modules/auth'
import category from './modules/category'
import task from './modules/task'
import todo from './modules/todo'
import user from './modules/user'

//components
import snackbar from './modules/snackbar'


Vue.use(Vuex);

export const store = new Vuex.Store({
    modules: {
        auth,
        category,
        task,
        todo,
        snackbar,
        user
    }
});