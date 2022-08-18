<template><div><h3 id="第01章-linux下mysql的安装与使用" tabindex="-1"><a class="header-anchor" href="#第01章-linux下mysql的安装与使用" aria-hidden="true">#</a> 第01章 Linux下MySQL的安装与使用</h3>
<h4 id="_1-安装前说明" tabindex="-1"><a class="header-anchor" href="#_1-安装前说明" aria-hidden="true">#</a> <strong>1.安装前说明</strong></h4>
<ul>
<li>安装有 Xshell 和 Xftp 等访问CentOS系统的工具</li>
<li>CentOS6和CentOS7在MySQL的使用中的区别</li>
</ul>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token number">1</span>. 防火墙：6是iptables，7是firewalld 
<span class="token number">2</span>. 启动服务的命令：6是service，7是systemctl
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="_1-1查看是否安装过mysql" tabindex="-1"><a class="header-anchor" href="#_1-1查看是否安装过mysql" aria-hidden="true">#</a> <strong>1.1查看是否安装过MySQL</strong></h5>
<ul>
<li>如果你是用rpm安装, 检查一下RPM PACKAGE：</li>
</ul>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">rpm</span> -qa <span class="token operator">|</span> <span class="token function">grep</span> -i mysql <span class="token comment"># -i 忽略大小写</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul>
<li>检查mysql service：</li>
</ul>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code>systemctl status mysqld.service
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h5 id="_1-2-mysql的卸载" tabindex="-1"><a class="header-anchor" href="#_1-2-mysql的卸载" aria-hidden="true">#</a> <strong>1.2 MySQL的卸载</strong></h5>
<p><strong>1.关闭mysql服务</strong></p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code>systemctl stop mysqld.service
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><strong>2.查看当前mysql安装状况</strong></p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">rpm</span> -qa <span class="token operator">|</span> <span class="token function">grep</span> -i mysql
<span class="token comment"># 或</span>
yum list installed <span class="token operator">|</span> <span class="token function">grep</span> mysql
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>3.卸载上述命令查询出的已安装程序</strong></p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code>yum remove mysql-xxx mysql-xxx mysql-xxx mysqk-xxxx
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>务必卸载干净，反复执行<code v-pre>rpm -qa | grep -i mysql</code>确认是否有卸载残留</p>
<p><strong>4.删除mysql相关文件</strong></p>
<ul>
<li>查找相关文件</li>
</ul>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">find</span> / -name mysql
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul>
<li>删除上述命令查找出的相关文件</li>
</ul>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">rm</span> -rf xxx
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><strong>5.删除 my.cnf</strong></p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">rm</span> -rf /etc/my.cnf
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="_2-mysql的linux版安装" tabindex="-1"><a class="header-anchor" href="#_2-mysql的linux版安装" aria-hidden="true">#</a> <strong>2. MySQL的Linux版安装</strong></h4>
<h5 id="_2-1-mysql的4大版本" tabindex="-1"><a class="header-anchor" href="#_2-1-mysql的4大版本" aria-hidden="true">#</a> <strong>2.1 MySQL的4大版本</strong></h5>
<blockquote>
<ul>
<li>MySQL Community Server 社区版本，开源免费，自由下载，但不提供官方技术支持，适用于大多数普通用户。</li>
<li>MySQL Enterprise Edition 企业版本，需付费，不能在线下载，可以试用30天。提供了更多的功能和更完备的技术支持，更适合于对数据库的功能和可靠性要求较高的企业客户。</li>
<li>MySQL Cluster 集群版，开源免费。用于架设集群服务器，可将几个MySQL Server封装成一个Server。需要在社区版或企业版的基础上使用。</li>
<li>MySQL Cluster CGE 高级集群版，需付费。</li>
</ul>
</blockquote>
<p><strong>2.2 下载MySQL指定版本</strong></p>
<ol>
<li>下载地址
官网：<a href="https://www.mysql.com" target="_blank" rel="noopener noreferrer">https://www.mysql.com<ExternalLinkIcon/></a></li>
<li>打开官网，点击DOWNLOADS</li>
<li>点击 MySQL Community Server</li>
<li>在General Availability(GA) Releases中选择适合的版本</li>
<li>Linux系统下安装MySQL的几种方式
方式1：rpm命令
使用rpm命令安装扩展名为&quot;.rpm&quot;的软件包。</li>
</ol>
<p>方式2：yum命令
需联网，从 互联网获取 的yum源，直接使用yum命令安装。</p>
<p>方式3：编译安装源码包
针对 tar.gz 这样的压缩格式，要用tar命令来解压；如果是其它压缩格式，就使用其它命令。</p>
<p><strong>2.3 CentOS7下检查MySQL依赖</strong>
<strong>1.检查/tmp临时目录权限（必不可少)</strong></p>
<p>由于mysql安装过程中，会通过mysql用户在/tmp目录下新建tmp_db文件，所以请给/tmp较大的权限。执行 ：</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">chmod</span> -R <span class="token number">777</span> /tmp
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><strong>2.安装前，检查依赖</strong></p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">rpm</span> -qa<span class="token operator">|</span><span class="token function">grep</span> libaio
<span class="token function">rpm</span> -qa<span class="token operator">|</span><span class="token function">grep</span> net-tools
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="_2-2-centos7下mysql安装过程" tabindex="-1"><a class="header-anchor" href="#_2-2-centos7下mysql安装过程" aria-hidden="true">#</a> <strong>2.2 CentOS7下MySQL安装过程</strong></h5>
<p><strong>1.将安装程序拷贝到/opt目录下</strong></p>
<p>在mysql的安装文件目录下执行：（必须按照顺序执行）</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">rpm</span> -ivh mysql-community-common-8.0.25-1.el7.x86_64.rpm 
<span class="token function">rpm</span> -ivh mysql-community-client-plugins-8.0.25-1.el7.x86_64.rpm 
<span class="token function">rpm</span> -ivh mysql-community-libs-8.0.25-1.el7.x86_64.rpm 
<span class="token function">rpm</span> -ivh mysql-community-client-8.0.25-1.el7.x86_64.rpm 
<span class="token function">rpm</span> -ivh mysql-community-server-8.0.25-1.el7.x86_64.rpm
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><code v-pre>rpm</code>是Redhat Package Manage缩写，通过RPM的管理，用户可以把源代码包装成以rpm为扩展名的文件形式，易于安装。</li>
<li><code v-pre>-i</code>, --install 安装软件包</li>
<li><code v-pre>-v</code>, --verbose 提供更多的详细信息输出</li>
<li><code v-pre>-h</code>, --hash 软件包安装的时候列出哈希标记 (和 -v 一起使用效果更好)，展示进度条</li>
</ul>
<blockquote>
<p>若存在mariadb-libs问题，则执行<strong>yum remove mysql-libs</strong>即可</p>
</blockquote>
<h5 id="_2-3查看mysql版本" tabindex="-1"><a class="header-anchor" href="#_2-3查看mysql版本" aria-hidden="true">#</a> <strong>2.3查看MySQL版本</strong></h5>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code>mysql --version 
<span class="token comment">#或</span>
mysqladmin --version
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="_2-4服务的初始化" tabindex="-1"><a class="header-anchor" href="#_2-4服务的初始化" aria-hidden="true">#</a> <strong>2.4服务的初始化</strong></h5>
<p>为了保证数据库目录与文件的所有者为 mysql 登录用户，如果你是以 root 身份运行 mysql 服务，需要执行下面的命令初始化：</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code>mysqld --initialize --user<span class="token operator">=</span>mysql
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>说明： --initialize 选项默认以“安全”模式来初始化，则会为 root 用户生成一个密码并将<code v-pre>该密码标记为过期</code>，登录后你需要设置一个新的密码。生成的<code v-pre>临时密码</code>会往日志中记录一份。</p>
<p>查看密码：</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">cat</span> /var/log/mysqld.log
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>root@localhost: 后面就是初始化的密码</p>
<h5 id="_2-5启动mysql-查看状态" tabindex="-1"><a class="header-anchor" href="#_2-5启动mysql-查看状态" aria-hidden="true">#</a> <strong>2.5启动MySQL，查看状态</strong></h5>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token comment">#加不加.service后缀都可以 </span>
启动：systemctl start mysqld.service 
关闭：systemctl stop mysqld.service 
重启：systemctl restart mysqld.service 
查看状态：systemctl status mysqld.service
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="_2-6查看mysql服务是否自启动" tabindex="-1"><a class="header-anchor" href="#_2-6查看mysql服务是否自启动" aria-hidden="true">#</a> <strong>2.6查看MySQL服务是否自启动</strong></h5>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code>systemctl list-unit-files<span class="token operator">|</span><span class="token function">grep</span> mysqld.service
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul>
<li>如不是enabled可以运行如下命令设置自启动</li>
</ul>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code>systemctl <span class="token builtin class-name">enable</span> mysqld.service
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul>
<li>如果希望不进行自启动，运行如下命令设置</li>
</ul>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code>systemctl disable mysqld.service
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="_3-mysql登录" tabindex="-1"><a class="header-anchor" href="#_3-mysql登录" aria-hidden="true">#</a> <strong>3. MySQL登录</strong></h4>
<h5 id="_3-1首次登录" tabindex="-1"><a class="header-anchor" href="#_3-1首次登录" aria-hidden="true">#</a> <strong>3.1首次登录</strong></h5>
<p>通过<code v-pre>mysql -hlocalhost -P3306 -uroot -p</code>进行登录，在Enter password：录入初始化密码</p>
<h5 id="_3-2修改密码" tabindex="-1"><a class="header-anchor" href="#_3-2修改密码" aria-hidden="true">#</a> <strong>3.2修改密码</strong></h5>
<div class="language-mysql ext-mysql line-numbers-mode"><pre v-pre class="language-mysql"><code>ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h5 id="_3-3设置远程登录" tabindex="-1"><a class="header-anchor" href="#_3-3设置远程登录" aria-hidden="true">#</a> <strong>3.3设置远程登录</strong></h5>
<p><strong>1.确认网络</strong></p>
<p>1.在远程机器上使用ping ip地址<code v-pre>保证网络畅通</code></p>
<p>2.在远程机器上使用telnet命令<code v-pre>保证端口号开放</code>访问</p>
<p><strong>2.关闭防火墙或开放端口</strong></p>
<p><strong>方式一：关闭防火墙</strong></p>
<ul>
<li>CentOS6 ：</li>
</ul>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">service</span> iptables stop
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul>
<li>CentOS7：</li>
</ul>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token comment">#开启防火墙</span>
systemctl start firewalld.service
<span class="token comment">#查看防火墙状态</span>
systemctl status firewalld.service
<span class="token comment">#关闭防火墙</span>
systemctl stop firewalld.service
<span class="token comment">#设置开机启用防火墙 </span>
systemctl <span class="token builtin class-name">enable</span> firewalld.service 
<span class="token comment">#设置开机禁用防火墙 </span>
systemctl disable firewalld.service
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>方式二：开放端口</strong></p>
<ul>
<li>查看开放的端口号</li>
</ul>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code>firewall-cmd --list-all
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul>
<li>设置开放的端口号</li>
</ul>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code>firewall-cmd --add-service<span class="token operator">=</span>http --permanent
firewall-cmd --add-port<span class="token operator">=</span><span class="token number">3306</span>/tcp --permanent
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>重启防火墙</li>
</ul>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code>firewall-cmd --reload
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="_4-linux下修改配置" tabindex="-1"><a class="header-anchor" href="#_4-linux下修改配置" aria-hidden="true">#</a> <strong>4. Linux下修改配置</strong></h4>
<ul>
<li>修改允许远程登陆</li>
</ul>
<div class="language-mysql ext-mysql line-numbers-mode"><pre v-pre class="language-mysql"><code>use mysql;
select Host,User from user;
update user set host = '%' where user ='root';
flush privileges;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote>
<p><code v-pre>%</code>是个 通配符 ，如果Host=192.168.1.%，那么就表示只要是IP地址前缀为“192.168.1.”的客户端都可以连接。如果<code v-pre>Host=%</code>，表示所有IP都有连接权限。</p>
<p>注意：在生产环境下不能为了省事将host设置为%，这样做会存在安全问题，具体的设置可以根据生产环境的IP进行设置。</p>
</blockquote>
<p>配置新连接报错：错误号码 2058，分析是 mysql 密码加密方法变了。</p>
<p>**解决方法一：**升级远程连接工具版本</p>
<p><strong>解决方法二：</strong></p>
<div class="language-mysql ext-mysql line-numbers-mode"><pre v-pre class="language-mysql"><code>ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'abc123';
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="_5-字符集的相关操作" tabindex="-1"><a class="header-anchor" href="#_5-字符集的相关操作" aria-hidden="true">#</a> <strong>5.字符集的相关操作</strong></h4>
<h5 id="_5-1各级别的字符集" tabindex="-1"><a class="header-anchor" href="#_5-1各级别的字符集" aria-hidden="true">#</a> <strong>5.1各级别的字符集</strong></h5>
<div class="language-mysql ext-mysql line-numbers-mode"><pre v-pre class="language-mysql"><code>show variables like 'character%';
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul>
<li>character_set_server：服务器级别的字符集</li>
<li>character_set_database：当前数据库的字符集</li>
<li>character_set_client：服务器解码请求时使用的字符集</li>
<li>character_set_connection：服务器处理请求时会把请求字符串从character_set_client转为character_set_connection</li>
<li>character_set_results：服务器向客户端返回数据时使用的字符集</li>
</ul>
<p>操作2：修改字符集</p>
<div class="language-mysql ext-mysql line-numbers-mode"><pre v-pre class="language-mysql"><code>vim /etc/my.cnf
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>在MySQL5.7或之前的版本中，在/etc/my.cnf文件最后加上中文字符集配置：</p>
<div class="language-mysql ext-mysql line-numbers-mode"><pre v-pre class="language-mysql"><code>character_set_server=utf8
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><img src="@source/notes/senior_mysql/images/6e7f2fd6-e801-4c01-9c4f-b54d8bebe8e6.png" alt=""></p>
<p>操作3：重新启动MySQL服务</p>
<div class="language-mysql ext-mysql line-numbers-mode"><pre v-pre class="language-mysql"><code>systemctl restart mysqld
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><strong>小结</strong></p>
<ul>
<li>如果<code v-pre>创建或修改列</code>时没有显式的指定字符集和比较规则，则该列<code v-pre>默认用表的</code>字符集和比较规则</li>
<li>如果<code v-pre>创建表时</code>没有显式的指定字符集和比较规则，则该表<code v-pre>默认用数据库的</code>字符集和比较规则</li>
<li>如果<code v-pre>创建数据库时</code>没有显式的指定字符集和比较规则，则该数据库<code v-pre>默认用服务器的</code>字符集和比较规则</li>
</ul>
<h5 id="_5-2请求到响应过程中字符集的变化" tabindex="-1"><a class="header-anchor" href="#_5-2请求到响应过程中字符集的变化" aria-hidden="true">#</a> <strong>5.2请求到响应过程中字符集的变化</strong></h5>
<div class="language-mermaid ext-mermaid line-numbers-mode"><pre v-pre class="language-mermaid"><code><span class="token keyword">graph</span> TB
A<span class="token text string">(客户端)</span> <span class="token arrow operator">--></span> <span class="token label property">|"使用操作系统的字符集编码请求字符串"|</span> B<span class="token text string">(从character_set_client转换为character_set_connection)</span>
B <span class="token arrow operator">--></span> C<span class="token text string">(从character_set_connection转换为具体的列使用的字符集)</span>
C <span class="token arrow operator">--></span> D<span class="token text string">(将查询结果从具体的列上使用的字符集转换为character_set_results)</span>
D <span class="token arrow operator">--></span> <span class="token label property">|"使用操作系统的字符集解码响应的字符串"|</span> A

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>
