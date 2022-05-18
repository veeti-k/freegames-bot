import { NextApiRequest, NextApiResponse } from "next";
import { db, getDefaultLanguage } from "shared";
import { ILanguageWithGuildCount } from "types";

const Handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "GET":
      await HandleGet(req, res);
      break;

    case "POST":
      await HandlePost(req, res);
      break;

    default:
      res.status(405).json({ message: `Method ${req.method} Not Allowed` });
      break;
  }
};

const HandlePost = async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();

  const body = JSON.parse(req.body);

  const language =
    getDefaultLanguage().code === body.code || (await db.languages.get.byCode(body.code));

  if (language) {
    res.status(400).json({
      message: `Language with code '${body.code}' already exists`,
    });
    return;
  }

  const createdLanguage = await db.languages.create(JSON.parse(req.body));

  res.status(201).json({
    ...createdLanguage,
    guildCount: 0,
  });
};

const HandleGet = async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();

  const languages = await db.languages.get.all();

  const languagesWithGuildCounts: ILanguageWithGuildCount[] = await Promise.all(
    languages.map(async (l) => ({
      ...l,
      guildCount: await db.guilds.get.counts.hasLanguage(l.code),
    }))
  );

  const defaultLangStats: ILanguageWithGuildCount = {
    ...getDefaultLanguage(),
    guildCount: await db.guilds.get.counts.hasDefaultLanguage(),
    isDefault: true,
  };

  res.status(200).json([...languagesWithGuildCounts, defaultLangStats]);
};

export default Handler;