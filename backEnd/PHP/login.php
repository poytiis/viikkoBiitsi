<?php
include 'connect_to_database.php';
include 'add_cors_headers.php';

$json = file_get_contents('php://input');
$post_data = json_decode($json); 

$username = $post_data->username;
$password = $post_data->password;

if($username == "" || $password == "" || $username == null || $password == null) {
    http_response_code(400);
}

$conn = connect_database();

$auth_stmt = $conn->prepare("SELECT hallinta_arvo FROM viikko_biitsi_hallinta WHERE hallinta_avain = ?");
$auth_stmt->bind_param('s', $username);
$auth_stmt->execute();
$auth_stmt->bind_result($password_in_db);
$auth_stmt->fetch();
$auth_stmt->close();

if( $password_in_db == '') {
    http_response_code(401);
    die;
}

$password_hash = hash("sha256", $password);

if($password_hash == $password_in_db) {
    session_start();
    $session_id = session_id();
    $_SESSION["username"] = $username;
    setcookie("ViikkoBiitsiUser", $username, ['samesite' => 'None',  'secure' => true,  'httponly' => true]);
    setcookie("ViikkoBiitsiSession", $session_id, ['samesite' => 'None',  'secure' => true,  'httponly' => true]);
} else {
    http_response_code(401);   
}

?>