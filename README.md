# dscr

軽量な JavaScript/TypeScript 向け Discord REST API ラッパー。

```js
import { Dscr } from "dscr";

const dscr = new Dscr({
  token: process.env.DISCORD_TOKEN!
});

const invite = await dscr.invite("abcdefg");
console.log(invite.guild?.name);

const channel = await dscr.channel("123456789012345678");

await dscr.sendMessage(channel.id, {
  content: "Hello from dscr!"
});
```

## 認証

Bot token がデフォルト。

Bearer token を使う API はリクエストごとに指定できる。

```js
await dscr.getCurrentUser({
  authType: "Bearer"
});
```

また、別クライアントとして固定することもできる。

```js
const oauth = dscr.withToken(process.env.DISCORD_OAUTH_TOKEN!, "Bearer");
const user = await oauth.getCurrentUser();
```

`Bearer` は Discord OAuth2 等で正規に発行されたアクセストークンを対象とする。
Self-bot やユーザーアカウントの自動操作を目的とした利用はサポートしない。

## 実装範囲

Discord REST API の主要なリソースを一通りラップしている。

- Applications / OAuth2
- Users
- Guilds
- Guild Members
- Roles
- Channels
- Messages / Threads
- Reactions
- Invites
- Webhooks
- Stickers
- Emojis
- Auto Moderation
- Scheduled Events
- Entitlements / SKU
- Voice Regions
- Gateway

API の新機能が追加された場合は、`raw()` により未ラップの REST リクエストも実行できる。
