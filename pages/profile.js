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
import TextField from "@material-ui/core/TextField";
import Snackbar from "@material-ui/core/Snackbar";
import { collectKeyboardActions } from "../helpers/front/funcs.js";

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: { email: "", name: "" },
      alert_is_open: false,
      keyboard_actions: [],
      phrase: "",
      smart_password: ""
    };
  }

  componentDidMount() {
    console.log("props", this.props);
    this.setState({ user: this.props.user });
    axios.get("/api/get_current_phrase").then(response => {
      console.log("response", response);
      this.setState({ phrase: response.data.phrase });
    });
  }

  onTrainClick = async () => {
    console.log("this.state.phrase", this.state.phrase);
    let keyboard_actions = collectKeyboardActions({
      phrase: this.state.phrase,
      keyboard_actions: [...this.state.keyboard_actions]
    });
    const response = await axios.post("/api/train", {
      keyboard_actions,
      id: this.state.user.id
      // initializator: this.state.user.password_hash
    });
    console.log("response", response);
    this.setState({
      alert_is_open: true
    });
    setTimeout(() => {
      this.setState({ alert_is_open: false });
    }, 1000);
  };

  render() {
    return (
      <div>
        <Head>
          <title>Profile</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          key={`${"top"},${"center"}`}
          open={this.state.alert_is_open}
          onClose={() => {
            this.setState({ alert_is_open: false });
          }}
          ContentProps={{
            "aria-describedby": "message-id"
          }}
          message={
            <span
              id="message-id"
              style={{
                fontFamily: "Roboto",
                fontSize: "20px",
                textAlign: "center"
              }}
            >
              Net was updated
            </span>
          }
        />
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
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column"
          }}
        >
          <TextField
            type={"text"}
            id="filled"
            label="Enter this phrase to below input to confirm your personality"
            defaultValue={this.state.phrase}
            variant="filled"
            value={this.state.phrase}
            InputProps={{
              readOnly: true
            }}
          />
          <div style={{ width: "20px", height: "20px" }} />
          <TextField
            type={"text"}
            required
            id="filled-required-password"
            label="Enter Check Phrase Here"
            defaultValue=""
            variant="filled"
            onKeyDown={e => {
              let keyboard_actions = [...this.state.keyboard_actions];
              keyboard_actions.push({
                type: "key_down",
                timestamp: Date.now(),
                key: e.key
              });
              this.setState({ keyboard_actions });
            }}
            onKeyUp={e => {
              let keyboard_actions = [...this.state.keyboard_actions];
              keyboard_actions.push({
                type: "key_up",
                timestamp: Date.now(),
                key: e.key
              });
              this.setState({ keyboard_actions });
            }}
            onChange={e => {
              let new_value = e.target.value || "";
              this.setState({ smart_password: new_value }, () => {});
            }}
          />
          <div style={{ width: "20px", height: "20px" }} />
          <Button
            variant="contained"
            onClick={() => {
              this.onTrainClick();
            }}
          >
            Train
          </Button>
        </div>
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
