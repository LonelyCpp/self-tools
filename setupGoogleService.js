const fs = require("fs");

const filePath = "./service.json";
const key = process.env.GOOGLE_SERVICE;

const fileContents = Buffer.from(key, "base64");

fs.writeFileSync(filePath, fileContents, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log("file saved to ", filePath);
});
