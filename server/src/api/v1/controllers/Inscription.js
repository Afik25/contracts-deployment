const Inscription = require("../models/Inscription");
const User = require("../models/User");
const Contract = require("../models/Contract");
const Document = require("../models/Document");
//
const { generateOTP } = require("../../../utils/utils");
const bcrypt = require("bcrypt");
const moment = require("moment");
const { v4: uuid } = require("uuid");

module.exports = {
  async create(req, res) {
    try {
      const { prename, name, username, password, sys_role } = req.body;
      //
      const checkUsername = await User.findOne({
        where: { username: username },
      });
      if (checkUsername) {
        return res.status(400).json({
          status: 0,
          message: "The username is already used!",
        });
      }

      const user = await User.create({
        role_id: 2,
        prename,
        name,
        username,
        password,
        is_completed: false,
        sys_role,
      });

      if (user) {
        return res.status(200).json({
          status: 1,
          message: `Registration for ${
            prename.toUpperCase() + " " + name.toUpperCase()
          } done.`,
          user,
        });
      }

      return res.status(400).json({
        status: 0,
        message: `Registration for ${
          prename.toUpperCase() + " " + name.toUpperCase()
        } failed.`,
      });
    } catch (error) {
      console.log({ "catch error create inscription(registration) ": error });
    }
  },
  async complete(req, res) {
    try {
      const {
        dates,
        location,
        latitude,
        longitude,
        device,
        ip_address,
        operating_system,
        navigator,
      } = req.body;
      const {
        id,
        prename,
        name,
        gender,
        telephone,
        mail,
        birth,
        birth_location,
        username,
        old_password,
        new_password,
      } = req.body;

      const user = await User.findOne({
        where: {
          id: id,
        },
      });

      const check_username = await User.findOne({
        where: { username: username },
      });
      if (check_username) {
        return res.status(400).json({
          status: 0,
          message: "The username is already used!",
        });
      }

      if (!bcrypt.compareSync(old_password, user.password)) {
        return res.status(400).json({
          status: 0,
          message: "The old password is wrong.",
        });
      }

      const usern =
        username == null || username == "" ? user.username : username;

      await User.update(
        {
          prename,
          name,
          gender,
          telephone,
          mail,
          birth,
          birth_location,
          username: usern,
          password: new_password,
          status: 1,
        },
        { where: { id: id }, individualHooks: true }
      );

      const code = generateOTP(6);
      const inscription = await Inscription.create({
        user_id: id,
        dates,
        code,
        location,
        latitude,
        longitude,
        device,
        ip_address,
        operating_system,
        navigator,
      });

      if (inscription) {
        return res.status(200).json({
          status: 1,
          message: `The completion process step 1 done.`,
          code,
        });
      }

      return res.status(400).json({
        status: 0,
        message: "Completion process failed.",
      });
    } catch (error) {
      console.log({ "catch error completion process ": error });
    }
  },
  async activateCompletion(req, res) {
    try {
      const { id, dates, confirmation_code, is_completed } = req.body;

      const findInscription = await Inscription.findOne({
        where: { code: confirmation_code },
      });
      const inscrDates = findInscription.dates;
      const inscrStatus = findInscription.status;

      if (inscrStatus == 1) {
        return res.status(400).json({
          status: 0,
          message: "The confirmation code is not reconized!",
        });
      }

      var d1 = moment(dates);
      var d2 = moment(inscrDates);
      var duration = moment.duration(d1.diff(d2));
      var minutes = duration.asMinutes();

      if (minutes > 10) {
        return res.status(400).json({
          status: 0,
          message: "The confirmation code is experired!",
        });
      }

      const user = await User.update({ is_completed }, { where: { id: id } });

      if (user) {
        const inscrip = await Inscription.update(
          { status: 1 },
          { where: { id: findInscription.id } }
        );

        if (inscrip) {
          return res.status(200).json({
            status: 1,
            message: "Account confirmed and activated successfully.",
            user,
          });
        }
      }

      return res.status(400).json({
        status: 0,
        message: "Account confirmation failed.",
      });
    } catch (error) {
      console.log({ "catch error confirmation account ": error });
    }
  },
  async rootConfigure(req, res) {
    try {
      const check_username = await User.findOne({
        where: { username: "admin" },
      });
      if (check_username) {
        return res.status(400).json({
          status: 0,
          message: "The initial configuration process is already done!",
        });
      }
      //
      const user = await User.create({
        prename: "admin",
        name: "admin",
        username: "admin",
        password: "admin",
        is_completed: false,
        sys_role: "admin",
      });

      if (user) {
        return res.status(200).json({
          status: 1,
          message: `Initial configuration process successfully.`,
          user,
        });
      }

      return res.status(400).json({
        status: 0,
        message: `Initial configuration process failed.`,
      });
    } catch (error) {
      console.log({ "catch error on initial configuration process ": error });
    }
  },
  async dashboard(req, res) {
    try {
      const users = await User.findAll();
      const contracts = await Contract.findAll();
      const documents = await Document.findAll();
      const employees = users.filter((item) => item.sys_role != "student");
      //
      const students = users.filter((item) => item.sys_role == "student");
      const count_student_male = students.filter(
        (item) => item.gender == "Male"
      );
      const count_student_female = students.filter(
        (item) => item.gender == "Female"
      );
      //
      const total_employees = employees.length;
      //
      const total_students = students.length;
      const total_student_male = count_student_male.length;
      const total_student_female = count_student_female.length;
      const male_percent = (total_student_male / total_employees) * 100;
      const female_percent = (total_student_female / total_employees) * 100;
      //
      const last_students = students.map(
        (item, index) => students[students.length - 1 - index]
      );
      const last_employees = employees.map(
        (item, index) => employees[employees.length - 1 - index]
      );
      //
      const employees_contracts = contracts.filter((item) => item.type == "EM");
      const students_contracts = contracts.filter((item) => item.type == "ST");
      const last_employees_contracts = employees_contracts.map(
        (item, index) =>
          employees_contracts[employees_contracts.length - 1 - index]
      );
      const last_students_contracts = students_contracts.map(
        (item, index) =>
          students_contracts[students_contracts.length - 1 - index]
      );
      //
      //
      let admin_categories = [];
      let admin_enterprise_employees = [];
      let admin_enterprise_students = [];
      for (let i = 0; i < employees_contracts.length; i++) {
        const filter_by_month = documents.filter(
          (item) =>
            moment(item.createdAt).format("M") ==
            moment(employees_contracts[i].createdAt).format("M")
        );

        const check_in_admin_categories = admin_categories.filter(
          (item) =>
            item == moment(employees_contracts[i].createdAt).format("MMM")
        );

        if (check_in_admin_categories.length == 0) {
          admin_categories.push(
            moment(last_employees_contracts[i].createdAt).format("MMM")
          );
        }
      }
      //
      const result = {
        admin: {
          total_employees: total_employees,
          last_employees: last_employees,
          total_contracts_enterprise: last_employees_contracts.length,
          last_employees_contracts: last_employees_contracts,
        },
        user: {
          total_students: total_students,
          total_student_male: total_student_male,
          total_student_female,
          male_percent,
          female_percent,
          last_students: last_students,
          total_students_contracts: last_students_contracts.length,
          last_students_contracts: last_students_contracts,
        },
      };
      return res.status(200).json({
        status: 1,
        message: `Initial configuration process successfully.`,
        result,
      });
    } catch (error) {
      console.log({ "Error on dashboard process ": error });
    }
  },
};
