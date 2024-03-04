import React, { useState, useEffect } from "react";
import {
  HiDocumentArrowDown,
  MdOutlineArrowBackIos,
  MdOutlineArrowForwardIos,
  BiLoader,
  BsEye,
  BsTrash,
  BsFillFileEarmarkPdfFill,
} from "../../middlewares/icons";
import useAxiosPrivate from "../../state/context/hooks/useAxiosPrivate";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import { getDocuments } from "../../services/configuration";
import { isEmpty } from "../../utils/utils";
import { DOCUMENTS } from "../../routes";
import moment from "moment";
import Modal from "react-modal";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

const Document = () => {
  const axiosPrivate = useAxiosPrivate();
  const [isUploading, setIsUploading] = useState(false);
  const [isView, setIsView] = useState(false);
  const [viewFile, setViewFile] = useState({ fileName: "", thumbnails: "" });
  //
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showProgress, setShowProgress] = useState(false);

  const dispatch = useDispatch();
  const connectedUser = useSelector(
    (state) => state.setInitConf.initConnectedUser.connectedUserData
  );

  const documents = useSelector(
    (state) => state.setInitConf.initDocuments.documentsData
  );

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const signal = controller.signal;

    getDocuments(axiosPrivate, signal).then((result) => {
      dispatch({
        type: "setUp/getDocuments",
        payload: result,
      });
    });

    return () => {
      isMounted = false;
      isMounted && controller.abort();
    };
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
    setFiles((prevState) => [
      ...prevState,
      { name: fileName, loading: 0, size: 0, status: false },
    ]);
    setShowProgress(true);
    setIsUploading(true);
    axios
      .post(
        `${process.env.REACT_APP_SERVER_IP_ADDRESS}:${process.env.REACT_APP_SERVER_PORT}/api/v1${DOCUMENTS}?userNames=${
          connectedUser?.userInfo?.prename + "-" + connectedUser?.userInfo?.name
        }`,
        formData,
        {
          onUploadProgress: async ({ loaded, total }) => {
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
              setIsUploading(false);
              //
              // update
              let isMounted = true;
              const controller = new AbortController();
              const signal = controller.signal;

              await getDocuments(axiosPrivate, signal).then((result) => {
                dispatch({
                  type: "setUp/getDocuments",
                  payload: result,
                });
              });

              return () => {
                isMounted = false;
                isMounted && controller.abort();
              };
            }
          },
        }
      )
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

  const docs = [
    {
      uri: `${process.env.REACT_APP_SERVER_IP_ADDRESS}:${process.env.REACT_APP_SERVER_PORT}/documents/${
        connectedUser?.userInfo?.prename + "-" + connectedUser?.userInfo?.name
      }/${viewFile.thumbnails}`,
    },
  ];

  return (
    <>
      <div className="documents">
        <div className="head display-flex justify-content-space-between">
          <div>
            <h2 className="title t-1">My Documents</h2>
            <p className="title t-3">
              All of your uploaded documents will appear here (Only .pdf
              allowed).
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
                  <th>Document title</th>
                  <th>Uploaded on</th>
                  <th>Options</th>
                </tr>
              </thead>
              <tbody>
                {isEmpty(documents?.data?.documents) ? (
                  <tr>
                    <td
                      colSpan="4"
                      style={{
                        textAlign: "center",
                        color: "lightslategray",
                        fontSize: "1em",
                      }}
                    >
                      {documents?.data?.message}
                    </td>
                  </tr>
                ) : (
                  documents?.data?.documents.map((doc, i) => {
                    return (connectedUser?.userInfo?.user_id === doc.user_id &&
                      <tr>
                        <td>
                          <input type="checkbox" />
                        </td>
                        <td className="tbody-col-1">
                          <h3 className="title t-2">
                            <BsFillFileEarmarkPdfFill /> {doc.title}
                          </h3>
                        </td>
                        <td className="tbody-col-2">
                          <p className="title t-3">
                            {`Uploaded on ${moment(doc.updatedAt).format(
                              "ll"
                            )} at ${moment(doc.updatedAt).format("LT")}`}
                          </p>
                        </td>
                        <td>
                          <div className="tbody-col-3">
                            <button
                              className="btn btn-view"
                              onClick={() => {
                                setViewFile({
                                  fileName: doc.title,
                                  thumbnails: doc.thumbnails,
                                });
                                setIsView(true);
                              }}
                            >
                              <BsEye /> <span>View</span>
                            </button>
                            <button className="btn btn-remove">
                              <BsTrash />
                              <span>Remove</span>
                            </button>
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
      <Modal
        contentLabel="Complete Registration"
        isOpen={isView}
        shouldCloseOnOverlayClick={false}
        style={{
          overlay: { backgroundColor: "rgba(0,0,0,0.75)", zIndex: 5 },
          content: {
            color: "inherit",
            width: "70%",
            height: "90%",
            margin: "auto",
            padding: 0,
          },
        }}
      >
        <div className="modal">
          <div className="modal-head display-flex justify-content-space-between align-items-center">
            <h3 className="title t-1">{viewFile.fileName}</h3>
            <span className="modal_close" onClick={() => setIsView(false)}>
              &times;
            </span>
          </div>
          <div className="modal-body">
            <DocViewer
              documents={docs}
              pluginRenderers={DocViewerRenderers}
              config={{
                header: {
                  disableHeader: true,
                  disableFileName: true,
                  retainURLParams: false,
                },
                csvDelimiter: ",", // "," as default,
                pdfZoom: {
                  defaultZoom: 1.1, // 1 as default,
                  zoomJump: 0.2, // 0.1 as default,
                },
                pdfVerticalScrollByDefault: true, // false as default
              }}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Document;
