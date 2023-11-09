import { Router } from "express";
import CartManager from "../../dao/CartManager.js"
const router = Router();

const buildResponse = (data) => {

    const payload = data.products.map(product => product.toJSON())
    // console.log("payload", payload)
    return {
        payload
    }

}
router.get('/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        const result = await CartManager.getById(cid)
        // console.log('result', result);
        // console.log('resultB', result.products.p);
        // console.log('result', result.products);
        // const payload = result.toJSON()
        // buildResponse(result)

        res.render('cart', buildResponse(result))
    } catch (error) {
        console.log('Error', error.message);
    }
    // console.log("result", result);
})

export default router;