// Book Class: Represent a Book
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI Class: Handle UI Tasks
class UI {
    static displayBooks() {
        const books = Store.getBooks();

        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list');
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        list.appendChild(row);
    }

    static deleteBook(target) {
        if (target.classList.contains('delete')) {
            target.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        // Create alert
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));

        // Insert alert in the DOM
        const container = document.querySelector('.container');
        const form = document.querySelector('#form-section');
        container.insertBefore(div, form);

        // Vanish in 3 Seconds
        setTimeout(() => { div.remove() }, 3000);
    }

    static clearFields() {
        document.querySelector('#book-form').reset();
    }
}

// Store Class: Handles Storages
class Store {
    static getBooks() {
        let books;

        if (!localStorage.getItem('books')) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBook(book) {
        const books = this.getBooks(); // Get current books from localStorage

        books.push(book); // Push new book

        localStorage.setItem('books', JSON.stringify(books)); // Update the books
    }

    static removeBook(isbn) {
        const books = this.getBooks(); // Get current books from localStorage

        // Remove book by isbn
        books.forEach((book, index) => {
            if (book.isbn == isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books)); // Update the books
    }
}


// Event: Display Book
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event: Add a Book
document.querySelector('#book-form').addEventListener('submit', (e) => {
    // Prevent defualt submit
    e.preventDefault();

    // Get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    // Validate values
    if (title === '' || author === '' || isbn === '') {
        // Show danger message
        UI.showAlert('Please fill in all fields', 'danger');
    } else {
        // Instatiate book
        const book = new Book(title, author, isbn);

        // Add book to UI
        UI.addBookToList(book);

        // Add book to localStorage
        Store.addBook(book);

        // Show success message
        UI.showAlert('Book Added!', 'success');

        // Clear input fields
        UI.clearFields();
    }
})

// Event: Remove a Book
document.querySelector('#book-list').addEventListener('click', (e) => {
    // Remove book from UI
    UI.deleteBook(e.target);

    // Remove book from localStorage
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    // Show success message
    UI.showAlert('Book Removed!', 'success');
})