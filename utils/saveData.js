const axios = require("axios");
const fs = require("fs");
const SaveData = async () => {
  const res = await axios.get("http://api.alquran.cloud/v1/quran/ar.asad");
  const data = res.data;
  fs.writeFileSync(
    `${__dirname}/../data/data.json`,
    JSON.stringify(data.data.surahs),
    "utf8"
  );
};

module.exports = SaveData;
