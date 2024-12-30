import User from "@/lib/models/User";
import { connectToDB } from "@/lib/mongodb/mongoose";
var CryptoJS = require("crypto-js");
var jwt = require("jsonwebtoken");

export const POST = async (req) => {
  try {
    await connectToDB();
    const { phone, password } = await req.json();
      // check in the User collection
      let user = await User.findOne({ phone: phone });

      if (user) {
        // Decrypt the stored password
        var bytes = CryptoJS.AES.decrypt(user.password, process.env.CRYPTO_SECRATE);
        var checkpass = bytes.toString(CryptoJS.enc.Utf8);

        if (password === checkpass) {
          // Generate JWT token for User
          var token = jwt.sign(
            {
              phone: user.phone,
              name: user.name,
              userid: user._id,
            },
            process.env.JWT_SECRATE
          );

          // Return success response with token
          return new Response(JSON.stringify({ success: true, token }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } else {
          // Incorrect password
          return new Response(JSON.stringify({ error: "Incorrect password" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }
      } else {
        // No user found
        return new Response(JSON.stringify({ error: "No user found" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
    
  } catch (err) {
    // Handle errors
    console.log(err);
    return new Response(JSON.stringify({ error: "Failed to authenticate" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
