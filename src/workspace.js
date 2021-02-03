import renderCategoriesSelectModule from "./categories-select-mod.js";
export default class Workspace {
    constructor(app) {
        this.mainWrapper = app;
        this.totalWealth = 0;
        this.cashFlow = 0;
        this.totalIncome = 0;
        this.totalExpenses = 0;
        this.init();
    }

    init() {
        this.retrieveDataFromStorage();
        this.renderWorkspace();
        this.setHandlers();
    }

    retrieveDataFromStorage() {
        this.fName = localStorage.getItem("fName");
        this.lName = localStorage.getItem("lName");
        this.userName = this.fName;
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
            this.totalWealth = (+wallet.walletBalance);
            this.currency = wallet.currency;
            this.currentWalletName = this.walletsNames[0];
        });
        if(localStorage.getItem("is-cash-flow")) {
            this.isCashFlow = true;
            if(localStorage.getItem("expensesData")) {
                let expData = JSON.parse(localStorage.getItem("expensesData"));
                for(const[key,value] of Object.entries(expData)) {
    
                    this.totalExpenses += (+value.totalSum);
                    
                }
            }

            if(localStorage.getItem("incomeData")) {
            let incomeData = JSON.parse(localStorage.getItem("incomeData"));
            for(const[key,value] of Object.entries(incomeData)) {
                this.totalIncome += (+value.totalSum);
                console.log(this.totalIncome);
            }

            this.cashFlow = this.totalIncome - this.totalExpenses;
        }
        }
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
        header.appendChild(headerInner);

        const headerLogoWrapper = document.createElement("div");
        headerLogoWrapper.classList.add("header-logo", "col-4");
        headerInner.appendChild(headerLogoWrapper);

        const headerLogo = new Image();
        headerLogo.src = "assets/images/logo.svg";
        headerLogoWrapper.appendChild(headerLogo);

        const viewToggles = document.createElement("div");
        viewToggles.classList.add("view-toggles", "col-4", "d-flex", "justify-content-center");
        const viewTogglesBtn1 = document.createElement("span");
        viewTogglesBtn1.classList.add("view-toggles-btn", "mr-4");
        viewTogglesBtn1.textContent = "Main Panel";
        viewToggles.appendChild(viewTogglesBtn1);
        headerInner.appendChild(viewToggles);

        const headerRight = document.createElement("div");
        headerRight.classList.add("header-right", "col-4");
        headerInner.appendChild(headerRight);

        const headerUserMenu = document.createElement("div");
        headerUserMenu.classList.add("header-user-menu");
        headerRight.appendChild(headerUserMenu);

        const userPic = new Image();
        userPic.classList.add("header-userpic");
        userPic.src = "assets/images/userpic.png";
        headerUserMenu.appendChild(userPic);

        const userName = document.createElement("span");
        userName.textContent = this.userName;
        headerUserMenu.appendChild(userName);
        
        this.buttonDropdown = document.createElement("span");
        this.buttonDropdown.classList.add("header-arrow-btn");
        headerUserMenu.appendChild(this.buttonDropdown);
        
        this.headerDropdown = document.createElement("div");
        this.headerDropdown.classList.add("header-dropdown");
        headerRight.appendChild(this.headerDropdown);

        const headerDropdownList = document.createElement("ul");
        headerDropdownList.classList.add("header-dropdown-list");
        this.headerDropdown.appendChild(headerDropdownList);

        const headerDropdownListItem = document.createElement("li");
        headerDropdownListItem.classList.add("header-dropdown-list-item");
        headerDropdownList.appendChild(headerDropdownListItem);

        const headerDropdownListIcon = document.createElement("img");
        headerDropdownListIcon.src = "assets/images/rubbish.svg"
        headerDropdownListIcon.id = "header-dropdown-icon";
        headerDropdownListItem.appendChild(headerDropdownListIcon);

        const headerDropdownListLink = document.createElement("a");
        headerDropdownListLink.classList.add("header-dropdown-link");
        headerDropdownListLink.id = "delete-wallet";
        headerDropdownListLink.textContent = "Delete wallet";
        headerDropdownListItem.appendChild(headerDropdownListLink);





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
            wrapper.appendChild(createIndex("Cash flow for the period", cashFlow, "cash-flow"));
            wrapper.appendChild(createIndex("Total expenses for the period", totalExpenses, "total-expenses"));
            wrapper.appendChild(createIndex("Total income for the period", totalIncome, "total-income"));
            mainWrapper.appendChild(wrapper);
            return mainWrapper;
        }
        
        
    
        function createCharts() {

            const mainWrapper = document.createElement("div");
            mainWrapper.classList.add("analytics-subsection");

            const row1 = document.createElement("div");
            row1.classList.add("charts-row", "row");
            mainWrapper.appendChild(row1);

            if(localStorage.getItem("is-cash-flow")) {
                const totalWealthChartWrapper = document.createElement("div");
                totalWealthChartWrapper.classList.add("chart-wrapper", "col-6")
                row1.appendChild(totalWealthChartWrapper);
    
                const totalWealthChartHeader = document.createElement("div");
                totalWealthChartHeader.classList.add("chart-header");
                totalWealthChartWrapper.appendChild(totalWealthChartHeader);
    
                const totalWealthChartTitle = document.createElement("h2");
                totalWealthChartTitle.classList.add("chart-title");
                totalWealthChartTitle.textContent = "Total wealth";
                totalWealthChartHeader.appendChild(totalWealthChartTitle);
    
                const totalWealthChart = document.createElement("div");
                totalWealthChart.classList.add("chart-body");
                totalWealthChart.id = "totalwealth-area-chart";
                totalWealthChartWrapper.appendChild(totalWealthChart);
            }

            if(localStorage.getItem("cashFlowByDate")) {
                const cashFlowChartWrapper = document.createElement("div");
                cashFlowChartWrapper.classList.add("chart-wrapper", "col-6")
                row1.appendChild(cashFlowChartWrapper);
    
                const cashFlowChartHeader = document.createElement("div");
                cashFlowChartHeader.classList.add("chart-header");
                cashFlowChartWrapper.appendChild(cashFlowChartHeader);
    
                const cashFlowChartTitle = document.createElement("h2");
                cashFlowChartTitle.classList.add("chart-title");
                cashFlowChartTitle.textContent = "Cash flow";
                cashFlowChartHeader.appendChild(cashFlowChartTitle);
    
                const cashFlowChart = document.createElement("div");
                cashFlowChart.classList.add("chart-body");
                cashFlowChart.id = "cashflow-chart-pie";
                cashFlowChartWrapper.appendChild(cashFlowChart);
            }

            const row2 = document.createElement("div");
            row2.classList.add("charts-row", "row");
            mainWrapper.appendChild(row2);

            if(localStorage.getItem("incomeData")) {
                const incomeChartWrapper = document.createElement("div");
                incomeChartWrapper.classList.add("chart-wrapper", "col-6")
                row2.appendChild(incomeChartWrapper);
    
                const incomeChartHeader = document.createElement("div");
                incomeChartHeader.classList.add("chart-header");
                incomeChartWrapper.appendChild(incomeChartHeader);

                const incomeChartTitle = document.createElement("h2");
                incomeChartTitle.classList.add("chart-title");
                incomeChartTitle.textContent = "Total income";
                incomeChartHeader.appendChild(incomeChartTitle);
    
                const incomeChart = document.createElement("div");
                incomeChart.classList.add("chart-body");
                incomeChart.id = "income-chart-pie";
                incomeChartWrapper.appendChild(incomeChart);
    
                const incomeChartListInner = document.createElement("div");
                incomeChartListInner.classList.add("chart-list-inner");
                incomeChartListInner.appendChild(drawIncomeList());
                incomeChartWrapper.appendChild(incomeChartListInner);
            }

            if(localStorage.getItem("expensesData")) {
                const expensesChartWrapper = document.createElement("div");
                expensesChartWrapper.classList.add("chart-wrapper", "col-6")
                row2.appendChild(expensesChartWrapper);
    
                const expensesChartHeader = document.createElement("div");
                expensesChartHeader.classList.add("chart-header");
                expensesChartWrapper.appendChild(expensesChartHeader);
    
                const expensesChartTitle = document.createElement("h2");
                expensesChartTitle.classList.add("chart-title");
                expensesChartTitle.textContent = "Total expenses";
                expensesChartHeader.appendChild(expensesChartTitle);
    
                const expensesChart = document.createElement("div");
                expensesChart.classList.add("chart-body");
                expensesChart.id = "expenses-chart-pie";
                expensesChartWrapper.appendChild(expensesChart);
    
                const expensesChartListInner = document.createElement("div");
                expensesChartListInner.classList.add("chart-list-inner");
                expensesChartListInner.appendChild(drawExpensesList());
                expensesChartWrapper.appendChild(expensesChartListInner);

            }

            return mainWrapper;
        }
        if(localStorage.getItem("incomeData")) google.charts.setOnLoadCallback(drawIncomeChart);
        if(localStorage.getItem("expensesData")) google.charts.setOnLoadCallback(drawExpensesChart);
        if(localStorage.getItem("cashFlowByDate")) google.charts.setOnLoadCallback(drawCashFlowChart);
        if(localStorage.getItem("cashFlowByDate")) google.charts.setOnLoadCallback(drawTotalWealthChart);
        

        function drawIncomeChart() {
            let data = new google.visualization.DataTable();
            data.addColumn('string', 'Element');
            data.addColumn('number', 'Percentage');
            const incomeData = JSON.parse(localStorage.getItem("incomeData"));
            let arr = [];
            for(const[key, value] of Object.entries(incomeData)) {
                arr.push([key,value.totalSum]);
            }
            data.addRows(arr);
            let options = {
                animation: {
                    duration: 10000,
                    startup: true
                },
            }

            let chart = new google.visualization.PieChart(document.getElementById('income-chart-pie'));
            chart.draw(data, options);
        }

        function drawExpensesChart() {
            let data = new google.visualization.DataTable();
            data.addColumn('string', 'Element');
            data.addColumn('number', 'Percentage');
            const expensesData = JSON.parse(localStorage.getItem("expensesData"));
            let arr = [];
            for(const[key, value] of Object.entries(expensesData)) {
                arr.push([key,value.totalSum]);
            }
            data.addRows(arr);
            let options = {

            }
            let chart = new google.visualization.PieChart(document.getElementById('expenses-chart-pie'));
            chart.draw(data, options);
        }

        function drawCashFlowChart() {
            let date = new Date();
            let currentMonth = date.getMonth();
            let currentYear = date.getFullYear();
            let daysInMonth = new Date(date.getFullYear(), (date.getMonth() + 1), 0).getDate();
            let arr = [];
            const cashFlowByDate = JSON.parse(localStorage.getItem("cashFlowByDate"));

            let data = new google.visualization.DataTable();
            data.addColumn('date', 'Day');
            data.addColumn('number', 'Income');
            data.addColumn('number', 'Expenses');
            for(let i = 1; i <= daysInMonth; i++) {
                let incomeForPeriod = 0;
                let expensesForPeriod = 0;
                const date = `${i}-${currentMonth}-${currentYear}`;
                if(cashFlowByDate[date]) {

                    if(cashFlowByDate[date].income) incomeForPeriod = cashFlowByDate[date].income;
                    if(cashFlowByDate[date].expenses) expensesForPeriod = cashFlowByDate[date].expenses;
                }
                arr.push([new Date(currentYear, currentMonth, i), incomeForPeriod, expensesForPeriod]);
            }


            data.addRows(arr);
            let options = {
                animation: {
                    duration: 800,
                    startup: true
                },
                vAxis: {
                    format: "currency",
                },
                hAxis: {
                    gridlines: {
                        units: {
                            months: {
                                format: ['MMM']
                            }
                        }

                    }
                },
                chartArea:{
                    width:'60%'
                }
            }
            let chart = new google.visualization.ColumnChart(document.getElementById('cashflow-chart-pie'));
            chart.draw(data, options);
        }

        function drawTotalWealthChart() {
            let date = new Date();
            let currentMonth = date.getMonth();
            let currentYear = date.getFullYear();
            let daysInMonth = new Date(date.getFullYear(), (date.getMonth() + 1), 0).getDate();

            let arr = [];

            const cashFlowByDate = JSON.parse(localStorage.getItem("cashFlowByDate"));

            let data = new google.visualization.DataTable();
            data.addColumn('date', 'Day');
            data.addColumn('number', 'Total wealth');
            let totalWealthOnDate;
            for(let i = 1; i <= daysInMonth; i++) {
                
                const date = `${i}-${currentMonth}-${currentYear}`;
                if(cashFlowByDate[date]) {
                    totalWealthOnDate = cashFlowByDate[date].totalWealth;
                    arr.push([new Date(currentYear, currentMonth, i), totalWealthOnDate]);
                }
                if(i === daysInMonth) {
                    arr.push([new Date(currentYear, currentMonth, i), totalWealthOnDate]);
                }
            }
            data.addRows(arr);
            let options = {
                animation: {
                    duration: 800,
                    startup: true
                },
                legend: {
                    position: "none"
                }
            }
            let chart = new google.visualization.AreaChart(document.getElementById('totalwealth-area-chart'));
            chart.draw(data, options);
        }

        function drawIncomeList() {
            let list = document.createElement("ul");
            list.classList.add("chart-list");

            const incomeData = JSON.parse(localStorage.getItem("incomeData"));
            for(const[key,value] of Object.entries(incomeData)) {
                const listItem = document.createElement("li");
                listItem.classList.add("chart-list-item");
                list.appendChild(listItem);

                const listItemTitle = document.createElement("div");
                listItemTitle.classList.add("chart-list-title");
                listItem.appendChild(listItemTitle);

                const listItemIcon = document.createElement("span");
                listItemIcon.classList.add("chart-list-icon");
                const icoUrl = `assets/images/${key}_icon.svg`;
                listItemIcon.style.background = `url(${icoUrl}) royalblue center`;
                listItemTitle.appendChild(listItemIcon);

                const listItemName = document.createElement("span");
                listItemName.classList.add("chart-list-name");
                listItemName.textContent = key;
                listItemTitle.appendChild(listItemName);

                const listAmountCounter = document.createElement("span");
                listAmountCounter.classList.add("chart-list-amount");
                let listAmountWord = value.operationsAmount > 1 ? "transactions" : "transaction";
                listAmountCounter.textContent = `${value.operationsAmount} ${listAmountWord}`;
                listItem.appendChild(listAmountCounter);

                const listSum = document.createElement("span");
                listSum.classList.add("chart-list-sum");
                listSum.textContent = value.totalSum;
                listItem.appendChild(listSum);
            }

            return list;
        }

        function drawExpensesList() {
            let list = document.createElement("ul");
            list.classList.add("chart-list");

            const expensesData = JSON.parse(localStorage.getItem("expensesData"));
            for(const[key,value] of Object.entries(expensesData)) {
                const listItem = document.createElement("li");
                listItem.classList.add("chart-list-item");
                list.appendChild(listItem);

                const listItemTitle = document.createElement("div");
                listItemTitle.classList.add("chart-list-title");
                listItem.appendChild(listItemTitle);

                const listItemIcon = document.createElement("span");
                listItemIcon.classList.add("chart-list-icon");
                const icoUrl = `assets/images/${key}_icon.svg`;
                listItemIcon.style.background = `url(${icoUrl}) royalblue center`;
                listItemTitle.appendChild(listItemIcon);

                const listItemName = document.createElement("span");
                listItemName.classList.add("chart-list-name");
                listItemName.textContent = key;
                listItemTitle.appendChild(listItemName);

                const listAmountCounter = document.createElement("span");
                listAmountCounter.classList.add("chart-list-amount");
                let listAmountWord = value.operationsAmount > 1 ? "transactions" : "transaction";
                listAmountCounter.textContent = `${value.operationsAmount} ${listAmountWord}`;
                listItem.appendChild(listAmountCounter);

                const listSum = document.createElement("span");
                listSum.classList.add("chart-list-sum");
                listSum.textContent = value.totalSum;
                listItem.appendChild(listSum);
            }

            return list;
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
        analyticsTitle.textContent = "Review";
        analyticsWrapper.appendChild(analyticsTitle);
      //  analyticsWrapper.appendChild(createAnalyticsDateToggle());
     //   if(this.isCashFlow) analyticsWrapper.appendChild(createAnalyticsFilters());
        const totalWealth = `${this.totalWealth} ${this.currency}`;
        const cashFlow = `${this.cashFlow} ${this.currency}`;
        const totalExpenses = `${this.totalExpenses} ${this.currency}`;
        const totalIncome = `${this.totalIncome} ${this.currency}`;
        analyticsWrapper.appendChild(createDataIndexes(totalWealth, cashFlow, totalExpenses, totalIncome));
        if(this.isCashFlow) {
            analyticsWrapper.appendChild(createCharts());
        }
        else {
            analyticsWrapper.appendChild(createNoOperationBackg());
        }
        return analyticsWrapper;
    }

    renderPopup(popupId, popupBod) {
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
        const popupBody = this.createNewOperationModContent(incomeCatArr, expensesCatArr, this);
        popup.appendChild(popupBody);

        
        const overlay = document.createElement("div");
        overlay.id = "overlay";
        document.querySelector("body").appendChild(overlay);
    }

    setHandlers() {
        this.buttonDropdown.addEventListener("click", (e) => {
            e.target.classList.toggle("active")
            this.headerDropdown.classList.toggle("active");
        })

        window.addEventListener("click", (e) => {
            if(!e.target.matches(".header-arrow-btn")) {
                document.querySelector(".header-arrow-btn.active").classList.remove("active");
                document.querySelector(".header-dropdown.active").classList.remove("active");
            }
        })

        document.querySelector("#delete-wallet").addEventListener(("click"), () => {
            localStorage.clear();
            localStorage.setItem("fName", this.fName);
            localStorage.setItem("lName", this.lName);
            location.reload();
        })


        setModal();
        setNewOperInputHandlers(this);

        function setNewOperInputHandlers(mainObj) {
            const radioBtns = document.querySelectorAll(".cat-input");
            radioBtns.forEach((element) => {
                element.addEventListener("click", function(e) {
                    mainObj.newOperCategoryName = e.target.value;
                    mainObj.newOperCategoryType = e.target.closest(".col").id;
                })
            });

            const newOperSum = document.querySelector("#operation-sum-input");
            newOperSum.addEventListener("keyup", function(e) {
                mainObj.newOperSum = e.target.value;
            })
        }

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

    writeInChanges() {
        const currentWalletName = this.walletsNames[0];
        const currentWallet = JSON.parse(localStorage.getItem(currentWalletName));
        const operationType = this.newOperCategoryType === "income-cat" ? "plus" : "minus";
        if(operationType === "plus") {
            currentWallet.walletBalance = (+currentWallet.walletBalance) + (+this.newOperSum);
        }
        if(operationType === "minus") {
            currentWallet.walletBalance = (+currentWallet.walletBalance) - (+this.newOperSum);
        }
        this.totalWealth = currentWallet.walletBalance;
        localStorage.setItem(currentWalletName, JSON.stringify(currentWallet));

        const catName = this.newOperCategoryName;
        const sum = this.newOperSum;
        const transactionType = this.newOperCategoryType === "income-cat" ? "income" : "expenses";
        const dataObject = this.newOperCategoryType === "income-cat" ? "incomeData" : "expensesData";

        let operationData;
        if(localStorage.getItem(dataObject)) {
            operationData = JSON.parse(localStorage.getItem(dataObject));
            if(operationData[catName]) {
                operationData[catName].totalSum = (+operationData[catName].totalSum) + (+sum);
                operationData[catName].operationsAmount = ++operationData[catName].operationsAmount;
            } else {
                operationData[catName] = {}
                operationData[catName].totalSum = +sum;
                operationData[catName].operationsAmount = 1;
            }
        } else {
                operationData = {};
                operationData[catName] = {};
                operationData[catName].totalSum = +sum;
                operationData[catName].operationsAmount = 1;
        }
        localStorage.setItem(dataObject, JSON.stringify(operationData));

        const date = new Date();
        const currentDate = `${date.getDay()}-${date.getMonth()}-${date.getFullYear()}`;
        let cashFlow;
        if(localStorage.getItem("cashFlowByDate")) {
            cashFlow = JSON.parse(localStorage.getItem("cashFlowByDate"));
            if(cashFlow[currentDate]) {
                if(cashFlow[currentDate][transactionType]) cashFlow[currentDate][transactionType] += (+sum);
                else cashFlow[currentDate][transactionType] = (+sum);

            } else {
                cashFlow[currentDate] = {};
                cashFlow[currentDate][transactionType] = (+sum);
            }
        } else {
            cashFlow = {};
            cashFlow[currentDate] = {};
            cashFlow[currentDate][transactionType] = (+sum);
        }
        cashFlow[currentDate].stringifiedDate = date.toJSON();
        cashFlow[currentDate].totalWealth = this.totalWealth;
        localStorage.setItem("cashFlowByDate", JSON.stringify(cashFlow));

        this.isCashFlow = true;
        localStorage.setItem("is-cash-flow", true);
    }

    createNewOperationModContent(incomeCatArr, expensesCatArr, mainObj) {
        let prevButton;
        let nextButton;
        let currentTab = 0;
        let selectedCategory;
        let operationSum;
        let tabs = [];

        this.newOperForm = document.createElement("form");
        this.newOperForm.id = "new-oper-form";
        this.newOperForm.classList.add("new-oper-form");
        this.newOperForm.setAttribute("method", "post");

        function fillTab(tab, ind) {
            if(ind === 0) {
                const categoriesList = renderCategoriesSelectModule(incomeCatArr,expensesCatArr, "radio", true);
                categoriesList.id = "categories";
                categoriesList.classList.add("categories-tab");
                tab.appendChild(categoriesList);
                
            }

            if(ind === 1) {
                const wrapper = document.createElement("div");
                wrapper.classList.add("operation-sum-tab");
                wrapper.id = "operation-sum";

                const heading = document.createElement("h2");
                heading.classList.add("centered");
                heading.textContent = "Enter the sum of the operation";
                wrapper.appendChild(heading);

                const inputInner = document.createElement("div");
                inputInner.classList.add("operation-sum-input", "mt-5");
                wrapper.appendChild(inputInner);

                const p = document.createElement("p");
                p.classList.add("centered");
                inputInner.appendChild(p);

                const sumInput = document.createElement("input");
                sumInput.classList.add("sum-input");
                sumInput.id = "operation-sum-input";
                sumInput.setAttribute("type", "number");
                sumInput.setAttribute("placeholder", "Operation sum...");
                p.appendChild(sumInput);

                tab.appendChild(wrapper);
                tab.setAttribute("style", "display: none");
            }
        }

        function createControlBtns(newOperForm) {
            const wrapper = document.createElement("div");
            wrapper.classList.add("control-btns-block");
    
            const btnsWrapper = document.createElement("div");
            btnsWrapper.classList.add("move-btn");
            btnsWrapper.classList.add("text-right");
            wrapper.appendChild(btnsWrapper);
            
            const prevBtn = document.createElement("button");
            prevBtn.id = "prevBtn";
            prevBtn.setAttribute("type", "button");
            prevBtn.textContent = "Previous";
            btnsWrapper.appendChild(prevBtn);
            prevButton = prevBtn;
    
            const nextBtn = document.createElement("button");
            nextBtn.id = "nextBtn";
            nextBtn.setAttribute("type", "button");
            nextBtn.textContent = "Next";
            btnsWrapper.appendChild(nextBtn);
            nextButton = nextBtn;
            newOperForm.appendChild(wrapper);
        }


        function showTab(tabNumber) {
            tabs = document.querySelectorAll(".new-oper-tab");
            tabs[tabNumber].style.display = "block";
            if (tabNumber === 0) {
                prevButton.style.display = "none";
            } else {
                prevButton.style.display = "inline";
            }
            if(tabNumber == (tabs.length-1)) {
                nextButton.innerHTML = "Submit";
            } else {
                nextButton.innerHTML = "Next";
            }
        }

        function makeStep(direction) {
        //    if (direction === "forward" && !this.validateForm()) return false;
            tabs[currentTab].style.display = "none";
            currentTab = (direction === "forward") ? currentTab + 1 : currentTab - 1;
           
            if (currentTab >= tabs.length) {
                const regForm = document.querySelector("#new-oper-form");
                regForm.dispatchEvent(new Event('submit'));
                localStorage.setItem("cashFlow", true);
                console.log("Done");
                showFinalTab();
                mainObj.writeInChanges();
                location.reload();
                return;
            }
            showTab(currentTab);  
        }

        function showFinalTab() {
            const regForm = document.querySelector("#new-oper-form");
            regForm.remove();
            let message = document.createElement("h2");
            message.classList.add("new-oper-success");
            message.textContent = "The transaction has been successfully added!";
            document.querySelector("#popup").appendChild(message);
        }


        function setNewOperFormHandlers() {
            prevButton.addEventListener("click", function() { 
                makeStep("back") 
            });
    
            // Set handler to the button "Forward"
             nextButton.addEventListener("click", function() {
                makeStep("forward");
            });
        }
        
        for(let i = 0; i < 2; i++) {
            let newTab = document.createElement("div");
            newTab.classList.add("new-oper-tab");
            fillTab(newTab, i);
            this.newOperForm.appendChild(newTab);
            tabs.push(newTab);
        }

        createControlBtns(this.newOperForm);
        setNewOperFormHandlers();
        return this.newOperForm;
    }
}
