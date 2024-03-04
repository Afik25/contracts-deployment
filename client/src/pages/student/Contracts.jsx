import React, { useState, useEffect, useRef } from "react";
import { BsFillFileEarmarkPdfFill } from "../../middlewares/icons";
import useAxiosPrivate from "../../state/context/hooks/useAxiosPrivate";
import { useDispatch, useSelector } from "react-redux";
import { getContracts, getSigners } from "../../services/configuration";
import { isEmpty } from "../../utils/utils";
import WebViewer from "@pdftron/webviewer";

const Contracts = () => {
  const axiosPrivate = useAxiosPrivate();
  const [viewFile, setViewFile] = useState({
    fileName: "",
    thumbnails: "",
    signer_id: "",
  });
  const [active, setActive] = useState();
  const [annotation, setAnnotation] = useState();
  // 
  const viewer = useRef(null);
  const annot = useSelector(
    (state) => state.setInitConf.initAnnotation.annotation
  );
  // 

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

    return () => {
      isMounted = false;
      isMounted && controller.abort();
    };
  }, []);

  useEffect(()=>{
    WebViewer(
      {
        path: "/webviewer/lib",
        // licenseKey: 'YOUR_LICENSE_KEY',
        // initialDoc: 'https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf',
        initialDoc: `${process.env.REACT_APP_SERVER_IP_ADDRESS}:${process.env.REACT_APP_SERVER_PORT}/contracts/${viewFile?.thumbnails}`,
        documentXFDFRetriever: () => annot,
      },
      viewer.current
    ).then(async(instance) => {
      const { documentViewer } = instance.Core;
      const annotManager = documentViewer.getAnnotationManager();
      //
      documentViewer.setDocumentXFDFRetriever(async () => {
        return annot;
      })
      //
      const annots = await annotManager.exportAnnotations({
        links: false,
        widgets: false,
      });
      setAnnotation(annots)
    });
  }, [])

  return (
    <div className="contracts">
      <div className="head display-flex justify-content-space-between">
        <div>
          <h2 className="title t-1">My Contracts</h2>
          <p className="title t-3">
            All of your contracts will be showed here.
          </p>
        </div>
      </div>
      <div className="body">
        <div className="left"></div>
        <div className="right">
          {isEmpty(signers?.data?.signers) ? (
            <p className="title t-2">
              No information about contracts available.
            </p>
          ) : (
            signers?.data?.signers.map((sign) => {
              if (sign.user_id === connectedUser?.userInfo?.user_id) {
                contracts?.data?.contracts.map((contr, i) => {
                  if (sign.document_id === contr.id) {
                    return (
                      <div
                      key={i}
                        className={
                          active === contr.id ? "item active-item" : "item"
                        }
                        onClick={() => {
                          setViewFile({
                            fileName: contr.title,
                            thumbnails: contr.thumbnails,
                            signer_id: sign.id,
                          });
                          setActive(contr.id);
                        }}
                      >
                        <BsFillFileEarmarkPdfFill className="icon" />
                        <p
                          className="status"
                          style={{
                            backgroundColor: `${
                              sign.status === 1 ? "green" : "grey"
                            }`,
                            color: `${sign.status === 1 ? "white" : "black"}`,
                          }}
                        >
                          {sign.status === 1 ? "Signed" : "Pending"}
                        </p>
                        <h2 className="title t-2">{contr.title}</h2>
                      </div>
                    );
                  }
                });
              }
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Contracts;
