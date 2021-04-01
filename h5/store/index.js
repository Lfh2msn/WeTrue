import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import login from './modules/login.js'
Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
		login,
  },
  getters
})
export default store
