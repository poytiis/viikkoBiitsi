// import mysql from 'mysql';
import mysql from 'mysql2/promise';
import axios from 'axios';

axios.defaults.withCredentials = true;

export const baseUrl = 'http://localhost:8081/'

export const axiosLogIn = async () => {
    const post = await axios.post(baseUrl + 'login.php', {username: 'admin', password: 'admin'})
    const cookies = post.headers['set-cookie'];
    let cookiesSTR = ''

    if (cookies) {
        cookiesSTR = cookies[0].split(';')[0] + ';' + cookies[1].split(';')[0] + ';'  + cookies[2].split(';')[0]
    }

    const config = {
        headers:{
          Cookie: cookiesSTR,      
        }     
    };

    return config;
}

export const queryDatabase = async (queries: string[]) => {
    const con = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "viikkobiitsi"
    });

    con.connect();
    let sqlResult: any = null
    await queries.forEach(async query => {
        const [rows, fields] = await con.execute(query);
        sqlResult = rows;
        // con.query(query, (error, results, fields) => { sqlResult = results; console.log(sqlResult.length)});
    });
    
    con.end();
    return null;
}

export const querySingleDatabase = async (queries: string) => {
    const con = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "viikkobiitsi"
    });

    con.connect();
    const [rows, fields] = await con.execute(queries)
    
    con.end();
    return rows;
}


