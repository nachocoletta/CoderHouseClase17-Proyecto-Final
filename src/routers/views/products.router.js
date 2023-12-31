import { Router } from "express";
import productModel from "../../models/product.model.js";
// import { emitFromApi } from '../../socket.js';
import ProductManager from "../../dao/ProductManager.js";
// import { ProductManager } from '../../dao/ProductManager.js';


const router = Router();

const buildResponse = (data, req) => {

    const { category } = req.query

    if (category) {
        return {
            status: "success",
            payload: data.docs.map(product => product.toJSON()),
            totalPages: data.totalPages,
            prevPage: data.prevPage,
            nextPage: data.nextPage,
            page: data.page,
            hasPrevPage: data.hasPrevPage,
            hasNextPage: data.hasNextPage,
            prevLink: data.hasPrevPage ? buildPageLink(req, data.prevPage, data.limit, data.sort, category) : '',
            nextLink: data.hasNextPage ? buildPageLink(req, data.nextPage, data.limit, data.sort, category) : '',
        };
    }
    return {
        status: "success",
        payload: data.docs.map(product => product.toJSON()),
        totalPages: data.totalPages,
        prevPage: data.prevPage,
        nextPage: data.nextPage,
        page: data.page,
        hasPrevPage: data.hasPrevPage,
        hasNextPage: data.hasNextPage,
        prevLink: data.hasPrevPage ? buildPageLink(req, data.prevPage, data.limit, data.sort, undefined) : '',
        nextLink: data.hasNextPage ? buildPageLink(req, data.nextPage, data.limit, data.sort, undefined) : '',
    };
    // const category = data.docs.length > 0 ? data.docs[0].category : undefined;

};

const buildPageLink = (req, page, limit, sort, category) => {
    // console.log("category", category);
    const baseUrl = `http://localhost:${process.env.SERVER_PORT}/products?limit=${limit}&page=${page}`;
    const categoryParam = category ? `&category=${category}` : '';
    const sortParam = sort ? `&sort=${sort}` : '';
    return `${baseUrl}${categoryParam}${sortParam}`;
};
// router.get('/', async (req, res) => {
//     const products = await ProductManager.get()
//     res.status(200).json(products);
// })
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 3, category, code, price, title, sort, stock } = req.query;
        const options = {
            page,
            limit,
            // sort: { price: sort || 'asc' }
        }
        const criteria = {};
        if (sort) {
            options.sort = { price: sort };
        }
        if (category) {
            criteria.category = category;
        }
        if (code) {
            criteria.code = code
        }
        if (price) {
            criteria.price = price
        }
        if (title) {
            criteria.title = title
        }

        if (stock) {
            console.log("stock", stock);
        }
        // if (sort) {
        //     if (sort === 'asc') {
        //         // criteria.sort = 
        //         console.log('ascendente');
        //     }
        //     if (sort === 'desc') {
        //         console.log('descendente');
        //     }
        // }
        // console.log("criteria", criteria)
        // const result = await productModel.paginate(criteria, options)
        const result = await ProductManager.get(criteria, options)

        res.render('products', buildResponse(result, req))

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
    // res.status(200).json(result);
})
// router.get('/', async (req, res) => {
//     let products = await ProductManager.get();
//     console.log("products", products);
//     res.render('productsBis', { products: products.map(p => p.toJSON()) })
// })
export default router;