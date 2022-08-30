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

<style>
/* 不知道怎麼改成 TailwindCSS 以後再說ㄅ  */

.shim-green {
  position: relative;
  overflow: hidden;
  background-color: rgba(65, 100, 255, 0.7);
}
.shim-green::after {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transform: translateX(-100%);
  background-image: linear-gradient(
    90deg,
    rgba(233, 233, 233, 1) 0,
    rgba(233, 233, 233, 0.9) 50%,
    rgba(233, 233, 233, 0.8) 100%
  );
  animation: shimmer 2s ease-out infinite;
  content: '';
}

@keyframes shimmer {
  100% {
    transform: translateX(0%);
    opacity: 0;
  }
}
</style>
