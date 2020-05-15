import formatTime from '../../utils/formatTime.js';
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blog: {
      type: Object
    }

  },
  observers:{
    ['blog.createTime'](val)
    {
      if(val)
      {
        this.setData({
          createTime:formatTime(new Date(val))
        });
      }
    }
  },
  data: {
    createTime:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onPreview(event)
    {
      let {imgSrc,imgs} = event.target.dataset;
      wx.previewImage({
        current:imgSrc,
        urls: imgs,
      })
    }
  }
})
