// 云函数入口文件
const cloud = require('wx-server-sdk')
const tcbRouter = require('tcb-router');

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const app = new TcbRouter({event});

  // 定义公共路由
  app.use(async (ctx,next)=>
  {
    ctx.data = {con:'我是公共数据'};
    ctx.data.openid = wxContext.openid;
    await next();
  });
  app.router('music',async(ctx,next)=>
  {
    ctx.data.name = 'music';
    await next();
  },async (ctx,next)=>
  {
    ctx.data.age = '音乐';
    ctx.body = {data:ctx.data};
  });

  app.router('movie',async (ctx,next)=>
  {
    ctx.data.name = 'movie';
    ctx.data.age = '电影';

    ctx.data = {
      name:'movie',
      age:'电影'
    }
    ctx.body = {
      data:ctx.data
    };
  })
  return app.serve();
}