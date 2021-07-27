<template>
  <div class="main">
    <div v-if="userInfo" class="userinfo-wrap">
      <div class="avator-img">
        <img :src="userInfo.headimgurl" alt="" />
      </div>
      <div class="nickname">{{ userInfo.nickname }}</div>
    </div>
    
    <!-- 按钮组 -->
    <div class="btn-group">
      <div class="btn">分享</div>
      <div class="btn btn-primary">充值</div>
      <div class="btn">活动详情</div>
    </div>
  </div>
</template>

<script>
import { getUserInfoApi } from '@/api';

export default {
  naem: 'Index',
  data() {
    return {
      userInfo: null,
    };
  },
  mounted() {
    const openId = this.$cookie.get('openId');
    console.log('index cookie:', openId);
    openId && this._getUserInfo();
  },
  methods: {
    /**
     * 获取用户信息
     */
    async _getUserInfo() {
      const { data } = await getUserInfoApi();
      this.userInfo = data;
      // console.log(resResult)
    }
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

.userinfo-wrap {
  position: fixed;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
}
.avator-img {
  width: 100px;
  height: 100px;
}

.avator-img img {
  width: 100%;
  height: 100%;
  border-radius: 20px;
}

.nickname {
  margin-top: 10px;
  text-align: center;
  font-size: 20px;
  color: #000;
}


.btn-group {
  position: fixed;
  bottom: 1rem;
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
