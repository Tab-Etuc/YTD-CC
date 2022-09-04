import { createStore } from 'vuex';
import { readTextFile, BaseDirectory } from '@tauri-apps/api/fs';

export default createStore({
  state: {
    isDownloading: false,
    historyList: [],
    downloadProgressBarValue: '0%',
    windowControlOnTheRight: false,
  },
  getters: {},
  mutations: {
    UPDATE_STATUS(state, payload) {
      state.isDownloading = payload;
    },
    SET_HISTORY_LIST(state, payload) {
      state.historyList = payload;
    },
    SET_BAR_VALUE(state, payload) {
      state.downloadProgressBarValue = payload;
    },
    SET_WINDOW_CONTROLS_ON_THE_RIGHT(state, payload) {
      state.windowControlOnTheRight = payload;
    },
  },
  actions: {
    async Set_History_List({ commit }) {
      await readTextFile('history.json', {
        dir: BaseDirectory.App,
      })
        .then((log) => {
          const data = JSON.parse(log)['歷程記錄']?.reverse() ?? {};
          commit('SET_HISTORY_LIST', data);
        })
        .catch((err) => console.warn(err));
    },
    async Set_Settings_List({ commit }) {
      await readTextFile('settings.json', {
        dir: BaseDirectory.App,
      }).then((log) => {
        const data = JSON.parse(log);
        commit(
          'SET_WINDOW_CONTROLS_ON_THE_RIGHT',
          data['WINDOW_CONTROLS_ON_THE_RIGHT']
        );
      });
      // .catch((err) => console.warn(err));
    },
  },
  modules: {},
});
