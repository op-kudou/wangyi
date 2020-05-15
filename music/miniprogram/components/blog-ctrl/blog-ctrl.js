let userInfo = {};  // 表示用户信息
let db = wx.cloud.database();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blogid:
    {
      type:String
    }
  },
  externalClasses: ['iconfont', 'icon-pinglun', 'icon-fenxiang'],
  /**
   * 组件的初始数据
   */
  data: {
    loginShow: false,  // 登入组件是否显示
    modalShow: false,  // 控制评论是否显示
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onComment() {
      // 判断用户是否授权
      wx.getSetting({
        success: (result) => {
          if (result.authSetting['scope.userInfo']) { // 授权
            wx.getUserInfo({
              success: (res) => {
                userInfo = res.userInfo;
                // 显示评论的弹框
                this.setData({
                  modalShow: true
                })
              },
              fail: () => { },
              complete: () => { }
            });
          } else {
            this.setData({
              loginShow: true
            })
          }
        },
        fail: () => { },
        complete: () => { }
      });
    },
    // 授权成功 授权框消失 评论框显示
    // --- 注意先后顺序
    onloginsuccess(e) {
      userInfo = e.detail.userInfo;
      console.log('useringo:',userInfo);
      this.setData({
        loginShow: false
      }, () => {
        this.setData({
          modalShow: true
        })
      })
    },
    // 授权失败
    onloginfail() 
    {
      wx.showModal({
        title: '授权的用户才能进行评价',
        content: '',
      });
    },
    onInput(e)
    {
      this.setData({
        content:e.detail.value
      });
    },
    onsend(e)
    {
      console.log('e:',e);
      // let content = this.data.content;
      // if(content.trim == '')
      // {
      //   wx.showModal({
      //     title: '评论内容不能为空',
      //     content: '',
      //   });
      //   return;
      // }
      // wx.showLoading({
      //   title: '发表中...',
      //   mask:true
      // });
      // db.collection('blog-comment').add({
      //   data: {
      //     content,
      //     createTime: db.serverDate(),
      //     blogId: this.properties.blogId,
      //     nickName: userInfo.nickName,
      //     avatarUrl: userInfo.avatarUrl
      //   }
      // }).then((res) => {
      //   wx.hideLoading();
      //   wx.showToast({
      //     title: '评论成功',
      //     duration: 1500,
      //   });
      //   this.setData({
      //     modalShow: false,
      //     content: ''
      //   })
      // })

    },
  }
})
