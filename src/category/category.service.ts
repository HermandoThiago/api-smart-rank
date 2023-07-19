import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);
}
