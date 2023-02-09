const express = require("express");
const upload = require("../customDependances/multer.js")
const RHRouter = express.Router();
const companyModel = require("../models/company");
const employeeModel = require("../models/employee");

const bcrypt = require("bcrypt");
const { log } = require("console");
const saltRounds = 10;






/********* bcrypt *********/
let cryptPassword = async function (password) {
  //permet de crypter une chaine de caractere
  let salt = await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(password, salt);
};

let comparePassword = async function (plainPass, hashword) {
  //permet de comparer une chaine de caractere en clair et une autre crypté
  let compare = bcrypt.compare(plainPass, hashword);
  return compare;
};





/********* User Connect *********/
RHRouter.get("/", (req, res) => {
  res.render("index.twig");
});


RHRouter.post("/login", async (req, res) => {
  console.log(req.body);
  let company = await companyModel.findOne({ mail: req.body.mail });
  console.log(company);
  if (company) {
    if (await comparePassword(req.body.password, company.password)) {
      req.session.companyId = company._id; /*CONDITION DE CONNEXION SESSION*/
      console.log("Successfully logged");
      res.redirect("/gestion"); /*CHANGER ICI*/
    }
  } else {
    console.log("Not logged");
    res.redirect("/");
  }
});




/*********  Create Company *********/
RHRouter.get("/addcompany", (req, res) => {
  res.render("./addcompany.twig");
});



RHRouter.post("/addcompany", async (req, res) => {
  console.log(req.body);
  try {
    console.log(req.body);
    req.body.password = await cryptPassword(req.body.password);
    let company = new companyModel(req.body);
    console.log(company);
    await company.save();
      req.session.companyId = company._id; /*CONDITION DE CONNEXION SESSION*/
    res.redirect("/gestion");
  } catch (error) {
    res.send(error);
    console.log(error);
  }
});




/********* Create employee *********/
RHRouter.get("/addemployee", (req, res) => {
  res.render("./addemployee.twig");
});


RHRouter.post("/addemployee", upload.single('photo'), async (req, res) => {
  console.log(req.body);
  try {
    req.body.photo = req.file.filename
    let employee = new employeeModel(req.body)
    employee.save()
    await companyModel.updateOne({_id: req.session.companyId}, {$push: {employee: employee._id}}) /*CONDITION DE CONNEXION SESSION + push dans le tableau objet ref*/
    res.redirect('/gestion')
  } catch (err) {
    console.log(err);
    res.send(err);
  }
})



/********* Employee Gestion MAIN *********/
RHRouter.get("/gestion", async (req, res) => {
  try { 
    let company = await companyModel.findOne({_id: req.session.companyId}).populate("employee"); /*CONDITION DE CONNEXION SESSION + tableau des employés selon la session de connexion de telle ou telle entreprise*/
    console.log(company, company.employee);
    let employees = company.employee
    console.log(employees);
    res.render('gestion.twig', {
      employees: employees /*clé de stockage*/
    })
    console.log("test");
  } catch (err) {
    res.send(err);
    console.log(err);
  }
});



/********* Employee UPDATE *********/
RHRouter.get('/UpdateEmployee/:id', async (req, res) => {
  try {
    res.render('updateemployee.twig', {
      update: req.params.id
    })
  } catch (err) {
    console.log(err);
    res.send(err);
  }
})

RHRouter.post('/UpdateEmployee/:id', upload.single('photo'), async (req, res) => {
  console.log(req.body);
  try {
    if (req.file) {
      req.body.photo = req.file.filename
    }
    await employeeModel.updateOne({ _id: req.params.id }, req.body)
    res.redirect('/gestion')
  } catch (err) {
    console.log(err);
    res.send(err);
  }
})


/********* Employee DELETE *********/
RHRouter.get('/deleteEmployee/:id', async (req, res) => {
  try {
    await employeeModel.deleteOne({ _id: req.params.id });
    res.redirect('/gestion')
  } catch (err) {
    console.log(err);
    res.send(err);
  }
})


/********* Employee BLAME INCREMENT *********/
RHRouter.get('/addBlame/:id', async (req, res) => {
  try {
    let employee = await employeeModel.findOne({ _id: req.params.id });
    employee.blame++
    if (employee.blame >= 3) {
      res.redirect(`/deleteEmployee/${req.params.id}`)
    } else {
      await employeeModel.updateOne({ _id: req.params.id }, employee)
      res.redirect('/gestion')
    }
   

  } catch (err) {
    console.log(err);
    res.send(err);
  }
})


module.exports = RHRouter;