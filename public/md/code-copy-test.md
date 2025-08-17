---
title: 代码复制功能测试
date: 2024-01-20T10:00:00
tags: 测试, 功能
description: 测试新的代码复制功能，验证按钮位置和复制效果。
cover:https://tu.tianmen15qwq.dpdns.org/file/4a6d1a19070b86ca08f28.jpg;
---

# 代码复制功能测试

这是一个测试页面，用来验证新的代码复制功能是否正常工作。

## JavaScript 示例

```javascript
// 这是一个简单的 JavaScript 函数
function greet(name) {
  console.log(`Hello, ${name}!`);
  return `Welcome, ${name}!`;
}

// 使用示例
const message = greet('World');
console.log(message);
```

## TypeScript 示例

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

class UserService {
  private users: User[] = [];

  addUser(user: User): void {
    this.users.push(user);
  }

  getUserById(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }
}
```

## CSS 示例

```css
.button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  color: white;
  padding: 12px 24px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}
```

## Python 示例

```python
def fibonacci(n):
    """计算斐波那契数列的第n项"""
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# 使用示例
for i in range(10):
    print(f"F({i}) = {fibonacci(i)}")
```

## 复杂代码示例

```javascript
// 包含特殊字符的代码
const complexCode = `
function processData(data) {
  const result = data
    .filter(item => item.status === 'active')
    .map(item => ({
      id: item.id,
      name: item.name.toUpperCase(),
      timestamp: new Date(item.created_at).toISOString()
    }))
    .reduce((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {});

  return Object.values(result);
}

// 使用模板字符串和特殊字符
const query = \`SELECT * FROM users WHERE status = 'active' AND created_at > '\${startDate}'\`;
`;
```

## 测试说明

1. **按钮位置**: 复制按钮现在位于代码块的右上角
2. **按钮大小**: 按钮更小，不会遮挡代码内容
3. **复制功能**: 点击按钮应该能正确复制代码
4. **视觉反馈**: 复制成功时显示绿色，失败时显示红色
5. **主题适配**: 在不同主题下按钮样式会相应调整

请测试各种代码块的复制功能是否正常工作！
