const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

class DataBaseConfig {
  constructor() {
    if (!DataBaseConfig.instance) {
      this.ConnectToDb();
      DataBaseConfig.instance = this;
    }
    return DataBaseConfig.instance;
  }
  ConnectToDb = async () => {
    console.log(`[+] Connecting to DataBase`);
    mongoose
      .connect(process.env.db_url)
      .then(() => {
        console.log("[+] MongoDB Connection Succeeded. ");
      })
      .catch((err) => {
        console.log("[-] Error in DB connection: " + err);
      });
  };
}

module.exports.mydb = new DataBaseConfig();
