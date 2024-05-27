const subCategoryService = require('../services/subCategory.service')
const slugify = require('slugify')
const ApiError = require('../utils/errorClass');
const { ConnectionClosedEvent } = require('mongodb');



module.exports.getAllSubCategories = async (req, res, next) => {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 5;
    const skip = (page - 1) * limit;

    const SubCategories = await subCategoryService.getAllSubCategoriesService(limit, skip)
    res.status(200).json({ status: "success", result: SubCategories.length, data: { SubCategories } })

}

module.exports.getSubCategoryById = async (req, res, next) => {
    const subCategoryId = req.params.id
    const subCategory = await subCategoryService.getSubCategoryByIdService(subCategoryId)
    if (!subCategory) {
        next(new ApiError(`there is no subcategory with this id :${subCategoryId}`, 404))
    }
    res.status(200).json({ status: "success", data: { subCategory } })
}


module.exports.createNewSubCategory = async (req, res, next) => {
    const name = req.body.name;
    const subCategoryData = {
        name,
        slug: slugify(name)
    }
    const newSubCategory = await subCategoryService.addNewSubCategoryService(subCategoryData)
    res.status(201).json({ status: "success", data: { newSubCategory } })
}

module.exports.updateSubCategory = async (req, res, next) => {

    const subCategoryId = req.params.id
    const name = req.body.name
    const updatedData = { ...req.body };
    if (name) {
        updatedData.slug = slugify(name, { lower: true, strict: true });
    }
    const updatedSubCategory = await subCategoryService.updateSubCategoryService(subCategoryId, updatedData)
    if (!updatedSubCategory) {
        next(new ApiError(`there is no subcategory with this id :${subCategoryId}`, 404))
    }
    res.status(200).json({ status: "Success", data: { updatedSubCategory } })
}

module.exports.deleteSubCategory = async (req, res, next) => {
    const subCategoryId = req.params.id
    const deletedSubCategory = await subCategoryService.deleteSubCategoryService(subCategoryId)
    if (!deletedSubCategory) {
        next(new ApiError(`there is no subcategory with this id :${subCategoryId}`, 404))
    }

    res.status(200).json({ status: "success", data: null })
}