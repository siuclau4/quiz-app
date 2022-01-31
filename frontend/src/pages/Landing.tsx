import { Button, Modal } from "antd";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Landing.scss";

const Landing: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  return (
    <div>
      <div id="nav-bar">
        <Button disabled style={{ marginRight: 20 }}>
          Login
        </Button>
        <Button disabled>Sign up</Button>
      </div>
      <div id="landing-content-outer-container">
        <div id="landing-content-inner-container">
          <div id="landing-title">Click the Start button to start the quiz</div>
          <div id="start-btn-container">
            <Button type="primary" onClick={showModal}>
              Start
            </Button>
            <Modal
              title="Please choose one category"
              visible={isModalVisible}
              onOk={handleOk}
              onCancel={handleCancel}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
