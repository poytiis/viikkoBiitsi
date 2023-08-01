<?php
include 'add_cors_headers.php';
// include 'check_auth.php';
include 'connect_to_database.php';

$conn = connect_database();
$conn->begin_transaction();

$json = file_get_contents('php://input');
$post_data = json_decode($json);

$id = $post_data->id;
if ($id == ""  || !$id) {
    echo "invalid post_id";
    http_response_code(400);
    die;
}
$id = (int)$id;

$old_values_stmt = $conn->prepare("SELECT  `nimi`, `sarja`, `viikko`, `lohko`, `sijoitus`, `pelatut_pisteet`, `sarja_pisteet`, `vuosi` FROM viikon_tulokset WHERE id = ? ");
$old_values_stmt->bind_param('i', $id);
$old_values_stmt->execute();
$old_values_stmt->bind_result( $name_old, $serie_old, $week_old, $pool_old, $ranking_old, $played_scores_old, $serie_scores_old, $year_old);
$old_values_stmt->fetch();
$old_values_stmt->close();

$old_scores = [$id, $name_old, $serie_old, $week_old, $pool_old, $ranking_old, $played_scores_old, $serie_scores_old, $year_old];
$old_scores_json = json_encode($old_scores, JSON_UNESCAPED_UNICODE );

$change_log_stmt = $conn->prepare("INSERT INTO viikon_tulokset_muutokset VALUES (DEFAULT, ?, NULL, NOW());");
$change_log_stmt->bind_param('s', $old_scores_json);
$change_log_stmt->execute();
$change_log_stmt->close();



$delete_stmt = $conn->prepare("DELETE FROM viikon_tulokset WHERE id=?");
$delete_stmt->bind_param('i', $id);
if(!$delete_stmt->execute()) {
    http_response_code(500);
    $conn->rollback();
}

$conn->commit();

?>