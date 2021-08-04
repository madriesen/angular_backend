const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;

db.users = require("./user.model.js")(mongoose);
db.groups = require("./group.model.js")(mongoose);
db.roles = require("./role.model.js")(mongoose);
db.posts = require("./post.model.js")(mongoose);
db.companies = require("./company.model.js")(mongoose);

db.seed = () => {
    db.roles.find().then(data => {
        if( data.length > 0) return
        const superadmin = new  db.roles({
            Name: 'Superadmin'
        })

        const beheerder = new  db.roles({
            Name: 'Beheerder'
        })

        const werknemer = new  db.roles({
            Name: 'Werknemer'
        })

        const groepsbeheerder = new  db.roles({
            Name: 'Groepsbeheerder'
        })

        const groepslid = new  db.roles({
            Name: 'Groepslid'
        })

        const gebruiker = new db.roles({
            Name: 'Gebruiker'
        })

        superadmin.save()
        beheerder.save()
        werknemer.save()
        groepsbeheerder.save()
        groepslid.save() 
        gebruiker.save()
    })
}

module.exports = db;