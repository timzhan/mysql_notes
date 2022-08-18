<template><div><h1 id="第11章-数据处理之增删改" tabindex="-1"><a class="header-anchor" href="#第11章-数据处理之增删改" aria-hidden="true">#</a> 第11章_数据处理之增删改</h1>
<p>讲师：尚硅谷-宋红康（江湖人称：康师傅）</p>
<p>官网：<a href="http://www.atguigu.com/" target="_blank" rel="noopener noreferrer">http://www.atguigu.com<ExternalLinkIcon/></a></p>
<hr>
<h2 id="_1-插入数据" tabindex="-1"><a class="header-anchor" href="#_1-插入数据" aria-hidden="true">#</a> 1. 插入数据</h2>
<h3 id="_1-1-实际问题" tabindex="-1"><a class="header-anchor" href="#_1-1-实际问题" aria-hidden="true">#</a> 1.1 实际问题</h3>
<img src="@source/notes/base_mysql/images/1555425366064.png" alt="1555425366064" style="zoom:80%;" />
<p>解决方式：使用 INSERT 语句向表中插入数据。</p>
<h3 id="_1-2-方式1-values的方式添加" tabindex="-1"><a class="header-anchor" href="#_1-2-方式1-values的方式添加" aria-hidden="true">#</a> 1.2 方式1：VALUES的方式添加</h3>
<p>使用这种语法一次只能向表中插入<strong>一条</strong>数据。</p>
<p><strong>情况1：为表的所有字段按默认顺序插入数据</strong></p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>INSERT INTO 表名
VALUES (value1,value2,....);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>值列表中需要为表的每一个字段指定值，并且值的顺序必须和数据表中字段定义时的顺序相同。</p>
<p>举例：</p>
<div class="language-mysql ext-mysql line-numbers-mode"><pre v-pre class="language-mysql"><code>INSERT INTO departments
VALUES (70, 'Pub', 100, 1700);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-mysql ext-mysql line-numbers-mode"><pre v-pre class="language-mysql"><code>INSERT INTO	departments
VALUES		(100, 'Finance', NULL, NULL);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>情况2：为表的指定字段插入数据</strong></p>
<div class="language-mysql ext-mysql line-numbers-mode"><pre v-pre class="language-mysql"><code>INSERT INTO 表名(column1 [, column2, …, columnn]) 
VALUES (value1 [,value2, …, valuen]);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>为表的指定字段插入数据，就是在INSERT语句中只向部分字段中插入值，而其他字段的值为表定义时的默认值。</p>
<p>在 INSERT 子句中随意列出列名，但是一旦列出，VALUES中要插入的value1,....valuen需要与column1,...columnn列一一对应。如果类型不同，将无法插入，并且MySQL会产生错误。</p>
<p>举例：</p>
<div class="language-mysql ext-mysql line-numbers-mode"><pre v-pre class="language-mysql"><code>INSERT INTO departments(department_id, department_name)
VALUES (80, 'IT');
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>情况3：同时插入多条记录</strong></p>
<p>INSERT语句可以同时向数据表中插入多条记录，插入时指定多个值列表，每个值列表之间用逗号分隔开，基本语法格式如下：</p>
<div class="language-mysql ext-mysql line-numbers-mode"><pre v-pre class="language-mysql"><code>INSERT INTO table_name 
VALUES 
(value1 [,value2, …, valuen]),
(value1 [,value2, …, valuen]),
……
(value1 [,value2, …, valuen]);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>或者</p>
<div class="language-mysql ext-mysql line-numbers-mode"><pre v-pre class="language-mysql"><code>INSERT INTO table_name(column1 [, column2, …, columnn]) 
VALUES 
(value1 [,value2, …, valuen]),
(value1 [,value2, …, valuen]),
……
(value1 [,value2, …, valuen]);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>举例：</p>
<div class="language-mysql ext-mysql line-numbers-mode"><pre v-pre class="language-mysql"><code>mysql&gt; INSERT INTO emp(emp_id,emp_name)
    -&gt; VALUES (1001,'shkstart'),
    -&gt; (1002,'atguigu'),
    -&gt; (1003,'Tom');
Query OK, 3 rows affected (0.00 sec)
Records: 3  Duplicates: 0  Warnings: 0
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>使用INSERT同时插入多条记录时，MySQL会返回一些在执行单行插入时没有的额外信息，这些信息的含义如下：
●　Records：表明插入的记录条数。
●　Duplicates：表明插入时被忽略的记录，原因可能是这些记录包含了重复的主键值。
●　Warnings：表明有问题的数据值，例如发生数据类型转换。</p>
<blockquote>
<p>一个同时插入多行记录的INSERT语句等同于多个单行插入的INSERT语句，但是多行的INSERT语句在处理过程中<code v-pre>效率更高</code>。因为MySQL执行单条INSERT语句插入多行数据比使用多条INSERT语句快，所以在插入多条记录时最好选择使用单条INSERT语句的方式插入。</p>
</blockquote>
<p><strong>小结：</strong></p>
<ul>
<li>
<p><code v-pre>VALUES</code>也可以写成<code v-pre>VALUE</code>，但是VALUES是标准写法。</p>
</li>
<li>
<p>字符和日期型数据应包含在单引号中。</p>
</li>
</ul>
<h3 id="_1-3-方式2-将查询结果插入到表中" tabindex="-1"><a class="header-anchor" href="#_1-3-方式2-将查询结果插入到表中" aria-hidden="true">#</a> 1.3 方式2：将查询结果插入到表中</h3>
<p>INSERT还可以将SELECT语句查询的结果插入到表中，此时不需要把每一条记录的值一个一个输入，只需要使用一条INSERT语句和一条SELECT语句组成的组合语句即可快速地从一个或多个表中向一个表中插入多行。</p>
<p>基本语法格式如下：</p>
<div class="language-mysql ext-mysql line-numbers-mode"><pre v-pre class="language-mysql"><code>INSERT INTO 目标表名
(tar_column1 [, tar_column2, …, tar_columnn])
SELECT
(src_column1 [, src_column2, …, src_columnn])
FROM 源表名
[WHERE condition]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>在 INSERT 语句中加入子查询。</li>
<li><strong>不必书写</strong> <strong>VALUES</strong> <strong>子句。</strong></li>
<li>子查询中的值列表应与 INSERT 子句中的列名对应。</li>
</ul>
<p>举例：</p>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token keyword">INSERT</span> <span class="token keyword">INTO</span> emp2 
<span class="token keyword">SELECT</span> <span class="token operator">*</span> 
<span class="token keyword">FROM</span> employees
<span class="token keyword">WHERE</span> department_id <span class="token operator">=</span> <span class="token number">90</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token keyword">INSERT</span> <span class="token keyword">INTO</span> sales_reps<span class="token punctuation">(</span>id<span class="token punctuation">,</span> name<span class="token punctuation">,</span> salary<span class="token punctuation">,</span> commission_pct<span class="token punctuation">)</span>
<span class="token keyword">SELECT</span> employee_id<span class="token punctuation">,</span> last_name<span class="token punctuation">,</span> salary<span class="token punctuation">,</span> commission_pct
<span class="token keyword">FROM</span>   employees
<span class="token keyword">WHERE</span>  job_id <span class="token operator">LIKE</span> <span class="token string">'%REP%'</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_2-更新数据" tabindex="-1"><a class="header-anchor" href="#_2-更新数据" aria-hidden="true">#</a> 2. 更新数据</h2>
<p><img src="@source/notes/base_mysql/images/1555425824246.png" alt="1555425824246"></p>
<ul>
<li>使用 UPDATE 语句更新数据。语法如下：</li>
</ul>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>UPDATE table_name
SET column1=value1, column2=value2, … , column=valuen
[WHERE condition]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>
<p>可以一次更新<strong>多条</strong>数据。</p>
</li>
<li>
<p>如果需要回滚数据，需要保证在DML前，进行设置：<strong>SET AUTOCOMMIT = FALSE;</strong></p>
</li>
</ul>
<hr>
<ul>
<li>使用 <strong>WHERE</strong> 子句指定需要更新的数据。</li>
</ul>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token keyword">UPDATE</span> employees
<span class="token keyword">SET</span>    department_id <span class="token operator">=</span> <span class="token number">70</span>
<span class="token keyword">WHERE</span>  employee_id <span class="token operator">=</span> <span class="token number">113</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>如果省略 WHERE 子句，则表中的所有数据都将被更新。</li>
</ul>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token keyword">UPDATE</span> 	copy_emp
<span class="token keyword">SET</span>    	department_id <span class="token operator">=</span> <span class="token number">110</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><strong>更新中的数据完整性错误</strong></li>
</ul>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token keyword">UPDATE</span> employees
<span class="token keyword">SET</span>    department_id <span class="token operator">=</span> <span class="token number">55</span>
<span class="token keyword">WHERE</span>  department_id <span class="token operator">=</span> <span class="token number">110</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="@source/notes/base_mysql/images/1555426069578.png" alt="1555426069578"></p>
<blockquote>
<p>说明：不存在 55 号部门</p>
</blockquote>
<h2 id="_3-删除数据" tabindex="-1"><a class="header-anchor" href="#_3-删除数据" aria-hidden="true">#</a> 3. 删除数据</h2>
<p><img src="@source/notes/base_mysql/images/1555426124751.png" alt="1555426124751"></p>
<ul>
<li>使用 DELETE 语句从表中删除数据</li>
</ul>
<p><img src="@source/notes/base_mysql/images/1555426162264.png" alt="1555426162264"></p>
<div class="language-mysql ext-mysql line-numbers-mode"><pre v-pre class="language-mysql"><code>DELETE FROM table_name [WHERE &lt;condition&gt;];
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>table_name指定要执行删除操作的表；“[WHERE <code v-pre>&lt;condition&gt;</code>]”为可选参数，指定删除条件，如果没有WHERE子句，DELETE语句将删除表中的所有记录。</p>
<ul>
<li>使用 WHERE 子句删除指定的记录。</li>
</ul>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token keyword">DELETE</span> <span class="token keyword">FROM</span> departments
<span class="token keyword">WHERE</span>  department_name <span class="token operator">=</span> <span class="token string">'Finance'</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>如果省略 WHERE 子句，则表中的全部数据将被删除</li>
</ul>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token keyword">DELETE</span> <span class="token keyword">FROM</span>  copy_emp<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul>
<li><strong>删除中的数据完整性错误</strong></li>
</ul>
<div class="language-sql ext-sql line-numbers-mode"><pre v-pre class="language-sql"><code><span class="token keyword">DELETE</span> <span class="token keyword">FROM</span> departments
<span class="token keyword">WHERE</span>       department_id <span class="token operator">=</span> <span class="token number">60</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="@source/notes/base_mysql/images/1555426258516.png" alt="1555426258516"></p>
<blockquote>
<p>说明：You cannot delete a row that contains a primary key that is used as a foreign key in another table.</p>
</blockquote>
<h2 id="_4-mysql8新特性-计算列" tabindex="-1"><a class="header-anchor" href="#_4-mysql8新特性-计算列" aria-hidden="true">#</a> 4. MySQL8新特性：计算列</h2>
<p>什么叫计算列呢？简单来说就是某一列的值是通过别的列计算得来的。例如，a列值为1、b列值为2，c列不需要手动插入，定义a+b的结果为c的值，那么c就是计算列，是通过别的列计算得来的。</p>
<p>在MySQL 8.0中，CREATE TABLE 和 ALTER TABLE 中都支持增加计算列。下面以CREATE TABLE为例进行讲解。</p>
<p>举例：定义数据表tb1，然后定义字段id、字段a、字段b和字段c，其中字段c为计算列，用于计算a+b的值。
首先创建测试表tb1，语句如下：</p>
<div class="language-mysql ext-mysql line-numbers-mode"><pre v-pre class="language-mysql"><code>CREATE TABLE tb1(
id INT,
a INT,
b INT,
c INT GENERATED ALWAYS AS (a + b) VIRTUAL
);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>插入演示数据，语句如下：</p>
<div class="language-mysql ext-mysql line-numbers-mode"><pre v-pre class="language-mysql"><code>INSERT INTO tb1(a,b) VALUES (100,200);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>查询数据表tb1中的数据，结果如下：</p>
<div class="language-mysql ext-mysql line-numbers-mode"><pre v-pre class="language-mysql"><code>mysql&gt; SELECT * FROM tb1;
+------+------+------+------+
| id   | a    | b    | c    |
+------+------+------+------+
| NULL |  100 |  200 |  300 |
+------+------+------+------+
1 row in set (0.00 sec)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>更新数据中的数据，语句如下：</p>
<div class="language-mysql ext-mysql line-numbers-mode"><pre v-pre class="language-mysql"><code>mysql&gt; UPDATE tb1 SET a = 500;
Query OK, 0 rows affected (0.00 sec)
Rows matched: 1  Changed: 0  Warnings: 0
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_5-综合案例" tabindex="-1"><a class="header-anchor" href="#_5-综合案例" aria-hidden="true">#</a> 5. 综合案例</h2>
<div class="language-mysql ext-mysql line-numbers-mode"><pre v-pre class="language-mysql"><code># 1、创建数据库test01_library

# 2、创建表 books，表结构如下：
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><table>
<thead>
<tr>
<th>字段名</th>
<th>字段说明</th>
<th>数据类型</th>
</tr>
</thead>
<tbody>
<tr>
<td>id</td>
<td>书编号</td>
<td>INT</td>
</tr>
<tr>
<td>name</td>
<td>书名</td>
<td>VARCHAR(50)</td>
</tr>
<tr>
<td>authors</td>
<td>作者</td>
<td>VARCHAR(100)</td>
</tr>
<tr>
<td>price</td>
<td>价格</td>
<td>FLOAT</td>
</tr>
<tr>
<td>pubdate</td>
<td>出版日期</td>
<td>YEAR</td>
</tr>
<tr>
<td>note</td>
<td>说明</td>
<td>VARCHAR(100)</td>
</tr>
<tr>
<td>num</td>
<td>库存</td>
<td>INT</td>
</tr>
</tbody>
</table>
<div class="language-mysql ext-mysql line-numbers-mode"><pre v-pre class="language-mysql"><code># 3、向books表中插入记录

# 1）不指定字段名称，插入第一条记录
# 2）指定所有字段名称，插入第二记录
# 3）同时插入多条记录（剩下的所有记录）
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><table>
<thead>
<tr>
<th>id</th>
<th>name</th>
<th>authors</th>
<th>price</th>
<th>pubdate</th>
<th>note</th>
<th>num</th>
</tr>
</thead>
<tbody>
<tr>
<td>1</td>
<td>Tal of AAA</td>
<td>Dickes</td>
<td>23</td>
<td>1995</td>
<td>novel</td>
<td>11</td>
</tr>
<tr>
<td>2</td>
<td>EmmaT</td>
<td>Jane lura</td>
<td>35</td>
<td>1993</td>
<td>joke</td>
<td>22</td>
</tr>
<tr>
<td>3</td>
<td>Story of Jane</td>
<td>Jane Tim</td>
<td>40</td>
<td>2001</td>
<td>novel</td>
<td>0</td>
</tr>
<tr>
<td>4</td>
<td>Lovey Day</td>
<td>George Byron</td>
<td>20</td>
<td>2005</td>
<td>novel</td>
<td>30</td>
</tr>
<tr>
<td>5</td>
<td>Old land</td>
<td>Honore Blade</td>
<td>30</td>
<td>2010</td>
<td>law</td>
<td>0</td>
</tr>
<tr>
<td>6</td>
<td>The Battle</td>
<td>Upton Sara</td>
<td>30</td>
<td>1999</td>
<td>medicine</td>
<td>40</td>
</tr>
<tr>
<td>7</td>
<td>Rose Hood</td>
<td>Richard haggard</td>
<td>28</td>
<td>2008</td>
<td>cartoon</td>
<td>28</td>
</tr>
</tbody>
</table>
<div class="language-mysql ext-mysql line-numbers-mode"><pre v-pre class="language-mysql"><code># 4、将小说类型(novel)的书的价格都增加5。

# 5、将名称为EmmaT的书的价格改为40，并将说明改为drama。

# 6、删除库存为0的记录。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-mysql ext-mysql line-numbers-mode"><pre v-pre class="language-mysql"><code># 7、统计书名中包含a字母的书

# 8、统计书名中包含a字母的书的数量和库存总量

# 9、找出“novel”类型的书，按照价格降序排列

# 10、查询图书信息，按照库存量降序排列，如果库存量相同的按照note升序排列

# 11、按照note分类统计书的数量

# 12、按照note分类统计书的库存量，显示库存量超过30本的

# 13、查询所有图书，每页显示5本，显示第二页

# 14、按照note分类统计书的库存量，显示库存量最多的

# 15、查询书名达到10个字符的书，不包括里面的空格

# 16、查询书名和类型，其中note值为novel显示小说，law显示法律，medicine显示医药，cartoon显示卡通，joke显示笑话

# 17、查询书名、库存，其中num值超过30本的，显示滞销，大于0并低于10的，显示畅销，为0的显示需要无货

# 18、统计每一种note的库存量，并合计总量

# 19、统计每一种note的数量，并合计总量

# 20、统计库存量前三名的图书

# 21、找出最早出版的一本书

# 22、找出novel中价格最高的一本书

# 23、找出书名中字数最多的一本书，不含空格
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>答案：</p>
<div class="language-mysql ext-mysql line-numbers-mode"><pre v-pre class="language-mysql"><code>#1、创建数据库test01_library
CREATE DATABASE IF NOT EXISTS test01_library CHARACTER SET 'utf8';

#指定使用哪个数据库
USE test01_library;

#2、创建表 books
CREATE TABLE books(
	id INT,
	name VARCHAR(50),
	`authors` VARCHAR(100) ,
	price FLOAT,
	pubdate YEAR ,
	note VARCHAR(100),
	num INT
);

#3、向books表中插入记录
# 1）不指定字段名称，插入第一条记录
INSERT INTO books 
VALUES(1,'Tal of AAA','Dickes',23,1995,'novel',11);
# 2）指定所有字段名称，插入第二记录
INSERT INTO books (id,name,`authors`,price,pubdate,note,num)
VALUES(2,'EmmaT','Jane lura',35,1993,'Joke',22);
# 3）同时插入多条记录（剩下的所有记录）
INSERT INTO books (id,name,`authors`,price,pubdate,note,num) VALUES
(3,'Story of Jane','Jane Tim',40,2001,'novel',0),
(4,'Lovey Day','George Byron',20,2005,'novel',30),
(5,'Old land','Honore Blade',30,2010,'Law',0),
(6,'The Battle','Upton Sara',30,1999,'medicine',40),
(7,'Rose Hood','Richard haggard',28,2008,'cartoon',28);

# 4、将小说类型(novel)的书的价格都增加5。
UPDATE books SET price=price+5 WHERE note = 'novel';

# 5、将名称为EmmaT的书的价格改为40，并将说明改为drama。
UPDATE books SET price=40,note='drama' WHERE name='EmmaT';

# 6、删除库存为0的记录。
DELETE FROM books WHERE num=0;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-mysql ext-mysql line-numbers-mode"><pre v-pre class="language-mysql"><code># 7、统计书名中包含a字母的书
SELECT * FROM books WHERE name LIKE '%a%';

# 8、统计书名中包含a字母的书的数量和库存总量
SELECT COUNT(*),SUM(num) FROM books WHERE name LIKE '%a%';

# 9、找出“novel”类型的书，按照价格降序排列
SELECT * FROM books WHERE note = 'novel' ORDER BY price DESC;

# 10、查询图书信息，按照库存量降序排列，如果库存量相同的按照note升序排列
SELECT * FROM books ORDER BY num DESC,note ASC;

# 11、按照note分类统计书的数量
SELECT note,COUNT(*) FROM books GROUP BY note;

# 12、按照note分类统计书的库存量，显示库存量超过30本的
SELECT note,SUM(num) FROM books GROUP BY note HAVING SUM(num)&gt;30;

# 13、查询所有图书，每页显示5本，显示第二页
SELECT * FROM books LIMIT 5,5;

# 14、按照note分类统计书的库存量，显示库存量最多的
SELECT note,SUM(num) sum_num FROM books GROUP BY note ORDER BY sum_num DESC LIMIT 0,1;

# 15、查询书名达到10个字符的书，不包括里面的空格
SELECT * FROM books WHERE CHAR_LENGTH(REPLACE(name,' ',''))&gt;=10;

/*
16、查询书名和类型，
 其中note值为 novel显示小说，law显示法律，medicine显示医药，cartoon显示卡通，joke显示笑话
*/
SELECT name AS &quot;书名&quot; ,note, CASE note 
 WHEN 'novel' THEN '小说'
 WHEN 'law' THEN '法律'
 WHEN 'medicine' THEN '医药'
 WHEN 'cartoon' THEN '卡通'
 WHEN 'joke' THEN '笑话'
 END AS &quot;类型&quot;
FROM books;


# 17、查询书名、库存，其中num值超过30本的，显示滞销，大于0并低于10的，显示畅销，为0的显示需要无货
SELECT name,num,CASE 
  WHEN num&gt;30 THEN '滞销'
  WHEN num&gt;0 AND num&lt;10 THEN '畅销'
  WHEN num=0 THEN '无货'
  ELSE '正常'
  END AS &quot;库存状态&quot;
FROM books;

# 18、统计每一种note的库存量，并合计总量
SELECT IFNULL(note,'合计总库存量') AS note,SUM(num) FROM books GROUP BY note WITH ROLLUP;

# 19、统计每一种note的数量，并合计总量
SELECT IFNULL(note,'合计总数') AS note,COUNT(*) FROM books GROUP BY note WITH ROLLUP;

# 20、统计库存量前三名的图书
SELECT * FROM books ORDER BY num DESC LIMIT 0,3;

# 21、找出最早出版的一本书
SELECT * FROM books ORDER BY pubdate ASC LIMIT 0,1;

# 22、找出novel中价格最高的一本书
SELECT * FROM books WHERE note = 'novel' ORDER BY price DESC LIMIT 0,1;

# 23、找出书名中字数最多的一本书，不含空格
SELECT * FROM books ORDER BY CHAR_LENGTH(REPLACE(name,' ','')) DESC LIMIT 0,1;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>
