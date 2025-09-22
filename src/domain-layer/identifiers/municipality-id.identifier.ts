import { Identifier } from "../ddd-definitions/identifier.ddd";

export class MunicipalityId extends Identifier {
  protected readonly __brand = "MunicipalityId" as const;

  constructor(id?: string) {
    super(id);
  }
}
