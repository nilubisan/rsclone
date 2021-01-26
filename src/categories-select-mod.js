/* Функция, которая генерит модуль с категориями, которые нужно выбрать пользователю 
   Применяется при регистрации и в попапе при добавлении новой операции
   Принимает на входе: 
   incomeCategoriesArr, expensesCategoriesArr - массивы с категориями доходов и затрат, 
   typeInput - тип инпута при выборе категории: checkbox или radio
   isSameName - присваивать ли инпутам одинаковые имена. Используется для создания групп радиокнопок
*/
export default function renderCategoriesSelectModule(incomeCategoriesArr, expensesCategoriesArr, typeInput, isSameName) {                              
    const mainWrapper = document.createElement("div");  // ГЛАВНЫЙ КОНТЕЙНЕР

    const heading = document.createElement("h2");  //
    heading.classList.add("centered");            //
    heading.textContent = "Choose categories";   //     ЗАГОЛОВОК
    mainWrapper.appendChild(heading);           //

    const wrapper = document.createElement("div");  
    wrapper.classList.add("wrapper", "mt-5");            // КОНТЕЙНЕР
    mainWrapper.appendChild(wrapper);

    const row1 = document.createElement("div");        
    row1.classList.add("row");                          // СЕТКА БУТСТРАП row1  
    wrapper.appendChild(row1);

    const col1 = document.createElement("div");
    col1.classList.add("col-6", "centered");          // СЕТКА БУТСТРАП row1-col1
    row1.appendChild(col1);

    const toggleLink1 = document.createElement("a");      
    toggleLink1.id = "income-link";                   // ПЕРЕКЛЮЧАТЕЛЬ МЕЖДУ ТИПАМИ КАТЕГОРИЙ (INCOME)
    toggleLink1.textContent = "INCOME";                                         
    col1.appendChild(toggleLink1);

    const col2 = document.createElement("div");
    col2.classList.add("col-6", "centered");           // СЕТКА БУТСТРАП row1-col2
    row1.appendChild(col2);

    const toggleLink2 = document.createElement("a");
    toggleLink2.id = "expenses-link";
    toggleLink2.textContent = "EXPENSES";             // ПЕРЕКЛЮЧАТЕЛЬ МЕЖДУ ТИПАМИ КАТЕГОРИЙ (EXPENSES)
    col2.appendChild(toggleLink2);
    
    const row2 = document.createElement("div");
    row2.classList.add("row");                          // СЕТКА БУТСТРАП row2
    row2.classList.add("mt-4");
    wrapper.appendChild(row2);

    const incomeCatWrapper = document.createElement("div");
    incomeCatWrapper.id = "income-cat";                      // КОНТЕЙНЕР ДЛЯ  КАТЕГОРИЙ ДОХОДОВ
    incomeCatWrapper.classList.add("col");
    row2.appendChild(incomeCatWrapper);
    

    for(let i = 0; i < incomeCategoriesArr.length; i++) {
        let catItem;
        if(isSameName) {
           catItem = createCategoryEl(incomeCategoriesArr[i], "operation", typeInput, (i+1));
        } else {                                                                                        // В ЭТОМ ЦИКЛЕ ПРОХОДИМСЯ ПО МАССИВАМ С КАТЕГОРИЯМИ ДОХОДОВ, ПЕРЕДАННЫМ В АРГУМЕНТАХ
            catItem = createCategoryEl(incomeCategoriesArr[i], "income", typeInput, (i+1));             // НА КАЖДОЙ ИТЕРАЦИИ ВЫЗЫВАЕМ ФУНКЦИЮ createCategoryEl
        }                                                                                               // РЕЗУЛЬТАТ ФУНКЦИИ createCategoryEl ДОБАВЛЯЕМ В КОНТЕЙНЕР
       incomeCatWrapper.appendChild(catItem);
    }

    const expensesCatWrapper = document.createElement("div");
    expensesCatWrapper.id = "expenses-cat";                                    // КОНТЕЙНЕР ДЛЯ  КАТЕГОРИЙ ЗАТРАТ
    expensesCatWrapper.classList.add("col");
    expensesCatWrapper.setAttribute("style", "display: none");
    row2.appendChild(expensesCatWrapper);

    for(let i = 0; i < expensesCategoriesArr.length; i++) {
        let catItem; 
        if(isSameName) {
            catItem = createCategoryEl(expensesCategoriesArr[i], "operation", typeInput, (i+1));
        } else {                                                                                        // АНАЛОГИЧНЫЙ ПРОХОД ПО МАССИВУ ЗАТРАТ
            catItem = createCategoryEl(expensesCategoriesArr[i], "expenses", typeInput, (i+1));
        }
       expensesCatWrapper.appendChild(catItem);
    }
    return mainWrapper;
}

// ФУНКЦИЯ, КОТОРАЯ ГЕНЕРИТ ЭЛЕМЕНТ С КАТЕГОРИЕЙ
// ЭЛЕМЕНТ ВКЛЮЧАЕТ В СЕБЯ ОБЕРТКУ, ИНПУТ, ИКОНКУ И НАДПИСЬ
function createCategoryEl(catName, catType, inputType, ind) {
    const category = document.createElement("div");
    category.classList.add("category-item");

    const input = document.createElement("input"); 
    input.setAttribute("type", inputType);
    input.setAttribute("name", `${catType}-cat`);
    input.setAttribute("value", catName);
    input.classList.add("cat-input");
    input.id = `${catType}-cat${ind}`;
    category.appendChild(input);

    const label = document.createElement("label");
    label.setAttribute("for", input.id);
    label.classList.add("ml-2");
    category.appendChild(label);

    const ico = new Image();
    ico.src = `assets/images/${catName}_icon.svg`;
    ico.classList.add("cat-icon");
    label.appendChild(ico);

    const catTitle = document.createElement("span");
    catTitle.textContent = catName;
    label.appendChild(catTitle);
    
    return category;
}
