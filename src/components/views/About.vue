<template>
  <div class="float-left mt-6 h-screen w-[calc(100%-7rem)] overflow-hidden">
    <div class="relative float-left h-[90%] w-[22vw]">
      <img src="../../assets/YTD.CC.png" class="mx-auto my-4 w-[60%]" />
      <hr class="w-full" />
      <a
        class="h-4 w-8 bg-white"
        @click="openLink('https://github.com/Tab-Etuc/YTD-CC')"
        >Github 專案</a
      >
    </div>
    <div class="absolute right-5 h-[90%] w-[calc(100%-10rem-22vw)]"></div>
  </div>
</template>

<script>
import { open } from "@tauri-apps/api/shell";

export default {
  name: "About",
  components: {},

  data() {
    return {};
  },

  methods: {
    async openLink(URL) {
      await open(URL);
    },
  },
};
</script>
