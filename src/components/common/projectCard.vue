<template>
  <el-card class="project-card">
    <div class="project-card__img-ratio-wp">
      <img class="project-card__img"
        :src="coverImage" alt="">
    </div>
    <p class="project-card__title">
      {{title}}
    </p>
    <p class="project-card__authors">
      Authors:&nbsp;&nbsp;&nbsp;{{authorStr}}
    </p>
    <p class="project-card__time">
      {{`From:  ${dateRange[0]} to: ${dateRange[1]}`}}
    </p>
  </el-card>
</template>

<script>
export default {
  name: 'project-card',
  props: {
    title: {
      type: String,
      required: true,
    },
    authors: {
      type: Array,
      required: true,
    },
    dateRange: {
      type: Array,
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
  },
  computed: {
    authorStr() {
      return this.authors.reduce((acc, cur, i) => {
        if (i === 0) return cur.toString();
        return `${acc}, ${cur}`;
      }, '');
    },
  },
};
</script>

<style src="@/project-card.css"></style>
