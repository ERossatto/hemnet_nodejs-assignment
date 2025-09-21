export abstract class ValueObject<T extends { value: unknown }> {
  protected readonly props: T;

  constructor(props: T) {
    this.props = Object.freeze(props); //TODO: consider using deep freeze
    this._validate();
  }

  private _validate(): void {
    this.doValidate();
  }

  public abstract get value(): T["value"];

  protected abstract doValidate(): void | Error;

  public abstract isEqual(vo: ValueObject<T>): boolean;
}
