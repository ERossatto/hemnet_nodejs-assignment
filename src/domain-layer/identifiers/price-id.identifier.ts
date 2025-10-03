import { Identifier } from "../ddd-definitions/identifier.ddd";

export class PriceId extends Identifier {
  constructor(id: string) {
    super(id);
  }
}
