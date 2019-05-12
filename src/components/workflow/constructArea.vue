<template>
  <section class="construct-area">
    <div class="construct-area__tab-group">
      <div class="construct-area__tab" @click="activeTagHandler(0)"
        :class="{'construct-area__tab--active': currentTab===0}">
        {{tabNames[0]}}
      </div>
      <div class="construct-area__tab" @click="activeTagHandler(1)"
        :class="{'construct-area__tab--active': currentTab===1}">
        {{tabNames[1]}}
      </div>
    </div>
    <div class="construct-area__slot" v-if="currentTab===0">
      <slot name="tab-1"></slot>
    </div>
    <div class="construct-area__slot" v-else>
      <slot name="tab-2"></slot>
    </div>
  </section>
</template>

<script>
export default {
  name: 'constructArea',
  props: {
    tabNames: {
      type: Array,
      default: () => ([
        'tab1',
        'tab2',
      ]),
    },
  },
  data() {
    return {
      currentTab: 0,
    };
  },
  methods: {
    activeTagHandler(n) {
      this.currentTab = n;
    },
  },
};
</script>

<style src = "@/construct-area.css"></style>
