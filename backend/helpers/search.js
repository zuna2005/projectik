const MiniSearch = require('minisearch')

const searchCollections = (collections, query) => {
    let miniSearch = new MiniSearch({
        fields: ["name", "description", 
        "custom_string1_name", "custom_string2_name", "custom_string3_name", 
        "custom_int1_name", "custom_int2_name", "custom_int3_name", 
        "custom_text1_name", "custom_text2_name", "custom_text3_name",
        "custom_checkbox1_name", "custom_checkbox2_name", "custom_checkbox3_name", 
        "custom_date1_name", "custom_date2_name", "custom_date3_name",
        "user_name", "category_name"],
        storeFields: ["name", "user_name", "category_name"]
    })
    miniSearch.addAll(collections)
    return miniSearch.search(query)
}

const searchItems = (items, query) => {
    let miniSearch = new MiniSearch({
        fields: ["name", "user_name", "collection_name", "tags_names",
        "custom_string1_value", "custom_string2_value", "custom_string3_value", 
        "custom_text1_value", "custom_text2_value", "custom_text3_value"],
        storeFields: ["name", "user_name", "collection_name"]
    })
    miniSearch.addAll(items)
    return miniSearch.search(query)
}

const searchTags = (items, query) => {
    let miniSearch = new MiniSearch({
        fields: ["tags_names"],
        storeFields: ["name", "user_name", "collection_name"]
    })
    miniSearch.addAll(items)
    return miniSearch.search(query)
}

module.exports = { searchCollections, searchItems, searchTags }