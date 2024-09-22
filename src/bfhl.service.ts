import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { BfhlPostDto } from './dto/bfhl-post.dto';

@Injectable()
export class BfhlService {
  private readonly logger = new Logger(BfhlService.name);

  async processBfhlPost(bfhlPostDto: BfhlPostDto) {
    this.logger.log(`Processing POST request with data: ${JSON.stringify(bfhlPostDto)}`);

    const { data, file_b64, selected_options } = bfhlPostDto;

    if (!data || !Array.isArray(data)) {
      this.logger.error('Invalid input: data is not an array');
      throw new BadRequestException('Invalid input: data must be an array');
    }

    const numbers = data.filter(item => !isNaN(Number(item)));
    const alphabets = data.filter(item => isNaN(Number(item)));
    const lowercaseAlphabets = alphabets.filter(char => char.toLowerCase() === char);
    const highestLowercaseAlphabet = lowercaseAlphabets.length > 0 ? [lowercaseAlphabets.sort().pop()] : [];

    this.logger.log(`Processed data: numbers=${numbers}, alphabets=${alphabets}, highest=${highestLowercaseAlphabet}`);

    let fileInfo = {
      file_valid: false,
      file_mime_type: null,
      file_size_kb: null,
    };

    if (file_b64) {
      try {
        const buffer = Buffer.from(file_b64, 'base64');
        fileInfo.file_valid = true;
        fileInfo.file_mime_type = this.getMimeType(buffer);
        fileInfo.file_size_kb = (buffer.length / 1024).toFixed(2);
        this.logger.log(`Processed file: ${JSON.stringify(fileInfo)}`);
      } catch (error) {
        this.logger.error(`Error processing file: ${error.message}`);
        throw new BadRequestException('Invalid file data');
      }
    }

    const result: any = {
      is_success: true,
      user_id: 'john_doe_17091999', // Replace with actual user ID logic
      email: 'john@xyz.com', // Replace with actual email logic
      roll_number: 'ABCD123', // Replace with actual roll number logic
      ...fileInfo,
    };

    if (selected_options && selected_options.length > 0) {
      selected_options.forEach(option => {
        switch (option) {
          case 'numbers':
            result.numbers = numbers;
            break;
          case 'alphabets':
            result.alphabets = alphabets;
            break;
          case 'highest_lowercase_alphabet':
            result.highest_lowercase_alphabet = highestLowercaseAlphabet;
            break;
        }
      });
    } else {
      result.numbers = numbers;
      result.alphabets = alphabets;
      result.highest_lowercase_alphabet = highestLowercaseAlphabet;
    }

    this.logger.log(`Returning result: ${JSON.stringify(result)}`);
    return result;
  }

  getBfhlOperationCode() {
    return { operation_code: 1 };
  }
  private getMimeType(buffer: Buffer): string {
    const signatures = {
      '/9j/': 'image/jpeg',
      'iVBORw0KGgo': 'image/png',
      'JVBERi0': 'application/pdf',
      'UEsDBBQABgAIAAAAIQA': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    };

    const bytes = buffer.toString('base64').substring(0, 20);

    for (const [signature, mimeType] of Object.entries(signatures)) {
      if (bytes.startsWith(signature)) {
        return mimeType;
      }
    }

    return 'application/octet-stream';
  }
}