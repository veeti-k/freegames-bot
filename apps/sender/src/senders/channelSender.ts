import axios from "axios";
import limitedAxios, { RateLimitedAxiosInstance } from "axios-rate-limit";
import {
  embeds,
  getGuildLang,
  db,
  ISendingLog,
  discordApiRequest,
  wait,
  IGuild,
  IGame,
} from "shared";
import { getDataToSend } from "../utils";

export class ChannelSender {
  limitedAxios: RateLimitedAxiosInstance;
  guilds: IGuild[];
  games: IGame[];

  sendingId: string;

  constructor(guilds: IGuild[], games: IGame[], sendingId: string) {
    this.guilds = guilds;
    this.games = games;
    this.sendingId = sendingId;

    this.limitedAxios = limitedAxios(axios.create(), {
      maxRequests: 15,
      perMilliseconds: 500,
    });
  }

  async start() {
    for (const guild of this.guilds) {
      const gameEmbeds = embeds.games.games(this.games, getGuildLang(guild));
      const data = getDataToSend(guild, gameEmbeds);

      await wait(30);

      this.limitedAxios(discordApiRequest(`/channels/${guild.channelId}/messages`, "POST", data))
        .then((_) => {
          const log: ISendingLog = {
            guildId: guild.guildId,
            sendingId: this.sendingId,
            result: {
              success: true,
              reason: null,
            },
          };

          console.log(`sent to ${guild.guildId} (channel)`);

          db.logs.addSend(log).catch((err) => console.log("log (channel1):", err.message));
        })
        .catch((err: any) => {
          const log: ISendingLog = {
            guildId: guild.guildId,
            sendingId: this.sendingId,
            result: {
              success: false,
              reason: "",
            },
          };

          if (!err?.response) {
            log.result.reason = "no response";
            console.log("NOT SENT", log.result.reason, guild.guildId);

            return;
          }

          if (err?.response?.data?.code) {
            log.result.reason = err?.response?.data?.code;
            console.log("NOT SENT", log.result.reason, guild.guildId);
            db.guilds.remove.webhook(guild.guildId).catch(() => null);
            db.logs.addSend(log).catch((err) => console.log("log (channel2):", err.message));

            return;
          }

          if (err?.response?.status) {
            log.result.reason = err?.response?.status;
            console.log("NOT SENT", log.result.reason, guild.guildId);
            if (err.response.status === 429) return console.log("RATELIMIT");

            db.logs.addSend(log).catch((err) => console.log("log (channel3):", err.message));

            return;
          }

          log.result.reason = "hmm";
          console.log("NOT SENT", log.result.reason, guild.guildId);
          db.logs.addSend(log).catch((err) => console.log("log (channel4):", err.message));
        });
    }
  }
}
