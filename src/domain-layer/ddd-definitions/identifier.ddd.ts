import { generateUUID } from "../helpers/uuid.domain-helper";

export abstract class Identifier {
  protected readonly id: string;

  constructor(id?: string) {
    this.id = id ?? generateUUID();
  }

  get value(): string {
    return this.id;
  }

  public equals(identifier: Identifier): boolean {
    const isSameIdentifierType = identifier instanceof this.constructor;
    if (!isSameIdentifierType) {
      return false;
    }

    const isSameValue = identifier.value === this.value;
    return isSameValue;
  }
}
