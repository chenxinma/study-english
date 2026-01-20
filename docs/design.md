# 背单词应用设计文档

## 项目概述

本项目是一个基于Node.js的命令行背单词应用，采用莱特纳盒子（Leitner System）的记忆算法来优化单词复习策略。该系统通过不同难度等级的盒子将单词进行分类管理，帮助用户更有效地记忆单词。

## 功能需求

### 核心功能
1. 单词管理：支持从外部txt文件导入单词库
2. 莱特纳盒子系统：根据用户的记忆情况动态调整单词所在盒子
3. 多种练习模式：提供三种不同的题型供用户练习
4. 学习记录：跟踪用户的学习进度和正确率

### 练习模式
1. **配对题型**：抽取5个单词，打乱中英文顺序让用户进行配对
2. **填空题型**：给出中文释义和部分字母提示，要求填写完整的英文单词
3. **翻译题型**：给出英文单词，要求写出中文释义

### 文件格式
- 支持txt文本导入
- 每行格式：[中文(tab)英文] 或 [中文(空格)英文]

## 系统架构

### 目录结构
```
project/
├── src/                    # 源代码目录
│   ├── core/              # 核心业务逻辑
│   │   ├── leitnerBox.js  # 莱特纳盒子实现
│   │   ├── wordManager.js # 单词管理器
│   │   └── quizEngine.js  # 测验引擎
│   ├── io/                # 输入输出处理
│   │   ├── fileReader.js  # 文件读取器
│   │   └── quizRenderer.js # 测验界面渲染器
│   ├── models/            # 数据模型
│   │   └── word.js        # 单词数据模型
│   └── app.js             # 主程序入口
├── docs/                  # 文档目录
│   └── design.md          # 设计文档
├── data/                  # 数据目录
│   └── words.txt          # 默认单词库
└── README.md              # 项目说明文档
```

### 核心模块设计

#### LeitnerBox类
- boxes: 存储多个盒子，每个盒子包含一组单词
- addWord(word): 将单词添加到第一个盒子，不设置lastReviewed
- moveWord(word, targetBox): 移动单词到指定盒子
- getNextWords(count): 获取下一轮要学习的单词
- getWordsForReview(): 获取需要复习的单词（包括新导入的未复习单词）
- updateWordStatus(word, correct): 根据答题结果更新单词状态

#### WordManager类
- loadWordsFromFile(filePath): 从文件加载单词
- saveWordsToFile(filePath): 将单词保存到文件
- getRandomWords(count): 随机获取指定数量的单词
- createWord(chinese, english): 创建单词对象

#### QuizEngine类
- generateMatchingQuiz(words): 生成配对题型测验
- generateFillInQuiz(words): 生成填空题型测验
- generateTranslationQuiz(words): 生成翻译题型测验
- evaluateAnswer(userAnswer, correctAnswer): 评估答案正确性

## 莱特纳盒子算法

### 盒子规则
- Box 1 (新手盒): 所有新单词从这里开始，每天复习
- Box 2 (进阶盒): 答对一次后移入，每2天复习
- Box 3 (熟练盒): 再次答对后移入，每周复习
- Box 4 (熟悉盒): 进一步巩固，每2周复习
- Box 5 (掌握盒): 完全掌握，每月复习
- 答错则移回前一盒子（如果是Box 1，则保持在Box 1）

### 学习流程
1. 系统从各盒子中选择需要复习的单词（包括新导入的未复习单词）
2. 如果需要复习的单词不足10个，按比例从各盒子补充
3. 随机展示三种题型之一
4. 用户完成答题后，根据结果调整单词在盒子中的位置
5. 记录学习统计信息

### 复习算法
- 新导入的单词（lastReviewed为空）立即包含在复习列表中
- 已复习单词根据lastReviewed时间和所在盒子的复习间隔计算是否需要复习
- 答对单词移入更高盒子，答错单词移回更低盒子

## 命令行交互设计

### 主菜单选项
- 导入单词库
- 开始学习
- 查看统计
- 退出程序

### 学习流程
1. 选择题型（自动或手动选择）
2. 显示题目并接收用户输入
3. 显示结果并给出正确答案
4. 更新单词状态
5. 显示当前学习进度

## 数据模型

### Word对象
```javascript
{
  id: String,           // 单词唯一标识
  chinese: String,      // 中文释义
  english: String,      // 英文单词
  boxNumber: Number,    // 当前所在的盒子编号
  lastReviewed: Date,   // 最后复习时间
  correctCount: Number, // 正确次数
  incorrectCount: Number // 错误次数
}
```

## 重要更新记录

### 2026-01-20 修复新单词学习问题
- **问题**: 当天新导入的单词无法被学习，因为`addWord`方法立即设置了`lastReviewed`时间
- **解决**: 修改`addWord`方法不再调用`updateLastReviewed()`，保持`lastReviewed`为空
- **改进**: 更新`getWordsForReview()`方法，优先处理`lastReviewed`为空的新单词
- **效果**: 新导入的单词现在可以立即进入学习队列

## 数据持久化

为了实现莱特纳盒子状态的持久化，我们需要将单词及其所在盒子的信息保存到本地文件中。

### 持久化方案

1. **状态保存**：
   - 应用退出时，将所有单词及其所在盒子的信息保存到JSON文件
   - 包含单词的所有属性（中英文、当前盒子、复习时间、正确/错误次数等）
   - 保存当前学习统计信息

2. **状态恢复**：
   - 应用启动时，从JSON文件读取上次保存的单词状态
   - 根据保存的boxNumber重建各盒子中的单词分布
   - 恢复学习统计数据

3. **文件格式**：
   - 使用JSON格式存储状态信息
   - 文件路径：`data/state.json`
   - 包含单词列表和全局统计信息

4. **触发时机**：
   - 自动保存：在用户选择退出应用时
   - 手动保存：可选的保存功能，允许用户随时保存当前状态

### 数据结构示例

```json
{
  "words": [
    {
      "id": "word_1",
      "chinese": "苹果",
      "english": "apple",
      "boxNumber": 3,
      "lastReviewed": "2023-01-01T00:00:00Z",
      "correctCount": 5,
      "incorrectCount": 1
    }
  ],
  "stats": {
    "totalStudied": 150,
    "totalCorrect": 120,
    "currentStreak": 5
  },
  "lastAccessed": "2023-01-01T00:00:00Z"
}
```

### 实现细节

- 在`LeitnerBox`类中添加`saveState()`和`loadState()`方法
- 使用fs模块进行文件读写操作
- 添加错误处理机制，确保在文件损坏或缺失时能正确处理

## 技术栈

- Node.js: 运行环境
- readline: 命令行交互
- fs: 文件操作
- util: 工具函数

## 扩展性考虑

1. 支持多种文件格式导入
2. 可配置的盒子数量和复习频率
3. 支持导入导出学习进度
4. 添加单词标签分类功能
5. 提供图形化界面版本