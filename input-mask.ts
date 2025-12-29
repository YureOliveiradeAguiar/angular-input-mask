import { Directive, ElementRef, forwardRef, HostListener, Input } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

/**
 * @class The directive that allows the use of the html attribute `mask=""` and
 * implements the angular control value accessor (CVA).
 *
 * ### Supported tokens
 * | Token | Description |
 * |------|-------------|
 * | `N`  | Numeric character (`0–9`) |
 * | `L`  | Alphabetic character (`A–Z`, `a–z`) |
 * | `A`  | Alphanumeric characters |
 * | `*`  | Any character (N + L) (`A–Z`, `a–z`, `0–9`) |
 *
 * @example
 * ```html
 * <input mask="NNN-LLLL"/>
 * ```
 * - Mask: `NNN-LLLL`
 * - Input: `12a3BcDe`
 * - Output: `123-BcDe`
 *
 * @classdesc The use of the control value accessor is needed here because
 * input.value (DOM) does not equals to control.value (form builder property);
 * the CVA is what gathers the form control element value, CVA here, then,
 * serves this data to the reactive form properly.
 */
@Directive({
  selector: '[mask]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputMask),
      multi: true
    }
  ]
})
export class InputMask implements ControlValueAccessor {

  @Input()
  mask = '';

  /**
   * The mask max length based on its tokens
   */
  private _maxRawLength?: number;

  private readonly maskPatterns: Record<string, RegExp> = {
    'N': /[0-9]/,
    'L': /[a-zA-Z]/,
    'A': /[a-zA-Z0-9]/,
    '*': /./
  };

  /**
   * Gets the real max length of the mask by exclusively counting its mask tokens (N for numbers, L for letters..).
   * @example
   * - Mask: `NNN-LLLL`
   * - _maxRawLength equals 7
   */
  private get maxRawLength(): number {
  if (this._maxRawLength != null) {
    return this._maxRawLength;
  }

  return this._maxRawLength = [...this.mask]
    .filter(c => this.maskPatterns[c])
    .length;
}

  //================CVA Callbacks=================
  private onChange = (_: any) => {};
  private onTouched = () => {};

  constructor(private el: ElementRef<HTMLInputElement>) {}

  writeValue(value: string): void {
    if (value == null) return;
    this.el.nativeElement.value = this.applyMask(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  @HostListener('input')
  onInput(): void {
    const input = this.el.nativeElement;

    const maskedValue = this.applyMask(input.value);
    const rawValue = this.removeMask(input.value);

    // Value emitted to the DOM input
    input.value = maskedValue;
    // Value emitted to the reactive form
    this.onChange(rawValue);
  }

  @HostListener('blur')
  onBlur(): void {
    this.onTouched();
  }
  //===============================================

  /**
   * **Exclusively used internally**
   *
   * The method that actually applies the user-defined mask.
   *
   * It Is used exclusively by the CVA callbacks inside the directive {@link InputMask}.
   * @param value The input value to be masked
   * @returns  The value of the input field altered by the mask
  */
  private applyMask(value: string): string {
    if (!this.mask) return value;

    let result = '';
    let valueIndex = 0;

    for (let maskIndex = 0; maskIndex < this.mask.length; maskIndex++) {
      const maskChar = this.mask[maskIndex];
      const valueChar = value[valueIndex];

      if (!valueChar) break;

      const pattern = this.maskPatterns[maskChar];

      if (pattern) {
        if (pattern.test(valueChar)) {
          result += valueChar;
          valueIndex++;
        } else {
          valueIndex++;
          maskIndex--;
        }
      } else {
        result += maskChar;
        if (valueChar === maskChar) {
          valueIndex++;
        }
      }
    }

    return result;
  }

  /**
   * **Exclusively used internally** by the CVA callback {@link onInput}.
   *
   * In it, its used for serving the form control with the raw value of the input.
   * @example
   * ```(12) 34-abcd becomes 1234abcd```
   *
   * @param value The input value
   * @returns The input value with only letters and numbers
   */
  private removeMask(value: string): string {
    const raw = value.replace(/[^a-zA-Z0-9]/g, ''); // “match any character that's NOT a letter or a digit”, replace them with ''
    return raw.slice(0, this.maxRawLength);
  }
}
