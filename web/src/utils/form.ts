import { createStore, SetStoreFunction } from 'solid-js/store';

// alias form elements
type FormInputElement = HTMLInputElement | HTMLTextAreaElement;

// alias of plain object
type PlainObject = Record<string, string>;

// alias of validator fn
type Validators = (el: FormInputElement) => string;

// alias of callback fn
type CallbackFormFn = (el: HTMLFormElement) => void;

// validate config
type Config = {
  el: FormInputElement;
  validators: Validators[];
};

const checkValid =
  (
    { el, validators }: Config,
    setErrors: SetStoreFunction<PlainObject>,
    errorClass: string
  ) =>
  () => {
    el.setCustomValidity('');
    el.checkValidity();
    let message = el.validationMessage;
    if (!message) {
      for (const validator of validators) {
        const text = validator(el);
        if (text) {
          el.setCustomValidity(text);
          break;
        }
      }
      message = el.validationMessage;
    }
    if (message) {
      errorClass && el.classList.toggle(errorClass, true);
      setErrors({ [el.name]: message });
    }
  };

export const useForm = ({ errClass }: { errClass: string }) => {
  const [errors, setErrors] = createStore<PlainObject>({});
  const fields = {} as Record<string, Config>;

  const validate = (
    el: FormInputElement,
    accessor: () => Validators[],
    opts?: { onBlur: boolean }
  ) => {
    const options = { onBlur: true, ...opts };
    fields[el.name] = { el, validators: accessor() };

    if (options.onBlur) {
      el.addEventListener(
        'blur',
        checkValid(fields[el.name] as Config, setErrors, errClass)
      );
    }

    el.addEventListener('input', () => {
      if (!errors[el.name]) return;
      setErrors({ [el.name]: undefined });
      errClass && el.classList.toggle(errClass, false);
    });
  };

  const submit = (el: HTMLFormElement, accessor: () => CallbackFormFn) => {
    const callback = accessor();
    el.setAttribute('novalidate', '');
    el.addEventListener('submit', e => {
      e.preventDefault();
      let errored = false;

      for (const k in fields) {
        const field = fields[k] as Config;
        checkValid(field, setErrors, errClass)();
        if (!errored && field.el.validationMessage) {
          field.el.focus();
          errored = true;
        }
      }
      !errored && callback(el);
    });
  };

  return { validate, submit, errors };
};
