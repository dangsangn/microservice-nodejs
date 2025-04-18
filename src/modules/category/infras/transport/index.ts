import { Request, Response } from 'express';
import { ICategoryUseCase } from '../../interface';
import { Category } from '../../model';
import { CategoryConditionDTOSchema } from '../../model/dto';

export class CategoryHttpService {
  constructor(private readonly categoryService: ICategoryUseCase) {}

  async createCategory(req: Request, res: Response) {
    try {
      const result = await this.categoryService.createCategory(req.body);
      res.status(201).json({ data: result });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  async updateCategory(req: Request, res: Response) {
    try {
      const result = await this.categoryService.updateCategory(req.params.id, req.body);
      res.status(200).json({ data: result });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  async deleteCategory(req: Request, res: Response) {
    try {
      const result = await this.categoryService.deleteCategory(req.params.id);
      res.status(200).json({ data: result });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  async getDetailCategory(req: Request, res: Response) {
    try {
      const result = await this.categoryService.getDetailCategory(req.params.id);
      res.status(200).json({ data: result });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  async listCategory(req: Request, res: Response) {
    const paging = {
      page: 1,
      limit: 200,
    };
    const filter = CategoryConditionDTOSchema.parse(req.query);
    try {
      const result = await this.categoryService.listCategory(req.query, paging);
      const categoryTree = this.buildTree(result);
      res.status(200).json({ data: categoryTree, paging, filter });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  private buildTree(categories: Category[]) {
    const categoryTree: Category[] = [];
    const mapChildren = new Map<string, Category[]>();
    for (let i = 0; i < categories.length; i++) {
      const category: Category = categories[i];

      category.children = mapChildren.get(category.id) || [];
      if (!category.parentId) {
        categoryTree.push(category);
      } else {
        const children = mapChildren.get(category.parentId as string);
        children ? children.push(category) : mapChildren.set(category.parentId as string, [category]);
      }
    }

    return categoryTree;
  }
}
