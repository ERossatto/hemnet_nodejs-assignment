import { Entity } from "./entity.ddd";
import { Identifier } from "./identifier.ddd";

export abstract class AggregateRoot<
  T extends { id: Identifier },
> extends Entity<T> {
  get id(): Identifier {
    return this._id;
  }
}
