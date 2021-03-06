const createButton = document.querySelector('.create-button');
const submitIdeaButton = document.querySelector('.idea-submit');
const ideaForm = document.querySelector('.idea-form');
const API_URL = 'http://ec2-3-128-188-26.us-east-2.compute.amazonaws.com/ideas';
// const API_URL = 'http://localhost:443/ideas';
const delayInMilliseconds = 200;

const listIdeas = () => {
  clearIdeas();

  fetch(API_URL, { headers: { 'Access-Control-Allow-Origin': '*' } })
    .then((res) => res.json())
    .then((ideas) => {
      ideas.forEach((idea) => {
        const category = idea.category;
        const parentElementId = `#idea-content-${category}`;
        const parentElement = document.querySelector(parentElementId);
        const ideaElement = createIdeaElement(idea);
        parentElement.appendChild(ideaElement);
      });
    });
};

const clearIdeas = () => {
  const containers = document.getElementsByClassName('idea-content');
  for (let container of containers) {
    container.innerHTML = '';
  }
};

const createIdeaElement = (idea) => {
  const parentContainer = document.createElement('div');
  const editButton = document.createElement('i');
  const submitEditButton = document.createElement('i');
  const ideaParagraph = document.createElement('p');
  const editTextArea = document.createElement('textarea');
  const cancelButton = document.createElement('i');
  const deleteButton = document.createElement('i');

  parentContainer.classList = 'single-idea';
  editButton.classList = 'edit-button fas fa-edit';
  submitEditButton.classList = 'submit-edit-button fas fa-check';
  ideaParagraph.classList = 'idea-text';
  editTextArea.classList = 'edit-idea-textarea';
  cancelButton.classList = 'cancel-edit-button fas fa-times';
  deleteButton.classList = 'delete-button fas fa-trash-alt';

  ideaParagraph.textContent = idea.idea;

  editButton.addEventListener('click', (event) => {
    const ideaTextValue = ideaParagraph.innerText;

    editTextArea.value = ideaTextValue;
    editButton.style.fontSize = deleteButton.style.fontSize = '0px';
    submitEditButton.style.fontSize = cancelButton.style.fontSize = '20px';
    editTextArea.style.display = 'block';
    ideaParagraph.style.display = 'none';
  });

  deleteButton.addEventListener('click', (event) => {
    const idea = ideaParagraph.innerText;
    const password = prompt('Please enter the password to change the text');

    fetch(API_URL, {
      method: 'DELETE',
      body: JSON.stringify({
        idea,
        password,
      }),
      headers: {
        'content-type': 'application/json',
      },
    }).then((res) => {
      setTimeout(listIdeas, delayInMilliseconds);
    });
  });

  submitEditButton.addEventListener('click', (event) => {
    const originalIdea = ideaParagraph.innerText;
    const editedIdea = editTextArea.value;
    const password = prompt('Please enter the password to change the text');

    fetch(API_URL, {
      method: 'PUT',
      body: JSON.stringify({
        originalIdea,
        editedIdea,
        password,
      }),
      headers: {
        'content-type': 'application/json',
      },
    }).then((res) => {
      setTimeout(listIdeas, delayInMilliseconds);
    });
  });

  cancelButton.addEventListener('click', (event) => {
    editTextArea.value = '';
    editButton.style.fontSize = deleteButton.style.fontSize = '20px';
    submitEditButton.style.fontSize = cancelButton.style.fontSize = '0px';
    editTextArea.style.display = 'none';
    ideaParagraph.style.display = 'block';
  });

  parentContainer.appendChild(editButton);
  parentContainer.appendChild(submitEditButton);
  parentContainer.appendChild(ideaParagraph);
  parentContainer.appendChild(editTextArea);
  parentContainer.appendChild(cancelButton);
  parentContainer.appendChild(deleteButton);

  return parentContainer;
};

createButton.addEventListener('click', (event) => {
  createButton.style.display = 'none';
  ideaForm.style.display = 'inline-block';
});

submitIdeaButton.addEventListener('click', (event) => {
  event.preventDefault();
  const categoryWarning = document.querySelector('.no-category-warning');
  const formData = new FormData(ideaForm);
  const idea = formData.get('idea');
  const category = formData.get('category');
  const password = formData.get('password');

  if (!category) {
    categoryWarning.style.display = 'block';
  } else {
    fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({
        idea,
        category,
        password,
      }),
      headers: {
        'content-type': 'application/json',
      },
    }).then((res) => {
      setTimeout(listIdeas, delayInMilliseconds);
    });

    createButton.style.display = 'inline-block';
    ideaForm.style.display = categoryWarning.style.display = 'none';
    ideaForm.reset();
  }
});

listIdeas();
