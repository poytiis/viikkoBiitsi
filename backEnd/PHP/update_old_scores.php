<?php
include 'add_cors_headers.php';
include 'check_auth.php';
include 'connect_to_database.php';

$conn = connect_database();
$conn->begin_transaction();

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

function handle_error(mysqli $conn): void {
    $conn->rollback();
    die;
}

$json = file_get_contents('php://input');
$post_data = json_decode($json);

$name = $post_data->name;

$week =  $post_data->week;
$pool = $post_data->pool;
$ranking = $post_data->ranking;
$played_scores =$post_data->playedScores;
$serie_scores = $post_data->serieScores;
$year =  $post_data->year;
$serie =  $post_data->serie;
$id = $post_data->id;

$old_values_stmt = $conn->prepare("SELECT  `nimi`, `sarja`, `viikko`, `lohko`, `sijoitus`, `pelatut_pisteet`, `sarja_pisteet`, `vuosi` FROM viikon_tulokset WHERE id = ? ");
$old_values_stmt->bind_param('i', $id);
$old_values_stmt->execute();
$old_values_stmt->bind_result( $name_old, $serie_old, $week_old, $pool_old, $ranking_old, $played_scores_old, $serie_scores_old, $year_old);
$old_values_stmt->fetch();
$old_values_stmt->close();


$score_stmt = $conn->prepare("UPDATE viikon_tulokset SET nimi = ?, sarja = ?, viikko = ?, lohko = ?, sijoitus = ?, pelatut_pisteet = ?, sarja_pisteet = ?, vuosi = ?  WHERE id = ?");
$score_stmt->bind_param('ssiiiiiii', $name, $serie, $week, $pool, $ranking, $played_scores, $serie_scores, $year, $id);

if(!$score_stmt->execute()) {
    handle_error($conn);
}

$old_scores = [$id, $name_old, $serie_old, $week_old, $pool_old, $ranking_old, $played_scores_old, $serie_scores_old, $year_old];
$old_scores_json = json_encode($old_scores, JSON_UNESCAPED_UNICODE );

$new_scores = [$id, $name, $serie, $week, $pool, $ranking, $played_scores, $serie_scores, $year];
$new_scores_json = json_encode($new_scores, JSON_UNESCAPED_UNICODE );
echo $old_scores_json;
echo $new_scores_json;

$change_log_stmt = $conn->prepare("INSERT INTO viikon_tulokset_muutokset VALUES (DEFAULT, ?, ?, NOW());");
$change_log_stmt->bind_param('ss', $old_scores_json, $new_scores_json);
$change_log_stmt->execute();
$change_log_stmt->close();


$conn->commit();
?>