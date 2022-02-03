import { Alert, Col, Row, Space, Table } from "antd";
import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "./Dashboard.scss";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { AppContext } from "../App";
import { useNavigate } from "react-router";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface IDashboardTableData {
  data: { key: string; category: string; score: number; passOrFail: string }[];
}

interface IDashboardTableProps {
  data: IDashboardTableData[];
}

const DashboardTable: React.FC<IDashboardTableProps> = (
  props: IDashboardTableProps
) => {
  const columns = [
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Score",
      dataIndex: "score",
      key: "score",
    },
    {
      title: "Pass / Fail",
      dataIndex: "passOrFail",
      key: "passOrFail",
    },
  ];

  return <Table columns={columns} dataSource={props.data} />;
};

const Dashboard = () => {
  const [averageScore, setAverageScore] = useState<number | null>(null);
  const [tableData, setTableData] = useState<IDashboardTableData[] | null>([]);
  const [barData, setBarData] = useState<ChartData<
    "bar",
    number[],
    unknown
  > | null>(null);
  const [errMsg, setErrMsg] = useState("");
  const { state, dispatch } = useContext(AppContext);
  const navigate = useNavigate();

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
      },
    },
  };

  useEffect(() => {
    const timeId = setTimeout(() => {
      setErrMsg("");
    }, 3000);

    return () => {
      clearTimeout(timeId);
    };
  }, [errMsg]);

  useEffect(() => {
    (async () => {
      if (!state.token) navigate("/");

      const fetchRes = await fetch(
        process.env.REACT_APP_BACKEND_URL + "/dashboard",
        {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        }
      );

      if (fetchRes.status !== 200) {
        const res = await fetchRes.json();
        setErrMsg(res.message);
      }

      const res = await fetchRes.json();

      const tableData = res.recent_record.map((data: { score: number }) => {
        return { ...data, passOrFail: data.score > 50 ? "Pass" : "Fail" };
      });

      setTableData(tableData);
      setAverageScore(res.average_score);
      setBarData(res.bar_data);
    })();
  }, []);

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
      <Navbar />
      {barData && tableData && (
        <div id="dashboard-content-outer-container">
          <div id="dashboard-content-inner-container">
            <Row>
              <Col flex="1 1 300px">
                <div id="average-score-container">
                  <div id="average-score-inner-container">
                    <p>Average Score</p>
                    <p>{averageScore}</p>
                  </div>
                </div>
              </Col>
              <Col
                flex="1 1 300px"
                offset={1}
                xs={{ offset: 0 }}
                md={{ offset: 1 }}
              >
                <Bar options={options} data={barData} />
              </Col>
            </Row>
            <Row>
              <Col flex="1 1 300px">
                <DashboardTable data={tableData} />
              </Col>
            </Row>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
