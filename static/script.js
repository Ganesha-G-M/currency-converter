// 🔹 Currency → Flag mapping
const currencyFlags = {
    USD: "🇺🇸",
    INR: "🇮🇳",
    EUR: "🇪🇺",
    GBP: "🇬🇧",
    AUD: "🇦🇺",
    CAD: "🇨🇦",
    JPY: "🇯🇵",
    CNY: "🇨🇳",
    AED: "🇦🇪",
    SGD: "🇸🇬"
};

// 🔹 Load all currencies dynamically
async function loadCurrencies() {
    const res = await fetch("/currencies");
    const data = await res.json();

    const dropdown = document.getElementById("currency");

    data.forEach(currency => {
        const option = document.createElement("option");
        option.value = currency;
        option.textContent = currency;
        dropdown.appendChild(option);
    });

    // Default select USD
    dropdown.value = "USD";
}

// 🔹 Convert currency
async function convert() {
    const amount = document.getElementById("amount").value;
    const currency = document.getElementById("currency").value;

    if (!amount) {
        alert("Enter amount");
        return;
    }

    const response = await fetch("/convert", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            amount: amount,
            from: currency
        })
    });

    const data = await response.json();

    if (data.converted_amount) {
        const flag = currencyFlags[currency] || "";

        document.getElementById("result").innerText =
            `${flag} ${currency} → ₹ ${data.converted_amount} INR`;
    } else {
        document.getElementById("result").innerText = "Error!";
    }
}

// Load currencies on page load
loadCurrencies();