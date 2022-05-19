import { MessageActionRow, MessageEmbed } from "discord.js";
import { ICurrency, IGuild, ILanguage, CommandTypes } from "shared";

export interface CommandInteraction {
  guildId: string | null;
  channelId: string | null;
  id: string;
  token: string;
  command: Command;
  user: User;
  type: number;
  options: CommandOptionsResolver;
  reply: (options: ReplyOptions) => Promise<void>;
  followUp: (options: ReplyOptions) => Promise<void>;
  deferReply: (options?: DeferReplyOptions) => Promise<void>;
  editReply: (options: ReplyOptions) => Promise<void>;
  getSubCommand: (required?: boolean | undefined) => CommandOptions | undefined;
  getFullCommandName: () => string;
  onFinish: () => Promise<void>;
}

export interface SlashCommand {
  type: CommandTypes;
  needsGuild?: boolean;
  execute: (
    i: CommandInteraction,
    guild: IGuild | null,
    language: ILanguage,
    currency: ICurrency
  ) => Promise<any>;
}

export interface Command {
  name: string;
  type: number;
  id: string;
}

export interface CommandFile {
  command: SlashCommand;
}

export interface ReplyOptions {
  content?: string;
  embeds?: MessageEmbed[];
  ephemeral?: boolean;
  components?: MessageActionRow[];
}

export interface DeferReplyOptions {
  ephemeral?: boolean;
}

export interface SubCommandOptions {
  name: string;
  value: string;
  type: number;
}

export interface CommandOptions {
  name: string;
  type: number;
  options: SubCommandOptions[];
}

export interface CommandOptionsResolver {
  getString(name: string, required?: boolean | undefined): string;
  getChannelId(name: string, required?: boolean | undefined): string;
  getRole(name: string, required?: boolean | undefined): string;
}

export type SubCommandHandler = (
  i: CommandInteraction,
  guild: IGuild | null,
  language: ILanguage,
  currency: ICurrency
) => Promise<any>;

export interface User {
  permissions: {
    bits: bigint;
    hasPermission: (bits: bigint, checkFor: bigint) => boolean;
  } | null;
  id: string;
  tag: string;
  locale: string;
}

export interface IMessage {
  content?: string;
  embeds: MessageEmbed[];
}