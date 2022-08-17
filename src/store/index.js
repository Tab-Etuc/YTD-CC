import { createStore } from "vuex";
import { readTextFile, BaseDirectory } from "@tauri-apps/api/fs";

export default createStore({
  state: {
    isDownloading: false,
    historyList: [],
    downloadProgressBarValue: "0%",
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
  },
  actions: {
    async Set_History_List({ commit }) {
      await readTextFile("history.json", {
        dir: BaseDirectory.App,
      })
        .then((log) => {
          const data = JSON.parse(log)["歷程記錄"]?.reverse() ?? {};
          commit("SET_HISTORY_LIST", data);
        })
        .catch((err) => console.warn(err));
    },
  },
  modules: {},
});
