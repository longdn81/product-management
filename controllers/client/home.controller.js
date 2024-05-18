const ProductCategory = require("../../models/product-category.model")
const createTreeHelper = require("../../helpers/createTree")

// [GET] /
module.exports.index = async (req, res) => {

    const productCategory = await ProductCategory.find({
        deleted : false ,
    })

    const newProductCategory = createTreeHelper.tree(productCategory);
    res.render("client/pages/home/index" ,{
        pageTitle : "Trang chủ",
        layoutProductCategory: newProductCategory,
    });
}