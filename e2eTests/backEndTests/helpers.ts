import mysql from 'mysql2/promise';
import axios from 'axios';
import { clearUsers, initTestUser } from './SQLData/viikko_biitsi_hallinta';

axios.defaults.withCredentials = true;

export const baseUrl = 'http://localhost:8081/'

export const axiosLogIn = async () => {
    await querySingleDatabase(clearUsers)
    await querySingleDatabase(initTestUser)
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


