# 游戏化功能技术规范文档

## 1. 概述

为了提升用户留存率和学习粘性，本规范定义了游戏化功能模块的设计与实现方案。通过连胜、等级和成就系统，激励用户持续学习，形成良好的英语学习习惯。

## 2. 设计目标

- **提高学习频次**：通过连胜系统鼓励用户每日登录学习
- **增强成就感**：通过等级和成就系统让用户感受到进步
- **激励深度参与**：通过经验系统量化学习成果
- **维持长期内驱力**：通过成就目标引导用户长期学习

## 3. 架构设计

### 3.1 总体架构
采用松耦合设计，游戏化功能独立于核心学习系统，通过事件总线进行通信，确保不会干扰原有的莱特纳算法。

### 3.2 技术栈
- **前端框架**：React 19.x
- **状态管理**：React Context API
- **数据存储**：localStorage
- **动画效果**：Tailwind CSS + CSS动画

## 4. 核心组件

### 4.1 服务层 - Services

#### 4.1.1 GameEventBus
- 实现事件的发布/订阅模式
- 支持 `on`, `off`, `emit` 三种操作
- 连接不同功能模块间的数据流

```javascript
// 事件清单
- 'streak_updated': 当用户连续学习天数发生变化时触发
- 'level_up': 当用户升级时触发
- 'achievement_unlocked': 当成就解锁时触发
- 'xp_earned': 当获得经验值时触发
```

#### 4.1.2 GamificationService
- 单例模式全局管理
- 整合所有游戏化功能
- 负责数据加载/保存/同步

**数据结构**:
```javascript
{
  streak: {
    current: 0,      // 当前连胜天数
    longest: 0,      // 最长连胜记录
    lastStudyDate: "2026-02-26"  // 上次学习日期
  },
  level: {
    current: 1,      // 当前等级
    experience: 0,   // 当前等级经验
    total: 0         // 总经验
  },
  achievements: []   // 成就列表
}
```

#### 4.1.3 StreakManager
- `updateStreak(date)`: 更新用户的连续学习状态
- `getMultiplier()`: 根据当前连胜返回经验倍数
- `getState()`: 获取当前连胜状态

**倍数规则**:
- 1-3 天: 1.0x
- 4-7 天: 1.5x  
- 8+ 天: 2.0x

#### 4.1.4 LevelSystem
- `addExperience(amount)`: 增加经验并判断是否升级
- `getExperienceToNextLevel()`: 计算距离下一级所需经验
- `getState()`: 获取当前等级状态

**等级计算**:
- 每1000经验升一级
- 当前等级 = floor(总经验 / 1000) + 1

#### 4.1.5 AchievementManager
- `checkAchievement(condition)`: 检查单个成就是否满足条件
- `checkAllAchievements(eventData)`: 检查所有成就
- `getUnlockedAchievements()`: 获取已解锁成就

**预设成就列表**:
```javascript
[
  {
    id: 'beginner',
    name: '新手上路',
    description: '完成首次学习',
    icon: '🎯',
    condition: { type: 'first_study', threshold: 1, operator: '>=' },
    reward: { xp: 50, badge: true },
    unlocked: false
  },
  {
    id: 'hot_streak',
    name: '火热状态', 
    description: '达成7天连胜',
    icon: '🔥',
    condition: { type: 'streak', threshold: 7, operator: '>=' },
    reward: { xp: 200, badge: true },
    unlocked: false
  },
  // ... 更多成就
]
```

### 4.2 状态管理层 - Contexts

#### 4.2.1 GamificationContext
- 提供全局游戏化状态
- 封装业务方法便于组件调用
- 处理异步操作的状态管理

```javascript
// 上下文包含
{
  streak,            // 连胜状态
  level,             // 等级状态  
  achievements,      // 所有成就
  isLoading,         // 加载中状态
  earnXP,            // 获得经验的方法
  checkAchievements, // 检查成就的方法
  refreshData        // 刷新数据的方法
}
```

### 4.3 组件层 - Components

#### 4.3.1 Gamification Components
- `StreakDisplay`: 展示当前连胜状态的卡片
- `LevelProgress`: 显示当前等级及经验进度
- `AchievementBadge`: 展示单个成就的徽章组件

#### 4.3.2 Notification Components  
- `GamificationNotifications`: 通知中心，展示升级、解锁等消息

### 4.4 页面层 - Pages

#### 4.4.1 AchievementsPage
专门的成就展示页面，按解锁状态分类展示成就徽章。

#### 4.4.2 LearningPage
- 在顶部集成StreakDisplay和LevelProgress
- 完成练习后自动分配经验
- 检查并授予成就

## 5. 集成接口

### 5.1 与学习核心的集成点
- 在quiz完成后调用 `earnXP()` 
- 通过学习数据调用 `checkAchievements()`

### 5.2 与UI的集成点
- App.jsx 包裹 GamificationProvider
- 在路由中增加 `/achievements` 路径
- 在学习界面增加通知组件

## 6. 数据持久化

- 存储键值: `gamification_state`
- 自动保存用户的所有游戏化数据
- 存储格式：JSON字符串

## 7. 测试要点

### 7.1 功能测试
- 连胜更新逻辑（跨天、中断等边界情况）
- 等级升级判断准确性  
- 成就解锁条件正确性
- 经验计算与倍数应用

### 7.2 集成测试
- 组件与服务的正确交互
- 事件总线通信机制
- 异常情况下的错误处理

### 7.3 性能测试
- 频繁的读写操作性能
- 大量成就的加载速度

## 8. 扩展性考虑

- 预留动态成就添加能力
- 支持成就分组和分类管理
- 程序化配置经验奖励体系
- UI主题的灵活定制

## 9. 安全性与隐私

- 所有数据均存在客户端本地
- 不传输用户游戏数据至服务器
- 对localStorage操作进行异常捕获