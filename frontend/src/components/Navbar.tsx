import { Alert, Button, Col, Input, Modal, Row, Space } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { AppContext } from "../App";
import "./Navbar.scss";

interface ILoginModalProps {
  isLoginModalVisible: boolean;
  setIsLoginModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ISigUpModalProps {
  isSignUpModalVisible: boolean;
  setIsSignUpModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginModal: React.FC<ILoginModalProps> = (props: ILoginModalProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const { state, dispatch } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    setUsername("");
    setPassword("");
  }, [props.isLoginModalVisible]);

  async function login() {
    try {
      if (!username || !password) {
        setErrMsg("Please input username and password");
      }

      const fetchRes = await fetch(
        process.env.REACT_APP_BACKEND_URL + "/user/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      if (fetchRes.status !== 200) {
        const res = await fetchRes.json();
        setErrMsg(res.message);
        return;
      }

      const res = await fetchRes.json();

      dispatch({
        type: "@@AUTH/LOGIN",
        token: res.token,
        username: res.username,
        userId: res.user_id,
      });

      // redirect
      navigate("/dashboard");
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    const timeId = setTimeout(() => {
      setErrMsg("");
    }, 3000);

    return () => {
      clearTimeout(timeId);
    };
  }, [errMsg]);

  return (
    <>
      {errMsg && (
        <Alert
          style={{
            position: "fixed",
            width: "100%",
            zIndex: 1001,
            textAlign: "center",
          }}
          message={errMsg}
          type="error"
        />
      )}
      <Modal
        title="Login"
        visible={props.isLoginModalVisible}
        onCancel={() => props.setIsLoginModalVisible(false)}
        footer={null}
      >
        <Row justify="center">
          <Col>
            <Space direction="vertical">
              <Input
                value={username}
                placeholder="Username"
                maxLength={20}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input.Password
                value={password}
                placeholder="Password"
                maxLength={20}
                onChange={(e) => setPassword(e.target.value)}
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />

              <Button onClick={login}>Login</Button>
            </Space>
          </Col>
        </Row>
      </Modal>
    </>
  );
};

const SignUpModal: React.FC<ISigUpModalProps> = (props: ISigUpModalProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [msg, setMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");
  let navigate = useNavigate();

  useEffect(() => {
    setUsername("");
    setPassword("");
    setRePassword("");
  }, [props.isSignUpModalVisible]);

  async function signUp() {
    try {
      if (!username || !password || !rePassword) {
        setErrMsg("Please input username and password");
        return;
      }

      const fetchRes = await fetch(
        process.env.REACT_APP_BACKEND_URL + "/user/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      if (fetchRes.status !== 200) {
        const res = await fetchRes.json();
        setErrMsg(res.message);
        return;
      }

      setMsg("successfully sign up");

      props.setIsSignUpModalVisible(false);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    const timeId = setTimeout(() => {
      setMsg("");
    }, 3000);

    return () => {
      clearTimeout(timeId);
    };
  }, [msg]);

  useEffect(() => {
    const timeId = setTimeout(() => {
      setErrMsg("");
    }, 3000);

    return () => {
      clearTimeout(timeId);
    };
  }, [errMsg]);

  return (
    <>
      {errMsg && (
        <Alert
          style={{
            position: "fixed",
            width: "100%",
            zIndex: 1001,
            textAlign: "center",
          }}
          message={errMsg}
          type="error"
        />
      )}
      {msg && (
        <Alert
          style={{
            position: "fixed",
            width: "100%",
            zIndex: 1001,
            textAlign: "center",
          }}
          message={msg}
          type="success"
        />
      )}
      <Modal
        title="Login"
        visible={props.isSignUpModalVisible}
        onCancel={() => props.setIsSignUpModalVisible(false)}
        footer={null}
      >
        <Row justify="center">
          <Col>
            <Space direction="vertical">
              <Input
                value={username}
                placeholder="Username"
                maxLength={20}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input.Password
                value={password}
                placeholder="Password"
                maxLength={20}
                onChange={(e) => setPassword(e.target.value)}
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />

              <Input.Password
                value={rePassword}
                placeholder="Re-enter Password"
                maxLength={20}
                onChange={(e) => setRePassword(e.target.value)}
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />

              <Button onClick={signUp}>Login</Button>
            </Space>
          </Col>
        </Row>
      </Modal>
    </>
  );
};

const Navbar = () => {
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [isSignUpModalVisible, setIsSignUpModalVisible] = useState(false);

  const { state, dispatch } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <LoginModal
        isLoginModalVisible={isLoginModalVisible}
        setIsLoginModalVisible={setIsLoginModalVisible}
      />
      <SignUpModal
        isSignUpModalVisible={isSignUpModalVisible}
        setIsSignUpModalVisible={setIsSignUpModalVisible}
      />

      <div id="nav-bar">
        {state.isAuthenticated ? (
          <>
            <Button
              onClick={() => {
                if (location.pathname === "/") navigate("/dashboard");
                if (location.pathname === "/dashboard") navigate("/");
              }}
              style={{ marginRight: 20 }}
            >
              Go to {location.pathname === "/" ? "Dashboard" : "Home"}
            </Button>
            <Button
              type="primary"
              onClick={() => dispatch({ type: "@@AUTH/LOGOUT" })}
              style={{ marginRight: 20 }}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={() => setIsLoginModalVisible(true)}
              style={{ marginRight: 20 }}
            >
              Login
            </Button>
            <Button
              type="primary"
              onClick={() => setIsSignUpModalVisible(true)}
            >
              Sign up
            </Button>
          </>
        )}
      </div>
    </>
  );
};

export default Navbar;
