import React from "react";
import axios from "axios";
import Head from "next/head";
import { Cookies } from "react-cookie";
import { handleAuthSSR } from "../helpers/front/check_auth.js";
const cookies = new Cookies();
import queryString from "query-string";
let serverUrl = "http://localhost:3000";
import Router from "next/router";
import Button from "@material-ui/core/Button";

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: { email: "", name: "" }
    };
  }

  componentDidMount() {
    console.log("props", this.props);
    this.setState({ user: this.props.user });
  }

  render() {
    return (
      <div>
        <Head>
          <title>Profile</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            cookies.remove("token");
            Router.push("/");
          }}
        >
          {"LogOut"}
        </Button>
        <h1>{`Hello, ${this.state.user.name} , this is keyboard_handwriting_authorizator project !!!`}</h1>
        <h3>{`Name of the current user: ${this.state.user.name}`}</h3>
        <h3>{`Email of the current user: ${this.state.user.email}`}</h3>
      </div>
    );
  }
}

Profile.getInitialProps = async ctx => {
  let response = { response: { data: { user: {} } } };

  await handleAuthSSR(ctx);

  let token = "";
  if (ctx.req) {
    token = ctx.req.headers.cookie.replace(
      /(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
  } else {
    token = cookies.get("token");
  }
  console.log("token", token);

  try {
    response = await axios.post(
      `${serverUrl}/api/get_current_user`,
      { token },
      {
        headers: { Authorization: token }
      }
    );

    // const response = await axios.get(`${serverUrl}/api/ping`, {
    //   headers: { Authorization: token }
    // });
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

  // let params = queryString.parse(ctx.req.url.split("?")[1]);
  // console.log("params", params);
  // console.log("params", window.location.search);
  // await axios.get(`/api/user?id=${10}`);
  return { user: response.data.user };
  // return { uid: params.id };
};

export default Profile;
