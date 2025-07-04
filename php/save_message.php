<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $message = trim($_POST['message'] ?? '');

    if ($name && $email && $message) {
        $filename = 'messages.txt'; // ���� � ��� �� �����

        $entry  = "����: " . date('Y-m-d H:i:s') . PHP_EOL;
        $entry .= "���: $name" . PHP_EOL;
        $entry .= "Email: $email" . PHP_EOL;
        $entry .= "���������: $message" . PHP_EOL;
        $entry .= "------------------------" . PHP_EOL;

        // ������� �������� � ����
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
