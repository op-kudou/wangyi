const app = getApp();
var musiclist = [];  //歌曲列表，（不属于这个页面，所以不能放进data）
var newPlayingIndex = -1;  //当前歌曲播放索引
var backAudioManager = wx.getBackgroundAudioManager();
Page({
  data:
  {
    picUrl:'',  //播放页面的歌曲图片
    isPlaying:true, //是否播放
    isLyricShow:false, //歌词的显示隐藏
    lyric:''
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
    });
    newPlayingIndex = options.musicId;
    this.getLocalMusic(newPlayingIndex);
  },
  // 从本地获取歌曲列表
  getLocalMusic(index)
  {
    musiclist = wx.getStorageSync('musiclist');
    this.getMusicDetail();
    wx.hideLoading();
  },
  // 获取歌曲详细信息
  getMusicDetail()
  {
    var music = musiclist[newPlayingIndex];
    wx.setNavigationBarTitle({
      title: music.name,
    });
    this.setData({
      picUrl:music.al.picUrl,
      isPlaying:false
    });
    var musicId = music.al.id;
    wx.cloud.callFunction({
      name: "music",
      data: {
        $url: "musicUrl",
        musicId
      }
    }).then(((res) => 
    {

      var result = JSON.parse(res.result);
      // var result = res.result;

      // 背景音乐的配置信息
      if (result.data[0].url) 
      {
        backAudioManager.title = music.name  //音频标题，
        backAudioManager.singer = music.ar[0].name  //歌手名
        backAudioManager.coverImgUrl = music.al.picUrl  //封面图 URL，
        backAudioManager.src = result.data[0].url // 音频地址
        backAudioManager.epname = music.al.name //专辑名
        this.setData({
          isPlaying:true
        });
        // 保存播放历史
        this.savePlayHistory();

        // 加载歌词
        wx.cloud.callFunction(
        {
          name:'music',
          data:{
            musicId,
            $url:'lyric'
          }
        }).then((res)=>
        {
          var lyric = '暂无歌词';
          var lrc = JSON.parse(res.result).lrc;
          if(lrc)
          {
            lyric = lrc.lyric;
          }
          this.setData({
            lyric
          });
        }).catch((err)=>
        {
          wx.showToast({
            title: '歌词出错了'+err,
          })
        });

      } 
      else 
      {
        backAudioManager.stop();
        wx.showToast({
          title: '音乐需要开通vip,返回上一页',
          icon: 'none',
          duration: 1500,
          mask: false,
          success: (result) => {
          }
        });
      }
    })).catch((err) => {
      console.log(err)
    })
  },
  togglePlaying() 
  {
    if (this.data.isPlaying) 
    {
      backAudioManager.pause(); // 暂停
    } 
    else 
    {
      backAudioManager.play(); // 播放
    }
    this.setData({
      isPlaying: !this.data.isPlaying
    })
  },
  onPrev()
  {
    newPlayingIndex--;
    if(newPlayingIndex<0)
    {
      newPlayingIndex = musiclist.length-1;
    }
    this.getMusicDetail();
  },
  onNext()
  {
    newPlayingIndex++;
    if (newPlayingIndex == musiclist.length) {
      newPlayingIndex = 0;
    }
    this.getMusicDetail();
  },
  onChangeLyricShow()
  {
    this.setData({
      isLyricShow:!this.data.isLyricShow
    });
  },
  timeUpdate(event)
  {
    // 选中自定义的组件
    this.selectComponent('.lyric').update(event.detail.currentTime);
  },
  musicPlay()
  {
    this.setData({
      isPlaying:true
    });
  },
  musicPause() {
    this.setData({
      isPlaying: false
    });
  },
  // 保存当前播放音乐
  savePlayHistory()
  {
    let music = musiclist[newPlayingIndex];
    let openid = app.globalData.openid;
    let history = wx.getStorageSync(openid);
    let flag = false;
    console.log('music:',music,'openid:',openid);

    for(let i=0,len=history.length;i<len;i++)
    {
      if(history[i].id == music.al.id)
      {
        flag = true;
        break;
      }
      if(!flag)
      {
        history.unshift(music);
        wx.setStorage({
          key: openid,
          data: history,
        })
      }
    }
  }
})