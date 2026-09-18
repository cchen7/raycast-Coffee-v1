<p align="center">
  <img src="./assets/logo.png" height="128" alt="Coffee V1 图标">
  <h1 align="center">Coffee V1</h1>
  <p align="center"><strong>保留 Raycast v1 的选择权。</strong></p>
</p>

Coffee V1 是面向 **Raycast 1.104.29 / macOS** 的社区兼容分支，让选择留在 v1 的用户继续使用 Coffee 防休眠扩展。

这个项目也是一次明确的抗议：**我们反对扩展升级切断旧版兼容性，把用户推向主程序升级；也反对在用户自带 API Key、自付模型 token 费用的基础上，给原有 BYOK AI Chat 使用方式新增软件订阅门槛。**

## 为什么会有这个项目

### Coffee 更新，让 v1 用户失去原有工具

Raycast Store 中的防休眠扩展叫 **Coffee**，底层使用 macOS 的 `caffeinate` 命令。

我们遇到的问题是：Coffee 更新后依赖了 Raycast API 2.x，留在 Raycast v1 的用户无法继续使用这个新版扩展。在我们核验的[上游版本](https://github.com/raycast/extensions/blob/2801380b5f250a8666c085b66ab890c620eb15ad/extensions/coffee/package.json)中，依赖已变为 `@raycast/api: ^2.1.2`，而我们的主程序是 **Raycast 1.104.29**。

一个原本能用的防休眠工具，更新之后却要求用户升级整个启动器。在我们看来，这形成了事实上的强制升级压力。**用户应该能够保留兼容的扩展版本，而不是因为一次扩展更新就失去继续使用旧版软件的选择。**

### 升到 v2，又遇到 BYOK 的额外付费门槛

我们选择保留 v1 的另一个原因，是升级到 v2 后，原有的 BYOK AI Chat 使用方式无法在不额外订阅 Raycast 的情况下继续使用。

截至 **2026-09-18**，Raycast 官方说明明确写道：

> With Raycast v2, Bring Your Own AI features require a paid Raycast plan: Pro, Pro+, or Max.

这项要求包括 BYOK（Bring Your Own Key）、自定义提供商、本地模型和自带订阅。[官方使用限制文档](https://manual.raycast.com/ai/usage-limits)同时说明，BYOK 的模型用量仍由模型提供商向用户的 API 账户计费。

因此，对使用自己的 API Key 的用户来说，继续在 v2 中使用这套 AI 功能，需要同时承担：

- 向模型提供商支付的 API / token 费用；
- 向 Raycast 支付的软件套餐费用。

Raycast 的解释是，前者覆盖模型，后者覆盖界面、上下文、集成、工具和执行层。这个解释可以在[官方政策说明](https://manual.raycast.com/ai/byoai)中查到。**我们的立场是：用户已经自行承担模型费用，不应因为一次版本升级，就必须再付软件订阅费才能继续原有的 BYOK 使用方式。**

### 我们希望保留什么

- 继续使用 Raycast v1 的自由。
- 获取并安装兼容旧版的开源扩展的能力。
- 在充分了解兼容性和收费变化后，自主决定是否升级。

这个 fork 是我们为这些选择做的一点实际工作：保留 Coffee 的 v1 兼容版本，公开源码、修改记录和测试结果，方便其他用户自行安装和维护。

本项目的功能范围是 **Coffee 防休眠扩展**；BYOK AI Chat 的收费变化是我们维护这个 fork 的动机之一。

## 兼容范围与改动

| 项目              | 当前状态                                   |
| ----------------- | ------------------------------------------ |
| 操作系统          | macOS                                      |
| 实测 Raycast 版本 | **1.104.29**                               |
| Raycast API       | 固定为 `1.104.25`                          |
| Raycast Utils     | 固定为 `2.2.2`                             |
| 扩展标识          | `coffee-v1`，界面名称 **Coffee V1**        |
| 上游基线          | `2801380b5f250a8666c085b66ab890c620eb15ad` |

主要改动：

- 移除 Windows 专用的 Rust 集成，恢复 macOS / API v1 兼容性。
- 保留上游截至 2026-09-17 的 macOS 功能与修复。
- 使用独立扩展标识，与 Store 版 Coffee 区分。
- 修复开发模式下 `Caffeinate Until` 重复启动两个防休眠进程的问题。

**实测版本是 1.104.29，不代表所有更早的 Raycast 1.x 版本都已验证。**

## 安装

需要已安装 **Raycast 1.104.29**、**Node.js 22.22.2 或更高版本**和 npm。请把源码放在准备长期保留的目录中。

```sh
git clone https://github.com/cchen7/raycast-Coffee-v1.git
cd raycast-Coffee-v1
npm ci
npm run build
npm run dev
```

`npm run build` 将构建结果输出到项目的 `dist/`；`npm run dev` 将本地扩展注册到 Raycast。加载完成后，搜索 **Coffee V1** 下的命令即可使用。可以按 `Ctrl+C` 停止开发监听；停止监听后命令仍可运行，这一点已实测。

使用前，请在 Raycast 扩展设置中停用原版 Coffee 的命令和后台计划。上游实现通过 `killall caffeinate` 停止防休眠，两份扩展以及其他使用 `caffeinate` 的程序会共享进程状态，不能当作互相隔离的工具运行。

偏好设置、快捷键和计划任务需要为 Coffee V1 重新配置。从 Store 安装 **Coffee** 获取的是上游版本，不是本仓库的兼容版。

卸载时，在 Raycast 的扩展设置中移除 **Coffee V1**。

## 功能

- **Caffeinate / Decaffeinate**：开启或停止防休眠。
- **Toggle Caffeinate**：切换防休眠状态。
- **Caffeinate for ...**：按小时、分钟、秒设置时长。
- **Caffeinate Until**：保持唤醒直到指定时间。
- **Caffeinate While**：在指定应用运行期间保持唤醒。
- **Schedule Caffeination**：配置、暂停、恢复和删除每周计划。
- **Caffeinate Status / Menu Bar**：显示状态及菜单栏入口。
- **Auto-Caffeinate on Launch**：可选的 Raycast 启动后自动防休眠。

计划输入示例：

```text
Monday and Tuesday from 09:00 to 18:00
Every day except Saturday and Sunday from 09:00 to 18:00
```

暂停的计划需要手动恢复。自动计划和启动后防休眠依赖相应后台命令启用；状态命令与菜单栏命令的配置刷新间隔均为 1 分钟。保留的 AI 工具仍取决于 Raycast 宿主提供的 AI 使用权限。

## 测试结果与已知限制

在 Raycast **1.104.29** 中，已验证安装、启动、手动停止、开关、定时退出、Until，以及计划任务的启动、暂停、恢复和结束逻辑。已确认实际产生了 macOS 防休眠进程和电源断言。

**20 项自动化测试、构建、TypeScript 检查和 Lint 已通过。**

尚未完整验证的部分包括菜单栏实际点击、应用选择与退出联动、后台计划在未来时间自动触发、启动自动防休眠和 AI 对话调用。菜单栏开发日志还出现过一次 `54s max` 执行超时，原因尚未确认。

请阅读 [TESTING.md](TESTING.md)，了解测试方法、发现并修复的问题以及验证边界。

## 开发与维护

```sh
npm test
npm run build
npm run lint
```

更新依赖时，请保留 Raycast API 和 Utils 的版本锁定，避免再次引入需要 v2 的依赖。欢迎针对 v1 兼容性提交 Issue 或 Pull Request。

## 致谢与许可证

Coffee 原始扩展由 **mooxl 和 Coffee 的贡献者们**开发。本项目保留上游署名、贡献者名单及 [MIT 许可证](LICENSE)。感谢开源贡献让我们能够维护这个兼容版本。

这是独立维护的非官方兼容分支。这里的抗议立场由本项目维护者表达，不代表上游作者或贡献者的观点。

## 相关来源

- [Coffee 上游源码及 API 依赖](https://github.com/raycast/extensions/tree/2801380b5f250a8666c085b66ab890c620eb15ad/extensions/coffee)
- [Raycast：Changes to Bring Your Own AI in v2](https://manual.raycast.com/ai/byoai)
- [Raycast：Usage Limits](https://manual.raycast.com/ai/usage-limits)
- [Raycast 定价页面](https://www.raycast.com/pricing)
