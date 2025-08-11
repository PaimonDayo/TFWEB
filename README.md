# TUATTF 練習スケジュール

## 概要

東京大学陸上運動部（TUATTF）の練習スケジュールを表示するWebアプリケーションです。

## 主な機能

- 📅 月別練習スケジュール表示
- 🗓️ カレンダービュー
- 📱 レスポンシブデザイン（スマホ対応）
- 🌤️ 天気情報表示
- ⚡ 高速読み込み（リトライ機能付き）
- 🛡️ エラーハンドリング

## 使用技術

- **Framework**: React
- **Build Tool**: Vite
- **Language**: TypeScript
- **Hosting**: GitHub Pages
- **CI/CD**: GitHub Actions

## セットアップとローカル実行

1.  **リポジトリをクローン**
    ```bash
    git clone https://github.com/<YOUR_USERNAME>/<THIS_REPOSITORY_NAME>.git
    cd <THIS_REPOSITORY_NAME>
    ```

2.  **依存関係をインストール**
    ```bash
    npm install
    ```

3.  **環境変数を設定**
    `.env` ファイルをプロジェクトルートに作成し、以下の変数を設定します。`.env.example` をコピーして作成してください。

    ```
    VITE_SPREADSHEET_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    VITE_DATA_YEAR=2025
    ```

    - `VITE_SPREADSHEET_ID`: GoogleスプレッドシートのID
    - `VITE_DATA_YEAR`: 表示したい年度

4.  **開発サーバーを起動**
    ```bash
    npm run dev
    ```
    ブラウザで `http://localhost:5173` (ポートは異なる場合があります) にアクセスします。

## ビルド方法

以下のコマンドを実行すると、`docs/` ディレクトリに本番用の静的ファイルが生成されます。

```bash
npm run build
```

## デプロイ

このリポジトリは、`main` ブランチにプッシュされると、GitHub Actionsによって自動的にビルdされ、GitHub Pagesにデプロイされます。

デプロイされたサイトは、リポジトリの `Settings > Pages` から確認できるURL（通常は `https://[username].github.io/[repository-name]/`）で公開されます。

## ライセンス

© 2025 TUATTF (東京大学陸上運動部)
