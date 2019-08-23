const app = getApp()
import api from '../../utils/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dialog: false,
    userInfo: null,
  },
  goto() {

  },
  // 
  loginbtn() {
    this.setData({
      dialog: true
    })
  },

  cancelLogin: function (e) {
    let data = e.detail

    this.setData({
      dialog: e.detail.dialog
    })
    if (!data.cancel) {
      this.getUserInfo()
    }
  },
  // 如果授权过,则保存在app.js中，可直接调用，如果没有就由login组件登录成功触发该事件
  getUserInfo() {
    if (app.globalData.userInfo) {
      this.setData({
        userinfo: app.globalData.userInfo
      })
    }
  },

  onLoad: function (options) {
    this.getUserInfo()
api.location()
setTimeout(res=>{
  console.log(app.globalData.lat)
},200)
  },


  onShow: function () {

  },


  onPullDownRefresh: function () {

  },

 
  onReachBottom: function () {

  },

  
  onShareAppMessage: function () {

  }
})