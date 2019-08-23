const app = getApp()
import utils from '../../utils/util.js'

Page({
  data: {
  text:'cccccc',
  text1:'DDDDDDDDD',
  islogin:false,
  avatar:app.globalData.userInfo
  },
  gomine(){
    
   
  },
  //getuserinfo异步的会有延迟，因此在首页不能根据app.globalData.userInfo 进行判断
  getUserInfo(){
    if (app.globalData.userInfo) {
      
    } else {
      app.lunchCallback = () => {
        wx.getUserInfo({
          success: res => {
            app.globalData.userInfo = userInfo
            
          }
        })
      }
    }
  },

})
