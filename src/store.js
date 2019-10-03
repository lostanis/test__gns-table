import Vue from 'vue'
import Vuex from 'vuex'
import { createContext } from 'vm';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    db: [],
    ids: [],
    item: {}

  },
  mutations: {
    SET_DB(state, data) {
      state.db = data
    },
    SET_IDS(state) {
      state.ids = state.db.map(item => item.id)
    },
    SET_ITEM(state, item) {
      state.item = item
    }
  },
  actions: {
    async GET_DB({ commit }) {
      try {
        const response = await fetch('/test.json');
        const data = await response.json()
        commit('SET_DB', data)
        commit('SET_IDS')
      } catch (err) {
        console.error('>>>', 'can\'t get DB:', err);
      }
    },
    CHANGE_DB({ commit }, payload) {
      commit('SET_DB', payload)
      commit('SET_IDS')
    },
    async GET_ITEM_BY_ID({ commit, dispatch, state }, id) {
      await dispatch('GET_DB');
      if (state.ids.indexOf(id) < 0) {
        throw Error('error in vuex action GET_ITEM_BY_ID')
      }
      const item = state.db[state.ids.indexOf(id)];
      commit('SET_ITEM', item);
    }
  },
  getters: {
    db: state => state.db,
    item: state => state.item
  }
})
