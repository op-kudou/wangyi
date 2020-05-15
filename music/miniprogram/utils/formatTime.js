module.exports = (date)=>
{
  let fmt = 'yyyy-MM-dd hh:mm:ss';
  let o = {
    'M+':date.getMonth()+1,
    'd+':date.getDate(),
    'h+':date.getHours(),
    'm+':date.getMinutes(),
    's+':date.getSeconds()
  }
  if(/(y+)/.test(fmt))
  {
    fmt = fmt.replace(RegExp.$1,date.getFullYear());
  }
  for(let x in o)
  {
    if(new RegExp('('+x+')').test(fmt))
    {
      fmt = fmt.replace(RegExp.$1,o[x].toString().length==1?'0'+o[x]:o[x]);
    }
  }
  return fmt;
}