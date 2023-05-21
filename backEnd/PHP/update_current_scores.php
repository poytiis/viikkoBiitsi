<?php
include 'connect_to_database.php';
header("Access-Control-Allow-Origin: *");
$conn = connect_database();
$conn->begin_transaction();

function handle_error(mysqli $conn): void {
    $conn->rollback();
    die;
}

$json = file_get_contents('php://input');
$post_data = json_decode($json); 

$score_stmt = $conn->prepare("UPDATE wpzl_postmeta SET meta_value = ? WHERE meta_id = ?");
$score_stmt->bind_param('ss', $post_data->scorevalue, $post_data->scoreid);
if(!$score_stmt->execute()) {
    handle_error($conn);
}

$score_stmt->bind_param('ss', $post_data->rankValue, $post_data->rankId);
if(!$score_stmt->execute()) {
    handle_error($conn);
}

$score_stmt->bind_param('ss', $data->nameValue, $data->nameId);
if(!$score_stmt->execute()) {
    handle_error($conn);
}

$score_stmt->bind_param('ss', $data->serievalue, $data->serieId);
if(!$score_stmt->execute()) {
    handle_error($conn);
}

$conn->commit();
?>