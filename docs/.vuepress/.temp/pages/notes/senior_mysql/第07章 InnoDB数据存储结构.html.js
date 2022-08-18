export const data = JSON.parse("{\"key\":\"v-5ddec632\",\"path\":\"/notes/senior_mysql/%E7%AC%AC07%E7%AB%A0%20InnoDB%E6%95%B0%E6%8D%AE%E5%AD%98%E5%82%A8%E7%BB%93%E6%9E%84.html\",\"title\":\"第7章_InnoDB数据存储结构\",\"lang\":\"en-US\",\"frontmatter\":{},\"excerpt\":\"\",\"headers\":[{\"level\":2,\"title\":\"1. 数据库的存储结构：页\",\"slug\":\"_1-数据库的存储结构-页\",\"children\":[{\"level\":3,\"title\":\"1.1 磁盘与内存交互基本单位：页\",\"slug\":\"_1-1-磁盘与内存交互基本单位-页\",\"children\":[]},{\"level\":3,\"title\":\"1.2 页结构概述\",\"slug\":\"_1-2-页结构概述\",\"children\":[]},{\"level\":3,\"title\":\"1.3 页的大小\",\"slug\":\"_1-3-页的大小\",\"children\":[]},{\"level\":3,\"title\":\"1.4 页的上层结构\",\"slug\":\"_1-4-页的上层结构\",\"children\":[]}]},{\"level\":2,\"title\":\"2. 页的内部结构\",\"slug\":\"_2-页的内部结构\",\"children\":[{\"level\":3,\"title\":\"第一部分：File Header (文件头部) 和 File Trailer (文件尾部)\",\"slug\":\"第一部分-file-header-文件头部-和-file-trailer-文件尾部\",\"children\":[]},{\"level\":3,\"title\":\"第二部分：User Records (用户记录)、最大最小记录、Free Space (空闲空间)\",\"slug\":\"第二部分-user-records-用户记录-、最大最小记录、free-space-空闲空间\",\"children\":[]},{\"level\":3,\"title\":\"第三部分：Page Directory (页目录) 和 Page Header (页面头部)\",\"slug\":\"第三部分-page-directory-页目录-和-page-header-页面头部\",\"children\":[]},{\"level\":3,\"title\":\"2.3 从数据库页的角度看B+树如何查询\",\"slug\":\"_2-3-从数据库页的角度看b-树如何查询\",\"children\":[]}]},{\"level\":2,\"title\":\"3. InnoDB行格式 (或记录格式)\",\"slug\":\"_3-innodb行格式-或记录格式\",\"children\":[]},{\"level\":2,\"title\":\"4. 区、段与碎片区\",\"slug\":\"_4-区、段与碎片区\",\"children\":[{\"level\":3,\"title\":\"4.1 为什么要有区？\",\"slug\":\"_4-1-为什么要有区\",\"children\":[]},{\"level\":3,\"title\":\"4.2 为什么要有段？\",\"slug\":\"_4-2-为什么要有段\",\"children\":[]},{\"level\":3,\"title\":\"4.3 为什么要有碎片区？\",\"slug\":\"_4-3-为什么要有碎片区\",\"children\":[]},{\"level\":3,\"title\":\"4.4 区的分类\",\"slug\":\"_4-4-区的分类\",\"children\":[]}]},{\"level\":2,\"title\":\"5. 表空间\",\"slug\":\"_5-表空间\",\"children\":[{\"level\":3,\"title\":\"5.1 独立表空间\",\"slug\":\"_5-1-独立表空间\",\"children\":[]},{\"level\":3,\"title\":\"5.2 系统表空间\",\"slug\":\"_5-2-系统表空间\",\"children\":[]}]},{\"level\":2,\"title\":\"附录：数据页加载的三种方式\",\"slug\":\"附录-数据页加载的三种方式\",\"children\":[]}],\"git\":{\"updatedTime\":1660804158000,\"contributors\":[{\"name\":\"涂威\",\"email\":\"tuwei@lonch.com.cn\",\"commits\":1}]},\"filePathRelative\":\"notes/senior_mysql/第07章 InnoDB数据存储结构.md\"}")

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updatePageData) {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ data }) => {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  })
}
