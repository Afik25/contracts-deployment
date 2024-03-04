import React, { useState, useEffect } from "react";
import {
  BsCapsule,
  LuPlane,
  BsPinAngle,
  RiAttachment2,
  FaPlus,
  MdOutlineMoreVert,
} from "../../middlewares/icons";
import Modal from "react-modal";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import useAxiosPrivate from "../../state/context/hooks/useAxiosPrivate";
import { isEmpty, wait, validationSchemaUser } from "../../utils/utils";
import { onCreateUser, getUsers } from "../../services/users";

const Personnel = () => {
  const [open, setOpen] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const [isMore, setIsMore] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [classNameMsg, setClassNameMsg] = useState(
    "width msg-box display-flex justify-content-center align-items-center"
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onTouched",
    resolver: yupResolver(validationSchemaUser),
  });

  const dispatch = useDispatch();
  const users = useSelector((state) => state.setInitConf.initUsers.usersData);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const signal = controller.signal;

    getUsers(axiosPrivate, signal).then((result) => {
      dispatch({
        type: "setUp/getUsers",
        payload: result,
      });
    });

    return () => {
      isMounted = false;
      isMounted && controller.abort();
    };
  }, []);

  const onSubmit = async (data) => {
    setIsSending(true);
    await wait(1000);
    let isMounted = true;
    const controller = new AbortController();
    const signal = controller.signal;
    //
    onCreateUser(axiosPrivate, data)
      .then((result) => {
        if (result?.data?.status === 1) {
          setIsSending(false);
          setResponseMessage(result?.data?.message);
          setClassNameMsg(
            "width msg-box onSuccess fade-in display-flex justify-content-center align-items-center"
          );
        }
        //
        getUsers(axiosPrivate, signal).then((result) => {
          dispatch({
            type: "setUp/getUsers",
            payload: result,
          });
        });
        //
        const timer = setTimeout(() => {
          reset();
          setClassNameMsg(
            "width msg-box display-flex justify-content-center align-items-center"
          );
          setResponseMessage("");
        }, 3000);
        return () => clearTimeout(timer);
      })
      .catch((error) => {
        setIsSending(false);
        setClassNameMsg(
          "width msg-box onFailed fade-in display-flex justify-content-center align-items-center"
        );
        if (!error?.response) {
          setResponseMessage("No server response");
        } else {
          setResponseMessage(error?.response?.data?.message);
        }
        const timer = setTimeout(() => {
          setClassNameMsg(
            "width msg-box display-flex justify-content-center align-items-center"
          );
          setResponseMessage("");
        }, 5000);
        return () => {
          clearTimeout(timer);
          isMounted = false;
          isMounted && controller.abort();
        };
      });
  };

  return (
    <div className="personnel">
      <div className="head">
        <div className="left">
          <h2 className="title t-1">Peoples</h2>
          <p className="title t-3">Personnel management.</p>
        </div>
        {/* <div className="center">
          <div>
            <h3 className="title t-2">Sick</h3>
            <p className="title">
              <BsCapsule className="icon" />
              <span className="t-3">4</span>
            </p>
          </div>
          <div>
            <h3 className="title t-2">Vacation</h3>
            <p className="title">
              <LuPlane className="icon" />
              <span className="t-3">4</span>
            </p>
          </div>
          <div>
            <h3 className="title t-2">Day off</h3>
            <p className="title">
              <BsPinAngle className="icon" />
              <span className="t-3">4</span>
            </p>
          </div>
          <div>
            <h3 className="title t-2">At office</h3>
            <p className="title">
              <RiAttachment2 className="icon" />
              <span className="t-3">4</span>
            </p>
          </div>
        </div> */}
        <div className="right">
          <button
            type="button"
            className="button"
            onClick={() => setOpen(!open)}
          >
            <FaPlus />
            &nbsp; New Personnel
          </button>
        </div>
      </div>
      <div className="body">
        <div className="filter">
          <div className="input-div">
            <input
              type="text"
              className="input-form"
              autoComplete="none"
              placeholder=" "
              // {...register("prename")}
            />
            <label htmlFor="prename" className="label-form">
              Research peoples by names...
            </label>
            {/* {errors.prename && (
              <span className="fade-in">{errors.prename.message}</span>
            )} */}
          </div>
          <div className="input-div">
            <select className="input-select" {...register("position")}>
              <option value="">Research peoples by position...</option>
              <option value="admin">Administrator</option>
              <option value="user">Faculty Member</option>
            </select>
          </div>
        </div>
        <div className="container">
          {isEmpty(users?.data?.users) ? (
            <p className="title t-3">{users?.data?.message}</p>
          ) : (
            users?.data?.users.map((item, i) => {
              if (item.sys_role != "student") {
                return (
                  <div className="item" key={i}>
                    <div className="up">
                      <RiAttachment2 className="icon" />
                      <MdOutlineMoreVert
                        className="icon more"
                        onClick={() => setIsMore(!isMore)}
                      />
                    </div>
                    {isMore && (
                      <div className="more-options fade-in">
                        <p className="title t-3">Information's action</p>
                        <button className="btn">View</button>
                        <button className="btn">Edit</button>
                      </div>
                    )}
                    <div className="content">
                      <img
                        src={process.env.PUBLIC_URL + "/user.png"}
                        className="image"
                      />
                      <h2 className="title t-1">
                        {item.prename + " " + item.name}
                      </h2>
                      <p className="title t-2">System's role : {item.sys_role}</p>
                      <p className="title t-3">{item.telephone}</p>
                      <p className="title t-4">{item.mail}</p>
                    </div>
                  </div>
                );
              }
            })
          )}
        </div>
      </div>
      <Modal
        contentLabel="Personnel"
        isOpen={open}
        shouldCloseOnOverlayClick={false}
        onRequestClose={() => setOpen(!open)}
        style={{
          overlay: { backgroundColor: "rgba(0,0,0,0.75)", zIndex: 5 },
          content: {
            color: "inherit",
            width: "50%",
            // height: "70%",
            margin: "auto",
            padding: 0,
          },
        }}
      >
        <div className="width height modal">
          <div className="width modal-head display-flex justify-content-space-between align-items-center">
            <h3 className="title t-1">New Personal</h3>
            <span className="modal_close" onClick={() => setOpen(!open)}>
              &times;
            </span>
          </div>
          <div className="width modal-body">
            <form onSubmit={handleSubmit(onSubmit)}>
              {responseMessage && (
                <div className={classNameMsg}>{responseMessage}</div>
              )}
              <div className="input-div">
                <select className="input-select" {...register("sys_role")}>
                  <option value="">System's role</option>
                  <option value="admin">Administrator</option>
                  <option value="user">Faculty Member</option>
                  <option value="student">Student</option>
                </select>
                {errors.sys_role && (
                  <span className="fade-in">{errors.sys_role.message}</span>
                )}
              </div>
              <div className="input-div">
                <input
                  type="text"
                  className="input-form"
                  autoComplete="none"
                  placeholder=" "
                  {...register("prename")}
                />
                <label htmlFor="prename" className="label-form">
                  Personnel's firstname
                </label>
                {errors.prename && (
                  <span className="fade-in">{errors.prename.message}</span>
                )}
              </div>
              <div className="input-div">
                <input
                  type="text"
                  className="input-form"
                  autoComplete="none"
                  placeholder=" "
                  {...register("name")}
                />
                <label htmlFor="name" className="label-form">
                  Personnel's lastname
                </label>
                {errors.name && (
                  <span className="fade-in">{errors.name.message}</span>
                )}
              </div>
              <div className="input-div">
                <select className="input-select" {...register("gender")}>
                  <option value="">Gender</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                </select>
                {errors.gender && (
                  <span className="fade-in">{errors.gender.message}</span>
                )}
              </div>
              <div className="input-div">
                <input
                  type="text"
                  className="input-form"
                  autoComplete="none"
                  placeholder=" "
                  {...register("telephone")}
                />
                <label htmlFor="telephone" className="label-form">
                  Personnel's telephone
                </label>
                {errors.telephone && (
                  <span className="fade-in">{errors.telephone.message}</span>
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
                  Personnel's mail
                </label>
                {errors.mail && (
                  <span className="fade-in">{errors.mail.message}</span>
                )}
              </div>
              <div className="input-div">
                <input
                  type="date"
                  className="input-form"
                  autoComplete="none"
                  placeholder=" "
                  {...register("birth")}
                />
                <label htmlFor="birth" className="label-form">
                  Personnel's Date of Birth
                </label>
                {errors.birth && (
                  <span className="fade-in">{errors.birth.message}</span>
                )}
              </div>
              <div className="input-div">
                <input
                  type="text"
                  className="input-form"
                  autoComplete="none"
                  placeholder=" "
                  {...register("birth_location")}
                />
                <label htmlFor="birth_location" className="label-form">
                  Personnel's Location of Birth
                </label>
                {errors.birth_location && (
                  <span className="fade-in">
                    {errors.birth_location.message}
                  </span>
                )}
              </div>
              <button
                type="submit"
                className={isSending ? "width button" : "width button normal"}
              >
                {isSending ? "Saving..." : "Save"}
              </button>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Personnel;
