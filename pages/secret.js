import React from "react";
import axios from "axios";
import Head from "next/head";
import { Cookies } from "react-cookie";
import { handleAuthSSR } from "../helpers/front/check_auth.js";
const cookies = new Cookies();

class Secret extends React.Component {
  onPingCall = async e => {
    const token = cookies.get("token");

    try {
      const res = await axios.get("/api/ping", {
        headers: { Authorization: token }
      });
    } catch (err) {
      console.log(err.response);
    }
  };

  render() {
    return (
      <div>
        <Head>
          <title>Secret</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <h2>Secret page</h2>
        <p>Only accessible via a valid JWT</p>
        <br></br>
        <button onClick={e => this.onPingCall(e)}>Ping Call</button>
        <p>Check console for response</p>
      </div>
    );
  }
}

Secret.getInitialProps = async ctx => {
  await handleAuthSSR(ctx);
  return {};
};

export default Secret;
