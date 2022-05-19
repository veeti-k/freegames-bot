import { db } from "database";
import { ApiEndpoint } from "../../../utils/ApiEndpoint";
import { requireMethod } from "../../../utils/apiUtils";
import { hasAccess } from "../../../utils/auth";
import { mongoUrl } from "../../../utils/envs";

const Handler: ApiEndpoint = async (req, res) => {
  if (!requireMethod("GET")) return;
  if (!(await hasAccess(req, res, false))) return;

  await db.connect(mongoUrl);

  const freeGames = await db.games.get.free();

  res.status(200).json(freeGames);
};

export default Handler;