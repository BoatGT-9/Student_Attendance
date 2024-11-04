function toggleAttendance(cell) {
    const status = cell.textContent.trim();
    if (status === 'เข้าเรียน') {
        cell.classList.remove('present');
        cell.classList.add('absent');
        cell.textContent = 'ไม่เข้าเรียน';
    } else if (status === 'ไม่เข้าเรียน' || status === '') {
        cell.classList.remove('absent');
        cell.classList.add('present');
        cell.textContent = 'เข้าเรียน';
    }
}

function loadAttendanceData() {
    fetch('student_attendance.json')
        .then(response => response.json())
        .then(data => {
            const tableContainer = document.getElementById('attendance-table');

            data.forEach(student => {
                const studentRow = document.createElement('tr');
                studentRow.innerHTML = `
                    <td>${student['รหัสประจำตัว']}</td>
                    <td>${student['ชื่อ']}</td>
                    <td class="week" onclick="toggleAttendance(this)">${student['สัปดาห์1']}</td>
                    <td class="week" onclick="toggleAttendance(this)">${student['สัปดาห์2']}</td>
                    <td class="week" onclick="toggleAttendance(this)">${student['สัปดาห์3']}</td>
                    <td class="week" onclick="toggleAttendance(this)">${student['สัปดาห์4']}</td>
                `;
                tableContainer.querySelector('tbody').appendChild(studentRow);
            });
        })
        .catch(error => console.error('Error loading the data:', error));
}

window.onload = loadAttendanceData;

function addStudent() {
    const studentIdInput = document.getElementById('student-id');
    const studentNameInput = document.getElementById('student-name');

    const studentId = studentIdInput.value.trim();
    const studentName = studentNameInput.value.trim();

    if (studentId === '' || studentName === '') {
        alert('โปรดกรอกข้อมูลให้ครบถ้วน');
        return;
    }

    const tableBody = document.querySelector('#attendance-table tbody');

    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${studentId}</td>
        <td>${studentName}</td>
        <td class="week" onclick="toggleAttendance(this)"></td>
        <td class="week" onclick="toggleAttendance(this)"></td>
        <td class="week" onclick="toggleAttendance(this)"></td>
        <td class="week" onclick="toggleAttendance(this)"></td>
    `;

    tableBody.appendChild(newRow);

    studentIdInput.value = '';
    studentNameInput.value = '';
}

function filterNames() {
    const searchText = document.getElementById('search').value.toUpperCase();
    const rows = document.querySelectorAll('#attendance-table tbody tr');

    rows.forEach(row => {
        const nameCell = row.querySelector('td:nth-child(2)');
        const name = nameCell.textContent.toUpperCase();
        row.style.display = name.includes(searchText) ? '' : 'none';
    });
}

function exportTable() {
    const rows = document.querySelectorAll('#attendance-table tbody tr');
    const jsonData = [];

    rows.forEach(row => {
        const rowData = {
            'รหัสประจำตัว': row.querySelector('td:nth-child(1)').textContent,
            'ชื่อ': row.querySelector('td:nth-child(2)').textContent,
            'สัปดาห์ 1': row.querySelector('td:nth-child(3)').textContent,
            'สัปดาห์ 2': row.querySelector('td:nth-child(4)').textContent,
            'สัปดาห์ 3': row.querySelector('td:nth-child(5)').textContent,
            'สัปดาห์ 4': row.querySelector('td:nth-child(6)').textContent
        };
        jsonData.push(rowData);
    });

    const jsonString = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "student_attendance.json");
    document.body.appendChild(link);
    link.click();
}
