import "/style.scss";
import users from "/users.json";

console.log(users);

const app = document.getElementById("app");
let searchQuery = "";
let selectedRole = "all";
let perPage = 5;
let currentPage = 1;

const filterUsers = () => {
  // filtre role
  let filteredUsers = users;
  if (selectedRole !== "all") {
    filteredUsers = users.filter((user) => user.role === selectedRole);
  }

  // filtre recherche
  if (searchQuery !== "") {
    filteredUsers = filteredUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  const start = (currentPage - 1) * perPage;
  const end = Math.min(start + perPage, filteredUsers.length - 1);
  const nbrPages = Math.ceil(filteredUsers.length / perPage);

  filteredUsers = filteredUsers.slice(start, end);

  renderTableBody(filteredUsers);
  renderPagination(nbrPages);
};

const renderTableBody = (users) => {
  let tableHtml = "";
  if (users.length > 0) {
    tableHtml = users
      .map((user) => {
        return `
        <tr>
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td>${user.role}</td>
        </tr>
        `;
      })
      .join("");
  } else {
    tableHtml = `
      <tr>
        <td colspan="3" class="text-center">Aucun utilisateur ne répond à vos critères de recherche</td>
      </tr>
    `;
  }

  document.querySelector("tbody").innerHTML = tableHtml;
};

app.innerHTML = `
    <div class="container mx-auto">
      <div class="row">
        <div class="mb-3 col">
          <label for="input-search" class="form-label">Recherche</label>
          <input type="search" class="form-control" id="input-search" placeholder="...">
        </div>
        <div class="mb-3 col">
          <label for="input-filtre" class="form-label">Filtre</label>
          <select class="form-select" id="input-filtre">
            <option value="all" selected>Selectionnez un filtre</option>
            <option value="utilisateur">Utilisateurs</option>
            <option value="admin">Administrateurs</option>
          </select>
        </div>
        <div class="mb-3 col">
          <label for="input-pagination" class="form-label">Par page</label>
          <select class="form-select" id="input-pagination">
            <option value="5" selected>5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </div>
      </div>
      <table class="table table-striped border">
        <thead>
          <tr>
            <th scope="col">Nom</th>
            <th scope="col">Email</th>
            <th scope="col">Rôle</th>
          </tr>
        </thead>
        <tbody>
        </tbody>
      </table>
      <nav aria-label="Page navigation example">
        <ul id="pagination" class="pagination">
        </ul>
      </nav>
    </div>
    `;

const renderPagination = (nbrPages) => {
  let paginationHtml = `<li class="page-item"><button id="pagination-previous" class="page-link">Previous</button></li>`;

  for (let i = 1; i <= nbrPages; i++) {
    paginationHtml += `<li class="page-item"><button class="page-link">${i}</button></li>`;
  }

  paginationHtml += `<li class="page-item"><button id="pagination-next" class="page-link">Next</button></li>`;

  document.querySelector("#pagination").innerHTML = paginationHtml;

  document
    .querySelector("#pagination-previous")
    .addEventListener("click", () => {
      currentPage = Math.max(currentPage - 1, 1);
      filterUsers();
    });

  document.querySelector("#pagination-next").addEventListener("click", () => {
    currentPage = Math.min(currentPage + 1, nbrPages);
    filterUsers();
  });
};

const searchInput = document.querySelector("#input-search");
searchInput.addEventListener("input", () => {
  searchQuery = searchInput.value;
  filterUsers();
});

const filtreSelect = document.querySelector("#input-filtre");
filtreSelect.addEventListener("change", () => {
  selectedRole = filtreSelect.value;
  filterUsers();
});

const parPageSelect = document.querySelector("#input-pagination");
parPageSelect.addEventListener("change", () => {
  perPage = parseInt(parPageSelect.value);
  currentPage = 1;
  filterUsers();
});

filterUsers();
