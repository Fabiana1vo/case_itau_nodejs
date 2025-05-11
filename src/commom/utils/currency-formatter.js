exports.integerToDecimal = (value) => {
    const saldoCentavos = Number(value)
    return (saldoCentavos / 100).toFixed(2)
}

exports.convertCurrencyToCents = (value) => {
     return Math.round(Number(value) * 100);
}

 