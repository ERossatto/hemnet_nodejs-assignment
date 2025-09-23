import { Identifier } from "./identifier.ddd";

export abstract class Entity<T extends { id: Identifier }> {
  protected readonly _id: Identifier;
  protected readonly props: T;

  constructor(props: T) {
    this._id = props.id;
    this.props = props;
  }

  public abstract get id(): Identifier;

  public equals(object?: Entity<T>): boolean {
    const isNullOrUndefined = object == null || object == undefined;
    if (isNullOrUndefined) {
      return false;
    }

    const isInstanceOfEntity = object instanceof Entity;
    if (!isInstanceOfEntity) {
      return false;
    }

    const isSameType = this.constructor !== object.constructor;
    if (isSameType) {
      return false;
    }

    const isSameId = this._id.equals(object._id);

    return isSameId;
  }
}
