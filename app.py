import os
import requests
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

API_KEY = os.getenv("API_KEY")

@app.route("/")
def home():
    return render_template("index.html")

# 🔹 Get all currencies
@app.route("/currencies")
def get_currencies():
    url = f"https://v6.exchangerate-api.com/v6/{API_KEY}/latest/USD"
    response = requests.get(url)
    data = response.json()

    if data["result"] != "success":
        return jsonify({"error": "Failed to load currencies"}), 400

    currencies = list(data["conversion_rates"].keys())
    return jsonify(currencies)

# 🔹 Convert to INR
@app.route("/convert", methods=["POST"])
def convert():
    data = request.json
    amount = data.get("amount")
    from_currency = data.get("from")

    url = f"https://v6.exchangerate-api.com/v6/{API_KEY}/latest/{from_currency}"
    response = requests.get(url)
    result = response.json()

    if result["result"] != "success":
        return jsonify({"error": "API error"}), 400

    rate = result["conversion_rates"]["INR"]
    converted = float(amount) * rate

    return jsonify({
        "converted_amount": round(converted, 2),
        "rate": rate
    })

if __name__ == "__main__":
    app.run(debug=True)