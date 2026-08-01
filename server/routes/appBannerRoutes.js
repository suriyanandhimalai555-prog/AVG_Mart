import express from 'express'
import { getBanners, createBanner, deleteBanner } from '../controllers/appBannerController.js'
import { uploadFiles } from '../middleware/upload.js'

const router = express.Router()

router.get('/', getBanners)
router.post('/', uploadFiles.single('image'), createBanner)
router.delete('/:id', deleteBanner)

export default router