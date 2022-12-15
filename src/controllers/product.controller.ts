import { Service } from 'typedi';
import {
  Authorized,
  Body,
  CurrentUser,
  Get,
  JsonController,
  OnUndefined,
  Param,
  Post,
  QueryParams,
  Req,
  UploadedFile,
  UseAfter
} from 'routing-controllers';

import { HttpStatusCode } from '../constants/HttpStatusCodes';

import { MulterService } from '../services/multer.service';
import { MulterFile } from '../dto/Multer.dto';
import { emptyUploadsDirectory } from '../utils/emptyDirectory';

import {
  GetFeaturedProductsDTO,
  GetFeaturedProductsFilters,
  GetAvailableFilters,
  GetAvailableFiltersDTO,
  GetManyProductsByIdsDTO,
  GetProductByIdDTO,
  GetProductsDTO,
  GetProductsFilters,
  CreateProductBody,
  CreateProductDTO
} from '../dto/Product.dto';
import { CloudinaryFolder } from '../types/Cloudinary.types';

import { ProductAdapter } from '../adapters/product.adapter';
import { CloudinaryAdapter } from '../adapters/cloudinary.adapter';
import { DeleteImageDTO, UploadImageDTO } from '../dto/Cloudinary.dto';
import { UserJWT, UserRole } from '../types/User.types';

const multerOptions = MulterService.multerUploadOptions();

@JsonController('/products')
@Service({ transient: true })
export class ProductController {
  constructor(
    private readonly _productAdapter: ProductAdapter,
    private readonly _cloudinaryAdapter: CloudinaryAdapter
  ) {}

  @Post('/test')
  async createTestProducts() {
    await this._productAdapter.createTestProducts();
  }

  @Get()
  async getProducts(
    @QueryParams({ validate: { whitelist: true, forbidNonWhitelisted: true } })
    filters: GetProductsFilters,
    @Req() req: any
  ) {
    const userJWT = req.user;
    const dto: GetProductsDTO = { filters, userJWT };

    return this._productAdapter.getProducts(dto);
  }

  @Get('/filters')
  async getAvailableFilters(
    @QueryParams({ validate: { whitelist: true, forbidNonWhitelisted: true } })
    filters: GetAvailableFilters
  ) {
    const dto: GetAvailableFiltersDTO = { filters };
    return this._productAdapter.getAvailableFilters(dto);
  }

  @Get('/many')
  async getManyProductsByIds(
    @QueryParams({ validate: { whitelist: true, forbidNonWhitelisted: true } })
    dto: GetManyProductsByIdsDTO
  ) {
    return this._productAdapter.getManyProductsByIds(dto);
  }

  @Get('/featured')
  async getFeaturedProducts(
    @QueryParams({ validate: { whitelist: true, forbidNonWhitelisted: true } })
    filters: GetFeaturedProductsFilters,
    @Req() req: any
  ) {
    const userJWT = req.user;
    const dto: GetFeaturedProductsDTO = { filters, userJWT };

    return this._productAdapter.getFeaturedProducts(dto);
  }

  @Get('/:productId')
  async getProductById(@Req() req: any, @Param('productId') productId: string) {
    const userJWT = req.user;
    const dto: GetProductByIdDTO = { productId, userJWT };

    return this._productAdapter.getProductById(dto);
  }

  @Authorized([UserRole.ADMIN, UserRole.COFOUNDER, UserRole.OWNER])
  @Post()
  @OnUndefined(HttpStatusCode.CREATED)
  @UseAfter(emptyUploadsDirectory)
  async createProduct(
    @UploadedFile('image', { required: true, options: multerOptions }) file: MulterFile,
    @Body({ validate: { whitelist: true, forbidNonWhitelisted: true } }) body: CreateProductBody,
    @CurrentUser() userJWT: UserJWT
  ) {
    let image: string;
    let imageId: string | null = null;

    try {
      const cloudinaryDTO: UploadImageDTO = {
        filename: file.filename,
        folder: CloudinaryFolder.PRODUCT
      };
      const upload = await this._cloudinaryAdapter.uploadImage(cloudinaryDTO);

      image = upload.url;
      imageId = upload.imageId;

      const dto: CreateProductDTO = { ...body, image, imageId };

      await this._productAdapter.createProduct(dto);
    } catch (error) {
      emptyUploadsDirectory();
      if (imageId) {
        const deleteImageDTO: DeleteImageDTO = { imageId };
        await this._cloudinaryAdapter.deleteImage(deleteImageDTO);
      }

      throw error;
    }
  }
}
