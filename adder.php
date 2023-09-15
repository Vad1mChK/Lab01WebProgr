<?php
session_start();

if($_SERVER['REQUEST_METHOD'] != 'GET') {
    header("HTTP/1.1 405 Method Not Allowed");
    exit;
}

$shots = [];
if(!isset($_SESSION["shots"])) {
    $shots = [];
    $_SESSION["shots"] = $shots;
} else {
    $shots = $_SESSION["shots"];
}

$x = $_GET['x'];
$y = $_GET['y'];
$r = $_GET['r'];
$zone = $_GET['zone'];

/**
 * Проверяем валидность поступивших значений
 */
function validateQuery($x, $y, $r, $zone) {
    $errors = [];
    define("Y_MIN", -5);
    define("Y_MAX", 3);

    if(!isset($x)) {
        $errors[] = "В запросе отсутствует координата X.";
    } elseif (!is_numeric($x)) {
        $errors[] = "Координата X - не число.";
    } elseif(!in_array($x, ['-4', '-3', '-2', '-1', '0', '1', '2', '3', '4'])) {
        $errors[] = "Координата X - не целое число в диапазоне [-4..4]";
    }
    if(!isset($y)) {
        $errors[] = "В запросе отсутствует координата Y.";
    } elseif(!is_numeric($y)) {
        $errors[] = "Координата Y - не число.";
    } elseif(strlen($y) > 15) {
        $errors[] = "Вы не могли ввести такое значение в форму. Вы явно читерите.";
    } elseif($y <= Y_MIN || $y >= Y_MAX) {
        $errors[] = "Координата Y - не число на открытом интервале (".Y_MIN."..".Y_MAX.")";
    }
    if(!isset($r)) {
        $errors[] = "В запросе отсутствует параметр R.";
    } elseif(!is_numeric($r)) {
        $errors[] = "Параметр R - не число.";
    } elseif(!in_array($r, ['1', '2', '3', '4', '5'])) {
        $errors[] = "Координата X - не целое число в диапазоне [1..5]";
    }
    if(!isset($zone)) {
        $errors[] = "В запросе отсутствует временная зона.";
    } elseif(!is_numeric($zone)) {
        $errors[] = "Временная зона - не число.";
    } elseif(!isValidZone($zone)) {
        $errors[] = "Временная зона некорректна.";
    }
    return $errors;
}

/**
 * Проверяем, попал ли выстрел в область
 */
function isDotWithinArea($x, $y, $r) {
    return ($x >= 0 && $y >= 0 && $x <= $r && $y <= $r) // Верхний правый квадрант
        || ($x <= 0 && $y >= 0 && $y - 2*$x <= $r) // Верхний левый квадрант
        // Нижний левый квадрант пуст
        || ($x >= 0 && $y <= 0 && $x*$x + $y*$y <= $r*$r/4); // Нижний правый квадрант
}

/**
 * Получаем текущую дату, зависящую от зоны
 */
function currentDate($zone) {
    $zoneName = timezone_name_from_abbr("", $zone*60, false);
    date_default_timezone_set($zoneName);
    $date = new DateTime('now', new DateTimeZone($zoneName));
    return $date->format('d.m.Y, H:i:s') . "\n";
}

/**
 * Проверяем, валидна ли зона (а именно оффсет в минутах)
 */
function isValidZone($zone) {
    $date = new DateTime('now');

    $validZones = DateTimeZone::listIdentifiers();
    foreach ($validZones as $validZone) {
        $offsetSeconds = (new DateTimeZone($validZone))->getOffset($date);
        if ($offsetSeconds == $zone * 60) {
            return true;
        }
    }
    return false; 
}

$errors = validateQuery($x, $y, $r, $zone);

$response = [];

if (empty($errors)) {
    // Собственно, стреляем и проверяем попадание
    $hit = isDotWithinArea($x, $y, $r);

    // Создаём новый выстрел
    $shot = [
        'x' => $x,
        'y' => $y,
        'r' => $r,
        'hit' => $hit,
        'datetime' => currentDate($zone),
        'timeElapsed' => number_format(microtime(true) - $_SERVER["REQUEST_TIME_FLOAT"], 6)
    ];

    // Добавляем новый выстрел в массив
    $shots[] = $shot;

    // Сохраняем массив в сессии
    $_SESSION["shots"] = $shots;

    header("HTTP/1.0 201 Created");
    $response['newShot'] = $shot;

} else {
    header("HTTP/1.0 400 Bad Request");
    $response['errors'] = $errors;
}

echo json_encode($response);
?>