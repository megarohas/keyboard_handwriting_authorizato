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
import Profile from "../components/profile.js";
import InputAnalyzer from "../components/input_analyzer.js";
import Trains from "../components/trains.js";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: { email: "", name: "Profile" },
      alert_is_open: false,
      phrase: "",
      trains: []
    };
  }

  componentDidMount() {
    console.log("props", this.props);
    this.setState({ user: this.props.user });
    axios.get("/api/get_current_phrase").then(response => {
      console.log("response", response);
      this.setState({ phrase: response.data.phrase });
    });
    axios
      .post("/api/get_user_trains", { user_id: this.props.user.id })
      .then(response => {
        console.log("response", response);
        this.setState({ trains: response.data.trains });
      });
  }

  render() {
    return (
      <div
        style={{
          position: "fixed",
          overflow: "scroll",
          padding: "20px",
          top: "0px",
          left: "0px",
          width: "calc(100% - 40px)",
          height: "calc(100% - 40px)",
          backgroundImage: "url(/dashboard_bg.jpg)",
          fontFamily: "Roboto"
        }}
      >
        <Head>
          <title>{this.state.user.name}</title>
          <link rel="icon" href="/favicon.ico" />
          <link
            href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900&display=swap"
            rel="stylesheet"
          />
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
        <div
          style={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
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
        </div>
        <Profile user={this.state.user} />
        <InputAnalyzer
          user={this.state.user}
          phrase={this.state.phrase}
          url={"/api/train"}
          button_text={"Train"}
          block_title={"Use this form to improve accuracy of smart log in."}
          on_succes={() => {
            this.setState({
              alert_is_open: true
            });
            setTimeout(() => {
              this.setState({ alert_is_open: false });
            }, 1000);
          }}
          on_error={() => {
            console.log("error");
          }}
        />
        <Trains trains={this.state.trains} />
      </div>
    );
  }
}

Dashboard.getInitialProps = async ctx => {
  let response = { response: { data: { user: {} } } };

  await handleAuthSSR(ctx);

  let token = "";
  if (ctx.req) {
    token = ctx.req.headers.cookie.replace(
      /(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    serverUrl = ctx.req.headers.host;
  } else {
    token = cookies.get("token");
    serverUrl = location.origin;
  }
  console.log("token", token);

  if (serverUrl == "localhost") {
    serverUrl = "http://localhost:3000";
  }
  if (serverUrl == "localhost:3000") {
    serverUrl = "http://localhost:3000";
  }

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

    // console.log(`${serverUrl}/api/get_current_user response`, response);
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

export default Dashboard;
