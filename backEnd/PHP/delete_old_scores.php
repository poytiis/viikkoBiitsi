<?php
include 'add_cors_headers.php';
// include 'check_auth.php';
include 'connect_to_database.php';

$conn = connect_database();

$json = file_get_contents('php://input');
$post_data = json_decode($json);

$id = $post_data->id;
if ($id == ""  || !$id) {
    echo "invalid post_id";
    http_response_code(400);
    die;
}
$id = (int)$id;

$delete_stmt = $conn->prepare("DELETE FROM viikon_tulokset WHERE id=?");
$delete_stmt->bind_param('i', $id);
if(!$delete_stmt->execute()) {
    http_response_code(500);
}

?>