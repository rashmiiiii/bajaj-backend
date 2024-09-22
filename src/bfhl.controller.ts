import { Controller, Get, Post, Body, Logger } from '@nestjs/common';
import { BfhlService } from './bfhl.service';
import { BfhlPostDto } from './dto/bfhl-post.dto';

@Controller('bfhl')
export class BfhlController {
  private readonly logger = new Logger(BfhlController.name);

  constructor(private readonly bfhlService: BfhlService) {}

  @Post()
  async postBfhl(@Body() bfhlPostDto: BfhlPostDto) {
    this.logger.log(`Received POST request with data: ${JSON.stringify(bfhlPostDto)}`);
    try {
      const result = await this.bfhlService.processBfhlPost(bfhlPostDto);
      this.logger.log(`Processed POST request successfully: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      this.logger.error(`Error processing POST request: ${error.message}`);
      throw error;
    }
  }

  @Get()
  getBfhl() {
    this.logger.log('Received GET request');
    return this.bfhlService.getBfhlOperationCode();
  }
}