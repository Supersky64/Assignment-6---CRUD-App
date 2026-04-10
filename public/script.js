// =====================
// RANDOM JOKE (endpoint 3)
// =====================
async function loadRandomJoke() {
    const res = await fetch('/jokebook/random');
    const data = await res.json();

    document.getElementById("randomJoke").innerHTML =
        `${data.setup} — ${data.delivery}`;
}

document.getElementById("randomBtn").addEventListener("click", loadRandomJoke);

// load random joke on landing page automatically
window.onload = loadRandomJoke;


// =====================
// LOAD CATEGORIES (endpoint 1)
// =====================
document.getElementById("loadCategoriesBtn").addEventListener("click", async () => {
    const res = await fetch('/jokebook/categories');
    const data = await res.json();

    const list = document.getElementById("categoryList");
    list.innerHTML = "";

    data.forEach(cat => {
        const li = document.createElement("li");
        li.textContent = cat.name;

        // clicking category loads jokes (endpoint 2)
        li.addEventListener("click", () => loadJokes(cat.name));

        list.appendChild(li);
    });
});


// =====================
// SEARCH CATEGORY (endpoint 2)
// =====================
document.getElementById("searchBtn").addEventListener("click", () => {
    const category = document.getElementById("searchInput").value.trim();
    if (category) loadJokes(category);
});


// function to load jokes by category
async function loadJokes(category) {
    const res = await fetch(`/jokebook/category/${category}`);
    const data = await res.json();

    const jokesDiv = document.getElementById("jokes");
    jokesDiv.innerHTML = `<h3>${category}</h3>`;

    if (data.error) {
        jokesDiv.innerHTML += `<p style="color:red">${data.error}</p>`;
        return;
    }

    data.forEach(j => {
        jokesDiv.innerHTML += `<p>${j.setup} — ${j.delivery}</p>`;
    });
}


// =====================
// ADD JOKE (endpoint 4)
// =====================
document.getElementById("addBtn").addEventListener("click", async () => {
    const category = document.getElementById("catInput").value.trim();
    const setup = document.getElementById("setupInput").value.trim();
    const delivery = document.getElementById("deliveryInput").value.trim();

    if (!category || !setup || !delivery) {
        alert("All fields are required!");
        return;
    }

    const res = await fetch('/jokebook/joke/add', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ category, setup, delivery })
    });

    const data = await res.json();

    if (data.error) {
        alert(data.error);
        return;
    }

    // After success → show updated jokes in that category
    loadJokes(category);

    // optional: clear form
    document.getElementById("catInput").value = "";
    document.getElementById("setupInput").value = "";
    document.getElementById("deliveryInput").value = "";
});