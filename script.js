const bookContainer = document.getElementById("bookContainer");
const searchBtn = document.getElementById("#search"); // Search Library
const addButton = document.getElementById("add");
const addDialog = document.getElementById("addBookDialog"); // Add book popup form
let myLibrary = [];

// Add Form Stuff
const submitButton = document.getElementById("confirmBtn");
const bookGenreDropdown = document.getElementById("genre");
let newBookGenre = bookGenreDropdown.value;
let newCoverImg = document.querySelector("#cover");
const newBookCommentsTextarea = document.getElementById("comments");
let newBookComments;

// Add Form Event Listeners
bookGenreDropdown.addEventListener("change", (e) => {
    newBookGenre = bookGenreDropdown.value;
});

newBookCommentsTextarea.addEventListener("change", (e) => {
    newBookComments = newBookCommentsTextarea.value;
});

addButton.addEventListener("click", () => {
    addDialog.showModal();
});

submitButton.addEventListener("click", async (e) => { // Add new book event
    let newBookTitle = document.getElementById("title").value;
    let newBookAuthor = document.getElementById("author").value;

    e.preventDefault();
    console.log(newCoverImg);
    let imageURL;

    function readFileAsDataURL(file) {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => resolve(fileReader.result);
            fileReader.onerror = (error) => reject(error);
        });
    }

    if (newCoverImg.files && newCoverImg.files[0]) {
        try {
            imageURL = await readFileAsDataURL(newCoverImg.files[0]);
            console.log(imageURL);
        } catch (error) {
            console.error('Error reading file:', error);
            imageURL = "bookCovers/Default.jpg"; // Use default image in case of an error
        }
    } else {
        imageURL = "bookCovers/Default.jpg";
    }
    
    const newEntry = new Book(newBookTitle, newBookAuthor, newBookGenre, newBookComments, imageURL, "", "", "");
    myLibrary.push(newEntry);
    createBookCard(myLibrary[myLibrary.length - 1]);
    console.log(myLibrary[myLibrary.length-1]);
    addDialog.close();
});

function Book(title, author, genre, comments, cover, rating, favorite, finished) {
    this.title = title;
    this.author = author;
    this.genre = genre;
    this.comments = comments;
    this.cover = cover;
    this.rating = rating;
    this.favorite = favorite;
    this.finished = finished;
    this.added = new Date();
}

myLibrary = demoLibrary.map( // Src scriptDemo
    (book) =>
        new Book(
            book.title,
            book.author,
            book.genre,
            book.comments,
            book.cover,
            book.rating,
            book.favorite,
            book.finished,
        ) );

// POPULATE BOOK CARD AND INDIVIDUAL BUTTON EVENTS
function createBookCard(book) {
    const bookCard = document.createElement("div");
    bookCard.classList.add("book");
    
    // Favorite Button
    let buttonDiv = document.createElement("div");
    buttonDiv.classList.add("buttonsDiv");
    let favorite = book.favorite;
    buttonDiv.append(isFavorite(favorite));

    // Finished Button
    let finished = book.finished;
    let returnedFinishedButton = isFinished(finished);
    buttonDiv.append(returnedFinishedButton);
    const readBanner = document.createElement("div");
    readBanner.classList.add("readBanner");

    if (finished == "Yes") {
        readBanner.classList.add("finished");
        bookCard.appendChild(readBanner);
    }

    returnedFinishedButton.addEventListener("click", () =>{
        if (readBanner.classList.contains('finished')) {
            readBanner.classList.remove("finished");
        } else {
            readBanner.classList.add("finished");
            bookCard.appendChild(readBanner);
        }
    });

    // Trash Button
    let trashButton = document.createElement('button');
    trashButton.classList.add('trashButton');
    trashButton.setAttribute('id', 'trashButton');
    let trashIcon = document.createElement('img');
    trashIcon.src = "trash.svg";
    trashButton.appendChild(trashIcon);
    buttonDiv.append(trashButton);

    trashButton.addEventListener("click", () => {
        deleteBook(trashButton);
    })

    // Comment Button
    let commentButton = document.createElement('button');
    commentButton.classList.add('commentButton');
    commentButton.setAttribute('id', 'commentButton');
    let commentIcon = document.createElement('img');
    commentIcon.src= "comments.svg";
    commentButton.appendChild(commentIcon);
    buttonDiv.append(commentButton);

    commentButton.addEventListener('click', () => {
        const commentTitle = document.getElementById('bookTitleComments');
        const savedComment = document.getElementById('savedComment');
        commentTitle.innerHTML = "Comments for <i>" + book.title + "</i>";
        savedComment.value = book.comments;
        bookCommentsDialog.showModal();


        editComment.addEventListener("click", () => {
            const savedComment = document.getElementById('savedComment');
            book.comments = savedComment.value;
        })

    })


    bookCard.appendChild(buttonDiv);

    // Book Info
    let coverImg = document.createElement("img");
    coverImg.classList.add("coverImg");
    coverImg.src = book.cover;
    bookCard.appendChild(coverImg);

    let title = document.createElement("p");
    title.innerHTML = book.title;
    title.classList.add("title");
    bookCard.appendChild(title);

    let author = document.createElement("p");
    author.innerHTML = book.author;
    author.classList.add("author");
    bookCard.appendChild(author);

    let genreBanner = document.createElement("div");
    genreBanner.classList.add("banner");
    let genreText = document.createElement("p");
    genreText.innerHTML = book.genre;
    genreBanner.appendChild(genreText);
    bookCard.appendChild(genreBanner);

    let stars = document.createElement("div");
    stars.classList.add("starRating");
    let rating = parseFloat(book.rating);
    stars.appendChild(addStarRating(rating));
    bookCard.appendChild(stars);

    let addedDate = document.createElement("p");
    addedDate.classList.add("addedDate");
    addedDate.innerHTML = "Added " + book.added.toLocaleDateString();
    bookCard.appendChild(addedDate);

    bookContainer.appendChild(bookCard);
}







const commentClose = document.getElementById("closeBtn");
const commentDialog = document.getElementById("bookCommentsDialog");

const editComment = document.getElementById("editBtn");

commentClose.addEventListener("click", () => {
    bookCommentsDialog.close();
})












function addStarRating(rating) {
    let starDiv = document.createElement("div");
    let decimal = rating - Math.floor(rating);

    for (var i = 0; i < parseInt(rating); i++) {
        starDiv.innerHTML += '<img src="fullStar.svg" />';
    }

    if (decimal >= 0.5) {
        starDiv.innerHTML += '<img src="halfStar.svg" />';
    }

    let ratingText = document.createElement("p");
    ratingText.innerHTML = "(" + rating + ")";
    starDiv.appendChild(ratingText);
    return starDiv;
}

function isFavorite(favorite) {  
    const favoriteButton = document.createElement("button");
    favoriteButton.setAttribute("id", "favButton");
    favoriteButton.classList.add("favButton");

    const favButtonImg = document.createElement("img");

    if (favorite == "Yes") {
        favButtonImg.src = "fullHeart.svg";
           
    } else {
        favButtonImg.src = "halfHeart.svg";
    }
    favoriteButton.appendChild(favButtonImg);     

    favoriteButton.addEventListener("click", () => {
        if (favButtonImg.src.includes('fullHeart.svg')) {
            favButtonImg.src = "halfHeart.svg";
        } else {
            favButtonImg.src = "fullHeart.svg";
        }
    });

    return(favoriteButton);
}

function isFinished(finished) {
    const finishedButton = document.createElement("button");
    finishedButton.setAttribute("id", "finButton");
    finishedButton.classList.add("finButton");
    const finButtonImg = document.createElement("img");

    if (finished == "Yes") {
        finButtonImg.src = "closedBook.svg";
           
    } else {
        finButtonImg.src = "openBook.svg";
    }

    finishedButton.appendChild(finButtonImg);

    finishedButton.addEventListener("click", () => {
        if (finButtonImg.src.includes('openBook.svg')) {
            finButtonImg.src = "closedBook.svg";
        } else {
            finButtonImg.src = "openBook.svg";
        }
    });

    return(finishedButton);
}

function deleteBook(book) {
    book.parentNode.parentNode.remove();
}


for (var i = 0; i < myLibrary.length; i++) {
   createBookCard(myLibrary[i]); 
}

const searchLibrary = document.getElementById("searchBar");
searchLibrary.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    if (searchTerm != "") {
        for (let i = 0; i < bookContainer.childElementCount; i++) {
            bookContainer.children[i].style.display = 'none';
        }
    } else {
        for (let i = 0; i < bookContainer.childElementCount; i++) {
            bookContainer.children[i].style.display = 'flex';
        }
    }

    const results = myLibrary.filter (book => {
        const TitleLower = book.title.toLowerCase();
        const AuthorLower = book.title.toLowerCase();

        for (let i = 0; i < bookContainer.childElementCount; i++) {
            const childElement = bookContainer.children[i];
            const title = childElement.querySelector('.title').textContent.toLowerCase();
            const author = childElement.querySelector('.author').textContent.toLowerCase();
    
            // Check if either the title or author includes the search term
            if (title.includes(searchTerm) || author.includes(searchTerm)) {
                // Display the element if there is a match
                childElement.style.display = 'flex';
            }
            
        }


        //bookContainer.children[i].style.display = 'none';


        //return (TitleLower.includes(searchTerm) || AuthorLower.includes(searchTerm));
    })

    results.forEach(book => {
        // Find the DOM element that matches the book object
        const bookElement = document.querySelector(`div[data-book-id="${book.id}"]`);
        
        // Check if the element is found
        if (bookElement) {
            // Display the element
            bookElement.style.display = 'flex';
        }
    });
/*
    for (let i = 0; i < bookContainer.childElementCount; i++) {
        if (bookContainer.children[i].)
        bookContainer.children[i].style.display = 'none';
    }
*/
    console.log(results);
})