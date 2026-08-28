# GitHub Pages 公開手順

このフォルダは GitHub Pages 用に調整済みです。

1. GitHub で新しいリポジトリを作成します。
2. このフォルダの**中身**をリポジトリ直下にアップロードします。
3. `main` ブランチへコミットします。
4. GitHub の `Settings` → `Pages` を開きます。
5. `Build and deployment` の `Source` で **GitHub Actions** を選びます。
6. `Actions` タブで `Deploy to GitHub Pages` が成功するのを確認します。

公開URLは通常、次の形です。

`https://ユーザー名.github.io/リポジトリ名/`

## 画像について

元の Manus サイトが参照していた次の画像は、この配布ファイルに含まれていません。

- kanbayashi-symbol_e2b378c2.png
- kanbayashi-hero_73687018.png
- kanbayashi-research-bridge_f2b179c1.png

画像が無い場合は自動的に非表示になります。あとから表示したい場合は、画像を `client/public/` に同じファイル名で置いてください。
