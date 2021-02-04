import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PlayersService } from 'src/players/players.service';
import { CreateCategoryDTO } from './dto/create-category.dto';
import { UpdateCategoryDTO } from './dto/update-category.dto';
import { Category } from './interfaces/category.interface';

@Injectable()
export class CategoriesService {
  
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
    private readonly playersService: PlayersService
  ) {}

  async listAll(): Promise<Category[]> {
    return await this.categoryModel.find().populate('players').exec();
  }

  async findById(_id: string): Promise<Category> {
    const category = await this.categoryModel.findById(_id).populate('players').exec();

    if (!category) {
      throw new NotFoundException(`Category with given _id ${_id} was not found!`);
    }

    return category;
  }

  async createCategory(createCategoryDTO: CreateCategoryDTO): Promise<void> {
    const { category } = createCategoryDTO;

    if (await this.findByCategory(category) != null) {
      throw new BadRequestException(`This category is already being used.`)
    }

    const categoryForSaving = new this.categoryModel(createCategoryDTO);

    await categoryForSaving.save();
  }

  async findByCategory(category: string) {
    return await (await this.categoryModel.findOne({ category })).populated('players').exec();
  } 

  async updateCategory(updateCategoryDTO: UpdateCategoryDTO, _id: string): Promise<void> {
    let category: Category = await this.findById(_id);

    if (!category) {
      throw new NotFoundException(`Category with given _id ${_id} was not found!`);
    }

    category = this.updateCategoryInfo(category, updateCategoryDTO);

    await this.categoryModel.findByIdAndUpdate(_id, { $set: category }).exec();
  }

  async deleteCategory(_id: string): Promise<void> {
    const category: Category = await this.categoryModel.findOneAndDelete({ _id });

    if (!category) {
      throw new NotFoundException(`Category with given _id ${_id} was not found!`);
    }
  }

  async bindPlayerToCategory(categoryId: string, playerId: string): Promise<Category> {
    const category = await this.findById(categoryId);
    this.validateCategoryExistence(category, categoryId);

    const player = await this.playersService.findById(playerId);
    this.playersService.validatePlayerExistence(player, playerId);
   
    const isPlayerInCategory = await this.categoryModel.find({ _id: categoryId }).where('players').in([playerId]).exec();

    if (isPlayerInCategory.length > 0) {
      throw new BadRequestException(`Player with given _id ${playerId} already is in Category with given _id ${categoryId}!`);
    }

    category.players.push(player);

    return await this.categoryModel.findOneAndUpdate({ _id: categoryId }, { $set: category }).exec();
  }

  validateCategoryExistence(category: Category | null, id: string) {
    if (!category) {
      throw new NotFoundException(`Category with given id ${id} was not found!`);
    }
  }

  private updateCategoryInfo(categoryForUpdating: Category, updateCategoryDTO: UpdateCategoryDTO): Category {
    const { description, events } = updateCategoryDTO;

    if (description) {
      categoryForUpdating.description = description;
    }

    if (events) {
      categoryForUpdating.events = events;
    }
    

    return categoryForUpdating;
  }
}
