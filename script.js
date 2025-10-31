// Toast notification function
function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = 'toast show' + (isError ? ' error' : '');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Format currency
function formatCurrency(amount) {
    return '₱' + amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Main Page - Form Submission
if (document.getElementById('payrollForm')) {
    document.getElementById('payrollForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const employeeId = document.getElementById('employeeId').value.trim();
        const employeeName = document.getElementById('employeeName').value.trim();
        const employeePosition = document.getElementById('employeePosition').value.trim();
        const rate = parseFloat(document.getElementById('rate').value);
        const daysWorked = parseFloat(document.getElementById('daysWorked').value);
        
        // Validation
        if (!employeeId) {
            showToast('Please enter employee ID', true);
            return;
        }
        
        if (!employeeName) {
            showToast('Please enter employee name', true);
            return;
        }
        
        if (!employeePosition) {
            showToast('Please enter employee position', true);
            return;
        }
        
        if (isNaN(rate) || rate <= 0) {
            showToast('Please enter a valid rate per day', true);
            return;
        }
        
        if (isNaN(daysWorked) || daysWorked <= 0 || daysWorked > 31) {
            showToast('Please enter valid days worked (1-31)', true);
            return;
        }
        
        // Store data in sessionStorage
        const payrollData = {
            employeeId: employeeId,
            employeeName: employeeName,
            employeePosition: employeePosition,
            rate: rate,
            daysWorked: daysWorked
        };
        
        sessionStorage.setItem('payrollData', JSON.stringify(payrollData));
        
        // Redirect to display page
        window.location.href = 'DisplayPage.html';
    });
}

// Display Page - Load and compute data
function loadPayrollData() {
    const storedData = sessionStorage.getItem('payrollData');
    
    if (!storedData) {
        alert('No payroll data found. Redirecting to input page...');
        window.location.href = 'MainPage.html';
        return;
    }
    
    const data = JSON.parse(storedData);
    
    // Display employee information
    document.getElementById('displayEmployeeId').textContent = data.employeeId;
    document.getElementById('displayEmployeeName').textContent = data.employeeName;
    document.getElementById('displayEmployeePosition').textContent = data.employeePosition;
    document.getElementById('displayRate').textContent = formatCurrency(data.rate);
    document.getElementById('displayDaysWorked').textContent = data.daysWorked;
    
    // Compute payroll
    const grossPay = data.rate * data.daysWorked;
    const sss = grossPay * 0.05;
    const pagibig = grossPay * 0.03;
    const philhealth = grossPay * 0.02;
    const tax = grossPay * 0.05;
    const totalDeduction = sss + pagibig + philhealth + tax;
    const netPay = grossPay - totalDeduction;
    
    // Display Gross Pay
    document.getElementById('grossPayFormula').textContent = 
        `Rate × Days = ${formatCurrency(data.rate)} × ${data.daysWorked}`;
    document.getElementById('grossPayAmount').textContent = formatCurrency(grossPay);
    
    // Display Deductions
    document.getElementById('sssFormula').textContent = 
        `${formatCurrency(grossPay)} × 5%`;
    document.getElementById('sssAmount').textContent = formatCurrency(sss);
    
    document.getElementById('pagibigFormula').textContent = 
        `${formatCurrency(grossPay)} × 3%`;
    document.getElementById('pagibigAmount').textContent = formatCurrency(pagibig);
    
    document.getElementById('philhealthFormula').textContent = 
        `${formatCurrency(grossPay)} × 2%`;
    document.getElementById('philhealthAmount').textContent = formatCurrency(philhealth);
    
    document.getElementById('taxFormula').textContent = 
        `${formatCurrency(grossPay)} × 5%`;
    document.getElementById('taxAmount').textContent = formatCurrency(tax);
    
    document.getElementById('totalDeductionAmount').textContent = formatCurrency(totalDeduction);
    
    // Display Net Pay
    document.getElementById('netPayFormula').textContent = 
        `Gross Pay - Total Deductions = ${formatCurrency(grossPay)} - ${formatCurrency(totalDeduction)}`;
    document.getElementById('netPayAmount').textContent = formatCurrency(netPay);
}

// Back button function
function goBack() {
    window.location.href = 'MainPage.html';
}
