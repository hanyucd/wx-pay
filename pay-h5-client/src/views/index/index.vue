<template>
  <div class="main">
    <!-- 按钮组 -->
    <div class="btn-group">
      <div class="btn">分享</div>
      <div class="btn btn-primary">充值</div>
      <div class="btn">活动详情</div>
    </div>
  </div>
</template>

<script>
export default {
  naem: 'Index',
  data() {
    return {};
  }
}
</script>

<style>
.main {
  height: 100vh;
  background: #000;
  background-image: url('../../assets/image/shaxin_bg.jpg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}

.btn-group {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
}
.btn {
  width: 5.4rem;
  height: 1rem;
  line-height: 1rem;
  text-align: center;
  background:#D94C4C;
  font-size: .34rem;
  margin-bottom: .3rem;
  color: #fff;
  border-radius: .5rem;
}
.btn-primary {
  background: #fff;
  color: #D94C4C;
}
</style>
