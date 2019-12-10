import axios from "axios";
import Router from "next/router";
import { Cookies } from "react-cookie";
const cookies = new Cookies();
let serverUrl = "http://localhost:3000";

export async function handleAuthSSR(ctx) {
  let token = null;

  if (ctx.req) {
    token = ctx.req.headers.cookie.replace(
      /(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
  } else {
    token = cookies.get("token");
  }

  try {
    const response = await axios.get(`${serverUrl}/api/ping`, {
      headers: { Authorization: token }
    });
  } catch (err) {
    if (ctx.res) {
      ctx.res.writeHead(302, {
        Location: "/"
      });
      ctx.res.end();
    } else {
      Router.push("/");
    }
  }
}
