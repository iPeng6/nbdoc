# 布局方案

CSS（层叠样式表）是一种用于描述 HTML 或 XML 文档外观的样式表语言。CSS 布局是指如何在网页上排列和显示元素。CSS 提供了多种布局方式，其中“块布局”（Block Layout）是最基本和常见的一种。

## 块布局（Block Layout）

块布局是指元素按照块级元素的特性进行排列。块级元素（如`<div>`、`<p>`、`<h1>`等）会占据其父容器的整个宽度，并且每个块级元素会从新的一行开始。块布局的特点是：

- 每个块级元素独占一行。
- 宽度默认是父容器的 100%。
- 可以设置宽度、高度、内边距（padding）、外边距（margin）等属性。

## 其他布局方式

除了块布局，CSS 还提供了其他几种常见的布局方式：

1. **内联布局（Inline Layout）**

   - 内联元素（如`<span>`、`<a>`、`<strong>`等）不会独占一行，它们会在一行内水平排列，直到行宽不够。
   - 内联元素的宽度和高度由其内容决定，不能直接设置宽度和高度。

2. **浮动布局（Float Layout）**

   - 使用`float`属性可以让元素浮动到容器的左边或右边，从而实现文本环绕等效果。
   - 浮动元素会脱离正常的文档流，需要清除浮动（clear float）来避免布局问题。

3. **定位布局（Positioning Layout）**

   - 使用`position`属性可以将元素定位到特定的位置。
   - `position`属性的值包括`static`（默认）、`relative`、`absolute`、`fixed`和`sticky`。
   - 绝对定位（absolute）和固定定位（fixed）的元素会脱离正常文档流。

4. **弹性盒布局（Flexbox Layout）**

   - 使用`display: flex`可以创建一个弹性容器，其子元素（称为“弹性项目”）会根据容器的方向和对齐方式进行排列。
   - Flexbox 布局非常适合用于一维布局（水平或垂直）。

5. **网格布局（Grid Layout）**

   - 使用`display: grid`可以创建一个二维的网格容器，其子元素可以在行和列中进行排列。
   - 网格布局非常适合用于复杂的网页布局。

6. **多列布局（Multi-column Layout）**

   - 使用`column-count`、`column-gap`等属性可以将内容分成多个列，类似于报纸的排版。

7. **表格布局（Table Layout）**

   - 使用`display: table`、`display: table-row`、`display: table-cell`等属性可以创建类似于 HTML 表格的布局。
   - 这种布局方式适用于需要表格样式的内容。

每种布局方式都有其适用的场景和特点，选择合适的布局方式可以使网页设计更加灵活和高效。

## 教程

- [An Interactive Guide to CSS Grid](https://www.joshwcomeau.com/css/interactive-guide-to-grid/)
- [An Interactive Guide to Flexbox](https://www.joshwcomeau.com/css/interactive-guide-to-flexbox/)