<?php
session_start();
$response = [];

if($_SERVER['REQUEST_METHOD'] != 'POST') {
    header("HTTP/1.1 405 Method Not Allowed");
    exit;
}

$action = $_POST['action'];

if($action !== 'delete') {
    header("HTTP/1.1 400 Bad Request");
    $response['errors'] = ["Недопустимое действие: ".$action];
} else {
    $_SESSION['shots'] = [];
    $response['success'] = ["Данные о выстрелах очищены."];
}

echo json_encode($response);
?>