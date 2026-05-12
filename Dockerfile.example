# ============================================
# 第一阶段：构建阶段（编译代码，生成产物）
# ============================================
# 使用 Node.js 22 精简镜像作为基础，命名为 builder
FROM node:22-slim AS builder

# 安装 OpenSSL（Prisma 运行时需要）
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# 启用 corepack 并安装 pnpm（Node.js 自带的包管理器）
RUN corepack enable && corepack prepare pnpm@latest --activate

# 设置工作目录为 /app
WORKDIR /app

# 先拷贝依赖描述文件（利用 Docker 缓存，依赖没变就不重新安装）
COPY package.json pnpm-lock.yaml .npmrc ./
# 安装所有依赖（--frozen-lockfile 确保版本和 lockfile 完全一致）
RUN pnpm install --frozen-lockfile

# 拷贝 Prisma 相关文件（数据库 ORM 的 schema 和配置）
COPY prisma ./prisma
COPY prisma.config.ts ./
# 生成 Prisma Client（根据 schema 自动生成数据库操作代码）
RUN pnpm prisma generate

# 拷贝 TypeScript 和 NestJS 配置文件
COPY tsconfig.json tsconfig.build.json nest-cli.json ./
# 拷贝源代码
COPY src ./src
# 编译 TypeScript 为 JavaScript（输出到 dist/ 目录）
RUN pnpm nest build

# ============================================
# 第二阶段：生产阶段（只打包运行需要的东西）
# ============================================
# 重新用一个干净的 Node.js 镜像，不包含编译工具，体积更小
FROM node:22-slim

# 安装 OpenSSL（Prisma 运行时需要）
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# 启用 pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# 设置工作目录
WORKDIR /app

# 拷贝依赖描述文件
COPY package.json pnpm-lock.yaml .npmrc ./
# 只安装生产依赖（--prod 跳过开发依赖，如 TypeScript、测试工具等）
RUN pnpm install --frozen-lockfile --prod

# 从构建阶段拷贝编译产物（dist/ 目录）
COPY --from=builder /app/dist ./dist
# 从构建阶段拷贝 Prisma Client 生成的文件（运行时需要）
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
# 拷贝 Prisma 迁移文件（如果运行时需要执行迁移）
COPY prisma ./prisma

# 声明容器监听的端口
EXPOSE 3200

# 容器启动时执行的命令
CMD ["node", "dist/main.js"]
