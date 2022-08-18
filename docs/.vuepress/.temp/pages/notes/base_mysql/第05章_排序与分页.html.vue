<template><div><h1 id="第05章-排序与分页" tabindex="-1"><a class="header-anchor" href="#第05章-排序与分页" aria-hidden="true">#</a> 第05章_排序与分页</h1>
<p>讲师：尚硅谷-宋红康（江湖人称：康师傅）</p>
<p>官网：<a href="http://www.atguigu.com/" target="_blank" rel="noopener noreferrer">http://www.atguigu.com<ExternalLinkIcon/></a></p>
<hr>
<h2 id="_1-排序数据" tabindex="-1"><a class="header-anchor" href="#_1-排序数据" aria-hidden="true">#</a> 1. 排序数据</h2>
<h3 id="_1-1-排序规则" tabindex="-1"><a class="header-anchor" href="#_1-1-排序规则" aria-hidden="true">#</a> 1.1 排序规则</h3>
<ul>
<li>使用 ORDER BY 子句排序
<ul>
<li><strong>ASC（ascend）: 升序</strong></li>
<li><strong>DESC（descend）:降序</strong></li>
</ul>
</li>
<li><strong>ORDER BY 子句在SELECT语句的结尾。</strong></li>
</ul>
<h3 id="_1-2-单列排序" tabindex="-1"><a class="header-anchor" href="#_1-2-单列排序" aria-hidden="true">#</a> 1.2 单列排序</h3>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token keyword">SELECT</span>   last_name<span class="token punctuation">,</span> job_id<span class="token punctuation">,</span> department_id<span class="token punctuation">,</span> hire_date
<span class="token keyword">FROM</span>     employees
<span class="token keyword">ORDER</span> <span class="token keyword">BY</span> hire_date <span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="@source/notes/base_mysql/images/1554974255957.png" alt="1554974255957" loading="lazy"></p>
<p><img src="@source/notes/base_mysql/images/1554974260133.png" alt="1554974260133" loading="lazy"></p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token keyword">SELECT</span>   last_name<span class="token punctuation">,</span> job_id<span class="token punctuation">,</span> department_id<span class="token punctuation">,</span> hire_date
<span class="token keyword">FROM</span>     employees
<span class="token keyword">ORDER</span> <span class="token keyword">BY</span> hire_date <span class="token keyword">DESC</span> <span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="@source/notes/base_mysql/images/1554974822229.png" alt="1554974822229" loading="lazy"></p>
<p><img src="@source/notes/base_mysql/images/1554974827522.png" alt="1554974827522" loading="lazy"></p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token keyword">SELECT</span> employee_id<span class="token punctuation">,</span> last_name<span class="token punctuation">,</span> salary<span class="token operator">*</span><span class="token number">12</span> annsal
<span class="token keyword">FROM</span>   employees
<span class="token keyword">ORDER</span> <span class="token keyword">BY</span> annsal<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="@source/notes/base_mysql/images/1554974853194.png" alt="1554974853194" loading="lazy"></p>
<p><img src="@source/notes/base_mysql/images/1554974858252.png" alt="1554974858252" loading="lazy"></p>
<h3 id="_1-3-多列排序" tabindex="-1"><a class="header-anchor" href="#_1-3-多列排序" aria-hidden="true">#</a> 1.3 多列排序</h3>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token keyword">SELECT</span> last_name<span class="token punctuation">,</span> department_id<span class="token punctuation">,</span> salary
<span class="token keyword">FROM</span>   employees
<span class="token keyword">ORDER</span> <span class="token keyword">BY</span> department_id<span class="token punctuation">,</span> salary <span class="token keyword">DESC</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="@source/notes/base_mysql/images/1554974901572.png" alt="1554974901572" loading="lazy"></p>
<p><img src="@source/notes/base_mysql/images/1554974907498.png" alt="1554974907498" loading="lazy"></p>
<ul>
<li>可以使用不在SELECT列表中的列排序。</li>
<li>在对多列进行排序的时候，首先排序的第一列必须有相同的列值，才会对第二列进行排序。如果第一列数据中所有值都是唯一的，将不再对第二列进行排序。</li>
</ul>
<h2 id="_2-分页" tabindex="-1"><a class="header-anchor" href="#_2-分页" aria-hidden="true">#</a> 2. 分页</h2>
<h3 id="_2-1-背景" tabindex="-1"><a class="header-anchor" href="#_2-1-背景" aria-hidden="true">#</a> 2.1 背景</h3>
<p>背景1：查询返回的记录太多了，查看起来很不方便，怎么样能够实现分页查询呢？</p>
<p>背景2：表里有 4 条数据，我们只想要显示第 2、3 条数据怎么办呢？</p>
<h3 id="_2-2-实现规则" tabindex="-1"><a class="header-anchor" href="#_2-2-实现规则" aria-hidden="true">#</a> 2.2 实现规则</h3>
<ul>
<li>
<p>分页原理</p>
<p>所谓分页显示，就是将数据库中的结果集，一段一段显示出来需要的条件。</p>
</li>
<li>
<p><strong>MySQL中使用 LIMIT 实现分页</strong></p>
</li>
<li>
<p>格式：</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token keyword">LIMIT</span> <span class="token punctuation">[</span>位置偏移量<span class="token punctuation">,</span><span class="token punctuation">]</span> 行数
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>第一个“位置偏移量”参数指示MySQL从哪一行开始显示，是一个可选参数，如果不指定“位置偏移量”，将会从表中的第一条记录开始（第一条记录的位置偏移量是0，第二条记录的位置偏移量是1，以此类推）；第二个参数“行数”指示返回的记录条数。</p>
</li>
<li>
<p>举例</p>
</li>
</ul>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token comment">--前10条记录：</span>
<span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> 表名 <span class="token keyword">LIMIT</span> <span class="token number">0</span><span class="token punctuation">,</span><span class="token number">10</span><span class="token punctuation">;</span>
或者
<span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> 表名 <span class="token keyword">LIMIT</span> <span class="token number">10</span><span class="token punctuation">;</span>

<span class="token comment">--第11至20条记录：</span>
<span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> 表名 <span class="token keyword">LIMIT</span> <span class="token number">10</span><span class="token punctuation">,</span><span class="token number">10</span><span class="token punctuation">;</span>

<span class="token comment">--第21至30条记录： </span>
<span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> 表名 <span class="token keyword">LIMIT</span> <span class="token number">20</span><span class="token punctuation">,</span><span class="token number">10</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote>
<p>MySQL 8.0中可以使用“LIMIT 3 OFFSET 4”，意思是获取从第5条记录开始后面的3条记录，和“LIMIT 4,3;”返回的结果相同。</p>
</blockquote>
<ul>
<li>分页显式公式**：（当前页数-1）<em>每页条数，每页条数</em>*</li>
</ul>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> <span class="token keyword">table</span> 
<span class="token keyword">LIMIT</span><span class="token punctuation">(</span>PageNo <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token operator">*</span>PageSize<span class="token punctuation">,</span>PageSize<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><strong>注意：LIMIT 子句必须放在整个SELECT语句的最后！</strong></li>
<li>使用 LIMIT 的好处</li>
</ul>
<p>约束返回结果的数量可以<code v-pre>减少数据表的网络传输量</code>，也可以<code v-pre>提升查询效率</code>。如果我们知道返回结果只有 1 条，就可以使用<code v-pre>LIMIT 1</code>，告诉 SELECT 语句只需要返回一条记录即可。这样的好处就是 SELECT 不需要扫描完整的表，只需要检索到一条符合条件的记录即可返回。</p>
<h3 id="_2-3-拓展" tabindex="-1"><a class="header-anchor" href="#_2-3-拓展" aria-hidden="true">#</a> 2.3 拓展</h3>
<p>在不同的 DBMS 中使用的关键字可能不同。在 MySQL、PostgreSQL、MariaDB 和 SQLite 中使用 LIMIT 关键字，而且需要放到 SELECT 语句的最后面。</p>
<ul>
<li>如果是 SQL Server 和 Access，需要使用 <code v-pre>TOP</code> 关键字，比如：</li>
</ul>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token keyword">SELECT</span> <span class="token keyword">TOP</span> <span class="token number">5</span> name<span class="token punctuation">,</span> hp_max <span class="token keyword">FROM</span> heros <span class="token keyword">ORDER</span> <span class="token keyword">BY</span> hp_max <span class="token keyword">DESC</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul>
<li>如果是 DB2，使用<code v-pre>FETCH FIRST 5 ROWS ONLY</code>这样的关键字：</li>
</ul>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token keyword">SELECT</span> name<span class="token punctuation">,</span> hp_max <span class="token keyword">FROM</span> heros <span class="token keyword">ORDER</span> <span class="token keyword">BY</span> hp_max <span class="token keyword">DESC</span> <span class="token keyword">FETCH</span> <span class="token keyword">FIRST</span> <span class="token number">5</span> <span class="token keyword">ROWS</span> ONLY
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul>
<li>如果是 Oracle，你需要基于 <code v-pre>ROWNUM</code> 来统计行数：</li>
</ul>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token keyword">SELECT</span> rownum<span class="token punctuation">,</span>last_name<span class="token punctuation">,</span>salary <span class="token keyword">FROM</span> employees <span class="token keyword">WHERE</span> rownum <span class="token operator">&lt;</span> <span class="token number">5</span> <span class="token keyword">ORDER</span> <span class="token keyword">BY</span> salary <span class="token keyword">DESC</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>需要说明的是，这条语句是先取出来前 5 条数据行，然后再按照 hp_max 从高到低的顺序进行排序。但这样产生的结果和上述方法的并不一样。我会在后面讲到子查询，你可以使用</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token keyword">SELECT</span> rownum<span class="token punctuation">,</span> last_name<span class="token punctuation">,</span>salary
<span class="token keyword">FROM</span> <span class="token punctuation">(</span>
    <span class="token keyword">SELECT</span> last_name<span class="token punctuation">,</span>salary
    <span class="token keyword">FROM</span> employees
    <span class="token keyword">ORDER</span> <span class="token keyword">BY</span> salary <span class="token keyword">DESC</span><span class="token punctuation">)</span>
<span class="token keyword">WHERE</span> rownum <span class="token operator">&lt;</span> <span class="token number">10</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>得到与上述方法一致的结果。</p>
</div></template>
