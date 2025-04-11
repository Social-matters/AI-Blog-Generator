
<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// If this is a preflight OPTIONS request, respond with 200 OK
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// This is a simple API endpoint example you can use for any backend processing
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data)) {
        // Process data here
        // For example, you could save generated blogs to your MySQL database
        
        echo json_encode([
            "status" => "success",
            "message" => "Data received successfully"
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "No data provided"
        ]);
    }
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Invalid request method"
    ]);
}
?>
