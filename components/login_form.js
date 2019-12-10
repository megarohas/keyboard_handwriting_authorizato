import React from "react";
import Link from "next/link.js";
import axios from "axios";
import { Cookies } from "react-cookie";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
const cookies = new Cookies();

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: cookies.get("token") || null,
      email: "",
      password: ""
    };
  }

  onLoginClick = async () => {
    const response = await axios.post("/api/log_in", {
      email: this.state.email,
      password: this.state.password
    });
    const token = response.data.token;
    cookies.set("token", token);
    this.setState({
      token: token
    });
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
          height: "100%"
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", width: "33%" }}>
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
          <Button
            variant="contained"
            onClick={() => {
              this.onLoginClick();
            }}
          >
            LogIn
          </Button>
          <Link href="/secret">
            <a>Secret page</a>
          </Link>
        </div>
      </div>
    );
  }
}

export default LoginForm;
