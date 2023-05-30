import { createBrowserHistory } from 'history';

let apiURL = 'https://www.jklbeach.fi/';
apiURL = 'http://localhost:8081/'


export const logInFetch = (username, password) => {
  const postBody = {
    username,
    password
  };
  const url = apiURL + 'login.php';
  return fetchRequest(url, "POST", postBody);
}

export const fetchCountingScoresTimeFetch = () => {
  const url = apiURL + 'counting_scores_times.php';
  return fetchRequest(url);
}

export const calculateBegingRankingFetch = () => {
  const url = apiURL + 'calculate_beging_ranking.php';
 return fetchRequest(url);
}

export const postCountingScoresTimeAFetch = (countingTimes) => {
  const postBody = {
    countingTimes
  };
  const url = apiURL + 'counting_scores_times.php';
  return fetchRequest(url, 'POST', postBody);
}

export const logOutFetch = () => {
  const url = apiURL + 'logout.php';
  return fetchRequest(url);
}

export const getNewScoresFetch = () => {
  const url = apiURL + 'show_scores.php';
 return fetchRequest(url);
}

export const searchOldScoresFetch = (player, year, week, serie) => {
  const url = apiURL + 'search_old_scores.php?week=' + week.toString() + '&year=' + year.toString() + '&player=' + player + '&serie=' + serie;
  return fetchRequest(url);
}

export const UpdatePoolFetch = (data) => {
  const url = apiURL + 'update_pool.php';
  return fetchRequest(url, 'POST', data);
}

export const downloadRankingsFetch = (serie) => {
  const url = serie === 'men'
    ? apiURL + 'download_ranking.php?serie=men'
    : apiURL + 'download_ranking.php?serie=women';
  return fetchRequest(url);
}

export const deletePoolFetch = (postId) => {
  const url = apiURL + 'delete_pool.php?post_id=' + postId;
  return fetchRequest(url);
}

export const fetchLogsFetch = () => {
  const url = apiURL + 'show_logs.php';
  return fetchRequest(url);
}

export const calculateNewRankingFetch = () => {
  const url = apiURL + 'calculate_scores.php';
  return fetchRequest(url);
}

const fetchRequest = async (url, method = 'GET', data = {}) => {
  let config = {credentials: "include"};
  if (method !== 'GET') {
    config = {
      method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    }
  }
  try {
    const response = await fetch(url, config);
    if (response.status === 401) {
    localStorage.removeItem("loggedIn");
    const history = createBrowserHistory();
    history.go('/');
  }

  return response;
  } catch (ex) {
    return undefined;
  }
 
 
}