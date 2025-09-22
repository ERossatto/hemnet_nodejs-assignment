import { Identifier } from "../ddd-definitions/identifier.ddd";

export class PriceId extends Identifier {
  protected readonly __brand = "PriceId" as const;

  constructor(id?: string) {
    super(id);
  }
}
