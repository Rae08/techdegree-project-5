const gallery = document.querySelector('.gallery');
const body = document.querySelector('body');
// stores the original data set
let originalDataArray = [];

// stores the data that is being used to toggle through the modal on the page;
let currentDataArray = originalDataArray; 

// fetch data
fetch('https://randomuser.me/api/?inc=id,name,location,email,dob,cell,picture&results=12&nat=US')
  .then(response => response.json())
  .then(data => createDataArray(data))
  .then(modal => generateHTML(modal))
  .then(addSearch())

// takes the data from the API and stores it in the originalDataArray then returns the data;
  function createDataArray(data) {  
    originalDataArray.push(data.results);
    return originalDataArray[0];
  }

  // uses the data from the API to generate cards for each employee and then displays them on the page
  function generateHTML(data) {
    data.forEach(function(person, index) {
      const card = document.createElement('div');
      card.className = "card";
      card.id = `${person.id.value}`;
      let html = `
        <div class="card-img-container" id="${person.id.value}">
          <img class="card-img" id="${person.id.value}" src="${person.picture.large}" alt="profile picture">
        </div>
        <div class="card-info-container" id="${person.id.value}">
          <h3 id="${person.id.value}" class="card-name cap">${person.name.first} ${person.name.last}</h3>
          <p id="${person.id.value}" class="card-text">${person.email}</p>
          <p id="${person.id.value}" class="card-text cap">${person.location.city}</p>
        </div>
      `;
      card.innerHTML = html;
      gallery.appendChild(card);
    })

    // adds an event listener to the gallery, and if a card is clicked, opens the modal for the employee;
    let cards = document.querySelector('.gallery');
    cards.addEventListener('click', function() {
      if(event.target.className.startsWith('card')){
        let currentIndex;
        currentDataArray[0].forEach(function(person, index) {
          if (event.target.id === person.id.value) {
            currentIndex = index;
          }
        })
        
       openModal(currentDataArray[0], currentIndex);
      }
    })
  }

  // takes the data set and the index of the clicked employee
  // opens a modal box that contains the information for the employee clicked
  // adds event listeners for close, next and previous
  function openModal(data, index) {
  const modal = document.createElement('div');
  modal.className = "modal-container";
      
  let html = `
      <div class="modal">
      <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
      <div class="modal-info-container">
      </div>
      </div>
      <div class="modal-btn-container">
        <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
        <button type="button" id="modal-next" class="modal-next btn">Next</button>
        </div>
  `
  modal.innerHTML = html;
  body.appendChild(modal);
  let info = generateInfo(data[index], index);

  // event listener for the next button
  // if the next button is clicked, it populates the information for the next employee in the data set;
  // if the last employee in the data is clicked, the next button is disabled;
  const nextButton = document.querySelector('#modal-next');
    nextButton.addEventListener('click', function(){
      let nextIndex = parseInt(info) + 1;
      if(nextIndex +1  < data.length) {     
        info = generateInfo(data[nextIndex], nextIndex);
        if (prevButton.disabled) {
          prevButton.disabled = false;
        }
      } else {
        nextButton.disabled = true;
        info = generateInfo(data[nextIndex], nextIndex);
        if (prevButton.disabled) {
          prevButton.disabled = false;
        }
      }      
  })
  
  // event listener for the prev button
  // if the prev button is clicked, it populates the information for the prev employee in the data set;
  // if the first employee is shown, the prev button is disabled so that it cannot be clicked
  const prevButton = document.querySelector('#modal-prev');
    prevButton.addEventListener('click', function(){
      let prevIndex = parseInt(info) - 1;
      if(prevIndex -1 > 0) {
        info = generateInfo(data[prevIndex], prevIndex);
        if (nextButton.disabled) {
          nextButton.disabled = false;
        }
      } else {
        prevButton.disabled = true;
        info = generateInfo(data[prevIndex], prevIndex);
        if (nextButton.disabled) {
          nextButton.disabled = false;
        }
        
      }      
  })
  
  // event listener for the close button
  // if close is clicked, it removes the modal from the page
  const closeButton = document.querySelector('.modal-close-btn');
  closeButton.addEventListener('click', function() {
  body.removeChild(modal);
  })
  }

  // takes the data of the individual employee and the index
  // generates the information and displays it within the modal
  function generateInfo(data, index) {
    let birthday = data.dob.date.split('-');
    let formattedBirthday = birthday[1] + "/" + birthday[2][0] + birthday[2][1] + "/" + birthday[0][2] +birthday[0][3];

    const infoContainer = document.querySelector('.modal-info-container');

    let html = `<img class="modal-img" src="${data.picture.large}" alt="profile picture">
    <h3 id="name" class="modal-name cap">${data.name.first} ${data.name.last}</h3>
    <p class="modal-text">${data.email}</p>
    <p class="modal-text cap">${data.location.city}</p>
    <hr>
    <p class="modal-text">${data.cell}</p>
    <p class="modal-text">${data.location.street.number} ${data.location.street.name}, ${data.location.city}, ${data.location.state} ${data.location.postcode}</p>
    <p class="modal-text">Birthday: ${formattedBirthday}</p>`;

    infoContainer.innerHTML = html;
    return index;

  }

  // adds the search box to the page
  // takes the value entered into the box and on submit, searches the data set for matches
  // matches are found when the name contains any character(s) entered in the search field
  // if the employee does not match the search criteria it is hidden on the page
  // if the employee matches the criteria it is shown on the page and the employee object is added to the searchArray. The searchArray is then passed into currentDataArray so that if the employee is clicked, the modal box will toggle through ony the employees displayed on the page (found in the search)
  function addSearch() {
    const search = document.querySelector('.search-container');
    search.innerHTML = `<form action="#" method="get">
    <input type="search" id="search-input" class="search-input" placeholder="Search...">
    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>`

    const searchBox = document.querySelector('form');
    searchBox.addEventListener('submit', function() {
      let input = document.querySelector('#search-input').value.toLowerCase();
      let cards = document.querySelectorAll('.card h3');
      let searchArray = [];
      
      if (input === "") {
        cards.forEach(function(card, index) {
          if (input === "") {
            card.parentNode.parentNode.style.display = "flex";
            searchArray.push(originalDataArray[0][index])
          }
        })
      } else {
        cards.forEach(function(card, index) {
          let name = card.innerText.toLowerCase();
          let regEx = new RegExp(input);        
          if (regEx.test(name)) {
            card.parentNode.parentNode.style.display = "flex";
            searchArray.push(originalDataArray[0][index])
          } else {
            card.parentNode.parentNode.style.display = "none";
          }
        })
      }
      currentDataArray = [];
      currentDataArray.push(searchArray);
    })
 
  }

 