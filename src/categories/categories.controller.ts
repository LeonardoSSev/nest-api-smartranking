import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { RequestParameterValidation } from 'src/shared/pipes/RequestParameterValidation.pipe';
import { CategoriesService } from './categories.service';
import { CreateCategoryDTO } from './dto/create-category.dto';
import { UpdateCategoryDTO } from './dto/update-category.dto';
import { Category } from './interfaces/category.interface';

@Controller('api/v1/categories')
export class CategoriesController {

  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async listAll(): Promise<Category[]> {
    return await this.categoriesService.listAll();
  }

  @Get(':_id')
  async findById(@Param('_id', RequestParameterValidation) _id: string): Promise<Category> {
    return await this.categoriesService.findById(_id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createCategory(@Body() createCategoryDTO: CreateCategoryDTO): Promise<void> {
    return await this.categoriesService.createCategory(createCategoryDTO);
  }

  @Put(':_id')
  @UsePipes(ValidationPipe)
  async updateCategory(@Body() updateCategoryDTO: UpdateCategoryDTO, @Param('_id', RequestParameterValidation) _id: string): Promise<void> {
    return await this.categoriesService.updateCategory(updateCategoryDTO, _id);
  }

  @Delete(':_id')
  async deleteCategory(@Param('_id', RequestParameterValidation) _id: string): Promise<void> {
    return await this.categoriesService.deleteCategory(_id);
  }

  @Post(':categoryId/players/:playerId')
  async bindPlayerToCategory(@Param('categoryId', RequestParameterValidation) categoryId: string, @Param('playerId') playerId: string) {
    return await this.categoriesService.bindPlayerToCategory(categoryId, playerId);
  }

}
