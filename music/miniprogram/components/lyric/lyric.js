var lyricHeight = 0;
Component({
  properties:
  {
    isLyricShow:
    {
      type:Boolean,
      value:false
    },
    lyric:
    {
      type:String
    }
  },
  observers:
  {
    lyric(lrc)
    {
      this.parseLyric(lrc);
      if(lrc=='暂无歌词')
      {
        this.setData({
          lyriclist: ['暂无歌词']
        });
      }
    }
  },
  data:
  {
    lyriclist:[],
    nowLyricIndex:0,  //表示当前选中的歌词
    scrollTop:0,  //滚动条滚动高度
  },
  // 组件生命周期
  lifetimes:
  {
    ready()
    {
      // 获取设备信息
      wx.getSystemInfo({
        success: function(res) 
        {
          lyricHeight = res.screenWidth/750*64;
        },
      })
    }
  },
  methods:
  {
    parseLyric(slyric)
    {
      var lyriclist = [];
      var line = slyric.split('\n');
      line.forEach(item=>
      {
        var regTime = /\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g;
        let time = item.match(regTime);
        if(time != null)
        {
          for(var i=0;i<time.length;i++)
          {
            var timeRge = time[i].match(/(\d{2,}):(\d{2})(?:\.(\d{2,3}))?/);
            var lrc = item.split(time)[1];
            // 把时间转化为秒
            var timeSecond = parseInt(timeRge[1] * 60 + parseInt(timeRge[2]) + parseInt(timeRge[3] / 1000));
            lyriclist.push({
              lrc,
              time: timeSecond
            });
          }
        }
      });
      this.setData({
        lyriclist
      });
    },
    update(currentTime)
    {
      // console.log('currentTime:', currentTime);
      var lyriclist = this.data.lyriclist;
      if(lyriclist.length == 0)
      {
        return;
      }
      for(var i=0;i<lyriclist.length;i++)
      {
        if(currentTime<=lyriclist[i].time)
        {
          this.setData({
            nowLyricIndex:i-1,
            scrollTop:(i-1)*lyricHeight
          });
          break;
        }
      }
    }
  }
})
