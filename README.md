# Othello GUI

**Modern, Fast, and Beautiful.**

高速なC++思考エンジンとモダンなWeb技術（Next.js + Rails）を組み合わせた、没入感のあるオセロアプリケーションです。

<p align="center">
  <img src="public/assets/preview.png" alt="UI Preview" width="100%">
</p>

## ✨ Features

- **High Performance AI**: C++ (Nega-alpha法) による高速かつ強力な思考エンジン。
- **Neumorphism Design**: 光と影を計算した、「触りたくなる」モダンなUI。
- **Robust Architecture**: Next.js, Rails API, C++ の3層構造による堅牢な設計。

## 🛠️ Technology Stack

- **Frontend**: Next.js (App Router), Tailwind CSS v4, TypeScript
- **Backend API**: Ruby on Rails 8 (API Mode)
- **AI Core**: C++ (Standard I/O Interface)

👉 **[アーキテクチャや実装の詳細はこちら (docs/TECHNICAL.md)](docs/TECHNICAL.md)**

## 🚀 Getting Started

### Prerequisites
- Node.js (v20+)
- Ruby (v3.2+) & Rails (v8.1+)
- C++ Compiler (g++ or clang++)
- Docker (Optional, for containerized run)

### Quick Run (Docker)
もしDockerがインストールされていれば、以下のコマンドだけで全ての環境が立ち上がります。

```bash
make up
# Access http://localhost:3000
```

### Manual Setup
手動でセットアップする場合の手順です。

#### 1. Backend Setup
```bash
cd backend
bundle install
# C++エンジンのコンパイル
cd othelloai_logic && g++ -O3 -o othello othello.cpp
cd ..
# サーバー起動 (Port: 3001)
bin/rails s -p 3001
```

#### 2. Frontend Setup
```bash
cd frontend
npm install
# 開発サーバー起動 (Port: 3000)
npm run dev
```

## 🤝 Contributing
Contributions are welcome!
Please check the repository settings for contribution guidelines.

---
Created by [nana743533](https://github.com/nana743533)
