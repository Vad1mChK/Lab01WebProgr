<?php
session_start();
$response = [];
$method =  $_SERVER['REQUEST_METHOD'];

// Support POST with data: {action: 'delete'} because helios seems to decline DELETE requests
if($method !== 'POST' && $method !== 'DELETE') {
    header("HTTP/1.1 405 Method Not Allowed");
    header("Allow: POST, DELETE");
    exit;
}

if($method !== 'DELETE' && $_POST['action'] !== 'delete') {
    header("HTTP/1.1 400 Bad Request");
    $response['errors'] = ["Недопустимое действие: ".$action];
} else {
    $_SESSION['shots'] = [];
    $response['success'] = ["Данные о выстрелах очищены."];
}

echo json_encode($response);
?>