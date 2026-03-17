# React vs Vue：2025 年前端框架深度对比与实践指南

> **作者:** 技术博客  
> **发布时间:** 2025 年 2 月  
> **阅读时长:** 约 20 分钟  
> **适合读者:** 有一定 JavaScript 基础，想系统了解或选型前端框架的开发者

---

## 前言

在前端开发的世界里，React 和 Vue 是两个绕不开的名字。

React 由 Facebook（现 Meta）于 2013 年开源，凭借"一切皆组件"的理念和庞大的社区生态，成为全球最流行的前端 UI 库之一。Vue 由尤雨溪于 2014 年发布，以"渐进式框架"为核心理念，凭借低门槛、高效率的开发体验，尤其在国内开发者群体中拥有极高的拥趸。

时至今日，两者都已演进到相当成熟的版本——React 18（Concurrent Mode）与 Vue 3（Composition API）——但它们的设计哲学、使用体验、适用场景仍有本质区别。

本文将从**核心思想、语法风格、响应式机制、状态管理、生态系统、TypeScript 支持、工程化实践、性能表现**等多个维度，对两个框架进行深度对比，并在文末给出选型建议。

---

## 一、核心思想与定位

### React：UI Library，不是"全家桶"

React 官方将自己定位为"用于构建用户界面的 JavaScript 库（A JavaScript library for building user interfaces）"。这个定位非常克制——它只负责 View 层，其余的路由（React Router）、状态管理（Redux / Zustand）、请求封装（SWR / React Query）等都交由社区生态来解决。

这一设计背后是鲜明的函数式思想：

- **UI = f(state)** —— 视图是状态的纯函数映射
- **不可变数据（Immutability）** —— 修改状态需要创建新对象，而不是直接改变原有数据
- **单向数据流** —— 数据从父组件流向子组件，变化通过事件回调向上传递

React 本质上是教会你一套**用 JavaScript 思考 UI** 的方式，它的设计极度信任开发者，但也要求开发者有更强的自我约束和架构能力。

### Vue：渐进式框架，约定大于配置

Vue 将自己定位为"渐进式 JavaScript 框架（The Progressive JavaScript Framework）"。"渐进式"的意义在于：

- 可以只引入一个 `<script>` 标签，在已有的 HTML 页面中局部使用 Vue
- 也可以配合 Vue Router、Pinia、Nuxt.js，构建完整的大型 SPA 或 SSR 应用

Vue 提供了一套**约定清晰的官方方案**，从路由到状态管理，到脚手架，都有官方维护的库。这大幅减少了团队的选型成本，降低了新人接入的门槛。

Vue 的核心理念是**数据驱动视图 + 响应式系统**：开发者修改数据，框架自动完成视图同步，而无需开发者手动 diff 或描述如何更新视图。

> **关键区别总结**：React 是"给你一块积木底板和几块基础积木，剩下自己搭"；Vue 是"给你一套乐高套装，每块积木都设计好了该怎么用"。

---

## 二、语法风格：JSX vs 单文件组件（SFC）

这是两个框架最直观的差异，也是很多开发者选型时的第一道门槛。

### React：一切皆 JavaScript（JSX）

React 使用 **JSX（JavaScript XML）** 语法，将视图描述嵌入 JavaScript 中：

```jsx
// React 函数组件示例
import { useState } from 'react';

function UserCard({ name, avatar }) {
  const [liked, setLiked] = useState(false);

  return (
    <div className="user-card">
      <img src={avatar} alt={name} />
      <h2>{name}</h2>
      <button 
        className={liked ? 'btn-liked' : 'btn-like'}
        onClick={() => setLiked(!liked)}
      >
        {liked ? '已点赞 ❤️' : '点赞 🤍'}
      </button>
    </div>
  );
}

export default UserCard;
```

JSX 的核心优势：

- **逻辑与视图同处一地**，条件渲染、列表渲染都是 JS 表达式，极为灵活
- 支持 **TypeScript 强类型推导**，从 props 到事件处理函数，类型覆盖非常完善
- **组件抽象和复用**更容易：高阶组件（HOC）、Render Props、自定义 Hooks 都是纯 JS 技巧

但 JSX 也有学习成本：

- 对没有函数式编程背景的开发者，理解"UI 是函数返回值"需要一些思维转变
- 逻辑与模板混写，可读性需要靠好的代码规范来保障

### Vue：模板语法 + 单文件组件（.vue）

Vue 使用 **单文件组件（SFC）**，将模板（`<template>`）、逻辑（`<script>`）、样式（`<style>`）分区封装在同一个 `.vue` 文件中：

```vue
<!-- Vue 3 Composition API 示例 -->
<template>
  <div class="user-card">
    <img :src="avatar" :alt="name" />
    <h2>{{ name }}</h2>
    <button 
      :class="liked ? 'btn-liked' : 'btn-like'"
      @click="toggleLike"
    >
      {{ liked ? '已点赞 ❤️' : '点赞 🤍' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  name: string;
  avatar: string;
}>();

const liked = ref(false);

function toggleLike() {
  liked.value = !liked.value;
}
</script>

<style scoped>
.user-card {
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
```

Vue SFC 的核心优势：

- **结构直观清晰**，三段式分区让组件职责一眼可辨，对后端开发者或初学者非常友好
- `<style scoped>` 天然支持样式隔离，避免全局样式污染
- 模板语法（`v-if`、`v-for`、`:bind`、`@event`）接近 HTML，学习曲线平缓

不足：

- 模板语法相比 JSX 在复杂逻辑分支上表达力略弱（虽然 `<script setup>` 已大幅改善）
- 模板中的 TS 类型推导有时不如 JSX 精准（尤其在复杂泛型场景）

---

## 三、响应式机制：Hooks vs Proxy

### React：显式状态管理（Hooks 机制）

React 本身**没有"响应式系统"**，状态变化需要开发者通过 `setState` 或 Hooks 显式触发，然后组件重新执行（重新渲染）。

React Hooks 是 React 16.8 引入的革命性特性，使函数组件获得了完整的状态和生命周期能力：

```jsx
import { useState, useEffect, useMemo, useCallback } from 'react';

function DataTable({ userId }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  // 副作用：数据获取
  useEffect(() => {
    setLoading(true);
    fetchUserData(userId).then(res => {
      setData(res);
      setLoading(false);
    });
  }, [userId]); // 依赖数组：userId 变化时重新执行

  // 计算属性：基于 data 和 filter 派生
  const filteredData = useMemo(() => {
    return data.filter(item => item.name.includes(filter));
  }, [data, filter]);

  // 稳定的回调引用，避免子组件不必要的重渲染
  const handleFilterChange = useCallback((val) => {
    setFilter(val);
  }, []);

  return (/* ... */);
}
```

常用 Hooks 汇总：

| Hook | 用途 |
|------|------|
| `useState` | 声明局部状态 |
| `useEffect` | 处理副作用（数据请求、订阅、DOM 操作） |
| `useContext` | 消费 Context 中的共享数据 |
| `useReducer` | 复杂状态逻辑，类似 Redux 的 Reducer 模式 |
| `useMemo` | 计算属性缓存，避免重复计算 |
| `useCallback` | 稳定函数引用，优化子组件 re-render |
| `useRef` | 访问 DOM 节点 / 保存不触发重渲染的可变值 |
| 自定义 Hooks | 封装逻辑复用单元，是 React 代码复用的核心方式 |

**Hooks 的核心思想：将"状态"和"副作用"分离，通过组合多个 Hooks 构建组件逻辑。**

---

### Vue 3：响应式系统（Proxy-based Reactivity）

Vue 3 使用 `Proxy` 实现了**深度响应式系统**，响应式数据的追踪和更新是自动的：

```vue
<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue';

// ref：基本类型响应式包装
const filter = ref('');

// reactive：对象类型响应式
const state = reactive({
  data: [],
  loading: true,
});

// computed：自动追踪依赖的计算属性
const filteredData = computed(() => {
  return state.data.filter(item => item.name.includes(filter.value));
});

// watch：监听数据变化执行副作用
watch(filter, (newVal, oldVal) => {
  console.log(`筛选条件从 "${oldVal}" 变更为 "${newVal}"`);
});

// 生命周期钩子
onMounted(async () => {
  state.data = await fetchData();
  state.loading = false;
});
</script>
```

Vue Composition API 核心 API：

| API | 用途 |
|-----|------|
| `ref()` | 基本类型（number、string、boolean）响应式包装 |
| `reactive()` | 对象 / 数组类型深度响应式 |
| `computed()` | 带缓存的计算属性 |
| `watch()` | 副作用监听，精细控制何时执行 |
| `watchEffect()` | 自动追踪依赖的副作用，类似 React `useEffect` |
| `onMounted / onUnmounted` | 生命周期钩子 |
| `provide / inject` | 跨层级数据传递 |

**Vue 响应式的核心优势**：开发者只需关心数据本身，不需要像 React 那样刻意管理"依赖数组"，框架会自动追踪哪些数据被使用，并精确更新。

> **React 的心智模型**："告诉我什么变了，我来更新"（显式）  
> **Vue 的心智模型**："你随时改数据，我自动帮你更新"（隐式 + 自动）

---

## 四、状态管理：Redux / Zustand vs Pinia

### React 状态管理生态

React 没有官方状态管理方案，生态中存在多种选择：

**Redux（老牌、严格、企业级）**

```javascript
// Redux Toolkit（现代推荐写法）
import { createSlice, configureStore } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: state => { state.value += 1; },
    decrement: state => { state.value -= 1; },
  }
});

export const store = configureStore({
  reducer: { counter: counterSlice.reducer }
});
```

**Zustand（轻量、简洁、现代）**

```javascript
import { create } from 'zustand';

const useCounterStore = create((set) => ({
  count: 0,
  increment: () => set(state => ({ count: state.count + 1 })),
  decrement: () => set(state => ({ count: state.count - 1 })),
}));

// 组件中使用
function Counter() {
  const { count, increment } = useCounterStore();
  return <button onClick={increment}>{count}</button>;
}
```

其他常见方案还包括：**Recoil**（原子状态模型）、**Jotai**（类 Recoil 但更轻量）、**MobX**（响应式风格）、**React Query / SWR**（专注于服务端状态管理）。

选择过多是把双刃剑：给了架构师极大灵活性，却也带来了"技术选型焦虑"。

### Vue 状态管理：Pinia（官方推荐）

Pinia 是 Vue 官方推荐的状态管理库（Vuex 的继任者），API 极为简洁：

```typescript
// stores/counter.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useCounterStore = defineStore('counter', () => {
  // state
  const count = ref(0);

  // getters（计算属性）
  const doubled = computed(() => count.value * 2);

  // actions
  function increment() {
    count.value++;
  }

  return { count, doubled, increment };
});
```

```vue
<!-- 组件中使用 -->
<script setup>
import { useCounterStore } from '@/stores/counter';
const counter = useCounterStore();
</script>

<template>
  <button @click="counter.increment">{{ counter.count }}</button>
</template>
```

Pinia 的优势：

- 完全基于 Composition API，学习成本几乎为零
- 原生 TypeScript 支持，类型推导一流
- DevTools 深度集成，状态变化可追踪、可时间旅行
- 支持模块化，每个 Store 天然独立，按需导入

---

## 五、生态系统对比

### React 生态：繁荣而自由

React 生态极度繁荣，覆盖前端开发所有方向：

| 领域 | 主流方案 |
|------|---------|
| 路由 | React Router v6、TanStack Router |
| 状态管理 | Redux Toolkit、Zustand、Jotai、Recoil |
| 数据请求 | React Query（TanStack Query）、SWR、Apollo（GraphQL） |
| UI 组件库 | Ant Design、MUI（Material UI）、shadcn/ui、Radix UI |
| 全栈框架 | Next.js（SSR / SSG / App Router）、Remix、Gatsby |
| 测试 | React Testing Library、Vitest、Jest、Cypress |
| 样式方案 | Tailwind CSS、CSS Modules、styled-components、Emotion |
| 表单 | React Hook Form、Formik |
| 动画 | Framer Motion、React Spring |

生态庞大的代价是**选型复杂度高**，没有"最佳实践"，一切靠团队约定。

### Vue 生态：精致而聚焦

Vue 官方维护的核心生态极为完善：

| 领域 | 主流方案 |
|------|---------|
| 路由 | Vue Router（官方） |
| 状态管理 | Pinia（官方）、Vuex 4（旧项目） |
| 数据请求 | VueUse 集成的 useFetch、Axios + 封装 |
| UI 组件库 | Element Plus（PC）、Vant（移动端）、Naive UI、Arco Design |
| 全栈框架 | Nuxt.js 3（SSR / SSG / 全栈）、VitePress（文档站） |
| 测试 | Vitest（官方推荐）、Vue Test Utils |
| 样式方案 | Tailwind CSS、UnoCSS（Vue 社区偏爱）、Scoped CSS |
| 表单 | VeeValidate、FormKit |
| 工具库 | VueUse（200+ Composable，相当于 React 生态的 ahooks） |

Vue 的生态虽不及 React 庞大，但**覆盖日常业务场景绰绰有余**，且选型标准更统一，团队协作成本更低。

---

## 六、TypeScript 支持

TypeScript 已经成为大型前端项目的事实标准，两个框架对 TS 的支持都有显著提升。

### React + TypeScript

React 与 TS 的整合相当自然，因为 JSX 本质是 JS，TS 可以完整覆盖：

```tsx
// Props 类型定义
interface ButtonProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button: React.FC<ButtonProps> = ({ 
  label, 
  variant = 'primary', 
  disabled = false, 
  onClick 
}) => {
  return (
    <button
      className={`btn btn-${variant}`}
      disabled={disabled}
      onClick={onClick}
    >
      {label}
    </button>
  );
};
```

React 的 TS 支持优势：

- 社区积累了大量 TS 使用模式和类型技巧
- `@types/react` 类型定义非常完善，基本无盲区
- 自定义 Hooks 与泛型结合，可以实现非常优雅的类型推导

### Vue 3 + TypeScript

Vue 3 的 `<script setup lang="ts">` 是目前最流畅的 Vue TS 写法：

```vue
<script setup lang="ts">
// defineProps 泛型语法（Vue 3.3+）
const props = defineProps<{
  label: string;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}>();

// withDefaults 提供默认值
withDefaults(defineProps<{ variant?: string }>(), {
  variant: 'primary',
});

// defineEmits 类型定义
const emit = defineEmits<{
  click: [event: MouseEvent];
  change: [value: string];
}>();
</script>
```

Vue TS 注意点：

- Vue 3.3+ 引入了宏语法（`defineProps` 泛型、`defineEmits` 类型标注），类型体验大幅提升
- 模板中的类型推导依赖 Volar 插件（VS Code），整体已相当成熟
- 复杂泛型组件（如高级列表、表单生成器）的类型推导有时需要额外技巧

---

## 七、服务端渲染（SSR）能力

现代应用对 SEO、首屏性能的需求日益增长，SSR（服务端渲染）和 SSG（静态站点生成）已成为刚需。

### React：Next.js 生态

Next.js 是 React SSR/SSG 的标准答案，由 Vercel 开发维护，已几乎成为"React 全栈框架"的代名词：

- **App Router（Next.js 13+）**：基于 React Server Components（RSC），实现组件级别的服务端/客户端混合渲染
- **多种渲染模式**：SSR（每请求渲染）、SSG（构建时生成）、ISR（增量静态再生）
- **内置优化**：图片优化（`<Image>`）、字体优化、路由预取、代码分割
- **边缘计算**：支持部署至 Edge Runtime（Cloudflare Workers、Vercel Edge 等）

```jsx
// Next.js App Router Server Component 示例
// 这个组件在服务端执行，直接 await 数据
async function ProductPage({ params }) {
  const product = await fetchProduct(params.id); // 服务端直接请求数据库
  
  return (
    <main>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
    </main>
  );
}
```

### Vue：Nuxt.js 生态

Nuxt.js 3 是 Vue 生态的 SSR/全栈框架，与 Next.js 功能对位：

- **自动路由**：基于文件系统的路由约定，无需手动配置 `vue-router`
- **通用渲染（Universal Rendering）**：同一组件在服务端和客户端都能运行
- **Nitro 服务引擎**：支持多种部署目标（Node.js、Cloudflare、Vercel、Netlify 等）
- **Nuxt Modules**：丰富的官方和社区模块（图片优化、i18n、SEO 等）

```vue
<!-- Nuxt 3 页面组件示例（pages/products/[id].vue） -->
<script setup lang="ts">
// useFetch 自动在服务端/客户端间共享数据，避免重复请求
const { data: product } = await useFetch(`/api/products/${useRoute().params.id}`);
</script>

<template>
  <main>
    <h1>{{ product?.name }}</h1>
    <p>{{ product?.description }}</p>
  </main>
</template>
```

---

## 八、性能表现

性能话题需要避免"哪个框架更快"的简单化结论。**在日常业务场景下，React 和 Vue 的性能差异几乎感知不到**，真正影响性能的往往是代码写法，而非框架本身。

### 框架层面的性能机制

| 维度 | React | Vue |
|------|-------|-----|
| 渲染机制 | Virtual DOM + Fiber 调度 | Virtual DOM + Proxy 响应式 |
| 更新粒度 | 组件树级别重渲染（需开发者优化） | 组件级别精确更新（自动） |
| 编译优化 | 运行时为主 | 编译时 + 运行时（静态提升、补丁标记） |
| 并发特性 | React 18 Concurrent Mode（startTransition、Suspense） | Vue 3 异步组件 + Suspense |

### React 的性能陷阱与优化

React 的"重渲染"机制要求开发者主动优化：

```jsx
// ❌ 问题：每次父组件渲染，ExpensiveChild 都会重渲染
function Parent() {
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
      <ExpensiveChild /> {/* 即使 props 未变，也会重渲染 */}
    </>
  );
}

// ✅ 优化：使用 React.memo 缓存组件渲染结果
const ExpensiveChild = React.memo(function ExpensiveChild() {
  return <div>复杂渲染内容</div>;
});

// ✅ 优化：useCallback 稳定函数引用
const handleClick = useCallback(() => {
  // ...
}, [依赖]);
```

### Vue 的性能优势

Vue 的响应式系统可以做到**精准更新**，只重渲染依赖了变化数据的组件：

```vue
<script setup>
const count = ref(0);
const expensiveValue = computed(() => {
  // 只在 count 变化时重新计算，结果会被缓存
  return heavyComputation(count.value);
});
</script>
```

Vue 编译器还会进行**静态提升（Static Hoisting）**，将不含动态绑定的节点提升到渲染函数外部，只创建一次，避免重复创建开销。

### 实际性能结论

- 对**大多数业务项目**，两者性能差异可忽略
- React 需要开发者更主动地进行性能优化（`memo`、`useMemo`、`useCallback`）
- Vue 在**精细响应式更新**场景有天然优势，且默认情况下性能表现更稳定
- 极端性能场景（超大列表、高频更新的图表）两者都需要虚拟滚动等特殊处理

---

## 九、学习曲线与开发体验

### Vue：更平滑的学习曲线

**第 1 周能上手的内容：**
- 模板语法（`v-if`、`v-for`、`v-model`、`v-bind`、`v-on`）
- 组件定义、Props 与 Emits
- `ref` / `reactive` 基础响应式
- Vue Router 基础路由配置

**第 1 个月能掌握的内容：**
- Composition API 组织复杂组件逻辑
- Pinia 状态管理
- 自定义 Composable 封装逻辑复用
- 配合 Vite + TypeScript 工程化开发

### React：更陡峭但收益更持久

**学习 React 需要理解的核心概念：**

```
JSX 语法
    ↓
函数组件与组件树
    ↓
Props（父 → 子）+ 事件回调（子 → 父）
    ↓
useState（局部状态）
    ↓
useEffect（副作用）+ 依赖数组
    ↓
useContext（跨组件状态共享）
    ↓
useMemo + useCallback（性能优化）
    ↓
自定义 Hooks（逻辑复用）
    ↓
全局状态管理（Redux / Zustand）
    ↓
React Router + 数据层（React Query / SWR）
```

每一层都需要真正理解，而不能只靠"记住写法"。React 的学习是一个**系统性构建思维模型**的过程，初期费力，但理解后可以用 JavaScript 的极限来表达 UI 逻辑。

---

## 十、框架的哲学差异

理解两个框架的深层区别，可以帮助我们在选型和学习时不再迷茫。

### React 的哲学：极简核心 + 组合优先

React 相信"少约定、多组合"。它的核心 API 保持精简（`createElement`、`useState`、`useEffect` 等基础 Hooks），其余一切通过组合来构建。

这种哲学下，**一切都是函数，一切都是组合**：
- 组件 = 函数
- 高阶组件 = 接收函数、返回函数
- 自定义 Hooks = 可复用的逻辑函数
- 状态管理 = 订阅-发布的函数组合

### Vue 的哲学：直觉优先 + 渐进增强

Vue 相信"让开发者做最少的心智体操"。模板语法接近 HTML，响应式系统屏蔽底层细节，官方工具链减少选型困扰。

Vue 的核心价值是**开发体验（DX）**：响应式数据修改即生效、模板调试直观、组件 SFC 结构清晰——让开发者把精力放在业务逻辑上，而不是框架机制上。

---

## 十一、选型指南：2025 年如何做决定

实际项目选型时，没有绝对的"对错"，只有更适合自己场景的选择。

### 选 React 的场景

- ✅ 团队已有 React 技术积累或组件库资产
- ✅ 项目规模大、生命周期长，需要高度工程化和规范化
- ✅ 团队成员具备较强的 JS/TS 基础，接受函数式编程理念
- ✅ 需要深度定制 UI（自建设计系统、组件库），倾向于用 headless 组件方案
- ✅ 使用 Next.js 做全栈 / SEO 优先的项目
- ✅ 技术生态中已经大量使用 GraphQL 或其他 React 友好的技术栈

### 选 Vue 的场景

- ✅ 团队前端经验参差不齐，需要低门槛快速上手
- ✅ 项目以国内企业中后台为主（Element Plus / Arco Design 生态完善）
- ✅ 希望官方全家桶解决方案，减少选型和维护成本
- ✅ 需要快速交付 MVP 或原型
- ✅ 团队有较多后端开发者兼做前端，模板语法对他们更友好
- ✅ 使用 Nuxt.js 做 SEO 友好的内容型网站

### 关于"学哪个更有前途"

这是一个常见但意义不大的问题。两者都是全球主流框架，在可预见的未来都不会消亡。

更务实的建议：
1. **先选一个学深**，不要浅尝辄止
2. 学会一个后，另一个会快很多（核心概念高度相通）
3. 掌握框架背后的**设计原理**（响应式、Virtual DOM、组件化、状态管理），比记住 API 更重要

---

## 结语

React 和 Vue，是两位个性鲜明的"工匠"。

**React** 像一位严谨的软件工程师，给你一套精简但严格的工具体系，相信你有能力构建出一切；在工程化、规范化、大型团队协作上，它提供了无与伦比的灵活度和表达力。

**Vue** 像一位注重体验的产品设计师，把最好用的工具组合好摆在你面前，让你以最低的认知负担快速构建出优质的产品；在开发效率、上手体验、官方约定上，它是当之无愧的"最佳开发者体验奖"。

两者没有高下之分，只有"当下场景下更合适的选择"。最好的前端开发者，往往两者都能熟练驾驭，并在适当的时机做出正确的选型判断。

**技术是手段，交付价值才是目的。**

---

## 参考资料

- [React 官方文档](https://react.dev)
- [Vue 3 官方文档](https://vuejs.org)
- [Next.js 官方文档](https://nextjs.org)
- [Nuxt 3 官方文档](https://nuxt.com)
- [Pinia 官方文档](https://pinia.vuejs.org)
- [TanStack Query](https://tanstack.com/query)
- [State of JavaScript 2024](https://stateofjs.com)
- [VueUse](https://vueuse.org)

---

*本文写于 2025 年 2 月，基于 React 18、Vue 3.4、Next.js 14、Nuxt 3.x 版本。框架特性随版本迭代持续演进，建议结合官方文档获取最新信息。*
