// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { api } from "../../services/api";

export default function (req, res) {
  res.status(200).json(api.getWinWheelItems());
}
