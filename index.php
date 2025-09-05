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
  </style>
</head>
<body>
  <h1>API lietotāji</h1>
  <div id="output">Loading...</div>

  <script>
    const output = document.getElementById('output');

    // Funkcija, lai ielādētu datus no API
    function loadData() {
      fetch('http://localhost:8000/tests')
        .then(response => {
          if (!response.ok) throw new Error('Network response was not OK');
          return response.json();
        })
        .then(data => {
          renderTable(data);
        })
        .catch(error => {
          output.textContent = 'Kļūda: ' + error;
        });
    }

    // Funkcija, lai renderētu tabulu ar DELETE pogām
    function renderTable(data) {
      if (!data.users || data.users.length === 0) {
        output.innerHTML = '<p>Nav lietotāju.</p>';
        return;
      }

      let html = '<table>';
      html += '<tr><th>ID</th><th>Name</th><th>Role</th><th>Email</th><th>Action</th></tr>';

      data.users.forEach(user => {
        html += `<tr>
          <td>${user.id}</td>
          <td>${user.name}</td>
          <td>${user.role}</td>
          <td>${user.email}</td>
          <td><button onclick="deleteUser(${user.id})">Delete</button></td>
        </tr>`;
      });

      html += '</table>';
      output.innerHTML = html;
    }

    // Funkcija, lai dzēstu lietotāju pēc id
    function deleteUser(id) {
      fetch('http://localhost:8000/tests', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ array: 'users', field: 'id', value: id })
      })
      .then(response => response.json())
      .then(data => {
        alert(data.message); // parāda ziņu par dzēšanu
        loadData(); // pārkārto tabulu
      })
      .catch(error => {
        alert('Kļūda: ' + error);
      });
    }

    // Inicializē datu ielādi
    loadData();
  </script>
</body>
</html>
