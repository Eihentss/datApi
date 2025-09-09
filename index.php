<!DOCTYPE html>
<html lang="lv">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>API Tests</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f0f2f5;
        }
        h1 {
            text-align: center;
            color: #2c3e50;
        }
        .input-section {
            background: white;
            padding: 20px;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-bottom: 20px;
        }
        .url-input {
            width: 100%;
            padding: 10px;
            margin-bottom: 15px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 16px;
            box-sizing: border-box;
        }
        .data-input {
            width: 100%;
            padding: 10px;
            min-height: 100px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            font-family: monospace;
            box-sizing: border-box;
        }
        .button-container {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-bottom: 20px;
            flex-wrap: wrap;
        }
        button {
            padding: 12px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            font-size: 16px;
            transition: all 0.2s;
        }
        button:hover {
            opacity: 0.9;
            transform: translateY(-2px);
        }
        button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }
        .btn-get {
            background-color: #3498db;
            color: white;
        }
        .btn-post {
            background-color: #2ecc71;
            color: white;
        }
        .btn-put {
            background-color: #f39c12;
            color: white;
        }
        .btn-delete {
            background-color: #e74c3c;
            color: white;
        }
        .result-container {
            background: white;
            padding: 20px;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        pre {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 4px;
            overflow-x: auto;
            white-space: pre-wrap;
            max-height: 500px;
            overflow-y: auto;
            border: 1px solid #e9ecef;
        }
        .status {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            margin-left: 10px;
            font-size: 14px;
            font-weight: bold;
        }
        .status-success {
            background-color: #d4edda;
            color: #155724;
        }
        .status-error {
            background-color: #f8d7da;
            color: #721c24;
        }
        .status-loading {
            background-color: #d1ecf1;
            color: #0c5460;
        }
        .quick-data {
            margin-top: 10px;
        }
        .quick-data button {
            padding: 6px 12px;
            font-size: 12px;
            margin-right: 10px;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <h1>API Testa Panelis</h1>
    
    <div class="input-section">
        <input type="text" class="url-input" id="apiEndpoint" value="http://localhost:8000/parole" placeholder="Ievadiet API URL">
        
        <!-- Paroles ievades lauks -->
        <input type="password" class="url-input" id="apiPassword" placeholder="Ievadiet paroli (ja nepieciešama)">
        
        <textarea class="data-input" id="requestData" placeholder='Ievadiet datus JSON formātā (POST/PUT metodēm):
{
    "name": "John",
    "age": 30,
    "city": "Riga"
}'></textarea>
        
        <div class="quick-data">
            <strong>Ātri dati:</strong>
            <button class="btn-post" onclick="setQuickData('user')">Lietotājs</button>
            <button class="btn-post" onclick="setQuickData('product')">Produkts</button>
            <button class="btn-post" onclick="setQuickData('task')">Uzdevums</button>
            <button class="btn-delete" onclick="clearData()">Notīrīt</button>
        </div>
    </div>
    
    <div class="button-container">
        <button class="btn-get" onclick="testMethod('GET')" id="getBtn">GET</button>
        <button class="btn-post" onclick="testMethod('POST')" id="postBtn">POST</button>
        <button class="btn-put" onclick="testMethod('PUT')" id="putBtn">PUT</button>
        <button class="btn-delete" onclick="testMethod('DELETE')" id="deleteBtn">DELETE</button>
    </div>
    
    <div class="result-container">
        <h3>Rezultāts: <span id="status" class="status status-success">Gatavs</span></h3>
        <pre id="output">Izvēlieties metodi, lai sāktu testēt...</pre>
    </div>

    <script>
        const output = document.getElementById("output");
        const statusElement = document.getElementById("status");
        
        function setStatus(text, type) {
            statusElement.textContent = text;
            statusElement.className = `status status-${type}`;
        }
        
        function setQuickData(type) {
    const dataInput = document.getElementById("requestData");
    const quickData = {
        user: {
            "name": "Jānis Bērziņš",
            "email": "janis@example.com",
            "age": 28,
            "city": "Rīga"
        },
        product: {
            "name": "Laptop",
            "price": 899.99,
            "category": "Electronics",
            "inStock": true
        },
        task: {
            "title": "Pabeigt projektu",
            "description": "Laravel API izstrāde",
            "priority": "high",
            "completed": false
        }
    };

    // saglabā datus kā masīvu ar vienu elementu
    dataInput.value = JSON.stringify([quickData[type]], null, 2);
}

        
        function clearData() {
            document.getElementById("requestData").value = "";
        }
        
        function disableButtons(disabled) {
            const buttons = ['getBtn', 'postBtn', 'putBtn', 'deleteBtn'];
            buttons.forEach(id => {
                document.getElementById(id).disabled = disabled;
            });
        }
        
        async function testMethod(method) {
            const apiUrl = document.getElementById("apiEndpoint").value.trim();
            const requestDataText = document.getElementById("requestData").value.trim();
            const apiPassword = document.getElementById("apiPassword").value.trim();
            
            if (!apiUrl) {
                setStatus('Kļūda: Nav norādīts API URL!', 'error');
                output.textContent = 'Lūdzu, ievadiet API URL!';
                return;
            }
            
            setStatus('Ielādē...', 'loading');
            disableButtons(true);
            
            let requestData = null;
            
            // Sagatavot datus POST/PUT metodēm
            if ((method === 'POST' || method === 'PUT') && requestDataText) {
                try {
                    requestData = JSON.parse(requestDataText);
                } catch (e) {
                    setStatus('Kļūda: Nederīgs JSON!', 'error');
                    output.textContent = `JSON parsing kļūda: ${e.message}`;
                    disableButtons(false);
                    return;
                }
            }
            
            const requestOptions = {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            };
            
            // Pievieno paroli headerī, ja ir ievadīta
            if (apiPassword) {
                requestOptions.headers['X-API-PASSWORD'] = apiPassword;
            }
            
            // Pievienot datus, ja nepieciešams
            if (requestData && (method === 'POST' || method === 'PUT')) {
                requestOptions.body = JSON.stringify(requestData);
            }
            
            try {
                const startTime = Date.now();
                const response = await fetch(apiUrl, requestOptions);
                const endTime = Date.now();
                const duration = endTime - startTime;
                
                let responseData;
                const contentType = response.headers.get('content-type');
                
                if (contentType && contentType.includes('application/json')) {
                    responseData = await response.json();
                } else {
                    responseData = await response.text();
                }
                
                const result = {
                    method: method,
                    url: apiUrl,
                    status: response.status,
                    statusText: response.statusText,
                    duration: `${duration}ms`,
                    headers: Object.fromEntries(response.headers.entries()),
                    data: responseData
                };
                
                if (response.ok) {
                    setStatus(`Veiksmīgi (${response.status})`, 'success');
                } else {
                    setStatus(`Kļūda (${response.status})`, 'error');
                }
                
                output.textContent = JSON.stringify(result, null, 2);
                
            } catch (error) {
                setStatus('Pieslēguma kļūda', 'error');
                output.textContent = `Fetch kļūda: ${error.message}\n\nPārbaudiet:\n- Vai Laravel serveris darbojas (php artisan serve)\n- Vai URL ir pareizs\n- Vai nav CORS problēmas`;
            } finally {
                disableButtons(false);
            }
        }
        
        window.addEventListener('load', () => {
            output.textContent = 'Panelis gatavs darbam!\n\nIeteikumi:\n1. Pārbaudiet, vai Laravel serveris darbojas\n2. Sāciet ar GET metodi\n3. Izmantojiet POST, lai pievienotu datus\n4. DELETE, lai izdzēstu visus datus';
        });
    </script>
</body>

</html>