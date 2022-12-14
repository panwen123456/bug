<template>
  <div class="app-shell app-shell-bottom-navigation">
    <div class="app-view-wrapper">
      <MiTitle :title="title" :show-search-icon="false" />
      <div class="container app-view app-view-with-header">
        <div class="page-wrap">
          <div class="address-manager">
            <div class="address-manager-edit">
              <ul class="ui-list">
                <li class="ui-list-item">
                  <div class="label">收货人：</div>
                  <div class="ui-input">
                    <input
                      v-model.trim="addressInfo.consignee"
                      placeholder="真实姓名"
                      name="consignee"
                      maxlength="15"
                      type="text"
                      autocomplete="off"
                    />
                  </div>
                </li>
                <li class="ui-list-item">
                  <div class="label">手机号码：</div>
                  <div class="ui-input">
                    <input
                      v-model.trim.number="addressInfo.tel"
                      :placeholder="telPlaceholder"
                      name="tel"
                      maxlength="11"
                      id="tel"
                      type="tel"
                      autocomplete="off"
                    />
                  </div>
                </li>
                <li class="ui-list-item">
                  <div class="label">所在地区：</div>
                  <div class="ui-input" @click="showRegions=true">
                    <input
                      :value="addressStr"
                      placeholder="省 市 区 街道信息"
                      name="pcd"
                      maxlength="20"
                      type="text"
                      readonly="readonly"
                    />
                  </div>
                </li>
                <li class="ui-list-item">
                  <div class="label">详细地址：</div>
                  <div class="ui-input">
                    <input
                      v-model.trim="addressInfo.address"
                      placeholder="详细地址"
                      id="address"
                      name="address"
                      maxlength="40"
                      type="text"
                      autocomplete="off"
                    />
                  </div>
                </li>
                <li class="ui-list-item">
                  <div class="label">设置为默认地址</div>
                  <label class="ui-cell">
                    <input v-model="addressInfo.is_default" name="is_default" type="checkbox" />
                  </label>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="add">
          <a class="btn ui-button ui-button-active" @click="submit">
            <span>保存地址</span>
          </a>
        </div>
        <!-- 控制地址弹窗是否显示 -->
        <MiAddressAll v-model="showRegions" @region="changeRegion" />
      </div>
    </div>
  </div>
</template>

<script>
import fetch from "../api/fetch";
import Address from '../api/address'
import MiAddressAll from '../components/MiAddressAll.vue'
import Dialog from '../components/dialog'
export default {
  components: {
    MiAddressAll
  },
  data() {
    return {
      title: "",
      showRegions: false,
      addressInfo: {
        consignee: "",
        tel: "",
        province: "",
        province_id: "",
        city: "",
        city_id: "",
        district: "",
        district_id: "",
        area: "",
        area_id: "",
        address: "",
        is_default: false,
      },
      telPlaceholder: '手机号'
    };
  },
  computed: {
    //根据个人信息返回地址信息
    addressStr() {
      let info = this.addressInfo
      return `${info.province} ${info.city} ${info.district} ${info.area}`.trim()
    }
  },
  beforeRouteEnter(to, from, next) {
    let id = to.query.address_id;
    //编辑做处理，新增不做处理
    if (id) {
      if (from.name) {
        Address.view(id).then((res) => {
          next((vm) => vm.setAddress(res));
        });
      } else {
        next((vm) => vm.getAddress());
      }
    } else {
      next();
    }
  },
  //新增的加载状态和进度条
  created() {
    if (this.$route.query.address_id) {
      this.title = "编辑地址";
    } else {
      this.$store.commit("setViewLoading", false);
      this.$NProgress.done();
      this.title = "新增地址";
    }
  },
  methods: {
    getAddress() {
      Address.view(this.$route.query.address_id).then((res) => {
        this.setAddress(res);
      });
    },
    setAddress(res) {
      this.$store.commit("setViewLoading", false);
      this.$NProgress.done();
      //根据0-1赋予地址
      let info = res.data
      info.is_default = info.is_default === 1
      this.addressInfo = info
      //编辑状态tel显示后再置空
      this.telPlaceholder = info.tel
      this.addressInfo.tel = ''
    },
    changeRegion(region) {
      //获取到地址信息后合并
      this.addressInfo = Object.assign({}, this.addressInfo, region)
    },
    submit() {
      //校验
      let ai = this.addressInfo
      if (!ai.consignee) {
         Dialog.alert({
          message: '请输入收货人姓名'
        })
        return
      }
      const reg = /^1\d{10}$/
      //若是编辑地址且输入了电话号码提示,若是新增地址
      if (this.$route.query.address_id) {
        if (ai.tel && !reg.test(ai.tel)) {
          Dialog.alert({
            message: '请输入11位手机号码'
          })
        return
        }
      } else {
        if (!ai.tel || !reg.test(ai.tel)) {
          Dialog.alert({
            message: '请输入11位手机号码'
          })
          return
        }
      }
      if (!this.addressStr) {
        Dialog.alert({
          message: '请选择所在地区'
        })
        return
      }
      if (!ai.address) {
        Dialog.alert({
          message: '请输入详细地址'
        })
        return
      }
      let len = ai.address.length
      if (len < 5 || len > 120) {
        Dialog.alert({
          message: '抱歉，详细地址不能少于5个字，不能多于120个字'
        })
        return
      }
      //默认地址为1，其他为2
      this.addressInfo.is_default = this.addressInfo.is_default ? 1 : 2
      //判断新增还是保存
      let api = this.$route.query.address_id ? 'save' : 'add'
      Address[api](this.addressInfo).then(res => {
        //回退到地址列表
        this.$router.go(-1)
      })
    }
  },
};
</script>

<style scoped>
.address-manager,
.address-manager .ui-list {
  position: relative;
}
.address-manager .ui-list .ui-list-item {
  border-bottom: 1px solid #f6f6f6;
  font-size: 14px;
  overflow: hidden;
  background: #fff;
  padding: 10px 15px;
  display: flex;
  display: -webkit-box;
  box-align: center;
  -webkit-box-align: center;
}
.address-manager .ui-list .ui-input {
  border: 0;
  box-flex: 1;
  overflow: hidden;
  font-size: 12px;
  width: 100%;
}
.address-manager .ui-list .ui-input input {
  padding: 9px 15px;
  width: 100%;
  -webkit-box-flex: 1;
  box-sizing: border-box;
  font-size: 14px;
  border: 0;
  text-decoration: none;
  outline: 0;
  vertical-align: middle;
}
.address-manager .ui-list .ui-cell {
  display: block;
  box-flex: 1;
  -webkit-box-flex: 1;
  width: 100%;
  text-align: right;
}
[type="checkbox"],
[type="radio"] {
  box-sizing: border-box;
  padding: 0;
}
.add {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  z-index: 1;
}
.add span {
  font-size: 15px;
  color: #fff;
}
</style>
