const btn = document.querySelector("btnAdd");
const ul = document.querySelector("ul");

let items_db = JSON.parse(localStorage.getItem("ex_items"));
let current_title = undefined;
let current_url = undefined;

btn.addEventListener("click", () => {
  if (items_db) {
    localStorage.setItem(
      "ex_items",
      JSON.stringify([
        ...items_db,
        { name: current_title.substr(0, 50), url: current_url }
      ])
    );
  } else {
    localStorage.setItem(
      "ex_items",
      JSON.stringify([{ name: current_title.substr(0, 50), url: current_url }])
    );
  }
});

const loadItems = (firstTime = false) => {
  if (firstTime) {
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true
      },
      function (tabs){
        var tabURL = tabs[0].url;
        var tabTitle = tabs[0].title;

        current_title = tabTitle;
        current_url = tabURL;
      }
    );
  }
  ul.innerHTML = "";
  items_db = JSON.parse(localStorage.getItem("ex_items"));

  if (items_db) {
    items_db.forEach((item, i) => {
      const li = document.createElement("li");
      li.innerText = `
      <div>
        <span class="name">${item.name}</span>
        <a href="${item.url}" target="_blank">${item.url}</a>
        <button class="btnRemover"${i}">Remover</button>
        <hr />
      </div>
    `;
      ul.appendChild(li);
    });
  }
  document.querySelectorAll(".btnRemover").forEach((item, i) => {
    item.addEventListener("click", () => {
      removeItem(i);
    });
  });
};

function removeItem(i) {
  items_db.splice(i, 1);
  localStorage.setItem("ex_items", JSON.stringify(items_db));
  loadItems();
}

loadItems(true);
