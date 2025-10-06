
let processes = [];
let resources = [];
let allocation = {}; // {processId: [resourceIds]}
let requests = {};   // {processId: [requestedResourceIds]}

function addProcess() {
  let pid = 'P' + (processes.length + 1);
  processes.push(pid);
  allocation[pid] = [];
  requests[pid] = [];
  updateDisplay();
}

function addResource() {
  let rid = 'R' + (resources.length + 1);
  resources.push(rid);
  updateDisplay();
}

function requestResource() {
  if (processes.length === 0 || resources.length === 0) return alert("Add processes and resources first!");
  let p = processes[Math.floor(Math.random() * processes.length)];
  let r = resources[Math.floor(Math.random() * resources.length)];
  if (!allocation[p].includes(r) && !requests[p].includes(r)) requests[p].push(r);
  updateDisplay();
}

function releaseResource() {
  if (processes.length === 0) return alert("Add a process first!");
  let p = processes[Math.floor(Math.random() * processes.length)];
  if (allocation[p].length === 0) return alert(p + " has no resources to release!");
  allocation[p].pop();
  updateDisplay();
}

function checkDeadlock() {
  let deadlocked = false;
  // Simple prevention: check circular wait simulation
  for (let p of processes) {
    for (let r of requests[p]) {
      // if resource is allocated to someone else, potential deadlock
      for (let other of processes) {
        if (other !== p && allocation[other].includes(r)) deadlocked = true;
      }
    }
  }
  if (deadlocked) alert("Deadlock prevented! Resource allocation denied.");
  else {
    // allocate requested resources
    for (let p of processes) {
      requests[p].forEach(r => {
        if (!resources.includes(r)) return;
        allocation[p].push(r);
      });
      requests[p] = [];
    }
    updateDisplay();
  }
}

function updateDisplay() {
  let procHTML = processes.map(p => {
    let className = allocation[p].length > 0 ? 'allocated' : (requests[p].length > 0 ? 'waiting' : '');
    return `<div class="process ${className}">${p}<br>Allocated: ${allocation[p].join(', ') || '-'}</div>`;
  }).join('');
  document.getElementById('process-container').innerHTML = procHTML;

  let resHTML = resources.map(r => `<div class="resource">${r}</div>`).join('');
  document.getElementById('resource-container').innerHTML = resHTML;

  // Allocation Table
  let table = '<table><tr><th>Process</th><th>Allocated Resources</th><th>Requested Resources</th></tr>';
  processes.forEach(p => {
    table += `<tr><td>${p}</td><td>${allocation[p].join(', ') || '-'}</td><td>${requests[p].join(', ') || '-'}</td></tr>`;
  });
  table += '</table>';
  document.getElementById('allocation-table').innerHTML = table;
}