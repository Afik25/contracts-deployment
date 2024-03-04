import React, { useState, useRef, useEffect } from "react";
import { BiArrowBack, FaPlus } from "../../middlewares/icons";
import Modal from "react-modal";
import swal from "sweetalert";
import useAxiosPrivate from "../../state/context/hooks/useAxiosPrivate";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useParams } from "react-router-dom";
// import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { isEmpty, validationSigners } from "../../utils/utils";
import WebViewer from "@pdftron/webviewer";
import { newAssignedSigners } from "../../services/documents";
import { useSelector } from "react-redux";

const Signings = () => {
  const axiosPrivate = useAxiosPrivate();
  const { id, title, thumbnails } = useParams();
  const [open, setOpen] = useState(true);
  const [signersTab, setSignersTab] = useState([]);
  const [annotation, setAnnotation] = useState();
  //
  const viewer = useRef(null);
  const annot = useSelector(
    (state) => state.setInitConf.initAnnotation.annotation
  );

  useEffect(() => {
    WebViewer(
      {
        path: "/webviewer/lib",
        // licenseKey: 'YOUR_LICENSE_KEY',
        // initialDoc: 'https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf',
        initialDoc: `${process.env.REACT_APP_SERVER_IP_ADDRESS}:${process.env.REACT_APP_SERVER_PORT}/${thumbnails}`,
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
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onTouched",
    resolver: yupResolver(validationSigners),
  });

  const onAdd = async (data) => {
    setSignersTab([
      ...signersTab,
      {
        names: data.names,
        mail: data.mail,
        type: data.type,
        order: "step1",
      },
    ]);
    reset();
  };

  const onOrder = (data, i) => {
    // console.log({ "check onOrder ": data, "order":i });

    setSignersTab((prevState) => {
      const newSigners = [...prevState];
      newSigners[i].order = data;
      return newSigners;
    });
  };

  const onRemove = (i) => {
    setSignersTab((prevState) => {
      const newSigners = [...prevState];
      newSigners.splice(i, 1);
      return newSigners;
    });
  };

  const onValidate = async () => {
    setOpen(!open);
  };

  const onSubmit = async () => {
    await newAssignedSigners(axiosPrivate, signersTab, id, annotation)
      .then((result) => {
        let response = result;
        if (response?.data?.status === 1) {
          swal({
            title: "Signers Assignement",
            text: `${response?.data?.message}. ${
              response?.data?.unknown_arr.length > 0
                ? `\n\nBut the operation did not completed for some unkown signers such as : ${response?.data?.unknown_arr} in the system. `
                : ""
            } ${
              response?.data?.exists_arr.length > 0
                ? `\n\nThe following signers provided such as : ${response?.data?.exists_arr}, are/is alreary assigned to this document.`
                : ""
            }`,
            icon: "success",
            button: "Ok",
          }).then((res) => {
            swal("The document link have been sent by E-mail to the signers.");
          });
          signersTab([]);
        }
      })
      .catch((error) => {
        if (!error?.response) {
          swal({
            title: "Oups!",
            text: "No server response!",
            icon: "warning",
            buttons: true,
          });
        } else {
          swal({
            title: "Signers Assignement : Operation failed!",
            text: error?.response?.data?.message,
            icon: "warning",
            buttons: true,
          });
        }
      });
  };

  // const docs = [
  //   // { uri: "https://www.africau.edu/images/default/sample.pdf" }, // Remote file
  //   // { uri: require("./ULaval_Assurance_Blockchain_JHamel_p2.pdf") }, // Local File
  //   { uri: `http://192.168.1.113:5500/${thumbnails}` }, // Local File
  // ];

  return (
    <>
      <div className="signings">
        <div className="head">
          <h2 className="title t-2">
            <Link to="/admin/documents" className="link">
              <BiArrowBack className="icon" />
            </Link>{" "}
            <span>{`${title}  (${signersTab.length} assigned.)`}</span>
          </h2>
          <div className="actions">
            <button className="btn edit-signers" onClick={() => setOpen(!open)}>
              Edit signers
            </button>
            {signersTab.length > 0 && (
              <button className="btn valide-signers" onClick={onSubmit}>
                Validate and Invite
              </button>
            )}
          </div>
        </div>
        <div className="body">
          <div className="webviewer" ref={viewer}>
            {/* <DocViewer
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
            /> */}
          </div>
        </div>
      </div>
      <Modal
        contentLabel="subscription"
        isOpen={open}
        shouldCloseOnOverlayClick={false}
        onRequestClose={() => setOpen(!open)}
        style={{
          overlay: { backgroundColor: "rgba(0,0,0,0.75)", zIndex: 5 },
          content: {
            color: "inherit",
            width: "60%",
            height: "60%",
            margin: "auto",
            padding: 0,
          },
        }}
      >
        <div className="width height modal">
          <div className="width modal-head display-flex justify-content-space-between align-items-center">
            <h3 className="title t-1">Schedule the signers</h3>
            <span className="modal_close" onClick={() => setOpen(!open)}>
              &times;
            </span>
          </div>
          <div className="width modal-body">
            <div className="first-signers">
              <p className="title t-3">
                Enter the name and e-mail address of all the signers that need
                to sign the document.
              </p>
              <form onSubmit={handleSubmit(onAdd)} className="block-1">
                <div className="input-div">
                  <input
                    type="text"
                    className="input-form"
                    autoComplete="none"
                    placeholder=" "
                    {...register("names")}
                  />
                  <label htmlFor="names" className="label-form">
                    Names
                  </label>
                  {errors.names && (
                    <span className="fade-in">{errors.names.message}</span>
                  )}
                </div>
                <div className="input-div">
                  <input
                    type="text"
                    className="input-form"
                    autoComplete="none"
                    placeholder=" "
                    {...register("mail")}
                  />
                  <label htmlFor="mail" className="label-form">
                    E-mail address
                  </label>
                  {errors.mail && (
                    <span className="fade-in">{errors.mail.message}</span>
                  )}
                </div>
                <div className="input-div">
                  <select className="input-select" {...register("type")}>
                    <option value="">Position</option>
                    <option value="signer">Signer</option>
                    <option value="in-copy">In-Copy (CC:)</option>
                  </select>
                  {errors.type && (
                    <span className="fade-in">{errors.type.message}</span>
                  )}
                </div>
                <button type="submit" className="button normal">
                  <FaPlus className="icon" /> Add
                </button>
              </form>
              <div className="block-2">
                <table>
                  <thead>
                    <tr>
                      <th>Signers</th>
                      <th>Position</th>
                      <th>Sign Order</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isEmpty(signersTab) ? (
                      <tr>
                        <td
                          className="tbody-col-1"
                          colSpan="4"
                          style={{
                            textAlign: "center",
                            color: "lightslategray",
                            fontSize: "1em",
                          }}
                        >
                          No signer assigned yet.
                        </td>
                      </tr>
                    ) : (
                      signersTab.map((signerLoc, i) => {
                        return (
                          <tr key={i}>
                            <td className="tbody-col-1">
                              {` ${signerLoc.names} - ${signerLoc.mail}`}
                            </td>
                            <td className="tbody-col-2">{signerLoc.type}</td>
                            <td>
                              <div className="signers-order">
                                <input
                                  type="radio"
                                  id={`first${i}`}
                                  name={`sign_order${i}`}
                                  value="step1"
                                  onChange={(e) => onOrder(e.target.value, i)}
                                />
                                <label htmlFor={`first${i}`}>
                                  Signing Step 1
                                </label>
                                <input
                                  type="radio"
                                  id={`second${i}`}
                                  name={`sign_order${i}`}
                                  value="step2"
                                  onChange={(e) => onOrder(e.target.value, i)}
                                />
                                <label htmlFor={`second${i}`}>
                                  Signing Step 2
                                </label>
                                <input
                                  type="radio"
                                  id={`third${i}`}
                                  name={`sign_order${i}`}
                                  value="step3"
                                  onChange={(e) => onOrder(e.target.value, i)}
                                />
                                <label htmlFor={`third${i}`}>
                                  Signing Step 3
                                </label>
                              </div>
                            </td>
                            <td>
                              <button onClick={() => onRemove(i)}>
                                Remove
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
                <div className="btns-block">
                  <button
                    className="btn cancel"
                    onClick={() => setSignersTab([])}
                  >
                    Cancel inviting
                  </button>
                  {signersTab.length > 0 && (
                    <button
                      className="btn validate-next-step"
                      onClick={onValidate}
                    >
                      Validate & next step
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Signings;
