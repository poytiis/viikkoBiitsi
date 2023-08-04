<?php
include 'add_cors_headers.php';
include 'check_auth.php';
include 'connect_to_database.php';

$conn = connect_database();

$post_id = $_GET["post_id"];
if ($post_id == ""  || !$post_id) {
    echo "invalid post_id";
    http_response_code(400);
    die;
}

$delete_stmt = $conn->prepare("DELETE FROM wpzl_postmeta WHERE post_id=?");
$delete_stmt->bind_param('s', $post_id);
if(!$delete_stmt->execute()) {
    http_response_code(500);
}

?>