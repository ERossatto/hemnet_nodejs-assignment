import { Identifier } from "../ddd-definitions/identifier.ddd";

export class PackageId extends Identifier {
  protected readonly __brand = "PackageId" as const;

  constructor(id?: string) {
    super(id);
  }
}
