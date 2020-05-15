Component({
  properties: {
    modalShow:
    {
      type: Boolean,
      value: false
    }
  },
  // observers:
  // {
  //   modalShow(aa)
  //   {
  //     console.log('aa:',aa);
  //   }
  // },
  data: {

  },
  methods: {
    onGetUserInfo(e) 
    {
      const userInfo = e.detail.userInfo;
      if (userInfo) 
      {
        this.setData({
          modalShow: false
        })
        //告诉blog登录成功
        this.triggerEvent('loginsuccess', { userInfo });
      } 
      else 
      {
        this.triggerEvent('loginfail');
      }
    }

  }
})
