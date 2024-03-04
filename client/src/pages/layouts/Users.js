import { useState } from "react";
import {
  FaPlus,
  FaLock,
  FaEye,
  IoSearch,
  MdOutlineArrowBackIos,
  MdOutlineArrowForwardIos,
} from "../../middlewares/icons";
import { useForm } from "react-hook-form";
import Modal from "react-modal";
import { Link } from "react-router-dom";
import swal from "sweetalert";

const Users = () => {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <div className="width height user-layout fade-in">
      <div className="width head display-flex justify-content-space-between align-items-center">
        <div>
          <h3 className="title t-1">Utilisateurs</h3>
          <p className="title t-3">25 utilisateurs</p>
        </div>
        <button
          className="button display-flex justify-content-center align-items-center"
          onClick={() => setOpen(!open)}
        >
          <FaPlus className="icon" />
          <span>Nouvel</span>
        </button>
      </div>
      <div className="width filter display-flex align-items-center">
        <form className="input-div">
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
            Recherche
          </label>
          <label htmlFor="filter" className="label-icon">
            <IoSearch />
          </label>
          {errors.filter && (
            <span className="fade-in">{errors.filter.message}</span>
          )}
        </form>
      </div>
      <div className="width table">
        <table className="width">
          <thead>
            <tr>
              <th>N°</th>
              <th>Noms</th>
              <th>Role</th>
              <th>Téléphone</th>
              <th>E-mail</th>
              <th>Statut</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>01</td>
              <td>
                <div className="names display-flex justify-content-flex-start align-items-center">
                  <span>AF</span>
                  <div>
                    <h3>Amisi FIKIRINI</h3>
                    <p>#12345</p>
                  </div>
                </div>
              </td>
              <td>
                <span className="role">user</span>
              </td>
              <td>
                <span>+243 81 61 94 942</span>
              </td>
              <td>
                <span className="role">afik@afik.org</span>
              </td>
              <td>
                <span className="status success">actif</span>
              </td>
              <td>
                <div className="action display-flex justify-content-flex-start align-items-center">
                  <button
                    className="button"
                    onClick={() => {
                      swal({
                        title:
                          "Voulez-vous vraiment bloquer le compte de AFIK ?",
                        text: "Une fois son compte bloqué, AFIK n'aurait plus aucun accès à la plateforme.",
                        icon: "warning",
                        buttons: true,
                        dangerMode: true,
                      }).then((willDelete) => {
                        if (willDelete) {
                          swal("AFIK a bien été bloqué!", {
                            icon: "success",
                          });
                        } else {
                          swal("Le processus de blocage n'a pas abouti!");
                        }
                      });
                    }}
                  >
                    <FaLock /> <span>Bloquer</span>
                  </button>
                  <Link to="/user/user-details/5" className="button">
                    <FaEye /> <span>Détails</span>
                  </Link>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="width pagination display-flex justify-content-space-between align-items-center">
        <span>1-5 sur 45</span>
        <div className="display-flex align-items-center">
          <div className="display-flex align-items-center">
            <span>Lignes par page :</span>
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
      <Modal
        contentLabel="Nouvel Utilisateur"
        isOpen={open}
        shouldCloseOnOverlayClick={false}
        onRequestClose={() => setOpen(!open)}
        style={{
          overlay: { backgroundColor: "rgba(0,0,0,0.75)", zIndex: 5 },
          content: {
            color: "inherit",
            width: "50%",
            height: "auto",
            margin: "auto",
            padding: 0,
          },
        }}
      >
        <div className="width height modal">
          <div className="width modal_head display-flex justify-content-space-between align-items-center">
            <h3 className="title t-1">Nouvel Utilisateur</h3>
            <span className="modal_close" onClick={() => setOpen(!open)}>
              &times;
            </span>
          </div>
          <div className="width modal_body">
            <form>
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
              <div className="col-l-6 col-s-11 m-auto">
                <button className="width button normal">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default Users;
