// Book data
let books = JSON.parse(localStorage.getItem("libraryBooks")) || [];


// Form elements
const bookForm = document.getElementById("bookForm");

const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const isbnInput = document.getElementById("isbn");
const categoryInput = document.getElementById("category");
const quantityInput = document.getElementById("quantity");

const bookIdInput = document.getElementById("bookId");

const tableBody = document.getElementById("bookTableBody");
const emptyMessage = document.getElementById("emptyMessage");

const submitBtn = document.getElementById("submitBtn");
const formTitle = document.getElementById("formTitle");


// Display books when page loads
displayBooks();


// CREATE / UPDATE
bookForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const title = titleInput.value.trim();
    const author = authorInput.value.trim();
    const isbn = isbnInput.value.trim();
    const category = categoryInput.value;
    const quantity = quantityInput.value;

    // Validation
    if (!title || !author || !isbn || !category || !quantity) {
        alert("Please fill all fields.");
        return;
    }

    if (quantity <= 0) {
        alert("Quantity must be greater than 0.");
        return;
    }


    // UPDATE
    if (bookIdInput.value !== "") {

        const id = Number(bookIdInput.value);

        const book = books.find(book => book.id === id);

        if (book) {

            book.title = title;
            book.author = author;
            book.isbn = isbn;
            book.category = category;
            book.quantity = quantity;

            alert("Book updated successfully.");
        }

        cancelEdit();

    }

    // CREATE
    else {

        // Check duplicate ISBN
        const duplicate = books.some(book => book.isbn === isbn);

        if (duplicate) {
            alert("ISBN already exists.");
            return;
        }

        const newBook = {

            id: books.length > 0
                ? Math.max(...books.map(book => book.id)) + 1
                : 1,

            title: title,
            author: author,
            isbn: isbn,
            category: category,
            quantity: quantity
        };

        books.push(newBook);

        alert("Book added successfully.");

        bookForm.reset();
    }


    saveBooks();
    displayBooks();

});


// READ - Display Books
function displayBooks(bookList = books) {

    tableBody.innerHTML = "";

    if (bookList.length === 0) {

        emptyMessage.style.display = "block";

        return;
    }

    emptyMessage.style.display = "none";


    bookList.forEach(book => {

        const row = document.createElement("tr");

        row.innerHTML = `

            <td>${book.id}</td>

            <td>${book.title}</td>

            <td>${book.author}</td>

            <td>${book.isbn}</td>

            <td>${book.category}</td>

            <td>${book.quantity}</td>

            <td>

                <button
                    class="edit-btn"
                    onclick="editBook(${book.id})">
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteBook(${book.id})">
                    Delete
                </button>

            </td>
        `;

        tableBody.appendChild(row);

    });

}


// EDIT
function editBook(id) {

    const book = books.find(book => book.id === id);

    if (!book) {
        return;
    }


    bookIdInput.value = book.id;

    titleInput.value = book.title;
    authorInput.value = book.author;
    isbnInput.value = book.isbn;
    categoryInput.value = book.category;
    quantityInput.value = book.quantity;


    formTitle.textContent = "Edit Book";

    submitBtn.textContent = "Update Book";

    document.querySelector(".form-section")
        .scrollIntoView({
            behavior: "smooth"
        });

}


// CANCEL EDIT
function cancelEdit() {

    bookForm.reset();

    bookIdInput.value = "";

    formTitle.textContent = "Add New Book";

    submitBtn.textContent = "Add Book";

}


// DELETE
function deleteBook(id) {

    const book = books.find(book => book.id === id);

    if (!book) {
        return;
    }


    const confirmation = confirm(
        `Are you sure you want to delete "${book.title}"?`
    );


    if (confirmation) {

        books = books.filter(book => book.id !== id);

        saveBooks();

        displayBooks();

        alert("Book deleted successfully.");
    }

}


// SEARCH
function searchBooks() {

    const searchText =
        document.getElementById("searchInput")
        .value
        .toLowerCase();


    const filteredBooks = books.filter(book =>

        book.title.toLowerCase().includes(searchText) ||

        book.author.toLowerCase().includes(searchText) ||

        book.isbn.toLowerCase().includes(searchText)

    );


    displayBooks(filteredBooks);

}


// Save data to localStorage
function saveBooks() {

    localStorage.setItem(
        "libraryBooks",
        JSON.stringify(books)
    );

}
