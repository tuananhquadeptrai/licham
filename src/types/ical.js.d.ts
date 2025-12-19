declare module 'ical.js' {
  export class Component {
    constructor(jCal: unknown);
    static fromString(str: string): Component;
    getAllSubcomponents(name: string): Component[];
    getFirstProperty(name: string): Property | null;
    getFirstPropertyValue(name: string): unknown;
  }

  export class Property {
    getParameter(name: string): string | null;
    getFirstValue(): unknown;
  }

  export class Time {
    isDate: boolean;
    toJSDate(): Date;
  }

  export function parse(str: string): unknown;
}
