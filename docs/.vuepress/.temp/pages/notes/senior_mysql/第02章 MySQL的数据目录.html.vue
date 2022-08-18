<template><div><!--
 * @Author: tuWei
 * @Date: 2022-08-17 00:53:59
 * @LastEditors: tuWei
 * @LastEditTime: 2022-08-18 15:18:08
-->
<h3 id="第02章-mysql的数据目录" tabindex="-1"><a class="header-anchor" href="#第02章-mysql的数据目录" aria-hidden="true">#</a> 第02章 MySQL的数据目录</h3>
<h4 id="_1-mysql8的主要目录结构" tabindex="-1"><a class="header-anchor" href="#_1-mysql8的主要目录结构" aria-hidden="true">#</a> <strong>1. MySQL8的主要目录结构</strong></h4>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">find</span> / -name mysql
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h5 id="_1-1数据库文件的存放路径" tabindex="-1"><a class="header-anchor" href="#_1-1数据库文件的存放路径" aria-hidden="true">#</a> <strong>1.1数据库文件的存放路径</strong></h5>
<p>MySQL数据库文件的存放路径:/var/lib/mysql/</p>
<div class="language-mysql ext-mysql line-numbers-mode"><pre v-pre class="language-mysql"><code>mysql&gt; show variables like 'datadir';
+---------------+-----------------+
| Variable_name | Value           |
+---------------+-----------------+
| datadir       | /var/lib/mysql/ |
+---------------+-----------------+
1 row in set (0.04 sec)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="_1-2相关命令目录" tabindex="-1"><a class="header-anchor" href="#_1-2相关命令目录" aria-hidden="true">#</a> <strong>1.2相关命令目录</strong></h5>
<p><strong>相关命令目录：/usr/bin 和/usr/sbin。</strong></p>
<h5 id="_1-3配置文件目录" tabindex="-1"><a class="header-anchor" href="#_1-3配置文件目录" aria-hidden="true">#</a> <strong>1.3配置文件目录</strong></h5>
<p><strong>配置文件目录：/usr/share/mysql-8.0（命令及配置文件），/etc/mysql（如my.cnf）</strong></p>
<h4 id="_2-数据库和文件系统的关系" tabindex="-1"><a class="header-anchor" href="#_2-数据库和文件系统的关系" aria-hidden="true">#</a> <strong>2.数据库和文件系统的关系</strong></h4>
<h5 id="_2-1表在文件系统中的表示" tabindex="-1"><a class="header-anchor" href="#_2-1表在文件系统中的表示" aria-hidden="true">#</a> <strong>2.1表在文件系统中的表示</strong></h5>
<p>2.1 查看默认数据库
查看一下在我的计算机上当前有哪些数据库:</p>
<div class="language-mysql ext-mysql line-numbers-mode"><pre v-pre class="language-mysql"><code>mysql&gt; SHOW DATABASES;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>可以看到有4个数据库是属于MySQL自带的系统数据库。</p>
<ul>
<li>
<p>mysql</p>
<p>MySQL 系统自带的核心数据库，它存储了MySQL的用户账户和权限信息，一些存储过程、事件的定 义信息，一些运行过程中产生的日志信息，一些帮助信息以及时区信息等。</p>
</li>
<li>
<p>information_schema
MySQL 系统自带的数据库，这个数据库保存着MySQL服务器 维护的所有其他数据库的信息 ，比如有 哪些表、哪些视图、哪些触发器、哪些列、哪些索引。这些信息并不是真实的用户数据，而是一些 描述性信息，有时候也称之为 元数据 。在系统数据库 information_schema 中提供了一些以
innodb_sys 开头的表，用于表示内部系统表。</p>
</li>
<li>
<p>performance_schema</p>
<p>MySQL 系统自带的数据库，这个数据库里主要保存MySQL服务器运行过程中的一些状态信息，可以 用来 监控 MySQL 服务的各类性能指标 。包括统计最近执行了哪些语句，在执行过程的每个阶段都 花费了多长时间，内存的使用情况等信息。</p>
</li>
<li>
<p>sys
MySQL 系统自带的数据库，这个数据库主要是通过 视图 的形式把 information_schema 和 performance_schema 结合起来，帮助系统管理员和开发人员监控 MySQL 的技术性能。</p>
</li>
</ul>
<div class="language-mysql ext-mysql line-numbers-mode"><pre v-pre class="language-mysql"><code>mysql&gt; USE information_schema;
Database changed
mysql&gt; SHOW TABLES LIKE 'innodb_sys%';
+--------------------------------------------+
| Tables_in_information_schema (innodb_sys%) |
+--------------------------------------------+
| INNODB_SYS_DATAFILES                       |
| INNODB_SYS_VIRTUAL                         |
| INNODB_SYS_INDEXES                         |
| INNODB_SYS_TABLES                          |
| INNODB_SYS_FIELDS                          |
| INNODB_SYS_TABLESPACES                     |
| INNODB_SYS_FOREIGN_COLS                    |
| INNODB_SYS_COLUMNS                         |
| INNODB_SYS_FOREIGN                         |
| INNODB_SYS_TABLESTATS                      |
+--------------------------------------------+
10 rows in set (0.00 sec)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="_2-2表在文件系统中的表示" tabindex="-1"><a class="header-anchor" href="#_2-2表在文件系统中的表示" aria-hidden="true">#</a> <strong>2.2表在文件系统中的表示</strong></h5>
<p>看一下我的计算机上的数据目录下的内容:</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token builtin class-name">cd</span> /var/lib/mysql
ll

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="_2-3-表在文件系统中的表示" tabindex="-1"><a class="header-anchor" href="#_2-3-表在文件系统中的表示" aria-hidden="true">#</a> 2.3 表在文件系统中的表示</h5>
<h6 id="_2-3-1-innodb存储引擎模式" tabindex="-1"><a class="header-anchor" href="#_2-3-1-innodb存储引擎模式" aria-hidden="true">#</a> <strong>2.3.1 InnoDB存储引擎模式</strong></h6>
<p><strong>1.表结构</strong></p>
<p>为了保存表结构，<code v-pre>InnoDB</code>在<code v-pre>数据目录</code>下对应的数据库子目录下创建了一个专门用于<code v-pre>描述表结构的文件</code></p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>表名.frm
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>在dbs数据库下创建一个名为 test 的表:</p>
<div class="language-mysql ext-mysql line-numbers-mode"><pre v-pre class="language-mysql"><code>mysql&gt; USE dbs;
Database changed
mysql&gt; CREATE TABLE test (
    -&gt;     c1 INT
    -&gt; );
Query OK, 0 rows affected (0.03 sec)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>那在数据库dbs对应的子目录下会创建一个test.frm的用于描述表结构的文件，这个文件在各平台是相同的， .frm是以二进制存储的</p>
<p><strong>2.表中数据和索引</strong></p>
<p><strong>① 系统表空间（system tablespace）</strong></p>
<p>默认情况下，InnoDB会在数据目录下创建一个名为<code v-pre>ibdata1</code>、大小为<code v-pre>12M</code>的<code v-pre>自拓展</code>文件，这个文件就是对应的<code v-pre>系统表空间</code>在文件系统上的表示。</p>
<p><strong>② 独立表空间(file-per-table tablespace)</strong></p>
<p>在MySQL5.6.6以及之后的版本中，InnoDB并不会默认的把各个表的数据存储到系统表空间中，而是为<code v-pre>每一个表建立一个独立表空间</code>，也就是说我们创建了多少个表，就有多少个独立表空间。使用<code v-pre>独立表空间</code>来存储表数据的话，会在该表所属数据库对应的子目录下创建一个表示该独立表空间的文件，文件名和表名相同。</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>表名.ibd
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><blockquote>
<p>MySQL8.0中不再单独提供<code v-pre>表名.frm</code>，而是合并在<code v-pre>表名.ibd</code>文件中。</p>
</blockquote>
<p><strong>③ 系统表空间与独立表空间的设置</strong></p>
<p>我们可以自己指定使用<code v-pre>系统表空间</code>还是<code v-pre>独立表空间</code>来存储数据，这个功能由启动参数<code v-pre>innodb_file_per_table</code>控制</p>
<div class="language-ini ext-ini line-numbers-mode"><pre v-pre class="language-ini"><code><span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">server</span><span class="token punctuation">]</span></span> 
<span class="token key attr-name">innodb_file_per_table</span><span class="token punctuation">=</span><span class="token value attr-value">0 # 0：代表使用系统表空间； 1：代表使用独立表空间</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>④ 其他类型的表空间</strong></p>
<p>随着MySQL的发展，除了上述两种老牌表空间之外，现在还新提出了一些不同类型的表空间，比如通用表空间（general tablespace）、临时表空间（temporary tablespace）等。</p>
<h6 id="_2-3-2-myisam存储引擎模式" tabindex="-1"><a class="header-anchor" href="#_2-3-2-myisam存储引擎模式" aria-hidden="true">#</a> <strong>2.3.2 MyISAM存储引擎模式</strong></h6>
<p><strong>1.表结构</strong></p>
<p>在存储表结构方面， MyISAM 和 InnoDB 一样，也是在<code v-pre>数据目录</code>下对应的数据库子目录下创建了一个专门用于描述表结构的文件</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>表名.frm
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><strong>2.表中数据和索引</strong></p>
<p>在MyISAM中的索引全部都是<code v-pre>二级索引</code>，该存储引擎的<code v-pre>数据和索引是分开存放</code>的。所以在文件系统中也是使用不同的文件来存储数据文件和索引文件，同时表数据都存放在对应的数据库子目录下。</p>
<div class="language-mysql ext-mysql line-numbers-mode"><pre v-pre class="language-mysql"><code>test.frm 存储表结构 #MySQL8.0 改为了 b.xxx.sdi
test.MYD 存储数据 (MYData) 
test.MYI 存储索引 (MYIndex
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>举例:创建一个 MyISAM 表，使用 ENGINE 选项显式指定引擎。因为 InnoDB 是默认引擎。</p>
<div class="language-mysql ext-mysql line-numbers-mode"><pre v-pre class="language-mysql"><code>CREATE TABLE `student_myisam` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(64) DEFAULT NULL,
  `age` int DEFAULT NULL,
  `sex` varchar(2) DEFAULT NULL,
  PRIMARY KEY (`id`)
)ENGINE=MYISAM AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb3;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-4-小结" tabindex="-1"><a class="header-anchor" href="#_2-4-小结" aria-hidden="true">#</a> 2.4 小结</h3>
<p>举例: 数据库a ， 表b 。</p>
<p>1、如果表b采用 InnoDB ，data\a中会产生1个或者2个文件:</p>
<ul>
<li>b.frm :描述表结构文件，字段长度等</li>
<li>如果采用 系统表空间 模式的，数据信息和索引信息都存储在 ibdata1 中</li>
<li>如果采用 独立表空间 存储模式，data\a中还会产生 b.ibd 文件(存储数据信息和索引信息)
此外:</li>
</ul>
<blockquote>
<p>1 MySQL5.7 中会在data/a的目录下生成 db.opt 文件用于保存数据库的相关配置。比如:字符集、比较 规则。而MySQL8.0不再提db.opt文件。<br>
2 MySQL8.0中不再单独提供b.frm，而是合并在b.ibd文件中。</p>
</blockquote>
<p>2、如果表b采用 MyISAM ，data\a中会产生3个文件:</p>
<ul>
<li>MySQL5.7 中: b.frm :描述表结构文件，字段长度等。</li>
<li>MySQL8.0 中 b.xxx.sdi :描述表结构文件，字段长度等</li>
<li>b.MYD (MYData):数据信息文件，存储数据信息(如果采用独立表存储模式) b.MYI (MYIndex):存放索引信息文件</li>
</ul>
</div></template>
