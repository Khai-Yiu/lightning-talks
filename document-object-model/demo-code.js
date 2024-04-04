// Traversal
function printTree(node, spacing) {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent.trim();
    if (text !== "") {
      console.log(`${spacing}${text}`);
    }
  } else {
    console.log(`${spacing}<${node.nodeName.toLowerCase()}>`);
    if (node.firstChild) {
      printTree(node.firstChild, spacing + "    ");
    }

    console.log(`${spacing}</${node.nodeName.toLowerCase()}>`);
  }

  if (node.nextSibling) {
    printTree(node.nextSibling, spacing);
  }
}

printTree(document.documentElement, "");

// Events
function handleClick(event) {
  console.log(`Clicked on ${event.currentTarget}`);
}

const capture = false;
const divElement = document.querySelector("div");
const btnElement = document.querySelector("button");

document.addEventListener("mousedown", handleClick, capture); // Document
document.documentElement.addEventListener("mousedown", handleClick, capture); // <html>
document.body.addEventListener("mousedown", handleClick, capture); // <body>
divElement.addEventListener("mousedown", handleClick, capture); // <div>
btnElement.addEventListener("mousedown", handleClick, capture); // <button>

// InnerHTML
document.body.innerHTML = "<img src='img' onerror=alert('Injected!')>";

// Batch
const parent = document.getElementById("wrapper");
const fragment = document.createDocumentFragment();

for (let i = 0; i < 100; i++) {
  const newButton = document.createElement("button");
  newButton.textContent = `Button ${i}`;
  fragment.appendChild(newButton);
}

parent.appendChild(fragment);

// Dynamic
const buttonList = document.getElementsByTagName("button");

for (const button of buttonList) {
  button.addEventListener("click", (event) => alert(event.target.textContent));
}

const parent = document.getElementById("wrapper");

// Dynamic pt. 2
parent.addEventListener("click", (event) => {
  if (event.target.tagName === "BUTTON") {
    alert(event.target.textContent);
  }
});
