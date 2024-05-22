module.exports.priceNewProducts = (product) => {
    const newProducts = product.map(item => {
        item.priceNew = (item.price * (100 - item.discountPercentage) / 100).toFixed(0);

        return item;
    })
    return newProducts;
}

module.exports.priceNewProduct = (product) => {
    const priceNew = (
        (product.price * (100 - product.discountPercentage)) / 100
    ).toFixed(0);

    return priceNew;
}