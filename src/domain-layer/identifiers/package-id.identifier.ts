import { Identifier } from "../ddd-definitions/identifier.ddd";

export class PackageId extends Identifier {
  constructor(id: string) {
    super(id);
  }
}
