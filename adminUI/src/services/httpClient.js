import axios from 'axios';

axios.defaults.withCredentials = true

let apiURL = 'https://www.jklbeach.fi/';
apiURL = 'http://localhost:8081/'

export const logInAjax = (username, password) => {
  const postBody = {
    username,
    password
  };
  const url = apiURL + 'login.php';
  return axios.post(url, postBody);
}

export const getNewScores = () => {
  const url = apiURL + 'show_scores.php';
  console.log(url);
  return axios.get(url);
}

export const putScores = (data) => {
  const url = apiURL + 'update_pool.php';
  console.log(url);
  return axios.post(url, data);
}


export const downloadRankings = (serie) => {
  const url = serie === 'men'
    ? apiURL + 'download_ranking.php?serie=men'
    : apiURL + 'download_ranking.php?serie=women';
  return axios.get(url);
}

export const deletePoolAjax = (postId) => {
  const url = apiURL + 'delete_pool.php?post_id=' + postId;
  return axios.get(url);
}

export const calculateNewRankingAjax = () => {
  const url = apiURL + 'calculate_scores.php';
  return axios.get(url);
}

export const fetchLogsAjax = () => {
  const url = apiURL + 'show_logs.php';
  return axios.get(url);
}