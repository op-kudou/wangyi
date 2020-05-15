var movableAreaWidth = 0;
var movableViewWidth = 0;
var backAudioManager = wx.getBackgroundAudioManager();
var currentSec = -1; //当前秒数
var duration = 0; //当前歌曲的总时间，单位s
var isMoving = false;
Component({
  properties: {

  },
  data: {
    showTime:{
      currentTime:"00:00", //播放时间
      totalTime:'00:00',  //歌曲总时间
    },
    movableDis: 0,  //进度条移动距离
    progress:0,
  },
  // 组件中生命周期
  lifetimes:
  {
    ready()
    {
      this.getMobleDis();
      this.bindBGMEvent();
    }
  },
  methods: {
    onChange(event)
    {
      if(event.detail.source=='touch')
      {
        this.data.progress = event.detail.x/(movableAreaWidth - movableViewWidth) *100;
        this.data.movableDis = event.detail.x;
        isMoving = true;
      }
    },
    onTouchEnd()
    {
      var currentTimeFmt = this.dateFormat(Math.floor(backAudioManager.currentTime));
      this.setData({
        progress:this.data.progress,
        movableDis:this.data.movableDis,
        ['showTime.currentTime']:`${currentTimeFmt.min}:${currentTimeFmt.sec}`
      });
      //音乐快进到某个位置
      backAudioManager.seek(duration*this.data.progress/100);  
      isMoving = false;
    },
    getMobleDis()
    {
      // 小程序原生获取组件信息
      const query = this.createSelectorQuery();
      query.select('.movable-area').boundingClientRect();
      query.select('.movable-view').boundingClientRect();
      query.exec((rect)=>
      {
        movableAreaWidth = rect[0].width;
        movableViewWidth = rect[1].width;
      });
    },
    bindBGMEvent()
    {
      backAudioManager.onPlay(()=>
      {
        // console.log('onplay');
      });
      backAudioManager.onStop(() => {
        // console.log('onstop');
      });
      backAudioManager.onPause(() => {
        // console.log('onpause');
      });
      backAudioManager.onWaiting(() => {
        // console.log('onWaiting');
      });
      backAudioManager.onCanplay(() => 
      {
        // console.log('onCanplay', backAudioManager.duration);
        if (typeof backAudioManager.duration == 'undefined') {
          setTimeout(() => {
            this.setTime();
          }, 1000);
        }
        else {
          this.setTime();
        }
      });
      backAudioManager.onTimeUpdate(() => 
      {
        // console.log('ontimeupdate');
        if(!isMoving)
        {
          const currentTime = backAudioManager.currentTime;
          duration = backAudioManager.duration;
          var currentTimeFmt = this.dateFormat(currentTime);
          var sec = currentTime.toString().split('.')[0];
          // 优化处理
          if (sec != currentSec) {
            var currentTimeFmt = this.dateFormat(currentTime);
            this.setData({
              ['showTime.currentTime']: `${currentTimeFmt.min}:${currentTimeFmt.sec}`,
              movableDis: (movableAreaWidth - movableViewWidth) * currentTime / duration,
              progress: currentTime / duration * 100
            });
            currentSec = sec;
            this.triggerEvent('timeUpdate', {currentTime});
          }
        }
      });
      backAudioManager.onEnded((res) => {
        // console.log('onEnded');
        this.triggerEvent('musicEnd');
      });
      backAudioManager.onError((res) => {
        wx.showToast({
          title: '错误' + res.errCode,
          icon: 'none',
        });
      });
    },
    // 对播放时间格式处理
    setTime() 
    {
      duration = backAudioManager.duration;  //获取歌曲总时长
      const durationFmt = this.dateFormat(duration);
      this.setData({
        ['showTime.totalTime']: `${durationFmt.min}:${durationFmt.sec}`
      });
    },
    dateFormat(sec) 
    {
      var min = Math.floor(sec / 60);
      sec = Math.floor(sec%60);
      return {
        'min': this.parse0(min),
        'sec': this.parse0(sec)
      }
    },
    parse0(sec)
    {
      return sec<10?'0'+sec:sec;
    }
  },
})
