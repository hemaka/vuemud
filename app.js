/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

import "@babel/polyfill";
require("./bootstrap");
import "bootstrap/js/dist/util";

window.Vue = require("vue");

var VueCookie = require("vue-cookie");
// Tell Vue to use the plugin
Vue.use(VueCookie);

import VueI18n from "vue-i18n";
Vue.use(VueI18n);

import lang from "./data/Lang.js";
const i18n = new VueI18n({
  locale: "en", // set locale
  messages: lang // set locale messages
});

import VeeValidate from "vee-validate";
const validateConfig = {
  errorBagName: "errors", // change if property conflicts.
  fieldsBagName: "fields",
  delay: 500,
  locale: "en",
  dictionary: null,
  strict: false,
  enableAutoClasses: true,
  classNames: {
    touched: "touched", // the control has been blurred
    untouched: "untouched", // the control hasn't been blurred
    valid: "valid", // model is valid
    invalid: "invalid", // model is invalid
    pristine: "pristine", // control has not been interacted with
    dirty: "dirty" // control has been interacted with
  },
  events: "input|blur|change",
  inject: true
};
Vue.use(VeeValidate, validateConfig);

import VueMoment from "vue-moment";
import moment from "moment-timezone";
Vue.use(VueMoment, {
  moment
});

import { EventBus } from "./common/EventBus.js";

// import VueSocketio from "vue-socket.io";
// Vue.use(VueSocketio, window.chatServer);

import axios from "axios";
Vue.prototype.$http = axios;

var VueResource = require("vue-resource");
Vue.use(VueResource);

Vue.http.interceptor.before = function(request) {
  request.url = "/api/v2" + request.url;
};

Vue.http.interceptors.push(function(request) {
  return function(response) {
    if (
      response.data.status == "failure" &&
      response.data.msg == "Unauthenticated."
    ) {
      window.location = "/login";
    }
  };
});

Vue.http.headers.common["X-CSRF-TOKEN"] = $("meta[name=csrf-token]").attr(
  "content"
);
Vue.http.headers.common["CLIENT"] = "web";
Vue.http.headers.common["Accept"] = "application/json";
Vue.http.headers.common["LANG"] = window.user.lang;

import filters from "./common/filters";
Vue.use(filters);

import helper from "./common/helper";
import { throws } from "assert";
Vue.prototype.$helper = helper;
/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */
window.__preferredCountries = ["us", "cn", "jp", "de", "gb", "fr"];
// Vue.component('example-component', require('./components/ExampleComponent.vue'));

// 组件
// 电话国家码选择
Vue.component("intel-phone", require("./common/IntelPhone.vue").default);
// step组件
Vue.component("YSStep", require("./common/YSStep.vue").default);
// 成功对话框
Vue.component("YSSuccess", require("./common/YSSuccess.vue").default);
// 确认对话框
Vue.component("YSConfirm", require("./common/YSConfirm.vue").default);
// 翻页
Vue.component("pagination", require("./common/Paginate.vue").default);
// 正在加载
Vue.component("loading", require("./common/YSLoading.vue").default);
// 无数据
Vue.component("nodata", require("./common/YSNoData.vue").default);
// 获得奖金特效
Vue.component("YSCoin", require("./common/YSCoin.vue").default);
// 页首三块内容
Vue.component("topCoin", require("./common/YSTopCoin.vue").default);
// 下载窗口
Vue.component("ys-app-download", require("./common/YSAppDownload.vue").default);

// 页面
// 首页
Vue.component("dashboard", require("./members/dashboard.vue").default);

// 个人设置
Vue.component("profile", require("./members/profile/profile.vue").default);
Vue.component("shippingAddress", require("./members/profile/address.vue").default);
// Vue.component("account", require("./members/profile/account.vue"));
Vue.component("payout", require("./members/profile/payout.vue").default);
Vue.component("upgrade", require("./members/profile/upgrade.vue").default);

// 产品部分
Vue.component("productDetail", require("./members/products/detail.vue").default);
Vue.component("products", require("./members/products/products.vue").default);

// 订单部分
Vue.component("cart", require("./members/order/cart.vue").default);
Vue.component("smallCart", require("./members/order/smallCart.vue").default);
Vue.component("orders", require("./members/order/orders.vue").default);
Vue.component("subscribe", require("./members/order/subscribe.vue").default);

// 其他部分
Vue.component("notification", require("./members/other/notification.vue").default);
Vue.component("news", require("./members/other/news.vue").default);
Vue.component("checkIn", require("./members/other/checkIn.vue").default);

// 帮助部分
Vue.component("helps", require("./members/help/helps.vue").default);
Vue.component("feedback", require("./members/help/feedback.vue").default);

// 好友部分
Vue.component("friends", require("./members/friend/friends.vue").default);
Vue.component("friendsLog", require("./members/friend/log.vue").default);
Vue.component("invite", require("./members/friend/invite.vue").default);

// 财务部分
Vue.component("reward", require("./members/finance/reward.vue").default);
Vue.component("rewardLog", require("./members/finance/rewardLog.vue").default);

// 钱包部分
Vue.component("wallet", require("./members/finance/wallet.vue").default);
Vue.component("depositLog", require("./members/finance/depositLog.vue").default);
Vue.component("withdrawLog", require("./members/finance/withdrawLog.vue").default);
Vue.component("transferLog", require("./members/finance/transferLog.vue").default);

const app = new Vue({
  el: "#app",
  delimiters: ["{[", "]}"],
  i18n,
  data: {
    lang: "en",
    langList: {
      en: "English",
      zh: "简体中文",
      es: "Español"
    },
    user: window.user,
    cartQuantity: window.cartQuantity,
    messageCount: window.messageCount,
    showAllCoin: window.showAllCoin,
    checkInModal: false,
    showSmallCart: false,
    showCoinList: [],
    showSuccess: false,
    isAndroid: false,
    appCommon: window.APPCommon,
    showAppDownload: false,
    newsNotification: false
  },
  sockets: {
    connect: function() {},
    disconnect: function() {
      console.log("socketDisconnected");
    },
    login: function(val) {},
    paymentSuccessful: function(val) {
      EventBus.$emit("payment-successful", val);
    },
    addReward: function(val) {},
    addMember: function(val) {
      this.user.members++;
    },
    coinChange: function(val) {
      this.showCoin(val);
    },
    notification: function(val) {
      this.messageCount += 1;
    }
  },
  mounted() {
    if (this.user.lang) {
      this.lang = this.user.lang;
    } else {
      this.lang = window.YS.lang;
    }
    this.$cookie.set("lang", this.lang, 365);
    this.$i18n.locale = this.lang;
    EventBus.$on("update-cart-quantity", cartQuantity => {
      // this.showSmallCart = false;
      this.cartQuantity = cartQuantity;
    });

    EventBus.$on("update-message-count", messageCount => {
      this.messageCount = messageCount;
    });
    EventBus.$on("change-avatar", avatar_url => {
      this.user.avatar_url = avatar_url;
    });
    // this.$socket.emit(
    //     "loginWithToken",
    //     $("meta[name=csrf-token]").attr("content")
    // );

    // this.$socket.emit("loginWithUUID", this.user.ws);

    EventBus.$on("register-showCoin", element => {
      this.addShowCoinList(element);
    });

    EventBus.$on("change-balance", amount => {
      this.user.balance = amount;
    });

    EventBus.$on("update-user", user => {
      this.user = user;
    });
    this.isAndroid = navigator.userAgent.match(/Android/i);

    this.checkUnreadNews();
  },
  methods: {
    setLang(la) {
      if (this.langList[la] != undefined) {
        this.$cookie.set("lang", la, 365);
        location.href = "/profile/lang/" + la;
      }
    },
    logout() {
      this.$http
        .post("/api/auth/logout")
        .then(response => {
          return response.json();
        })
        .then(data => {
          location.href = "/";
        });
    },
    addShowCoinList(element) {
      if (element != undefined) {
        this.showCoinList.push(element);
      }
    },
    showCoin(data) {
      for (var i = 0; i < this.showCoinList.length; i++) {
        this.showCoinList[i].addCoin(data);
      }
    },
    upgrade() {
      let self = this;
      this.$refs.upgradeConfirm.show(
        self.$i18n.t("tip.confirmUpgrade", {
          group: self.$i18n.t("status.groupName." + (self.user.group + 1))
        }),
        function() {
          self.$http
            .post("/user/upgrade")
            .then(response => {
              return response.json();
            })
            .then(data => {
              if (data.status == "success") {
                // self.user.grade = data.data.grade;
                // self.user.group = data.data.group;
                // window.user.grade = data.data.grade;
                // // self.upgradeToPremium = false;
                // // self.upgradeToSuperme = data.data.upgrade;
                self.$refs.upgradeConfirm.hide();
                self.showSuccess = true;
                location.reload();
                // EventBus.$emit("update-user", data.data);
              } else {
                self.errorMsg = data.msg;
              }
            });
        },
        function() {}
      );
    },
    checkAppInstall() {
      this.appCommon.openApp();
      this.showAppDownload = true;
    },
    checkUnreadNews() {
      this.$http
        .get("/news/hasUnread")
        .then(response => {
          if (response.data.data) {
            this.newsNotification = response.data.data;
          } else if (response.data.msg) {
          } else {
          }
        })
        .catch(e => {
          console.log(e);
        })
        .then(() => {});
    }
  }
});
