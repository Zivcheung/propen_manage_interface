<template>
  <div class="window-page-wp">
    <topnav></topnav>
    <el-row>
      <el-col :span="18" :offset="3">
        <el-table :data="projectList.page">
          <el-table-column
            prop="title"
            label="Exhibition Title"
            min-width="150"
            fixed>
          </el-table-column>
          <el-table-column
            prop="stage"
            label="Stage"
            min-width="150">
            <template v-slot:default="scope">
              <el-tag
                size="mini">
                {{scope.row.stage}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="authors"
            label="Designer(s)"
            min-width="150">
          </el-table-column>
          <el-table-column
            prop="createdAt"
            label="Create Time"
            min-width="150">
          </el-table-column>
          <el-table-column
            label="Operation"
            min-width="150"
            fixed="right">
            <template
              v-slot:default="scope">
              <el-button type="text"
                @click="enterHandler(scope)">Enter</el-button>
              <el-button type="text">More</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-pagination
          background
          layout="jumper, prev, pager, next"
          :total="projectList.totalCount"
          :page-size="projectList.pageSize"
          @current-change="currentPageChangeHandler">
        </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import topnav from 'src/components/common/topnav';

export default {
  name: 'inProcess',
  components: {
    topnav,
  },
  data() {
    return {
      projectList: {
        page: [],
        totalCount: 0,
        pageSize: 5,
      },
    };
  },
  methods: {
    currentPageChangeHandler(page) {
      this.requestProjectList(page);
    },
    enterHandler(scope) {
      this.$store.commit('workflow/setProjectId', scope.row.projectId);
      this.routeToCertainStage(scope.row.stage);
    },
    routeToCertainStage(stage) {
      this.$router.push({
        path: stage,
      });
    },
    requestProjectList(page, startFrom) {
      const projectList = this.projectList;
      this.$$axios.get('/workflow/projectList', {
        params: {
          startFrom: startFrom || '',
          pageNumber: page,
        },
      })
        .then((res) => {
          const data = res.data;
          console.log(res);
          projectList.totalCount = data.totalNumber;
          projectList.page = data.projectList.map((item) => {
            const createdAt = new Date().toLocaleString();
            return {
              title: item.title,
              createdAt,
              stage: item.currentStage,
              id: item._id,
              projectId: item.projectId,
              authors: item.authors.reduce((acc, cur, i) => {
                if (i === 0) return cur.toString();
                return `${acc}, ${cur}`;
              }, ''),
            };
          });
        })
        .catch(() => {
          alert('project request failed');
        });
    },
  },
  created() {
    this.requestProjectList(1);
  },

};
</script>

<style></style>
