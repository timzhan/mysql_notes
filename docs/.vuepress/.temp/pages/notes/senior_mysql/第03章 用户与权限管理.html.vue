<template><div><h3 id="第03章-用户与权限管理" tabindex="-1"><a class="header-anchor" href="#第03章-用户与权限管理" aria-hidden="true">#</a> 第03章 用户与权限管理</h3>
<h4 id="_1-用户管理" tabindex="-1"><a class="header-anchor" href="#_1-用户管理" aria-hidden="true">#</a> <strong>1.用户管理</strong></h4>
<h5 id="_1-1登录mysql服务器" tabindex="-1"><a class="header-anchor" href="#_1-1登录mysql服务器" aria-hidden="true">#</a> <strong>1.1登录MySQL服务器</strong></h5>
<p>启动MySQL服务后，可以通过mysql命令来登录MySQL服务器，命令如下：</p>
<div class="language-mysql ext-mysql line-numbers-mode"><pre v-pre class="language-mysql"><code>mysql –h hostname|hostIP –P port –u username –p DatabaseName –e &quot;SQL语句&quot;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul>
<li><code v-pre>-h参数</code>后面接主机名或者主机IP，hostname为主机，hostIP为主机IP。</li>
<li><code v-pre>-P参数</code>后面接MySQL服务的端口，通过该参数连接到指定的端口。MySQL服务的默认端口是3306，不使用该参数时自动连接到3306端口，port为连接的端口号。</li>
<li><code v-pre>-u参数</code>后面接用户名，username为用户名。</li>
<li><code v-pre>-p参数</code>会提示输入密码。</li>
<li><code v-pre>DatabaseName参数</code>指明登录到哪一个数据库中。如果没有该参数，就会直接登录到MySQL数据库中，然后可以使用USE命令来选择数据库。</li>
<li><code v-pre>-e参数</code>后面可以直接加SQL语句。登录MySQL服务器以后即可执行这个SQL语句，然后退出MySQL服务器。</li>
</ul>
<div class="language-mysql ext-mysql line-numbers-mode"><pre v-pre class="language-mysql"><code>mysql -uroot -p -hlocalhost -P3306 mysql -e &quot;select host,user from user&quot;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h5 id="_1-2创建用户" tabindex="-1"><a class="header-anchor" href="#_1-2创建用户" aria-hidden="true">#</a> <strong>1.2创建用户</strong></h5>
<div class="language-mysql ext-mysql line-numbers-mode"><pre v-pre class="language-mysql"><code>CREATE USER 用户名 [IDENTIFIED BY '密码'][,用户名 [IDENTIFIED BY '密码']];
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>举例：</p>
<div class="language-mysql ext-mysql line-numbers-mode"><pre v-pre class="language-mysql"><code>CREATE USER zhang3 IDENTIFIED BY '123123'; # 默认host是 %
CREATE USER 'kangshifu'@'localhost' IDENTIFIED BY '123456';
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="_1-3修改用户" tabindex="-1"><a class="header-anchor" href="#_1-3修改用户" aria-hidden="true">#</a> <strong>1.3修改用户</strong></h5>
<div class="language-mysql ext-mysql line-numbers-mode"><pre v-pre class="language-mysql"><code>UPDATE mysql.user SET USER='li4' WHERE USER='wang5'; 
FLUSH PRIVILEGES;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="_1-4删除用户" tabindex="-1"><a class="header-anchor" href="#_1-4删除用户" aria-hidden="true">#</a> <strong>1.4删除用户</strong></h5>
<p><strong>方式1：使用DROP方式删除（推荐）</strong></p>
<div class="language-mysql ext-mysql line-numbers-mode"><pre v-pre class="language-mysql"><code>DROP USER user[,user]…;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>举例：</p>
<div class="language-mysql ext-mysql line-numbers-mode"><pre v-pre class="language-mysql"><code>DROP USER li4 ; # 默认删除host为%的用户
DROP USER 'kangshifu'@'localhost';
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>方式2：使用DELETE方式删除（不推荐，有残留信息）</strong></p>
<div class="language-mysql ext-mysql line-numbers-mode"><pre v-pre class="language-mysql"><code>DELETE FROM mysql.user WHERE Host=’hostname’ AND User=’username’;
FLUSH PRIVILEGES;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="_1-5设置当前用户密码" tabindex="-1"><a class="header-anchor" href="#_1-5设置当前用户密码" aria-hidden="true">#</a> <strong>1.5设置当前用户密码</strong></h5>
<p><strong>1.使用ALTER USER命令来修改当前用户密码</strong></p>
<div class="language-mysql ext-mysql line-numbers-mode"><pre v-pre class="language-mysql"><code>ALTER USER USER() IDENTIFIED BY 'new_password';
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><strong>2.使用SET语句来修改当前用户密码</strong></p>
<div class="language-mysql ext-mysql line-numbers-mode"><pre v-pre class="language-mysql"><code>SET PASSWORD='new_password';
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h5 id="_1-6修改其它用户密码" tabindex="-1"><a class="header-anchor" href="#_1-6修改其它用户密码" aria-hidden="true">#</a> <strong>1.6修改其它用户密码</strong></h5>
<p><strong>1.使用ALTER语句来修改普通用户的密码</strong></p>
<div class="language-mysql ext-mysql line-numbers-mode"><pre v-pre class="language-mysql"><code>ALTER USER user [IDENTIFIED BY '新密码'] 
[,user[IDENTIFIED BY '新密码']]…;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>2.使用SET命令来修改普通用户的密码</strong></p>
<div class="language-mysql ext-mysql line-numbers-mode"><pre v-pre class="language-mysql"><code>SET PASSWORD FOR 'username'@'hostname'='new_password';
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="_2-权限管理" tabindex="-1"><a class="header-anchor" href="#_2-权限管理" aria-hidden="true">#</a> <strong>2.权限管理</strong></h4>
<h5 id="_2-1权限列表" tabindex="-1"><a class="header-anchor" href="#_2-1权限列表" aria-hidden="true">#</a> <strong>2.1权限列表</strong></h5>
<div class="language-mysql ext-mysql line-numbers-mode"><pre v-pre class="language-mysql"><code>show privileges;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul>
<li><code v-pre>CREATE和DROP权限</code>，可以创建新的数据库和表，或删除（移掉）已有的数据库和表。如果将MySQL数据库中的DROP权限授予某用户，用户就可以删除MySQL访问权限保存的数据库。</li>
<li><code v-pre>SELECT、INSERT、UPDATE和DELETE权限</code>允许在一个数据库现有的表上实施操作。</li>
<li><code v-pre>SELECT权限</code>只有在它们真正从一个表中检索行时才被用到。</li>
<li><code v-pre>INDEX权限</code>允许创建或删除索引，INDEX适用于已有的表。如果具有某个表的CREATE权限，就可以在CREATE TABLE语句中包括索引定义。</li>
<li><code v-pre>ALTER权限</code>可以使用ALTER TABLE来更改表的结构和重新命名表。</li>
<li><code v-pre>CREATE ROUTINE权限</code>用来创建保存的程序（函数和程序），<code v-pre>ALTER ROUTINE权限</code>用来更改和删除保存的程序，<code v-pre>EXECUTE权限</code>用来执行保存的程序。</li>
<li><code v-pre>GRANT权限</code>允许授权给其他用户，可用于数据库、表和保存的程序。</li>
<li><code v-pre>FILE权限</code>使用户可以使用LOAD DATA INFILE和SELECT ... INTO OUTFILE语句读或写服务器上的文件，任何被授予FILE权限的用户都能读或写MySQL服务器上的任何文件（说明用户可以读任何数据库目录下的文件，因为服务器可以访问这些文件）。</li>
</ul>
<h5 id="_2-2授予权限的原则" tabindex="-1"><a class="header-anchor" href="#_2-2授予权限的原则" aria-hidden="true">#</a> <strong>2.2授予权限的原则</strong></h5>
<p>权限控制主要是出于安全因素，因此需要遵循以下几个<code v-pre>经验原则</code>：</p>
<p>1、只授予能<code v-pre>满足需要的最小权限</code>，防止用户干坏事。比如用户只是需要查询，那就只给select权限就可以了，不要给用户赋予update、insert或者delete权限。</p>
<p>2、创建用户的时候<code v-pre>限制用户的登录主机</code>，一般是限制成指定IP或者内网IP段。</p>
<p>3、为每个用户<code v-pre>设置满足密码复杂度的密码</code>。</p>
<p>4、<code v-pre>定期清理不需要的用户</code>，回收权限或者删除用户。</p>
<h5 id="_2-3授予权限" tabindex="-1"><a class="header-anchor" href="#_2-3授予权限" aria-hidden="true">#</a> <strong>2.3授予权限</strong></h5>
<p>给用户授权的方式有 2 种，分别是通过把 角色赋予用户给用户授权 和 直接给用户授权 。用户是数据库的 使用者，我们可以通过给用户授予访问数据库中资源的权限，来控制使用者对数据库的访问，消除安全 隐患。
授权命令:</p>
<div class="language-mysql ext-mysql line-numbers-mode"><pre v-pre class="language-mysql"><code>GRANT 权限1,权限2,…权限n ON 数据库名称.表名称 TO 用户名@用户地址 [IDENTIFIED BY ‘密码口令’];
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul>
<li>该权限如果发现没有该用户，则会直接新建一个用户。</li>
<li>给li4用户用本地命令行方式，授予atguigudb这个库下的所有表的插删改查的权限。</li>
</ul>
<div class="language-mysql ext-mysql line-numbers-mode"><pre v-pre class="language-mysql"><code>GRANT SELECT,INSERT,DELETE,UPDATE ON atguigudb.* TO li4@localhost;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul>
<li>授予通过网络方式登录的joe用户 ，对所有库所有表的全部权限，密码设为123。注意这里唯独不包括grant的权限</li>
</ul>
<div class="language-mysql ext-mysql line-numbers-mode"><pre v-pre class="language-mysql"><code>GRANT ALL PRIVILEGES ON *.* TO joe@'%' IDENTIFIED BY '123';
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><blockquote>
<p>我们在开发应用的时候，经常会遇到一种需求，就是要根据用户的不同，对数据进行横向和纵向的分组。</p>
<ul>
<li>所谓横向的分组，就是指用户可以接触到的数据的范围，比如可以看到哪些表的数据;</li>
<li>所谓纵向的分组，就是指用户对接触到的数据能访问到什么程度，比如能看、能改，甚至是删除。</li>
</ul>
</blockquote>
<h5 id="_2-4查看权限" tabindex="-1"><a class="header-anchor" href="#_2-4查看权限" aria-hidden="true">#</a> <strong>2.4查看权限</strong></h5>
<ul>
<li>查看当前用户权限</li>
</ul>
<div class="language-mysql ext-mysql line-numbers-mode"><pre v-pre class="language-mysql"><code>SHOW GRANTS; 
# 或 
SHOW GRANTS FOR CURRENT_USER; 
# 或 
SHOW GRANTS FOR CURRENT_USER();
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>查看某用户的全局权限</li>
</ul>
<div class="language-mysql ext-mysql line-numbers-mode"><pre v-pre class="language-mysql"><code>SHOW GRANTS FOR 'user'@'主机地址';
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h5 id="_2-5收回权限" tabindex="-1"><a class="header-anchor" href="#_2-5收回权限" aria-hidden="true">#</a> <strong>2.5收回权限</strong></h5>
<p>收回权限就是取消已经赋予用户的某些权限。 收回用户不必要的权限可以在一定程度上保证系统的安全 性。MySQL中使用 REVOKE语句 取消用户的某些权限。使用REVOKE收回权限之后，用户账户的记录将从 db、host、tables_priv和columns_priv表中删除，但是用户账户记录仍然在user表中保存(删除user表中 的账户记录使用DROP USER语句)。
<strong>注意：在将用户账户从user表删除之前，应该收回相应用户的所有权限。</strong></p>
<ul>
<li>收回权限命令</li>
</ul>
<div class="language-mysql ext-mysql line-numbers-mode"><pre v-pre class="language-mysql"><code>REVOKE 权限1,权限2,…权限n ON 数据库名称.表名称 FROM 用户名@用户地址;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul>
<li>举例</li>
</ul>
<div class="language-mysql ext-mysql line-numbers-mode"><pre v-pre class="language-mysql"><code>#收回全库全表的所有权限 
REVOKE ALL PRIVILEGES ON *.* FROM joe@'%'; 
#收回mysql库下的所有表的插删改查权限 
REVOKE SELECT,INSERT,UPDATE,DELETE ON mysql.* FROM joe@localhost;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>注意：<code v-pre>须用户重新登录后才能生效</code></li>
</ul>
<h4 id="_3-角色管理" tabindex="-1"><a class="header-anchor" href="#_3-角色管理" aria-hidden="true">#</a> <strong>3.角色管理</strong></h4>
<h5 id="_3-1创建角色" tabindex="-1"><a class="header-anchor" href="#_3-1创建角色" aria-hidden="true">#</a> <strong>3.1创建角色</strong></h5>
<div class="language-mysql ext-mysql line-numbers-mode"><pre v-pre class="language-mysql"><code>CREATE ROLE 'role_name'[@'host_name'] [,'role_name'[@'host_name']]...
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>角色名称的命名规则和用户名类似。如果<code v-pre>host_name省略，默认为%</code>，<code v-pre>role_name不可省略</code>，不可为空。</p>
<h5 id="_3-2给角色赋予权限" tabindex="-1"><a class="header-anchor" href="#_3-2给角色赋予权限" aria-hidden="true">#</a> <strong>3.2给角色赋予权限</strong></h5>
<div class="language-mysql ext-mysql line-numbers-mode"><pre v-pre class="language-mysql"><code>GRANT privileges ON table_name TO 'role_name'[@'host_name'];
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>上述语句中privileges代表权限的名称，多个权限以逗号隔开。可使用SHOW语句查询权限名称</p>
<div class="language-mysql ext-mysql line-numbers-mode"><pre v-pre class="language-mysql"><code>SHOW PRIVILEGES\G
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h5 id="_3-3查看角色的权限" tabindex="-1"><a class="header-anchor" href="#_3-3查看角色的权限" aria-hidden="true">#</a> <strong>3.3查看角色的权限</strong></h5>
<div class="language-mysql ext-mysql line-numbers-mode"><pre v-pre class="language-mysql"><code>SHOW GRANTS FOR 'role_name';
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>只要你创建了一个角色，系统就会自动给你一个“<code v-pre>USAGE</code>”权限，意思是<code v-pre>连接登录数据库的权限</code>。</p>
<h5 id="_3-4回收角色的权限" tabindex="-1"><a class="header-anchor" href="#_3-4回收角色的权限" aria-hidden="true">#</a> <strong>3.4回收角色的权限</strong></h5>
<div class="language-mysql ext-mysql line-numbers-mode"><pre v-pre class="language-mysql"><code>REVOKE privileges ON tablename FROM 'rolename';
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h5 id="_3-5删除角色" tabindex="-1"><a class="header-anchor" href="#_3-5删除角色" aria-hidden="true">#</a> <strong>3.5删除角色</strong></h5>
<div class="language-mysql ext-mysql line-numbers-mode"><pre v-pre class="language-mysql"><code>DROP ROLE role [,role2]...
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>注意，<code v-pre>如果你删除了角色，那么用户也就失去了通过这个角色所获得的所有权限</code>。</p>
<h5 id="_3-6给用户赋予角色" tabindex="-1"><a class="header-anchor" href="#_3-6给用户赋予角色" aria-hidden="true">#</a> <strong>3.6给用户赋予角色</strong></h5>
<p>角色创建并授权后，要赋给用户并处于<code v-pre>激活状态</code>才能发挥作用。</p>
<div class="language-mysql ext-mysql line-numbers-mode"><pre v-pre class="language-mysql"><code>GRANT role [,role2,...] TO user [,user2,...];
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>查询当前已激活的角色</p>
<div class="language-mysql ext-mysql line-numbers-mode"><pre v-pre class="language-mysql"><code>SELECT CURRENT_ROLE();
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h5 id="_3-7激活角色" tabindex="-1"><a class="header-anchor" href="#_3-7激活角色" aria-hidden="true">#</a> <strong>3.7激活角色</strong></h5>
<p><strong>方式1：使用set default role 命令激活角色</strong></p>
<div class="language-mysql ext-mysql line-numbers-mode"><pre v-pre class="language-mysql"><code>SET DEFAULT ROLE ALL TO 'kangshifu'@'localhost';
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><strong>方式2：将activate_all_roles_on_login设置为ON</strong></p>
<div class="language-mysql ext-mysql line-numbers-mode"><pre v-pre class="language-mysql"><code>SET GLOBAL activate_all_roles_on_login=ON;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>这条 SQL 语句的意思是，对<code v-pre>所有角色永久激活</code>。</p>
<h5 id="_3-8撤销用户的角色" tabindex="-1"><a class="header-anchor" href="#_3-8撤销用户的角色" aria-hidden="true">#</a> <strong>3.8撤销用户的角色</strong></h5>
<div class="language-mysql ext-mysql line-numbers-mode"><pre v-pre class="language-mysql"><code>REVOKE role FROM user;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h5 id="_3-9设置强制角色-mandatory-role" tabindex="-1"><a class="header-anchor" href="#_3-9设置强制角色-mandatory-role" aria-hidden="true">#</a> <strong>3.9设置强制角色(mandatory role)</strong></h5>
<p>方式1：服务启动前设置</p>
<div class="language-ini ext-ini line-numbers-mode"><pre v-pre class="language-ini"><code><span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">mysqld</span><span class="token punctuation">]</span></span> 
<span class="token key attr-name">mandatory_roles</span><span class="token punctuation">=</span><span class="token value attr-value">'<span class="token inner-value">role1,role2@localhost,r3@%.atguigu.com</span>'</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>方式2：运行时设置</p>
<div class="language-mysql ext-mysql line-numbers-mode"><pre v-pre class="language-mysql"><code>SET PERSIST mandatory_roles = 'role1,role2@localhost,r3@%.example.com'; #系统重启后仍然有效
SET GLOBAL mandatory_roles = 'role1,role2@localhost,r3@%.example.com'; #系统重启后失效
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="" tabindex="-1"><a class="header-anchor" href="#" aria-hidden="true">#</a> </h3>
</div></template>
