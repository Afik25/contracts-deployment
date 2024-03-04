import React, { useState } from "react";
import { BsEyeSlash, BsEye } from "../../middlewares/icons";
import swal from "sweetalert";
import moment from "moment";
import { useSelector } from "react-redux";
import { isEmpty } from "../../utils/utils";

const Setting = () => {
  const [showPwd, setShowPwd] = useState(false);
  const connectedUser = useSelector(
    (state) => state.setInitConf.initConnectedUser.connectedUserData
  );

  return (
    <div className="settings">
      <div className="container">
        <div className="profile">
          <h2 className="title t-1">Profile</h2>
          <hr />
          <div className="item">
            <div>
              <img src={process.env.PUBLIC_URL + "/user.png"} alt="fr-flag" />
              <h3 className="title t-2">
                {connectedUser?.userInfo?.prename +
                  " " +
                  connectedUser?.userInfo?.name}
              </h3>
            </div>
            <button className="button">Edit profile</button>
          </div>
          <hr />
          <div className="item">
            <h3 className="title t-2">Email address</h3>
            <p className="title t-3">{connectedUser?.userInfo?.mail}</p>
          </div>
          <div className="item">
            <h3 className="title t-2">Phone number</h3>
            <p className="title t-3">{connectedUser?.userInfo?.telephone}</p>
          </div>
          <div className="item">
            <h3 className="title t-2">Account type</h3>
            <p className="title t-3">{connectedUser?.userInfo?.sys_role}</p>
          </div>
          <div className="item">
            <h3 className="title t-2">Date of Birth</h3>
            <p className="title t-3">{`${moment(
              connectedUser?.userInfo?.birth
            ).format("ll")}`}</p>
          </div>
          <div className="item">
            <h3 className="title t-2">Place of Birth</h3>
            <p className="title t-3">
              {isEmpty(connectedUser?.userInfo?.birth_location)
                ? "---"
                : connectedUser?.userInfo?.birth_location}
            </p>
          </div>
        </div>
        <div className="security">
          <h2 className="title t-1">Security</h2>
          <p className="title t-2">Last change 29 December, 2023 at 6:20 PM</p>
          <div className="item">
            <button
              className="button"
              onClick={() =>
                swal({
                  icon: "warning",
                  title: "Confirmation",
                  text: "Do you really want reset your password ?",
                })
              }
            >
              Reset password
            </button>
            <p className="title t-3">
              Once clicked on the reset button, a new password will be sent by
              e-mail address.
            </p>
          </div>
          <p className="title t-2">Change password</p>
          <form>
            <div className="input-div">
              <input
                type={showPwd ? "text" : "password"}
                className="input-form"
                autoComplete="none"
                placeholder=" "
                // {...register("password")}
              />
              <label htmlFor="password" className="label-form">
                Old password
              </label>
              <label htmlFor="password" className="label-icon">
                {showPwd ? (
                  <BsEye
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowPwd(!showPwd)}
                  />
                ) : (
                  <BsEyeSlash
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowPwd(!showPwd)}
                  />
                )}
              </label>
              {/* {errors.password && (
                <span className="fade-in">{errors.password.message}</span>
              )} */}
            </div>
            <div className="input-div">
              <input
                type={showPwd ? "text" : "password"}
                className="input-form"
                autoComplete="none"
                placeholder=" "
                // {...register("password")}
              />
              <label htmlFor="password" className="label-form">
                New password
              </label>
              <label htmlFor="password" className="label-icon">
                {showPwd ? (
                  <BsEye
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowPwd(!showPwd)}
                  />
                ) : (
                  <BsEyeSlash
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowPwd(!showPwd)}
                  />
                )}
              </label>
              {/* {errors.password && (
                <span className="fade-in">{errors.password.message}</span>
              )} */}
            </div>
            <div className="input-div">
              <input
                type={showPwd ? "text" : "password"}
                className="input-form"
                autoComplete="none"
                placeholder=" "
                // {...register("password")}
              />
              <label htmlFor="password" className="label-form">
                Confirm new password
              </label>
              <label htmlFor="password" className="label-icon">
                {showPwd ? (
                  <BsEye
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowPwd(!showPwd)}
                  />
                ) : (
                  <BsEyeSlash
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowPwd(!showPwd)}
                  />
                )}
              </label>
              {/* {errors.password && (
                <span className="fade-in">{errors.password.message}</span>
              )} */}
            </div>
            <button type="submit" className="button">
              Change
            </button>
          </form>
          <hr />
          <p className="title t-2">Account</p>
          <div className="item">
            <button className="button" style={{ backgroundColor: "red" }}>
              Delete account
            </button>
            <p className="title t-3">
              Once clicked on the delete account button, your account will not
              longer exists. You will need another inscription for using the
              application.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;
