import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getDatabase, ref, onValue, update, set, push } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";
import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyAtW4JRXlSua9mz0sz2X5_npLQ1n5LCulU",
    authDomain: "foodfast-tfg.firebaseapp.com",
    databaseURL: "https://foodfast-tfg-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "foodfast-tfg",
    storageBucket: "foodfast-tfg.appspot.com",
    messagingSenderId: "208537691790",
    appId: "1:208537691790:web:0b9dc18fa501e884d38bdf",
    databaseURL: "https://foodfast-tfg-default-rtdb.europe-west1.firebasedatabase.app/"
};

const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);
const storage = getStorage(firebaseApp);

const dbRef = ref(database, 'kitchen/');
onValue(dbRef, (snapshot) => {
    const data = snapshot.val();

    const container = document.getElementById('card-container');
    container.innerHTML = '';

    // Si no hay pedidos, no se hará nada.
    if (data == null) {
        return;
    }

    Object.keys(data).forEach((key) => {
        const item = data[key];

        const card = document.createElement('div');
        card.classList.add('card');

        const title = document.createElement('h2');
        title.classList.add('card-title');
        title.textContent = "Mesa: " + item.tableId;

        const description = document.createElement('p');
        description.classList.add('card-description');
        description.setAttribute('style', 'margin-bottom: 15px;')
        description.textContent = "Nota: " + item.note;

        card.appendChild(title);
        card.appendChild(description);

        if (item.orders) {
            const ordersContainer = document.createElement('div');
            ordersContainer.classList.add('orders-container');

            Object.keys(item.orders).forEach((orderKey) => {
                const order = item.orders[orderKey];
                
                const orderContainer = document.createElement('div');
                orderContainer.classList.add('order-container');

                const itemImage = document.createElement('img');
                itemImage.classList.add('item-image');
                itemImage.setAttribute('src', order.item.image);
                orderContainer.appendChild(itemImage);

                const orderInfoContainer = document.createElement('div');
                orderInfoContainer.classList.add('order-info-container');

                const itemName = document.createElement('h3');
                itemName.textContent = "• " + order.item.name;
                orderInfoContainer.appendChild(itemName);

                const orderQuantity = document.createElement('p');
                orderQuantity.textContent = "Cantidad: " + order.quantity;
                orderInfoContainer.appendChild(orderQuantity)
                
                orderContainer.appendChild(orderInfoContainer)
                ordersContainer.appendChild(orderContainer)
            })

            card.appendChild(ordersContainer);
        }

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');

        const doneButton = document.createElement('button');
        doneButton.textContent = 'Hecho ✅';
        doneButton.classList.add('done-button');
        doneButton.addEventListener('click', function() {
            set(ref(database, 'kitchen/' + key), null); // Hacer un set null es lo mismo que borrar.
        })
        buttonContainer.appendChild(doneButton);
        card.appendChild(buttonContainer);

        container.appendChild(card);
    })
})

// SELECTOR DE ICONOS PARA LAS SECCIONES
var iconNumber = -1;
const iconButtons = document.getElementsByClassName("iconfood")
const iconArray = Array.from(iconButtons)
iconArray.forEach(function(button) {
    button.addEventListener("click", function () {
        iconNumber = button.getAttribute("alt")
        button.setAttribute("style", "background-color: #80ca85;")
        iconArray.forEach(function(button2) {
            if (button != button2) {
                button2.setAttribute("style", "background-color: white;")
            }
        })
        console.log("NUMERO ACTUAL " + iconNumber)
    });
});

// !!! SECCIONES !!!

// CREAMOS LAS CONSTANTES CON LOS MODALS (DIÁLOGOS)
const createSectionModal = document.querySelector("[create-section]");
const editSectionModal = document.querySelector("[edit-section]");
const deleteSectionModal = document.querySelector("[delete-section]");

// CREAMOS LAS CONSTANTES CON LOS ELEMENTOS DEL HTML A USAR
const submitAddSection = document.getElementById("submit_add_section")
const submitEditSection = document.getElementById("submit_edit_section")
const submitDeleteSection = document.getElementById("submit_delete_section")

const editSectionsButton = document.getElementById("li_edit_section")
const deleteSectionsButton = document.getElementById("li_delete_section")

const selectSection = document.getElementById("edit_section_select")
const selectDeleteSection = document.getElementById("delete_section_select")

// CREAR SECCIÓN -----------------------------
submitAddSection.addEventListener("click", function () {
    if (document.getElementById('add_section_name').value == "") {
        alert("Debes escribir un nombre antes de añadir la sección");
        return;
    }
    if (iconNumber == -1) {
        alert("Debes elegir un icono antes de añadir la sección");
        return;
    }

    manageSection(iconNumber, document.getElementById('add_section_name').value, null)
    document.getElementById('add_section_name').value = ""; // Limpiamos el campo de texto

    createSectionModal.close(); // Cerramos el cuadro de diálogo
})
// ---------------------------------------------

// EDITAR SECCIÓN -----------------------------
editSectionsButton.addEventListener("click", function () {
    selectSection.innerHTML = '';

    var defaultOption = document.createElement("option");
    defaultOption.value = -1;
    defaultOption.text = "Elige una sección...";
    selectSection.appendChild(defaultOption);

    const sectionsRef = ref(database, 'restaurant/sections_food')
    onValue(sectionsRef, (snapshot) => {
        const sectionData = snapshot.val();

        Object.keys(sectionData).forEach((sect) => {
            const section = sectionData[sect];

            var option = document.createElement("option");
            option.value = sect;
            option.text = section.sectionName;

            selectSection.appendChild(option);
        })
    })
})
selectSection.addEventListener("change", function () {
    iconNumber = -1;

    console.log(selectSection.options[selectSection.selectedIndex].value)
    if (selectSection.options[selectSection.selectedIndex].value == -1) {
        document.getElementById('edit_section_name').value = "";
        return
    }
    document.getElementById('edit_section_name').value = selectSection.options[selectSection.selectedIndex].text;
})
submitEditSection.addEventListener("click", function() {
    if (iconNumber == -1) {
        alert("Debes elegir un icono antes de añadir la sección");
        return;
    }
    if (document.getElementById('edit_section_name').value == "") {
        alert("El nombre no puede estar vacío");
        return;
    }

    manageSection(iconNumber, document.getElementById('edit_section_name').value, selectSection.options[selectSection.selectedIndex].value)
    document.getElementById('edit_section_name').value = "";

    editSectionModal.close();
})
// ---------------------------------------------

// BORRAR SECCIÓN -----------------------------
deleteSectionsButton.addEventListener("click", function () {
    selectDeleteSection.innerHTML = '';

    var defaultOption = document.createElement("option");
    defaultOption.value = -1;
    defaultOption.text = "Elige una sección...";
    selectDeleteSection.appendChild(defaultOption);

    const sectionsDeleteRef = ref(database, 'restaurant/sections_food')
    onValue(sectionsDeleteRef, (snapshot) => {
        const sectionDeleteData = snapshot.val();

        Object.keys(sectionDeleteData).forEach((sect) => {
            const sectionDelete = sectionDeleteData[sect];

            var option = document.createElement("option");
            option.value = sect;
            option.text = sectionDelete.sectionName;

            selectDeleteSection.appendChild(option);
        })
    })
})
submitDeleteSection.addEventListener("click", function() {
    var deleteSectionKey = selectDeleteSection.options[selectDeleteSection.selectedIndex].value;
    if (deleteSectionKey == -1) {
        alert("Elige una sección a eliminar");
        return;
    }
    set(ref(database, 'restaurant/sections_food/' + deleteSectionKey), null);
    alert("La sección ha sido borrada.")
    deleteSectionModal.close();
})

// FUNCIÓN DE SECCIÓN (Tanto crear como editar)
function manageSection(iconIndex, nameSection, refKey) {

    const finalIndex = parseInt(iconIndex);
    var iconname = "foodicon_";
    switch (finalIndex) {
        case 0:
            iconname += "beer";
            break;
        case 1:
            iconname += "cafe";
            break;
        case 2:
            iconname += "cake";
            break;
        case 3:
            iconname += "croissant";
            break;
        case 4:
            iconname += "drink";
            break;
        case 5:
            iconname += "fish";
            break;
        case 6:
            iconname += "hamburger";
            break;
        case 7:
            iconname += "icecream";
            break;
        case 8:
            iconname += "liquor";
            break;
        case 9:
            iconname += "pizza";
            break;
        case 10:
            iconname += "ramen";
            break;
        default:
            iconname += "ramen";
    }
    if (refKey == null) {
        push(ref(database, 'restaurant/sections_food'), {
            sectionIcon: iconname,
            sectionName: nameSection
        });
        alert("¡Se ha añadido la nueva sección!")
        return;
    }
    set(ref(database, 'restaurant/sections_food/' + refKey), {
        sectionIcon: iconname,
        sectionName: nameSection
    });
    alert("¡Se ha editado la sección!")
}

// !!! PRODUCTOS !!!

// Iniciamos los modals y elementos
const createProductModal = document.querySelector("[create-product]");
const editProductModal = document.querySelector("[edit-product]");
const deleteProductModal = document.querySelector("[delete-product]");

const submitAddProduct = document.getElementById("submit_add_product");
const submitEditProduct = document.getElementById("submit_edit_product");
const submitDeleteProduct = document.getElementById("submit_delete_product");

const selectEditProduct = document.getElementById("edit_product_select");
const selectDeleteProduct = document.getElementById("delete_product_select");

const selectMoveProduct = document.getElementById("move_products_select");
const selectMoveSection = document.getElementById("move_sections_select");

const editProductButton = document.getElementById("li_edit_product");
const deleteProductButton = document.getElementById("li_delete_product");

const moveButton = document.getElementById("li_move");
const submitMove = document.getElementById("submit_move_product");
const submitMoveDelete = document.getElementById("submit_move_delete_product");

const uploadImageButton = document.getElementById("upload_image");
var stringInArray = null;

var files = [];
var imageUploaded = false;
var imageURL = null;

const uploadImage = document.getElementById("add_product_image");
uploadImageButton.onclick = uploadImageToStorage;

// CREAR PRODUCTO
uploadImage.addEventListener("click", function() {
    console.log("test")
    var reader = new FileReader();

    var inputImage = document.createElement('input');
    inputImage.type = 'file';
    uploadImage.onchange = e => {
        console.log("cambio");
        console.log(e.target.files);
        files = e.target.files;

        var extension = GetFileExt(files[0]);
        var name = GetFileName(files[0]);

        reader.readAsDataURL(files[0]);
    }
})
submitAddProduct.addEventListener("click", function() {
    var inputProductName = document.getElementById("add_product_name");
    var inputProductDescription = document.getElementById("add_product_description");
    var inputProductPrice = document.getElementById("add_product_price");
    var inputProductAvailable = document.getElementById("add_product_available");

    if (inputProductName.value == "" || inputProductPrice.value == "") {
        alert("Los campos del nombre y precio no pueden estar vacíos");
        return;
    }

    // Array del producto: name, description, price, isAvailable, image
    var arrayProducto = [inputProductName.value, inputProductDescription.value, parseFloat(inputProductPrice.value), inputProductAvailable.checked, imageURL];
    manageProducts(arrayProducto, null)

    imageURL = ""
    createProductModal.close();
})

// EDITAR PRODUCTO
editProductButton.addEventListener("click", function() {
    selectEditProduct.innerHTML = '';

    var defaultOption = document.createElement("option");
    defaultOption.value = -1;
    defaultOption.text = "Elige un producto...";
    selectEditProduct.appendChild(defaultOption);

    var productsRef = ref(database, 'restaurant/foods/')
    onValue(productsRef, (snapshot) => {
        const productData = snapshot.val();

        Object.keys(productData).forEach((key) => {
            const product = productData[key];

            var arrayInString = SaveArrayInString([key, product.name, product.description, product.isAvailable, product.price]);

            var option = document.createElement("option");
            option.value = arrayInString;
            option.text = product.name;

            selectEditProduct.appendChild(option);
        })
    })
})
selectEditProduct.addEventListener("change", function() {
    var inputProductName = document.getElementById("edit_product_name");
    var inputProductDescription = document.getElementById("edit_product_description");
    var inputProductPrice = document.getElementById("edit_product_price");
    var inputProductAvailable = document.getElementById("edit_product_available");

    if (selectEditProduct.options[selectEditProduct.selectedIndex].value == -1) {
        inputProductName.value = "";
        inputProductDescription.value = "";
        inputProductPrice.value = 0;
        inputProductAvailable.checked = false;
        return;
    }
    stringInArray = RetrieveArrayInString(selectEditProduct.options[selectEditProduct.selectedIndex].value);

    inputProductName.value = stringInArray[1];
    inputProductDescription.value = stringInArray[2];
    inputProductAvailable.checked = stringInArray[3];
    inputProductPrice.value = stringInArray[4];
})
submitEditProduct.addEventListener("click", function() {
    var inputProductName = document.getElementById("edit_product_name");
    var inputProductDescription = document.getElementById("edit_product_description");
    var inputProductPrice = document.getElementById("edit_product_price");
    var inputProductAvailable = document.getElementById("edit_product_available");

    if (inputProductName.value == "" || inputProductPrice.value == "") {
        alert("Los campos del nombre y precio no pueden estar vacíos");
        return;
    }

    // Array del producto: name, description, price, isAvailable, image
    var arrayProducto = [inputProductName.value, inputProductDescription.value, parseFloat(inputProductPrice.value), inputProductAvailable.checked, imageURL];
    manageProducts(arrayProducto, stringInArray[0])

    imageURL = ""
    editProductModal.close();
})

// BORRAR PRODUCTO
deleteProductButton.addEventListener("click", function() {
    selectDeleteProduct.innerHTML = '';

    var defaultOption = document.createElement("option");
    defaultOption.value = -1;
    defaultOption.text = "Elige un producto...";
    selectDeleteProduct.appendChild(defaultOption);

    var productsRef = ref(database, 'restaurant/foods/')
    onValue(productsRef, (snapshot) => {
        const productData = snapshot.val();

        Object.keys(productData).forEach((key) => {
            const product = productData[key];

            var option = document.createElement("option");
            option.value = key;
            option.text = product.name;

            selectDeleteProduct.appendChild(option);
        })
    })
})
submitDeleteProduct.addEventListener("click", function() {
    var deleteProductKey = selectDeleteProduct.options[selectDeleteProduct.selectedIndex].value
    if (deleteProductKey == -1) {
        alert("Selecciona un producto para eliminarlo");
        return;
    }

    set(ref(database, 'restaurant/foods/' + deleteProductKey), null);
    alert("El producto ha sido borrado.")

    deleteProductModal.close();
})

// AÑADIR PRODUCTO A UNA SECCIÓN
moveButton.addEventListener("click", function() {
    selectMoveProduct.innerHTML = '';
    selectMoveSection.innerHTML = '';

    var defaultOption = document.createElement("option");
    defaultOption.value = -1;
    defaultOption.text = "Elige un producto...";
    selectMoveProduct.appendChild(defaultOption);

    var productsRef = ref(database, 'restaurant/foods/')
    onValue(productsRef, (snapshot) => {
        const productData = snapshot.val();

        Object.keys(productData).forEach((key) => {
            const product = productData[key];

            var option = document.createElement("option");
            option.value = key;
            option.text = product.name;

            selectMoveProduct.appendChild(option);
        })
    })

    var defaultOption2 = document.createElement("option");
    defaultOption2.value = -1;
    defaultOption2.text = "Elige una sección...";
    selectMoveSection.appendChild(defaultOption2);

    const sectionsRef = ref(database, 'restaurant/sections_food')
    onValue(sectionsRef, (snapshot) => {
        const sectionData = snapshot.val();

        Object.keys(sectionData).forEach((sect) => {
            const section = sectionData[sect];

            var option = document.createElement("option");
            option.value = sect;
            option.text = section.sectionName;

            selectMoveSection.appendChild(option);
        })
    })
})
submitMove.addEventListener("click", function() {
    var productKey = selectMoveProduct.options[selectMoveProduct.selectedIndex].value;
    var sectionKey = selectMoveSection.options[selectMoveSection.selectedIndex].value;

    if (productKey == -1) {
        alert("Seleccione un producto")
        return
    }
    if (sectionKey == -1) {
        alert("Seleccione una sección")
        return
    }

    const productSection = {};
    productSection[productKey] = true;
    update(ref(database, 'restaurant/sections_food/' + sectionKey + '/items/'), productSection)
    alert("Producto añadido a la sección")
})
submitMoveDelete.addEventListener("click", function() {
    var productKey = selectMoveProduct.options[selectMoveProduct.selectedIndex].value;
    var sectionKey = selectMoveSection.options[selectMoveSection.selectedIndex].value;

    if (productKey == -1) {
        alert("Seleccione un producto")
        return
    }
    if (sectionKey == -1) {
        alert("Seleccione una sección")
        return
    }

    set(ref(database, 'restaurant/sections_food/' + sectionKey + '/items/' + productKey), null)
    alert("Producto eliminado de la sección")
})

async function uploadImageToStorage() {
    var imgToUpload = files[0];
    var imgName = GetFileName(imgToUpload) + GetFileExt(imgToUpload)

    const metaData = {
        contentType: imgToUpload.type
    }

    const storageRef = sRef(storage, imgName);
    const uploadTask = uploadBytesResumable(storageRef, imgToUpload, metaData);

    uploadTask.on('state-changed', (snapshot) => {
        // x
    }, (error) => {
        alert("Ha habido un error y la imagen no se ha podido subir");
    }, () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            alert("¡Imagen subida!")
            imageURL = downloadURL;
            imageUploaded = true;
        })
    })

    uploadImageButton.onclick = uploadImageToStorage;
}

function GetFileName(file) { 
    // Devuelve el nombre del archivo sin la extensión.
    var temp = file.name.split('.');
    var fname = temp.slice(0, -1).join('.');
    console.log(fname);
    return fname;
}

function GetFileExt(file) {
    // Devuelve solo la extensión del archivo.
    var temp = file.name.split('.');
    var ext = temp.slice((temp.length-1), (temp.length));
    return '.' + ext[0];
}

function SaveArrayInString(array) {
    var finalString = ""
    for (let i = 0; i < array.length; i++) {
        if (i != array.length) {
            finalString += array[i] + "||"
        } else {
            finalString += array[i]
        }
    }
    console.log(finalString);
    return finalString;
}

function RetrieveArrayInString(string) {
    var finalArray = string.split('||')
    return finalArray;
}   

function manageProducts(arrayProducto, prodKey) {
    if (prodKey == null) {
        if (arrayProducto[4] == null) {
            var newProdRef = push(ref(database, 'restaurant/foods/'), {
                name: arrayProducto[0],
                description: arrayProducto[1],
                price: arrayProducto[2],
                isAvailable: arrayProducto[3]
            })
            update(ref(database, 'restaurant/foods/' + newProdRef.key), {
                itemId: newProdRef.key
            })
        } else {
            var newProdRef = push(ref(database, 'restaurant/foods/'), {
                name: arrayProducto[0],
                description: arrayProducto[1],
                price: arrayProducto[2],
                isAvailable: arrayProducto[3],
                image: arrayProducto[4]
            })
            update(ref(database, 'restaurant/foods/' + newProdRef.key), {
                itemId: newProdRef.key
            })
        }
        alert("¡Nuevo producto añadido!")
    } else {
        if (arrayProducto[4] == null) {
            update(ref(database, 'restaurant/foods/' + prodKey), {
                name: arrayProducto[0],
                description: arrayProducto[1],
                price: arrayProducto[2],
                isAvailable: arrayProducto[3]
            });
        } else {
            update(ref(database, 'restaurant/foods/' + prodKey), {
                name: arrayProducto[0],
                description: arrayProducto[1],
                price: arrayProducto[2],
                isAvailable: arrayProducto[3],
                image: arrayProducto[4]
            });
        }
        alert("¡El producto ha sido editado!")
    }
}