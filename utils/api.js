const app = getApp()
const api = {
  // 获得经纬度
  location(){
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        app.globalData.lat = res.latitude,
        app.globalData.lon =res.longitude
      }
    })
   
  },
  // 微信支付，data为请求后台拿到的支付参数
  payMoney:function(data,success,fail){
    wx.requestPayment(
      {
        'timeStamp': data.time.toString(),
        'nonceStr': data.nonce_str,
        'package': 'prepay_id=' + data.prepay_id,
        'signType': 'MD5',
        'paySign': data.sign,
        'success': function (res) {
           success(res)
        },
        'fail': function (res) {
         fail(res)
        },
        'complete': function (res) { }
      })
  },
  //导航
  navigation(obj){
    wx.getLocation({//获取当前经纬度
      type: 'wgs84',  
      success: function (res) {
        wx.openLocation({
          latitude: Number(obj.lat),//要去的纬度-地址
          longitude: Number(obj.lon),//要去的经度-地址
          name: obj.name,
          address: obj.address
        })
      }
    })
  }

}
module.exports = api