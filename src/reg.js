export default class Registration 
{
    constructor() {
        this.currentTab = 0;
        this.setHandlers();
        this.showTab(this.currentTab);
    }

    showTab(tabNumber) {
        this.tabs = document.querySelectorAll(".tab");
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
        let inputInner = currentTab.querySelectorAll(".regInput");
        console.log(localStorage.getItem(this.walletName));
        inputInner.forEach((element) => {
            console.log(`foreEach - ${this.walletName}`);
            if(localStorage.getItem(element.id)) {
                element.value = localStorage.getItem(element.id);
            } else if(localStorage.getItem("wallet-name") !== null) {
                console.log("filled");
                let currentWalletName = localStorage.getItem("wallet-name");
                element.value = currentWalletName;
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
        if (direction === "forward" && !this.validateForm()) return false;
        this.tabs[this.currentTab].style.display = "none";
        this.currentTab = (direction === "forward") ? this.currentTab + 1 : this.currentTab - 1;
        if (this.currentTab >= this.tabs.length) {
            const regForm = document.querySelector("#regForm");
            regForm.dispatchEvent(new Event('submit'));
            localStorage.setItem("isRegUser", "true");
            document.querySelector(".main-inner").innerHTML = "";
            return false;
        }
        this.showTab(this.currentTab);
    }

    fixStepIndicator(n) {
        this.steps = document.querySelectorAll(".step");
        for(let i = 0; i < this.steps.length; i++) {
            this.steps[i].className = this.steps[i].className.replace(" active", "");
        }
        this.steps[n].className += " active";
    }

    validateForm() {
        let valid = true;
        let y = this.tabs[this.currentTab].querySelectorAll('input');
        for (let i = 0; i < y.length; i++) {
            if (y[i].value = "") {
                y[i].className += " invalid";
                valid = false;
            }
        }
        if(valid) {
            this.steps[this.currentTab].className += " finish";
        }
        return valid;
    }

    toggleRegCategories(operationType) {
        const incomeRegCat = document.querySelector("#income-cat");
        const expensesRegCat = document.querySelector("#expenses-cat");
        if (operationType === "expenses") {
            incomeRegCat.style.display = "none";
            expensesRegCat.style.display = "block";
        } else if (operationType === "income") {
            expensesRegCat.style.display = "none";
            incomeRegCat.style.display = "block";
        }
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

        // Set handlers to category-list toggles
        const expensesRegLink = document.querySelector("#expenses-link");
        expensesRegLink.addEventListener("click", function(){ 
            this.toggleRegCategories("expenses")
        }.bind(this));
        const incomeRegLink = document.querySelector("#income-link");
        incomeRegLink.addEventListener("click", function(){ 
            this.toggleRegCategories("income")
        }.bind(this));

        // Save entered data in LocalStorage for <input type = "text">
        const regInputs = document.querySelectorAll(".regInput");
        for(let i = 0; i < regInputs.length; i++) {
            regInputs[i].addEventListener("keyup", function(e) {
                if(regInputs[i].id === "wallet-name") return;
                localStorage.setItem(regInputs[i].id, regInputs[i].value); 
            })
        }

        const newWalletName = document.querySelector("#wallet-name");
        newWalletName.addEventListener("blur", () => {
            if(this.walletName) {
                let walletInfo = JSON.parse(localStorage.getItem(this.walletName));
                walletInfo.walletName = newWalletName.value;
                localStorage.setItem(newWalletName.value, JSON.stringify(walletInfo));
                localStorage.setItem("wallet-name", newWalletName.value);
                localStorage.removeItem(this.walletName);
            } else if(!this.walletName) {
                let obj = {
                    walletName: newWalletName.value
                }
                localStorage.setItem("wallet-name", newWalletName.value);
                localStorage.setItem(newWalletName.value, JSON.stringify(obj));
            }
            this.walletName = newWalletName.value;
            console.log(`this.walletName - ${this.walletName}`);
        });

        // Save selected currency in LocalStorage for <select>
        const currSelectRegForm = document.querySelector("#currency-select");
        currSelectRegForm.onchange = function() {
            localStorage.setItem("currency", currSelectRegForm.value);
        }

        // Save checked categories in LocalStorage for <input type = "checkbox">
        this.regCatCheckbox = document.querySelectorAll(".reg-cat-checkbox");
        for(let i=0; i < this.regCatCheckbox.length; i++) {
            this.regCatCheckbox[i].addEventListener("click", function(e) {
                if(e.target.checked) {
                    let parsedCategories = {};
                    if (localStorage.getItem("allowedCategories")) {
                      parsedCategories = JSON.parse(localStorage.getItem("allowedCategories"));
                    } else if(!localStorage.getItem("allowedCategories")) {
                        parsedCategories[e.target.name] = [];
                    }
                    if(!parsedCategories[e.target.name]) {
                        parsedCategories[e.target.name] = [];
                    }
                     parsedCategories[e.target.name].push(e.target.value);
                     localStorage.setItem("allowedCategories", JSON.stringify(parsedCategories));
                    }
                    else if (!e.target.checked){
                        let parsedCategories = JSON.parse(localStorage.getItem("allowedCategories"));
                        let pos = parsedCategories[e.target.name].indexOf(e.target.value);
                        parsedCategories[e.target.name].splice(pos, 1);
                        localStorage.setItem("allowedCategories", JSON.stringify(parsedCategories));
                    }
                }.bind(this));
        }
    }
}