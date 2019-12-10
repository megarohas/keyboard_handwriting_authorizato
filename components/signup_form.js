import React from "react";
import Link from "next/link.js";
import axios from "axios";
import { Cookies } from "react-cookie";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
const cookies = new Cookies();

class SignupForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: cookies.get("token") || null,
      email: "",
      password: "",
      name: ""
    };
  }

  // <Link href="/secret">
  //   <a>Secret page</a>
  // </Link>

  onLoginClick = async () => {
    const response = await axios.post("/api/sign_up", {
      email: this.state.email,
      password: this.state.password,
      name: this.state.name
    });

    // alert("Account was created");
    this.setState({ alert_is_open: true });
    setTimeout(() => {
      this.setState({ alert_is_open: false });
      this.props.button_action();
    }, 2000);
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
              Account was created
            </span>
          }
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "33%",
            backgroundColor: "white",
            padding: "50px 50px",
            borderRadius: "5px",
            boxShadow: "0 0 10px rgba(0,0,0,0.22)"
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
            Enter required data to sign up
          </div>
          <div style={{ width: "20px", height: "40px" }} />
          <TextField
            required
            id="filled-required-email"
            label="Name"
            defaultValue=""
            variant="filled"
            onChange={e => {
              this.setState({ name: e.target.value });
            }}
          />
          <div style={{ width: "20px", height: "20px" }} />
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
          <Button
            variant="contained"
            onClick={() => {
              this.onLoginClick();
            }}
          >
            SignUp
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

export default SignupForm;
