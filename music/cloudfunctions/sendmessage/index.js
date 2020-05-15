// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const {OPENID} = cloud.getWXContext()

  cloud.openapi.subscribeMessage.send({
    touser:OPENID,
    page:'/pages/blog-comment/blog-comment?blogId='+event.blogid,
    data:{
      thing1: { value: event.nickName},
      thing3: { value: event.content}
    },
    templateId:'WOA37hsne4JcpiKA4uX5l9Cl4p3Cxv95Jfr0I-lps0A',//模板id
  });
  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}