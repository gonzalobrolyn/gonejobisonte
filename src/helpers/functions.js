function ordenaFecha(datoFecha){    
    const fecha = new Date(datoFecha.setSeconds(86400))
    const numMenor = numero => numero<10 ? "0"+numero : numero
    const year = fecha.getFullYear()
    const month = numMenor(fecha.getMonth()+1)
    const day = numMenor(fecha.getDate())
    return `${year}-${month}-${day}`
}

module.exports = ordenaFecha;