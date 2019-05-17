<template>
  <div class="dashboard">
    <topnav></topnav>
    <div class="dashboard__width-wp">
      <el-breadcrumb class='breadscrab' separator="/">
        <el-breadcrumb-item>Gallery</el-breadcrumb-item>
      </el-breadcrumb>
      <el-row>
        <el-col :span="6" v-for="exhi in galleryList.list" :key='exhi.id'>
          <project-card
            :title="exhi.title"
            :authors="exhi.authors"
            :dateRange="exhi.schedule"
            :coverImage="exhi.coverImage"
            >
          </project-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import topnav from '../components/common/topnav';
import step from '../components/workflow/step';
import projectCard from '../components/common/projectCard';

export default {
  name: 'dashboard',
  components: {
    topnav,
    step,
    projectCard,
  },
  data() {
    return {
      galleryList: {
        list: [],
        totalCount: 0,
        pageSize: 20,
      },
    };
  },
  methods: {
    requestgalleryList(page, startFrom) {
      const glist = this.galleryList;
      this.$$axios.get('/galleryList', {
        params: {
          startFrom: startFrom || '',
          pageNumber: page,
        },
      })
        .then((res) => {
          const data = res.data;
          console.log(res);
          glist.totalCount = data.totalNumber;
          glist.list = data.galleryList.map((item) => {
            const publishedAt = item.publishedAt.toLocaleString();
            return {
              title: item.title,
              publishedAt,
              id: item._id,
              projectId: item.projectId,
              authors: item.authors,
              coverImage: item.coverImage,
              schedule: item.schedule,
            };
          });
        })
        .catch(() => {
          alert('exhibition request failed');
        });
    },
  },
  created() {
    this.requestgalleryList(1);
  },
};
</script>

<style src="@/dashboard.css"></style>

