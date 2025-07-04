<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $message = trim($_POST['message'] ?? '');

    if ($name && $email && $message) {
        $filename = 'messages.txt'; // Файл в той же папке

        $entry  = "Дата: " . date('Y-m-d H:i:s') . PHP_EOL;
        $entry .= "Имя: $name" . PHP_EOL;
        $entry .= "Email: $email" . PHP_EOL;
        $entry .= "Сообщение: $message" . PHP_EOL;
        $entry .= "------------------------" . PHP_EOL;

        // Попытка записать в файл
        if (file_put_contents($filename, $entry, FILE_APPEND | LOCK_EX) !== false) {
            header('Location: contacts.html?status=success');
            exit();
        } else {
            header('Location: contacts.html?status=error');
            exit();
        }
    } else {
        header('Location: contacts.html?status=error');
        exit();
    }
} else {
    header('Location: contacts.html');
    exit();
}
?>
