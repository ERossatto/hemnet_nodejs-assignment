import { ValueObject } from "../ddd-definitions/value-object.ddd";

interface DateRangeProps {
  value: {
    startDate: Date;
    endDate: Date;
  };
}

export class DateRange extends ValueObject<DateRangeProps> {
  constructor(props: DateRangeProps) {
    super(props);
  }

  get value(): DateRangeProps["value"] {
    return this.props.value;
  }

  public static create(props: DateRangeProps): DateRange {
    return new DateRange({
      value: {
        startDate: new Date(props.value.startDate),
        endDate: new Date(props.value.endDate),
      },
    });
  }

  public static createRangeForYear(year: number): DateRange {
    const januaryFirst = new Date(year, 0, 1);
    const decemberThirtyFirst = new Date(year, 11, 31, 23, 59, 59, 999);
    const startDate = new Date(januaryFirst);
    const endDate = new Date(decemberThirtyFirst);

    return DateRange.create({
      value: {
        startDate,
        endDate,
      },
    });
  }

  public contains(date: Date): boolean {
    const dateTime = date.getTime();
    return (
      dateTime >= this.value.startDate.getTime() &&
      dateTime <= this.value.endDate.getTime()
    );
  }

  public isEqual(other: ValueObject<DateRangeProps>): boolean {
    const isSameClass = other instanceof DateRange;
    if (!isSameClass) {
      return false;
    }

    const hasSameValue =
      this.value.startDate.getTime() === other.value.startDate.getTime() &&
      this.value.endDate.getTime() === other.value.endDate.getTime();

    return hasSameValue;
  }

  protected doValidate(): void {
    const { startDate, endDate } = this.props.value;

    const missingStartDate = !startDate;
    if (missingStartDate) {
      throw new Error("Start date is required");
    }

    const missingEndDate = !endDate;
    if (missingEndDate) {
      throw new Error("End date is required");
    }

    const startDateIsAfterEndDate = startDate > endDate;
    if (startDateIsAfterEndDate) {
      throw new Error("Start date cannot be after end date");
    }
  }
}
