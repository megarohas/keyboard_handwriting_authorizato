import React from "react";
import Link from "next/link.js";
import axios from "axios";
import { Cookies } from "react-cookie";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
const cookies = new Cookies();
import Snackbar from "@material-ui/core/Snackbar";
import Router from "next/router";
import { collectKeyboardActions } from "../helpers/front/funcs.js";
import CustomSnackbar from "./custom_snackbar.js";

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: cookies.get("token") || null,
      email: "",
      password: "",
      phrase: "",
      alert_is_open: false,
      last_key_down_timestamp: 0,
      last_key_up_timestamp: 0,
      keyboard_actions: [],
      smart_password: ""
    };
  }

  // <Link href="/secret">
  //   <a>Secret page</a>
  // </Link>

  componentDidMount() {
    axios.get("/api/get_current_phrase").then(response => {
      console.log("response", response);
      this.setState({ phrase: response.data.phrase });
    });
  }

  onLoginClick = async () => {
    let response = { data: { token: "" } };
    if (this.state.keyboard_actions.length > 0) {
      let keyboard_actions = collectKeyboardActions({
        phrase: this.state.phrase,
        keyboard_actions: [...this.state.keyboard_actions]
      });

      response = await axios.post("/api/smart_log_in", {
        email: this.state.email,
        keyboard_actions,
        phrase: this.state.phrase
      });
    } else {
      response = await axios.post("/api/log_in", {
        email: this.state.email,
        password: this.state.password
      });
    }

    console.log("response", response);
    const token = response.data.token;
    cookies.set("token", token);
    this.setState({
      token: token,
      alert_is_open: true
    });

    setTimeout(() => {
      this.setState({ alert_is_open: false });
      Router.push("/dashboard");
    }, 1000);
  };

  render() {
    return (
      <div
        style={{
          position: "fixed",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          top: "0px",
          left: "0px",
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(54,69,79,0.15)"
        }}
      >
        <CustomSnackbar
          is_open={this.state.alert_is_open}
          on_close={() => {
            this.setState({ alert_is_open: false });
          }}
          message={"Log In was Successful"}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "33%",
            backgroundColor: "white",
            padding: "50px 50px",
            borderRadius: "5px",
            boxShadow: "0 0 10px rgba(0,0,0,0.22)",
            minWidth: "256px"
          }}
        >
          <div
            style={{
              fontFamily: "Roboto",
              fontSize: "35px",
              fontWeight: "bold",
              textAlign: "center",
              color: "rgb(64,81,182)",
              textShadow: "1px 1px 2px #e200ff59"
            }}
          >
            Enter required data for login
          </div>
          <div style={{ width: "20px", height: "40px" }} />
          <TextField
            required
            id="filled-required-email"
            label="Email"
            defaultValue=""
            variant="filled"
            onChange={e => {
              this.setState({ email: e.target.value });
            }}
          />
          <div style={{ width: "20px", height: "20px" }} />
          <TextField
            type={"password"}
            required
            id="filled-required-password"
            label="Password"
            defaultValue=""
            variant="filled"
            onChange={e => {
              this.setState({ password: e.target.value });
            }}
          />
          <div style={{ width: "20px", height: "20px" }} />
          <TextField
            type={"text"}
            id="filled"
            label="Enter this phrase to below input to confirm your personality"
            // defaultValue={this.state.phrase}
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
            id="filled-required-smart-password"
            label="Enter Check Phrase Here"
            defaultValue=""
            variant="filled"
            onKeyDown={e => {
              // console.log("onKeyDown", Date.now(), e.key);
              let keyboard_actions = [...this.state.keyboard_actions];
              keyboard_actions.push({
                type: "key_down",
                timestamp: Date.now(),
                key: e.key
              });
              this.setState({ keyboard_actions });
            }}
            onKeyUp={e => {
              // console.log("onKeyUp", Date.now(), e.key);
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
              this.setState({ smart_password: new_value }, () => {
                // console.log("new value:", new_value, [
                //   ...this.state.keyboard_actions
                // ]);
              });
            }}
          />
          <div style={{ width: "20px", height: "20px" }} />

          <Button
            variant="contained"
            onClick={() => {
              this.onLoginClick();
            }}
          >
            LogIn
          </Button>
          <div style={{ width: "20px", height: "20px" }} />
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              this.props.button_action();
            }}
          >
            {this.props.button_text}
          </Button>
        </div>
      </div>
    );
  }
}

export default LoginForm;
