<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tests</title>
  <style>
    table { border-collapse: collapse; width: 100%; margin-top: 20px; }
    th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
    button { padding: 4px 8px; background: red; color: white; border: none; cursor: pointer; }
    button:hover { opacity: 0.8; }
    .loading { color: #666; font-style: italic; }
    .error { color: red; }
  </style>
</head>
<body>
  <h1>API lietotāji</h1>
  <div id="output">Loading...</div>

  <script>
    const output = document.getElementById('output');

    // Funkcija, lai ielādētu datus no API
    function loadData() {
      output.innerHTML = '<p class="loading">Loading...</p>';
      
      fetch('http://localhost:8000/tests', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
      .then(response => {
        console.log('Response status:', response.status);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Received data:', data);
        renderTable(data);
      })
      .catch(error => {
        console.error('Load error:', error);
        output.innerHTML = `<p class="error">Kļūda ielādējot datus: ${error.message}</p>`;
      });
    }

    // Funkcija, lai renderētu tabulu ar DELETE pogām
    function renderTable(data) {
      console.log('Rendering table with data:', data);
      
      // Pārbaudam dažādus datu formātus
      let users = [];
      if (data.users && Array.isArray(data.users)) {
        users = data.users;
      } else if (Array.isArray(data)) {
        users = data;
      } else if (data.data && data.data.users && Array.isArray(data.data.users)) {
        users = data.data.users;
      }

      if (users.length === 0) {
        output.innerHTML = '<p>Nav lietotāju.</p>';
        return;
      }

      let html = '<table>';
      html += '<tr><th>ID</th><th>Name</th><th>Role</th><th>Email</th><th>Action</th></tr>';

      users.forEach(user => {
        html += `<tr>
          <td>${user.id || 'N/A'}</td>
          <td>${user.name || 'N/A'}</td>
          <td>${user.role || 'N/A'}</td>
          <td>${user.email || 'N/A'}</td>
          <td><button onclick="deleteUser(${user.id})">Delete</button></td>
        </tr>`;
      });

      html += '</table>';
      output.innerHTML = html;
    }

    // Funkcija, lai dzēstu lietotāju pēc id
    function deleteUser(id) {
      if (!confirm(`Vai tiešām vēlaties dzēst lietotāju ar ID ${id}?`)) {
        return;
      }

      console.log('Deleting user with ID:', id);

      const deleteData = {
        array: 'users',
        field: 'id', 
        value: id
      };

      console.log('Sending DELETE request with data:', deleteData);

      fetch('http://localhost:8000/tests', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(deleteData)
      })
      .then(response => {
        console.log('Delete response status:', response.status);
        return response.json().then(data => ({
          status: response.status,
          data: data
        }));
      })
      .then(result => {
        console.log('Delete result:', result);
        
        if (result.status >= 200 && result.status < 300) {
          alert(result.data.message || 'Lietotājs veiksmīgi dzēsts!');
          loadData(); // pārkārto tabulu
        } else {
          throw new Error(result.data.message || `HTTP ${result.status}`);
        }
      })
      .catch(error => {
        console.error('Delete error:', error);
        alert('Kļūda dzēšot lietotāju: ' + error.message);
      });
    }

    // Inicializē datu ielādi
    loadData();
  </script>
</body>
</html>