# エニクック 在庫管理システム

合同会社エニクック向け在庫管理システム（原材料・包材・製品対応）

## 技術スタック

- **フロントエンド**: GitHub Pages（単一HTMLファイル / PWA対応）
- **データベース**: Firebase Firestore（compat SDK）
- **認証**: Firebase Authentication（メール/パスワード）
- **自動デプロイ**: GitHub Actions

---

## セットアップ手順

### 1. Firebase プロジェクトを作成する

1. [Firebase Console](https://console.firebase.google.com/) を開く
2. 「プロジェクトを追加」→ プロジェクト名: `anycook-inventory`
3. **Authentication** を有効化
   - 「Sign-in method」→「メール/パスワード」を有効にする
   - 「ユーザー」タブでスタッフのメールアドレスとパスワードを登録する
4. **Firestore Database** を作成する
   - 「本番環境モード」で開始
   - リージョン: `asia-northeast1`（東京）

### 2. セキュリティルールを適用する

Firebase Console → Firestore → 「ルール」タブ を開き、
`firestore.rules` の内容をそのまま貼り付けて「公開」する。

### 3. Firebase 設定値を index.html に書き込む

Firebase Console → プロジェクトの設定 → 「マイアプリ」→ ウェブアプリを追加

以下の部分を実際の値に書き換える:

```javascript
var firebaseConfig = {
  apiKey:            "実際のAPIキー",
  authDomain:        "プロジェクトID.firebaseapp.com",
  projectId:         "プロジェクトID",
  storageBucket:     "プロジェクトID.appspot.com",
  messagingSenderId: "送信者ID",
  appId:             "アプリID"
};
```

### 4. GitHub リポジトリを作成する

```bash
# リポジトリ名: any-cook/inventory （推奨）
git init
git add .
git commit -m "初回コミット"
git remote add origin https://github.com/any-cook/inventory.git
git push -u origin main
```

### 5. GitHub Pages を有効にする

1. リポジトリ → Settings → Pages
2. Source: 「GitHub Actions」を選択
3. `main` ブランチにプッシュすると自動デプロイ開始

### 6. 初期データを登録する

ログイン後、各タブの「＋ 新規登録」から品目を登録する。
最低限登録すべき項目:

**原材料タブ**
- 品名・単位・安全在庫・発注点・ABCランク

**包材タブ**
- 品名・単位・安全在庫・発注点・ABCランク

**製品タブ**
- 品名・単位・安全在庫・発注点・ABCランク・賞味期限日数

---

## 運用ルール

| 操作 | タイミング |
|------|-----------|
| 入庫記録 | 原材料・包材が納品されたとき |
| 出庫記録 | 製造で使用したとき |
| 廃棄記録 | 期限切れや不良品が発生したとき |
| 棚卸し | 月1回、実在庫と帳簿を照合する |

## 担当者ロール（認証）

| ロール | 操作範囲 |
|--------|---------|
| スタッフ | 入出庫記録、在庫確認 |
| 管理者（福士さん） | 全機能 + 品目設定 |

---

## ファイル構成

```
inventory/
├── index.html          ← メインアプリ（全機能）
├── manifest.json       ← PWA設定
├── sw.js               ← Service Worker
├── firestore.rules     ← Firestoreセキュリティルール
├── .github/
│   └── workflows/
│       └── deploy.yml  ← 自動デプロイ設定
└── README.md
```
