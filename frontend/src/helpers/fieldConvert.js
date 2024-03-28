const fieldConvertApptoDb = (appField, index) => {
    let dbField = 'custom_'
    switch (appField) {
        case 'String':
            dbField += 'string'
            break
        case 'Integer':
            dbField += 'int'
            break
        case 'Multiline Text':
            dbField += 'text'
            break
        case 'Boolean Checkbox':
            dbField += 'checkbox'
            break
        case 'Date':
            dbField += 'date'
            break
    }
    dbField += `${index}_`
    return dbField
}

export default fieldConvertApptoDb
