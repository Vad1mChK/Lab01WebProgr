<?php
session_start();

if($_SERVER['REQUEST_METHOD'] != 'HEAD') {
    header("HTTP/1.1 405 Method Not Allowed");
    exit;
}

$_SESSION["shots"] = [];
?>