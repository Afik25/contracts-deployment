import { Link, useParams } from "react-router-dom";
import {
  MdOutlineArrowBackIos,
  BiEnvelope,
  BiPhone,
} from "../../middlewares/icons";
import { useForm } from "react-hook-form";
//
const wait = function (duration = 1000) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, duration);
  });
};
//
const UsersDetails = () => {
  let { userId } = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <div className="width height user-details">
      <div className="width head display-flex justify-content-space-between align-items-center">
        <Link to="/user/users" className="link">
          <MdOutlineArrowBackIos className="icon" /> <span>Retour</span>
        </Link>
        <div className="actions">
          <button className="button">Mise à jour</button>
          <button className="button">Bloquer</button>
        </div>
      </div>
      <div className="width middle display-flex justify-content-space-between align-items-center">
        <div className="col-l-6 display-flex align-items-center">
          <img src={process.env.PUBLIC_URL + "/flag-fr.png"} className="img" />
          <div>
            <h3 className="title t-1">Afik FOUNDATION</h3>
            <p className="title t-2">Support Sales</p>
          </div>
        </div>
        <div>
          <h3 className="title t-2 display-flex align-items-center">
            <BiEnvelope className="icon" />
            <span>afik@afik.org</span>
          </h3>
          <h3 className="title t-2 display-flex align-items-center">
            <BiPhone className="icon" />
            <span>+243 81 61 94 942</span>
          </h3>
        </div>
      </div>
      <hr />
      <form>
        <div className="width body display-flex justify-content-space-between">
          <div className="left">
            <div className="title">
              <h3 className="t-1">Information Personnelle</h3>
            </div>
            <div className="width content">
              <div className="input-div">
                <input
                  type="text"
                  name="filter"
                  className="input-form"
                  autoComplete="none"
                  placeholder=" "
                  {...register("filter", {
                    required: "Tapez le mot clé à rechercher",
                  })}
                />
                <label htmlFor="filter" className="label-form">
                  Prénom
                </label>
                {errors.filter && (
                  <span className="fade-in">{errors.filter.message}</span>
                )}
              </div>
              <div className="input-div">
                <input
                  type="text"
                  name="filter"
                  className="input-form"
                  autoComplete="none"
                  placeholder=" "
                  {...register("filter", {
                    required: "Tapez le mot clé à rechercher",
                  })}
                />
                <label htmlFor="filter" className="label-form">
                  Nom
                </label>
                {errors.filter && (
                  <span className="fade-in">{errors.filter.message}</span>
                )}
              </div>
              <div className="input-div">
                <select className="input-form">
                  <option disabled>Genre</option>
                  <option>Femme</option>
                  <option>Homme</option>
                </select>
              </div>
              <div className="input-div">
                <input
                  type="text"
                  name="filter"
                  className="input-form"
                  autoComplete="none"
                  placeholder=" "
                  {...register("filter", {
                    required: "Tapez le mot clé à rechercher",
                  })}
                />
                <label htmlFor="filter" className="label-form">
                  Téléphone
                </label>
                {errors.filter && (
                  <span className="fade-in">{errors.filter.message}</span>
                )}
              </div>
              <div className="input-div">
                <input
                  type="text"
                  name="filter"
                  className="input-form"
                  autoComplete="none"
                  placeholder=" "
                  {...register("filter", {
                    required: "Tapez le mot clé à rechercher",
                  })}
                />
                <label htmlFor="filter" className="label-form">
                  Adresse mail
                </label>
                {errors.filter && (
                  <span className="fade-in">{errors.filter.message}</span>
                )}
              </div>
              <div className="input-div">
                <select className="input-form">
                  <option disabled>Rôle</option>
                  <option>Administrator</option>
                  <option>Support Sales</option>
                </select>
              </div>
            </div>
          </div>
          <div className="right">
            <div className="title">
              <h3 className="t-1">Rôles (Droits)</h3>
            </div>
            <div className="width content table">
              <table>
                <thead>
                  <tr>
                    <th>Module</th>
                    <th>Lire</th>
                    <th>Ecrire</th>
                    <th>Modifier</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <span>Gestion de Stocks</span>
                    </td>
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td>
                      <input type="checkbox" />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span>Gestion des Utilisateurs</span>
                    </td>
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td>
                      <input type="checkbox" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-l-6 col-s-11 m-auto">
          <button className="width button normal">
            Valider les modifications
          </button>
        </div>
      </form>
    </div>
  );
};
export default UsersDetails;
