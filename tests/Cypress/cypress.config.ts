import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {
        'db:seed': () => {
          var mysql = require('mysql');
          var con = mysql.createConnection({
              host: "localhost",
              user: "root",
              password: "root",
              database: "viikkobiitsi"
          });
            
          con.connect( err => {
              if (err) throw err;
              var sql = "DELETE FROM wpzl_postmeta";
              con.query(sql, (err, result) => {
                if (err) throw err;
              });
          });
          return null
        },
      })
    },
  },
});
