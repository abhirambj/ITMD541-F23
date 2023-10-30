document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("tipForm");
  const billTotal = document.getElementById("billTotal");
  const tip = document.getElementById("tip");
  const tipValue = document.getElementById("tipValue");
  const tipAmount = document.getElementById("tipAmount");
  const totalWithTip = document.getElementById("totalWithTip");

  const summaryTipAmount = document.getElementById("summaryTipAmount");
  const summaryTotalWithTip = document.getElementById("summaryTotalWithTip");

  form.addEventListener("input", function () {
    const bill = parseFloat(billTotal.value);
    const tipPercentage = parseInt(tip.value);
    const calculatedTip = (bill * tipPercentage) / 100;
    const total = bill + calculatedTip;

    if (isNaN(bill)) {
      tipAmount.value = "Invalid Input";
      totalWithTip.value = "Invalid Input";
    } else {
      tipAmount.value = calculatedTip.toFixed(2);
      totalWithTip.value = total.toFixed(2);
    }

    tipValue.textContent = tipPercentage + "%";

    // Update the summary
    summaryTipAmount.textContent = "$" + calculatedTip.toFixed(2);
    summaryTotalWithTip.textContent = "$" + total.toFixed(2);
  });
});
