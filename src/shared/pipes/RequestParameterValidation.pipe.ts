import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";

export class RequestParameterValidation implements PipeTransform {

  transform(value: any, metadata: ArgumentMetadata) {
    if (!value) {
      throw new BadRequestException(`Value not informed for the ${metadata.data} parameter.`);
    }

    return value;
  }
}