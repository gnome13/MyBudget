var Sumbudget, incomeArray=[],incNumID=0,Totalinc,ExpensesArrayt=[],ExpNumID=0,Totalexp;
var BudgetObj,type;
var DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputButton: '.add__btn',
    incomeContainer: '.income__list',
    expenseContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    expPercentageLabel: '.item__percentage',
    dateLabel: '.budget__title--month'
}; 

//current month + year

var now, year, month, months;
            
now = new Date();
months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];
month = now.getMonth();
year = now.getFullYear();

document.getElementById("budget__title--month").innerHTML=months[month] + ' ' + year;

function AddValue (){
    if (document.getElementById("id_top_desc").value !== "" && !isNaN(document.getElementById("id_top_value").value) && document.getElementById("id_top_value").value > 0) { 
        var  html, newHtml, element;
        BudgetObj = new Object();
        BudgetObj.decs = document.getElementById("id_top_desc").value; 
        BudgetObj.MoneyValue=document.getElementById("id_top_value").value;
        BudgetObj.Percentages=0;

        if (document.getElementById("id_Plus").value=="inc"){
            element = DOMstrings.incomeContainer;
            incomeArray[incNumID]=BudgetObj;
            type="inc";
            BudgetObj.id=type + "-" + incNumID;
            html = '<div class="item clearfix" id="%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            incNumID++;
        }
        else{
            element = DOMstrings.expenseContainer;
            ExpensesArrayt[ExpNumID]= BudgetObj;
            type="exp";
            BudgetObj.id=type + "-" + ExpNumID;
            html = '<div class="item clearfix" id="%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            ExpNumID++;  

        }
        // replace placeholder text with some actual data
        newHtml = html.replace('%id%', BudgetObj.id);
        newHtml = newHtml.replace('%description%', BudgetObj.decs);
        newHtml = newHtml.replace('%value%', formatNumber(BudgetObj.MoneyValue, type));
        
        // insert the HTML into the DOM
        document.querySelector(element).insertAdjacentHTML('beforeend', newHtml); 

        clearFields(); 

        calculateBudget();

        calculatePercentages();

    }       
}
function clearFields(){
    document.getElementById("id_top_desc").value="";
    document.getElementById("id_top_value").value="";
}
function calculateBudget(){
    var totalpercentage;
    Totalinc=0;Totalexp=0;
    for (index = 0; index < incomeArray.length; index++) {
        Totalinc += Number(incomeArray[index].MoneyValue);
    }
    for (index = 0; index < ExpensesArrayt.length; index++) {
        Totalexp += Number(ExpensesArrayt[index].MoneyValue);
    }    
    Sumbudget=Totalinc-Totalexp;
    if (Totalinc>0){
        totalpercentage = Math.round( (Totalexp / Totalinc) * 100 );
    }
    else{
        totalpercentage = -1;
    }

    document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(Sumbudget, type);
    document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(Totalinc, 'inc');
    document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(Totalexp, 'exp');

    if (totalpercentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent = totalpercentage + '%';
    } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = '---';
    }

}
function calculatePercentages(){
    for (index = 0; index < ExpensesArrayt.length; index++) {
        document.querySelectorAll(DOMstrings.expPercentageLabel)[index].textContent  = Math.round(Number(ExpensesArrayt[index].MoneyValue)/Totalinc*100);      
        if (Totalinc>0 && Number(ExpensesArrayt[index].MoneyValue)>0){
            document.querySelectorAll(DOMstrings.expPercentageLabel)[index].textContent  = Math.round(Number(ExpensesArrayt[index].MoneyValue)/Totalinc*100) + '%';      
        }
        else{
            document.querySelectorAll(DOMstrings.expPercentageLabel)[index].textContent  ='---';     
        }
        }

}
// enter
document.addEventListener('keypress', function (event) {

    // use .which to add support for older browsers
    if (event.keyCode === 13 || event.which === 13) {
        AddValue();
    }

});
var nodeListForEach = function(list, callbackFn) {
                
    for (var i = 0; i < list.length; i++) {
        
        // current is the item in the array
        // i is the index
        // in each iteration, the callback function gets called 
        callbackFn(list[i], i);    
        
    }
    
};

document.querySelector(DOMstrings.inputType).addEventListener('change', changedType);
document.querySelector(DOMstrings.container).addEventListener('click', DeleteItem);

function changedType() {
          
    var fields = document.querySelectorAll(
        DOMstrings.inputType + ',' + 
        DOMstrings.inputDescription + ',' + 
        DOMstrings.inputValue);
    //console.log(fields);
    
    nodeListForEach(fields, function(current){
        current.classList.toggle('red-focus');
    });
    
    document.querySelector(DOMstrings.inputButton).classList.toggle('red');
    // document.querySelector(DOMstrings.inputDescription).classList.toggle('red');
    // document.querySelector(DOMstrings.inputValue).classList.toggle('red');
    
}


function DeleteItem(){      

    var itemID, splitID, type, ID;
    
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id; 
    console.log(itemID);
    
    if (itemID) {
        
        // inc-# or exp-#
        // use split - JS converts string to an Object and will return and array
        splitID = itemID.split('-');
        
        type = splitID[0];            
        ID = parseInt(splitID[1]); // use parseInt to convert the string '1' to number 1
    }
    console.log(ExpensesArrayt);
    console.log(incomeArray);

    if(type=="exp"){
        for (index = 0; index < ExpensesArrayt.length; index++) {
            if ( ExpensesArrayt[index].id == itemID) {
                ExpensesArrayt.splice(index, 1); 
                ExpNumID--;
            }            
        }    
    
    }
    else{
        for (index = 0; index < incomeArray.length; index++) {
            if ( incomeArray[index].id == itemID) {
                incomeArray.splice(index, 1); 
                incNumID--;
            }            

        }
    
    }
    
    console.log(ExpensesArrayt);
    console.log(incomeArray);
        

    var el = document.getElementById(itemID); 
            
    el.parentNode.removeChild(el);

    
    calculateBudget();
    
    calculatePercentages();
    
};




var formatNumber = function(num, type) {
    var numSplit, int, dec;
    // + or - before the number
    // exactly 2 decimal points
    // comma separating the thousands

    num = Math.abs(num); // find abs value of the number
    num = num.toFixed(2); // make num exactly 2 decimals
    // this is now a string, so use split
    numSplit = num.split('.');
    // find the integer
    int = numSplit[0];

    if (int.length > 3) {
        int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
    }

    // find the decimal
    dec = numSplit[1];

    return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec; 

};
