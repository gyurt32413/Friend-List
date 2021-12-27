const BASE_URL = "https://lighthouse-user-api.herokuapp.com"
const INDEX_URL = BASE_URL + "/api/v1/users/"

const dataPanel = document.querySelector("#data-panel")
const modalContent = document.querySelector(".modal-content")
const searchButton = document.querySelector("#search-button")
const searchColumn = document.querySelector("#search-column")
const pagination = document.querySelector(".pagination")




let friendList = JSON.parse(localStorage.getItem('favorite'))
console.log(friendList)


//render friend list
function renderFriendList(arr) {
  let content = "";
  arr.forEach((element) => {
    content += `
      <div class="card mb-2" style="width: 10rem;" data-bs-toggle="modal" data-bs-target="#friend-modal" data-id=${element.id} >
        <img src="${element.avatar}" class="card-img-top" alt="friend-avatar" data-id=${element.id}>
        <p class="card-title" data-id=${element.id}>${element.name} ${element.surname}</p>
      </div>
    `
  })
  dataPanel.innerHTML = content;
}

//render card modal
function renderCardModal(ID) {
  let content = ''
  axios.get(INDEX_URL + ID).then((response) => {
    const data = response.data
    content = `
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">${data.name} ${data.surname}</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body d-flex justify-content-around align-items-center">
        <img class="modal-avatar" src="${data.avatar}" alt="modal-avatar">
        <div class="modal-information ">
          <p class="modal-friend-email">email: ${data.email}</p>
          <p class="modal-friend-gender">gender: ${data.gender}</p>
          <p class="modal-friend-age">age: ${data.age}</p>
          <p class="modal-friend-region">region: ${data.region}</p>
          <p class="birthday">birthday: ${data.birthday}</p>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" >Close</button>
        <button type="button" class="btn btn-primary" data-id="${ID}">Remove favorite</button>
      </div>
    `
    modalContent.innerHTML = content
  })
}

//get card ID
dataPanel.addEventListener('click', function getCardID(element) {
  renderCardModal(Number(element.target.dataset.id))
})

//search friends
searchButton.addEventListener('click', function getFriendName(event) {
  event.preventDefault()

  const inputName = searchColumn.value.toLowerCase().trim()
  let filterFriendList = []
  friendList.forEach((element) => {
    const name = element.name.toLowerCase()
    const surname = element.surname.toLowerCase()
    if (name.includes(inputName) || surname.includes(inputName)) {
      filterFriendList.push(element)
    }
  })
  if (filterFriendList.length != 0) {
    renderFriendList(filterFriendList)
  } else {
    alert('找不到此朋友')
  }
})

// pagination
function renderPageNumber(numberOfPeople) {
  const totalPage = Math.ceil(numberOfPeople / 32)
  let content = ''
  for (i = 1; i <= totalPage; i++) {
    content += `<li class="page-item"><a class="page-link" href="#" data-id=${i}>${i}</a></li>`

  }
  pagination.innerHTML = content
}

function renderPagination(page) {
  let startedIndex = 32 * (page - 1)
  let endedIndex = (32 * page)
  let pagination = friendList.slice(startedIndex, endedIndex)
  renderFriendList(pagination)

}

pagination.addEventListener('click', (event) => {
  const dataId = Number(event.target.dataset.id)
  renderPagination(dataId)
})


// remove from favorite
modalContent.addEventListener('click', (element) => {
  const dataID = element.target.dataset.id

  if (element.target.className === 'btn btn-primary') {
    //找到要刪掉的index
    const deletedID = friendList.findIndex((element) => element.id == dataID)
    //從清單移除
    friendList.splice(deletedID, 1)
    //重新渲染
    renderFriendList(friendList)
    //更新localStorage
    localStorage.setItem('favorite', JSON.stringify(friendList))
  }
})


renderFriendList(friendList)
renderPageNumber(friendList.length)
renderPagination(1)





