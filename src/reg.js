import Workspace from "./workspace.js";
import renderCategoriesSelectModule from "./categories-select-mod.js";
export default class Registration
{
    constructor(app) {
        this.mainWrapper = app;
        this.init();
        this.createTabs();
        this.createControlBtns();
        this.setHandlers();
        this.showTab(this.currentTab);
    }

    init() {
        this.currentTab = 0;
        const wrapper = document.createElement("div");
        wrapper.classList.add("reg-main");
        const contentInner = document.createElement("div");
        contentInner.classList.add("reg-window")
        this.regForm = document.createElement("form");
        this.regForm.id = "reg-form";
        this.regForm.setAttribute("method", "post");
        this.mainWrapper.appendChild(wrapper);
        wrapper.appendChild(contentInner);
        contentInner.appendChild(this.regForm);
    }

    createTabs() {
        function fillTab(tab, ind) {
            if(ind === 0) {
                const heading1 = document.createElement("h2");
                heading1.classList.add("reg-tab-title");
                heading1.textContent = "Hi! My name is Spendee";
                tab.appendChild(heading1);

                const heading2 = document.createElement("h2");
                heading2.classList.add("reg-tab-title");
                heading2.textContent = "What is your name?";
                tab.appendChild(heading2);

                const wrapper = document.createElement("div");
                wrapper.classList.add("reg-tab__inputs-inner");
                wrapper.classList.add("mt-5");
                tab.appendChild(wrapper);

                const inputWrapper1 = document.createElement("p");
                inputWrapper1.classList.add("centered");
                wrapper.appendChild(inputWrapper1);

                const input1 = document.createElement("input");
                input1.setAttribute("type", "text");
                input1.setAttribute("placeholder", "First name...");
                input1.setAttribute("minlength", "1");
                input1.setAttribute("maxlength", "20");
                input1.classList.add("reg-input");
                input1.id = "fName";
                inputWrapper1.appendChild(input1);

                const inputWrapper2 = document.createElement("p");
                inputWrapper2.classList.add("centered");
                wrapper.appendChild(inputWrapper2);

                const input2 = document.createElement("input");
                input2.setAttribute("type", "text");
                input2.setAttribute("placeholder", "Last name...");
                input2.setAttribute("minlength", "1");
                input2.setAttribute("maxlength", "20");
                input2.classList.add("reg-input");
                input2.id = "lName";
                inputWrapper2.appendChild(input2);
            }
            if(ind === 1) {
                const heading1 = document.createElement("h2");
                heading1.classList.add("reg-tab-title");
                heading1.textContent = "Let's create a new wallet";
                tab.appendChild(heading1);

                const heading2 = document.createElement("h2");
                heading2.classList.add("reg-tab-title");
                heading2.textContent = "Enter name of your first wallet";
                tab.appendChild(heading2);

                const wrapper = document.createElement("div");
                wrapper.classList.add("reg-tab__inputs-inner");
                wrapper.classList.add("mt-5");
                tab.appendChild(wrapper);

                const inputWrapper = document.createElement("p");
                inputWrapper.classList.add("centered");
                wrapper.appendChild(inputWrapper);

                const input = document.createElement("input");
                input.setAttribute("type", "text");
                input.setAttribute("placeholder", "Wallet name...");
                input.setAttribute("minlength", "1");
                input.setAttribute("maxlength", "20");
                input.classList.add("reg-input");
                input.id = "wallet-name";
                inputWrapper.appendChild(input);
            }
            if(ind === 2) {
                const heading = document.createElement("h2");
                heading.classList.add("reg-tab-title");
                heading.textContent = "Enter initial balance";
                tab.appendChild(heading);

                const wrapper = document.createElement("div");
                wrapper.classList.add("reg-tab__inputs-inner");
                wrapper.classList.add("mt-5");
                tab.appendChild(wrapper);

                const inputWrapper = document.createElement("p");
                inputWrapper.classList.add("centered");
                wrapper.appendChild(inputWrapper);

                const input = document.createElement("input");
                input.setAttribute("type", "number");
                input.setAttribute("min", "0");
                input.setAttribute("max", "999999999");
                input.setAttribute("size", "1");
                input.classList.add("reg-input");
                input.id = "walletBalance";
                inputWrapper.appendChild(input);

                const select = document.createElement("select");
                select.setAttribute("name", "currency");
                select.id = "reg-currency-select";
                const currencies = ["USD", "EUR", "BYR", "RUB", "UAH", "KZT", "KGS", "UZS"];
                currencies.forEach((item) => {
                    let opt = document.createElement("option");
                    opt.classList.add("curr-name");
                    opt.setAttribute("value", item);
                    opt.id = item;
                    opt.textContent = item;
                    select.appendChild(opt);
                })
                inputWrapper.appendChild(select);
            }

            if(ind === 3) {
                const mainWrapper = renderCategoriesSelectModule(incomeCategories, expensesCategories, "checkbox");
                tab.appendChild(mainWrapper);  
            } 
        }

        const incomeCategories = [
            "bonus",
            "business",
            "extra-income",
            "gifts",
            "insurance",
            "loan",
            "other",
            "parental",
            "salary"
        ];

        const expensesCategories = [
            "beauty",
            "car",
            "education",
            "entertainment",
            "family&pers",
            "food&drink",
            "gifts",
            "groceries",
            "healthcare"
        ];

        this.tabs = [];
        for(let i = 0; i < 4; i++) {
            let newTab = document.createElement("div");
            newTab.classList.add("reg-tab");
            fillTab(newTab, i);
            this.regForm.appendChild(newTab);
            this.tabs.push(newTab);
        }
    }

    createControlBtns() {
        const wrapper = document.createElement("div");
        wrapper.classList.add("reg-control-block");
        const btnsWrapper = document.createElement("div");
        btnsWrapper.classList.add("reg-move-btn");
        btnsWrapper.classList.add("text-right");
        const prevBtn = document.createElement("button");
        prevBtn.id = "prevBtn";
        prevBtn.setAttribute("type", "button");
        prevBtn.textContent = "Previous";
        const nextBtn = document.createElement("button");
        nextBtn.id = "nextBtn";
        nextBtn.setAttribute("type", "button");
        nextBtn.textContent = "Next";
        btnsWrapper.appendChild(prevBtn);
        btnsWrapper.appendChild(nextBtn);

        const stepsWrapper = document.createElement("div");
        stepsWrapper.classList.add("reg-steps");
        for(let i = 0; i < 4; i++) {
            const step = document.createElement("span");
            step.classList.add("reg-step");
            stepsWrapper.appendChild(step);
        }
        wrapper.appendChild(btnsWrapper);
        wrapper.appendChild(stepsWrapper);
        this.regForm.appendChild(wrapper);
    }

    showTab(tabNumber) {
        this.tabs = document.querySelectorAll(".reg-tab");
        this.tabs[tabNumber].style.display = "block";
        this.showInputEnteredData(tabNumber);
        if (tabNumber === 3) {
            this.showCheckboxSelectedData();
        }
        if (tabNumber === 0) {
            this.prevBtn.style.display = "none";
        } else {
            this.prevBtn.style.display = "inline";
        }
        if(tabNumber == (this.tabs.length-1)) {
            this.nextBtn.innerHTML = "Submit";
        } else {
            this.nextBtn.innerHTML = "Next";
        }
        
        this.fixStepIndicator(tabNumber);
    }

    showInputEnteredData(tabNumber) {
        let currentTab = this.tabs[tabNumber];
        let inputInner = currentTab.querySelectorAll(".reg-input");
        inputInner.forEach((element) => {
            if(localStorage.getItem(element.id)) {
                let val = localStorage.getItem(element.id);
                if(element.id === "wallet-name") {
                    val =JSON.parse(val).names[0];
                }
                element.value = val;
            } else if(localStorage.getItem("wallet-name") !== null) {
                const currentWalletNameObj = JSON.parse(localStorage.getItem("wallet-name"));
                const currentWalletName = currentWalletNameObj.names[0];
                let currentWallet = JSON.parse(localStorage.getItem(currentWalletName));
                if(currentWallet[element.id]) {
                    console.log(currentWallet[element.id]);
                    element.value = currentWallet[element.id];
                }
        }
     })
    }

    showCheckboxSelectedData() {
        if (localStorage.getItem("allowedCategories")) {
           let categories = JSON.parse(localStorage.getItem("allowedCategories"));
           for(let i = 0; i < this.regCatCheckbox.length; i++) {
               if(categories[this.regCatCheckbox[i].name]) {
                if(categories[this.regCatCheckbox[i].name].includes(this.regCatCheckbox[i].value)) {
                    this.regCatCheckbox[i].checked = true;
                   }
               }
           } 
        }
    }

    makeStep(direction) {
        console.log(direction);
        if (direction === "forward" && !this.validateForm()) return false;
        this.tabs[this.currentTab].style.display = "none";
        this.currentTab = (direction === "forward") ? this.currentTab + 1 : this.currentTab - 1;
       
        if (this.currentTab >= this.tabs.length) {
            this.setCategories();
            const regForm = document.querySelector("#reg-form");
            regForm.dispatchEvent(new Event('submit'));
            localStorage.setItem("isRegUser", "true");
            document.querySelector("#app").innerHTML = "";

            new Workspace(this.mainWrapper);
            return;
        }
        this.showTab(this.currentTab);  
    }

    fixStepIndicator(n) {
        this.steps = document.querySelectorAll(".reg-step");
        for(let i = 0; i < this.steps.length; i++) {
            this.steps[i].className = this.steps[i].className.replace(" active", "");
        }
        this.steps[n].className += " active";
    }

    validateForm() {
        let valid = true;
        let y = this.tabs[this.currentTab].querySelectorAll('input');
        for (let i = 0; i < y.length; i++) {
            if (y[i].value === "") {
                y[i].className += " invalid";
                valid = false;
            }
        }
        if(valid) {
            this.steps[this.currentTab].className += " finish";
        }
        return valid;
    }

    writeInLStorage(lSPropName, ourPropName, value, isArray=false) {
        let prop = JSON.parse(localStorage.getItem(lSPropName));
        if(!isArray) {
            prop[ourPropName] = value;
        }
        else {
            prop[ourPropName].push(value);
        }
        localStorage.setItem(lSPropName, JSON.stringify(prop));
    }

    setCategories() {
        let categories = document.querySelectorAll(".cat-input");
        categories.forEach((element) => {
            if(element.checked) { 
                let parsedCategories = {};
                parsedCategories[element.name] = element.value;
                this.writeInLStorage(this.walletName, "allowedCategories", JSON.stringify(parsedCategories), true);
            }
        })
    }

    setHandlers() {
        // Set handler to the button "Back"
        this.prevBtn = document.querySelector("#prevBtn");
        this.prevBtn.addEventListener("click", function() { 
            this.makeStep("back") 
        }.bind(this));

        // Set handler to the button "Forward"
        this.nextBtn = document.querySelector("#nextBtn");
        this.nextBtn.addEventListener("click", function() {
            this.makeStep("forward");
        }.bind(this));

        // Save entered data in LocalStorage for <input type = "text">
        const regInputs = document.querySelectorAll(".reg-input");
        for(let i = 0; i < regInputs.length; i++) {
            regInputs[i].addEventListener("keyup", function(e) {
                if(regInputs[i].id === "wallet-name") return;
                if(regInputs[i].id === "walletBalance") {
                    this.writeInLStorage(this.walletName, regInputs[i].id, regInputs[i].value);
                    this.writeInLStorage(this.walletName, "initialBalance", regInputs[i].value);
                }
                else localStorage.setItem(regInputs[i].id, regInputs[i].value); 
            }.bind(this))
        }

        const newWalletName = document.querySelector("#wallet-name");
        newWalletName.addEventListener("blur", () => {
            if(this.walletName) {
                let walletInfo = JSON.parse(localStorage.getItem(this.walletName));

                walletInfo.walletName = newWalletName.value;
                localStorage.setItem(newWalletName.value, JSON.stringify(walletInfo));
                const wName = {
                    names: [newWalletName.value]
                }
                localStorage.setItem("wallet-name", JSON.stringify(wName));
                localStorage.removeItem(this.walletName);
            } else if(!this.walletName) {
                let obj = {
                    walletName: newWalletName.value,
                    currency: "USD",
                    allowedCategories: []
                }
                const wName = {
                    names: [newWalletName.value]
                }
                localStorage.setItem("wallet-name", JSON.stringify(wName));
                localStorage.setItem(newWalletName.value, JSON.stringify(obj));
            }
            this.walletName = newWalletName.value;
        });

        // Save selected currency in LocalStorage for <select>
        const currSelectRegForm = document.querySelector("#reg-currency-select");
        currSelectRegForm.onchange = function() {
            this.writeInLStorage(this.walletName, "currency", currSelectRegForm.value);
        }.bind(this);

        // Save checked categories in LocalStorage for <input type = "checkbox">
    /*    this.regCatCheckbox = document.querySelectorAll(".cat-input");
        for(let i=0; i < this.regCatCheckbox.length; i++) {
            this.regCatCheckbox[i].addEventListener("click", function(e) {
                if(e.target.checked) {
                    let parsedCategories = {};
                     parsedCategories[e.target.name] = e.target.value;
                    this.writeInLStorage(this.walletName, "allowedCategories", JSON.stringify(parsedCategories), true);
                    }
                    else if (!e.target.checked) {
                        let walletInfo = JSON.parse(localStorage.getItem(this.walletName));
                        let editCategories = walletInfo["allowedCategories"].filter((item) => {
                            let cat = JSON.parse(item);
                            if(Object.values(cat)[0] !== e.target.value) {
                                return item;
                            }
                        });
                        this.writeInLStorage(this.walletName, "allowedCategories", editCategories);
                    }
                }.bind(this));
        } */
    } 
}