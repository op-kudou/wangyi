//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({

        // env: 'yun-x53dj',
        traceUser: true,
      })
    }
    this.getOpenid();
    this.globalData = {
      playingMusicId:-1,
      openid:-1
    }
  },
  setPlayingMusicId(id)
  {
    this.globalData.playingMusicId = id;
  },
  getPlayMusicId()
  {
    return this,globalData.playingMusicId;
  },
  getOpenid()
  {
    wx.cloud.callFunction({
      name:'login',
    }).then((res)=>
    {
      let openid = res.result.openid;
      this.globalData.openid = openid;
      if(wx.getStorageSync(openid)=='')
      {
        wx.setStorageSync(this.globalData.openid, []);
      }
    });
  }
})
