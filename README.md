# Scam Database Extractor

一个用于更新、拆解和转换多个来源黑名单数据的工具，生成指定格式的黑名单数据。

## 项目简介

本项目从多个上游仓库中提取和整合区块链相关的黑名单数据，包括钓鱼网站域名和恶意地址。它会定期检查上游仓库的更新，并自动同步和处理最新的黑名单数据，生成标准化的格式供下游应用使用。

### 数据来源

目前支持的数据来源：

1. [MetaMask/eth-phishing-detect](https://github.com/MetaMask/eth-phishing-detect) - MetaMask 官方维护的钓鱼网站黑名单
2. [scamsniffer/scam-database](https://github.com/scamsniffer/scam-database) - Scam Sniffer 维护的恶意地址和钓鱼网站数据库

### 输出格式

本项目生成以下格式的黑名单数据：

1. Little Snitch 格式的域名黑名单 (`little-snitch-blocklist.json`)
2. 恶意地址黑名单 (`black-address.json`)

## 项目结构

```
scam-database-extractor/
├── .github/workflows/         # GitHub Actions 工作流配置
│   ├── check_upstream.yml     # 检查上游仓库更新的工作流
│   ├── eth_phishing_detect_sync_upstream.yml  # 同步 eth-phishing-detect 数据的工作流
│   └── scam_database_sync_upstream.yml        # 同步 scam-database 数据的工作流
├── eth-phishing-detect/       # MetaMask 钓鱼网站黑名单处理模块
│   ├── index.js               # 处理 MetaMask 黑名单的脚本
│   └── little-snitch-blocklist.json  # 生成的 Little Snitch 格式黑名单
├── scam-database/             # Scam Sniffer 黑名单处理模块
│   ├── index.js               # 处理 Scam Sniffer 黑名单的脚本
│   ├── black-address.json     # 生成的恶意地址黑名单
│   └── little-snitch-blocklist.json  # 生成的 Little Snitch 格式黑名单
└── package.json               # 项目依赖和脚本配置
```

## 自动化流程

本项目使用 GitHub Actions 实现自动化流程：

1. **定期检查上游仓库更新**：每小时检查一次上游仓库是否有更新
2. **自动同步上游数据**：当检测到上游仓库更新时，自动触发同步工作流
3. **数据处理和转换**：从上游仓库提取数据，并转换为标准格式
4. **自动提交更新**：处理完成后，自动提交更新的黑名单数据

## 使用方法

### 安装依赖

```bash
npm install
```

### 手动运行数据提取

提取 MetaMask 钓鱼网站黑名单：

```bash
npm run extract-eth-phishing
```

提取 Scam Sniffer 黑名单数据：

```bash
npm run extract-scam-database
```

提取所有数据源：

```bash
npm run extract-all
```

### 手动触发工作流

也可以在 GitHub 仓库页面手动触发工作流：

1. 进入 Actions 标签页
2. 选择需要运行的工作流
3. 点击 "Run workflow" 按钮

## 配置

本项目需要以下 GitHub Secrets 配置：

- `REPO_ACCESS_TOKEN`: 用于提交更新到仓库的 GitHub 访问令牌

## 贡献指南

欢迎提交 Pull Request 或 Issue 来改进本项目。如需添加新的黑名单数据源，请参考现有模块的实现方式。

## 许可证

[MIT License](LICENSE)