<?php
include 'add_cors_headers.php';
include 'check_auth.php';
include 'connect_to_database.php';

$conn = connect_database();
$conn->begin_transaction();

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


$score_stmt = $conn->prepare("UPDATE viikon_tulokset SET nimi = ?, sarja = ?, viikko = ?, lohko = ?, sijoitus = ?, pelatut_pisteet = ?, sarja_pisteet = ?, vuosi = ?  WHERE id = ?");
$score_stmt->bind_param('ssiiiiiii', $name, $serie, $week, $pool, $ranking, $played_scores, $serie_scores, $year, $id);

if(!$score_stmt->execute()) {
    handle_error($conn);
}

$conn->commit();
?>