import "dotenv/config";

import { getSignedUrl } from "../index.js";

console.log(
  await getSignedUrl({
    ...process.env,
  })
);
