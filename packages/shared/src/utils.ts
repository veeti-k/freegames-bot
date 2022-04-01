import axios, { AxiosRequestConfig, Method } from "axios";
import { config } from "config";
import { APIEmbed } from "discord-api-types";
import { MessageEmbed, MessageEmbedOptions } from "discord.js";
import { IGame } from "./data/types";
import { Currencies } from "./localisation";

export const discordApiBaseUrl = "https://discord.com/api/v9";

export const isEnum =
  <T>(e: T) =>
  (token: any): token is T[keyof T] =>
    Object.values(e).includes(token as T[keyof T]);

export const discordApiRequest = (url: string, method: Method, body: any = null) => {
  const conf: AxiosRequestConfig = {
    headers: {
      authorization: `Bot ${config.botToken}`,
    },
    method,
    url: `${discordApiBaseUrl}${url}`,
  };

  if (body) {
    conf.headers!["content-type"] = "application/json";
    conf.data = body;
  }

  return conf;
};

export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getWebhookUrl = (webhookId: string, webhookToken: string) =>
  `${discordApiBaseUrl}/webhooks/${webhookId}/${webhookToken}`;

export type WebhookMessageOptions = {
  embeds?: (MessageEmbed | MessageEmbedOptions | APIEmbed)[];
  content?: string;
};

type ExecuteWebhookProps = {
  webhookUrl: string;
  options: WebhookMessageOptions;
  wait?: boolean;
  threadId?: string | null;
};

export const executeWebhook = (props: ExecuteWebhookProps) => {
  let params = new URLSearchParams();

  if (props.threadId) params.append("thread_id", props.threadId);
  if (props.wait) params.append("wait", props.wait.toString());

  return axios.post(`${props.webhookUrl}?${params.toString()}`, {
    ...props.options,
  });
};

export const editWebhookMsg = (msgId: string, webhookUrl: string, options: WebhookMessageOptions) =>
  axios.patch(`${webhookUrl}/messages/${msgId}`, options);

export const deleteWebhookMsg = (msgId: string, webhookUrl: string) =>
  axios.delete(`${webhookUrl}/messages/${msgId}`);

export const getGamePrice = (game: IGame, currency: Currencies) => {
  return game.price[currency] || game.price.USD;
};
