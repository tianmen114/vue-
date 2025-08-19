# injectShadowStyle 函数解释

## 代码片段

```javascript
function injectShadowStyle() {
  const el = document.querySelector("bilibili-bangumi") as HTMLElement | null;
  if (!el) return false;
  const sr = (el as any).shadowRoot as ShadowRoot | null;
  if (!sr) return false;

  // 防止重复注入
  if (sr.getElementById("my-bbc-style")) return true;

  const style = document.createElement("style");
  style.id = "my-bbc-style";
  style.textContent = `
    .bbc-bangumi-title a {
      position: relative;
      display: inline-block;
      transition: all 0.3s ease;
    }

    .bbc-bangumi-title a::after {
      content: "";
      position: absolute;
      left: 0;
      bottom: 0;
      width: 0;
      height: 100%;
      background-color: #435af0;
      z-index: -1;
      transition: all 0.4s ease;
      border-radius: 8px;
    }

    .bbc-bangumi-title a:hover {
      color: #63f3ff;
    }

    .bbc-bangumi-title a:hover::after {
      width: 100%;
    }
  `;
  sr.appendChild(style);
  return true;
}
```

## 功能说明

`injectShadowStyle` 函数的主要功能是向 `bilibili-bangumi` 组件的 Shadow DOM 中注入自定义样式。它首先查找页面中的 `bilibili-bangumi` 元素，然后获取其 Shadow DOM 根节点。如果找到了 Shadow DOM 根节点，并且还没有注入过名为 `my-bbc-style` 的样式，那么它就会创建一个 `<style>` 元素，并将其添加到 Shadow DOM 中。这个 `<style>` 元素包含了一些 CSS 样式，用于美化 `bilibili-bangumi` 组件中的链接。

防止重复注入的重要性在于避免在同一个元素上多次添加相同的样式，这不仅会浪费资源，还可能导致样式冲突或不可预期的行为。通过检查是否已存在相同 ID 的样式元素，可以确保样式只被注入一次。

## 代码逐行解释

1. `const el = document.querySelector("bilibili-bangumi") as HTMLElement | null;` - 查找页面中的 `bilibili-bangumi` 元素。
2. `if (!el) return false;` - 如果没有找到 `bilibili-bangumi` 元素，则返回 `false`。
3. `const sr = (el as any).shadowRoot as ShadowRoot | null;` - 获取 `bilibili-bangumi` 元素的 Shadow DOM 根节点。
4. `if (!sr) return false;` - 如果没有找到 Shadow DOM 根节点，则返回 `false`。
5. `if (sr.getElementById("my-bbc-style")) return true;` - 检查是否已经注入过名为 `my-bbc-style` 的样式，如果已经注入过，则返回 `true`。这一步是防止重复注入的关键，避免了在同一个 Shadow DOM 中多次添加相同的样式，从而节省资源并防止样式冲突。
6. `const style = document.createElement("style");` - 创建一个 `<style>` 元素。
7. `style.id = "my-bbc-style";` - 为 `<style>` 元素设置 ID 为 `my-bbc-style`。
8. `style.textContent = `...`;` - 为 `<style>` 元素设置 CSS 样式内容。
9. `sr.appendChild(style);` - 将 `<style>` 元素添加到 Shadow DOM 中。
10. `return true;` - 返回 `true`，表示样式注入成功。

## 返回值说明

函数的返回值用于指示样式注入操作的结果：
- `false`：表示未找到 `bilibili-bangumi` 元素或其 Shadow DOM，注入操作未能进行。
- `true`：表示样式成功注入，或者样式已经存在（已注入过），无需重复注入。

## 使用场景

`injectShadowStyle` 函数通常在 Vue 组件的 `onMounted` 生命周期钩子中调用，以确保在组件挂载后注入样式。然而，由于现代前端框架的异步渲染特性，组件可能不会立即渲染到 DOM 中，这就需要通过 `MutationObserver` 监听 DOM 变化，在组件异步渲染完成后及时注入样式。

Shadow DOM 的异步创建特性意味着我们不能假设在组件挂载时 Shadow DOM 已经存在。某些组件可能会在挂载后的一段时间内才创建其 Shadow DOM，因此需要监听 DOM 变化来确保在 Shadow DOM 可用时能够及时注入样式。通过结合 `onMounted` 钩子和 `MutationObserver`，可以确保无论组件何时创建 Shadow DOM，样式都能被正确注入。