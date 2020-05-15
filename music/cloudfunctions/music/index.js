// 云函数入口文件
const cloud = require('wx-server-sdk')
const tcbRouter = require('tcb-router');
cloud.init()
const db = cloud.database();
const rp = require('request-promise');
const BASE_URL ='http://musicapi.xiecheng.live';

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const app = new tcbRouter({
    event  //自动去找，请求的哪个路由
  });

  app.router('playlist',async (ctx,next)=>
  {
    ctx.body = await db.collection('playlist')
      .skip(event.start)  //从集合中第几个索引值开始
      .limit(event.count) //查询多少条数据
      .orderBy('createTime', 'desc')  //排序处理
      .get()
      .then((res) => {
        return res;
      });
  });

  app.router('musiclist',async (ctx,next)=>
  {
    ctx.body = await rp(BASE_URL + `/playlist/detail?id=${event.playlistId}`)
    .then((res)=>
    {
      return JSON.parse(res);
    });
  });

  app.router('musicUrl',async(ctx,next)=>
  {
    ctx.body = await rp(BASE_URL + `/song/url?id=${event.musicId}`)
    .then((res)=>
    {
      console.log('music:',res);
      return res;
    })
  });

  // 根据音乐id获取歌词
  app.router('lyric',async (ctx,next)=>
  {
    ctx.body = await rp(BASE_URL + `/lyric?id=${event.musicId}`)
    .then((res)=>
    {
      return res;
    });
  });
  
  return app.serve();
}