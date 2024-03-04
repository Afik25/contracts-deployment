import React from "react";
import Chart from "react-apexcharts";
import {
  BiUser,
  FiUsers,
  BsCloudUploadFill,
  BsCloudDownloadFill,
} from "../../middlewares/icons";
import useAxiosPrivate from "../../state/context/hooks/useAxiosPrivate";
import { useDispatch, useSelector } from "react-redux";
import { getDashboard } from "../../services/configuration";
import { isEmpty } from "../../utils/utils";
import moment from "moment";

const Dashboard = () => {
  const axiosPrivate = useAxiosPrivate();

  const dispatch = useDispatch();
  const connectedUser = useSelector(
    (state) => state.setInitConf.initConnectedUser.connectedUserData
  );
  const dashboard = useSelector(
    (state) => state.setInitConf.initDashboard.dashboardData
  );

  console.log({ "check dashboard ": dashboard });

  React.useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const signal = controller.signal;

    getDashboard(axiosPrivate, signal)
      .then((result) => {
        dispatch({
          type: "setUp/getDashboard",
          payload: result,
        });
      })
      .catch((error) => {
        console.log({ "error ": error });
      });

    return () => {
      isMounted = false;
      isMounted && controller.abort();
    };
  }, []);

  const percentData = [
    {
      label: "Male",
      value: dashboard?.data?.result?.user?.male_percent,
    },
    {
      label: "Female",
      value: dashboard?.data?.result?.user?.female_percent,
    },
  ];
  return (
    <div className="dashboard">
      <div className="container">
        <div className="box box1">
          {connectedUser?.userInfo?.sys_role === "user" && (
            <div className="item">
              <div className="left">
                <p className="title t-3">Total registration</p>
                <h2 className="title t-2">
                  {dashboard?.data?.result?.user?.total_students}
                </h2>
              </div>
              <div className="right">
                <div className="bloc">
                  <h2 className="title t-2">
                    {dashboard?.data?.result?.user?.total_student_male}
                  </h2>
                  <p>
                    <span className="male">
                      <BiUser className="icon" />
                    </span>
                    <span>Male</span>
                  </p>
                </div>
                <div className="bloc">
                  <h2 className="title t-2">
                    {dashboard?.data?.result?.user?.total_student_female}
                  </h2>
                  <p>
                    <span className="female">
                      <BiUser className="icon" />
                    </span>
                    <span>Female</span>
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="item">
            <p className="title t-3">Last registrations</p>
            {connectedUser?.userInfo?.sys_role === "admin" ? (
              isEmpty(dashboard?.data?.result?.admin?.last_employees) ? (
                <p
                  className="title t-3"
                  style={{ color: "red", fontSize: "1em" }}
                >
                  No employee registred yet!
                </p>
              ) : (
                dashboard?.data?.result?.admin?.last_employees.map(
                  (item, i) => {
                    if (i < 3) {
                      return (
                        <h2 className="title t-2">
                          {item.prename + " " + item.name}{" "}
                          <span>
                            {`${moment(item.createdAt).format(
                              "ll"
                            )} at ${moment(item.createdAt).format("LT")}`}
                          </span>
                        </h2>
                      );
                    }
                  }
                )
              )
            ) : isEmpty(dashboard?.data?.result?.user?.last_students) ? (
              <p
                className="title t-3"
                style={{ color: "red", fontSize: "1em" }}
              >
                No student registered yet!
              </p>
            ) : (
              dashboard?.data?.result?.user?.last_students.map((item, i) => {
                if (i < 3) {
                  return (
                    <h2 className="title t-2">
                      {item.prename + " " + item.name}{" "}
                      <span>
                        {`${moment(item.createdAt).format("ll")} at ${moment(
                          item.createdAt
                        ).format("LT")}`}
                      </span>
                    </h2>
                  );
                }
              })
            )}
            <p className="title t-3">Last uploaded documents</p>
            {connectedUser?.userInfo?.sys_role === "admin" ? (
              isEmpty(
                dashboard?.data?.result?.admin?.last_employees_contracts
              ) ? (
                <p
                  className="title t-3"
                  style={{ color: "red", fontSize: "1em" }}
                >
                  No contract uploaded yet!
                </p>
              ) : (
                dashboard?.data?.result?.admin?.last_employees_contracts.map(
                  (item, i) => {
                    if (i < 3) {
                      return (
                        <h2 className="title t-2">
                          {item.title}
                          <span>{`${moment(item.createdAt).format(
                            "ll"
                          )} at ${moment(item.createdAt).format("LT")}`}</span>
                        </h2>
                      );
                    }
                  }
                )
              )
            ) : isEmpty(
                dashboard?.data?.result?.user?.last_students_contracts
              ) ? (
              <p
                className="title t-3"
                style={{ color: "red", fontSize: "1em" }}
              >
                No contract for student uploaded yet!
              </p>
            ) : (
              dashboard?.data?.result?.user?.last_students_contracts.map(
                (item, i) => {
                  if (i < 3) {
                    return (
                      <h2 className="title t-2">
                        {item.title}
                        <span>{`${moment(item.createdAt).format(
                          "ll"
                        )} at ${moment(item.createdAt).format("LT")}`}</span>
                      </h2>
                    );
                  }
                }
              )
            )}
          </div>
        </div>
        {connectedUser?.userInfo?.sys_role === "user" && (
          <div className="box box2">
            <Chart
              type="pie"
              width={700}
              height={400}
              series={percentData.map((item) => item.value)}
              options={{
                title: { text: "Student registration by Percent" },
                noData: { text: "No information." },
                labels: percentData.map((item) => item.label),
              }}
            />
          </div>
        )}
        <div className="box box3">
          {connectedUser?.userInfo?.sys_role === "admin" && (
            <div className="item">
              <h2 className="title t-2">
                {dashboard?.data?.result?.admin?.total_employees}
              </h2>
              <p>
                <span className="icon-wrapper">
                  <FiUsers className="icon" />
                </span>
                <span>Total employees</span>
              </p>
            </div>
          )}
          {connectedUser?.userInfo?.sys_role === "user" && (
            <div className="item">
              <h2 className="title t-2">
                {dashboard?.data?.result?.user?.total_students_contracts}
              </h2>
              <p>
                <span className="icon-wrapper">
                  <BsCloudUploadFill className="icon" />
                </span>
                <span>Total uploaded documents for students</span>
              </p>
            </div>
          )}
          {connectedUser?.userInfo?.sys_role === "admin" && (
            <div className="item">
              <h2 className="title t-2">
                {dashboard?.data?.result?.admin?.total_contracts_enterprise}
              </h2>
              <p>
                <span className="icon-wrapper">
                  <BsCloudUploadFill className="icon" />
                </span>
                <span>Total uploaded documents for enterprise</span>
              </p>
            </div>
          )}
          <div className="item">
            <h2 className="title t-2">0</h2>
            <p>
              <span className="icon-wrapper" style={{ backgroundColor: "red" }}>
                <BsCloudDownloadFill
                  className="icon"
                  style={{ color: "white" }}
                />
              </span>
              <span>Total canceled documents</span>
            </p>
          </div>
        </div>
        <div className="box box4">
          <Chart
            type="bar"
            height={350}
            series={[
              {
                name: "Enterprise",
                data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
              },
              {
                name: "Student",
                data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
              },
            ]}
            options={{
              title: { text: "Uploaded documents" },
              noData: { text: "No information." },
              // labels: data.map((item) => item.label),
              chart: {
                type: "bar",
                height: 350,
              },
              plotOptions: {
                bar: {
                  horizontal: false,
                  columnWidth: "55%",
                  endingShape: "rounded",
                },
              },
              dataLabels: {
                enabled: false,
              },
              stroke: {
                show: true,
                width: 2,
                colors: ["transparent"],
              },
              xaxis: {
                categories: [
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                ],
              },
              yaxis: {
                title: {
                  text: "number of uploaded documents",
                },
              },
              fill: {
                opacity: 1,
              },
              tooltip: {
                y: {
                  formatter: function (val) {
                    return val + " documents";
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
