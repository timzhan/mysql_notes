<template><div><h1 id="第09章-性能分析工具的使用" tabindex="-1"><a class="header-anchor" href="#第09章-性能分析工具的使用" aria-hidden="true">#</a> 第09章_性能分析工具的使用</h1>
<p>在数据库调优中，我们的目标是 <code v-pre>响应时间更快, 吞吐量更大</code> 。利用宏观的监控工具和微观的日志分析可以帮我们快速找到调优的思路和方式。</p>
<h2 id="_1-数据库服务器的优化步骤" tabindex="-1"><a class="header-anchor" href="#_1-数据库服务器的优化步骤" aria-hidden="true">#</a> 1. 数据库服务器的优化步骤</h2>
<p>当我们遇到数据库调优问题的时候，该如何思考呢？这里把思考的流程整理成下面这张图。</p>
<p>整个流程划分成了 <code v-pre>观察（Show status）</code> 和 <code v-pre>行动（Action）</code> 两个部分。字母 S 的部分代表观察（会使 用相应的分析工具），字母 A 代表的部分是行动（对应分析可以采取的行动）。</p>
<p><img src="@source/notes/senior_mysql/images/image-20220627162248635.png" alt="image-20220627162248635" loading="lazy"></p>
<p><img src="@source/notes/senior_mysql/images/image-20220627162345815.png" alt="image-20220627162345815" loading="lazy"></p>
<p>我们可以通过观察了解数据库整体的运行状态，通过性能分析工具可以让我们了解执行慢的SQL都有哪些，查看具体的SQL执行计划，甚至是SQL执行中的每一步的成本代价，这样才能定位问题所在，找到了问题，再采取相应的行动。</p>
<p><strong>详细解释一下这张图：</strong></p>
<img src="@source/notes/senior_mysql/images/image-20220627164046438.png" alt="image-20220627164046438" style="float:left;" />
<img src="@source/notes/senior_mysql/images/image-20220627164114562.png" alt="image-20220627164114562" style="float:left;" />
<h2 id="_2-查看系统性能参数" tabindex="-1"><a class="header-anchor" href="#_2-查看系统性能参数" aria-hidden="true">#</a> 2. 查看系统性能参数</h2>
<p>在MySQL中，可以使用 <code v-pre>SHOW STATUS</code> 语句查询一些MySQL数据库服务器的<code v-pre>性能参数、执行频率</code>。</p>
<p>SHOW STATUS语句语法如下：</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token keyword">SHOW</span> <span class="token punctuation">[</span><span class="token keyword">GLOBAL</span><span class="token operator">|</span><span class="token keyword">SESSION</span><span class="token punctuation">]</span> <span class="token keyword">STATUS</span> <span class="token operator">LIKE</span> <span class="token string">'参数'</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>一些常用的性能参数如下：</p>
<ul>
<li>Connections：连接MySQL服务器的次数。</li>
<li>Uptime：MySQL服务器的上线时间。</li>
<li>Slow_queries：慢查询的次数。</li>
<li>Innodb_rows_read：Select查询返回的行数</li>
<li>Innodb_rows_inserted：执行INSERT操作插入的行数</li>
<li>Innodb_rows_updated：执行UPDATE操作更新的 行数</li>
<li>Innodb_rows_deleted：执行DELETE操作删除的行数</li>
<li>Com_select：查询操作的次数。</li>
<li>Com_insert：插入操作的次数。对于批量插入的 INSERT 操作，只累加一次。</li>
<li>Com_update：更新操作 的次数。</li>
<li>Com_delete：删除操作的次数。</li>
</ul>
<p>若查询MySQL服务器的连接次数，则可以执行如下语句:</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token keyword">SHOW</span> <span class="token keyword">STATUS</span> <span class="token operator">LIKE</span> <span class="token string">'Connections'</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>若查询服务器工作时间，则可以执行如下语句:</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token keyword">SHOW</span> <span class="token keyword">STATUS</span> <span class="token operator">LIKE</span> <span class="token string">'Uptime'</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>若查询MySQL服务器的慢查询次数，则可以执行如下语句:</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token keyword">SHOW</span> <span class="token keyword">STATUS</span> <span class="token operator">LIKE</span> <span class="token string">'Slow_queries'</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>慢查询次数参数可以结合慢查询日志找出慢查询语句，然后针对慢查询语句进行<code v-pre>表结构优化</code>或者<code v-pre>查询语句优化</code>。</p>
<p>再比如，如下的指令可以查看相关的指令情况：</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token keyword">SHOW</span> <span class="token keyword">STATUS</span> <span class="token operator">LIKE</span> <span class="token string">'Innodb_rows_%'</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="_3-统计sql的查询成本-last-query-cost" tabindex="-1"><a class="header-anchor" href="#_3-统计sql的查询成本-last-query-cost" aria-hidden="true">#</a> 3. 统计SQL的查询成本: last_query_cost</h2>
<p>一条SQL查询语句在执行前需要查询执行计划，如果存在多种执行计划的话，MySQL会计算每个执行计划所需要的成本，从中选择<code v-pre>成本最小</code>的一个作为最终执行的执行计划。</p>
<p>如果我们想要查看某条SQL语句的查询成本，可以在执行完这条SQL语句之后，通过查看当前会话中的<code v-pre>last_query_cost</code>变量值来得到当前查询的成本。它通常也是我们<code v-pre>评价一个查询的执行效率</code>的一个常用指标。这个查询成本对应的是<code v-pre>SQL 语句所需要读取的读页的数量</code>。</p>
<p>我们依然使用第8章的 student_info 表为例：</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token keyword">CREATE</span> <span class="token keyword">TABLE</span> <span class="token identifier"><span class="token punctuation">`</span>student_info<span class="token punctuation">`</span></span> <span class="token punctuation">(</span>
    <span class="token identifier"><span class="token punctuation">`</span>id<span class="token punctuation">`</span></span> <span class="token keyword">INT</span><span class="token punctuation">(</span><span class="token number">11</span><span class="token punctuation">)</span> <span class="token operator">NOT</span> <span class="token boolean">NULL</span> <span class="token keyword">AUTO_INCREMENT</span><span class="token punctuation">,</span>
    <span class="token identifier"><span class="token punctuation">`</span>student_id<span class="token punctuation">`</span></span> <span class="token keyword">INT</span> <span class="token operator">NOT</span> <span class="token boolean">NULL</span> <span class="token punctuation">,</span>
    <span class="token identifier"><span class="token punctuation">`</span>name<span class="token punctuation">`</span></span> <span class="token keyword">VARCHAR</span><span class="token punctuation">(</span><span class="token number">20</span><span class="token punctuation">)</span> <span class="token keyword">DEFAULT</span> <span class="token boolean">NULL</span><span class="token punctuation">,</span>
    <span class="token identifier"><span class="token punctuation">`</span>course_id<span class="token punctuation">`</span></span> <span class="token keyword">INT</span> <span class="token operator">NOT</span> <span class="token boolean">NULL</span> <span class="token punctuation">,</span>
    <span class="token identifier"><span class="token punctuation">`</span>class_id<span class="token punctuation">`</span></span> <span class="token keyword">INT</span><span class="token punctuation">(</span><span class="token number">11</span><span class="token punctuation">)</span> <span class="token keyword">DEFAULT</span> <span class="token boolean">NULL</span><span class="token punctuation">,</span>
    <span class="token identifier"><span class="token punctuation">`</span>create_time<span class="token punctuation">`</span></span> <span class="token keyword">DATETIME</span> <span class="token keyword">DEFAULT</span> <span class="token keyword">CURRENT_TIMESTAMP</span> <span class="token keyword">ON</span> <span class="token keyword">UPDATE</span> <span class="token keyword">CURRENT_TIMESTAMP</span><span class="token punctuation">,</span>
    <span class="token keyword">PRIMARY</span> <span class="token keyword">KEY</span> <span class="token punctuation">(</span><span class="token identifier"><span class="token punctuation">`</span>id<span class="token punctuation">`</span></span><span class="token punctuation">)</span>
<span class="token punctuation">)</span> <span class="token keyword">ENGINE</span><span class="token operator">=</span><span class="token keyword">INNODB</span> <span class="token keyword">AUTO_INCREMENT</span><span class="token operator">=</span><span class="token number">1</span> <span class="token keyword">DEFAULT</span> <span class="token keyword">CHARSET</span><span class="token operator">=</span>utf8<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果我们想要查询 id=900001 的记录，然后看下查询成本，我们可以直接在聚簇索引上进行查找：</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token keyword">SELECT</span> student_id<span class="token punctuation">,</span> class_id<span class="token punctuation">,</span> NAME<span class="token punctuation">,</span> create_time <span class="token keyword">FROM</span> student_info <span class="token keyword">WHERE</span> id <span class="token operator">=</span> <span class="token number">900001</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>运行结果（1 条记录，运行时间为 0.042s ）</p>
<p>然后再看下查询优化器的成本，实际上我们只需要检索一个页即可：</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql<span class="token operator">></span> <span class="token keyword">SHOW</span> <span class="token keyword">STATUS</span> <span class="token operator">LIKE</span> <span class="token string">'last_query_cost'</span><span class="token punctuation">;</span>
<span class="token operator">+</span><span class="token comment">-----------------+----------+</span>
<span class="token operator">|</span> Variable_name   <span class="token operator">|</span>   <span class="token keyword">Value</span>  <span class="token operator">|</span>
<span class="token operator">+</span><span class="token comment">-----------------+----------+</span>
<span class="token operator">|</span> Last_query_cost <span class="token operator">|</span> <span class="token number">1.000000</span> <span class="token operator">|</span>
<span class="token operator">+</span><span class="token comment">-----------------+----------+</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果我们想要查询 id 在 900001 到 9000100 之间的学生记录呢？</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token keyword">SELECT</span> student_id<span class="token punctuation">,</span> class_id<span class="token punctuation">,</span> NAME<span class="token punctuation">,</span> create_time <span class="token keyword">FROM</span> student_info <span class="token keyword">WHERE</span> id <span class="token operator">BETWEEN</span> <span class="token number">900001</span> <span class="token operator">AND</span> <span class="token number">900100</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>运行结果（100 条记录，运行时间为 0.046s ）：</p>
<p>然后再看下查询优化器的成本，这时我们大概需要进行 20 个页的查询。</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql<span class="token operator">></span> <span class="token keyword">SHOW</span> <span class="token keyword">STATUS</span> <span class="token operator">LIKE</span> <span class="token string">'last_query_cost'</span><span class="token punctuation">;</span>
<span class="token operator">+</span><span class="token comment">-----------------+-----------+</span>
<span class="token operator">|</span> Variable_name   <span class="token operator">|</span>   <span class="token keyword">Value</span>   <span class="token operator">|</span>
<span class="token operator">+</span><span class="token comment">-----------------+-----------+</span>
<span class="token operator">|</span> Last_query_cost <span class="token operator">|</span> <span class="token number">21.134453</span> <span class="token operator">|</span>
<span class="token operator">+</span><span class="token comment">-----------------+-----------+</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>你能看到页的数量是刚才的 20 倍，但是查询的效率并没有明显的变化，实际上这两个 SQL 查询的时间 基本上一样，就是因为采用了顺序读取的方式将页面一次性加载到缓冲池中，然后再进行查找。虽然 页 数量（last_query_cost）增加了不少 ，但是通过缓冲池的机制，并 没有增加多少查询时间 。</p>
<p>**使用场景：**它对于比较开销是非常有用的，特别是我们有好几种查询方式可选的时候。</p>
<blockquote>
<p>SQL查询时一个动态的过程，从页加载的角度来看，我们可以得到以下两点结论：</p>
<ol>
<li><code v-pre>位置决定效率</code>。如果页就在数据库 <code v-pre>缓冲池</code> 中，那么效率是最高的，否则还需要从 <code v-pre>内存</code> 或者 <code v-pre>磁盘</code> 中进行读取，当然针对单个页的读取来说，如果页存在于内存中，会比在磁盘中读取效率高很多。</li>
<li><code v-pre>批量决定效率</code>。如果我们从磁盘中对单一页进行随机读，那么效率是很低的(差不多10ms)，而采用顺序读取的方式，批量对页进行读取，平均一页的读取效率就会提升很多，甚至要快于单个页面在内存中的随机读取。</li>
</ol>
<p>所以说，遇到I/O并不用担心，方法找对了，效率还是很高的。我们首先要考虑数据存放的位置，如果是进程使用的数据就要尽量放到<code v-pre>缓冲池</code>中，其次我们可以充分利用磁盘的吞吐能力，一次性批量读取数据，这样单个页的读取效率也就得到了提升。</p>
</blockquote>
<h2 id="_4-定位执行慢的-sql-慢查询日志" tabindex="-1"><a class="header-anchor" href="#_4-定位执行慢的-sql-慢查询日志" aria-hidden="true">#</a> 4. 定位执行慢的 SQL：慢查询日志</h2>
<img src="@source/notes/senior_mysql/images/image-20220628173022699.png" alt="image-20220628173022699" style="float:left;" />
<h3 id="_4-1-开启慢查询日志参数" tabindex="-1"><a class="header-anchor" href="#_4-1-开启慢查询日志参数" aria-hidden="true">#</a> 4.1 开启慢查询日志参数</h3>
<p><strong>1. 开启 slow_query_log</strong></p>
<p>在使用前，我们需要先查下慢查询是否已经开启，使用下面这条命令即可：</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql <span class="token operator">></span> <span class="token keyword">show</span> variables <span class="token operator">like</span> <span class="token string">'%slow_query_log'</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><img src="@source/notes/senior_mysql/images/image-20220628173525966.png" alt="image-20220628173525966" style="float:left;" />
<p>我们可以看到 <code v-pre>slow_query_log=OFF</code>，我们可以把慢查询日志打开，注意设置变量值的时候需要使用 global，否则会报错：</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql <span class="token operator">></span> <span class="token keyword">set</span> <span class="token keyword">global</span> slow_query_log<span class="token operator">=</span><span class="token string">'ON'</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>然后我们再来查看下慢查询日志是否开启，以及慢查询日志文件的位置：</p>
<img src="@source/notes/senior_mysql/images/image-20220628175226812.png" alt="image-20220628175226812" style="float:left;" />
<p>你能看到这时慢查询分析已经开启，同时文件保存在 <code v-pre>/var/lib/mysql/atguigu02-slow.log</code> 文件 中。</p>
<p><strong>2. 修改 long_query_time 阈值</strong></p>
<p>接下来我们来看下慢查询的时间阈值设置，使用如下命令：</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql <span class="token operator">></span> <span class="token keyword">show</span> variables <span class="token operator">like</span> <span class="token string">'%long_query_time%'</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><img src="@source/notes/senior_mysql/images/image-20220628175353233.png" alt="image-20220628175353233" style="float:left;" />
<p>这里如果我们想把时间缩短，比如设置为 1 秒，可以这样设置：</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token comment">#测试发现：设置global的方式对当前session的long_query_time失效。对新连接的客户端有效。所以可以一并</span>
执行下述语句
mysql <span class="token operator">></span> <span class="token keyword">set</span> <span class="token keyword">global</span> long_query_time <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span>
mysql<span class="token operator">></span> <span class="token keyword">show</span> <span class="token keyword">global</span> variables <span class="token operator">like</span> <span class="token string">'%long_query_time%'</span><span class="token punctuation">;</span>

mysql<span class="token operator">></span> <span class="token keyword">set</span> long_query_time<span class="token operator">=</span><span class="token number">1</span><span class="token punctuation">;</span>
mysql<span class="token operator">></span> <span class="token keyword">show</span> variables <span class="token operator">like</span> <span class="token string">'%long_query_time%'</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><img src="@source/notes/senior_mysql/images/image-20220628175425922.png" alt="image-20220628175425922" style="zoom:80%; float:left;" />
<p><strong>补充：配置文件中一并设置参数</strong></p>
<p>如下的方式相较于前面的命令行方式，可以看做是永久设置的方式。</p>
<p>修改 <code v-pre>my.cnf</code> 文件，[mysqld] 下增加或修改参数 <code v-pre>long_query_time、slow_query_log</code> 和 <code v-pre>slow_query_log_file</code> 后，然后重启 MySQL 服务器。</p>
<div class="language-properties ext-properties line-numbers-mode"><pre v-pre class="language-properties"><code>[mysqld]
<span class="token key attr-name">slow_query_log</span><span class="token punctuation">=</span><span class="token value attr-value">ON  # 开启慢查询日志开关</span>
<span class="token key attr-name">slow_query_log_file</span><span class="token punctuation">=</span><span class="token value attr-value">/var/lib/mysql/atguigu-low.log  # 慢查询日志的目录和文件名信息</span>
<span class="token key attr-name">long_query_time</span><span class="token punctuation">=</span><span class="token value attr-value">3  # 设置慢查询的阈值为3秒，超出此设定值的SQL即被记录到慢查询日志</span>
<span class="token key attr-name">log_output</span><span class="token punctuation">=</span><span class="token value attr-value">FILE</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果不指定存储路径，慢查询日志默认存储到MySQL数据库的数据文件夹下。如果不指定文件名，默认文件名为hostname_slow.log。</p>
<h3 id="_4-2-查看慢查询数目" tabindex="-1"><a class="header-anchor" href="#_4-2-查看慢查询数目" aria-hidden="true">#</a> 4.2 查看慢查询数目</h3>
<p>查询当前系统中有多少条慢查询记录</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token keyword">SHOW</span> <span class="token keyword">GLOBAL</span> <span class="token keyword">STATUS</span> <span class="token operator">LIKE</span> <span class="token string">'%Slow_queries%'</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="_4-3-案例演示" tabindex="-1"><a class="header-anchor" href="#_4-3-案例演示" aria-hidden="true">#</a> 4.3 案例演示</h3>
<p><strong>步骤1. 建表</strong></p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token keyword">CREATE</span> <span class="token keyword">TABLE</span> <span class="token identifier"><span class="token punctuation">`</span>student<span class="token punctuation">`</span></span> <span class="token punctuation">(</span>
    <span class="token identifier"><span class="token punctuation">`</span>id<span class="token punctuation">`</span></span> <span class="token keyword">INT</span><span class="token punctuation">(</span><span class="token number">11</span><span class="token punctuation">)</span> <span class="token operator">NOT</span> <span class="token boolean">NULL</span> <span class="token keyword">AUTO_INCREMENT</span><span class="token punctuation">,</span>
    <span class="token identifier"><span class="token punctuation">`</span>stuno<span class="token punctuation">`</span></span> <span class="token keyword">INT</span> <span class="token operator">NOT</span> <span class="token boolean">NULL</span> <span class="token punctuation">,</span>
    <span class="token identifier"><span class="token punctuation">`</span>name<span class="token punctuation">`</span></span> <span class="token keyword">VARCHAR</span><span class="token punctuation">(</span><span class="token number">20</span><span class="token punctuation">)</span> <span class="token keyword">DEFAULT</span> <span class="token boolean">NULL</span><span class="token punctuation">,</span>
    <span class="token identifier"><span class="token punctuation">`</span>age<span class="token punctuation">`</span></span> <span class="token keyword">INT</span><span class="token punctuation">(</span><span class="token number">3</span><span class="token punctuation">)</span> <span class="token keyword">DEFAULT</span> <span class="token boolean">NULL</span><span class="token punctuation">,</span>
    <span class="token identifier"><span class="token punctuation">`</span>classId<span class="token punctuation">`</span></span> <span class="token keyword">INT</span><span class="token punctuation">(</span><span class="token number">11</span><span class="token punctuation">)</span> <span class="token keyword">DEFAULT</span> <span class="token boolean">NULL</span><span class="token punctuation">,</span>
    <span class="token keyword">PRIMARY</span> <span class="token keyword">KEY</span> <span class="token punctuation">(</span><span class="token identifier"><span class="token punctuation">`</span>id<span class="token punctuation">`</span></span><span class="token punctuation">)</span>
<span class="token punctuation">)</span> <span class="token keyword">ENGINE</span><span class="token operator">=</span><span class="token keyword">INNODB</span> <span class="token keyword">AUTO_INCREMENT</span><span class="token operator">=</span><span class="token number">1</span> <span class="token keyword">DEFAULT</span> <span class="token keyword">CHARSET</span><span class="token operator">=</span>utf8<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>步骤2：设置参数 log_bin_trust_function_creators</strong></p>
<p>创建函数，假如报错：</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>This <span class="token keyword">function</span> has none <span class="token keyword">of</span> <span class="token keyword">DETERMINISTIC</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul>
<li>命令开启：允许创建函数设置：</li>
</ul>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token keyword">set</span> <span class="token keyword">global</span> log_bin_trust_function_creators<span class="token operator">=</span><span class="token number">1</span><span class="token punctuation">;</span> <span class="token comment"># 不加global只是当前窗口有效。</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><strong>步骤3：创建函数</strong></p>
<p>随机产生字符串：（同上一章）</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token keyword">DELIMITER</span> <span class="token comment">//</span>
<span class="token keyword">CREATE</span> <span class="token keyword">FUNCTION</span> rand_string<span class="token punctuation">(</span>n <span class="token keyword">INT</span><span class="token punctuation">)</span>
	<span class="token keyword">RETURNS</span> <span class="token keyword">VARCHAR</span><span class="token punctuation">(</span><span class="token number">255</span><span class="token punctuation">)</span> <span class="token comment">#该函数会返回一个字符串</span>
<span class="token keyword">BEGIN</span>
	<span class="token keyword">DECLARE</span> chars_str <span class="token keyword">VARCHAR</span><span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span> <span class="token keyword">DEFAULT</span>
<span class="token string">'abcdefghijklmnopqrstuvwxyzABCDEFJHIJKLMNOPQRSTUVWXYZ'</span><span class="token punctuation">;</span>
	<span class="token keyword">DECLARE</span> return_str <span class="token keyword">VARCHAR</span><span class="token punctuation">(</span><span class="token number">255</span><span class="token punctuation">)</span> <span class="token keyword">DEFAULT</span> <span class="token string">''</span><span class="token punctuation">;</span>
    <span class="token keyword">DECLARE</span> i <span class="token keyword">INT</span> <span class="token keyword">DEFAULT</span> <span class="token number">0</span><span class="token punctuation">;</span>
    <span class="token keyword">WHILE</span> i <span class="token operator">&lt;</span> n <span class="token keyword">DO</span>
    	<span class="token keyword">SET</span> return_str <span class="token operator">=</span>CONCAT<span class="token punctuation">(</span>return_str<span class="token punctuation">,</span>SUBSTRING<span class="token punctuation">(</span>chars_str<span class="token punctuation">,</span>FLOOR<span class="token punctuation">(</span><span class="token number">1</span><span class="token operator">+</span>RAND<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">*</span><span class="token number">52</span><span class="token punctuation">)</span><span class="token punctuation">,</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    	<span class="token keyword">SET</span> i <span class="token operator">=</span> i <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">;</span>
    <span class="token keyword">END</span> <span class="token keyword">WHILE</span><span class="token punctuation">;</span>
    <span class="token keyword">RETURN</span> return_str<span class="token punctuation">;</span>
<span class="token keyword">END</span> <span class="token comment">//</span>
<span class="token keyword">DELIMITER</span> <span class="token punctuation">;</span>

<span class="token comment"># 测试</span>
<span class="token keyword">SELECT</span> rand_string<span class="token punctuation">(</span><span class="token number">10</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>产生随机数值：（同上一章）</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token keyword">DELIMITER</span> <span class="token comment">//</span>
<span class="token keyword">CREATE</span> <span class="token keyword">FUNCTION</span> rand_num <span class="token punctuation">(</span>from_num <span class="token keyword">INT</span> <span class="token punctuation">,</span>to_num <span class="token keyword">INT</span><span class="token punctuation">)</span> <span class="token keyword">RETURNS</span> <span class="token keyword">INT</span><span class="token punctuation">(</span><span class="token number">11</span><span class="token punctuation">)</span>
<span class="token keyword">BEGIN</span>
    <span class="token keyword">DECLARE</span> i <span class="token keyword">INT</span> <span class="token keyword">DEFAULT</span> <span class="token number">0</span><span class="token punctuation">;</span>
    <span class="token keyword">SET</span> i <span class="token operator">=</span> FLOOR<span class="token punctuation">(</span>from_num <span class="token operator">+</span>RAND<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">*</span><span class="token punctuation">(</span>to_num <span class="token operator">-</span> from_num<span class="token operator">+</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">;</span>
    <span class="token keyword">RETURN</span> i<span class="token punctuation">;</span>
<span class="token keyword">END</span> <span class="token comment">//</span>
<span class="token keyword">DELIMITER</span> <span class="token punctuation">;</span>

<span class="token comment">#测试：</span>
<span class="token keyword">SELECT</span> rand_num<span class="token punctuation">(</span><span class="token number">10</span><span class="token punctuation">,</span><span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>步骤4：创建存储过程</strong></p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token keyword">DELIMITER</span> <span class="token comment">//</span>
<span class="token keyword">CREATE</span> <span class="token keyword">PROCEDURE</span> insert_stu1<span class="token punctuation">(</span> <span class="token keyword">START</span> <span class="token keyword">INT</span> <span class="token punctuation">,</span> max_num <span class="token keyword">INT</span> <span class="token punctuation">)</span>
<span class="token keyword">BEGIN</span>
<span class="token keyword">DECLARE</span> i <span class="token keyword">INT</span> <span class="token keyword">DEFAULT</span> <span class="token number">0</span><span class="token punctuation">;</span>
    <span class="token keyword">SET</span> autocommit <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> <span class="token comment">#设置手动提交事务</span>
    <span class="token keyword">REPEAT</span> <span class="token comment">#循环</span>
    <span class="token keyword">SET</span> i <span class="token operator">=</span> i <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">;</span> <span class="token comment">#赋值</span>
    <span class="token keyword">INSERT</span> <span class="token keyword">INTO</span> student <span class="token punctuation">(</span>stuno<span class="token punctuation">,</span> NAME <span class="token punctuation">,</span>age <span class="token punctuation">,</span>classId <span class="token punctuation">)</span> <span class="token keyword">VALUES</span>
    <span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token keyword">START</span><span class="token operator">+</span>i<span class="token punctuation">)</span><span class="token punctuation">,</span>rand_string<span class="token punctuation">(</span><span class="token number">6</span><span class="token punctuation">)</span><span class="token punctuation">,</span>rand_num<span class="token punctuation">(</span><span class="token number">10</span><span class="token punctuation">,</span><span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">,</span>rand_num<span class="token punctuation">(</span><span class="token number">10</span><span class="token punctuation">,</span><span class="token number">1000</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    UNTIL i <span class="token operator">=</span> max_num
    <span class="token keyword">END</span> <span class="token keyword">REPEAT</span><span class="token punctuation">;</span>
    <span class="token keyword">COMMIT</span><span class="token punctuation">;</span> <span class="token comment">#提交事务</span>
<span class="token keyword">END</span> <span class="token comment">//</span>
<span class="token keyword">DELIMITER</span> <span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>步骤5：调用存储过程</strong></p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token comment">#调用刚刚写好的函数, 4000000条记录,从100001号开始</span>

<span class="token keyword">CALL</span> insert_stu1<span class="token punctuation">(</span><span class="token number">100001</span><span class="token punctuation">,</span><span class="token number">4000000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-4-测试及分析" tabindex="-1"><a class="header-anchor" href="#_4-4-测试及分析" aria-hidden="true">#</a> 4.4 测试及分析</h3>
<p><strong>1. 测试</strong></p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql<span class="token operator">></span> <span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> student <span class="token keyword">WHERE</span> stuno <span class="token operator">=</span> <span class="token number">3455655</span><span class="token punctuation">;</span>
<span class="token operator">+</span><span class="token comment">---------+---------+--------+------+---------+</span>
<span class="token operator">|</span>   id    <span class="token operator">|</span>  stuno  <span class="token operator">|</span>  name  <span class="token operator">|</span> age  <span class="token operator">|</span> classId <span class="token operator">|</span>
<span class="token operator">+</span><span class="token comment">---------+---------+--------+------+---------+</span>
<span class="token operator">|</span> <span class="token number">3523633</span> <span class="token operator">|</span> <span class="token number">3455655</span> <span class="token operator">|</span> oQmLUr <span class="token operator">|</span>  <span class="token number">19</span>  <span class="token operator">|</span>    <span class="token number">39</span>   <span class="token operator">|</span>
<span class="token operator">+</span><span class="token comment">---------+---------+--------+------+---------+</span>
<span class="token number">1</span> <span class="token keyword">row</span> <span class="token operator">in</span> <span class="token keyword">set</span> <span class="token punctuation">(</span><span class="token number">2.09</span> sec<span class="token punctuation">)</span>

mysql<span class="token operator">></span> <span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> student <span class="token keyword">WHERE</span> name <span class="token operator">=</span> <span class="token string">'oQmLUr'</span><span class="token punctuation">;</span>
<span class="token operator">+</span><span class="token comment">---------+---------+--------+------+---------+</span>
<span class="token operator">|</span>   id    <span class="token operator">|</span>  stuno  <span class="token operator">|</span>  name  <span class="token operator">|</span>  age <span class="token operator">|</span> classId <span class="token operator">|</span>
<span class="token operator">+</span><span class="token comment">---------+---------+--------+------+---------+</span>
<span class="token operator">|</span> <span class="token number">1154002</span> <span class="token operator">|</span> <span class="token number">1243200</span> <span class="token operator">|</span> OQMlUR <span class="token operator">|</span> <span class="token number">266</span>  <span class="token operator">|</span>   <span class="token number">28</span>    <span class="token operator">|</span>
<span class="token operator">|</span> <span class="token number">1405708</span> <span class="token operator">|</span> <span class="token number">1437740</span> <span class="token operator">|</span> OQMlUR <span class="token operator">|</span> <span class="token number">245</span>  <span class="token operator">|</span>   <span class="token number">439</span>   <span class="token operator">|</span>
<span class="token operator">|</span> <span class="token number">1748070</span> <span class="token operator">|</span> <span class="token number">1680092</span> <span class="token operator">|</span> OQMlUR <span class="token operator">|</span> <span class="token number">240</span>  <span class="token operator">|</span>   <span class="token number">414</span>   <span class="token operator">|</span>
<span class="token operator">|</span> <span class="token number">2119892</span> <span class="token operator">|</span> <span class="token number">2051914</span> <span class="token operator">|</span> oQmLUr <span class="token operator">|</span> <span class="token number">17</span>   <span class="token operator">|</span>   <span class="token number">32</span>    <span class="token operator">|</span>
<span class="token operator">|</span> <span class="token number">2893154</span> <span class="token operator">|</span> <span class="token number">2825176</span> <span class="token operator">|</span> OQMlUR <span class="token operator">|</span> <span class="token number">245</span>  <span class="token operator">|</span>   <span class="token number">435</span>   <span class="token operator">|</span>
<span class="token operator">|</span> <span class="token number">3523633</span> <span class="token operator">|</span> <span class="token number">3455655</span> <span class="token operator">|</span> oQmLUr <span class="token operator">|</span> <span class="token number">19</span>   <span class="token operator">|</span>   <span class="token number">39</span>    <span class="token operator">|</span>
<span class="token operator">+</span><span class="token comment">---------+---------+--------+------+---------+</span>
<span class="token number">6</span> <span class="token keyword">rows</span> <span class="token operator">in</span> <span class="token keyword">set</span> <span class="token punctuation">(</span><span class="token number">2.39</span> sec<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>从上面的结果可以看出来，查询学生编号为“3455655”的学生信息花费时间为2.09秒。查询学生姓名为 “oQmLUr”的学生信息花费时间为2.39秒。已经达到了秒的数量级，说明目前查询效率是比较低的，下面 的小节我们分析一下原因。</p>
<p><strong>2. 分析</strong></p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token keyword">show</span> <span class="token keyword">status</span> <span class="token operator">like</span> <span class="token string">'slow_queries'</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><img src="@source/notes/senior_mysql/images/image-20220628195650079.png" alt="image-20220628195650079" style="float:left;" />
<h3 id="_4-5-慢查询日志分析工具-mysqldumpslow" tabindex="-1"><a class="header-anchor" href="#_4-5-慢查询日志分析工具-mysqldumpslow" aria-hidden="true">#</a> 4.5 慢查询日志分析工具：mysqldumpslow</h3>
<p>在生产环境中，如果要手工分析日志，查找、分析SQL，显然是个体力活，MySQL提供了日志分析工具 <code v-pre>mysqldumpslow</code> 。</p>
<p>查看mysqldumpslow的帮助信息</p>
<div class="language-properties ext-properties line-numbers-mode"><pre v-pre class="language-properties"><code><span class="token key attr-name">mysqldumpslow</span> <span class="token value attr-value">--help</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><img src="@source/notes/senior_mysql/images/image-20220628195821440.png" alt="image-20220628195821440" style="float:left;" />
<p>mysqldumpslow 命令的具体参数如下：</p>
<ul>
<li>-a: 不将数字抽象成N，字符串抽象成S</li>
<li>-s: 是表示按照何种方式排序：
<ul>
<li>c: 访问次数</li>
<li>l: 锁定时间</li>
<li>r: 返回记录</li>
<li>t: 查询时间</li>
<li>al:平均锁定时间</li>
<li>ar:平均返回记录数</li>
<li>at:平均查询时间 （默认方式）</li>
<li>ac:平均查询次数</li>
</ul>
</li>
<li>-t: 即为返回前面多少条的数据；</li>
<li>-g: 后边搭配一个正则匹配模式，大小写不敏感的；</li>
</ul>
<p>举例：我们想要按照查询时间排序，查看前五条 SQL 语句，这样写即可：</p>
<div class="language-properties ext-properties line-numbers-mode"><pre v-pre class="language-properties"><code><span class="token key attr-name">mysqldumpslow</span> <span class="token value attr-value">-s t -t 5 /var/lib/mysql/atguigu01-slow.log</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><div class="language-properties ext-properties line-numbers-mode"><pre v-pre class="language-properties"><code><span class="token key attr-name">[root@bogon</span> <span class="token value attr-value">~]# mysqldumpslow -s t -t 5 /var/lib/mysql/atguigu01-slow.log</span>

<span class="token key attr-name">Reading</span> <span class="token value attr-value">mysql slow query log from /var/lib/mysql/atguigu01-slow.log</span>
<span class="token key attr-name">Count</span><span class="token punctuation">:</span> <span class="token value attr-value">1 Time=2.39s (2s) Lock=0.00s (0s) Rows=13.0 (13), root[root]@localhost</span>
<span class="token key attr-name">SELECT</span> <span class="token value attr-value">* FROM student WHERE name = 'S'</span>

<span class="token key attr-name">Count</span><span class="token punctuation">:</span> <span class="token value attr-value">1 Time=2.09s (2s) Lock=0.00s (0s) Rows=2.0 (2), root[root]@localhost</span>
<span class="token key attr-name">SELECT</span> <span class="token value attr-value">* FROM student WHERE stuno = N</span>

<span class="token key attr-name">Died</span> <span class="token value attr-value">at /usr/bin/mysqldumpslow line 162, &lt;> chunk 2.</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>工作常用参考：</strong></p>
<div class="language-properties ext-properties line-numbers-mode"><pre v-pre class="language-properties"><code><span class="token comment">#得到返回记录集最多的10个SQL</span>
<span class="token key attr-name">mysqldumpslow</span> <span class="token value attr-value">-s r -t 10 /var/lib/mysql/atguigu-slow.log</span>

<span class="token comment">#得到访问次数最多的10个SQL</span>
<span class="token key attr-name">mysqldumpslow</span> <span class="token value attr-value">-s c -t 10 /var/lib/mysql/atguigu-slow.log</span>

<span class="token comment">#得到按照时间排序的前10条里面含有左连接的查询语句</span>
<span class="token key attr-name">mysqldumpslow</span> <span class="token value attr-value">-s t -t 10 -g "left join" /var/lib/mysql/atguigu-slow.log</span>

<span class="token comment">#另外建议在使用这些命令时结合 | 和more 使用 ，否则有可能出现爆屏情况</span>
<span class="token key attr-name">mysqldumpslow</span> <span class="token value attr-value">-s r -t 10 /var/lib/mysql/atguigu-slow.log | more</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-6-关闭慢查询日志" tabindex="-1"><a class="header-anchor" href="#_4-6-关闭慢查询日志" aria-hidden="true">#</a> 4.6 关闭慢查询日志</h3>
<p>MySQL服务器停止慢查询日志功能有两种方法：</p>
<p><strong>方式1：永久性方式</strong></p>
<div class="language-properties ext-properties line-numbers-mode"><pre v-pre class="language-properties"><code>[mysqld]
<span class="token key attr-name">slow_query_log</span><span class="token punctuation">=</span><span class="token value attr-value">OFF</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>或者，把slow_query_log一项注释掉 或 删除</p>
<div class="language-properties ext-properties line-numbers-mode"><pre v-pre class="language-properties"><code>[mysqld]
<span class="token comment">#slow_query_log =OFF</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>重启MySQL服务，执行如下语句查询慢日志功能。</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token keyword">SHOW</span> VARIABLES <span class="token operator">LIKE</span> <span class="token string">'%slow%'</span><span class="token punctuation">;</span> <span class="token comment">#查询慢查询日志所在目录</span>
<span class="token keyword">SHOW</span> VARIABLES <span class="token operator">LIKE</span> <span class="token string">'%long_query_time%'</span><span class="token punctuation">;</span> <span class="token comment">#查询超时时长</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>方式2：临时性方式</strong></p>
<p>使用SET语句来设置。</p>
<p>（1）停止MySQL慢查询日志功能，具体SQL语句如下。</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token keyword">SET</span> <span class="token keyword">GLOBAL</span> slow_query_log<span class="token operator">=</span><span class="token keyword">off</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>（2）<strong>重启MySQL服务</strong>，使用SHOW语句查询慢查询日志功能信息，具体SQL语句如下。</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token keyword">SHOW</span> VARIABLES <span class="token operator">LIKE</span> <span class="token string">'%slow%'</span><span class="token punctuation">;</span>
<span class="token comment">#以及</span>
<span class="token keyword">SHOW</span> VARIABLES <span class="token operator">LIKE</span> <span class="token string">'%long_query_time%'</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-7-删除慢查询日志" tabindex="-1"><a class="header-anchor" href="#_4-7-删除慢查询日志" aria-hidden="true">#</a> 4.7 删除慢查询日志</h3>
<p>使用SHOW语句显示慢查询日志信息，具体SQL语句如下。</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token keyword">SHOW</span> VARIABLES <span class="token operator">LIKE</span> <span class="token identifier"><span class="token punctuation">`</span>slow_query_log%<span class="token punctuation">`</span></span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><img src="@source/notes/senior_mysql/images/image-20220628203545536.png" alt="image-20220628203545536" style="float:left;" />
<p>从执行结果可以看出，慢查询日志的目录默认为MySQL的数据目录，在该目录下 <code v-pre>手动删除慢查询日志文件</code> 即可。</p>
<p>使用命令 <code v-pre>mysqladmin flush-logs</code> 来重新生成查询日志文件，具体命令如下，执行完毕会在数据目录下重新生成慢查询日志文件。</p>
<div class="language-properties ext-properties line-numbers-mode"><pre v-pre class="language-properties"><code><span class="token key attr-name">mysqladmin</span> <span class="token value attr-value">-uroot -p flush-logs slow</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><blockquote>
<p>提示</p>
<p>慢查询日志都是使用mysqladmin flush-logs命令来删除重建的。使用时一定要注意，一旦执行了这个命令，慢查询日志都只存在新的日志文件中，如果需要旧的查询日志，就必须事先备份。</p>
</blockquote>
<h2 id="_5-查看-sql-执行成本-show-profile" tabindex="-1"><a class="header-anchor" href="#_5-查看-sql-执行成本-show-profile" aria-hidden="true">#</a> 5. 查看 SQL 执行成本：SHOW PROFILE</h2>
<p>show profile 在《逻辑架构》章节中讲过，这里作为复习。</p>
<p>show profile 是 MySQL 提供的可以用来分析当前会话中 SQL 都做了什么、执行的资源消耗工具的情况，可用于 sql 调优的测量。<code v-pre>默认情况下处于关闭状态</code>，并保存最近15次的运行结果。</p>
<p>我们可以在会话级别开启这个功能。</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql <span class="token operator">></span> <span class="token keyword">show</span> variables <span class="token operator">like</span> <span class="token string">'profiling'</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><img src="@source/notes/senior_mysql/images/image-20220628204922556.png" alt="image-20220628204922556" style="float:left;" />
<p>通过设置 profiling='ON' 来开启 show profile:</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql <span class="token operator">></span> <span class="token keyword">set</span> profiling <span class="token operator">=</span> <span class="token string">'ON'</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><img src="@source/notes/senior_mysql/images/image-20220628205029208.png" alt="image-20220628205029208" style="zoom:80%;float:left" />
<p>然后执行相关的查询语句。接着看下当前会话都有哪些 profiles，使用下面这条命令：</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql <span class="token operator">></span> <span class="token keyword">show</span> profiles<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><img src="@source/notes/senior_mysql/images/image-20220628205243769.png" alt="image-20220628205243769" style="zoom:80%;float:left" />
<p>你能看到当前会话一共有 2 个查询。如果我们想要查看最近一次查询的开销，可以使用：</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql <span class="token operator">></span> <span class="token keyword">show</span> profile<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><img src="@source/notes/senior_mysql/images/image-20220628205317257.png" alt="image-20220628205317257" style="float:left;" />
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql<span class="token operator">></span> <span class="token keyword">show</span> profile cpu<span class="token punctuation">,</span>block io <span class="token keyword">for</span> query <span class="token number">2</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><img src="@source/notes/senior_mysql/images/image-20220628205354230.png" alt="image-20220628205354230" style="float:left;" />
<p>**show profile的常用查询参数： **</p>
<p>① ALL：显示所有的开销信息。</p>
<p>② BLOCK IO：显示块IO开销。</p>
<p>③ CONTEXT SWITCHES：上下文切换开销。</p>
<p>④ CPU：显示CPU开销信息。</p>
<p>⑤ IPC：显示发送和接收开销信息。</p>
<p>⑥ MEMORY：显示内存开销信 息。</p>
<p>⑦ PAGE FAULTS：显示页面错误开销信息。</p>
<p>⑧ SOURCE：显示和Source_function，Source_file， Source_line相关的开销信息。</p>
<p>⑨ SWAPS：显示交换次数开销信息。</p>
<p><strong>日常开发需注意的结论：</strong></p>
<p>① <code v-pre>converting HEAP to MyISAM</code>: 查询结果太大，内存不够，数据往磁盘上搬了。</p>
<p>② <code v-pre>Creating tmp table</code>：创建临时表。先拷贝数据到临时表，用完后再删除临时表。</p>
<p>③ <code v-pre>Copying to tmp table on disk</code>：把内存中临时表复制到磁盘上，警惕！</p>
<p>④ <code v-pre>locked</code>。</p>
<p>如果在show profile诊断结果中出现了以上4条结果中的任何一条，则sql语句需要优化。</p>
<p><strong>注意：</strong></p>
<p>不过SHOW PROFILE命令将被启用，我们可以从 information_schema 中的 profiling 数据表进行查看。</p>
<h2 id="_6-分析查询语句-explain" tabindex="-1"><a class="header-anchor" href="#_6-分析查询语句-explain" aria-hidden="true">#</a> 6. 分析查询语句：EXPLAIN</h2>
<h3 id="_6-1-概述" tabindex="-1"><a class="header-anchor" href="#_6-1-概述" aria-hidden="true">#</a> 6.1 概述</h3>
<img src="@source/notes/senior_mysql/images/image-20220628210837301.png" alt="image-20220628210837301" style="float:left;" />
<p><strong>1. 能做什么？</strong></p>
<ul>
<li>表的读取顺序</li>
<li>数据读取操作的操作类型</li>
<li>哪些索引可以使用</li>
<li>哪些索引被实际使用</li>
<li>表之间的引用</li>
<li>每张表有多少行被优化器查询</li>
</ul>
<p><strong>2. 官网介绍</strong></p>
<p><a href="https://dev.mysql.com/doc/refman/5.7/en/explain-output.html" target="_blank" rel="noopener noreferrer">https://dev.mysql.com/doc/refman/5.7/en/explain-output.html<ExternalLinkIcon/></a></p>
<p><a href="https://dev.mysql.com/doc/refman/8.0/en/explain-output.html" target="_blank" rel="noopener noreferrer">https://dev.mysql.com/doc/refman/8.0/en/explain-output.html<ExternalLinkIcon/></a></p>
<p><img src="@source/notes/senior_mysql/images/image-20220628211207436.png" alt="image-20220628211207436" loading="lazy"></p>
<p><strong>3. 版本情况</strong></p>
<ul>
<li>MySQL 5.6.3以前只能 EXPLAIN SELECT ；MYSQL 5.6.3以后就可以 EXPLAIN SELECT，UPDATE， DELETE</li>
<li>在5.7以前的版本中，想要显示 partitions 需要使用 explain partitions 命令；想要显示 filtered 需要使用 explain extended 命令。在5.7版本后，默认explain直接显示partitions和 filtered中的信息。</li>
</ul>
<img src="@source/notes/senior_mysql/images/image-20220628211351678.png" alt="image-20220628211351678" style="float:left;" />
<h3 id="_6-2-基本语法" tabindex="-1"><a class="header-anchor" href="#_6-2-基本语法" aria-hidden="true">#</a> 6.2 基本语法</h3>
<p>EXPLAIN 或 DESCRIBE语句的语法形式如下：</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> select_options
或者
<span class="token keyword">DESCRIBE</span> <span class="token keyword">SELECT</span> select_options
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果我们想看看某个查询的执行计划的话，可以在具体的查询语句前边加一个 EXPLAIN ，就像这样：</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql<span class="token operator">></span> <span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> <span class="token number">1</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><img src="@source/notes/senior_mysql/images/image-20220628212029574.png" alt="image-20220628212029574" style="float:left;" />
<p>EXPLAIN 语句输出的各个列的作用如下：</p>
<p><img src="@source/notes/senior_mysql/images/image-20220628212049096.png" alt="image-20220628212049096" loading="lazy"></p>
<p>在这里把它们都列出来知识为了描述一个轮廓，让大家有一个大致的印象。</p>
<h3 id="_6-3-数据准备" tabindex="-1"><a class="header-anchor" href="#_6-3-数据准备" aria-hidden="true">#</a> 6.3 数据准备</h3>
<p><strong>1. 建表</strong></p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token keyword">CREATE</span> <span class="token keyword">TABLE</span> s1 <span class="token punctuation">(</span>
    id <span class="token keyword">INT</span> <span class="token keyword">AUTO_INCREMENT</span><span class="token punctuation">,</span>
    key1 <span class="token keyword">VARCHAR</span><span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    key2 <span class="token keyword">INT</span><span class="token punctuation">,</span>
    key3 <span class="token keyword">VARCHAR</span><span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    key_part1 <span class="token keyword">VARCHAR</span><span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    key_part2 <span class="token keyword">VARCHAR</span><span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    key_part3 <span class="token keyword">VARCHAR</span><span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    common_field <span class="token keyword">VARCHAR</span><span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token keyword">PRIMARY</span> <span class="token keyword">KEY</span> <span class="token punctuation">(</span>id<span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token keyword">INDEX</span> idx_key1 <span class="token punctuation">(</span>key1<span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token keyword">UNIQUE</span> <span class="token keyword">INDEX</span> idx_key2 <span class="token punctuation">(</span>key2<span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token keyword">INDEX</span> idx_key3 <span class="token punctuation">(</span>key3<span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token keyword">INDEX</span> idx_key_part<span class="token punctuation">(</span>key_part1<span class="token punctuation">,</span> key_part2<span class="token punctuation">,</span> key_part3<span class="token punctuation">)</span>
<span class="token punctuation">)</span> <span class="token keyword">ENGINE</span><span class="token operator">=</span><span class="token keyword">INNODB</span> <span class="token keyword">CHARSET</span><span class="token operator">=</span>utf8<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token keyword">CREATE</span> <span class="token keyword">TABLE</span> s2 <span class="token punctuation">(</span>
    id <span class="token keyword">INT</span> <span class="token keyword">AUTO_INCREMENT</span><span class="token punctuation">,</span>
    key1 <span class="token keyword">VARCHAR</span><span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    key2 <span class="token keyword">INT</span><span class="token punctuation">,</span>
    key3 <span class="token keyword">VARCHAR</span><span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    key_part1 <span class="token keyword">VARCHAR</span><span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    key_part2 <span class="token keyword">VARCHAR</span><span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    key_part3 <span class="token keyword">VARCHAR</span><span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    common_field <span class="token keyword">VARCHAR</span><span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token keyword">PRIMARY</span> <span class="token keyword">KEY</span> <span class="token punctuation">(</span>id<span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token keyword">INDEX</span> idx_key1 <span class="token punctuation">(</span>key1<span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token keyword">UNIQUE</span> <span class="token keyword">INDEX</span> idx_key2 <span class="token punctuation">(</span>key2<span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token keyword">INDEX</span> idx_key3 <span class="token punctuation">(</span>key3<span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token keyword">INDEX</span> idx_key_part<span class="token punctuation">(</span>key_part1<span class="token punctuation">,</span> key_part2<span class="token punctuation">,</span> key_part3<span class="token punctuation">)</span>
<span class="token punctuation">)</span> <span class="token keyword">ENGINE</span><span class="token operator">=</span><span class="token keyword">INNODB</span> <span class="token keyword">CHARSET</span><span class="token operator">=</span>utf8<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>2. 设置参数 log_bin_trust_function_creators</strong></p>
<p>创建函数，假如报错，需开启如下命令：允许创建函数设置：</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token keyword">set</span> <span class="token keyword">global</span> log_bin_trust_function_creators<span class="token operator">=</span><span class="token number">1</span><span class="token punctuation">;</span> <span class="token comment"># 不加global只是当前窗口有效。</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><strong>3. 创建函数</strong></p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token keyword">DELIMITER</span> <span class="token comment">//</span>
<span class="token keyword">CREATE</span> <span class="token keyword">FUNCTION</span> rand_string1<span class="token punctuation">(</span>n <span class="token keyword">INT</span><span class="token punctuation">)</span>
	<span class="token keyword">RETURNS</span> <span class="token keyword">VARCHAR</span><span class="token punctuation">(</span><span class="token number">255</span><span class="token punctuation">)</span> <span class="token comment">#该函数会返回一个字符串</span>
<span class="token keyword">BEGIN</span>
	<span class="token keyword">DECLARE</span> chars_str <span class="token keyword">VARCHAR</span><span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span> <span class="token keyword">DEFAULT</span>
<span class="token string">'abcdefghijklmnopqrstuvwxyzABCDEFJHIJKLMNOPQRSTUVWXYZ'</span><span class="token punctuation">;</span>
    <span class="token keyword">DECLARE</span> return_str <span class="token keyword">VARCHAR</span><span class="token punctuation">(</span><span class="token number">255</span><span class="token punctuation">)</span> <span class="token keyword">DEFAULT</span> <span class="token string">''</span><span class="token punctuation">;</span>
    <span class="token keyword">DECLARE</span> i <span class="token keyword">INT</span> <span class="token keyword">DEFAULT</span> <span class="token number">0</span><span class="token punctuation">;</span>
    <span class="token keyword">WHILE</span> i <span class="token operator">&lt;</span> n <span class="token keyword">DO</span>
        <span class="token keyword">SET</span> return_str <span class="token operator">=</span>CONCAT<span class="token punctuation">(</span>return_str<span class="token punctuation">,</span>SUBSTRING<span class="token punctuation">(</span>chars_str<span class="token punctuation">,</span>FLOOR<span class="token punctuation">(</span><span class="token number">1</span><span class="token operator">+</span>RAND<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">*</span><span class="token number">52</span><span class="token punctuation">)</span><span class="token punctuation">,</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">SET</span> i <span class="token operator">=</span> i <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">;</span>
    <span class="token keyword">END</span> <span class="token keyword">WHILE</span><span class="token punctuation">;</span>
    <span class="token keyword">RETURN</span> return_str<span class="token punctuation">;</span>
<span class="token keyword">END</span> <span class="token comment">//</span>
<span class="token keyword">DELIMITER</span> <span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>4. 创建存储过程</strong></p>
<p>创建往s1表中插入数据的存储过程：</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token keyword">DELIMITER</span> <span class="token comment">//</span>
<span class="token keyword">CREATE</span> <span class="token keyword">PROCEDURE</span> insert_s1 <span class="token punctuation">(</span><span class="token operator">IN</span> min_num <span class="token keyword">INT</span> <span class="token punctuation">(</span><span class="token number">10</span><span class="token punctuation">)</span><span class="token punctuation">,</span><span class="token operator">IN</span> max_num <span class="token keyword">INT</span> <span class="token punctuation">(</span><span class="token number">10</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
<span class="token keyword">BEGIN</span>
    <span class="token keyword">DECLARE</span> i <span class="token keyword">INT</span> <span class="token keyword">DEFAULT</span> <span class="token number">0</span><span class="token punctuation">;</span>
    <span class="token keyword">SET</span> autocommit <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
    <span class="token keyword">REPEAT</span>
    <span class="token keyword">SET</span> i <span class="token operator">=</span> i <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">;</span>
    <span class="token keyword">INSERT</span> <span class="token keyword">INTO</span> s1 <span class="token keyword">VALUES</span><span class="token punctuation">(</span>
        <span class="token punctuation">(</span>min_num <span class="token operator">+</span> i<span class="token punctuation">)</span><span class="token punctuation">,</span>
        rand_string1<span class="token punctuation">(</span><span class="token number">6</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
        <span class="token punctuation">(</span>min_num <span class="token operator">+</span> <span class="token number">30</span> <span class="token operator">*</span> i <span class="token operator">+</span> <span class="token number">5</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
        rand_string1<span class="token punctuation">(</span><span class="token number">6</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
        rand_string1<span class="token punctuation">(</span><span class="token number">10</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
        rand_string1<span class="token punctuation">(</span><span class="token number">5</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
        rand_string1<span class="token punctuation">(</span><span class="token number">10</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
        rand_string1<span class="token punctuation">(</span><span class="token number">10</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    UNTIL i <span class="token operator">=</span> max_num
    <span class="token keyword">END</span> <span class="token keyword">REPEAT</span><span class="token punctuation">;</span>
    <span class="token keyword">COMMIT</span><span class="token punctuation">;</span>
<span class="token keyword">END</span> <span class="token comment">//</span>
<span class="token keyword">DELIMITER</span> <span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>创建往s2表中插入数据的存储过程：</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token keyword">DELIMITER</span> <span class="token comment">//</span>
<span class="token keyword">CREATE</span> <span class="token keyword">PROCEDURE</span> insert_s2 <span class="token punctuation">(</span><span class="token operator">IN</span> min_num <span class="token keyword">INT</span> <span class="token punctuation">(</span><span class="token number">10</span><span class="token punctuation">)</span><span class="token punctuation">,</span><span class="token operator">IN</span> max_num <span class="token keyword">INT</span> <span class="token punctuation">(</span><span class="token number">10</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
<span class="token keyword">BEGIN</span>
    <span class="token keyword">DECLARE</span> i <span class="token keyword">INT</span> <span class="token keyword">DEFAULT</span> <span class="token number">0</span><span class="token punctuation">;</span>
    <span class="token keyword">SET</span> autocommit <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
    <span class="token keyword">REPEAT</span>
    <span class="token keyword">SET</span> i <span class="token operator">=</span> i <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">;</span>
    <span class="token keyword">INSERT</span> <span class="token keyword">INTO</span> s2 <span class="token keyword">VALUES</span><span class="token punctuation">(</span>
        <span class="token punctuation">(</span>min_num <span class="token operator">+</span> i<span class="token punctuation">)</span><span class="token punctuation">,</span>
        rand_string1<span class="token punctuation">(</span><span class="token number">6</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
        <span class="token punctuation">(</span>min_num <span class="token operator">+</span> <span class="token number">30</span> <span class="token operator">*</span> i <span class="token operator">+</span> <span class="token number">5</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
        rand_string1<span class="token punctuation">(</span><span class="token number">6</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
        rand_string1<span class="token punctuation">(</span><span class="token number">10</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
        rand_string1<span class="token punctuation">(</span><span class="token number">5</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
        rand_string1<span class="token punctuation">(</span><span class="token number">10</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
        rand_string1<span class="token punctuation">(</span><span class="token number">10</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    UNTIL i <span class="token operator">=</span> max_num
    <span class="token keyword">END</span> <span class="token keyword">REPEAT</span><span class="token punctuation">;</span>
    <span class="token keyword">COMMIT</span><span class="token punctuation">;</span>
<span class="token keyword">END</span> <span class="token comment">//</span>
<span class="token keyword">DELIMITER</span> <span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>5. 调用存储过程</strong></p>
<p>s1表数据的添加：加入1万条记录：</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token keyword">CALL</span> insert_s1<span class="token punctuation">(</span><span class="token number">10001</span><span class="token punctuation">,</span><span class="token number">10000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>s2表数据的添加：加入1万条记录：</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token keyword">CALL</span> insert_s2<span class="token punctuation">(</span><span class="token number">10001</span><span class="token punctuation">,</span><span class="token number">10000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="_6-4-explain各列作用" tabindex="-1"><a class="header-anchor" href="#_6-4-explain各列作用" aria-hidden="true">#</a> 6.4 EXPLAIN各列作用</h3>
<p>为了让大家有比较好的体验，我们调整了下 <code v-pre>EXPLAIN</code> 输出列的顺序。</p>
<h4 id="_1-table" tabindex="-1"><a class="header-anchor" href="#_1-table" aria-hidden="true">#</a> 1. table</h4>
<p>不论我们的查询语句有多复杂，里边儿 包含了多少个表 ，到最后也是需要对每个表进行 单表访问 的，所 以MySQL规定EXPLAIN语句输出的每条记录都对应着某个单表的访问方法，该条记录的table列代表着该 表的表名（有时不是真实的表名字，可能是简称）。</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql <span class="token operator">></span> <span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> s1<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><img src="@source/notes/senior_mysql/images/image-20220628221143339.png" alt="image-20220628221143339" loading="lazy"></p>
<p>这个查询语句只涉及对s1表的单表查询，所以 <code v-pre>EXPLAIN</code> 输出中只有一条记录，其中的table列的值为s1，表明这条记录是用来说明对s1表的单表访问方法的。</p>
<p>下边我们看一个连接查询的执行计划</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql <span class="token operator">></span> <span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> s1 <span class="token keyword">INNER</span> <span class="token keyword">JOIN</span> s2<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><img src="@source/notes/senior_mysql/images/image-20220628221414097.png" alt="image-20220628221414097" loading="lazy"></p>
<p>可以看出这个连接查询的执行计划中有两条记录，这两条记录的table列分别是s1和s2，这两条记录用来分别说明对s1表和s2表的访问方法是什么。</p>
<h4 id="_2-id" tabindex="-1"><a class="header-anchor" href="#_2-id" aria-hidden="true">#</a> 2. id</h4>
<p>我们写的查询语句一般都以 SELECT 关键字开头，比较简单的查询语句里只有一个 SELECT 关键字，比 如下边这个查询语句：</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> s1 <span class="token keyword">WHERE</span> key1 <span class="token operator">=</span> <span class="token string">'a'</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>稍微复杂一点的连接查询中也只有一个 SELECT 关键字，比如：</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> s1 <span class="token keyword">INNER</span> <span class="token keyword">JOIN</span> s2
<span class="token keyword">ON</span> s1<span class="token punctuation">.</span>key1 <span class="token operator">=</span> s2<span class="token punctuation">.</span>key1
<span class="token keyword">WHERE</span> s1<span class="token punctuation">.</span>common_field <span class="token operator">=</span> <span class="token string">'a'</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>但是下边两种情况下在一条查询语句中会出现多个SELECT关键字：</p>
<img src="@source/notes/senior_mysql/images/image-20220628221948512.png" alt="image-20220628221948512" style="float:left;" />
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql <span class="token operator">></span> <span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> s1 <span class="token keyword">WHERE</span> key1 <span class="token operator">=</span> <span class="token string">'a'</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><img src="@source/notes/senior_mysql/images/image-20220628222055716.png" alt="image-20220628222055716" loading="lazy"></p>
<p>对于连接查询来说，一个SELECT关键字后边的FROM字句中可以跟随多个表，所以在连接查询的执行计划中，每个表都会对应一条记录，但是这些记录的id值都是相同的，比如：</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql<span class="token operator">></span> <span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> s1 <span class="token keyword">INNER</span> <span class="token keyword">JOIN</span> s2<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><img src="@source/notes/senior_mysql/images/image-20220628222251309.png" alt="image-20220628222251309" loading="lazy"></p>
<p>可以看到，上述连接查询中参与连接的s1和s2表分别对应一条记录，但是这两条记录对应的<code v-pre>id</code>都是1。这里需要大家记住的是，<strong>在连接查询的执行计划中，每个表都会对应一条记录，这些记录的id列的值是相同的</strong>，出现在前边的表表示<code v-pre>驱动表</code>，出现在后面的表表示<code v-pre>被驱动表</code>。所以从上边的EXPLAIN输出中我们可以看到，查询优化器准备让s1表作为驱动表，让s2表作为被驱动表来执行查询。</p>
<p>对于包含子查询的查询语句来说，就可能涉及多个<code v-pre>SELECT</code>关键字，所以在**包含子查询的查询语句的执行计划中，每个<code v-pre>SELECT</code>关键字都会对应一个唯一的id值，比如这样：</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql<span class="token operator">></span> <span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> s1 <span class="token keyword">WHERE</span> key1 <span class="token operator">IN</span> <span class="token punctuation">(</span><span class="token keyword">SELECT</span> key1 <span class="token keyword">FROM</span> s2<span class="token punctuation">)</span> <span class="token operator">OR</span> key3 <span class="token operator">=</span> <span class="token string">'a'</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><img src="@source/notes/senior_mysql/images/image-20220629165122837.png" alt="image-20220629165122837" loading="lazy"></p>
<img src="@source/notes/senior_mysql/images/image-20220629170848349.png" alt="image-20220629170848349" style="float:left;" />
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token comment"># 查询优化器可能对涉及子查询的查询语句进行重写，转变为多表查询的操作。  </span>
mysql<span class="token operator">></span> <span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> s1 <span class="token keyword">WHERE</span> key1 <span class="token operator">IN</span> <span class="token punctuation">(</span><span class="token keyword">SELECT</span> key2 <span class="token keyword">FROM</span> s2 <span class="token keyword">WHERE</span> common_field <span class="token operator">=</span> <span class="token string">'a'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="@source/notes/senior_mysql/images/image-20220629165603072.png" alt="image-20220629165603072" loading="lazy"></p>
<p>可以看到，虽然我们的查询语句是一个子查询，但是执行计划中s1和s2表对应的记录的<code v-pre>id</code>值全部是1，这就表明<code v-pre>查询优化器将子查询转换为了连接查询</code>。</p>
<p>对于包含<code v-pre>UNION</code>子句的查询语句来说，每个<code v-pre>SELECT</code>关键字对应一个<code v-pre>id</code>值也是没错的，不过还是有点儿特别的东西，比方说下边的查询：</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token comment"># Union去重</span>
mysql<span class="token operator">></span> <span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> s1 <span class="token keyword">UNION</span> <span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> s2<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="@source/notes/senior_mysql/images/image-20220629165909340.png" alt="image-20220629165909340" loading="lazy"></p>
<img src="@source/notes/senior_mysql/images/image-20220629171104375.png" alt="image-20220629171104375" style="float:left;" />
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql<span class="token operator">></span> <span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> s1 <span class="token keyword">UNION</span> <span class="token keyword">ALL</span> <span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> s2<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><img src="@source/notes/senior_mysql/images/image-20220629171138065.png" alt="image-20220629171138065" loading="lazy"></p>
<p><strong>小结:</strong></p>
<ul>
<li>id如果相同，可以认为是一组，从上往下顺序执行</li>
<li>在所有组中，id值越大，优先级越高，越先执行</li>
<li>关注点：id号每个号码，表示一趟独立的查询, 一个sql的查询趟数越少越好</li>
</ul>
<h4 id="_3-select-type" tabindex="-1"><a class="header-anchor" href="#_3-select-type" aria-hidden="true">#</a> 3. select_type</h4>
<img src="@source/notes/senior_mysql/images/image-20220629171611716.png" alt="image-20220629171611716" style="float:left;" />
<p><img src="@source/notes/senior_mysql/images/image-20220629171442624.png" alt="image-20220629171442624" loading="lazy"></p>
<p>具体分析如下：</p>
<ul>
<li>
<p>SIMPLE</p>
<p>查询语句中不包含<code v-pre>UNION</code>或者子查询的查询都算作是<code v-pre>SIMPLE</code>类型，比方说下边这个单表查询<code v-pre>select_type</code>的值就是<code v-pre>SIMPLE</code>:</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql<span class="token operator">></span> <span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> s1<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li>
</ul>
<p><img src="@source/notes/senior_mysql/images/image-20220629171840300.png" alt="image-20220629171840300" loading="lazy"></p>
<p>​        当然，连接查询也算是 SIMPLE 类型，比如：</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql<span class="token operator">></span> <span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> s1 <span class="token keyword">INNER</span> <span class="token keyword">JOIN</span> s2<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><img src="@source/notes/senior_mysql/images/image-20220629171904912.png" alt="image-20220629171904912" loading="lazy"></p>
<ul>
<li>
<p>PRIMARY</p>
<p>对于包含<code v-pre>UNION、UNION ALL</code>或者子查询的大查询来说，它是由几个小查询组成的，其中最左边的那个查询的<code v-pre>select_type</code>的值就是<code v-pre>PRIMARY</code>,比方说：</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql<span class="token operator">></span> <span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> s1 <span class="token keyword">UNION</span> <span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> s2<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><img src="@source/notes/senior_mysql/images/image-20220629171929924.png" alt="image-20220629171929924" loading="lazy"></p>
<p>从结果中可以看到，最左边的小查询<code v-pre>SELECT * FROM s1</code>对应的是执行计划中的第一条记录，它的<code v-pre>select_type</code>的值就是<code v-pre>PRIMARY</code>。</p>
</li>
<li>
<p>UNION</p>
<p>对于包含<code v-pre>UNION</code>或者<code v-pre>UNION ALL</code>的大查询来说，它是由几个小查询组成的，其中除了最左边的那个小查询意外，其余的小查询的<code v-pre>select_type</code>值就是UNION，可以对比上一个例子的效果。</p>
</li>
<li>
<p>UNION RESULT</p>
<p>MySQL 选择使用临时表来完成<code v-pre>UNION</code>查询的去重工作，针对该临时表的查询的<code v-pre>select_type</code>就是<code v-pre>UNION RESULT</code>, 例子上边有。</p>
</li>
<li>
<p>SUBQUERY</p>
<p>如果包含子查询的查询语句不能够转为对应的<code v-pre>semi-join</code>的形式，并且该子查询是不相关子查询，并且查询优化器决定采用将该子查询物化的方案来执行该子查询时，该子查询的第一个<code v-pre>SELECT</code>关键字代表的那个查询的<code v-pre>select_type</code>就是<code v-pre>SUBQUERY</code>，比如下边这个查询：</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql<span class="token operator">></span> <span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> s1 <span class="token keyword">WHERE</span> key1 <span class="token operator">IN</span> <span class="token punctuation">(</span><span class="token keyword">SELECT</span> key1 <span class="token keyword">FROM</span> s2<span class="token punctuation">)</span> <span class="token operator">OR</span> key3 <span class="token operator">=</span> <span class="token string">'a'</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><img src="@source/notes/senior_mysql/images/image-20220629172449267.png" alt="image-20220629172449267" loading="lazy"></p>
</li>
<li>
<p>DEPENDENT SUBQUERY</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql<span class="token operator">></span> <span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> s1 <span class="token keyword">WHERE</span> key1 <span class="token operator">IN</span> <span class="token punctuation">(</span><span class="token keyword">SELECT</span> key1 <span class="token keyword">FROM</span> s2 <span class="token keyword">WHERE</span> s1<span class="token punctuation">.</span>key2 <span class="token operator">=</span> s2<span class="token punctuation">.</span>key2<span class="token punctuation">)</span> <span class="token operator">OR</span> key3 <span class="token operator">=</span> <span class="token string">'a'</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><img src="@source/notes/senior_mysql/images/image-20220629172525236.png" alt="image-20220629172525236" loading="lazy"></p>
</li>
<li>
<p>DEPENDENT UNION</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql<span class="token operator">></span> <span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> s1 <span class="token keyword">WHERE</span> key1 <span class="token operator">IN</span> <span class="token punctuation">(</span><span class="token keyword">SELECT</span> key1 <span class="token keyword">FROM</span> s2 <span class="token keyword">WHERE</span> key1 <span class="token operator">=</span> <span class="token string">'a'</span> <span class="token keyword">UNION</span> <span class="token keyword">SELECT</span> key1 <span class="token keyword">FROM</span> s1 <span class="token keyword">WHERE</span> key1 <span class="token operator">=</span> <span class="token string">'b'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><img src="@source/notes/senior_mysql/images/image-20220629172555603.png" alt="image-20220629172555603" loading="lazy"></p>
</li>
<li>
<p>DERIVED</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql<span class="token operator">></span> <span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> <span class="token punctuation">(</span><span class="token keyword">SELECT</span> key1<span class="token punctuation">,</span> <span class="token function">count</span><span class="token punctuation">(</span><span class="token operator">*</span><span class="token punctuation">)</span> <span class="token keyword">as</span> c <span class="token keyword">FROM</span> s1 <span class="token keyword">GROUP</span> <span class="token keyword">BY</span> key1<span class="token punctuation">)</span> <span class="token keyword">AS</span> derived_s1 <span class="token keyword">where</span> c <span class="token operator">></span> <span class="token number">1</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><img src="@source/notes/senior_mysql/images/image-20220629172622893.png" alt="image-20220629172622893" loading="lazy"></p>
<p>从执行计划中可以看出，id为2的记录就代表子查询的执行方式，它的select_type是DERIVED, 说明该子查询是以物化的方式执行的。id为1的记录代表外层查询，大家注意看它的table列显示的是derived2，表示该查询时针对将派生表物化之后的表进行查询的。</p>
</li>
<li>
<p>MATERIALIZED</p>
<p>当查询优化器在执行包含子查询的语句时，选择将子查询物化之后的外层查询进行连接查询时，该子查询对应的<code v-pre>select_type</code>属性就是DERIVED，比如下边这个查询：</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql<span class="token operator">></span> <span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> s1 <span class="token keyword">WHERE</span> key1 <span class="token operator">IN</span> <span class="token punctuation">(</span><span class="token keyword">SELECT</span> key1 <span class="token keyword">FROM</span> s2<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><img src="@source/notes/senior_mysql/images/image-20220629172646367.png" alt="image-20220629172646367" loading="lazy"></p>
</li>
<li>
<p>UNCACHEABLE SUBQUERY</p>
<p>不常用，就不多说了。</p>
</li>
<li>
<p>UNCACHEABLE UNION</p>
<p>不常用，就不多说了。</p>
</li>
</ul>
<h4 id="_4-partitions-可略" tabindex="-1"><a class="header-anchor" href="#_4-partitions-可略" aria-hidden="true">#</a> 4. partitions (可略)</h4>
<ul>
<li>代表分区表中的命中情况，非分区表，该项为<code v-pre>NULL</code>。一般情况下我们的额查询语句的执行计划的<code v-pre>partitions</code>列的值为<code v-pre>NULL</code>。</li>
<li><a><a href="https://dev.mysql.com/doc/refman/5.7/en/alter-table-partition-operations.html" target="_blank" rel="noopener noreferrer">https://dev.mysql.com/doc/refman/5.7/en/alter-table-partition-operations.html<ExternalLinkIcon/></a></a></li>
<li>如果想详细了解，可以如下方式测试。创建分区表：</li>
</ul>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token comment">-- 创建分区表，</span>
<span class="token comment">-- 按照id分区，id&lt;100 p0分区，其他p1分区</span>
<span class="token keyword">CREATE</span> <span class="token keyword">TABLE</span> user_partitions <span class="token punctuation">(</span>id <span class="token keyword">INT</span> <span class="token keyword">auto_increment</span><span class="token punctuation">,</span>
NAME <span class="token keyword">VARCHAR</span><span class="token punctuation">(</span><span class="token number">12</span><span class="token punctuation">)</span><span class="token punctuation">,</span><span class="token keyword">PRIMARY</span> <span class="token keyword">KEY</span><span class="token punctuation">(</span>id<span class="token punctuation">)</span><span class="token punctuation">)</span>
<span class="token keyword">PARTITION</span> <span class="token keyword">BY</span> RANGE<span class="token punctuation">(</span>id<span class="token punctuation">)</span><span class="token punctuation">(</span>
<span class="token keyword">PARTITION</span> p0 <span class="token keyword">VALUES</span> less than<span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
<span class="token keyword">PARTITION</span> p1 <span class="token keyword">VALUES</span> less than MAXVALUE
<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><img src="@source/notes/senior_mysql/images/image-20220629190304966.png" alt="image-20220629190304966" style="float:left;" />
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token keyword">DESC</span> <span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> user_partitions <span class="token keyword">WHERE</span> id<span class="token operator">></span><span class="token number">200</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>查询id大于200（200&gt;100，p1分区）的记录，查看执行计划，partitions是p1，符合我们的分区规则</p>
<img src="@source/notes/senior_mysql/images/image-20220629190335371.png" alt="image-20220629190335371" style="float:left;" />
<h4 id="_5-type-☆" tabindex="-1"><a class="header-anchor" href="#_5-type-☆" aria-hidden="true">#</a> 5. type ☆</h4>
<p>执行计划的一条记录就代表着MySQL对某个表的 <code v-pre>执行查询时的访问方法</code> , 又称“访问类型”，其中的 <code v-pre>type</code> 列就表明了这个访问方法是啥，是较为重要的一个指标。比如，看到<code v-pre>type</code>列的值是<code v-pre>ref</code>，表明<code v-pre>MySQL</code>即将使用<code v-pre>ref</code>访问方法来执行对<code v-pre>s1</code>表的查询。</p>
<p>完整的访问方法如下： <code v-pre>system ， const ， eq_ref ， ref ， fulltext ， ref_or_null ， index_merge ， unique_subquery ， index_subquery ， range ， index ， ALL</code> 。</p>
<p>我们详细解释一下：</p>
<ul>
<li>
<p><code v-pre>system</code></p>
<p>当表中<code v-pre>只有一条记录</code>并且该表使用的存储引擎的统计数据是精确的，比如MyISAM、Memory，那么对该表的访问方法就是<code v-pre>system</code>。比方说我们新建一个<code v-pre>MyISAM</code>表，并为其插入一条记录：</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql<span class="token operator">></span> <span class="token keyword">CREATE</span> <span class="token keyword">TABLE</span> t<span class="token punctuation">(</span>i <span class="token keyword">int</span><span class="token punctuation">)</span> <span class="token keyword">Engine</span><span class="token operator">=</span>MyISAM<span class="token punctuation">;</span>
Query OK<span class="token punctuation">,</span> <span class="token number">0</span> <span class="token keyword">rows</span> affected <span class="token punctuation">(</span><span class="token number">0.05</span> sec<span class="token punctuation">)</span>

mysql<span class="token operator">></span> <span class="token keyword">INSERT</span> <span class="token keyword">INTO</span> t <span class="token keyword">VALUES</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
Query OK<span class="token punctuation">,</span> <span class="token number">1</span> <span class="token keyword">row</span> affected <span class="token punctuation">(</span><span class="token number">0.01</span> sec<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后我们看一下查询这个表的执行计划：</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql<span class="token operator">></span> <span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> t<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><img src="@source/notes/senior_mysql/images/image-20220630164434315.png" alt="image-20220630164434315" style="float:left;" />
<p>可以看到<code v-pre>type</code>列的值就是<code v-pre>system</code>了，</p>
<blockquote>
<p>测试，可以把表改成使用InnoDB存储引擎，试试看执行计划的<code v-pre>type</code>列是什么。ALL</p>
</blockquote>
</li>
<li>
<p><code v-pre>const</code></p>
<p>当我们根据主键或者唯一二级索引列与常数进行等值匹配时，对单表的访问方法就是<code v-pre>const</code>, 比如：</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql<span class="token operator">></span> <span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> s1 <span class="token keyword">WHERE</span> id <span class="token operator">=</span> <span class="token number">10005</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><img src="@source/notes/senior_mysql/images/image-20220630164724548.png" alt="image-20220630164724548" style="float:left;" />
</li>
<li>
<p><code v-pre>eq_ref</code></p>
<p>在连接查询时，如果被驱动表是通过主键或者唯一二级索引列等值匹配的方式进行访问的（如果该主键或者唯一二级索引是联合索引的话，所有的索引列都必须进行等值比较）。则对该被驱动表的访问方法就是<code v-pre>eq_ref</code>，比方说：</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql<span class="token operator">></span> <span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> s1 <span class="token keyword">INNER</span> <span class="token keyword">JOIN</span> s2 <span class="token keyword">ON</span> s1<span class="token punctuation">.</span>id <span class="token operator">=</span> s2<span class="token punctuation">.</span>id<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><img src="@source/notes/senior_mysql/images/image-20220630164802559.png" alt="image-20220630164802559" style="float:left;" />
<p>从执行计划的结果中可以看出，MySQL打算将s2作为驱动表，s1作为被驱动表，重点关注s1的访问 方法是 <code v-pre>eq_ref</code> ，表明在访问s1表的时候可以 <code v-pre>通过主键的等值匹配</code> 来进行访问。</p>
</li>
<li>
<p><code v-pre>ref</code></p>
<p>当通过普通的二级索引列与常量进行等值匹配时来查询某个表，那么对该表的访问方法就可能是<code v-pre>ref</code>，比方说下边这个查询：</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql<span class="token operator">></span> <span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> s1 <span class="token keyword">WHERE</span> key1 <span class="token operator">=</span> <span class="token string">'a'</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><img src="@source/notes/senior_mysql/images/image-20220630164930020.png" alt="image-20220630164930020" style="float:left;" />
</li>
<li>
<p><code v-pre>fulltext</code></p>
<p>全文索引</p>
</li>
<li>
<p><code v-pre>ref_or_null</code></p>
<p>当对普通二级索引进行等值匹配查询，该索引列的值也可以是<code v-pre>NULL</code>值时，那么对该表的访问方法就可能是<code v-pre>ref_or_null</code>，比如说：</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql<span class="token operator">></span> <span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> s1 <span class="token keyword">WHERE</span> key1 <span class="token operator">=</span> <span class="token string">'a'</span> <span class="token operator">OR</span> key1 <span class="token operator">IS</span> <span class="token boolean">NULL</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><img src="@source/notes/senior_mysql/images/image-20220630175133920.png" alt="image-20220630175133920" style="float:left;" />
</li>
<li>
<p><code v-pre>index_merge</code></p>
<p>一般情况下对于某个表的查询只能使用到一个索引，但单表访问方法时在某些场景下可以使用<code v-pre>Interseation、union、Sort-Union</code>这三种索引合并的方式来执行查询。我们看一下执行计划中是怎么体现MySQL使用索引合并的方式来对某个表执行查询的：</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql<span class="token operator">></span> <span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> s1 <span class="token keyword">WHERE</span> key1 <span class="token operator">=</span> <span class="token string">'a'</span> <span class="token operator">OR</span> key3 <span class="token operator">=</span> <span class="token string">'a'</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><img src="@source/notes/senior_mysql/images/image-20220630175511644.png" alt="image-20220630175511644" style="float:left;" />
<p>从执行计划的 <code v-pre>type</code> 列的值是 <code v-pre>index_merge</code> 就可以看出，MySQL 打算使用索引合并的方式来执行 对 s1 表的查询。</p>
</li>
<li>
<p><code v-pre>unique_subquery</code></p>
<p>类似于两表连接中被驱动表的<code v-pre>eq_ref</code>访问方法，<code v-pre>unique_subquery</code>是针对在一些包含<code v-pre>IN</code>子查询的查询语句中，如果查询优化器决定将<code v-pre>IN</code>子查询转换为<code v-pre>EXISTS</code>子查询，而且子查询可以使用到主键进行等值匹配的话，那么该子查询执行计划的<code v-pre>type</code>列的值就是<code v-pre>unique_subquery</code>，比如下边的这个查询语句：</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql<span class="token operator">></span> <span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> s1 <span class="token keyword">WHERE</span> key2 <span class="token operator">IN</span> <span class="token punctuation">(</span><span class="token keyword">SELECT</span> id <span class="token keyword">FROM</span> s2 <span class="token keyword">where</span> s1<span class="token punctuation">.</span>key1 <span class="token operator">=</span> s2<span class="token punctuation">.</span>key1<span class="token punctuation">)</span> <span class="token operator">OR</span> key3 <span class="token operator">=</span> <span class="token string">'a'</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><img src="@source/notes/senior_mysql/images/image-20220630180123913.png" alt="image-20220630180123913" style="float:left;" />
</li>
</ul>
<ul>
<li>
<p><code v-pre>index_subquery</code></p>
<p><code v-pre>index_subquery</code> 与 <code v-pre>unique_subquery</code> 类似，只不过访问子查询中的表时使用的是普通的索引，比如这样：</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql<span class="token operator">></span> <span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> s1 <span class="token keyword">WHERE</span> common_field <span class="token operator">IN</span> <span class="token punctuation">(</span><span class="token keyword">SELECT</span> key3 <span class="token keyword">FROM</span> s2 <span class="token keyword">where</span> s1<span class="token punctuation">.</span>key1 <span class="token operator">=</span> s2<span class="token punctuation">.</span>key1<span class="token punctuation">)</span> <span class="token operator">OR</span> key3 <span class="token operator">=</span> <span class="token string">'a'</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li>
</ul>
<p><img src="@source/notes/senior_mysql/images/image-20220703214407225.png" alt="image-20220703214407225" loading="lazy"></p>
<ul>
<li>
<p><code v-pre>range</code></p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql<span class="token operator">></span> <span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> s1 <span class="token keyword">WHERE</span> key1 <span class="token operator">IN</span> <span class="token punctuation">(</span><span class="token string">'a'</span><span class="token punctuation">,</span> <span class="token string">'b'</span><span class="token punctuation">,</span> <span class="token string">'c'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><img src="@source/notes/senior_mysql/images/image-20220703214633338.png" alt="image-20220703214633338" loading="lazy"></p>
<p>或者：</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql<span class="token operator">></span> <span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> s1 <span class="token keyword">WHERE</span> key1 <span class="token operator">></span> <span class="token string">'a'</span> <span class="token operator">AND</span> key1 <span class="token operator">&lt;</span> <span class="token string">'b'</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><img src="@source/notes/senior_mysql/images/image-20220703214657251.png" alt="image-20220703214657251" loading="lazy"></p>
</li>
<li>
<p><code v-pre>index</code></p>
<p>当我们可以使用索引覆盖，但需要扫描全部的索引记录时，该表的访问方法就是<code v-pre>index</code>，比如这样：</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql<span class="token operator">></span> <span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> key_part2 <span class="token keyword">FROM</span> s1 <span class="token keyword">WHERE</span> key_part3 <span class="token operator">=</span> <span class="token string">'a'</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><img src="@source/notes/senior_mysql/images/image-20220703214844885.png" alt="image-20220703214844885" loading="lazy"></p>
<p>上述查询中的所有列表中只有key_part2 一个列，而且搜索条件中也只有 key_part3 一个列，这两个列又恰好包含在idx_key_part这个索引中，可是搜索条件key_part3不能直接使用该索引进行<code v-pre>ref</code>和<code v-pre>range</code>方式的访问，只能扫描整个<code v-pre>idx_key_part</code>索引的记录，所以查询计划的<code v-pre>type</code>列的值就是<code v-pre>index</code>。</p>
<blockquote>
<p>再一次强调，对于使用InnoDB存储引擎的表来说，二级索引的记录只包含索引列和主键列的值，而聚簇索引中包含用户定义的全部列以及一些隐藏列，所以扫描二级索引的代价比直接全表扫描，也就是扫描聚簇索引的代价更低一些。</p>
</blockquote>
</li>
<li>
<p><code v-pre>ALL</code></p>
<p>最熟悉的全表扫描，就不多说了，直接看例子：</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql<span class="token operator">></span> <span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> s1<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><img src="@source/notes/senior_mysql/images/image-20220703215958374.png" alt="image-20220703215958374" loading="lazy"></p>
</li>
</ul>
<p>**小结: **</p>
<p>**结果值从最好到最坏依次是： **</p>
<p><strong>system &gt; const &gt; eq_ref &gt; ref</strong> &gt; fulltext &gt; ref_or_null &gt; index_merge &gt; unique_subquery &gt; index_subquery &gt; range &gt; index &gt; ALL</p>
<p><strong>其中比较重要的几个提取出来（见上图中的粗体）。SQL 性能优化的目标：至少要达到 range 级别，要求是 ref 级别，最好是 consts级别。（阿里巴巴 开发手册要求）</strong></p>
<h4 id="_6-possible-keys和key" tabindex="-1"><a class="header-anchor" href="#_6-possible-keys和key" aria-hidden="true">#</a> 6. possible_keys和key</h4>
<p>在EXPLAIN语句输出的执行计划中，<code v-pre>possible_keys</code>列表示在某个查询语句中，对某个列执行<code v-pre>单表查询时可能用到的索引</code>有哪些。一般查询涉及到的字段上若存在索引，则该索引将被列出，但不一定被查询使用。<code v-pre>key</code>列表示<code v-pre>实际用到的索引</code>有哪些，如果为NULL，则没有使用索引。比方说下面这个查询：</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql<span class="token operator">></span> <span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> s1 <span class="token keyword">WHERE</span> key1 <span class="token operator">></span> <span class="token string">'z'</span> <span class="token operator">AND</span> key3 <span class="token operator">=</span> <span class="token string">'a'</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><img src="@source/notes/senior_mysql/images/image-20220703220724964.png" alt="image-20220703220724964" loading="lazy"></p>
<p>上述执行计划的<code v-pre>possible_keys</code>列的值是<code v-pre>idx_key1, idx_key3</code>，表示该查询可能使用到<code v-pre>idx_key1, idx_key3</code>两个索引，然后<code v-pre>key</code>列的值是<code v-pre>idx_key3</code>，表示经过查询优化器计算使用不同索引的成本后，最后决定采用<code v-pre>idx_key3</code>。</p>
<h4 id="_7-key-len-☆" tabindex="-1"><a class="header-anchor" href="#_7-key-len-☆" aria-hidden="true">#</a> 7. key_len ☆</h4>
<p>实际使用到的索引长度 (即：字节数)</p>
<p>帮你检查<code v-pre>是否充分的利用了索引</code>，<code v-pre>值越大越好</code>，主要针对于联合索引，有一定的参考意义。</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql<span class="token operator">></span> <span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> s1 <span class="token keyword">WHERE</span> id <span class="token operator">=</span> <span class="token number">10005</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><img src="@source/notes/senior_mysql/images/image-20220704130030692.png" alt="image-20220704130030692" loading="lazy"></p>
<blockquote>
<p>int 占用 4 个字节</p>
</blockquote>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql<span class="token operator">></span> <span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> s1 <span class="token keyword">WHERE</span> key2 <span class="token operator">=</span> <span class="token number">10126</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><img src="@source/notes/senior_mysql/images/image-20220704130138204.png" alt="image-20220704130138204" loading="lazy"></p>
<blockquote>
<p>key2上有一个唯一性约束，是否为NULL占用一个字节，那么就是5个字节</p>
</blockquote>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql<span class="token operator">></span> <span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> s1 <span class="token keyword">WHERE</span> key1 <span class="token operator">=</span> <span class="token string">'a'</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><img src="@source/notes/senior_mysql/images/image-20220704130214482.png" alt="image-20220704130214482" loading="lazy"></p>
<blockquote>
<p>key1 VARCHAR(100) 一个字符占3个字节，100*3，是否为NULL占用一个字节，varchar的长度信息占两个字节。</p>
</blockquote>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql<span class="token operator">></span> <span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> s1 <span class="token keyword">WHERE</span> key_part1 <span class="token operator">=</span> <span class="token string">'a'</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><img src="@source/notes/senior_mysql/images/image-20220704130442095.png" alt="image-20220704130442095" loading="lazy"></p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql<span class="token operator">></span> <span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> s1 <span class="token keyword">WHERE</span> key_part1 <span class="token operator">=</span> <span class="token string">'a'</span> <span class="token operator">AND</span> key_part2 <span class="token operator">=</span> <span class="token string">'b'</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><img src="@source/notes/senior_mysql/images/image-20220704130515031.png" alt="image-20220704130515031" loading="lazy"></p>
<blockquote>
<p>联合索引中可以比较，key_len=606的好于key_len=303</p>
</blockquote>
<p>**练习： **</p>
<p>key_len的长度计算公式：</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token keyword">varchar</span><span class="token punctuation">(</span><span class="token number">10</span><span class="token punctuation">)</span>变长字段且允许<span class="token boolean">NULL</span> <span class="token operator">=</span> <span class="token number">10</span> <span class="token operator">*</span> <span class="token punctuation">(</span> <span class="token keyword">character</span> <span class="token keyword">set</span>：utf8<span class="token operator">=</span><span class="token number">3</span><span class="token punctuation">,</span>gbk<span class="token operator">=</span><span class="token number">2</span><span class="token punctuation">,</span>latin1<span class="token operator">=</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token operator">+</span><span class="token number">1</span><span class="token punctuation">(</span><span class="token boolean">NULL</span><span class="token punctuation">)</span><span class="token operator">+</span><span class="token number">2</span><span class="token punctuation">(</span>变长字段<span class="token punctuation">)</span>

<span class="token keyword">varchar</span><span class="token punctuation">(</span><span class="token number">10</span><span class="token punctuation">)</span>变长字段且不允许<span class="token boolean">NULL</span> <span class="token operator">=</span> <span class="token number">10</span> <span class="token operator">*</span> <span class="token punctuation">(</span> <span class="token keyword">character</span> <span class="token keyword">set</span>：utf8<span class="token operator">=</span><span class="token number">3</span><span class="token punctuation">,</span>gbk<span class="token operator">=</span><span class="token number">2</span><span class="token punctuation">,</span>latin1<span class="token operator">=</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token operator">+</span><span class="token number">2</span><span class="token punctuation">(</span>变长字段<span class="token punctuation">)</span>

<span class="token keyword">char</span><span class="token punctuation">(</span><span class="token number">10</span><span class="token punctuation">)</span>固定字段且允许<span class="token boolean">NULL</span> <span class="token operator">=</span> <span class="token number">10</span> <span class="token operator">*</span> <span class="token punctuation">(</span> <span class="token keyword">character</span> <span class="token keyword">set</span>：utf8<span class="token operator">=</span><span class="token number">3</span><span class="token punctuation">,</span>gbk<span class="token operator">=</span><span class="token number">2</span><span class="token punctuation">,</span>latin1<span class="token operator">=</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token operator">+</span><span class="token number">1</span><span class="token punctuation">(</span><span class="token boolean">NULL</span><span class="token punctuation">)</span>

<span class="token keyword">char</span><span class="token punctuation">(</span><span class="token number">10</span><span class="token punctuation">)</span>固定字段且不允许<span class="token boolean">NULL</span> <span class="token operator">=</span> <span class="token number">10</span> <span class="token operator">*</span> <span class="token punctuation">(</span> <span class="token keyword">character</span> <span class="token keyword">set</span>：utf8<span class="token operator">=</span><span class="token number">3</span><span class="token punctuation">,</span>gbk<span class="token operator">=</span><span class="token number">2</span><span class="token punctuation">,</span>latin1<span class="token operator">=</span><span class="token number">1</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_8-ref" tabindex="-1"><a class="header-anchor" href="#_8-ref" aria-hidden="true">#</a> 8. ref</h4>
<img src="@source/notes/senior_mysql/images/image-20220704131759630.png" alt="image-20220704131759630" style="float:left;" />
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql<span class="token operator">></span> <span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> s1 <span class="token keyword">WHERE</span> key1 <span class="token operator">=</span> <span class="token string">'a'</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><img src="@source/notes/senior_mysql/images/image-20220704130837498.png" alt="image-20220704130837498" loading="lazy"></p>
<p>可以看到<code v-pre>ref</code>列的值是<code v-pre>const</code>，表明在使用<code v-pre>idx_key1</code>索引执行查询时，与<code v-pre>key1</code>列作等值匹配的对象是一个常数，当然有时候更复杂一点:</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql<span class="token operator">></span> <span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> s1 <span class="token keyword">INNER</span> <span class="token keyword">JOIN</span> s2 <span class="token keyword">ON</span> s1<span class="token punctuation">.</span>id <span class="token operator">=</span> s2<span class="token punctuation">.</span>id<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><img src="@source/notes/senior_mysql/images/image-20220704130925426.png" alt="image-20220704130925426" loading="lazy"></p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql<span class="token operator">></span> <span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> s1 <span class="token keyword">INNER</span> <span class="token keyword">JOIN</span> s2 <span class="token keyword">ON</span> s2<span class="token punctuation">.</span>key1 <span class="token operator">=</span> UPPER<span class="token punctuation">(</span>s1<span class="token punctuation">.</span>key1<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><img src="@source/notes/senior_mysql/images/image-20220704130957359.png" alt="image-20220704130957359" loading="lazy"></p>
<h4 id="_9-rows-☆" tabindex="-1"><a class="header-anchor" href="#_9-rows-☆" aria-hidden="true">#</a> 9. rows ☆</h4>
<p>预估的需要读取的记录条数，<code v-pre>值越小越好</code>。</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql<span class="token operator">></span> <span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> s1 <span class="token keyword">WHERE</span> key1 <span class="token operator">></span> <span class="token string">'z'</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><img src="@source/notes/senior_mysql/images/image-20220704131050496.png" alt="image-20220704131050496" loading="lazy"></p>
<h4 id="_10-filtered" tabindex="-1"><a class="header-anchor" href="#_10-filtered" aria-hidden="true">#</a> 10. filtered</h4>
<p>某个表经过搜索条件过滤后剩余记录条数的百分比</p>
<p>如果使用的是索引执行的单表扫描，那么计算时需要估计出满足除使用到对应索引的搜索条件外的其他搜索条件的记录有多少条。</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql<span class="token operator">></span> <span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> s1 <span class="token keyword">WHERE</span> key1 <span class="token operator">></span> <span class="token string">'z'</span> <span class="token operator">AND</span> common_field <span class="token operator">=</span> <span class="token string">'a'</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><img src="@source/notes/senior_mysql/images/image-20220704131323242.png" alt="image-20220704131323242" loading="lazy"></p>
<p>对于单表查询来说，这个filtered的值没有什么意义，我们<code v-pre>更关注在连接查询中驱动表对应的执行计划记录的filtered值</code>，它决定了被驱动表要执行的次数 (即: rows * filtered)</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql<span class="token operator">></span> <span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> s1 <span class="token keyword">INNER</span> <span class="token keyword">JOIN</span> s2 <span class="token keyword">ON</span> s1<span class="token punctuation">.</span>key1 <span class="token operator">=</span> s2<span class="token punctuation">.</span>key1 <span class="token keyword">WHERE</span> s1<span class="token punctuation">.</span>common_field <span class="token operator">=</span> <span class="token string">'a'</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><img src="@source/notes/senior_mysql/images/image-20220704131644615.png" alt="image-20220704131644615" loading="lazy"></p>
<p>从执行计划中可以看出来，查询优化器打算把<code v-pre>s1</code>作为驱动表，<code v-pre>s2</code>当做被驱动表。我们可以看到驱动表<code v-pre>s1</code>表的执行计划的<code v-pre>rows</code>列为<code v-pre>9688</code>，filtered列为<code v-pre>10.00</code>，这意味着驱动表<code v-pre>s1</code>的扇出值就是<code v-pre>9688 x 10.00% = 968.8</code>，这说明还要对被驱动表执行大约<code v-pre>968</code>次查询。</p>
<h4 id="_11-extra-☆" tabindex="-1"><a class="header-anchor" href="#_11-extra-☆" aria-hidden="true">#</a> 11. Extra ☆</h4>
<p>顾名思义，<code v-pre>Extra</code>列是用来说明一些额外信息的，包含不适合在其他列中显示但十分重要的额外信息。我们可以通过这些额外信息来<code v-pre>更准确的理解MySQL到底将如何执行给定的查询语句</code>。MySQL提供的额外信息有好几十个，我们就不一个一个介绍了，所以我们只挑选比较重要的额外信息介绍给大家。</p>
<ul>
<li>
<p><code v-pre>No tables used</code></p>
<p>当查询语句没有<code v-pre>FROM</code>子句时将会提示该额外信息，比如：</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql<span class="token operator">></span> <span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> <span class="token number">1</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><img src="@source/notes/senior_mysql/images/image-20220704132345383.png" alt="image-20220704132345383" loading="lazy"></p>
</li>
<li>
<p><code v-pre>Impossible WHERE</code></p>
<p>当查询语句的<code v-pre>WHERE</code>子句永远为<code v-pre>FALSE</code>时将会提示该额外信息</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql<span class="token operator">></span> <span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> s1 <span class="token keyword">WHERE</span> <span class="token number">1</span> <span class="token operator">!=</span> <span class="token number">1</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><img src="@source/notes/senior_mysql/images/image-20220704132458978.png" alt="image-20220704132458978" loading="lazy"></p>
</li>
<li>
<p><code v-pre>Using where</code></p>
<img src="@source/notes/senior_mysql/images/image-20220704140148163.png" alt="image-20220704140148163" style="float:left;" />
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql<span class="token operator">></span> <span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> s1 <span class="token keyword">WHERE</span> common_field <span class="token operator">=</span> <span class="token string">'a'</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><img src="@source/notes/senior_mysql/images/image-20220704132655342.png" alt="image-20220704132655342" loading="lazy"></p>
<img src="@source/notes/senior_mysql/images/image-20220704140212813.png" alt="image-20220704140212813" style="float:left;" />
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql<span class="token operator">></span> <span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> s1 <span class="token keyword">WHERE</span> key1 <span class="token operator">=</span> <span class="token string">'a'</span> <span class="token operator">AND</span> common_field <span class="token operator">=</span> <span class="token string">'a'</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><img src="@source/notes/senior_mysql/images/image-20220704133130515.png" alt="image-20220704133130515" loading="lazy"></p>
</li>
<li>
<p><code v-pre>No matching min/max row</code></p>
<p>当查询列表处有<code v-pre>MIN</code>或者<code v-pre>MAX</code>聚合函数，但是并没有符合<code v-pre>WHERE</code>子句中的搜索条件的记录时。</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql<span class="token operator">></span> <span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> <span class="token function">MIN</span><span class="token punctuation">(</span>key1<span class="token punctuation">)</span> <span class="token keyword">FROM</span> s1 <span class="token keyword">WHERE</span> key1 <span class="token operator">=</span> <span class="token string">'abcdefg'</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><img src="@source/notes/senior_mysql/images/image-20220704134324354.png" alt="image-20220704134324354" loading="lazy"></p>
</li>
<li>
<p><code v-pre>Using index</code></p>
<p>当我们的查询列表以及搜索条件中只包含属于某个索引的列，也就是在可以使用覆盖索引的情况下，在<code v-pre>Extra</code>列将会提示该额外信息。比方说下边这个查询中只需要用到<code v-pre>idx_key1</code>而不需要回表操作:</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql<span class="token operator">></span> <span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> key1 <span class="token keyword">FROM</span> s1 <span class="token keyword">WHERE</span> key1 <span class="token operator">=</span> <span class="token string">'a'</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><img src="@source/notes/senior_mysql/images/image-20220704134931220.png" alt="image-20220704134931220" loading="lazy"></p>
</li>
<li>
<p><code v-pre>Using index condition</code></p>
<p>有些搜索条件中虽然出现了索引列，但却不能使用到索引，比如下边这个查询：</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> s1 <span class="token keyword">WHERE</span> key1 <span class="token operator">></span> <span class="token string">'z'</span> <span class="token operator">AND</span> key1 <span class="token operator">LIKE</span> <span class="token string">'%a'</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><img src="@source/notes/senior_mysql/images/image-20220704140344015.png" alt="image-20220704140344015" style="float:left;" />
<img src="@source/notes/senior_mysql/images/image-20220704140411033.png" alt="image-20220704140411033" style="float:left;" />
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql<span class="token operator">></span> <span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> s1 <span class="token keyword">WHERE</span> key1 <span class="token operator">></span> <span class="token string">'z'</span> <span class="token operator">AND</span> key1 <span class="token operator">LIKE</span> <span class="token string">'%b'</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><img src="@source/notes/senior_mysql/images/image-20220704140441702.png" alt="image-20220704140441702" loading="lazy"></p>
</li>
<li>
<p><code v-pre>Using join buffer (Block Nested Loop)</code></p>
<p>在连接查询执行过程中，当被驱动表不能有效的利用索引加快访问速度，MySQL一般会为其分配一块名叫<code v-pre>join buffer</code>的内存块来加快查询速度，也就是我们所讲的<code v-pre>基于块的嵌套循环算法</code>。</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql<span class="token operator">></span> <span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> s1 <span class="token keyword">INNER</span> <span class="token keyword">JOIN</span> s2 <span class="token keyword">ON</span> s1<span class="token punctuation">.</span>common_field <span class="token operator">=</span> s2<span class="token punctuation">.</span>common_field<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><img src="@source/notes/senior_mysql/images/image-20220704140815955.png" alt="image-20220704140815955" loading="lazy"></p>
</li>
<li>
<p><code v-pre>Not exists</code></p>
<p>当我们使用左(外)连接时，如果<code v-pre>WHERE</code>子句中包含要求被驱动表的某个列等于<code v-pre>NULL</code>值的搜索条件，而且那个列是不允许存储<code v-pre>NULL</code>值的，那么在该表的执行计划的Extra列就会提示这个信息：</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql<span class="token operator">></span> <span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> s1 <span class="token keyword">LEFT</span> <span class="token keyword">JOIN</span> s2 <span class="token keyword">ON</span> s1<span class="token punctuation">.</span>key1 <span class="token operator">=</span> s2<span class="token punctuation">.</span>key1 <span class="token keyword">WHERE</span> s2<span class="token punctuation">.</span>id <span class="token operator">IS</span> <span class="token boolean">NULL</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><img src="@source/notes/senior_mysql/images/image-20220704142059555.png" alt="image-20220704142059555" loading="lazy"></p>
</li>
<li>
<p><code v-pre>Using intersect(...) 、 Using union(...) 和 Using sort_union(...)</code></p>
<p>如果执行计划的<code v-pre>Extra</code>列出现了<code v-pre>Using intersect(...)</code>提示，说明准备使用<code v-pre>Intersect</code>索引合并的方式执行查询，括号中的<code v-pre>...</code>表示需要进行索引合并的索引名称；</p>
<p>如果出现<code v-pre>Using union(...)</code>提示，说明准备使用<code v-pre>Union</code>索引合并的方式执行查询;</p>
<p>如果出现<code v-pre>Using sort_union(...)</code>提示，说明准备使用<code v-pre>Sort-Union</code>索引合并的方式执行查询。</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql<span class="token operator">></span> <span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> s1 <span class="token keyword">WHERE</span> key1 <span class="token operator">=</span> <span class="token string">'a'</span> <span class="token operator">OR</span> key3 <span class="token operator">=</span> <span class="token string">'a'</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><img src="@source/notes/senior_mysql/images/image-20220704142552890.png" alt="image-20220704142552890" loading="lazy"></p>
</li>
<li>
<p><code v-pre>Zero limit</code></p>
<p>当我们的<code v-pre>LIMIT</code>子句的参数为<code v-pre>0</code>时，表示压根儿不打算从表中读取任何记录，将会提示该额外信息</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql<span class="token operator">></span> <span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> s1 <span class="token keyword">LIMIT</span> <span class="token number">0</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><img src="@source/notes/senior_mysql/images/image-20220704142754394.png" alt="image-20220704142754394" loading="lazy"></p>
</li>
<li>
<p><code v-pre>Using filesort</code></p>
<p>有一些情况下对结果集中的记录进行排序是可以使用到索引的。</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql<span class="token operator">></span> <span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> s1 <span class="token keyword">ORDER</span> <span class="token keyword">BY</span> key1 <span class="token keyword">LIMIT</span> <span class="token number">10</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><img src="@source/notes/senior_mysql/images/image-20220704142901857.png" alt="image-20220704142901857" loading="lazy"></p>
<img src="@source/notes/senior_mysql/images/image-20220704145143170.png" alt="image-20220704145143170" style="float:left;" />
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql<span class="token operator">></span> <span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> s1 <span class="token keyword">ORDER</span> <span class="token keyword">BY</span> common_field <span class="token keyword">LIMIT</span> <span class="token number">10</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><img src="@source/notes/senior_mysql/images/image-20220704143518857.png" alt="image-20220704143518857" loading="lazy"></p>
<p>需要注意的是，如果查询中需要使用<code v-pre>filesort</code>的方式进行排序的记录非常多，那么这个过程是很耗费性能的，我们最好想办法<code v-pre>将使用文件排序的执行方式改为索引进行排序</code>。</p>
</li>
<li>
<p><code v-pre>Using temporary</code></p>
<img src="@source/notes/senior_mysql/images/image-20220704145924130.png" alt="image-20220704145924130" style="float:left;" />
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql<span class="token operator">></span> <span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> <span class="token keyword">DISTINCT</span> common_field <span class="token keyword">FROM</span> s1<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><img src="@source/notes/senior_mysql/images/image-20220704150030005.png" alt="image-20220704150030005" loading="lazy"></p>
<p>再比如：</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql<span class="token operator">></span> <span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> common_field<span class="token punctuation">,</span> <span class="token function">COUNT</span><span class="token punctuation">(</span><span class="token operator">*</span><span class="token punctuation">)</span> <span class="token keyword">AS</span> amount <span class="token keyword">FROM</span> s1 <span class="token keyword">GROUP</span> <span class="token keyword">BY</span> common_field<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><img src="@source/notes/senior_mysql/images/image-20220704150156416.png" alt="image-20220704150156416" loading="lazy"></p>
<p>执行计划中出现<code v-pre>Using temporary</code>并不是一个好的征兆，因为建立与维护临时表要付出很大的成本的，所以我们<code v-pre>最好能使用索引来替代掉使用临时表</code>，比方说下边这个包含<code v-pre>GROUP BY</code>子句的查询就不需要使用临时表：</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql<span class="token operator">></span> <span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> key1<span class="token punctuation">,</span> <span class="token function">COUNT</span><span class="token punctuation">(</span><span class="token operator">*</span><span class="token punctuation">)</span> <span class="token keyword">AS</span> amount <span class="token keyword">FROM</span> s1 <span class="token keyword">GROUP</span> <span class="token keyword">BY</span> key1<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><img src="@source/notes/senior_mysql/images/image-20220704150308189.png" alt="image-20220704150308189" loading="lazy"></p>
<p>从 <code v-pre>Extra</code> 的 <code v-pre>Using index</code> 的提示里我们可以看出，上述查询只需要扫描 <code v-pre>idx_key1</code> 索引就可以搞 定了，不再需要临时表了。</p>
</li>
<li>
<p>其他</p>
<p>其它特殊情况这里省略。</p>
</li>
</ul>
<h4 id="_12-小结" tabindex="-1"><a class="header-anchor" href="#_12-小结" aria-hidden="true">#</a> 12. 小结</h4>
<ul>
<li>EXPLAIN不考虑各种Cache</li>
<li>EXPLAIN不能显示MySQL在执行查询时所作的优化工作</li>
<li>EXPLAIN不会告诉你关于触发器、存储过程的信息或用户自定义函数对查询的影响情况</li>
<li>部分统计信息是估算的，并非精确值</li>
</ul>
<h2 id="_7-explain的进一步使用" tabindex="-1"><a class="header-anchor" href="#_7-explain的进一步使用" aria-hidden="true">#</a> 7. EXPLAIN的进一步使用</h2>
<h3 id="_7-1-explain四种输出格式" tabindex="-1"><a class="header-anchor" href="#_7-1-explain四种输出格式" aria-hidden="true">#</a> 7.1 EXPLAIN四种输出格式</h3>
<p>这里谈谈EXPLAIN的输出格式。EXPLAIN可以输出四种格式： <code v-pre>传统格式</code> ，<code v-pre>JSON格式</code> ， <code v-pre>TREE格式</code> 以及 <code v-pre>可视化输出</code> 。用户可以根据需要选择适用于自己的格式。</p>
<h4 id="_1-传统格式" tabindex="-1"><a class="header-anchor" href="#_1-传统格式" aria-hidden="true">#</a> 1. 传统格式</h4>
<p>传统格式简单明了，输出是一个表格形式，概要说明查询计划。</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql<span class="token operator">></span> <span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> s1<span class="token punctuation">.</span>key1<span class="token punctuation">,</span> s2<span class="token punctuation">.</span>key1 <span class="token keyword">FROM</span> s1 <span class="token keyword">LEFT</span> <span class="token keyword">JOIN</span> s2 <span class="token keyword">ON</span> s1<span class="token punctuation">.</span>key1 <span class="token operator">=</span> s2<span class="token punctuation">.</span>key1 <span class="token keyword">WHERE</span> s2<span class="token punctuation">.</span>common_field <span class="token operator">IS</span> <span class="token operator">NOT</span> <span class="token boolean">NULL</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><img src="@source/notes/senior_mysql/images/image-20220704161702384.png" alt="image-20220704161702384" loading="lazy"></p>
<h4 id="_2-json格式" tabindex="-1"><a class="header-anchor" href="#_2-json格式" aria-hidden="true">#</a> 2. JSON格式</h4>
<p>第1种格式中介绍的<code v-pre>EXPLAIN</code>语句输出中缺少了一个衡量执行好坏的重要属性 —— <code v-pre>成本</code>。而JSON格式是四种格式里面输出<code v-pre>信息最详尽</code>的格式，里面包含了执行的成本信息。</p>
<ul>
<li>JSON格式：在EXPLAIN单词和真正的查询语句中间加上 FORMAT=JSON 。</li>
</ul>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token keyword">EXPLAIN</span> FORMAT<span class="token operator">=</span>JSON <span class="token keyword">SELECT</span> <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul>
<li>EXPLAIN的Column与JSON的对应关系：(来源于MySQL 5.7文档)</li>
</ul>
<p><img src="@source/notes/senior_mysql/images/image-20220704164236909.png" alt="image-20220704164236909" loading="lazy"></p>
<p>这样我们就可以得到一个json格式的执行计划，里面包含该计划花费的成本。比如这样：</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql<span class="token operator">></span> <span class="token keyword">EXPLAIN</span> FORMAT<span class="token operator">=</span>JSON <span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> s1 <span class="token keyword">INNER</span> <span class="token keyword">JOIN</span> s2 <span class="token keyword">ON</span> s1<span class="token punctuation">.</span>key1 <span class="token operator">=</span> s2<span class="token punctuation">.</span>key2 <span class="token keyword">WHERE</span> s1<span class="token punctuation">.</span>common_field <span class="token operator">=</span> <span class="token string">'a'</span>\G
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><img src="@source/notes/senior_mysql/images/image-20220704172833362.png" alt="image-20220704172833362" loading="lazy"></p>
<p><img src="@source/notes/senior_mysql/images/image-20220704172920158.png" alt="image-20220704172920158" loading="lazy"></p>
<p><img src="@source/notes/senior_mysql/images/image-20220704173012413.png" alt="image-20220704173012413" loading="lazy"></p>
<p><img src="@source/notes/senior_mysql/images/image-20220704173045190.png" alt="image-20220704173045190" loading="lazy"></p>
<p><img src="@source/notes/senior_mysql/images/image-20220704173108888.png" alt="image-20220704173108888" loading="lazy"></p>
<p>我们使用 # 后边跟随注释的形式为大家解释了 <code v-pre>EXPLAIN FORMAT=JSON</code> 语句的输出内容，但是大家可能 有疑问 &quot;<code v-pre>cost_info</code>&quot; 里边的成本看着怪怪的，它们是怎么计算出来的？先看 s1 表的 &quot;<code v-pre>cost_info</code>&quot; 部 分：</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>"cost_info": {
    "read_cost": "1840.84",
    "eval_cost": "193.76",
    "prefix_cost": "2034.60",
    "data_read_per_join": "1M"
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>
<p><code v-pre>read_cost</code> 是由下边这两部分组成的：</p>
<ul>
<li>IO 成本</li>
<li>检测 rows × (1 - filter) 条记录的 CPU 成本</li>
</ul>
<blockquote>
<p>小贴士： rows和filter都是我们前边介绍执行计划的输出列，在JSON格式的执行计划中，rows 相当于rows_examined_per_scan，filtered名称不变。</p>
</blockquote>
</li>
</ul>
<ul>
<li>
<p><code v-pre>eval_cost</code> 是这样计算的：</p>
<p>检测 rows × filter 条记录的成本。</p>
</li>
<li>
<p><code v-pre>prefix_cost</code> 就是单独查询 s1 表的成本，也就是：</p>
<p><code v-pre>read_cost + eval_cost</code></p>
</li>
<li>
<p><code v-pre>data_read_per_join</code> 表示在此次查询中需要读取的数据量。</p>
</li>
</ul>
<p>对于 <code v-pre>s2</code> 表的 &quot;<code v-pre>cost_info</code>&quot; 部分是这样的：</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>"cost_info": {
    "read_cost": "968.80",
    "eval_cost": "193.76",
    "prefix_cost": "3197.16",
    "data_read_per_join": "1M"
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>由于 <code v-pre>s2</code> 表是被驱动表，所以可能被读取多次，这里的<code v-pre>read_cost</code> 和 <code v-pre>eval_cost</code> 是访问多次 <code v-pre>s2</code> 表后累加起来的值，大家主要关注里边儿的 <code v-pre>prefix_cost</code> 的值代表的是整个连接查询预计的成本，也就是单次查询 <code v-pre>s1</code> 表和多次查询 <code v-pre>s2</code> 表后的成本的和，也就是：</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>968.80 + 193.76 + 2034.60 = 3197.16
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="_3-tree格式" tabindex="-1"><a class="header-anchor" href="#_3-tree格式" aria-hidden="true">#</a> 3. TREE格式</h4>
<p>TREE格式是8.0.16版本之后引入的新格式，主要根据查询的 <code v-pre>各个部分之间的关系</code> 和 <code v-pre>各部分的执行顺序</code> 来描述如何查询。</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql<span class="token operator">></span> <span class="token keyword">EXPLAIN</span> FORMAT<span class="token operator">=</span>tree <span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> s1 <span class="token keyword">INNER</span> <span class="token keyword">JOIN</span> s2 <span class="token keyword">ON</span> s1<span class="token punctuation">.</span>key1 <span class="token operator">=</span> s2<span class="token punctuation">.</span>key2 <span class="token keyword">WHERE</span>
s1<span class="token punctuation">.</span>common_field <span class="token operator">=</span> <span class="token string">'a'</span>\G
<span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span> <span class="token number">1.</span> <span class="token keyword">row</span> <span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span>
<span class="token keyword">EXPLAIN</span>: <span class="token operator">-</span><span class="token operator">></span> Nested <span class="token keyword">loop</span> <span class="token keyword">inner</span> <span class="token keyword">join</span> <span class="token punctuation">(</span>cost<span class="token operator">=</span><span class="token number">1360.08</span> <span class="token keyword">rows</span><span class="token operator">=</span><span class="token number">990</span><span class="token punctuation">)</span>
<span class="token operator">-</span><span class="token operator">></span> Filter: <span class="token punctuation">(</span><span class="token punctuation">(</span>s1<span class="token punctuation">.</span>common_field <span class="token operator">=</span> <span class="token string">'a'</span><span class="token punctuation">)</span> <span class="token operator">and</span> <span class="token punctuation">(</span>s1<span class="token punctuation">.</span>key1 <span class="token operator">is</span> <span class="token operator">not</span> <span class="token boolean">null</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">(</span>cost<span class="token operator">=</span><span class="token number">1013.75</span>
<span class="token keyword">rows</span><span class="token operator">=</span><span class="token number">990</span><span class="token punctuation">)</span>
<span class="token operator">-</span><span class="token operator">></span> <span class="token keyword">Table</span> scan <span class="token keyword">on</span> s1 <span class="token punctuation">(</span>cost<span class="token operator">=</span><span class="token number">1013.75</span> <span class="token keyword">rows</span><span class="token operator">=</span><span class="token number">9895</span><span class="token punctuation">)</span>
<span class="token operator">-</span><span class="token operator">></span> Single<span class="token operator">-</span><span class="token keyword">row</span> <span class="token keyword">index</span> lookup <span class="token keyword">on</span> s2 <span class="token keyword">using</span> idx_key2 <span class="token punctuation">(</span>key2<span class="token operator">=</span>s1<span class="token punctuation">.</span>key1<span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token keyword">with</span> <span class="token keyword">index</span>
condition: <span class="token punctuation">(</span>cast<span class="token punctuation">(</span>s1<span class="token punctuation">.</span>key1 <span class="token keyword">as</span> <span class="token keyword">double</span><span class="token punctuation">)</span> <span class="token operator">=</span> cast<span class="token punctuation">(</span>s2<span class="token punctuation">.</span>key2 <span class="token keyword">as</span> <span class="token keyword">double</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">(</span>cost<span class="token operator">=</span><span class="token number">0.25</span> <span class="token keyword">rows</span><span class="token operator">=</span><span class="token number">1</span><span class="token punctuation">)</span>
<span class="token number">1</span> <span class="token keyword">row</span> <span class="token operator">in</span> <span class="token keyword">set</span><span class="token punctuation">,</span> <span class="token number">1</span> warning <span class="token punctuation">(</span><span class="token number">0.00</span> sec<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_4-可视化输出" tabindex="-1"><a class="header-anchor" href="#_4-可视化输出" aria-hidden="true">#</a> 4. 可视化输出</h4>
<p>可视化输出，可以通过MySQL Workbench可视化查看MySQL的执行计划。通过点击Workbench的放大镜图标，即可生成可视化的查询计划。</p>
<p><img src="@source/notes/senior_mysql/images/image-20220704174401970.png" alt="image-20220704174401970" loading="lazy"></p>
<p>上图按从左到右的连接顺序显示表。红色框表示 <code v-pre>全表扫描</code> ，而绿色框表示使用 <code v-pre>索引查找</code> 。对于每个表， 显示使用的索引。还要注意的是，每个表格的框上方是每个表访问所发现的行数的估计值以及访问该表的成本。</p>
<h3 id="_7-2-show-warnings的使用" tabindex="-1"><a class="header-anchor" href="#_7-2-show-warnings的使用" aria-hidden="true">#</a> 7.2 SHOW WARNINGS的使用</h3>
<p>在我们使用<code v-pre>EXPLAIN</code>语句查看了某个查询的执行计划后，紧接着还可以使用<code v-pre>SHOW WARNINGS</code>语句查看与这个查询的执行计划有关的一些扩展信息，比如这样：</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql<span class="token operator">></span> <span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> s1<span class="token punctuation">.</span>key1<span class="token punctuation">,</span> s2<span class="token punctuation">.</span>key1 <span class="token keyword">FROM</span> s1 <span class="token keyword">LEFT</span> <span class="token keyword">JOIN</span> s2 <span class="token keyword">ON</span> s1<span class="token punctuation">.</span>key1 <span class="token operator">=</span> s2<span class="token punctuation">.</span>key1 <span class="token keyword">WHERE</span> s2<span class="token punctuation">.</span>common_field <span class="token operator">IS</span> <span class="token operator">NOT</span> <span class="token boolean">NULL</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><img src="@source/notes/senior_mysql/images/image-20220704174543663.png" alt="image-20220704174543663" loading="lazy"></p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code>mysql<span class="token operator">></span> <span class="token keyword">SHOW</span> <span class="token keyword">WARNINGS</span>\G
<span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span> <span class="token number">1.</span> <span class="token keyword">row</span> <span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span>
    <span class="token keyword">Level</span>: Note
     Code: <span class="token number">1003</span>
Message: <span class="token comment">/* select#1 */</span> <span class="token keyword">select</span> <span class="token identifier"><span class="token punctuation">`</span>atguigu<span class="token punctuation">`</span></span><span class="token punctuation">.</span><span class="token identifier"><span class="token punctuation">`</span>s1<span class="token punctuation">`</span></span><span class="token punctuation">.</span><span class="token identifier"><span class="token punctuation">`</span>key1<span class="token punctuation">`</span></span> <span class="token keyword">AS</span> <span class="token identifier"><span class="token punctuation">`</span>key1<span class="token punctuation">`</span></span><span class="token punctuation">,</span><span class="token identifier"><span class="token punctuation">`</span>atguigu<span class="token punctuation">`</span></span><span class="token punctuation">.</span><span class="token identifier"><span class="token punctuation">`</span>s2<span class="token punctuation">`</span></span><span class="token punctuation">.</span><span class="token identifier"><span class="token punctuation">`</span>key1<span class="token punctuation">`</span></span>
<span class="token keyword">AS</span> <span class="token identifier"><span class="token punctuation">`</span>key1<span class="token punctuation">`</span></span> <span class="token keyword">from</span> <span class="token identifier"><span class="token punctuation">`</span>atguigu<span class="token punctuation">`</span></span><span class="token punctuation">.</span><span class="token identifier"><span class="token punctuation">`</span>s1<span class="token punctuation">`</span></span> <span class="token keyword">join</span> <span class="token identifier"><span class="token punctuation">`</span>atguigu<span class="token punctuation">`</span></span><span class="token punctuation">.</span><span class="token identifier"><span class="token punctuation">`</span>s2<span class="token punctuation">`</span></span> <span class="token keyword">where</span> <span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token identifier"><span class="token punctuation">`</span>atguigu<span class="token punctuation">`</span></span><span class="token punctuation">.</span><span class="token identifier"><span class="token punctuation">`</span>s1<span class="token punctuation">`</span></span><span class="token punctuation">.</span><span class="token identifier"><span class="token punctuation">`</span>key1<span class="token punctuation">`</span></span> <span class="token operator">=</span>
<span class="token identifier"><span class="token punctuation">`</span>atguigu<span class="token punctuation">`</span></span><span class="token punctuation">.</span><span class="token identifier"><span class="token punctuation">`</span>s2<span class="token punctuation">`</span></span><span class="token punctuation">.</span><span class="token identifier"><span class="token punctuation">`</span>key1<span class="token punctuation">`</span></span><span class="token punctuation">)</span> <span class="token operator">and</span> <span class="token punctuation">(</span><span class="token identifier"><span class="token punctuation">`</span>atguigu<span class="token punctuation">`</span></span><span class="token punctuation">.</span><span class="token identifier"><span class="token punctuation">`</span>s2<span class="token punctuation">`</span></span><span class="token punctuation">.</span><span class="token identifier"><span class="token punctuation">`</span>common_field<span class="token punctuation">`</span></span> <span class="token operator">is</span> <span class="token operator">not</span> <span class="token boolean">null</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
<span class="token number">1</span> <span class="token keyword">row</span> <span class="token operator">in</span> <span class="token keyword">set</span> <span class="token punctuation">(</span><span class="token number">0.00</span> sec<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>大家可以看到<code v-pre>SHOW WARNINGS</code>展示出来的信息有三个字段，分别是<code v-pre>Level、Code、Message</code>。我们最常见的就是Code为1003的信息，当Code值为1003时，<code v-pre>Message</code>字段展示的信息类似于查询优化器将我们的查询语句重写后的语句。比如我们上边的查询本来是一个左(外)连接查询，但是有一个s2.common_field IS NOT NULL的条件，这就会导致查询优化器把左(外)连接查询优化为内连接查询，从<code v-pre>SHOW WARNINGS</code>的<code v-pre>Message</code>字段也可以看出来，原本的LEFE JOIN已经变成了JOIN。</p>
<p>但是大家一定要注意，我们说<code v-pre>Message</code>字段展示的信息类似于查询优化器将我们的查询语句<code v-pre>重写后的语句</code>，并不是等价于，也就是说<code v-pre>Message</code>字段展示的信息并不是标准的查询语句，在很多情况下并不能直接拿到黑框框中运行，它只能作为帮助我们理解MySQL将如何执行查询语句的一个参考依据而已。</p>
<h2 id="_8-分析优化器执行计划-trace" tabindex="-1"><a class="header-anchor" href="#_8-分析优化器执行计划-trace" aria-hidden="true">#</a> 8. 分析优化器执行计划：trace</h2>
<img src="@source/notes/senior_mysql/images/image-20220704175711800.png" alt="image-20220704175711800" style="float:left;" />
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token keyword">SET</span> optimizer_trace<span class="token operator">=</span><span class="token string">"enabled=on"</span><span class="token punctuation">,</span>end_markers_in_json<span class="token operator">=</span><span class="token keyword">on</span><span class="token punctuation">;</span>
<span class="token keyword">set</span> optimizer_trace_max_mem_size<span class="token operator">=</span><span class="token number">1000000</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>开启后，可分析如下语句：</p>
<ul>
<li>SELECT</li>
<li>INSERT</li>
<li>REPLACE</li>
<li>UPDATE</li>
<li>DELETE</li>
<li>EXPLAIN</li>
<li>SET</li>
<li>DECLARE</li>
<li>CASE</li>
<li>IF</li>
<li>RETURN</li>
<li>CALL</li>
</ul>
<p>测试：执行如下SQL语句</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token keyword">select</span> <span class="token operator">*</span> <span class="token keyword">from</span> student <span class="token keyword">where</span> id <span class="token operator">&lt;</span> <span class="token number">10</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>最后， 查询 information_schema.optimizer_trace 就可以知道MySQL是如何执行SQL的 ：</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token keyword">select</span> <span class="token operator">*</span> <span class="token keyword">from</span> information_schema<span class="token punctuation">.</span>optimizer_trace\G
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span> <span class="token number">1.</span> <span class="token keyword">row</span> <span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span><span class="token operator">*</span>
<span class="token comment">//第1部分：查询语句</span>
QUERY: <span class="token keyword">select</span> <span class="token operator">*</span> <span class="token keyword">from</span> student <span class="token keyword">where</span> id <span class="token operator">&lt;</span> <span class="token number">10</span>
<span class="token comment">//第2部分：QUERY字段对应语句的跟踪信息</span>
TRACE: {
<span class="token string">"steps"</span>: <span class="token punctuation">[</span>
{
    <span class="token string">"join_preparation"</span>: { <span class="token comment">//预备工作</span>
        <span class="token string">"select#"</span>: <span class="token number">1</span><span class="token punctuation">,</span>
        <span class="token string">"steps"</span>: <span class="token punctuation">[</span>
            {
            <span class="token string">"expanded_query"</span>: <span class="token string">"/* select#1 */ select `student`.`id` AS
            `id`,`student`.`stuno` AS `stuno`,`student`.`name` AS `name`,`student`.`age` AS
            `age`,`student`.`classId` AS `classId` from `student` where (`student`.`id` &lt; 10)"</span>
            }
        <span class="token punctuation">]</span> <span class="token comment">/* steps */</span>
    } <span class="token comment">/* join_preparation */</span>
}<span class="token punctuation">,</span>
{
    <span class="token string">"join_optimization"</span>: { <span class="token comment">//进行优化</span>
    <span class="token string">"select#"</span>: <span class="token number">1</span><span class="token punctuation">,</span>
    <span class="token string">"steps"</span>: <span class="token punctuation">[</span>
        {
        <span class="token string">"condition_processing"</span>: { <span class="token comment">//条件处理</span>
        <span class="token string">"condition"</span>: <span class="token string">"WHERE"</span><span class="token punctuation">,</span>
        <span class="token string">"original_condition"</span>: <span class="token string">"(`student`.`id` &lt; 10)"</span><span class="token punctuation">,</span>
        <span class="token string">"steps"</span>: <span class="token punctuation">[</span>
        {
            <span class="token string">"transformation"</span>: <span class="token string">"equality_propagation"</span><span class="token punctuation">,</span>
            <span class="token string">"resulting_condition"</span>: <span class="token string">"(`student`.`id` &lt; 10)"</span>
        }<span class="token punctuation">,</span>
        {
            <span class="token string">"transformation"</span>: <span class="token string">"constant_propagation"</span><span class="token punctuation">,</span>
            <span class="token string">"resulting_condition"</span>: <span class="token string">"(`student`.`id` &lt; 10)"</span>
        }<span class="token punctuation">,</span>
        {
            <span class="token string">"transformation"</span>: <span class="token string">"trivial_condition_removal"</span><span class="token punctuation">,</span>
            <span class="token string">"resulting_condition"</span>: <span class="token string">"(`student`.`id` &lt; 10)"</span>
        }
        <span class="token punctuation">]</span> <span class="token comment">/* steps */</span>
    } <span class="token comment">/* condition_processing */</span>
    }<span class="token punctuation">,</span>
    {
        <span class="token string">"substitute_generated_columns"</span>: { <span class="token comment">//替换生成的列</span>
        } <span class="token comment">/* substitute_generated_columns */</span>
    }<span class="token punctuation">,</span>
    {
        <span class="token string">"table_dependencies"</span>: <span class="token punctuation">[</span> <span class="token comment">//表的依赖关系</span>
        {
            <span class="token string">"table"</span>: <span class="token string">"`student`"</span><span class="token punctuation">,</span>
            <span class="token string">"row_may_be_null"</span>: <span class="token boolean">false</span><span class="token punctuation">,</span>
            <span class="token string">"map_bit"</span>: <span class="token number">0</span><span class="token punctuation">,</span>
            <span class="token string">"depends_on_map_bits"</span>: <span class="token punctuation">[</span>
            <span class="token punctuation">]</span> <span class="token comment">/* depends_on_map_bits */</span>
        }
    <span class="token punctuation">]</span> <span class="token comment">/* table_dependencies */</span>
    }<span class="token punctuation">,</span>
    {
    <span class="token string">"ref_optimizer_key_uses"</span>: <span class="token punctuation">[</span> <span class="token comment">//使用键</span>
        <span class="token punctuation">]</span> <span class="token comment">/* ref_optimizer_key_uses */</span>
        }<span class="token punctuation">,</span>
    {
        <span class="token string">"rows_estimation"</span>: <span class="token punctuation">[</span> <span class="token comment">//行判断</span>
        {
            <span class="token string">"table"</span>: <span class="token string">"`student`"</span><span class="token punctuation">,</span>
            <span class="token string">"range_analysis"</span>: {
                <span class="token string">"table_scan"</span>: {
                    <span class="token string">"rows"</span>: <span class="token number">3973767</span><span class="token punctuation">,</span>
                    <span class="token string">"cost"</span>: <span class="token number">408558</span>
            } <span class="token comment">/* table_scan */</span><span class="token punctuation">,</span> <span class="token comment">//扫描表</span>
            <span class="token string">"potential_range_indexes"</span>: <span class="token punctuation">[</span> <span class="token comment">//潜在的范围索引</span>
                {
                    <span class="token string">"index"</span>: <span class="token string">"PRIMARY"</span><span class="token punctuation">,</span>
                    <span class="token string">"usable"</span>: <span class="token boolean">true</span><span class="token punctuation">,</span>
                    <span class="token string">"key_parts"</span>: <span class="token punctuation">[</span>
                    <span class="token string">"id"</span>
                    <span class="token punctuation">]</span> <span class="token comment">/* key_parts */</span>
                }
            <span class="token punctuation">]</span> <span class="token comment">/* potential_range_indexes */</span><span class="token punctuation">,</span>
        <span class="token string">"setup_range_conditions"</span>: <span class="token punctuation">[</span> <span class="token comment">//设置范围条件</span>
        <span class="token punctuation">]</span> <span class="token comment">/* setup_range_conditions */</span><span class="token punctuation">,</span>
        <span class="token string">"group_index_range"</span>: {
            <span class="token string">"chosen"</span>: <span class="token boolean">false</span><span class="token punctuation">,</span>
            <span class="token string">"cause"</span>: <span class="token string">"not_group_by_or_distinct"</span>
        } <span class="token comment">/* group_index_range */</span><span class="token punctuation">,</span>
            <span class="token string">"skip_scan_range"</span>: {
                <span class="token string">"potential_skip_scan_indexes"</span>: <span class="token punctuation">[</span>
                    {
                        <span class="token string">"index"</span>: <span class="token string">"PRIMARY"</span><span class="token punctuation">,</span>
                        <span class="token string">"usable"</span>: <span class="token boolean">false</span><span class="token punctuation">,</span>
                        <span class="token string">"cause"</span>: <span class="token string">"query_references_nonkey_column"</span>
                    }
                <span class="token punctuation">]</span> <span class="token comment">/* potential_skip_scan_indexes */</span>
            } <span class="token comment">/* skip_scan_range */</span><span class="token punctuation">,</span>
        <span class="token string">"analyzing_range_alternatives"</span>: { <span class="token comment">//分析范围选项</span>
            <span class="token string">"range_scan_alternatives"</span>: <span class="token punctuation">[</span>
                {
                <span class="token string">"index"</span>: <span class="token string">"PRIMARY"</span><span class="token punctuation">,</span>
                    <span class="token string">"ranges"</span>: <span class="token punctuation">[</span>
                        <span class="token string">"id &lt; 10"</span>
                    <span class="token punctuation">]</span> <span class="token comment">/* ranges */</span><span class="token punctuation">,</span>
                <span class="token string">"index_dives_for_eq_ranges"</span>: <span class="token boolean">true</span><span class="token punctuation">,</span>
                <span class="token string">"rowid_ordered"</span>: <span class="token boolean">true</span><span class="token punctuation">,</span>
                <span class="token string">"using_mrr"</span>: <span class="token boolean">false</span><span class="token punctuation">,</span>
                <span class="token string">"index_only"</span>: <span class="token boolean">false</span><span class="token punctuation">,</span>
                <span class="token string">"rows"</span>: <span class="token number">9</span><span class="token punctuation">,</span>
                <span class="token string">"cost"</span>: <span class="token number">1.91986</span><span class="token punctuation">,</span>
                <span class="token string">"chosen"</span>: <span class="token boolean">true</span>
                }
            <span class="token punctuation">]</span> <span class="token comment">/* range_scan_alternatives */</span><span class="token punctuation">,</span>
        <span class="token string">"analyzing_roworder_intersect"</span>: {
            <span class="token string">"usable"</span>: <span class="token boolean">false</span><span class="token punctuation">,</span>
            <span class="token string">"cause"</span>: <span class="token string">"too_few_roworder_scans"</span>
        	} <span class="token comment">/* analyzing_roworder_intersect */</span>
        } <span class="token comment">/* analyzing_range_alternatives */</span><span class="token punctuation">,</span>
        <span class="token string">"chosen_range_access_summary"</span>: { <span class="token comment">//选择范围访问摘要</span>
            <span class="token string">"range_access_plan"</span>: {
                <span class="token string">"type"</span>: <span class="token string">"range_scan"</span><span class="token punctuation">,</span>
                <span class="token string">"index"</span>: <span class="token string">"PRIMARY"</span><span class="token punctuation">,</span>
                <span class="token string">"rows"</span>: <span class="token number">9</span><span class="token punctuation">,</span>
                <span class="token string">"ranges"</span>: <span class="token punctuation">[</span>
                <span class="token string">"id &lt; 10"</span>
                <span class="token punctuation">]</span> <span class="token comment">/* ranges */</span>
                } <span class="token comment">/* range_access_plan */</span><span class="token punctuation">,</span>
                <span class="token string">"rows_for_plan"</span>: <span class="token number">9</span><span class="token punctuation">,</span>
                <span class="token string">"cost_for_plan"</span>: <span class="token number">1.91986</span><span class="token punctuation">,</span>
                <span class="token string">"chosen"</span>: <span class="token boolean">true</span>
                } <span class="token comment">/* chosen_range_access_summary */</span>
                } <span class="token comment">/* range_analysis */</span>
            }
        <span class="token punctuation">]</span> <span class="token comment">/* rows_estimation */</span>
    }<span class="token punctuation">,</span>
    {
    <span class="token string">"considered_execution_plans"</span>: <span class="token punctuation">[</span> <span class="token comment">//考虑执行计划</span>
    {
    <span class="token string">"plan_prefix"</span>: <span class="token punctuation">[</span>
    <span class="token punctuation">]</span> <span class="token comment">/* plan_prefix */</span><span class="token punctuation">,</span>
        <span class="token string">"table"</span>: <span class="token string">"`student`"</span><span class="token punctuation">,</span>
        <span class="token string">"best_access_path"</span>: { <span class="token comment">//最佳访问路径</span>
        <span class="token string">"considered_access_paths"</span>: <span class="token punctuation">[</span>
        {
            <span class="token string">"rows_to_scan"</span>: <span class="token number">9</span><span class="token punctuation">,</span>
            <span class="token string">"access_type"</span>: <span class="token string">"range"</span><span class="token punctuation">,</span>
            <span class="token string">"range_details"</span>: {
            <span class="token string">"used_index"</span>: <span class="token string">"PRIMARY"</span>
        } <span class="token comment">/* range_details */</span><span class="token punctuation">,</span>
        <span class="token string">"resulting_rows"</span>: <span class="token number">9</span><span class="token punctuation">,</span>
        <span class="token string">"cost"</span>: <span class="token number">2.81986</span><span class="token punctuation">,</span>
        <span class="token string">"chosen"</span>: <span class="token boolean">true</span>
    }
    <span class="token punctuation">]</span> <span class="token comment">/* considered_access_paths */</span>
    } <span class="token comment">/* best_access_path */</span><span class="token punctuation">,</span>
        <span class="token string">"condition_filtering_pct"</span>: <span class="token number">100</span><span class="token punctuation">,</span> <span class="token comment">//行过滤百分比</span>
        <span class="token string">"rows_for_plan"</span>: <span class="token number">9</span><span class="token punctuation">,</span>
        <span class="token string">"cost_for_plan"</span>: <span class="token number">2.81986</span><span class="token punctuation">,</span>
        <span class="token string">"chosen"</span>: <span class="token boolean">true</span>
    }
    <span class="token punctuation">]</span> <span class="token comment">/* considered_execution_plans */</span>
    }<span class="token punctuation">,</span>
    {
        <span class="token string">"attaching_conditions_to_tables"</span>: { <span class="token comment">//将条件附加到表上</span>
        <span class="token string">"original_condition"</span>: <span class="token string">"(`student`.`id` &lt; 10)"</span><span class="token punctuation">,</span>
        <span class="token string">"attached_conditions_computation"</span>: <span class="token punctuation">[</span>
        <span class="token punctuation">]</span> <span class="token comment">/* attached_conditions_computation */</span><span class="token punctuation">,</span>
        <span class="token string">"attached_conditions_summary"</span>: <span class="token punctuation">[</span> <span class="token comment">//附加条件概要</span>
    {
        <span class="token string">"table"</span>: <span class="token string">"`student`"</span><span class="token punctuation">,</span>
        <span class="token string">"attached"</span>: <span class="token string">"(`student`.`id` &lt; 10)"</span>
    }
    <span class="token punctuation">]</span> <span class="token comment">/* attached_conditions_summary */</span>
    } <span class="token comment">/* attaching_conditions_to_tables */</span>
    }<span class="token punctuation">,</span>
    {
    <span class="token string">"finalizing_table_conditions"</span>: <span class="token punctuation">[</span>
    {
        <span class="token string">"table"</span>: <span class="token string">"`student`"</span><span class="token punctuation">,</span>
        <span class="token string">"original_table_condition"</span>: <span class="token string">"(`student`.`id` &lt; 10)"</span><span class="token punctuation">,</span>
        <span class="token string">"final_table_condition "</span>: <span class="token string">"(`student`.`id` &lt; 10)"</span>
    }
    <span class="token punctuation">]</span> <span class="token comment">/* finalizing_table_conditions */</span>
    }<span class="token punctuation">,</span>
    {
    <span class="token string">"refine_plan"</span>: <span class="token punctuation">[</span> <span class="token comment">//精简计划</span>
    {
    	<span class="token string">"table"</span>: <span class="token string">"`student`"</span>
    }
    <span class="token punctuation">]</span> <span class="token comment">/* refine_plan */</span>
    }
    <span class="token punctuation">]</span> <span class="token comment">/* steps */</span>
    } <span class="token comment">/* join_optimization */</span>
}<span class="token punctuation">,</span>
	{
        <span class="token string">"join_execution"</span>: { <span class="token comment">//执行</span>
            <span class="token string">"select#"</span>: <span class="token number">1</span><span class="token punctuation">,</span>
            <span class="token string">"steps"</span>: <span class="token punctuation">[</span>
            <span class="token punctuation">]</span> <span class="token comment">/* steps */</span>
        	} <span class="token comment">/* join_execution */</span>
        }
    <span class="token punctuation">]</span> <span class="token comment">/* steps */</span>
}
<span class="token comment">//第3部分：跟踪信息过长时，被截断的跟踪信息的字节数。</span>
MISSING_BYTES_BEYOND_MAX_MEM_SIZE: <span class="token number">0</span> <span class="token comment">//丢失的超出最大容量的字节</span>
<span class="token comment">//第4部分：执行跟踪语句的用户是否有查看对象的权限。当不具有权限时，该列信息为1且TRACE字段为空，一般在</span>
调用带有<span class="token keyword">SQL</span> SECURITY <span class="token keyword">DEFINER</span>的视图或者是存储过程的情况下，会出现此问题。
INSUFFICIENT_PRIVILEGES: <span class="token number">0</span> <span class="token comment">//缺失权限</span>
<span class="token number">1</span> <span class="token keyword">row</span> <span class="token operator">in</span> <span class="token keyword">set</span> <span class="token punctuation">(</span><span class="token number">0.00</span> sec<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_9-mysql监控分析视图-sys-schema" tabindex="-1"><a class="header-anchor" href="#_9-mysql监控分析视图-sys-schema" aria-hidden="true">#</a> 9. MySQL监控分析视图-sys schema</h2>
<img src="@source/notes/senior_mysql/images/image-20220704190726180.png" alt="image-20220704190726180" style="float:left;" />
<h3 id="_9-1-sys-schema视图摘要" tabindex="-1"><a class="header-anchor" href="#_9-1-sys-schema视图摘要" aria-hidden="true">#</a> 9.1 Sys schema视图摘要</h3>
<ol>
<li><strong>主机相关</strong>：以host_summary开头，主要汇总了IO延迟的信息。</li>
<li><strong>Innodb相关</strong>：以innodb开头，汇总了innodb buffer信息和事务等待innodb锁的信息。</li>
<li><strong>I/o相关</strong>：以io开头，汇总了等待I/O、I/O使用量情况。</li>
<li><strong>内存使用情况</strong>：以memory开头，从主机、线程、事件等角度展示内存的使用情况</li>
<li><strong>连接与会话信息</strong>：processlist和session相关视图，总结了会话相关信息。</li>
<li><strong>表相关</strong>：以schema_table开头的视图，展示了表的统计信息。</li>
<li><strong>索引信息</strong>：统计了索引的使用情况，包含冗余索引和未使用的索引情况。</li>
<li><strong>语句相关</strong>：以statement开头，包含执行全表扫描、使用临时表、排序等的语句信息。</li>
<li><strong>用户相关</strong>：以user开头的视图，统计了用户使用的文件I/O、执行语句统计信息。</li>
<li><strong>等待事件相关信息</strong>：以wait开头，展示等待事件的延迟情况。</li>
</ol>
<h3 id="_9-2-sys-schema视图使用场景" tabindex="-1"><a class="header-anchor" href="#_9-2-sys-schema视图使用场景" aria-hidden="true">#</a> 9.2 Sys schema视图使用场景</h3>
<p>索引情况</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token comment">#1. 查询冗余索引</span>
<span class="token keyword">select</span> <span class="token operator">*</span> <span class="token keyword">from</span> sys<span class="token punctuation">.</span>schema_redundant_indexes<span class="token punctuation">;</span>
<span class="token comment">#2. 查询未使用过的索引</span>
<span class="token keyword">select</span> <span class="token operator">*</span> <span class="token keyword">from</span> sys<span class="token punctuation">.</span>schema_unused_indexes<span class="token punctuation">;</span>
<span class="token comment">#3. 查询索引的使用情况</span>
<span class="token keyword">select</span> index_name<span class="token punctuation">,</span>rows_selected<span class="token punctuation">,</span>rows_inserted<span class="token punctuation">,</span>rows_updated<span class="token punctuation">,</span>rows_deleted
<span class="token keyword">from</span> sys<span class="token punctuation">.</span>schema_index_statistics <span class="token keyword">where</span> table_schema<span class="token operator">=</span><span class="token string">'dbname'</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>表相关</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token comment"># 1. 查询表的访问量</span>
<span class="token keyword">select</span> table_schema<span class="token punctuation">,</span>table_name<span class="token punctuation">,</span><span class="token function">sum</span><span class="token punctuation">(</span>io_read_requests<span class="token operator">+</span>io_write_requests<span class="token punctuation">)</span> <span class="token keyword">as</span> io <span class="token keyword">from</span>
sys<span class="token punctuation">.</span>schema_table_statistics <span class="token keyword">group</span> <span class="token keyword">by</span> table_schema<span class="token punctuation">,</span>table_name <span class="token keyword">order</span> <span class="token keyword">by</span> io <span class="token keyword">desc</span><span class="token punctuation">;</span>
<span class="token comment"># 2. 查询占用bufferpool较多的表</span>
<span class="token keyword">select</span> object_schema<span class="token punctuation">,</span>object_name<span class="token punctuation">,</span>allocated<span class="token punctuation">,</span><span class="token keyword">data</span>
<span class="token keyword">from</span> sys<span class="token punctuation">.</span>innodb_buffer_stats_by_table <span class="token keyword">order</span> <span class="token keyword">by</span> allocated <span class="token keyword">limit</span> <span class="token number">10</span><span class="token punctuation">;</span>
<span class="token comment"># 3. 查看表的全表扫描情况</span>
<span class="token keyword">select</span> <span class="token operator">*</span> <span class="token keyword">from</span> sys<span class="token punctuation">.</span>statements_with_full_table_scans <span class="token keyword">where</span> db<span class="token operator">=</span><span class="token string">'dbname'</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>语句相关</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token comment">#1. 监控SQL执行的频率</span>
<span class="token keyword">select</span> db<span class="token punctuation">,</span>exec_count<span class="token punctuation">,</span>query <span class="token keyword">from</span> sys<span class="token punctuation">.</span>statement_analysis
<span class="token keyword">order</span> <span class="token keyword">by</span> exec_count <span class="token keyword">desc</span><span class="token punctuation">;</span>
<span class="token comment">#2. 监控使用了排序的SQL</span>
<span class="token keyword">select</span> db<span class="token punctuation">,</span>exec_count<span class="token punctuation">,</span>first_seen<span class="token punctuation">,</span>last_seen<span class="token punctuation">,</span>query
<span class="token keyword">from</span> sys<span class="token punctuation">.</span>statements_with_sorting <span class="token keyword">limit</span> <span class="token number">1</span><span class="token punctuation">;</span>
<span class="token comment">#3. 监控使用了临时表或者磁盘临时表的SQL</span>
<span class="token keyword">select</span> db<span class="token punctuation">,</span>exec_count<span class="token punctuation">,</span>tmp_tables<span class="token punctuation">,</span>tmp_disk_tables<span class="token punctuation">,</span>query
<span class="token keyword">from</span> sys<span class="token punctuation">.</span>statement_analysis <span class="token keyword">where</span> tmp_tables<span class="token operator">></span><span class="token number">0</span> <span class="token operator">or</span> tmp_disk_tables <span class="token operator">></span><span class="token number">0</span>
<span class="token keyword">order</span> <span class="token keyword">by</span> <span class="token punctuation">(</span>tmp_tables<span class="token operator">+</span>tmp_disk_tables<span class="token punctuation">)</span> <span class="token keyword">desc</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>IO相关</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token comment">#1. 查看消耗磁盘IO的文件</span>
<span class="token keyword">select</span> <span class="token keyword">file</span><span class="token punctuation">,</span>avg_read<span class="token punctuation">,</span>avg_write<span class="token punctuation">,</span>avg_read<span class="token operator">+</span>avg_write <span class="token keyword">as</span> avg_io
<span class="token keyword">from</span> sys<span class="token punctuation">.</span>io_global_by_file_by_bytes <span class="token keyword">order</span> <span class="token keyword">by</span> avg_read <span class="token keyword">limit</span> <span class="token number">10</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Innodb 相关</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token comment">#1. 行锁阻塞情况</span>
<span class="token keyword">select</span> <span class="token operator">*</span> <span class="token keyword">from</span> sys<span class="token punctuation">.</span>innodb_lock_waits<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><img src="@source/notes/senior_mysql/images/image-20220704192020603.png" alt="image-20220704192020603" style="float:left;" />
<h2 id="_10-小结" tabindex="-1"><a class="header-anchor" href="#_10-小结" aria-hidden="true">#</a> 10. 小结</h2>
<p>查询是数据库中最频繁的操作，提高查询速度可以有效地提高MySQL数据库的性能。通过对查询语句的分析可以了解查询语句的执行情况，找出查询语句执行的瓶颈，从而优化查询语句。</p>
</div></template>
