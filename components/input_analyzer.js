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

class InputAnalyzer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keyboard_actions: [],
      smart_password: ""
    };
  }

  componentDidMount() {}

  onTrainClick = async () => {
    console.log("this.props.phrase", this.props.phrase);
    let keyboard_actions = collectKeyboardActions({
      phrase: this.props.phrase,
      keyboard_actions: [...this.state.keyboard_actions]
    });
    const response = await axios.post(this.props.url, {
      keyboard_actions,
      id: this.props.user.id,
      phrase: this.props.phrase
      // initializator: this.props.user.password_hash
    });
    console.log("response", response);
    this.props.on_succes();
  };

  render() {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "rgba(255,255,255,0.65)",
          padding: "20px",
          borderRadius: "10px",
          margin: "20px 0px",
          width: "calc(100% - 40px)"
        }}
      >
        <h2>{this.props.block_title}</h2>
        <TextField
          type={"text"}
          id="filled"
          label="Enter this phrase to below input to confirm your personality"
          variant="filled"
          value={this.props.phrase}
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
          value={this.state.smart_password}
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
          {this.props.button_text}
        </Button>
      </div>
    );
  }
}

export default InputAnalyzer;
