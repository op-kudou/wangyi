Component({
  properties: {
    musiclist:{
      type:Array
    }
  },
  data:
  {
    playingId:-1
  },
  methods:
  {
    onSelect(e)
    {
      var id = e.currentTarget.dataset.index;
      this.setData({
        playingId: e.currentTarget.dataset.musiclistid
      });
      wx.showLoading({
        title: '加载中...',
      });

      // 跳转播放页面
      wx.navigateTo({
        url: `/pages/player/player?musicId=${id}`,
        success:(res)=>
        {
          wx.hideLoading();
        },
        fail:()=>
        {
          wx.hideLoading();
        }
      })
    },
  },

})
