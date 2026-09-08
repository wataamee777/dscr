import { REST } from "@discordjs/rest";
import { Routes } from 'discord-api-types/v10';
import type {
  APIGuild,
  APIChannel,
  APIInvite,
  APIMessage,
  APIRole,
  APIUser,
  RESTGetAPIGatewayBotResult,
  RESTGetAPIGuildChannelsResult,
  RESTGetAPIGuildMembersResult,
  RESTGetAPIGuildRolesResult,
  RESTGetAPIUserResult,
  RESTPostAPIChannelMessageJSONBody,
  RESTPutAPIChannelPermissionJSONBody,
  RESTPatchAPIGuildJSONBody,
  RESTPatchAPIGuildMemberJSONBody,
  RESTPatchAPIRoleJSONBody,
  RESTPostAPIGuildRoleJSONBody,
  RESTPostAPIGuildBanJSONBody,
  RESTPostAPIChannelInviteJSONBody,
  RESTPostAPIGuildEmojiJSONBody,
  RESTPatchAPIGuildEmojiJSONBody,
  RESTPostAPIWebhookWithTokenJSONBody,
  RESTExecuteWebhookJSONBody,
  RESTGetAPIInviteResult,
  RESTGetAPIChannelResult,
  RESTGetAPIGuildResult,
  RESTGetAPIChannelMessagesResult,
  RESTGetAPIWebhookResult,
  RESTGetAPIGuildEmojisResult,
  RESTGetAPIGuildBansResult,
  RESTGetAPIGuildInvitesResult,
  RESTGetAPIGuildWebhooksResult,
  RESTGetAPIGuildVoiceRegionsResult,
  RESTGetAPIGuildScheduledEventsResult,
  RESTGetAPIGuildScheduledEventResult,
  RESTGetAPIGuildThreadsResult,
  RESTGetAPIChannelThreadsResult,
  RESTGetAPIChannelPinsResult,
  RESTGetAPIApplicationCommandsResult,
  RESTGetAPIApplicationCommandResult,
  RESTGetAPIApplicationEmojisResult,
  RESTGetAPIAutoModerationRulesResult,
  RESTGetAPIAutoModerationRuleResult,
  RESTGetAPIGuildStickersResult,
  RESTGetAPIStickerResult,
  RESTGetAPIGuildIntegrationsResult,
  RESTGetAPIGuildPruneResult,
  RESTGetAPIGuildPreviewResult,
  RESTGetAPIGuildWidgetResult,
  RESTGetAPIGuildVanityUrlResult,
  RESTGetAPIGuildWidgetSettingsResult,
  RESTGetAPIGuildWidgetImageResult
} from "discord-api-types/v10";
import type { AuthType, DscrOptions, DscrRawOptions, DscrRequestOptions } from "./types.js";

export * from "./types.js";

export class Dscr {
  private readonly rest: REST;
  private readonly token: string;
  private readonly authType: AuthType;
  private readonly version: string;

  constructor(options: DscrOptions, authType: AuthType = "Bot") {
    this.token = options.token;
    this.authType = authType;
    this.version = options.version ?? "10";
    this.rest = new REST({ version: this.version }).setToken(this.token);
  }

  private request<T>(
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    path: string,
    options: DscrRequestOptions = {},
    body?: unknown,
    query?: Record<string, string | number | boolean | undefined>
  ): Promise<T> {
    return this.rest.request({
      method,
      fullRoute: path,
      authPrefix: options.authType ?? this.authType,
      body: body as never,
      query: query as never
    }) as Promise<T>;
  }

  withToken(token: string, authType: AuthType = "Bot"): Dscr {
    return new Dscr({ token, version: this.version }, authType);
  }

  raw<T = unknown>(options: DscrRawOptions): Promise<T> {
    return this.request<T>(
      options.method,
      options.path,
      options,
      options.body,
      options.query
    );
  }

  // Gateway
  getGateway(options?: DscrRequestOptions) {
    return this.request<{ url: string }>("GET", Routes.gateway(), options);
  }

  getGatewayBot(options?: DscrRequestOptions) {
    return this.request<RESTGetAPIGatewayBotResult>("GET", Routes.gatewayBot(), options);
  }

  // Invites
  invite(code: string, options?: DscrRequestOptions) {
    return this.request<APIInvite>("GET", Routes.invite(code), options);
  }

  deleteInvite(code: string, options?: DscrRequestOptions) {
    return this.request<APIInvite>("DELETE", Routes.invite(code), options);
  }

  // Users
  getCurrentUser(options?: DscrRequestOptions) {
    return this.request<APIUser>("GET", Routes.user("@me"), options);
  }

  getUser(userId: string, options?: DscrRequestOptions) {
    return this.request<APIUser>("GET", Routes.user(userId), options);
  }

  // Channels
  channel(channelId: string, options?: DscrRequestOptions) {
    return this.request<APIChannel>("GET", Routes.channel(channelId), options);
  }

  getChannelMessages(channelId: string, query?: Record<string, string | number | boolean>, options?: DscrRequestOptions) {
    return this.request<RESTGetAPIChannelMessagesResult>("GET", Routes.channelMessages(channelId), options, undefined, query);
  }

  sendMessage(channelId: string, payload: RESTPostAPIChannelMessageJSONBody, options?: DscrRequestOptions) {
    return this.request<APIMessage>("POST", Routes.channelMessages(channelId), options, payload);
  }

  editMessage(channelId: string, messageId: string, payload: Partial<RESTPostAPIChannelMessageJSONBody>, options?: DscrRequestOptions) {
    return this.request<APIMessage>("PATCH", Routes.channelMessage(channelId, messageId), options, payload);
  }

  deleteMessage(channelId: string, messageId: string, options?: DscrRequestOptions) {
    return this.request<void>("DELETE", Routes.channelMessage(channelId, messageId), options);
  }

  crosspostMessage(channelId: string, messageId: string, options?: DscrRequestOptions) {
    return this.request<APIMessage>("POST", Routes.channelMessageCrosspost(channelId, messageId), options);
  }

  pinMessage(channelId: string, messageId: string, options?: DscrRequestOptions) {
    return this.request<void>("PUT", Routes.channelPin(channelId, messageId), options);
  }

  unpinMessage(channelId: string, messageId: string, options?: DscrRequestOptions) {
    return this.request<void>("DELETE", Routes.channelPin(channelId, messageId), options);
  }

  getPins(channelId: string, options?: DscrRequestOptions) {
    return this.request<RESTGetAPIChannelPinsResult>("GET", Routes.channelPins(channelId), options);
  }

  addReaction(channelId: string, messageId: string, emoji: string, options?: DscrRequestOptions) {
    return this.request<void>("PUT", Routes.channelMessageOwnReaction(channelId, messageId, emoji), options);
  }

  removeOwnReaction(channelId: string, messageId: string, emoji: string, options?: DscrRequestOptions) {
    return this.request<void>("DELETE", Routes.channelMessageOwnReaction(channelId, messageId, emoji), options);
  }

  removeUserReaction(channelId: string, messageId: string, emoji: string, userId: string, options?: DscrRequestOptions) {
    return this.request<void>("DELETE", Routes.channelMessageUserReaction(channelId, messageId, emoji, userId), options);
  }

  getReactions(channelId: string, messageId: string, emoji: string, query?: Record<string, string | number | boolean>, options?: DscrRequestOptions) {
    return this.request<APIUser[]>("GET", Routes.channelMessageReaction(channelId, messageId, emoji), options, undefined, query);
  }

  bulkDeleteMessages(channelId: string, payload: { messages: string[] }, options?: DscrRequestOptions) {
    return this.request<void>("POST", Routes.channelBulkDelete(channelId), options, payload);
  }

  editChannelPermissions(channelId: string, overwriteId: string, payload: RESTPutAPIChannelPermissionJSONBody, options?: DscrRequestOptions) {
    return this.request<void>("PUT", Routes.channelPermission(channelId, overwriteId), options, payload);
  }

  deleteChannelPermission(channelId: string, overwriteId: string, options?: DscrRequestOptions) {
    return this.request<void>("DELETE", Routes.channelPermission(channelId, overwriteId), options);
  }

  createInvite(channelId: string, payload: RESTPostAPIChannelInviteJSONBody = {}, options?: DscrRequestOptions) {
    return this.request<APIInvite>("POST", Routes.channelInvites(channelId), options, payload);
  }

  // Guilds
  guild(guildId: string, options?: DscrRequestOptions) {
    return this.request<APIGuild>("GET", Routes.guild(guildId), options);
  }

  getGuildPreview(guildId: string, options?: DscrRequestOptions) {
    return this.request<RESTGetAPIGuildPreviewResult>("GET", Routes.guildPreview(guildId), options);
  }

  modifyGuild(guildId: string, payload: RESTPatchAPIGuildJSONBody, options?: DscrRequestOptions) {
    return this.request<APIGuild>("PATCH", Routes.guild(guildId), options, payload);
  }

  deleteGuild(guildId: string, options?: DscrRequestOptions) {
    return this.request<void>("DELETE", Routes.guild(guildId), options);
  }

  getGuildChannels(guildId: string, options?: DscrRequestOptions) {
    return this.request<RESTGetAPIGuildChannelsResult>("GET", Routes.guildChannels(guildId), options);
  }

  getGuildMembers(guildId: string, query?: Record<string, string | number | boolean>, options?: DscrRequestOptions) {
    return this.request<RESTGetAPIGuildMembersResult>("GET", Routes.guildMembers(guildId), options, undefined, query);
  }

  getGuildMember(guildId: string, userId: string, options?: DscrRequestOptions) {
    return this.request<RESTGetAPIGuildMemberResult>("GET", Routes.guildMember(guildId, userId), options);
  }

  modifyGuildMember(guildId: string, userId: string, payload: RESTPatchAPIGuildMemberJSONBody, options?: DscrRequestOptions) {
    return this.request<RESTPatchAPIGuildMemberResult>("PATCH", Routes.guildMember(guildId, userId), options, payload);
  }

  addGuildMemberRole(guildId: string, userId: string, roleId: string, options?: DscrRequestOptions) {
    return this.request<void>("PUT", Routes.guildMemberRole(guildId, userId, roleId), options);
  }

  removeGuildMemberRole(guildId: string, userId: string, roleId: string, options?: DscrRequestOptions) {
    return this.request<void>("DELETE", Routes.guildMemberRole(guildId, userId, roleId), options);
  }

  kickMember(guildId: string, userId: string, options?: DscrRequestOptions) {
    return this.request<void>("DELETE", Routes.guildMember(guildId, userId), options);
  }

  getGuildBans(guildId: string, query?: Record<string, string | number | boolean>, options?: DscrRequestOptions) {
    return this.request<RESTGetAPIGuildBansResult>("GET", Routes.guildBans(guildId), options, undefined, query);
  }

  banMember(guildId: string, userId: string, payload: RESTPostAPIGuildBanJSONBody = {}, options?: DscrRequestOptions) {
    return this.request<void>("PUT", Routes.guildBan(guildId, userId), options, payload);
  }

  unbanMember(guildId: string, userId: string, options?: DscrRequestOptions) {
    return this.request<void>("DELETE", Routes.guildBan(guildId, userId), options);
  }

  getGuildRoles(guildId: string, options?: DscrRequestOptions) {
    return this.request<RESTGetAPIGuildRolesResult>("GET", Routes.guildRoles(guildId), options);
  }

  getGuildRole(guildId: string, roleId: string, options?: DscrRequestOptions) {
    return this.request<APIRole>("GET", Routes.guildRole(guildId, roleId), options);
  }

  createGuildRole(guildId: string, payload: RESTPostAPIGuildRoleJSONBody = {}, options?: DscrRequestOptions) {
    return this.request<APIRole>("POST", Routes.guildRoles(guildId), options, payload);
  }

  modifyGuildRole(guildId: string, roleId: string, payload: RESTPatchAPIRoleJSONBody, options?: DscrRequestOptions) {
    return this.request<APIRole>("PATCH", Routes.guildRole(guildId, roleId), options, payload);
  }

  deleteGuildRole(guildId: string, roleId: string, options?: DscrRequestOptions) {
    return this.request<void>("DELETE", Routes.guildRole(guildId, roleId), options);
  }

  modifyGuildRolePositions(guildId: string, payload: Array<{ id: string; position: number | null }>, options?: DscrRequestOptions) {
    return this.request<APIRole[]>("PATCH", Routes.guildRolePositions(guildId), options, payload);
  }

  getGuildInvites(guildId: string, options?: DscrRequestOptions) {
    return this.request<RESTGetAPIGuildInvitesResult>("GET", Routes.guildInvites(guildId), options);
  }

  getGuildWebhooks(guildId: string, options?: DscrRequestOptions) {
    return this.request<RESTGetAPIGuildWebhooksResult>("GET", Routes.guildWebhooks(guildId), options);
  }

  getGuildVoiceRegions(guildId: string, options?: DscrRequestOptions) {
    return this.request<RESTGetAPIGuildVoiceRegionsResult>("GET", Routes.guildVoiceRegions(guildId), options);
  }

  getGuildScheduledEvents(guildId: string, options?: DscrRequestOptions) {
    return this.request<RESTGetAPIGuildScheduledEventsResult>("GET", Routes.guildScheduledEvents(guildId), options);
  }

  getGuildScheduledEvent(guildId: string, eventId: string, options?: DscrRequestOptions) {
    return this.request<RESTGetAPIGuildScheduledEventResult>("GET", Routes.guildScheduledEvent(guildId, eventId), options);
  }

  getGuildThreads(guildId: string, options?: DscrRequestOptions) {
    return this.request<RESTGetAPIGuildThreadsResult>("GET", Routes.guildThreads(guildId), options);
  }

  getGuildEmojis(guildId: string, options?: DscrRequestOptions) {
    return this.request<RESTGetAPIGuildEmojisResult>("GET", Routes.guildEmojis(guildId), options);
  }

  createGuildEmoji(guildId: string, payload: RESTPostAPIGuildEmojiJSONBody, options?: DscrRequestOptions) {
    return this.request<unknown>("POST", Routes.guildEmojis(guildId), options, payload);
  }

  modifyGuildEmoji(guildId: string, emojiId: string, payload: RESTPatchAPIGuildEmojiJSONBody, options?: DscrRequestOptions) {
    return this.request<unknown>("PATCH", Routes.guildEmoji(guildId, emojiId), options, payload);
  }

  deleteGuildEmoji(guildId: string, emojiId: string, options?: DscrRequestOptions) {
    return this.request<void>("DELETE", Routes.guildEmoji(guildId, emojiId), options);
  }

  getGuildStickers(guildId: string, options?: DscrRequestOptions) {
    return this.request<RESTGetAPIGuildStickersResult>("GET", Routes.guildStickers(guildId), options);
  }

  getSticker(stickerId: string, options?: DscrRequestOptions) {
    return this.request<RESTGetAPIStickerResult>("GET", Routes.sticker(stickerId), options);
  }

  // Application commands
  getApplicationCommands(applicationId: string, options?: DscrRequestOptions) {
    return this.request<RESTGetAPIApplicationCommandsResult>("GET", Routes.applicationCommands(applicationId), options);
  }

  getApplicationCommand(applicationId: string, commandId: string, options?: DscrRequestOptions) {
    return this.request<RESTGetAPIApplicationCommandResult>("GET", Routes.applicationCommand(applicationId, commandId), options);
  }

  createApplicationCommand(applicationId: string, payload: unknown, options?: DscrRequestOptions) {
    return this.request<unknown>("POST", Routes.applicationCommands(applicationId), options, payload);
  }

  modifyApplicationCommand(applicationId: string, commandId: string, payload: unknown, options?: DscrRequestOptions) {
    return this.request<unknown>("PATCH", Routes.applicationCommand(applicationId, commandId), options, payload);
  }

  deleteApplicationCommand(applicationId: string, commandId: string, options?: DscrRequestOptions) {
    return this.request<void>("DELETE", Routes.applicationCommand(applicationId, commandId), options);
  }

  // Webhooks
  getWebhook(webhookId: string, options?: DscrRequestOptions) {
    return this.request<RESTGetAPIWebhookResult>("GET", Routes.webhook(webhookId), options);
  }

  deleteWebhook(webhookId: string, options?: DscrRequestOptions) {
    return this.request<void>("DELETE", Routes.webhook(webhookId), options);
  }

  executeWebhook(webhookId: string, webhookToken: string, payload: RESTExecuteWebhookJSONBody, options?: DscrRequestOptions) {
    return this.request<APIMessage | void>("POST", Routes.webhook(webhookId, webhookToken), options, payload);
  }

  editWebhookMessage(webhookId: string, webhookToken: string, messageId: string, payload: RESTExecuteWebhookJSONBody, options?: DscrRequestOptions) {
    return this.request<APIMessage>("PATCH", Routes.webhookMessage(webhookId, webhookToken, messageId), options, payload);
  }

  deleteWebhookMessage(webhookId: string, webhookToken: string, messageId: string, options?: DscrRequestOptions) {
    return this.request<void>("DELETE", Routes.webhookMessage(webhookId, webhookToken, messageId), options);
  }

  // Auto moderation
  getAutoModerationRules(guildId: string, options?: DscrRequestOptions) {
    return this.request<RESTGetAPIAutoModerationRulesResult>("GET", Routes.autoModerationRules(guildId), options);
  }

  getAutoModerationRule(guildId: string, ruleId: string, options?: DscrRequestOptions) {
    return this.request<RESTGetAPIAutoModerationRuleResult>("GET", Routes.autoModerationRule(guildId, ruleId), options);
  }

  createAutoModerationRule(guildId: string, payload: unknown, options?: DscrRequestOptions) {
    return this.request<unknown>("POST", Routes.autoModerationRules(guildId), options, payload);
  }

  modifyAutoModerationRule(guildId: string, ruleId: string, payload: unknown, options?: DscrRequestOptions) {
    return this.request<unknown>("PATCH", Routes.autoModerationRule(guildId, ruleId), options, payload);
  }

  deleteAutoModerationRule(guildId: string, ruleId: string, options?: DscrRequestOptions) {
    return this.request<void>("DELETE", Routes.autoModerationRule(guildId, ruleId), options);
  }

  // Useful convenience endpoints
  getGuildPrune(guildId: string, query?: Record<string, string | number | boolean>, options?: DscrRequestOptions) {
    return this.request<RESTGetAPIGuildPruneResult>("GET", Routes.guildPrune(guildId), options, undefined, query);
  }

  getGuildVanityUrl(guildId: string, options?: DscrRequestOptions) {
    return this.request<RESTGetAPIGuildVanityUrlResult>("GET", Routes.guildVanityUrl(guildId), options);
  }

  getGuildWidgetSettings(guildId: string, options?: DscrRequestOptions) {
    return this.request<RESTGetAPIGuildWidgetSettingsResult>("GET", Routes.guildWidgetSettings(guildId), options);
  }

  getGuildWidget(guildId: string, options?: DscrRequestOptions) {
    return this.request<RESTGetAPIGuildWidgetResult>("GET", Routes.guildWidget(guildId), options);
  }

  getGuildWidgetImage(guildId: string, options?: DscrRequestOptions) {
    return this.request<RESTGetAPIGuildWidgetImageResult>("GET", Routes.guildWidgetImage(guildId), options);
  }
}
