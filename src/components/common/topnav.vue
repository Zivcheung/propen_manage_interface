<template>
  <el-menu mode="horizontal" background-color='#262626' text-color="#fff" active-text-color="#ffd04b" class="topnav">
    <el-submenu index="1" >
      <template slot='title'>Curation</template>
      <el-menu-item index="1-1">Create New</el-menu-item>
      <el-menu-item index="1-2">In Process</el-menu-item>
      <el-menu-item index="1-3">Invitaitons</el-menu-item>
      <el-menu-item index="1-4">Requests</el-menu-item>
    </el-submenu>
    <el-submenu index="2">
      <template slot='title'>Exhibition Management</template>
      <el-menu-item index="2-1">Gallery</el-menu-item>
      <el-menu-item index="2-2">Exhibition Pool</el-menu-item>
    </el-submenu>
    <el-submenu index="3">
      <template slot='title'>Site Administration</template>
      <el-menu-item index="3-1">Monitoring Dashboard</el-menu-item>
      <el-menu-item index="3-2">Account Management</el-menu-item>
      <el-menu-item index="3-3">Conversation System</el-menu-item>
      <el-menu-item index="3-4">Bugs Report</el-menu-item>
    </el-submenu>
    <el-submenu index="4">
      <template slot='title'>Utilities</template>
      <el-menu-item index="4-1">Messages</el-menu-item>
      <el-menu-item index="4-2">Schedule</el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  name: 'dashboard',
  data() {
    return {

    };
  },
};
</script>

<style src="@/topnav.css"></style>
