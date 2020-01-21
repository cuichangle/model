const app = getApp()
const qiniuUploader = require("qiniuUploader");

const formatTime = (dates) => {
  
  const date = new Date(dates)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('-') + ' ' 



}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
// 定位
const location = ()=>{
  wx.getLocation({
    type: 'wgs84',
    success(res) {
      app.globalData.lat = res.latitude,
        app.globalData.lon = res.longitude
    }
  })
}
// 支付
const payMoney = (data, success, fail)=>{
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
}
// 导航
const  navigation =(obj)=>{
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
 const uploadName =  (val)=>{
  let data = new Date()
  let keytime = data.getTime()
  let keyname = Math.ceil(Math.random() * 100000)
  let types
  if (val == 3) {
    types = '.mp3'
  } else if (val == 2) {
    types = '.mp4'
  } else {
    types = '.jpg'
  }
  let key = 'repair/' + keytime + '/' + keyname + types
  return key
}
// 七牛云上传
const qiniuUpload = (type,token,success,error,songsfile)=>{
  // type =1 图片，2视频，3音频
  const options = {
    region: 'ECN',//华东地区
    uptoken:token,
    key:uploadName(type),
    uploadURL: '',
    domain: ''
  }
//  传图片
  if(type == 1){
    var imgarr = []
    wx.chooseImage({
      count: 6,
      success: function (res) {
        app.load('图片上传中')
        let tempFilePaths = res.tempFilePaths;
          for (let i = 0; i < tempFilePaths.length; i++) {
           
            options.key = uploadName(type)
            qiniuUploader.upload(tempFilePaths[i], (res) => {
             
              imgarr.push(res.imageURL)
              if(imgarr.length == tempFilePaths.length){
                success(imgarr)
                app.stoast('上传成功')
              }
             
            }, (err) => { 
              app.toast('上传失败')
              error('上传错误: ' + JSON.stringify(error))
            }, options)
          }
      }
    })
  }
  // 传视频
  if(type == 2){
    wx.chooseVideo({
      maxDuration: 15,
      success: function (res) {
        app.load('正在上传中...')
        let filepath = res.tempFilePath
          qiniuUploader.upload(filepath, (res) => {
            app.hide()
            app.stoast('视频上传成功')
            success(res.imageURL)
          }, (err) => {
            app.toast('上传失败')
            error('上传错误: ' + JSON.stringify(err));
          }, options)
      }
    })
  }
  //传音频
if(type == 3){
  qiniuUploader.upload(songsfile, (res) => {
    app.hide()
    app.stoast('音频上传成功')
    success(res.imageURL)
  }, (err) => {
    app.toast('上传失败')
    error('上传错误: ' + JSON.stringify(err));
  }, options)
}

}
// 阿里云图片上传
const imgup = (osddata,success,error)=>{
  wx.chooseImage({
    count: 9,
    sizeType: ['original'],
    sourceType: ['album', 'camera'],
    success(res) {
      wx.showLoading({
        title: '图片上传中',
      })
      // tempFilePath可以作为img标签的src属性显示图片
      const imgsrc = res.tempFilePaths;
      var arrskey = []
      for (let i = 0; i < imgsrc.length; i++) {
        let nameRandom = imgRandomN();
        var urlkey = ossdata.dir + nameRandom;
        arrskey.push(urlkey)
        wx.uploadFile({
          url: ossdata.host, //上传的路径
          filePath: imgsrc[i],
          name: 'file',
          formData: {
            name: 'fileData',
            key: urlkey, //文件上传的位置(默认根目录)+文件名字 默认："$(filename)"  ossdata.dir
            policy: ossdata.policy,
            OSSAccessKeyId: ossdata.accessid,
            success_action_status: '200', //让服务端返回200,不然，默认会返回204
            Signature: ossdata.signature
          },
          success: function (res) {
            wx.hideLoading()
            if (res.errMsg == "uploadFile:ok") {
              let arrays = {
                imgsrc: imgsrc, //本地图片地址
                urlkey: arrskey, //后台拼接图片地址
              }
              // 防止循环三次重复返回值
              if (i == imgsrc.length - 1) {
                success(arrays)
                app.stoast("上传成功");
              }
            } else {
              app.etoast('上传失败')
            }
          },
          fail: function (errMsg) {
            app.etoast('上传失败')
          },
        })
      }
    }

  })
}
module.exports = {
  formatTime,
  location,
  payMoney,
  navigation,
  qiniuUpload,

}
