
App({
  onLaunch: function () {
    // 获取code
    wx.login({
      success: res => {
       this.globalData.code = res.code
      }
    })
   // 如果授权登陆过，可直接赋值，不用存本地。
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              this.globalData.userInfo = res.userInfo
              if (this.luchCallback) {
                this.lunchCallback(res)
              }
            }
          })
        }
      }
    })
  },
  onShow: function () {
    const updateManager = wx.getUpdateManager();
    updateManager.onCheckForUpdate(function (res) {
      // 请求是否有新版本
    });
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '检测到新版本，请重启应用',
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate();
          }
        }
      })
    });
  },
  // 公用的请求方法
  httpRequest: (url, parm,methodType = 'post') => {
    let token = this.gets('token') || ''
    let promise = new Promise((resolve,reject)=>{
    wx.request({
      url: this.globalData.url+url,
      data:parm,
      method: methodType,
      header:{
        'token':token,
        'content-type': 'application/json'
      },
      success:(res)=>{
        resolve(res.data)
      },
      error:(e)=>{
        reject('网络开小差了！')
      }
    })
    })
    return promise
  },
  globalData: {
    url:'https://xxxxxxxx/',//请求地址
    userInfo: null,
    lon:'',
    lat:''
  },

  // 确认框
  confirm(content, agree, cancel, title = '提示',){
    wx.showModal({
      title: title,
      content: content,
      success(res) {
        if (res.confirm) {
          agree()
        } else if (res.cancel) {
          cancel()
        }
      }
    })
    
  },
  // 跳转
  nto(url,id){
    if(id){
      wx.navigateTo({
        url:'/pages/'+ url + '?id=' + id
      })
    }else{
      wx.navigateTo({
        url: '/pages/'+ url
      })
    }
  },
  // 传对象跳转
  ntobj(url,name,obj){
    let value = JSON.stringify(obj)
    wx.navigateTo({
      url: '/pages/'+ url+'?' + name + '=' + value,
    })
  },
  stab(url){
    wx.switchTab({
      url:'/pages/'+ url,
    })
  },
  // 本地存取
  saves(key,val){
    wx.setStorageSync(key,val)
  },
  gets(key){
   return wx.getStorageSync(key)
  },
  isphone(mobile){
    return !(/^1[3456789]\d{9}$/.test(mobile))
  },
  //加载提示
  load(){
    wx.showLoading({
      title: '加载中...',
    })
  },
  hideload(){
    wx.hideLoading()
  },
  toast(msg){
    wx.showToast({
      title:msg ,
      icon:'none'
    })
  },
})