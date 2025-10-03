import { randomUUID } from "crypto";

export abstract class Identifier {
  protected readonly _id: string;
  protected readonly __brand: string;

  constructor(id: string) {
    this._id = id;
    this.__brand = this.constructor.name;
  }

  get value(): string {
    return this._id;
  }

  public static create<T extends Identifier>(this: new (id: string) => T): T {
    const id = randomUUID();
    return new this(id);
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
