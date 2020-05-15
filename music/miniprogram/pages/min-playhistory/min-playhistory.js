
Page({
  data: {
    musiclist:[]
  },
  onLoad: function (options) {
    this.setData({
      musiclist:wx.getStorageSync(openid)
    });
  },

})