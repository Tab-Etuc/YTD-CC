<template>
  <div
    class="absolute right-4 mt-6 hidden h-[90%] w-[27.5%] overflow-hidden rounded-xl bg-slate-800 shadow-2xl ring-1 ring-inset ring-white/10 xl:block"
  >
    <header
      class="flex h-[4rem] w-full rounded-b-xl bg-gradient-to-tr from-[#ed6ea0]/70 to-blue-500"
    >
      <div class="my-auto flex h-[2rem] w-[full]">
        <!-- History icon -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          class="static ml-4 flex h-8 w-8 fill-white"
          viewBox="0 0 32 32"
          version="1.1"
        >
          <g id="surface1">
            <path
              d="M 16.90625 2.320312 C 11.492188 2.875 6.957031 6.523438 5.230469 11.695312 C 4.84375 12.851562 4.5625 14.457031 4.5625 15.511719 L 4.5625 16 L -0.03125 16 L 2.976562 19.011719 C 4.632812 20.675781 6 22.074219 6.019531 22.125 C 6.042969 22.1875 7 21.269531 9.125 19.125 L 12.195312 16.03125 L 9.925781 16.011719 L 7.648438 16 L 7.667969 15.574219 C 7.863281 11.320312 10.539062 7.613281 14.554688 6.054688 C 15.71875 5.605469 16.84375 5.414062 18.28125 5.40625 C 19.414062 5.40625 19.863281 5.457031 20.84375 5.695312 C 23.832031 6.417969 26.414062 8.511719 27.835938 11.355469 C 28.90625 13.5 29.1875 16.175781 28.585938 18.5625 C 28.105469 20.488281 27.113281 22.207031 25.679688 23.601562 C 24.039062 25.1875 22.238281 26.085938 19.875 26.511719 C 19.269531 26.617188 17.3125 26.617188 16.6875 26.507812 C 14.601562 26.144531 12.820312 25.304688 11.289062 23.96875 L 10.738281 23.480469 L 8.539062 25.679688 L 8.6875 25.851562 C 8.992188 26.175781 10.042969 27.019531 10.679688 27.445312 C 11.476562 27.980469 12.949219 28.71875 13.757812 28.988281 C 14.585938 29.261719 15.46875 29.476562 16.3125 29.605469 C 17.300781 29.757812 19.261719 29.757812 20.25 29.605469 C 23.292969 29.136719 25.832031 27.863281 27.976562 25.726562 C 29.1875 24.507812 29.898438 23.519531 30.632812 22.03125 C 31.304688 20.648438 31.742188 19.167969 31.9375 17.625 C 32.019531 16.945312 32.019531 15.054688 31.9375 14.375 C 31.632812 11.898438 30.707031 9.632812 29.167969 7.59375 C 28.644531 6.898438 27.273438 5.550781 26.5625 5.023438 C 24.636719 3.605469 22.605469 2.757812 20.3125 2.40625 C 19.511719 2.289062 17.675781 2.238281 16.90625 2.320312 Z M 16.90625 2.320312 "
            />
            <path
              d="M 16.761719 13.726562 L 16.78125 17.582031 L 19.875 19.417969 C 21.574219 20.429688 23.042969 21.300781 23.136719 21.351562 L 23.304688 21.4375 L 23.851562 20.511719 C 24.148438 20.007812 24.398438 19.574219 24.414062 19.554688 C 24.417969 19.539062 23.226562 18.804688 21.742188 17.9375 L 19.0625 16.34375 L 19.0625 9.875 L 16.75 9.875 Z M 16.761719 13.726562 "
            />
          </g>
        </svg>
        <p
          class="cursor-defaultmt-2 font-mediu my-auto ml-4 select-none text-xl leading-tight tracking-wide text-white"
        >
          歷程記錄
        </p>
      </div>
    </header>

    <div class="scrollbar h-full w-full overflow-auto rounded-tr-lg">
      <ui
        v-for="i in historyList"
        :key="i"
        class="flex h-20 w-full list-none ring-1 ring-inset ring-white/10 odd:bg-slate-800 even:bg-slate-700"
      >
        <li class="flex w-full">
          <img
            :src="i.影片背景"
            loading="lazy"
            class="my-auto ml-2 h-[80%] w-28 rounded-md"
          />

          <div class="text-md ml-3 h-full w-[60%] text-white">
            <p class="w-full truncate">{{ i.影片名稱 }}</p>
            <div class="mt-3 flex h-8 w-full flex-wrap space-x-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                class="h-5 w-5 fill-blue-300"
              >
                <!--! Font Awesome Pro 6.1.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
                <path
                  d="M272 0C289.7 0 304 14.33 304 32C304 49.67 289.7 64 272 64H256V98.45C293.5 104.2 327.7 120 355.7 143L377.4 121.4C389.9 108.9 410.1 108.9 422.6 121.4C435.1 133.9 435.1 154.1 422.6 166.6L398.5 190.8C419.7 223.3 432 262.2 432 304C432 418.9 338.9 512 224 512C109.1 512 16 418.9 16 304C16 200 92.32 113.8 192 98.45V64H176C158.3 64 144 49.67 144 32C144 14.33 158.3 0 176 0L272 0zM248 192C248 178.7 237.3 168 224 168C210.7 168 200 178.7 200 192V320C200 333.3 210.7 344 224 344C237.3 344 248 333.3 248 320V192z"
                />
              </svg>
              <span class="h-5 truncate text-sm">{{ i.影片時長 }}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 384 512"
                class="h-5 w-5 fill-blue-300"
              >
                <!--! Font Awesome Pro 6.1.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
                <path
                  d="M0 64C0 28.65 28.65 0 64 0H224V128C224 145.7 238.3 160 256 160H384V448C384 483.3 355.3 512 320 512H64C28.65 512 0 483.3 0 448V64zM256 128V0L384 128H256z"
                />
              </svg>
              <span class="h-5 truncate text-sm">{{ i.檔案格式 }}</span>
            </div>
          </div>
        </li>
      </ui>

      <div
        v-if="!historyList"
        class="flex h-full w-full items-center justify-center"
      >
        <p class="text-center text-lg text-white">空無一物</p>
      </div>
      <li class="flex h-20 w-full" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'History',
  data() {
    return {};
  },

  computed: {
    historyList() {
      return this.$store.state.historyList;
    },
  },

  async created() {
    await this.$store.dispatch('Set_History_List');
  },

  methods: {},
};
</script>
