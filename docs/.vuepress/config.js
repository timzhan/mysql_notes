const { defaultTheme } = require('@vuepress/theme-default')

var path = require("path");
var fs = require("fs");
// let pathName = path.join(process.cwd(), 'docs/notes/base_mysql');
let pathName = path.join(process.cwd(), 'docs/notes/senior_mysql');
let bases = [];
function getFils(pathName, dirs){
  return new Promise((resolve) => {
    fs.readdir(pathName, function(err, files){
      (function iterator(i){
        if(i == files.length) {
          // console.log(dirs);
          return ;
        }
        fs.stat(path.join(pathName, files[i]), function(err, data){     
          if(data.isFile()){               
              dirs.push(files[i]);
          }
          iterator(i+1);
        });
      })(0);
      resolve(files)
    });
  })
}
//获取文件名称
(async ()=>{
  bases = await getFils(pathName, []);
  bases = bases.map((v)=>{
    return {
      text: v,
      link: '/notes/senior_mysql/' + v,
    }
  })
  console.log(bases);
})()

module.exports = {
  base: process.env.NODE_ENV === 'production' ? '/mysql/' : '/',
  theme: defaultTheme({
    navbar: [
      {
        text: "mysql",
        link: "/",
      },
      { text: "demo", link: "/demo", },
    ],
    sidebar: {
      "/": [
          {
            text: 'mysql基础',
            children: [
              {
                text: '第00章_写在前面.md',
                link: '/notes/base_mysql/第00章_写在前面.md',
              },
              {
                text: '第00章_写在最后.md',
                link: '/notes/base_mysql/第00章_写在最后.md',
              },
              {
                text: '第01章_数据库概述.md',
                link: '/notes/base_mysql/第01章_数据库概述.md',
              },
              {
                text: '第02章_MySQL环境搭建.md',
                link: '/notes/base_mysql/第02章_MySQL环境搭建.md',
                children: []
              },
              {
                text: '第03章_基本的SELECT语句.md',
                link: '/notes/base_mysql/第03章_基本的SELECT语句.md',
              },
              {
                text: '第04章_运算符.md',
                link: '/notes/base_mysql/第04章_运算符.md',
              },
              {
                text: '第05章_排序与分页.md',
                link: '/notes/base_mysql/第05章_排序与分页.md',
              },
              {
                text: '第06章_多表查询.md',
                link: '/notes/base_mysql/第06章_多表查询.md',
              },
              {
                text: '第07章_单行函数.md',
                link: '/notes/base_mysql/第07章_单行函数.md',
              },
              {
                text: '第08章_聚合函数.md',
                link: '/notes/base_mysql/第08章_聚合函数.md',
              },
              {
                text: '第09章_子查询.md',
                link: '/notes/base_mysql/第09章_子查询.md',
              },
              {
                text: '第10章_创建和管理表.md',
                link: '/notes/base_mysql/第10章_创建和管理表.md',
              },
              {
                text: '第11章_数据处理之增删改.md',
                link: '/notes/base_mysql/第11章_数据处理之增删改.md',
              },
              {
                text: '第12章_MySQL数据类型精讲.md',
                link: '/notes/base_mysql/第12章_MySQL数据类型精讲.md',
              },
              {
                text: '第13章_约束.md',
                link: '/notes/base_mysql/第13章_约束.md',
              },
              {
                text: '第14章_视图.md',
                link: '/notes/base_mysql/第14章_视图.md',
              },
              {
                text: '第15章_存储过程与函数.md',
                link: '/notes/base_mysql/第15章_存储过程与函数.md',
              },
              {
                text: '第16章_变量、流程控制与游标.md',
                link: '/notes/base_mysql/第16章_变量、流程控制与游标.md',
              },
              {
                text: '第17章_触发器.md',
                link: '/notes/base_mysql/第17章_触发器.md',
              },
              {
                text: '第18章_MySQL8其它新特性.md',
                link: '/notes/base_mysql/第18章_MySQL8其它新特性.md',
              }
            ],
          },
          {
              text: 'mysql高级',
              collapsible: true,
              children: [
                {
                  text: '第01章 Linux下MySQL的安装与使用.md',
                  link: '/notes/senior_mysql/第01章 Linux下MySQL的安装与使用.md'
                },
                {
                  text: '第02章 MySQL的数据目录.md',
                  link: '/notes/senior_mysql/第02章 MySQL的数据目录.md'
                },
                {
                  text: '第03章 用户与权限管理.md',
                  link: '/notes/senior_mysql/第03章 用户与权限管理.md'
                },
                { text: '第04章 逻辑架构.md', link: '/notes/senior_mysql/第04章 逻辑架构.md' },
                { text: '第05章 存储引擎.md', link: '/notes/senior_mysql/第05章 存储引擎.md' },
                {
                  text: '第06章 索引的数据结构.md',
                  link: '/notes/senior_mysql/第06章 索引的数据结构.md'
                },
                {
                  text: '第07章 InnoDB数据存储结构.md',
                  link: '/notes/senior_mysql/第07章 InnoDB数据存储结构.md'
                },
                {
                  text: '第08章 索引的创建与设计原则.md',
                  link: '/notes/senior_mysql/第08章 索引的创建与设计原则.md'
                },
                {
                  text: '第09章 性能分析工具的使用.md',
                  link: '/notes/senior_mysql/第09章 性能分析工具的使用.md'
                },
                {
                  text: '第10章 索引优化与查询优化.md',
                  link: '/notes/senior_mysql/第10章 索引优化与查询优化.md'
                },
                {
                  text: '第11章 数据库的设计规范.md',
                  link: '/notes/senior_mysql/第11章 数据库的设计规范.md'
                },
                {
                  text: '第12章 数据库其它调优策略.md',
                  link: '/notes/senior_mysql/第12章 数据库其它调优策略.md'
                },
                {
                  text: '第13章 事务基础知识.md',
                  link: '/notes/senior_mysql/第13章 事务基础知识.md'
                },
                {
                  text: '第14章 MySQL事务日志.md',
                  link: '/notes/senior_mysql/第14章 MySQL事务日志.md'
                },
                { text: '第15章 锁.md', link: '/notes/senior_mysql/第15章 锁.md' },
                {
                  text: '第16章 多版本并发控制.md',
                  link: '/notes/senior_mysql/第16章 多版本并发控制.md'
                },
                {
                  text: '第17章 其它数据库日志.md',
                  link: '/notes/senior_mysql/第17章 其它数据库日志.md'
                },
                { text: '第18章 主从复制.md', link: '/notes/senior_mysql/第18章 主从复制.md' },
                {
                  text: '第19章 数据库备份与恢复.md',
                  link: '/notes/senior_mysql/第19章 数据库备份与恢复.md'
                }
              ],
          },
      ],
      "/demo": [
        { text: "demo1", link: "/demo/demo1"},
        { text: "dem2", link: "/demo/demo2"},
      ],
    },
    // 添加侧边栏
    // navbar: [
    // ],
    // sidebar: [

    // ],
  }),
}