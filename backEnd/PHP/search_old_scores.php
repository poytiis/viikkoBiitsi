<?php
include 'add_cors_headers.php';
include 'check_auth.php';
include 'connect_to_database.php';

$conn = connect_database();

$week = (int)$_GET['week'];
$serie = $_GET['serie'];
$year = (int) $_GET['year'];
$player = $_GET['player'];
$pool = (int)$_GET['pool'];

$query = "SELECT nimi, viikko, lohko, sijoitus, pelatut_pisteet, sarja_pisteet, vuosi, sarja, id  FROM viikon_tulokset  WHERE ";
$is_first_param = true;
$bind_params = "";
$bind_items = [];

if ($week) {
  if ($is_first_param) {
    $is_first_param = false;
  } else {
    $query = $query. " AND ";
  }
  $query = $query. ' viikko = ? ';
  $bind_params = $bind_params. 'i';
  array_push($bind_items, $week);
}
if ($serie) {
  if ($is_first_param) {
    $is_first_param = false;
   
  } else {
    $query = $query. " AND ";
  }
  $query = $query. ' sarja = ? ';
  $bind_params = $bind_params. 's';
  array_push($bind_items, $serie);
}
if ($year) {
  if ($is_first_param) {
    $is_first_param = false;
   
  } else {
    $query = $query. " AND ";
  }
  $query = $query. 'vuosi = ?';
  $bind_params = $bind_params. 'i';
  array_push($bind_items, $year);
}
if ($player) {
  if ($is_first_param) {
    $is_first_param = false;
   
  } else {
    $query = $query. " AND ";
  }
  $query = $query. 'nimi = ?';
  $bind_params = $bind_params. 's';
  array_push($bind_items, $player);
}
if ($pool) {
  if ($is_first_param) {
    $is_first_param = false;
   
  } else {
    $query = $query. " AND ";
  }
  $query = $query. 'lohko = ?';
  $bind_params = $bind_params. 'i';
  array_push($bind_items, $pool);
}

$search_stmt = $conn->prepare($query);
$search_stmt->bind_param($bind_params, ...$bind_items);
$search_stmt->execute();
$search_stmt->bind_result($name, $week, $pool, $ranking, $played_scores, $serie_scores, $year_db, $serie, $id);

echo '{"data": [';

$data_rows = '';

while($search_stmt->fetch()) {
  $data_rows = $data_rows. '[';
  $data_rows = $data_rows. '"'. $name. '",';
  $data_rows = $data_rows. (string)$week . ',';
  $data_rows = $data_rows. (string)$pool . ',';
  $data_rows = $data_rows. (string)$ranking . ',';
  $data_rows = $data_rows. (string)$played_scores . ',';
  $data_rows = $data_rows. (string)$serie_scores . ',';
  $data_rows = $data_rows. (string)$year_db . ',';
  $data_rows = $data_rows. '"'. $serie. '",';
  $data_rows = $data_rows. (string)$id;
  $data_rows = $data_rows. '],';
}

$data_rows = rtrim($data_rows, ",");

echo $data_rows;

echo "]}";
?>