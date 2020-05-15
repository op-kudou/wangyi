Component({
  properties: {
    modalShow:
    {
      type:Boolean,
      value:false
    }
  },
  data: 
  {

  },
  options:
  {
    styleIsolation:'apply-shared',  //允许页面样式影响组件内部样式
    multipleSlots:true,   //启用插槽
  },
  methods: 
  {
    onClose()
    {
      this.setData({
        modalShow:false
      });
    }
  }
})
