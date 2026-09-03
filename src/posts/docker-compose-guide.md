---
title: Docker 与 Docker Compose 实战指南 — 从入门到管理多容器项目
date: 2026-09-03
tags: [Docker, 部署, 后端, 工具]
category: 后端
summary: 深入理解 Docker 的核心概念与常用命令，学会用 Dockerfile 构建镜像，并用 Docker Compose 一句话启动和管理多容器项目。包含从零搭建一个前后端分离应用的可运行示例与常见坑点。
---

# Docker 与 Docker Compose 实战指南

> "在我机器上明明能跑啊。" —— 每个开发者都说过的话。

Docker 就是为了终结这句话而生的。它把应用连同运行环境一起打包成**镜像**，在任何装有 Docker 的机器上都能以相同的方式运行，从本地开发到服务器部署，一次构建，处处运行。

## 为什么需要 Docker

### 传统开发的痛点

- **环境不一致**：开发、测试、生产的环境从未真正一样过。
- **依赖地狱**：A 项目要 Python 3.8，B 项目要 3.10，一台机器装不下。
- **难部署**：逐个安装依赖、配置服务，出错难以排查。
- **难迁移**：换台机器就要重新配一遍。

### Docker 的核心思想

Docker 用**容器（Container）**来隔离应用。一个容器就是一个轻量级的"微型虚拟机"，但它直接复用宿主机的内核，启动快、占用小，秒级启动。

对比一下：

| 特性 | 虚拟机 (VM) | Docker 容器 |
|------|-------------|-------------|
| 启动速度 | 分钟级 | 秒级 |
| 资源占用 | 完整操作系统 | 共享宿主机内核 |
| 体积 | GB 级 | MB 级 |
| 性能 | 有损耗 | 接近原生 |
| 隔离性 | 强 | 较弱（共享内核） |

## 核心概念

先建立三个关键概念，后面所有命令都围绕它们：

- **镜像（Image）**：一个只读的"模板"，包含应用代码、运行环境、依赖等。可以理解为"安装包"。
- **容器（Container）**：镜像的"运行实例"。同一个镜像可以启动多个容器。
- **仓库（Registry）**：存放镜像的地方。最常用的是 [Docker Hub](https://hub.docker.com)。

关系类比：镜像像**类**，容器像**对象**；也像**菜谱**和**做出来的菜**。

## 安装 Docker

### Linux

参考官方一键脚本（以 Ubuntu 为例）：

```bash
# 安装 Docker Engine + Compose 插件
curl -fsSL https://get.docker.com | sh

# 将当前用户加入 docker 组，免 sudo
sudo usermod -aG docker $USER
# 注销重新登录后生效

# 验证
docker --version
docker compose version
```

### macOS / Windows

直接下载安装 [Docker Desktop](https://www.docker.com/products/docker-desktop/)，它自带 Docker Engine 和 Docker Compose。

验证是否安装成功：

```bash
docker --version
docker compose version
```

## 常用命令速查

### 镜像操作

```bash
# 拉取镜像
docker pull nginx

# 列出本地镜像
docker images

# 删除镜像
docker rmi nginx
```

### 容器操作

```bash
# 运行容器（前台）
docker run nginx

# 后台运行，映射端口，命名容器
docker run -d --name my-nginx -p 8080:80 nginx

# 列出运行中的容器
docker ps

# 列出所有容器（含已停止）
docker ps -a

# 进入容器
docker exec -it my-nginx bash

# 查看日志
docker logs my-nginx

# 停止 / 启动 / 重启
docker stop my-nginx
docker start my-nginx
docker restart my-nginx

# 删除容器
docker rm my-nginx
```

### 端口与数据持久化

```bash
# -p 宿主机端口:容器端口
# -v 宿主机目录:容器目录   （数据卷，数据不随容器删除而丢失）
# -e 环境变量

docker run -d --name app \
  -p 3000:3000 \
  -v /my/data:/app/data \
  -e NODE_ENV=production \
  my-app:latest
```

## 编写 Dockerfile

Dockerfile 是一个文本文件，用来**构建自己的镜像**。以 Node.js 应用为例：

```dockerfile
# 基于官方 Node 镜像
FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 先拷贝依赖清单（利用缓存，代码没变时不用重装依赖）
COPY package*.json ./
RUN npm install

# 拷贝应用代码
COPY . .

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["node", "server.js"]
```

### 构建与运行

```bash
# 构建镜像（-t 指定名字和标签）
docker build -t my-app:1.0 .

# 运行
docker run -d --name my-app -p 3000:3000 my-app:1.0
```

### 多阶段构建（减小体积）

```dockerfile
# 第一阶段：构建
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 第二阶段：运行（只保留产物）
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm install --omit=dev
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

多阶段构建能显著精简最终镜像，去掉构建期才需要的工具和依赖。

### 推荐优化

- **利用缓存**：把 `COPY package*.json` 放在 `COPY .` 之前，依赖没变时命中最快。
- **用 alpine 镜像**：体积更小。
- **`.dockerignore`**：和 `.gitignore` 类似，排除 `node_modules`、`dist`、`.git` 等，加快构建。

```dockerignore
node_modules
dist
.git
*.md
```

## 为什么需要 Docker Compose

前面用一个命令启动单个容器还可以，但真实项目往往是**多容器协作**：前端 + 后端 + 数据库 + 缓存 + 消息队列……

如果每个容器都手敲一遍 `docker run`，参数一大堆，而且**容器之间要互相访问、顺序启动、共享网络**，手动管理根本不可维护。

**Docker Compose** 就是来解决这个问题的：用一个 `docker-compose.yml` 文件声明所有服务，一条命令**同时构建、启动、串联**整个项目。

## Docker Compose 基础

### docker-compose.yml 结构

```yaml
version: "3.8"

services:
  web:
    build: .                # 通过 Dockerfile 构建
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:             # 依赖关系，先启动 db
      - db

  db:
    image: postgres:15     # 直接用官方镜像
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_PASSWORD=secret
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:                  # 命名数据卷，持久化数据
```

> `version` 字段在新版 Compose 里已不推荐写，但老教程里常见，看到不用意外。

### 常用命令

```bash
# 后台启动整个项目
docker compose up -d

# 前台启动（看日志）
docker compose up

# 停止并移除容器、网络（数据卷默认保留）
docker compose down

# 停止并清除数据卷（危险！删库）
docker compose down -v

# 查看服务状态
docker compose ps

# 查看日志
docker compose logs -f

# 重新构建后启动
docker compose up -d --build

# 进入某个服务的容器
docker compose exec web bash

# 查看配置
docker compose config
```

### 服务间通信

在 Compose 网络里，服务之间用**服务名**作为主机名互相访问。上面例子里，`web` 服务访问数据库就用 `db`：

```js
// web 端连接数据库时
const pool = new Pool({
  host: 'db',          // 不是 localhost，而是 db 服务名
  port: 5432,
  user: 'app',
  password: 'secret',
  database: 'appdb',
})
```

## 实战：一个前后端分离的全栈应用

我们用 Compose 编排三个服务：

- `frontend`：Vue 3 前端（容器内用 nginx 托管构建产物）
- `backend`：Node.js API
- `db`：PostgreSQL 数据库

### 项目结构

```
fullstack/
├── frontend/            # Vue 前端
│   ├── Dockerfile
│   └── ...
├── backend/             # Node API
│   ├── Dockerfile
│   └── ...
├── docker-compose.yml
└── .env
```

### 1. 数据库服务

```yaml
services:
  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=${DB_NAME}
    volumes:
      - db-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 5s
      timeout: 5s
      retries: 5
```

用 `healthcheck` 做健康检查，避免后端在数据库还没就绪时就启动。

### 2. 后端服务

```yaml
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=postgres://${DB_USER}:${DB_PASSWORD}@db:5432/${DB_NAME}
      - NODE_ENV=production
    depends_on:
      db:
        condition: service_healthy   # 等数据库健康后再启动
```

### 3. 前端服务

```yaml
  frontend:
    build: ./frontend
    ports:
      - "8080:80"
    depends_on:
      - backend
```

### 4. 环境变量文件 `.env`

把敏感信息放在 `.env` 里，用 `${变量}` 引用，避免写死在 yml 里：

```env
DB_USER=app
DB_PASSWORD=change-me-in-prod
DB_NAME=appdb
```

### 5. 启动

```bash
docker compose up -d --build

# 查看状态
docker compose ps

# 看日志
docker compose logs -f
```

现在访问 `http://localhost:8080` 看前端，`http://localhost:5000` 调 API。整个项目，**一条命令全部拉起**。

## 更多实用技巧

### 常用命令别名

```bash
alias dc='docker compose'
dc up -d
dc ps
dc logs -f
```

### 查看资源占用

```bash
docker stats
```

### 清理无用的镜像和容器

```bash
# 清掉所有已停止的容器
docker container prune

# 清掉所有悬空镜像
docker image prune

# 一键清理（慎用）
docker system prune -a
```

### 实际部署到服务器

同样的 `docker-compose.yml` 直接拷到服务器，装好 Docker 后：

```bash
git pull
docker compose up -d --build
```

镜像自动拉取、构建、启动，**服务器上无需再装任何语言运行时**。这也是 Docker 最大的价值之一。

## 常见坑点

### 1. 容器里访问不到 localhost

容器内的 `localhost` 是**容器自己**，不是宿主机。要访问其他服务，用服务名（`db`、`backend`），或者用 `host.docker.internal` 访问宿主机。

### 2. 数据卷没挂载，容器一删数据没了

数据库、上传文件必须在 `volumes` 里持久化，否则 `docker compose down` 后数据丢失。

### 3. 端口被占用

`ports: "3000:3000"` 左边是宿主机端口，被占用会报错。改左边或先 `docker ps` 看谁占用了。

### 4. 依赖服务没就绪就启动

启动顺序 ≠ 就绪顺序。用 `depends_on` 的 `condition: service_healthy` 配合 `healthcheck`，等真正就绪再启动下游。

### 5. 时区/编码问题

容器默认 UTC。需要时通过 `TZ` 环境变量或挂载 `/etc/localtime` 设置时区。

## 小结

- **Docker** 用镜像和容器让应用"一次构建，处处运行"，告别环境差异。
- 用 **Dockerfile** 把应用定制成自己的镜像，善用多阶段构建和缓存来瘦身提速。
- 当项目有多个服务时，**Docker Compose** 用一份 `docker-compose.yml` 搞定所有服务的编排、网络和持久化，一条命令启动整个项目。
- 部署时把同样的配置文件带到服务器，`docker compose up -d --build` 即可上线。

从"在我机器上能跑"到"在云端也能跑"，你只差一个 Dockerfile 和一个 compose 文件。

---

**相关资源：**
- [Docker 官方文档](https://docs.docker.com)
- [Docker Hub](https://hub.docker.com)
- [Docker Compose 官方文档](https://docs.docker.com/compose/)
- [Compose 规范文件参考](https://docs.docker.com/compose/compose-file/)

如果这篇文章对你有帮助，欢迎在下方留言，一起交流 Docker 的最佳实践。
