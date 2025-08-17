const r=`---\r
title: 代码复制功能测试\r
date: 2024-01-20T10:00:00\r
tags: 测试, 功能\r
description: 测试新的代码复制功能，验证按钮位置和复制效果。\r
cover:https://tu.tianmen15qwq.dpdns.org/file/4a6d1a19070b86ca08f28.jpg;\r
---\r
\r
# 代码复制功能测试\r
\r
这是一个测试页面，用来验证新的代码复制功能是否正常工作。\r
\r
## JavaScript 示例\r
\r
\`\`\`javascript\r
// 这是一个简单的 JavaScript 函数\r
function greet(name) {\r
  console.log(\`Hello, \${name}!\`);\r
  return \`Welcome, \${name}!\`;\r
}\r
\r
// 使用示例\r
const message = greet('World');\r
console.log(message);\r
\`\`\`\r
\r
## TypeScript 示例\r
\r
\`\`\`typescript\r
interface User {\r
  id: number;\r
  name: string;\r
  email: string;\r
}\r
\r
class UserService {\r
  private users: User[] = [];\r
\r
  addUser(user: User): void {\r
    this.users.push(user);\r
  }\r
\r
  getUserById(id: number): User | undefined {\r
    return this.users.find(user => user.id === id);\r
  }\r
}\r
\`\`\`\r
\r
## CSS 示例\r
\r
\`\`\`css\r
.button {\r
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\r
  border: none;\r
  border-radius: 8px;\r
  color: white;\r
  padding: 12px 24px;\r
  font-size: 16px;\r
  cursor: pointer;\r
  transition: all 0.3s ease;\r
}\r
\r
.button:hover {\r
  transform: translateY(-2px);\r
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);\r
}\r
\`\`\`\r
\r
## Python 示例\r
\r
\`\`\`python\r
def fibonacci(n):\r
    """计算斐波那契数列的第n项"""\r
    if n <= 1:\r
        return n\r
    return fibonacci(n-1) + fibonacci(n-2)\r
\r
# 使用示例\r
for i in range(10):\r
    print(f"F({i}) = {fibonacci(i)}")\r
\`\`\`\r
\r
## 复杂代码示例\r
\r
\`\`\`javascript\r
// 包含特殊字符的代码\r
const complexCode = \`\r
function processData(data) {\r
  const result = data\r
    .filter(item => item.status === 'active')\r
    .map(item => ({\r
      id: item.id,\r
      name: item.name.toUpperCase(),\r
      timestamp: new Date(item.created_at).toISOString()\r
    }))\r
    .reduce((acc, item) => {\r
      acc[item.id] = item;\r
      return acc;\r
    }, {});\r
\r
  return Object.values(result);\r
}\r
\r
// 使用模板字符串和特殊字符\r
const query = \\\`SELECT * FROM users WHERE status = 'active' AND created_at > '\\\${startDate}'\\\`;\r
\`;\r
\`\`\`\r
\r
## 测试说明\r
\r
1. **按钮位置**: 复制按钮现在位于代码块的右上角\r
2. **按钮大小**: 按钮更小，不会遮挡代码内容\r
3. **复制功能**: 点击按钮应该能正确复制代码\r
4. **视觉反馈**: 复制成功时显示绿色，失败时显示红色\r
5. **主题适配**: 在不同主题下按钮样式会相应调整\r
\r
请测试各种代码块的复制功能是否正常工作！\r
`;export{r as default};
