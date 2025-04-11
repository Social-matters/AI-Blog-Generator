
<?php
// Database configuration
define('DB_HOST', 'localhost');
define('DB_USERNAME', 'username'); // Change this to your database username
define('DB_PASSWORD', 'password'); // Change this to your database password
define('DB_NAME', 'blog_generator');

// Create database connection
$conn = new mysqli(DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
