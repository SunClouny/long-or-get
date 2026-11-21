# 匿名ランキングの有効化
GitHub Pagesは表示を担当し、WorkerがこのリポジトリのIssue #1に記録を追加します。プレイヤーのログインは不要です。

1. SunClounyとして、このリポジトリだけに限定したfine-grained tokenを作成し、Issues: Read and writeのみ付与します。公開コメントはこのアカウントのIDで検証します。
2. CloudflareにログインしたWranglerから ranking ディレクトリで `npx wrangler deploy`、続いて `npx wrangler secret put GH_TOKEN` を実行し、対話入力でトークンを設定します。トークンをリポジトリやチャットに書かないでください。
3. ルートの ranking-service.json の endpoint に、発行された https://…workers.dev/score を保存します。
4. ゲーム終了後に記録を送信し、ランキングを更新します。集計はGitHub受信時刻（日本時間）。非ログインのカジュアルゲームのため、スコアはクライアント申告で、本人確認や不正スコアの完全な防止はしません。
