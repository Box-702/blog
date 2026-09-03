---
title: LeetCode 42. 接雨水 —— 双指针解法详解
date: 2026-06-18
category: 算法
tags: [LeetCode, 双指针, Python]
image: /blog/trapping-rain-water.png
summary: 从暴力到动态规划，再到 O(1) 空间的双指针，彻底理解 LeetCode 42「接雨水」。结合图解拆解双指针的核心思想：每次移动水位较低的一侧，把「接水量取决于左右最大值中较小者」这一关键性质讲透。
---

# LeetCode 42. 接雨水 —— 双指针解法详解

## 题目描述

> 给定 `n` 个非负整数表示每个宽度为 `1` 的柱子的高度图，计算按此排列的柱子，下雨之后能接多少雨水。

输入一个高度数组 `height`，返回能接住的雨水总量。

```
输入: height = [0,1,0,2,1,0,1,3,2,1,2,1]
输出: 6
```

## 直觉：一格能接多少水

对于任意一根柱子 `i`，它**上面能存多少水**，取决于它左右两侧最高的柱子中较矮的那一根，再减去它自己的高度：

```
water[i] = min(左边最高, 右边最高) - height[i]
```

只有当 `min(leftMax, rightMax) > height[i]` 时，这一格才有水。

### 暴力做法

对每个位置，向左、向右分别找最大值，再套公式：

```python
def trap(height):
    ans = 0
    n = len(height)
    for i in range(n):
        leftMax = max(height[:i+1])   # 左边最高（含自己）
        rightMax = max(height[i:])    # 右边最高（含自己）
        ans += min(leftMax, rightMax) - height[i]
    return ans
```

时间复杂度 `O(n²)`，每个位置都要扫一遍左右。能过，但慢。

### 动态规划优化

预处理出每个位置的 `leftMax` 和 `rightMax`，空间换时间：

```python
def trap(height):
    n = len(height)
    leftMax = [0] * n
    rightMax = [0] * n

    leftMax[0] = height[0]
    for i in range(1, n):
        leftMax[i] = max(leftMax[i-1], height[i])

    rightMax[n-1] = height[n-1]
    for i in range(n-2, -1, -1):
        rightMax[i] = max(rightMax[i+1], height[i])

    ans = 0
    for i in range(n):
        ans += min(leftMax[i], rightMax[i]) - height[i]
    return ans
```

时间 `O(n)`，空间 `O(n)`。已经能 AC 了。

## 双指针：O(1) 空间的终极解法

动态规划已经足够快，但空间还有优化空间。我们不需要存下**所有**位置的 left/right max，只需要在遍历中维护两个**指针**和两个**当前最大值**。

代码来自本地学习笔记 `42. 接雨水.py`：

```python
from typing import List


class Solution:
    def trap(self, height: List[int]) -> int:
        n = len(height)
        left, right = 0, n - 1
        leftMax = rightMax = 0
        ans = 0
        while left < right:
            leftMax = max(leftMax, height[left])
            rightMax = max(rightMax, height[right])
            if leftMax < rightMax:
                ans += leftMax - height[left]
                left += 1
            else:
                ans += rightMax - height[right]
                right -= 1
        return ans
```

### 图解

下面这张图展示了双指针收缩的某一时刻：`left` 指针指向左侧柱子，`right` 指针指向右侧柱子，虚线是当前的水位线。

<picture>
  <source srcset="/blog/trapping-rain-water.avif" type="image/avif">
  <source srcset="/blog/trapping-rain-water.webp" type="image/webp">
  <img src="/blog/trapping-rain-water.png" alt="接雨水双指针示意图" width="1886" height="1125" loading="lazy">
</picture>

图中 `leftMax = 2`、`rightMax = 2`，蓝色柱子正是当前 `right` 指针所在位置 `height[right] = 2`，此时：

```
ans = 1 + rightMax - height[right] = 1 + (2 - 2) = 1
```

意思是：在这之前已经累加过 1 单位的水，当前 `right` 处由于 `height[right] == rightMax`，这一格放不下水（`2 - 2 = 0`），所以 `ans` 不变。

## 为什么双指针是对的？

关键要回答一个问题：**遍历到某个位置时，我凭什么能立刻确定它接多少水，而不需要知道另一侧的完整最大值？**

答案藏在 `if leftMax < rightMax` 这个分支里。

对 `left` 位置的柱子 `height[left]`：
- 它左边最高的柱子我们已经实时维护在了 `leftMax` 里（**这是确定的**）。
- 它右边最高的柱子我们**还没走完**，但我们**至少知道** `rightMax` 这个下界——也就是 `height[right]` 及其左侧的某个值。

当 `leftMax < rightMax` 时，意味着 `rightMax` 这一侧已经足够高。此时 `min(leftMax, rightMax) = leftMax`，而这个值**已经确定**。所以 `height[left]` 这一格的水量 `leftMax - height[left]` 可以立刻算出，**不需要**知道 `right` 左侧到底有多高——因为无论多高，取 `min` 之后都被 `leftMax` 卡住了。

反过来，当 `leftMax >= rightMax` 时，右侧的水位由 `rightMax` 决定，我们可以立刻确定 `height[right]` 这一格的水量，于是移动 `right`。

**核心直觉：哪个指针一侧的"墙"更矮，哪个指针就能安心"结算"，然后往里收缩。**

> 更严谨地说，`min(leftMax, rightMax)` 只需要**较小的那一个**。而较小的那个一定来自当前两个指针中"还没成为瓶颈"的一侧，于是我们每次只去结算那一边，另一边的最大值留作参考即可。

这就是为什么双指针只需要 `O(1)` 空间：我们永远只关心"较矮的那一侧"的瓶口高度。

## 复杂度分析

| 维度 | 结果 |
|------|------|
| 时间复杂度 | `O(n)`，`left`、`right` 各走一遍 |
| 空间复杂度 | `O(1)`，只用了几个变量 |

对比三种解法：

| 方法 | 时间 | 空间 |
|------|------|------|
| 暴力 | O(n²) | O(1) |
| 动态规划 | O(n) | O(n) |
| **双指针** | O(n) | **O(1)** |

## 双指针思想的通用理解

双指针（Two Pointers）不是某一个题目的技巧，而是一类**用两个索引从两端向中间（或同向）收缩，省去重复扫描**的通用范式。常见形态：

- **对撞指针**：一个从头、一个从尾，向中间靠拢。适用场景：数组有序、需要两两比较、需要确定"当前的最小/最大瓶颈"。接雨水、盛最多水的容器、两数之和（有序数组）都是典例。
- **快慢指针**：同向移动，一个走得快一个走得慢。适用场景：链表判环、找中点、移除元素等。
- **滑动窗口**：`left`、`right` 同向维护一个窗口，动态调整边界。适用场景：最长无重复子串、最小覆盖子串等。

**双指针之所以能把空间压到 O(1)，是因为它放弃"预先计算所有信息"，转而利用"当前已知的信息已经足够做出决策"来局部结算。** 这正是它与前缀/后缀预处理（动态规划）的本质区别。

对本题而言，双指针的"省钱"之处在于：我们不需要知道每个位置**精确**的左右最高值，只需要知道**决定水量的那个较矮值**，而它恰好能边走边确定。

## 小结

1. 接雨水的本质是 `min(左最高, 右最高) - height[i]`。
2. 暴力 O(n²) → 动态规划 O(n) 空间 → 双指针 O(1) 空间。
3. 双指针每次移动"较矮墙"那一侧，因为**水量只取决于较矮的那个最大值**，较矮侧可以安全结算。
4. 双指针是一种"边走边结算、省掉预计算空间"的通用手法。

---

**相关资源：**
- [LeetCode 42. Trapping Rain Water](https://leetcode.com/problems/trapping-rain-water/)
- [LeetCode 11. 盛最多水的容器](https://leetcode.com/problems/container-with-most-water/)（同样是对撞双指针）
- [labuladong 的算法笔记 —— 双指针技巧](https://labuladong.github.io/algorithm/)

如果这篇笔记对你有帮助，欢迎在下方留言交流双指针的心得。
