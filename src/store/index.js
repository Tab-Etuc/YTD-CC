import { createStore } from 'vuex';
import { invoke } from '@tauri-apps/api/core';
import { readTextFile, writeTextFile, exists, mkdir, BaseDirectory } from '@tauri-apps/plugin-fs';

export default createStore({
  state: {
    isDownloading: false,
    historyList: null,
    downloadProgressBarValue: '0%',
    windowControlOnTheLeft: false,
    downloadOutputPath: '',
    saveHistory: true,
    bannerImage: '',
    downloadQueue: [],
    isQueueProcessing: false,
    queueIdCounter: 0,
  },
  getters: {
    pendingQueueCount: (state) => state.downloadQueue.filter(i => i.status === 'pending').length,
    hasQueueItems: (state) => state.downloadQueue.length > 0,
  },
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
    SET_SAVE_HISTORY(state, payload) {
      state.saveHistory = payload;
    },
    SET_BANNER_IMAGE(state, payload) {
      state.bannerImage = payload;
    },
    ADD_TO_QUEUE(state, item) {
      state.queueIdCounter++;
      state.downloadQueue.push({
        ...item,
        id: state.queueIdCounter,
        status: 'pending', // pending, downloading, completed, error
        progress: 0,
      });
    },
    ADD_MULTIPLE_TO_QUEUE(state, items) {
      items.forEach(item => {
        state.queueIdCounter++;
        state.downloadQueue.push({
          ...item,
          id: state.queueIdCounter,
          status: 'pending',
          progress: 0,
        });
      });
    },
    REMOVE_FROM_QUEUE(state, id) {
      const index = state.downloadQueue.findIndex(i => i.id === id);
      if (index > -1) {
        state.downloadQueue.splice(index, 1);
      }
    },
    CLEAR_QUEUE(state) {
      state.downloadQueue = state.downloadQueue.filter(i => i.status === 'downloading');
    },
    CLEAR_COMPLETED_QUEUE(state) {
      state.downloadQueue = state.downloadQueue.filter(i => i.status !== 'completed' && i.status !== 'error');
    },
    UPDATE_QUEUE_ITEM_STATUS(state, { id, status, progress }) {
      const item = state.downloadQueue.find(i => i.id === id);
      if (item) {
        item.status = status;
        if (progress !== undefined) item.progress = progress;
      }
    },
    UPDATE_QUEUE_ITEM_PROGRESS(state, { progress }) {
      const downloading = state.downloadQueue.find(i => i.status === 'downloading');
      if (downloading) {
        downloading.progress = progress;
      }
    },
    SET_QUEUE_PROCESSING(state, value) {
      state.isQueueProcessing = value;
    },
  },
  actions: {
    async Set_History_List({ commit }) {
      await readTextFile('history.json', {
        baseDir: BaseDirectory.AppData,
      })
        .then((log) => {
          const data = JSON.parse(log)['HISTORY_RECORDS']?.reverse() ?? '';
          commit('SET_HISTORY_LIST', data);
        })
        .catch((err) => commit('SET_HISTORY_LIST', ''));
    },
    async Set_Settings_List({ commit }) {
      try {
        const data = await invoke('load_settings');
        console.log('Loaded settings:', data);
        commit('SET_WINDOW_CONTROLS_ON_THE_LEFT', data.WINDOW_CONTROLS_ON_THE_LEFT);
        commit('SET_DOWNLOAD_OUTPUT_PATH', data.DOWNLOAD_OUTPUT_PATH);
        commit('SET_SAVE_HISTORY', data.SAVE_HISTORY);
        commit('SET_BANNER_IMAGE', data.BANNER_IMAGE || '');
      } catch (err) {
        console.error('Failed to load settings from Rust backend:', err);
      }
    },
    async Add_History_Item({ state, dispatch }, item) {
      if (!state.saveHistory) return;

      try {
        const historyPath = 'history.json';
        if (!(await exists(historyPath, { baseDir: BaseDirectory.AppData }))) {
          await mkdir('', { baseDir: BaseDirectory.AppData, recursive: true });
        }

        let jsonData = { DOWNLOAD_COUNT_STATISTICS: { MP3: 0, MP4: 0 }, HISTORY_RECORDS: [] };
        try {
          const content = await readTextFile(historyPath, { baseDir: BaseDirectory.AppData });
          if (content) jsonData = JSON.parse(content);
        } catch { /* ignore */ }

        if (!jsonData.DOWNLOAD_COUNT_STATISTICS) jsonData.DOWNLOAD_COUNT_STATISTICS = { MP3: 0, MP4: 0 };
        if (!jsonData.HISTORY_RECORDS) jsonData.HISTORY_RECORDS = [];

        if (item.format === 'MP3') jsonData.DOWNLOAD_COUNT_STATISTICS.MP3++;
        else jsonData.DOWNLOAD_COUNT_STATISTICS.MP4++;

        jsonData.HISTORY_RECORDS.unshift({
          VIDEO_NAME: item.title,
          FILE_FORMAT: item.format,
          VIDEO_DURATION: item.duration || '00:00',
          BANNER_IMAGE: item.thumbnail,
          DOWNLOAD_TIME: Date.now(),
          ...(item.format === 'MP3' && { AUDIO_QUALITY: item.quality }),
          ...(item.format === 'MP4' && { VIDEO_QUALITY: item.quality }),
        });

        if (jsonData.HISTORY_RECORDS.length > 200) {
          jsonData.HISTORY_RECORDS = jsonData.HISTORY_RECORDS.slice(0, 200);
        }

        await writeTextFile(historyPath, JSON.stringify(jsonData, null, 2), { baseDir: BaseDirectory.AppData });
        dispatch('Set_History_List');
      } catch (err) {
        console.error('Failed to write history:', err);
      }
    },
  },
  modules: {},
});
