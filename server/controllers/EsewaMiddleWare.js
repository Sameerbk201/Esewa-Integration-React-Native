const crypto = require("crypto");
class EsewaMiddleware {
  create_Signature = (message) => {
    try {
      const secret = "8gBm/:&EnhH.1/q";
      const hmac = crypto.createHmac("sha256", secret);
      hmac.update(message);

      /* Get the digest in base64 format */
      const hashInBase64 = hmac.digest("base64");
      console.log(hashInBase64);
      return hashInBase64;
    } catch (error) {
      return "";
    }
  };
  createSignature = (message) => {
    const secret = "8gBm/:&EnhH.1/q"; //different in production
    // Create an HMAC-SHA256 hash
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(message);

    // Get the digest in base64 format
    const hashInBase64 = hmac.digest("base64");
    return hashInBase64;
  };

  handleEsewaSuccess = async (req, res, next) => {
    try {
      const { data } = req.query;
      console.log(`[+] Middle Ware 1:`, data);
      const decodedData = JSON.parse(
        Buffer.from(data, "base64").toString("utf-8")
      );
      console.log("[+] Middle Ware 2:", decodedData);

      if (decodedData.status !== "COMPLETE") {
        return res.status(400).json({ status: false, message: "errror" });
      }
      const message = decodedData.signed_field_names
        .split(",")
        .map((field) => `${field}=${decodedData[field] || ""}`)
        .join(",");
      console.log("[+] Middle Ware 3:", message);
      const signature = this.createSignature(message);

      if (signature !== decodedData.signature) {
        res.json({ message: "integrity error" });
      }

      req.transaction_uuid = decodedData.transaction_uuid;
      req.transaction_code = decodedData.transaction_code;
      console.log(decodedData, req.transaction_uuid, req.transaction_code);
      console.log("Proceeding to next");
      next();
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: err?.message || "No Orders found" });
    }
  };
}

const esewaMiddleware = new EsewaMiddleware();
module.exports.esewaMiddleware = esewaMiddleware;
