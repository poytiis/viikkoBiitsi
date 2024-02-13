import {createBrowserHistory} from 'history';

const apiURL = process.env.REACT_APP_API_URL;

export const logInFetch = (username, password) => {
  const postBody = {
    username,
    password
  };
  const url = apiURL + 'login.php';
  return fetchRequest(url, 'POST', postBody);
};

export const fetchCountingScoresTimeFetch = () => {
  const url = apiURL + 'counting_scores_times.php';
  return fetchRequest(url);
};

export const calculateBegingRankingFetch = () => {
  const url = apiURL + 'calculate_beging_ranking.php';
  return fetchRequest(url);
};

export const postCountingScoresTimeAFetch = (countingTimes) => {
  const postBody = {
    countingTimes
  };
  const url = apiURL + 'counting_scores_times.php';
  return fetchRequest(url, 'POST', postBody);
};

export const logOutFetch = () => {
  const url = apiURL + 'logout.php';
  return fetchRequest(url);
};

export const getNewScoresFetch = () => {
  const url = apiURL + 'show_scores.php';
  return fetchRequest(url);
};

export const searchOldScoresFetch = (player, year, week, serie, pool) => {
  const url = apiURL + 'search_old_scores.php?week=' + week.toString() + '&year=' + year.toString() + '&player=' + player + '&serie=' + serie + '&pool=' + pool;
  return fetchRequest(url);
};

export const UpdatePoolFetch = (data) => {
  const url = apiURL + 'update_pool.php';
  return fetchRequest(url, 'POST', data);
};

export const downloadRankingsFetch = (serie) => {
  const url = serie === 'men'
    ? apiURL + 'download_ranking.php?serie=men'
    : apiURL + 'download_ranking.php?serie=women';
  return fetchRequest(url);
};

export const deletePoolFetch = (postId) => {
  const url = apiURL + 'delete_pool.php?post_id=' + postId;
  return fetchRequest(url);
};

export const fetchLogsFetch = () => {
  const url = apiURL + 'show_logs.php';
  return fetchRequest(url);
};

export const calculateNewRankingFetch = () => {
  const url = apiURL + 'calculate_scores.php';
  return fetchRequest(url);
};

export const updateRankingFetch = () => {
  const url = apiURL + 'calculate_scores.php?update_only=true';
  return fetchRequest(url);
};

export const takeBackupFormDataFetch = () => {
  const url = apiURL + 'take_backup_form_data.php';
  return fetchRequest(url);
};

export const downloadBackupFormDataFetch = () => {
  const url = apiURL + 'download_form_data_backup.php';
  return fetchRequest(url);
};

export const updateOldScoresFetch = (data) => {
  const url = apiURL + 'update_old_scores.php';
  return fetchRequest(url, 'POST', data);
};

export const deleteOldScoresFetch = (data) => {
  const url = apiURL + 'delete_old_scores.php';
  return fetchRequest(url, 'POST', data);
};


const fetchRequest = async (url, method = 'GET', data = {}) => {
  let config = {credentials: 'include'};
  if (method !== 'GET') {
    config = {
      method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }
  }

  try {
    const response = await fetch(url, config);
    if (response.status === 401) {
      localStorage.removeItem('loggedIn');
      const history = createBrowserHistory();
      const path = window.location.pathname;
      if (path !== '/') {
        history.go('/');
      } 
    }

  return response;
  } catch (ex) {
    return undefined;
  }
};
