import React, { useState, useEffect } from "react";
import {
  HiDocumentArrowDown,
  MdOutlineArrowBackIos,
  MdOutlineArrowForwardIos,
  BiLoader,
  BsEye,
} from "../../middlewares/icons";
import { Link } from "react-router-dom";
import useAxiosPrivate from "../../state/context/hooks/useAxiosPrivate";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import { getContracts, getSigners } from "../../services/configuration";
import { getUsers } from "../../services/users";
import { isEmpty } from "../../utils/utils";
import { CONTRACTS } from "../../routes";
import moment from "moment";

const Documents = () => {
  const axiosPrivate = useAxiosPrivate();
  const [isUploading, setIsUploading] = useState(false);
  const [more, setMore] = useState(false);
  //
  const [_contracts, setContracts] = useState([]);
  //
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showProgress, setShowProgress] = useState(false);

  const dispatch = useDispatch();
  const connectedUser = useSelector(
    (state) => state.setInitConf.initConnectedUser.connectedUserData
  );

  const contracts = useSelector(
    (state) => state.setInitConf.initContracts.contractsData
  );

  const signers = useSelector(
    (state) => state.setInitConf.initSigners.signersData
  );

  const users = useSelector((state) => state.setInitConf.initUsers.usersData);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const signal = controller.signal;

    getContracts(axiosPrivate, signal).then((result) => {
      dispatch({
        type: "setUp/getContracts",
        payload: result,
      });
    });

    getSigners(axiosPrivate, signal)
      .then((result) => {
        dispatch({
          type: "setUp/getSigners",
          payload: result,
        });
      })
      .catch((error) => {
        console.log({ "error ": error });
      });

    getUsers(axiosPrivate, signal)
      .then((result) => {
        dispatch({
          type: "setUp/getUsers",
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

  useEffect(() => {
    setContracts(
      contracts?.data?.contracts.filter(
        (item) => item.user_id === connectedUser?.userInfo?.user_id
      )
    );
  }, []);

  const uploadFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fileName =
      file.name.length > 12
        ? `${file.name.substring(0, 13)}... .${file.name.split(".")[1]}`
        : file.name;

    const formData = new FormData();
    formData.append("thumbnails", file);
    formData.append("user_id", connectedUser?.userInfo?.user_id);
    formData.append(
      "type",
      connectedUser?.userInfo?.sys_role === "admin" ? "EM" : "ST"
    );
    setFiles((prevState) => [
      ...prevState,
      { name: fileName, loading: 0, size: 0, status: false },
    ]);
    setShowProgress(true);
    setIsUploading(true);
    axios
      .post(`${process.env.REACT_APP_SERVER_IP_ADDRESS}:${process.env.REACT_APP_SERVER_PORT}/api/v1${CONTRACTS}`, formData, {
        onUploadProgress: ({ loaded, total }) => {
          setFiles((prevState) => {
            const newFiles = [...prevState];
            newFiles[newFiles.length - 1].loading = Math.floor(
              (loaded / total) * 100
            );
            newFiles[newFiles.length - 1].size =
              total < 1024
                ? `${total}KB`
                : `${(loaded / (1024 * 1024)).toFixed(2)} MB`;
            newFiles[newFiles.length - 1].status = true;
            return newFiles;
          });
          if (loaded === total) {
            const fileSize =
              total < 1024
                ? `${total}KB`
                : `${(loaded / (1024 * 1024)).toFixed(2)} MB`;
            setUploadedFiles([
              ...uploadedFiles,
              { name: fileName, size: fileSize },
            ]);
            // setFiles([]);
            // setShowProgress(false);
            setIsUploading(false);
            //
            // update
            let isMounted = true;
            const controller = new AbortController();
            const signal = controller.signal;

            getContracts(axiosPrivate, signal).then((result) => {
              dispatch({
                type: "setUp/getContracts",
                payload: result,
              });
            });

            getSigners(axiosPrivate, signal)
              .then((result) => {
                dispatch({
                  type: "setUp/getSigners",
                  payload: result,
                });
              })
              .catch((error) => {
                console.log({ "error ": error });
              });

            getUsers(axiosPrivate, signal)
              .then((result) => {
                dispatch({
                  type: "setUp/getSigners",
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
          }
        },
      })
      .catch((error) => {
        setFiles((prevState) => {
          const newFiles = [...prevState];
          newFiles[newFiles.length - 1].status = false;
          return newFiles;
        });
        if (!error?.response) {
          swal({
            title: "Oups!",
            text: "No server response!",
            icon: "warning",
            buttons: true,
          });
        } else {
          swal({
            title: "Operation failed!",
            text: error?.response?.data?.message,
            icon: "warning",
            buttons: true,
          });
        }
      });
  };

  const closeDialog = () => {
    setFiles([]);
    setShowProgress(false);
  };

  return (
    <>
      <div className="documents">
        <div className="head display-flex justify-content-space-between">
          <div>
            <h2 className="title t-1">Documents</h2>
            <p className="title t-3">
              In simplicity, upload, organized and following the progress of the
              documents (Smart contract).
            </p>
          </div>
          <div className="upload-div">
            {showProgress && (
              <div className="upload-process">
                <div className="upload-process-head">
                  <div>
                    <BiLoader className="icon" />{" "}
                    <span>Files uploading...</span>
                  </div>
                  <span className="close" onClick={closeDialog}>
                    &times;
                  </span>
                </div>
                {files.map((item, i) => {
                  return (
                    <>
                      <div className="upload-process-content">
                        <span>{`${item.name} - ${
                          item.loading === 100
                            ? item.status
                              ? "uploaded."
                              : "failed."
                            : "uploading"
                        }`}</span>
                        <span>{item.size}</span>
                      </div>
                      <div className="upload-process-progress">
                        <div className="progress-bar">
                          <div
                            className="progress"
                            style={{ width: `${item.loading}%` }}
                          ></div>
                        </div>
                        <span className="percent">{`${item.loading}%`}</span>
                      </div>
                    </>
                  );
                })}
              </div>
            )}
            <form className="upload-form">
              {isUploading ? (
                <button type="button" className="button">
                  <HiDocumentArrowDown />
                  &nbsp; Upload documents from here
                </button>
              ) : (
                <div className="input-upload">
                  <input
                    type="file"
                    id="input-file"
                    className="input-file"
                    name="thumbnails"
                    onChange={uploadFile}
                  />
                  <label htmlFor="input-file" className="input-file-label">
                    <HiDocumentArrowDown />
                    &nbsp; Upload documents from here
                  </label>
                </div>
              )}
            </form>
          </div>
        </div>
        <div className="body">
          <div className="table">
            <table>
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" />
                  </th>
                  <th>File</th>
                  <th>Signers</th>
                  <th>Remain</th>
                  <th>Status</th>
                  <th>Options</th>
                </tr>
              </thead>
              <tbody>
                {isEmpty(_contracts) ? (
                  <tr>
                    <td
                      colSpan="5"
                      style={{
                        textAlign: "center",
                        color: "lightslategray",
                        fontSize: "1em",
                      }}
                    >
                      No contract upload yet!
                    </td>
                  </tr>
                ) : (
                  _contracts.map((contr, i) => {
                    return (
                      <tr key={i}>
                        <td>
                          <input type="checkbox" />
                        </td>
                        <td>
                          <div className="tbody-col-1">
                            <div className="file-preview">
                              <div className="preview-image">
                                <img
                                  src={process.env.PUBLIC_URL + "/logo.png"}
                                  alt="doc"
                                />
                              </div>
                              <div className="preview-btn fade-in">
                                <BsEye className="icon" />
                              </div>
                            </div>
                            <div className="file-info">
                              <h3 className="title t-2">{contr.title}</h3>
                              <p className="title t-3">
                                {`Uploaded on ${moment(contr.updatedAt).format(
                                  "ll"
                                )} at ${moment(contr.updatedAt).format("LT")}`}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="tbody-col-2">
                            <p className="title t-3">Signed by :</p>
                            <div className="signers">
                              {isEmpty(signers?.data?.signers) ? (
                                <span
                                  style={{
                                    textAlign: "center",
                                    color: "lightslategray",
                                    fontSize: "1em",
                                  }}
                                >
                                  {signers?.data?.message}
                                </span>
                              ) : (
                                signers?.data?.signers.map((signerLoc, i) => {
                                  if (contr.id === signerLoc.contract_id) {
                                    if (signerLoc.status === 1) {
                                      let _users = users?.data?.users.filter(
                                        (userItem) =>
                                          signerLoc.user_id === userItem.id
                                      );
                                      let _mail = _users.map(
                                        (userItem) => userItem.mail
                                      );
                                      return <button>{_mail}</button>;
                                    } else {
                                      return "#";
                                    }
                                  }
                                })
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="tbody-col-2">
                            <p className="title t-3">on Standby :</p>
                            <div className="signers">
                              {isEmpty(signers?.data?.signers) ? (
                                <span
                                  style={{
                                    textAlign: "center",
                                    color: "lightslategray",
                                    fontSize: "1em",
                                  }}
                                >
                                  {signers?.data?.message}
                                </span>
                              ) : (
                                signers?.data?.signers.map((signerLoc, i) => {
                                  if (contr.id === signerLoc.contract_id) {
                                    if (signerLoc.status === 0) {
                                      let _users = users?.data?.users.filter(
                                        (userItem) =>
                                          signerLoc.user_id === userItem.id
                                      );
                                      let _mail = _users.map(
                                        (userItem) => userItem.mail
                                      );
                                      return <button>{_mail}</button>;
                                    } else {
                                      return "#";
                                    }
                                  }
                                })
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="status pending">Completed/Not</span>
                        </td>
                        <td>
                          <div className="tbody-col-3">
                            <div className="main-div">
                              <Link
                                to={`/admin/signings/${contr.id}/${contr.title}/${contr.thumbnails}`}
                                className="btn btn-invite-signer"
                                onClick={() => {
                                  dispatch({
                                    type: "setUp/getAnnotation",
                                    payload: contr.annotations,
                                  });
                                }}
                              >
                                Invite Signers
                              </Link>
                              <button
                                className="btn btn-invite-more"
                                onClick={() => setMore(!more)}
                              >
                                More
                              </button>
                            </div>
                            {more && (
                              <div className="pop-div fade-in">
                                <Link to="" className="more-item">
                                  Option 1
                                </Link>
                                <Link to="" className="more-item">
                                  Option 2
                                </Link>
                                <Link to="" className="more-item">
                                  Option 3
                                </Link>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <div className="pagination display-flex justify-content-space-between align-items-center">
            <span>1-5 of 45</span>
            <div className="display-flex align-items-center">
              <div className="display-flex align-items-center">
                <span>Rows per page :</span>
                <select>
                  <option>5</option>
                  <option>10</option>
                </select>
              </div>
              <div className="display-flex align-items-center">
                <button className="button">
                  <MdOutlineArrowBackIos className="icon" />
                </button>
                <button className="button">
                  <MdOutlineArrowForwardIos className="icon" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Documents;
