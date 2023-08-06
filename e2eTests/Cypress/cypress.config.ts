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
        'db:seedLogs': () => {
          const con = connectToDatabase();  
          con.connect( err => {
              const deleteQuery = "DELETE FROM lokitiedot";
              con.query(deleteQuery, (err, result) => {});

              const insertQuery = `INSERT INTO lokitiedot VALUES
              (1, '2023-07-11', 'Uusi pelaaja: Player 2 '),
              (2, '2023-07-11', 'Uusi pelaaja: Player 1 '),
              (3, '2023-07-11', 'Uusi pelaaja: Player 3 '),
              (4, '2023-07-11', 'Uusi pelaaja: Player 4 '),
              (5, '2023-07-11', 'Uusi pelaaja: Player 6 '),
              (6, '2023-07-11', 'Uusi pelaaja: Player 5 '),
              (7, '2023-07-11', 'Uusi pelaaja: Player 7 '),
              (8, '2023-07-11', 'Uusi pelaaja: Player 8 ');`;

              con.query(insertQuery, (err, result) => {})
          });
          return null

        },
        'db:seedOldScores': () => {
          const con = connectToDatabase();  
          con.connect( err => {
              const deleteQuery = "DELETE FROM viikon_tulokset";
              con.query(deleteQuery, (err, result) => {});

              const insertQuery = `INSERT INTO viikon_tulokset VALUES
              (5334, 'Player 2', 'Naiset', 12, 1, 1, 1, 12, 2022),
              (5335, 'Player 1', 'Naiset', 31, 1, 2, 1, 19.15, 2022),
              (5336, 'Player 3', 'Naiset', 31, 1, 3, -1, 18.05, 2022),
              (5337, 'Player 4', 'Naiset', 31, 1, 4, -2, 17, 2022),
              (5338, 'Player 6', 'Miehet', 31, 1, 1, 2, 20.2, 2022),
              (5339, 'Player 5', 'Miehet', 31, 1, 2, 1, 19.15, 2022),
              (5340, 'Player 7', 'Miehet', 31, 1, 3, -1, 18.05, 2022),
              (5341, 'Player 8', 'Miehet', 31, 1, 4, -20, 16.1, 2022),
              (5342, 'Player 2', 'Naiset', 32, 1, 1, 2, 20.2, 2022),
              (5343, 'Player 1', 'Naiset', 32, 1, 2, 1, 19.15, 2022),
              (5344, 'Player 3', 'Naiset', 32, 1, 3, -1, 18.05, 2022),
              (5345, 'Player 4', 'Naiset', 32, 1, 4, -2, 17, 2022),
              (5346, 'Player 6', 'Miehet', 32, 1, 1, 2, 20.2, 2022),
              (5347, 'Player 5', 'Miehet', 32, 1, 2, 1, 19.15, 2022),
              (5348, 'Player 7', 'Miehet', 32, 1, 3, -1, 18.05, 2022),
              (5349, 'Player 8', 'Miehet', 32, 1, 4, -2, 17, 2022),
              (5350, 'Player 2', 'Naiset', 33, 1, 1, 2, 20.2, 2022),
              (5351, 'Player 1', 'Naiset', 33, 1, 2, 1, 19.15, 2022),
              (5352, 'Player 3', 'Naiset', 33, 1, 3, -1, 18.05, 2022),
              (5353, 'Player 4', 'Naiset', 33, 1, 4, -2, 17, 2022),
              (5354, 'Player 6', 'Miehet', 33, 1, 1, 2, 20.2, 2022),
              (5355, 'Player 5', 'Miehet', 33, 1, 2, 1, 19.15, 2022),
              (5356, 'Player 7', 'Miehet', 33, 1, 3, -1, 18.05, 2022),
              (5357, 'Player 8', 'Miehet', 33, 1, 4, -2, 17, 2022),
              (5358, 'Player 2', 'Naiset', 34, 1, 1, 2, 20.2, 2022),
              (5359, 'Player 1', 'Naiset', 34, 1, 2, 1, 19.15, 2022),
              (5360, 'Player 3', 'Naiset', 34, 1, 3, -1, 18.05, 2022),
              (5361, 'Player 4', 'Naiset', 34, 1, 4, -2, 17, 2022),
              (5362, 'Player 6', 'Miehet', 34, 1, 1, 2, 20.2, 2022),
              (5363, 'Player 5', 'Miehet', 34, 1, 2, 1, 19.15, 2022),
              (5364, 'Player 7', 'Miehet', 34, 1, 3, -1, 18.05, 2022),
              (5365, 'Player 8', 'Miehet', 34, 1, 4, -2, 17, 2022),
              (5366, 'Player 2', 'Naiset', 35, 1, 1, 2, 20.2, 2022),
              (5367, 'Player 1', 'Naiset', 35, 1, 2, 1, 19.15, 2022),
              (5368, 'Player 3', 'Naiset', 35, 1, 3, -1, 18.05, 2022),
              (5369, 'Player 4', 'Naiset', 35, 1, 4, -2, 17, 2022),
              (5370, 'Player 6', 'Miehet', 35, 1, 1, 2, 20.2, 2022),
              (5371, 'Player 5', 'Miehet', 35, 1, 2, 1, 19.15, 2022),
              (5372, 'Player 7', 'Miehet', 35, 1, 3, -1, 18.05, 2022),
              (5373, 'Player 8', 'Miehet', 35, 1, 4, -2, 17, 2022),
              (5374, 'Player 2', 'Naiset', 32, 1, 1, 2, 20.2, 2023),
              (5375, 'Player 1', 'Naiset', 32, 1, 2, 1, 19.15, 2023),
              (5376, 'Player 3', 'Naiset', 32, 1, 3, -1, 18.05, 2023),
              (5377, 'Player 4', 'Naiset', 32, 1, 4, -2, 17, 2023),
              (5378, 'Player 6', 'Miehet', 32, 1, 1, 2, 20.2, 2023),
              (5379, 'Player 5', 'Miehet', 32, 1, 2, 1, 19.15, 2023),
              (5380, 'Player 7', 'Miehet', 32, 1, 3, -1, 18.05, 2023),
              (5381, 'Player 8', 'Miehet', 32, 1, 4, -2, 17, 2023);`;

              con.query(insertQuery, (err, result) => {})
          });
          return null
        },
        'db:seedLogIn': () => {
          const con = connectToDatabase();
          con.connect(errr => {
            const deleteQuery = "DELETE FROM viikko_biitsi_hallinta";
            con.query(deleteQuery, (err, result) => {});

            const insertQuery = `INSERT INTO viikko_biitsi_hallinta VALUES 
            (DEFAULT, 'laskettavat_kerrat_pisteisiin', '2'),
            (DEFAULT, 'viikkobiitsi', '4c94485e0c21ae6c41ce1dfe7b6bfaceea5ab68e40a2476f50208e526f506080');`;
            con.query(insertQuery, (err, result) => {})           

          })
          return null        
        },
        'db:moveOldScoresOneYearBack': () => {
          const con = connectToDatabase();
          con.connect(errr => {
            const year = new Date().getFullYear();
            const updateQuery1 = "UPDATE viikon_tulokset SET vuosi=" + (year - 2).toString() + " WHERE vuosi=2023";
            con.query(updateQuery1, (err, result) => {});
            const updateQuery2 = "UPDATE viikon_tulokset SET vuosi=" + (year - 1).toString() + " WHERE vuosi=2022";
            con.query(updateQuery2, (err, result) => {});
            
          });
          return null;
        }
      })
    },
  },
});
