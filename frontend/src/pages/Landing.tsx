import { Alert, Button, Col, Input, Modal, Row, Space } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Landing.scss";
import Navbar from "../components/Navbar";

const Landing: React.FC = () => {
  const [isStartModalVisible, setIsStartModalVisible] = useState(false);

  return (
    <div>
      <Modal
        title="Please choose one category"
        visible={isStartModalVisible}
        onCancel={() => setIsStartModalVisible(false)}
        footer={null}
      >
        <Link to="/quiz?category=1">General Knowledge</Link>
        <br />
        <br />
        <Link to="/quiz?category=2">Sports</Link>
        <br />
        <br />
        <Link to="/quiz?category=3">History</Link>
        <br />
      </Modal>
      <Navbar />
      <div id="landing-content-outer-container">
        <div id="landing-content-inner-container">
          <div id="landing-title">Click the Start button to start the quiz</div>
          <div id="start-btn-container">
            <Button
              type="primary"
              size="large"
              onClick={() => setIsStartModalVisible(true)}
            >
              Start
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
