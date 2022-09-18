import { createStore } from 'vuex';
import { readTextFile, BaseDirectory } from '@tauri-apps/api/fs';

export default createStore({
  state: {
    isDownloading: false,
    historyList: [],
    downloadProgressBarValue: '0%',
    windowControlOnTheLeft: false,
    downloadOutputPath: '',
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
    SET_WINDOW_CONTROLS_ON_THE_LEFT(state, payload) {
      state.windowControlOnTheLeft = payload;
    },
    SET_DOWNLOAD_OUTPUT_PATH(state, payload) {
      state.downloadOutputPath = payload;
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
          'SET_WINDOW_CONTROLS_ON_THE_LEFT',
          data['WINDOW_CONTROLS_ON_THE_LEFT']
        );
        commit('SET_DOWNLOAD_OUTPUT_PATH', data['DOWNLOAD_OUTPUT_PATH']);
      });
      // .catch((err) => console.warn(err));
    },
  },
  modules: {},
});
