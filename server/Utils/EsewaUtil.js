const dotenv = require("dotenv");
dotenv.config();
const crypto = require("crypto");

class EsewaUtil {
  constructor() {
    this.secret = process.env.SECRET_HASH || "8gBm/:&EnhH.1/q";
  }

  createEsewaSignature = (message) => {
    const secret = this.secret; //different in production
    // Create an HMAC-SHA256 hash
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(message);

    // Get the digest in base64 format
    const hashInBase64 = hmac.digest("base64");
    return hashInBase64;
  };

  decodeEsewaSignature = (message) => {
    try {
      const decodedData = JSON.parse(
        Buffer.from(message, "base64").toString("utf-8")
      );
      return decodedData;
    } catch (error) {
      return error.message;
    }
  };
}

const esewaUtil = new EsewaUtil();

module.exports.esewaUtil = esewaUtil;
