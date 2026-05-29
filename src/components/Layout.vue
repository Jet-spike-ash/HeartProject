<template>
  <div class="background-layout">
    <el-container style="height: 100vh">
      <leftnav />
      <el-container>
        <el-header>
          <navheader />
        </el-header>
        <el-main>
          <router-view class="main-container"></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup="ts">
import Leftnav from './Leftnav.vue'
import Navheader from './Navheader.vue'
</script>

<style lang="css">
.background-layout {
  height: 100vh;
  /* vh 相对于浏览器视口，% 相对于父容器。 */
}

.main-container {
  padding: 20px;
  background-color: #fff;
  min-height: calc(100% - 74px);
}

:global(html, body) {
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>
