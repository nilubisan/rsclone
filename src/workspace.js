import renderCategoriesSelectModule from "./categories-select-mod.js";
export default class Workspace {
    constructor(app) {
        this.mainWrapper = app;
        this.totalWealth = 0;
        this.init();
    }

    init() {
        this.retrieveDataFromStorage();
        this.renderWorkspace();
        this.setHandlers();
    }

    retrieveDataFromStorage() {
        const fName = localStorage.getItem("fName");
        const lName = localStorage.getItem("lName");
        this.userName = `${fName} ${lName}`;
        this.walletsNames = [];
        this.walletsItems = {};
        const wallets = JSON.parse(localStorage.getItem("wallet-name"));
        this.walletsNames = wallets["names"].slice(0);
        this.walletsNames.forEach((importedWalletName) => {
            const wallet = JSON.parse(localStorage.getItem(importedWalletName));
            const categories = wallet.allowedCategories.map((element) => JSON.parse(element));
            this.walletsItems[importedWalletName] = wallet;
            const incomeCategories = [];
            const expensesCategories = [];
            categories.forEach((element) => {
               for(const [key, value] of Object.entries(element)) {
                if(key === "income-cat") {
                    incomeCategories.push(value);
                } else {
                    expensesCategories.push(value);
                }
               };
            })
            this.walletsItems[importedWalletName].incomeCategories = incomeCategories;
            this.walletsItems[importedWalletName].expensesCategories =  expensesCategories;
            this.totalWealth = (+this.totalWealth) + (+wallet.walletBalance);
            this.currency = wallet.currency;
            this.currentWalletName = this.walletsNames[0];
            console.log(this.walletsItems[importedWalletName]);
        });
    }

    renderWorkspace() {
        this.mainWrapper.appendChild(this.renderHeader());
        this.mainContainer = this.renderMainContainer(this.mainWrapper);
        this.mainContainer.appendChild(this.renderWallets());
        this.mainContainer.appendChild(this.renderAnalytics());
        this.mainWrapper.appendChild(this.mainContainer);
        this.renderPopup();
    }

    renderHeader() {
        const header = document.createElement("header");
        header.classList.add("header", "container-fluid");
        const headerInner = document.createElement("div");
        headerInner.classList.add("header-inner", "row", "py-4");
        const headerLogoWrapper = document.createElement("div");
        headerLogoWrapper.classList.add("header-logo", "col-4");
        const headerLogo = new Image();
        headerLogo.src = "assets/images/logo.svg";
        headerLogoWrapper.appendChild(headerLogo);
        headerInner.appendChild(headerLogoWrapper);
        const viewToggles = document.createElement("div");
        viewToggles.classList.add("view-toggles", "col-4", "d-flex", "justify-content-center");
        const viewTogglesBtn1 = document.createElement("a");
        viewTogglesBtn1.classList.add("view-toggles-btn", "mr-4");
        viewTogglesBtn1.textContent = "Main Panel";
        viewToggles.appendChild(viewTogglesBtn1);
        headerInner.appendChild(viewToggles);
        const userInfo = document.createElement("div");
        userInfo.classList.add("user-info", "header-items", "col-4");
        const userName = document.createElement("a");
        userName.textContent = this.userName;
        userInfo.appendChild(userName);
        headerInner.appendChild(userInfo);
        header.appendChild(headerInner);
        return header;
    }

    renderMainContainer(mainWrapper) {
        const main = document.createElement("main");
        main.classList.add("main");
        const mainBody = document.createElement("div");
        mainBody.classList.add("main-body");
        const mainContainer = document.createElement("div");
        mainContainer.classList.add("container", "main-container");
        mainBody.appendChild(mainContainer);
        main.appendChild(mainBody);
        mainWrapper.appendChild(main);
        return mainContainer;
    }

    renderWallets() {
        function createWalletElement(newWalletName, newWalletType, newWalletBalance, newWalletCurr) {
            const walletBody = document.createElement("div");
            walletBody.classList.add("wallet-body", "p-2");
            const walletInner = document.createElement("div");
            walletInner.classList.add("wallet-inner");
            const walletLogoWrapper = document.createElement("div");
            walletLogoWrapper.classList.add("wallet-logo");
            const walletLogo = new Image(22, 20);
            walletLogo.src="assets/images/wallet-logo.svg";
            walletLogoWrapper.appendChild(walletLogo);
            walletInner.appendChild(walletLogoWrapper);
            const walletInfo = document.createElement("div");
            walletInfo.classList.add("wallet-info");
            const walletName = document.createElement("span");
            walletName.classList.add("wallet-name");
            walletName.textContent = newWalletName;
            const walletType = document.createElement("span");
            walletType.classList.add("wallet-type");
            walletType.textContent = newWalletType;
            const walletBalance = document.createElement("div");
            walletBalance.classList.add("wallet-balance");
            const walletBalSum = document.createElement("span");
            walletBalSum.classList.add("wallet-balance-sum");
            walletBalSum.textContent = newWalletBalance > 0 ? `+${newWalletBalance}` : newWalletBalance;
            const walletBallCurr = document.createElement("span");
            walletBallCurr.classList.add("wallet-balance-currency");
            walletBallCurr.textContent = ` ${newWalletCurr}`;
            walletBalance.appendChild(walletBalSum);
            walletBalance.appendChild(walletBallCurr);
            walletInfo.appendChild(walletName);
            walletInfo.appendChild(makeLineBreak());
            walletInfo.appendChild(walletType);
            walletInfo.appendChild(walletBalance);
            walletInner.appendChild(walletInfo);
            walletBody.appendChild(walletInner);
            return walletBody;
        }

            function createAddNewTransaction() {
            const btnBody = document.createElement("div");
            btnBody.classList.add("wallet-body", "p-2");
            const btnInner = document.createElement("div");
            btnInner.classList.add("wallet-inner", "wallet-add-sec");
            btnInner.id = "add-new-transaction";
            const btn = document.createElement("button");
            btn.classList.add("new-wallet-btn");
            btn.dataset.modalTarget = "popup";
            const btnIco = new Image(20,20);
            btnIco.src = "assets/images/plus.png"
            btnIco.classList.add("wallet-btn-icon");
            const btnText = document.createElement("span");
            btnText.classList.add("wallet-btn-text");
            btnText.textContent = "Add new transaction";
            btn.appendChild(btnIco);
            btn.appendChild(btnText);
            btnInner.appendChild(btn);
            btnBody.appendChild(btnInner);
            return btnBody;
        }

        function makeLineBreak() {
            const lineBreak = document.createElement("br");
            return lineBreak;
        }
        const walletsWrapper = document.createElement("section");
        walletsWrapper.classList.add("main-section");
        walletsWrapper.id = "wallets";
        const walletsTitle = document.createElement("h2");
        walletsTitle.classList.add("main-section-title");
        walletsTitle.textContent = "Wallets";
        const walletSection = document.createElement("div");
        walletSection.classList.add("wallets-section");

        const walletsInner = document.createElement("div");
        walletsInner.classList.add("wallets-inner");
        for(const [wName, wItem] of Object.entries(this.walletsItems)) {
            const newWallet = createWalletElement(wName, "cash", wItem["walletBalance"], wItem["currency"]);
            walletsInner.appendChild(newWallet);
        }

        walletsInner.appendChild(createAddNewTransaction());

        walletSection.appendChild(walletsInner);
        walletsWrapper.appendChild(walletsTitle);
        walletsWrapper.appendChild(walletSection);
        return walletsWrapper;
    }

    renderAnalytics() {
        function createAnalyticsDateToggle() {
            const mainWrapper = document.createElement("div");
            mainWrapper.classList.add("analytics-subsection", "row");
            const wrapper = document.createElement("div");
            wrapper.classList.add("date-control", "col-6", "ml-auto");
            const sectionInner = document.createElement("div");
            sectionInner.classList.add("date-control-inner");
            const btnLeft = document.createElement("button");
            btnLeft.classList.add("toggle-date", "toggle-date-left");
            const btnRight = document.createElement("button");
            btnRight.classList.add("toggle-date", "toggle-date-right");
            const dateArea = document.createElement("div");
            dateArea.classList.add("selected-date-inner");
            const selectedDate = document.createElement("span");
            selectedDate.classList.add("selected-date");
            selectedDate.textContent = "01.12.2020-31.12.2020";
            const selectedDateIco = document.createElement("span");
            selectedDateIco.classList.add("selected-date-img");
            dateArea.appendChild(selectedDate);
            dateArea.appendChild(selectedDateIco);
            sectionInner.appendChild(btnLeft);
            sectionInner.appendChild(dateArea);
            sectionInner.appendChild(btnRight);
            wrapper.appendChild(sectionInner);
            mainWrapper.appendChild(wrapper);
            return mainWrapper;
        }
    
        function createAnalyticsFilters() {
            function createFilterInput(criteria, options) {
                const filterInner = document.createElement("div");
                filterInner.classList.add("filter-inner", "col-4");
                const label = document.createElement("label");
                label.setAttribute("for", `by-${criteria}`);
                label.textContent = `By ${criteria}`;
                if(options) {
                    const select = document.createElement("select");
                    select.setAttribute("name", `filter-by-${criteria}`);
                    select.id = `by-${criteria}`;
                    
                    for(const [value, fullName] of Object.entries(options)) {
                        const opt = document.createElement("option");
                        opt.setAttribute("value", value);
                        opt.textContent = fullName;
                        select.appendChild(opt);
                    }
                    filterInner.appendChild(label);
                    filterInner.appendChild(select);
                } else {
                    const input = document.createElement("input");
                    input.setAttribute("type", "text");
                    input.id = `by-${criteria}`;
                    
                    filterInner.appendChild(label);
                    filterInner.appendChild(input);
                }
                return filterInner;
            }
    
            const mainWrapper = document.createElement("div");
            mainWrapper.classList.add("analytics-subsection");
            const wrapper = document.createElement("div");
            wrapper.classList.add("filters");
            const headingsRow = document.createElement("div");
            headingsRow.classList.add("filters-headings", "row");
            const filterTitle = document.createElement("h3");
            filterTitle.classList.add("col-6", "filter-title");
            filterTitle.textContent = "Filters";
            const filterTitleCta = document.createElement("span");
            filterTitleCta.classList.add("col-6", "filter-cta");
            filterTitleCta.textContent = "Reset filters";
            headingsRow.appendChild(filterTitle);
            headingsRow.appendChild(filterTitleCta);
            wrapper.appendChild(headingsRow);
            const inputsRow = document.createElement("div");
            inputsRow.classList.add("filter-inputs", "row");
            inputsRow.appendChild(createFilterInput("wallet", {"all-wallets": "All wallets"}));
            inputsRow.appendChild(createFilterInput("category", {"outgoing": "Outgoing transfers", "ingoing": "Ingoing transfers"}));
            inputsRow.appendChild(createFilterInput("keyword"));
            wrapper.appendChild(inputsRow);
            mainWrapper.appendChild(wrapper);
            return mainWrapper;
        }
    
        function createDataIndexes(totalWealth, cashFlow, totalExpenses, totalIncome) {
            function createIndex(indexTitle, indexValue, type) {
                const wrapper = document.createElement("div");
                wrapper.classList.add("index-inner", "col-3");
                const index = document.createElement("div");
                index.classList.add("index");
                const indTitle = document.createElement("span");
                indTitle.classList.add("index-title");
                indTitle.textContent = indexTitle;
                const indValue = document.createElement("span");
                indValue.classList.add("index-value");
                indValue.id = type;
                indValue.textContent = indexValue;
                index.appendChild(indTitle);
                index.appendChild(indValue);
                wrapper.appendChild(index);
                return wrapper;
            }
            const mainWrapper = document.createElement("div");
            mainWrapper.classList.add("analytics-subsection");
            const wrapper = document.createElement("div");
            wrapper.classList.add("indexes", "row");
            wrapper.appendChild(createIndex("Total wealth", totalWealth, "total-wealth"));
            wrapper.appendChild(createIndex("Cash flow for the period", "0", "cash-flow"));
            wrapper.appendChild(createIndex("Total expenses for the period", "0", "total-expenses"));
            wrapper.appendChild(createIndex("Total income for the period", "0", "total-income"));
            mainWrapper.appendChild(wrapper);
            return mainWrapper;
        }
    
        function createCharts() {
            function createChart(name, period) {
                const mainWrapper = document.createElement("div");
                mainWrapper.classList.add("chart-inner", "col-6");
                const wrapper = document.createElement("div");
                wrapper.classList.add("chart");
                const chartHeader = document.createElement("div");
                chartHeader.classList.add("chart-top", "row");
                const chartHeading = document.createElement("div");
                chartHeading.classList.add("chart-heading", "col-6");
                const chartName = document.createElement("span");
                chartName.classList.add("chart-name");
                chartName.textContent = name;
                const chartCurrPeriod = document.createElement("span");
                chartCurrPeriod.classList.add("chart-current-period");
                chartCurrPeriod.textContent = period;
                chartHeading.appendChild(chartName);
                chartHeading.appendChild(chartCurrPeriod);
                chartHeader.appendChild(chartHeading);
                wrapper.appendChild(chartHeader);
                mainWrapper.appendChild(wrapper);
                return mainWrapper;
            }
    
            const mainWrapper = document.createElement("div");
            mainWrapper.classList.add("analytics-subsection");
            const wrapper1 = document.createElement("div");
            wrapper1.classList.add("charts", "row");
            wrapper1.appendChild(createChart("The balance of account", "January 01-31"));
            wrapper1.appendChild(createChart("Cash flow", "January 01-31"));
            const wrapper2 = document.createElement("div");
            wrapper2.classList.add("charts", "row");
            wrapper2.appendChild(createChart("Income for the period", "January 01-31"));
            wrapper2.appendChild(createChart("Expenses for the period", "January 01-31"));
            mainWrapper.appendChild(wrapper1);
            mainWrapper.appendChild(wrapper2);
            return mainWrapper;
        }

        function createNoOperationBackg() {
            const wrapper = document.createElement("div");
            wrapper.classList.add("row", "no-operation");
            const noOperationPic = document.createElement("div");
            noOperationPic.classList.add("no-operation-pic");
            const noOperationText = document.createElement("span");
            noOperationText.classList.add("no-operation-text");
            noOperationText.textContent = "No operation found";
            wrapper.appendChild(noOperationPic);
            wrapper.appendChild(noOperationText);
            return wrapper;
        }

        const analyticsWrapper = document.createElement("section");
        analyticsWrapper.classList.add("main-section");
        analyticsWrapper.id = "analytics";
        const analyticsTitle = document.createElement("h2");
        analyticsTitle.classList.add("main-section-title");
        analyticsTitle.textContent = "Analytics";
        analyticsWrapper.appendChild(analyticsTitle);
        analyticsWrapper.appendChild(createAnalyticsDateToggle());
        if(this.isCashFlow) analyticsWrapper.appendChild(createAnalyticsFilters());
        const totalWealth = `${this.totalWealth} ${this.currency}`;
        analyticsWrapper.appendChild(createDataIndexes(totalWealth, this.cashFlow, this.totalExpenses, this.totalIncome));
        if(this.isCashFlow) {
            analyticsWrapper.appendChild(createCharts());
        }
        else {
            analyticsWrapper.appendChild(createNoOperationBackg());
        }
        return analyticsWrapper;
    }

    renderPopup() {
        const popup = document.createElement("div");
        popup.classList.add("popup");
        popup.id = "popup";
        document.querySelector("body").appendChild(popup);

        const popupHeader = document.createElement("div");
        popupHeader.classList.add("popup-header");
        popup.appendChild(popupHeader);

        const closeBtn = document.createElement("button");
        closeBtn.classList.add("close-btn");
        closeBtn.setAttribute("data-close-btn", "");
        closeBtn.textContent = "X";
        popupHeader.appendChild(closeBtn);
        const incomeCatArr = this.walletsItems[this.currentWalletName].incomeCategories;
        const expensesCatArr = this.walletsItems[this.currentWalletName].expensesCategories;
        const popupBody = renderCategoriesSelectModule(incomeCatArr,expensesCatArr, "radio", true);
        popup.appendChild(popupBody);
        
        const overlay = document.createElement("div");
        overlay.id = "overlay";
        document.querySelector("body").appendChild(overlay);
    }

    setHandlers() {
        setModal();







        function setModal() {
            const openModalBtns = document.querySelectorAll('[data-modal-target]');
            const closeModalBtns = document.querySelectorAll('[data-close-btn]');
            const overlay = document.querySelector("#overlay");
            function openModal(modal) {
                if(modal == null) return;
                modal.classList.add("active");
                overlay.classList.add("active");
            }
            function closeModal(modal) {
                if(modal == null) return;
                modal.classList.remove("active");
                overlay.classList.remove("active");
            }
            overlay.addEventListener("click", ()=> {
                const modals = document.querySelectorAll(".popup.active");
                modals.forEach((modal) => {
                    closeModal(modal);
                })
            })
            openModalBtns.forEach((button) => {
                button.addEventListener("click", () => {
                    const modal = document.getElementById(button.dataset.modalTarget);
                    openModal(modal);
                })
            })
            closeModalBtns.forEach((button) => {
                button.addEventListener("click", () => {
                    const modal = button.closest(".popup");
                    closeModal(modal);
                })
            })
        }
    }

    createNewOperationModContent() {
        const incomeCatArr = this.walletsItems[this.currentWalletName].incomeCategories;
        const expensesCatArr = this.walletsItems[this.currentWalletName].expensesCategories;

        this.newOperForm = document.createElement("form");
        this.newOperForm.id = "new-oper-form";
        this.newOperForm.setAttribute("method", "post");

        function fillTab(tab, ind) {
            if(ind === 0) {
                const categoriesList = renderCategoriesSelectPage(incomeCatArr,expensesCatArr, "radio", true);
                tab.appendChild(categoriesList);
            }

            if(ind === 1) {
                const heading = document.createElement("h2");
                heading.classList.add("centered");
                heading.textContent = "Enter the sum of the operation";
                const wrapper = document.createElement("div");
                wrapper.classList.add("input-inner");
                wrapper.classList.add("mt-5");
                const inputWrapper = document.createElement("p");
                inputWrapper.classList.add("centered");
                const input = document.createElement("input");
                input.setAttribute("type", "number");
                input.setAttribute("placeholder", "Operation sum...");
                input.classList.add("new-operation-input");
                input.id = "operationSums";
                inputWrapper.appendChild(input);
                wrapper.appendChild(inputWrapper);
                tab.appendChild(heading);
                tab.appendChild(wrapper);
            }
        }

        function createControlBtns() {
            const wrapper = document.createElement("div");
            wrapper.classList.add("control-block");
            const btnsWrapper = document.createElement("div");
            btnsWrapper.classList.add("move-btn");
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
            wrapper.appendChild(btnsWrapper);
            this.newOperForm.appendChild(wrapper);
        }
        
        for(let i = 0; i < 2; i++) {
            let newTab = document.createElement("div");
            newTab.classList.add("new-oper-tab", "py-2");
            fillTab(newTab, i);
            this.newOperForm.appendChild(newTab);
            this.tabs.push(newTab);
        }
    }
}
