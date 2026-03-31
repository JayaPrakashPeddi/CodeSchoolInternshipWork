$(document).ready(function () {
  $("#inputBox").on("input", function () {
    let n = $("#inputBox").val();

    if (n === "") {
      $("#outcome").text("");
      return;
    }
    let num = parseInt(n);
    if (isNaN(num)) {
      $("#outcome").text("");
      return;
    }
    $("#outcome").text(test(num));
  });
});

function twoDigits(num) {
  const ones = {
    1: "One",
    2: "Two",
    3: "Three",
    4: "Four",
    5: "Five",
    6: "Six",
    7: "Seven",
    8: "Eight",
    9: "Nine",
  };

  const teens = {
    11: "Eleven",
    12: "Twelve",
    13: "Thirteen",
    14: "Fourteen",
    15: "Fifteen",
    16: "Sixteen",
    17: "Seventeen",
    18: "Eighteen",
    19: "Nineteen",
  };

  const tens = {
    10: "Ten",
    20: "Twenty",
    30: "Thirty",
    40: "Forty",
    50: "Fifty",
    60: "Sixty",
    70: "Seventy",
    80: "Eighty",
    90: "Ninety",
  };

  if (num === 0) {
    return "";
  } else if (num < 10) {
    return ones[num];
  } else if (num > 10 && num < 20) {
    return teens[num];
  } else if (num % 10 === 0) {
    return tens[num];
  } else {
    return tens[num - (num % 10)] + " " + ones[num % 10];
  }
}

const labels = [
  [10000000, " Crores "],
  [100000, " Lakhs "],
  [1000, " Thousand "],
  [100, " Hundred "],
];

function test(n, i = 0, result = "") {
  if (n === 0 && result === "") {
    return "Zero";
  }
  if (n === 0) {
    return (result += "");
  }
  if (n < 100) {
    return (result += twoDigits(n));
  }
  if (String(n).length > 9) {
    return "Must be in crores!!";
  } else if (String(n).length > String(labels[i][0]).length - 1) {
    result += twoDigits(Math.floor(n / labels[i][0])) + labels[i][1];
  }
  return test(n % labels[i][0], (i += 1), result);
}




// function twoDigits(num) {
//   const ones = {
//     1: "One",
//     2: "Two",
//     3: "Three",
//     4: "Four",
//     5: "Five",
//     6: "Six",
//     7: "Seven",
//     8: "Eight",
//     9: "Nine",
//   };

//   const teens = {
//     11: "Eleven",
//     12: "Twelve",
//     13: "Thirteen",
//     14: "Fourteen",
//     15: "Fifteen",
//     16: "Sixteen",
//     17: "Seventeen",
//     18: "Eighteen",
//     19: "Nineteen",
//   };

//   const tens = {
//     10: "Ten",
//     20: "Twenty",
//     30: "Thirty",
//     40: "Forty",
//     50: "Fifty",
//     60: "Sixty",
//     70: "Seventy",
//     80: "Eighty",
//     90: "Ninety",
//   };

//   if (num === 0) {
//     return "";
//   } else if (num < 10) {
//     return ones[num];
//   } else if (num > 10 && num < 20) {
//     return teens[num];
//   } else if (num % 10 === 0) {
//     return tens[num];
//   } else {
//     return tens[num - (num % 10)] + " " + ones[num % 10];
//   }
// }

// const crore = 10000000;
// const lakh = 100000;
// const thousand = 1000;
// const hundred = 100;
// // const labels = [{10000000:" Crores "},{100000:" Lakhs "},{1000:" Thousand "},{100:" Hundred "}]

// function test(n, result = "") {
//   if ((n === 0) && result === "") {
//     return "Zero";
//   }
//   if (n === 0) {
//     return (result += "");
//   }
//   if (n < 100) {
//     return (result += twoDigits(n));
//   }

//   let l = String(n).length;
//   if (l > 9) {
//     return "Must be in crores!!";
//   } else if (l > 7) {
//     result += twoDigits(Math.floor(n / crore)) + " Crores ";
//     return test(n % crore, result);
//   } else if (l > 5) {
//     result += twoDigits(Math.floor(n / lakh)) + " Lakhs ";

//     return test(n % lakh, result);
//   } else if (l > 3) {
//     result += twoDigits(Math.floor(n / thousand)) + " Thousand ";

//     return test(n % thousand, result);
//   } else {
//     result +=
//       twoDigits(Math.floor(n / hundred)) + " Hundred " + twoDigits(n % hundred);
//   }

//   return result;
// }
