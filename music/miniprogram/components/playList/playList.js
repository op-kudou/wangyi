Component({
  properties: {
    playlist: {
      type: Object
    }
  },
  data:
  {
    count:0
  },
  observers:
  {
    // 监听playlist对象playCount值得变化
    ['playlist.playCount'](val)
    {
      var count = this.tranNumber(val,2);
      this.setData(
      {
        count,
      });
    }
  },
  methods:
  {
    tranNumber(num,poiot)
    {
      let numStr = num.toString().split('.')[0];
      if(numStr.length<6)
      {
        return numStr;
      }
      else if(numStr.length>=6 && numStr.length<=8)
      {
        let decimal = numStr.substring(numStr.length-4,numStr.length-4+poiot);
        return parseFloat(parseInt(num/10000) +'.'+decimal) +'万';
      }
      else if(numStr.length>8)
      {
        let decimal = numStr.substring(numStr.length-8,numStr.length-8+poiot);
        return parseFloat(parseInt(num / 100000000) + '.' + decimal) + '亿';
      }
    },
    // 点击歌单跳转歌曲列表
    goToMusiclist()
    {
      wx.showLoading({
        title: '跳转中...',
      })
      wx.navigateTo({
        url: `/pages/musiclist/musiclist?playlistId=${this.properties.playlist.id}`,
        complete:()=>
        {
          wx.hideLoading()
        }
      })
    }
  },
  
})