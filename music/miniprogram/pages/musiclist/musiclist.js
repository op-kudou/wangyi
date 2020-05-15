Page({
  data: {
    musiclist:[],
    listInfo:{},
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中'
    });
    wx.cloud.callFunction({
      name:'music',
      data:{
        playlistId: options.playlistId,
        $url:'musiclist'
      }
    }).then((res)=>
    {
      var {playlist} = res.result;
      this.setData(
      {
        musiclist: playlist.tracks,
        listInfo:{
          coverImgUrl: playlist.coverImgUrl,
          name: playlist.name
        },
      });
      this.setLocalMusiclist();
      wx.hideLoading();
    });
  },
  // 将歌单列表保存到本地
  setLocalMusiclist() {
    wx.setStorage({
      key: 'musiclist',
      data: this.data.musiclist,
    })
  }
})