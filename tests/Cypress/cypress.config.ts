import { defineConfig } from 'cypress'

const connectToDatabase = () => {
  const mysql = require('mysql');
  const con = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "root",
      database: "viikkobiitsi"
  });

  return con;
}

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',

    setupNodeEvents(on, config) {
      on('task', {
        'db:seed': () => {
          
          const con = connectToDatabase();  
          con.connect( err => {
              if (err) throw err;
              var sql = "DELETE FROM wpzl_postmeta";
              con.query(sql, (err, result) => {
                if (err) throw err;
              });
          });
          return null
        },
        'db:seedScores': () => {
          
          const con = connectToDatabase();  
          con.connect( err => {
              const deleteQuery = "DELETE FROM wpzl_postmeta";
              con.query(deleteQuery, (err, result) => {});

              const insertQuery = `INSERT INTO wpzl_postmeta VALUES 
              (1, 1, '_field_38', 'Naiset'),
              (2,1, '_field_39', '1'),
              (3,1, '_field_40', 'Player 1'),
              (4,1, '_field_58', '1'),
              (5,1, '_field_42', 'Player 2'),
              (6,1, '_field_59', '2'),
              (7,1, '_field_44', 'Player 3'),
              (8,1, '_field_60', '-1'),
              (9,1, '_field_46', 'Player 4'),
              (10,1, '_field_61', '-2'),
              (11,1, '_form_id', '5'),
              (12,1, '_seq_num', '12222'),
              (13, 2, '_field_38', 'Miehet'),
              (14,2, '_field_39', '1'),
              (15,2, '_field_40', 'Player 5'),
              (16,2, '_field_58', '1'),
              (17,2, '_field_42', 'Player 6'),
              (18,2, '_field_59', '2'),
              (19,2, '_field_44', 'Player 7'),
              (20,2, '_field_60', '-1'),
              (21,2, '_field_46', 'Player 8'),
              (22,2, '_field_61', '-2'),
              (23,2, '_form_id', '5'),
              (24,2, '_seq_num', '12233');`;

              con.query(insertQuery, (err, result) => {})
          });
          return null
        },
      })
    },
  },
});
