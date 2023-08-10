<?php
include 'add_cors_headers.php';
include 'check_auth.php';
include 'connect_to_database.php';
include 'update_ranking_lists.php';

$conn = connect_database();
$conn->begin_transaction();

$year = (int)date('Y');
$year_check_query = "SELECT sarja_pisteet FROM viikon_tulokset WHERE vuosi = $year";
$year_check_r = $conn->query($year_check_query);
if ($year_check_r->fetch_object()) {
  http_response_code(500);
  echo '{"data": "Alkuranginkit laskettu aikaisemmin}"';
  $conn->close();
  die;
}
$name_query = "SELECT nimi FROM `viikon_tulokset` GROUP by nimi";

$names_r = $conn->query($name_query);

while($row = $names_r->fetch_object()){
    $name = $row->nimi;
    $last_year = $year - 1;
    $total_points = 0;
    $serie = '';

    $scores_sum_stmt = $conn->prepare("SELECT sarja_pisteet, sarja FROM viikon_tulokset WHERE nimi = ? AND vuosi = ? AND viikko <> 0 ORDER BY sarja_pisteet DESC LIMIT 6");
    $scores_sum_stmt->bind_param('si', $name, $last_year);
    $scores_sum_stmt->execute();
    $scores_sum_stmt->bind_result($row_scores, $row_serie);

    while($scores_sum_stmt->fetch()) {
        $total_points += (float)$row_scores;
        $serie = $row_serie;
    }

    if($total_points == 0) {
        continue;
    }

    $total_points = $total_points / 6;
    $total_points = round($total_points, 2);

    $last_scores_stmt = $conn->prepare("SELECT sarja_pisteet FROM viikon_tulokset WHERE nimi = ? AND vuosi = ? ORDER BY id DESC LIMIT 1");
    $last_scores_stmt->bind_param('si', $name, $last_year);
    $last_scores_stmt->execute();
    $last_scores_stmt->bind_result($last_scores);
    $last_scores_stmt->fetch();
    $last_scores_stmt->close();
    $final_scores = 0;

    
    $last_scores = (float)$last_scores;

    if($last_scores > $total_points) {
        $final_scores = $last_scores;
    } else {
        $final_scores = $total_points;
    }

    $insert_stmt = $conn->prepare("INSERT INTO  viikon_tulokset VALUES (DEFAULT, ?, ?, 0, 0, 0, 0, ?, ?)");
    if(!$insert_stmt) {
        echo $conn->error;
        $conn->rollback();
        die;
    }
    $insert_stmt->bind_param('ssdi', $name, $serie, $final_scores, $year);
    if(!$insert_stmt->execute()) {
        $conn->rollback();
        die;
    }
}

update_ranking_lists($conn, true);

$conn->commit();
$conn->close();
?>