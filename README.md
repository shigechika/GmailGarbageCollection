# Gmail Garbage Collection

Gmailのメールボックスの整理を自動化したいと思ったことありませんか？いろんなシステムからの通知メールとかそのときは便利だけど放っておくとチリツモとなり容量食われていたりしませんか？逆に容量無制限でも過去のメールを検索しようとすると通知メールとかが無駄に引っかり探したいメールが探せないということはありませんか？例えばSNSからの通知メール，本日限定の販促メール。数日も経つと役立たずのメールをあなたのメールボックスを蝕んでいませんか？そんなお悩みをGmail Garbage Collectionが綺麗さっぱりメールボックスをお掃除します（ただし無保証）。

# Overview

動作原理はあらかじめGoogleスプレッドシートに用意した検索キーワードと動作ルールを用意し，Google Apps Scriptの時間起動により実際のメールボックスを整理します。Archiveならばアーカイブ，Trashならばゴミ箱へ移動します。Gmailの仕様ではゴミ箱に移したメールは30日後に本当に削除します。

# How to install

- Open Google Spread Sheet 

| Action  | Gmail search operator                                              |
|:--------|:-------------------------------------------------------------------|
| Archive | older_than:7d category:social from:facebookmail.com" -is:important |
| Trash   | older_than:1m category:social from:facebookmail.com" -is:important |
| Trash   | older_than:7d category:social from:twitter.com" -is:important |
| Archive | older_than:1m category:social from:twitter.com" -is:important |
| Trash   | older_than:7d category:social from:@plus.google.com" -is:important |
| Archive | older_than:1m category:social from:@plus.google.com" -is:important |

<dl>
  <dt>older_than:7d</dt>
  <dd>7日経過したメール。1mは1ヶ月。1yだと1年。
<dl>
<dl>
  <dt>category:social</dt>
  <dd>ソーシャル（SNS系）メール
<dl>
<dl>
  <dt>from:facebookmail.com</dt>
  <dd>Facebookからの通知メール
<dl>
<dl>
  <dt>-is:important</dt>
  <dd>重要なメールを除外。「-」記号が除外を意味する</dd>
<dl>
  
詳細：Gmailで使用できる検索演算子 https://support.google.com/mail/answer/7190?hl=ja

![Open Google Spread Sheet ](img/GGC-sheet.png)

- Open Script Editor

![Open Script Editor](img/GGC-scripteditor.png)

- COPY and PASTE

![COPY & PASTE](img/GGC-paste.png)

- Save and Run

![Save](img/GGC-run.png)

- Confirm

![Confirm](img/GGC-confirm.png)

- Permit

![Permit](img/GGC-permit.png)

- Trigger

![Trigger](img/GGC-trigger.png)

- Cron

![Cron](img/GGC-cron.png)

# NO WARRANTY

無保証
