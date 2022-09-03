<template>
  <Transition
    enter-active-class="duration-500 ease-out"
    enter-from-class="transform opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="duration-400 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="transform opacity-0"
  >
    <div
      v-if="showModal"
      class="fixed bottom-0 left-0 z-50 table h-[calc(100%-32px)] w-full rounded-b-xl bg-black/50 transition duration-300"
    ></div>
  </Transition>
</template>

<script>
export default {
  name: 'AppUpdaterModal',
  props: {
    showModal: Boolean,
  },

  data() {
    return {};
  },

  computed: {},

  mounted() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.$emit('close-modal');
      }
    });
  },

  methods: {},
};
</script>
