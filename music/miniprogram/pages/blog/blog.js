let keyword = '' // 表示索索条件
let db = wx.cloud.database();
// 获取数据的总长度 （建议在云函数中做）
let blogCount = 0
Page({
  data:
  {
    modalShow: false, //控制底部弹出是显示还是隐藏
    blogList:[],
    isReachBottom: false,   // 是否显示没有跟多数据了
    isNolist: false   // 是否显示么有跟多搜索结果 isReachBottom: false,   
  },


  onLoad: function (options) {
    this.loadBlogList();
    db.collection('blog').count().then((res) => 
    {
      blogCount = res.total;
    })
  },
  // 获取博客列表
  loadBlogList(start = 0) {
    wx.showLoading({
      title: '加载中....',
    });
    wx.cloud.callFunction({
      name: "blog",
      data: {
        keyword,
        start: 0,
        count: 10,
        $url: 'list'
      }
    }).then((res) => {
      // 更新blogList
      this.setData({
        // 分页加载数据  ---> 数据的累加 ---> 合并数组
        blogList: this.data.blogList.concat(res.result),
        isReachBottom: false,
        isNolist: false
      });
      wx.hideLoading();
    });
  },

  // 发布功能
  onPublish() 
  {
    // 判断用户是否授权
    wx.getSetting({
      success:(res)=>
      {
        if(res.authSetting['scope.userInfo'])
        {
          //获取用户信息
          wx.getUserInfo({
            success:(res)=>
            {
              this.onloginsuccess({
                detail: res
              });
            }
          });
        }
        else
        {
          // 没有授权；弹出底部弹出成；获取用户信息
          this.setData({
            modalShow: true,
          })
        }
      },
      fail:()=>
      {
        complete:()=>{}
      }
    });
  },
  onloginsuccess(event)
  {
    const detail = event.detail.userInfo;
    wx.navigateTo({
      url: `/pages/blog-edit/blog-edit?nickName=${detail.nickName}&avatarUrl=${detail.avatarUrl}`,
      success:(res)=>
      {
        
      },
      fail:()=>{},
      complete:()=>{}
    })
  },
  onloginfail()
  {
    wx.showModal({
      title: '授权用户才能发布博客',
      content: '',
      success:(res)=>
      {
        if(res.confirm)
        {
          this.setData({
            modalShow: true
          });
        }
      },
    })
  },
  /**
   * 下拉刷新
   */
  onPullDownRefresh: function () {
    this.setData({
      blogList: []
    })
    this.loadBlogList()
  },
  /**
 * 页面上拉触底事件的处理函数
 */
  onReachBottom: function () {
    console.log(blogCount)
    if (this.data.blogList.length == blogCount) {
      this.setData({
        isReachBottom: true
      })
      return
    }
    this.loadBlogList(this.data.blogList.length)
  },
  goComment(event) {
    wx.navigateTo({
      url: "/pages/blog-comment/blog-comment?blogid=" + event.target.dataset.blogid
    })
  },
  onSearch(event) {
    this.setData({
      blogList: [],
    })
    keyword = event.detail.keyword;// 搜索条件
    this.loadBlogList()
    // 当blogList 的长度为0 的时候；表示么有搜索到内容
    // ------> 等获取博客列表异步 结束时候 在进行判断
    setTimeout(() => {
      if (this.data.blogList.length === 0) {
        this.setData({
          isNolist: true
        })
      }
    }, 3000);
  },
})